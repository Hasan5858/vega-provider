const { gofileExtracter } = require('./dist/gofileExtracter.js');

async function testGoFile() {
  console.log('Testing GoFile Extractor');
  console.log('='.repeat(80));
  
  // ID from the debug output
  const gofileId = 'N5mZku';
  
  console.log('GoFile ID:', gofileId);
  console.log('GoFile URL: https://gofile.io/d/' + gofileId);
  
  try {
    const result = await gofileExtracter(gofileId);
    
    console.log('\n✅ Extraction successful!');
    console.log('Link:', result.link);
    console.log('Token:', result.token ? result.token.substring(0, 50) + '...' : 'None');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testGoFile();
