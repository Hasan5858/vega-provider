import { filepresExtractor } from '../providers/filepresExtractor';

async function run() {
  const url = 'https://new5.filepress.today/file/68f7646891588e5d6557b41b';
  const controller = new AbortController();
  try {
    console.log('Testing FilePres extractor for:', url);
    const streams = await filepresExtractor(url, controller.signal);
    console.log('Extractor returned:', JSON.stringify(streams, null, 2));
    console.log('Total streams:', streams.length);
  } catch (err) {
    console.error('Test failed:', err instanceof Error ? err.message : err);
  }
}

run();
