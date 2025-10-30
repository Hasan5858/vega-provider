import axios from 'axios';
import * as cheerio from 'cheerio';
import { readFileSync } from 'fs';

async function testFebboxUrls() {
  console.log('🔍 Testing Febbox URLs (direct access without Cloudflare worker)\n');
  
  try {
    // Get worker base URL
    const modflixData = JSON.parse(readFileSync('./data/modflix.json', 'utf-8'));
    const baseUrl = modflixData.showbox.url;
    console.log('Worker Base URL:', baseUrl);

    // Step 1: Get a real movie detail page
    console.log('\n=== Step 1: Getting movie detail ===');
    const detailUrl = `${baseUrl}/api?url=/movie/m-killin-jim-kelly-2025`;
    const detailRes = await axios.get(detailUrl, { timeout: 30000 });
    
    if (!detailRes.data.html) {
      console.error('❌ No HTML in detail response');
      return;
    }

    const $ = cheerio.load(detailRes.data.html);
    const febID = $('.heading-name').find('a').attr('href')?.split('/')?.pop();
    console.log('✅ FebID extracted:', febID);

    if (!febID) {
      console.error('❌ Could not extract febID');
      return;
    }

    // Step 2: Get share_link from worker
    console.log('\n=== Step 2: Getting share_link ===');
    const indexPath = `/index/share_link?id=${febID}&type=1`;
    const indexUrl = `${baseUrl}/api?url=${encodeURIComponent(indexPath)}`;
    const indexRes = await axios.get(indexUrl, { timeout: 30000 });
    
    let indexData;
    if (indexRes.data.data) {
      indexData = indexRes.data;
    } else if (indexRes.data.html) {
      try {
        indexData = JSON.parse(indexRes.data.html);
      } catch {
        indexData = indexRes.data;
      }
    } else {
      indexData = indexRes.data;
    }

    const febKey = indexData?.data?.link?.split('/')?.pop();
    console.log('✅ FebKey extracted:', febKey);

    if (!febKey) {
      console.error('❌ Could not extract febKey');
      return;
    }

    // Step 3: Test febbox.com share_list API (used in meta.ts)
    console.log('\n=== Step 3: Testing febbox.com share_list API ===');
    const febboxShareUrl = `https://www.febbox.com/file/file_share_list?share_key=${febKey}&is_html=0`;
    console.log('URL:', febboxShareUrl);
    
    try {
      const febboxRes = await axios.get(febboxShareUrl, { 
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        }
      });
      
      console.log('✅ Status:', febboxRes.status);
      console.log('✅ Response type:', typeof febboxRes.data);
      console.log('   Has data field:', !!febboxRes.data?.data);
      console.log('   Has file_list:', !!febboxRes.data?.data?.file_list);
      
      if (febboxRes.data?.data?.file_list) {
        const files = febboxRes.data.data.file_list;
        console.log('✅ File count:', files.length);
        
        if (files.length > 0) {
          const firstFile = files[0];
          console.log('   First file:', firstFile.file_name);
          console.log('   File ID (fid):', firstFile.fid);
          console.log('   Is directory:', firstFile.is_dir);
          
          // Step 4: Test febbox.vercel.app video-quality API (used in stream.ts)
          if (!firstFile.is_dir && firstFile.fid) {
            console.log('\n=== Step 4: Testing febbox.vercel.app video-quality API ===');
            const streamUrl = `https://febbox.vercel.app/api/video-quality?fid=${firstFile.fid}`;
            console.log('URL:', streamUrl);
            
            try {
              const streamRes = await axios.get(streamUrl, { 
                timeout: 15000,
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                }
              });
              
              console.log('✅ Status:', streamRes.status);
              console.log('✅ Response type:', typeof streamRes.data);
              console.log('   Has html field:', !!streamRes.data?.html);
              
              if (streamRes.data?.html) {
                const html = streamRes.data.html;
                console.log('✅ HTML length:', html.length);
                console.log('   Contains .file_quality:', html.includes('file_quality'));
                
                // Try to parse with cheerio
                const $stream = cheerio.load(html);
                const qualityItems = $stream('.file_quality');
                console.log('✅ Found .file_quality items:', qualityItems.length);
                
                if (qualityItems.length > 0) {
                  console.log('\n   Sample stream options:');
                  qualityItems.slice(0, 3).each((i, el) => {
                    const server = $stream(el).find('p.name').text() + ' - ' + 
                                  $stream(el).find('p.size').text() + ' - ' + 
                                  $stream(el).find('p.speed').text();
                    const link = $stream(el).attr('data-url');
                    console.log(`   ${i + 1}. ${server}`);
                    console.log(`      URL: ${link?.substring(0, 80)}...`);
                  });
                } else {
                  console.log('⚠️  No .file_quality elements found in HTML');
                  console.log('   Checking for alternative structure...');
                  const allLinks = $stream('[data-url]');
                  console.log('   Elements with data-url:', allLinks.length);
                }
              } else {
                console.log('⚠️  Response does not have html field');
                console.log('   Response keys:', Object.keys(streamRes.data));
              }
            } catch (streamErr: any) {
              console.log('❌ Stream URL Error:', streamErr.response?.status || streamErr.code);
              console.log('   Message:', streamErr.message);
              if (streamErr.response?.status === 403 || streamErr.response?.status === 401) {
                console.log('   ⚠️  ACCESS BLOCKED - May need authentication/headers');
              } else if (streamErr.response?.status === 404) {
                console.log('   ⚠️  File not found (might be invalid fid)');
              }
            }
          } else {
            console.log('⚠️  First file is a directory or has no fid, skipping stream test');
          }
        }
      } else {
        console.log('⚠️  No file_list in response');
        console.log('   Response structure:', Object.keys(febboxRes.data || {}));
      }
    } catch (febboxErr: any) {
      console.log('❌ Febbox share_list Error:', febboxErr.response?.status || febboxErr.code);
      console.log('   Message:', febboxErr.message);
      if (febboxErr.response?.status === 403 || febboxErr.response?.status === 401) {
        console.log('   ⚠️  ACCESS BLOCKED - May need authentication/headers or Cloudflare bypass');
      } else if (febboxErr.response?.status === 404) {
        console.log('   ⚠️  Share key not found');
      } else if (febboxErr.response?.data) {
        console.log('   Response data:', febboxErr.response.data);
      }
    }
    
    console.log('\n=== Summary ===');
    console.log('✅ febbox.com URLs: Direct access tested');
    console.log('✅ febbox.vercel.app URLs: Direct access tested');
    
  } catch (err: any) {
    console.error('❌ Test failed:', err.message);
    if (err.response) {
      console.error('   Status:', err.response.status);
      console.error('   Data:', err.response.data);
    }
  }
}

testFebboxUrls();

