const axios = require('axios');
const cheerio = require('cheerio');

async function debugQualityParsing() {
  try {
    console.log('Debugging quality parsing...');
    
    const url = 'https://filmyfly.observer/page-download/5852/Baaghi-4-2025-Bollywood-Hindi-Movie-HD-ESub.html';
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    
    const res = await axios.get(url, { headers });
    const data = res.data;
    const $ = cheerio.load(data);
    
    const downloadLink = $(".dlbtn a").attr("href");
    const downloadText = $(".dlbtn a").text().trim();
    
    console.log('Download link:', downloadLink);
    console.log('Download text:', JSON.stringify(downloadText));
    console.log('Download text length:', downloadText.length);
    
    // Test the regex
    const qualityMatch = downloadText.match(/(\d+p|4k|2160p)/gi);
    console.log('Quality match result:', qualityMatch);
    
    // Test individual patterns
    console.log('Contains 480p:', downloadText.includes('480p'));
    console.log('Contains 720p:', downloadText.includes('720p'));
    console.log('Contains 1080p:', downloadText.includes('1080p'));
    console.log('Contains 2160p:', downloadText.includes('2160p'));
    console.log('Contains 4k:', downloadText.includes('4k'));
    
    // Try different regex patterns
    const patterns = [
      /(\d+p|4k|2160p)/gi,
      /(\d+p)/gi,
      /(480p|720p|1080p|2160p|4k)/gi,
      /(\d+[pP])/g,
      /(4[kK])/g
    ];
    
    patterns.forEach((pattern, index) => {
      const matches = downloadText.match(pattern);
      console.log(`Pattern ${index + 1}:`, pattern.toString(), '->', matches);
    });
    
  } catch (error) {
    console.error('Error debugging quality parsing:', error);
  }
}

debugQualityParsing();
