const axios = require('axios');

async function testVoeDownload() {
  const testUrl = 'https://voe.sx/e/vtyacxsw3cxu';
  
  try {
    console.log('Step 1: Following redirect from voe.sx...');
    const redirectResponse = await axios.get(testUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      maxRedirects: 5,
    });

    // Check for JavaScript redirect in HTML
    const initialHtml = redirectResponse.data;
    const locationMatch = initialHtml.match(/location\.href\s*=\s*["']([^"']+)["']/);
    const windowLocationMatch = initialHtml.match(/window\.location\s*=\s*["']([^"']+)["']/);
    
    let redirectedUrl = redirectResponse.request.res.responseUrl || testUrl;
    
    if (locationMatch || windowLocationMatch) {
      redirectedUrl = (locationMatch || windowLocationMatch)[1];
      console.log(`✓ Found JS redirect to: ${redirectedUrl}`);
    } else {
      console.log(`✓ Redirected to: ${redirectedUrl}`);
    }

    // Step 2: Construct download URL (remove /e/ path if present)
    const baseUrl = redirectedUrl.replace(/\/e\//, '/').split('?')[0].replace(/\/$/, '');
    const downloadUrl = `${baseUrl}/download`;
    console.log(`\nStep 2: Constructed download URL: ${downloadUrl}`);

    // Step 3: Follow redirect to final download page
    console.log('\nStep 3: Following redirect to download page...');
    const downloadPageResponse = await axios.get(downloadUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': redirectedUrl,
      },
      maxRedirects: 0,
      validateStatus: (status) => status < 400,
    });

    let downloadPageHtml = downloadPageResponse.data;
    
    // Check for another JS redirect to final download page
    const finalLocationMatch = downloadPageHtml.match(/window\.location\.href\s*=\s*["']([^"']+)["']/);
    
    let finalDownloadUrl = downloadPageResponse.request.res.responseUrl || downloadUrl;
    
    if (finalLocationMatch) {
      finalDownloadUrl = finalLocationMatch[1];
      console.log(`✓ Found final JS redirect to: ${finalDownloadUrl}`);
      
      // Fetch the actual final download page
      const finalPageResponse = await axios.get(finalDownloadUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': downloadUrl,
        },
        maxRedirects: 5,
      });
      
      downloadPageHtml = finalPageResponse.data;
      finalDownloadUrl = finalPageResponse.request.res.responseUrl || finalDownloadUrl;
    }

    console.log(`✓ Final download page: ${finalDownloadUrl}`);
    console.log(`✓ Page size: ${downloadPageHtml.length} bytes`);

    // Step 4: Extract download link
    console.log('\nStep 4: Searching for download links...');
    
    const patterns = [
      { name: 'CDN pattern (edgeon/cdn)', regex: /href=["']([^"']*(?:edgeon-bandwidth|cdn)[^"']*\.mp4[^"']*)[^"']*["']/i },
      { name: 'Quality + MP4/MKV', regex: /<a[^>]*href=["'](https?:\/\/[^"']+\.(?:mp4|mkv)(?:\?[^"']*)?)[^"']*["'][^>]*>[\s\S]*?Quality\s+(\d+)p[\s\S]*?<\/a>/i },
      { name: 'Quality + Direct Download', regex: /<a[^>]*href=["']([^"']+)["'][^>]*>[\s\S]*?Quality[\s\S]*?Direct\s+Download\s+Link[\s\S]*?<\/a>/i },
      { name: 'Download attribute', regex: /<a[^>]*href=["']([^"']+)["'][^>]*download[^>]*>/i },
    ];

    for (const { name, regex } of patterns) {
      const match = downloadPageHtml.match(regex);
      if (match && match[1]) {
        // Decode HTML entities
        let videoUrl = match[1].replace(/&amp;/g, '&');
        
        // Skip non-video URLs
        if (!videoUrl.includes('://') || (!videoUrl.includes('.mp4') && !videoUrl.includes('.mkv'))) {
          console.log(`  Skipping ${name}: not a video URL - ${videoUrl.substring(0, 50)}...`);
          continue;
        }
        
        console.log(`\n✓ Found using ${name}:`);
        console.log(`  Decoded URL: ${videoUrl}`);
        if (match[2]) {
          console.log(`  Quality: ${match[2]}p`);
        }
        
        // Make sure URL is absolute
        if (videoUrl.startsWith('/')) {
          const urlObj = new URL(finalDownloadUrl);
          videoUrl = `${urlObj.protocol}//${urlObj.host}${videoUrl}`;
          console.log(`  Absolute URL: ${videoUrl}`);
        }
        
        console.log(`\n✅ SUCCESS! Direct download link extracted.`);
        return;
      }
    }

    console.log('\n✗ No download link found');
    console.log('\nSearching for any links with video extensions...');
    const videoLinks = downloadPageHtml.match(/https?:\/\/[^"'\s]+\.(mp4|mkv|avi|mov)/gi);
    if (videoLinks) {
      console.log('Found video links:');
      videoLinks.forEach(link => console.log(`  - ${link}`));
    } else {
      console.log('No video links found.');
      console.log('\nShowing first 1000 chars of HTML:');
      console.log(downloadPageHtml.substring(0, 1000));
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testVoeDownload();
