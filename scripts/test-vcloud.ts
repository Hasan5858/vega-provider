import { vcloudExtractor } from '../providers/vcloudExtractor';

async function run() {
  const url = 'https://vcloud.zip/v3bw8kgt1o3iqhx';
  const controller = new AbortController();
  try {
    console.log('Testing VCloud extractor for:', url);
    const streams = await vcloudExtractor(url, controller.signal);
    console.log('Extractor returned:', JSON.stringify(streams, null, 2));
    console.log('Total streams:', streams.length);
  } catch (err) {
    console.error('Test failed:', err instanceof Error ? err.message : err);
  }
}

run();
