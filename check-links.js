const axios = require('axios');
const cheerio = require('cheerio');

async function checkLinks() {
  const url = 'https://howblogs.xyz/7a20d5';
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);
  const links = [];
  
  $('a[href]').each((i, el) => {
    const href = $(el).attr('href');
    if (href && /^https?:\/\//i.test(href)) {
      links.push(href);
    }
  });
  
  console.log('All links on page:\n');
  links.forEach((link, i) => {
    console.log(`${i + 1}. ${link}`);
  });
}

checkLinks();
