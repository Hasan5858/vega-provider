import axios from 'axios';
import * as cheerio from 'cheerio';
import { decodeLinkKeys } from '../providers/primewire/blowfish';

const testStreamPattern = async () => {
  console.log('🔍 Testing stream URL patterns...\n');
  
  const movieUrl = 'https://www.primewire.mov/movie/1521964-a-house-of-dynamite';
  const baseUrl = 'https://www.primewire.mov';
  
  const res = await axios.get(movieUrl);
  const $ = cheerio.load(res.data);
  
  // Decrypt keys
  const userData = $('#user-data').attr('v');
  const decodedKeys = decodeLinkKeys(userData || '');
  
  console.log(`Decoded ${decodedKeys.length} keys\n`);
  console.log('First 5 keys:', decodedKeys.slice(0, 5).join(', '));
  
  // Now fetch the redirect page for one key to see what happens
  const testKey = decodedKeys[0]; // SBVs3
  const redirectUrl = `${baseUrl}/links/gos/${testKey}`;
  
  console.log(`\nFetching: ${redirectUrl}\n`);
  
  const redirectRes = await axios.get(redirectUrl);
  const $redirect = cheerio.load(redirectRes.data);
  
  console.log('Redirect page title:', $redirect('title').text());
  console.log('Redirect page body:', $redirect('body').html()?.substring(0, 300));
  
  // Look for the widget
  const widget = $redirect('#go-widget');
  if (widget.length > 0) {
    const widgetKey = widget.attr('key');
    console.log(`Widget key: ${widgetKey}`);
    
    // Check if there's any additional data or scripts
    const scripts = $redirect('script');
    scripts.each((i: number, el: any) => {
      const content = $redirect(el).html();
      if (content && content.includes('go') && i < 3) {
        console.log(`\nScript ${i}:`);
        console.log(content.substring(0, 200));
      }
    });
  }
  
  // Check if there's a direct link in the page
  console.log('\n\nLooking for links in the redirect page...');
  $redirect('a[href]').each((i: number, el: any) => {
    if (i < 5) {
      const href = $redirect(el).attr('href');
      const text = $redirect(el).text();
      console.log(`Link ${i}: ${href} - "${text}"`);
    }
  });
  
  // Maybe the final URL is in the JavaScript? Let's check the app.js
  console.log('\n\nChecking app.js for redirect patterns...');
  const appJsUrl = '/js/app-8b566f31ffe8d69e4b4e70d26210229c.js';
  try {
    const appJsRes = await axios.get(`${baseUrl}${appJsUrl}`);
    const appJs = appJsRes.data.toString();
    
    // Look for patterns with "go" or redirects
    const goPatterns = appJs.match(/(https?:\/\/[^\s"']+go[^\s"']*)/g);
    if (goPatterns) {
      console.log('Found patterns with "go":');
      goPatterns.slice(0, 10).forEach((pattern: string) => {
        console.log(`  ${pattern}`);
      });
    }
    
    // Look for link construction patterns
    const linkPatterns = appJs.match(/window\.location.*href.*=|location\.replace\(|location\.href\s*=/g);
    if (linkPatterns) {
      console.log('Found location patterns:');
      console.log(linkPatterns);
    }
    
  } catch (err: any) {
    console.log('Could not fetch app.js:', err.message);
  }
};

testStreamPattern();
