const fs = require('fs');
const html = fs.readFileSync('voe-full-player.html', 'utf8');

console.log('🔍 Searching for download links and MP4 URLs...\n');

// Look for download link patterns
const downloadPattern = /<a[^>]*download[^>]*href=["']([^"']+)["'][^>]*>/gi;
const downloadMatches = [...html.matchAll(downloadPattern)];
console.log('Download button links:', downloadMatches.length);
downloadMatches.forEach(m => console.log('  -', m[1]));

// Look for any MP4 URLs
const mp4Pattern = /https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi;
const mp4Matches = [...html.matchAll(mp4Pattern)];
console.log('\nDirect MP4 URLs:', mp4Matches.length);
mp4Matches.forEach(m => console.log('  -', m[0]));

// Look for href with download
const hrefDownload = /href=["']([^"']+)["'][^>]*download/gi;
const hrefMatches = [...html.matchAll(hrefDownload)];
console.log('\nLinks with download attribute:', hrefMatches.length);
hrefMatches.forEach(m => console.log('  -', m[1]));

// Look for button or link containing "download"
const buttonPattern = /<(button|a)[^>]*>[\s\S]*?download[\s\S]*?<\/(button|a)>/gi;
const buttonMatches = [...html.matchAll(buttonPattern)];
console.log('\nButtons/Links with "download" text:', buttonMatches.length);
buttonMatches.slice(0, 3).forEach(m => console.log('  -', m[0].substring(0, 200)));

// Check for any CDN URLs
const cdnPattern = /https?:\/\/[^"'\s]*cdn[^"'\s]*[^"'\s]+/gi;
const cdnMatches = [...html.matchAll(cdnPattern)];
console.log('\nCDN URLs:', cdnMatches.length);
cdnMatches.slice(0, 5).forEach(m => console.log('  -', m[0]));

// Look for edgeon-bandwidth URLs
const edgeonPattern = /https?:\/\/[^"'\s]*edgeon[^"'\s]+/gi;
const edgeonMatches = [...html.matchAll(edgeonPattern)];
console.log('\nEdgeon URLs:', edgeonMatches.length);
edgeonMatches.forEach(m => console.log('  -', m[0]));

// Look for any video-related API endpoints
const apiPattern = /\/api\/[^"'\s]+/gi;
const apiMatches = [...html.matchAll(apiPattern)];
console.log('\nAPI endpoints:', apiMatches.length);
apiMatches.forEach(m => console.log('  -', m[0]));
