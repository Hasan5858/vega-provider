const axios = require('axios');
const cheerio = require('cheerio');

async function testAllServers() {
  try {
    // Test linkmake URL
    const linkmakeUrl = 'https://linkmake.in/view/1nbv4JbVt6';
    console.log('🔍 Testing linkmake URL:', linkmakeUrl);
    console.log('');
    
    // Fetch linkmake page
    const linkmakeRes = await axios.get(linkmakeUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    });
    
    const $ = cheerio.load(linkmakeRes.data);
    const qualityLinks = $("a[href]:contains('Download')").toArray();
    
    console.log(`📦 Found ${qualityLinks.length} quality options`);
    console.log('');
    
    // Test first quality (480p)
    const firstQuality = $(qualityLinks[0]);
    const qualityTitle = firstQuality.text().trim();
    const filesdlUrl = firstQuality.attr('href');
    
    console.log(`✅ Testing quality: ${qualityTitle}`);
    console.log(`   URL: ${filesdlUrl}`);
    console.log('');
    
    // Fetch filesdl page
    const filesdlRes = await axios.get(filesdlUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://linkmake.in/'
      }
    });
    
    const filesdl$ = cheerio.load(filesdlRes.data);
    const serverLinks = filesdl$('a[href]').toArray();
    
    console.log(`📊 Found ${serverLinks.length} server options for this quality`);
    console.log('');
    
    const serverTypes = {
      fastCloud: [],
      directDownload: [],
      ultraFastDL: [],
      gofile: [],
      gdflix: [],
      direct: [],
      other: []
    };
    
    // Categorize servers
    for (const link of serverLinks) {
      const title = filesdl$(link).text().trim();
      const href = filesdl$(link).attr('href');
      
      if (!href || !title) continue;
      
      // Skip unwanted
      if (title.includes('Watch') || title.includes('Telegram') || title.includes('Privacy') || title.includes('DMCA')) {
        continue;
      }
      
      console.log(`\n🔗 Server: "${title}"`);
      console.log(`   URL: ${href}`);
      
      if (title.includes('Fast Cloud') && !title.includes('02')) {
        serverTypes.fastCloud.push({ title, href });
        console.log(`   ✅ TYPE: Direct Link (Fast Cloud)`);
      } else if (title.includes('Direct Download')) {
        serverTypes.directDownload.push({ title, href });
        console.log(`   ✅ TYPE: Direct Link (Direct Download)`);
      } else if (title.includes('Ultra FastDL')) {
        serverTypes.ultraFastDL.push({ title, href });
        console.log(`   ✅ TYPE: Direct Link (Ultra FastDL)`);
      } else if (title.includes('Fast Cloud-02')) {
        serverTypes.directDownload.push({ title, href });
        console.log(`   ✅ TYPE: Direct Link (Fast Cloud-02)`);
      } else if (title.includes('GoFile')) {
        serverTypes.gofile.push({ title, href });
        console.log(`   🔧 TYPE: Needs GoFile Extractor`);
        console.log(`       GoFile ID would be: ${href.split('/d/')[1]?.split('?')[0]}`);
      } else if (title.includes('GDFLIX')) {
        serverTypes.gdflix.push({ title, href });
        console.log(`   🔧 TYPE: Needs GDFLIX Extractor`);
      } else if (href.includes('.mkv') || href.includes('.mp4') || href.includes('.m3u8')) {
        serverTypes.direct.push({ title, href });
        console.log(`   ✅ TYPE: Direct Video Link`);
      } else {
        serverTypes.other.push({ title, href });
        console.log(`   ❓ TYPE: Unknown - needs further inspection`);
      }
    }
    
    // Summary
    console.log('\n\n' + '='.repeat(80));
    console.log('📋 SUMMARY - Server Types for Quality: ' + qualityTitle);
    console.log('='.repeat(80));
    
    console.log(`\n✅ DIRECT PLAYABLE (No extractor needed):`);
    const directCount = serverTypes.fastCloud.length + serverTypes.directDownload.length + serverTypes.ultraFastDL.length + serverTypes.direct.length;
    console.log(`   Total: ${directCount}`);
    if (serverTypes.fastCloud.length) {
      console.log(`   - Fast Cloud: ${serverTypes.fastCloud.length}`);
      serverTypes.fastCloud.forEach(s => console.log(`     • ${s.title}`));
    }
    if (serverTypes.directDownload.length) {
      console.log(`   - Direct Download: ${serverTypes.directDownload.length}`);
      serverTypes.directDownload.forEach(s => console.log(`     • ${s.title}`));
    }
    if (serverTypes.ultraFastDL.length) {
      console.log(`   - Ultra FastDL: ${serverTypes.ultraFastDL.length}`);
      serverTypes.ultraFastDL.forEach(s => console.log(`     • ${s.title}`));
    }
    if (serverTypes.direct.length) {
      console.log(`   - Direct Video: ${serverTypes.direct.length}`);
      serverTypes.direct.forEach(s => console.log(`     • ${s.title}`));
    }
    
    console.log(`\n🔧 NEEDS EXTRACTOR:`);
    if (serverTypes.gofile.length) {
      console.log(`   - GoFile: ${serverTypes.gofile.length}`);
      serverTypes.gofile.forEach(s => console.log(`     • ${s.title}`));
    }
    if (serverTypes.gdflix.length) {
      console.log(`   - GDFLIX: ${serverTypes.gdflix.length}`);
      serverTypes.gdflix.forEach(s => console.log(`     • ${s.title}`));
    }
    
    if (serverTypes.other.length) {
      console.log(`\n❓ UNKNOWN/SKIP:`);
      console.log(`   Total: ${serverTypes.other.length}`);
      serverTypes.other.forEach(s => console.log(`     • ${s.title}`));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAllServers();
