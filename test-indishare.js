const { indishareExtractor } = require('./providers/indishareExtractor');

const testUrl = 'https://dl6.indishare.info/rej4u838hxcl';

console.log('Testing Indishare extractor with:', testUrl);
console.log('='.repeat(60));

indishareExtractor(testUrl)
  .then(result => {
    console.log('='.repeat(60));
    console.log('Result:', result);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
