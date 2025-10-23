import { fastdlExtractor } from '../providers/fastdlExtractor';

async function run() {
  const url = 'https://fastdl.zip/embed?download=bLfsEUymf3Nt7b2Dj3ByFseUk';
  const controller = new AbortController();
  try {
    console.log('Testing FastDL extractor for:', url);
    const streams = await fastdlExtractor(url, controller.signal);
    console.log('Extractor returned:', JSON.stringify(streams, null, 2));
  } catch (err) {
    console.error('Test failed:', err instanceof Error ? err.message : err);
  }
}

run();
