const fs = require('fs');

const html = fs.readFileSync('voe-full-player.html', 'utf8');

// 1. Find var source= declaration
console.log('\n🔍 Step 1: Looking for "var source=" declaration...');
const sourceMatch = html.match(/var\s+source\s*=\s*['"]([^'"]+)['"]/);
if (sourceMatch) {
  console.log('Found:', sourceMatch[1]);
}

// 2. Find JSON array
console.log('\n🔍 Step 2: Extracting encrypted JSON array...');
const jsonMatch = html.match(/<script type="application\/json">\[([^\]]+)\]<\/script>/);
if (jsonMatch) {
  const encryptedData = '[' + jsonMatch[1] + ']';
  console.log('Encrypted JSON length:', encryptedData.length);
  console.log('First 200 chars:', encryptedData.substring(0, 200));
  
  // Try to parse it
  try {
    const arr = JSON.parse(encryptedData);
    console.log('\n✓ JSON parsed successfully!');
    console.log('Array length:', arr.length);
    console.log('Sample data:', arr.slice(0, 5));
  } catch (e) {
    console.log('✗ JSON parse failed:', e.message);
  }
}

// 3. Find any JW Player setup
console.log('\n🔍 Step 3: Looking for JW Player setup...');
const jwMatches = [...html.matchAll(/jwplayer.*?setup/g)];
console.log('Found', jwMatches.length, 'JW Player setup references');

// 4. Look for decrypt/decode functions
console.log('\n🔍 Step 4: Looking for decode/decrypt patterns...');
const patterns = [
  /function\s+(\w+)\s*\([^)]*\)\s*\{[^}]*split[^}]*join/g,
  /\w+\.replace\([^)]+\)/g,
  /atob\(/g,
  /String\.fromCharCode/g
];

patterns.forEach((pattern, i) => {
  const matches = [...html.matchAll(pattern)];
  if (matches.length > 0) {
    console.log(`Pattern ${i+1}: Found ${matches.length} matches`);
    matches.slice(0, 3).forEach(m => console.log('  -', m[0].substring(0, 80)));
  }
});

// 5. Extract small inline scripts
console.log('\n🔍 Step 5: Small inline scripts (< 500 chars):');
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
scripts.forEach((match, i) => {
  const content = match[1].trim();
  if (content && content.length > 10 && content.length < 500 && 
      !content.startsWith('!function') && !content.startsWith('(function')) {
    console.log(`\n--- Script ${i+1} (${content.length} chars) ---`);
    console.log(content);
  }
});
