const axios = require('axios');

// Simulate React Native axios behavior (no request.res.responseUrl)
async function voeExtractor(url) {
  try {
    console.log(`VOE: Starting extraction from ${url}`);
    
    // Step 1: Follow redirect from voe.sx/e/{id} to lukesitturn.com/e/{id}
    const redirectResponse = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': url,
      },
      maxRedirects: 5,
    });

    // Check for JavaScript redirect in HTML
    let initialHtml = redirectResponse.data;
    const locationMatch = initialHtml.match(/location\.href\s*=\s*["']([^"']+)["']/);
    const windowLocationMatch = initialHtml.match(/window\.location\s*=\s*["']([^"']+)["']/);
    
    let redirectedUrl = url; // Default to original URL
    
    if (locationMatch || windowLocationMatch) {
      redirectedUrl = (locationMatch || windowLocationMatch)[1];
      console.log(`✓ VOE: Found JS redirect to ${redirectedUrl}`);
    } else {
      console.log(`✓ VOE: No JS redirect found, using original URL`);
    }

    // Step 2: Construct download URL (remove /e/ if present)
    const baseUrl = redirectedUrl.replace(/\/e\//, '/').split('?')[0].replace(/\/$/, '');
    const downloadUrl = `${baseUrl}/download`;
    console.log(`✓ VOE: Constructed download URL: ${downloadUrl}`);

    // Step 3: Follow redirect to intermediate download page
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
    
    let finalDownloadUrl = downloadUrl; // Default to download URL
    
    if (finalLocationMatch) {
      finalDownloadUrl = finalLocationMatch[1];
      console.log(`✓ VOE: Found final JS redirect to ${finalDownloadUrl}`);
      
      // Fetch the actual final download page
      const finalPageResponse = await axios.get(finalDownloadUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': downloadUrl,
        },
        maxRedirects: 5,
      });
      
      downloadPageHtml = finalPageResponse.data;
      finalDownloadUrl = finalLocationMatch[1]; // Use the matched URL
    }

    console.log(`✓ VOE: Final download page: ${finalDownloadUrl}`);

    // Step 4: Extract download link
    const patterns = [
      /href=["']([^"']*(?:edgeon-bandwidth|cdn)[^"']*\.mp4[^"']*)[^"']*["']/i,
      /<a[^>]*href=["'](https?:\/\/[^"']+\.(?:mp4|mkv)(?:\?[^"']*)?)[^"']*["'][^>]*>[\s\S]*?Quality\s+(\d+)p[\s\S]*?<\/a>/i,
      /<a[^>]*href=["']([^"']+)["'][^>]*>[\s\S]*?Quality[\s\S]*?Direct\s+Download\s+Link[\s\S]*?<\/a>/i,
      /<a[^>]*href=["']([^"']+)["'][^>]*download[^>]*>/i,
    ];

    for (const pattern of patterns) {
      const match = downloadPageHtml.match(pattern);
      if (match && match[1]) {
        let videoUrl = match[1];
        
        // Decode HTML entities
        videoUrl = videoUrl.replace(/&amp;/g, '&');
        
        // Skip non-video URLs
        if (!videoUrl.includes('://') || (!videoUrl.includes('.mp4') && !videoUrl.includes('.mkv'))) {
          continue;
        }
        
        const quality = match[2] || '720';

        if (videoUrl.startsWith('/')) {
          const urlObj = new URL(finalDownloadUrl);
          videoUrl = `${urlObj.protocol}//${urlObj.host}${videoUrl}`;
        }

        console.log(`\n✅ SUCCESS! VOE: Found download link`);
        console.log(`Quality: ${quality}p`);
        console.log(`URL: ${videoUrl.substring(0, 100)}...`);
        
        return [{
          server: 'VOE',
          quality: quality,
          link: videoUrl,
          type: 'mkv',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': finalDownloadUrl,
          },
        }];
      }
    }

    console.log('❌ VOE: No download link found');
    return [];
  } catch (error) {
    console.error(`❌ VOE: Extraction failed - ${error.message}`);
    return [];
  }
}

// Test with the URL from logs
voeExtractor('https://voe.sx/e/vtyacxsw3cxu').then(result => {
  console.log('\n='.repeat(60));
  if (result.length > 0) {
    console.log('✅ VOE Extractor Test: PASSED');
    console.log('Result:', result[0]);
  } else {
    console.log('❌ VOE Extractor Test: FAILED - No streams returned');
  }
});
