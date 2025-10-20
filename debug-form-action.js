const axios = require('axios');
const cheerio = require('cheerio');

async function debugFormAction() {
  console.log('🔍 Debugging Form Action');
  console.log('=' .repeat(50));

  try {
    const testLink = 'https://links.kmhd.net/file/Liar_fe8eb354';
    
    // Get initial response
    const initialResponse = await axios.get(testLink, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://katmoviehd.observer/'
      }
    });
    
    console.log(`Initial status: ${initialResponse.status}`);
    console.log(`Initial redirect: ${initialResponse.request.res.responseUrl}`);
    
    // Parse the form
    const $locked = cheerio.load(initialResponse.data);
    const form = $locked('form');
    const action = form.attr('action');
    
    console.log(`Form action: "${action}"`);
    
    // Check if action starts with /
    if (action && action.startsWith('/')) {
      const unlockUrl = `https://links.kmhd.net${action}`;
      console.log(`Constructed unlock URL: ${unlockUrl}`);
    } else if (action && action.startsWith('?')) {
      // Fix malformed action that starts with ?
      const fixedAction = action.replace('?', '/');
      const unlockUrl = `https://links.kmhd.net${fixedAction}`;
      console.log(`Fixed action: "${fixedAction}"`);
      console.log(`Constructed unlock URL: ${unlockUrl}`);
    } else {
      console.log(`Unknown action format: "${action}"`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugFormAction();
