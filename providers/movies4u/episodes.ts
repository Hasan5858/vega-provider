import { EpisodeLink, ProviderContext } from '../types';

const WORKER_URL = 'https://movies4u.steep-bread-3c84.workers.dev';

export const getEpisodes = async function ({
  url,
  providerContext,
}: {
  url: string;
  providerContext: ProviderContext;
}): Promise<EpisodeLink[]> {
  const { axios } = providerContext;

  try {
    console.log('[Movies4U Episodes] Fetching episodes for:', url);

    const { data } = await axios.get(WORKER_URL, {
      params: {
        action: 'episodes',
        link: url,
      },
      timeout: 30000,
    });

    if (!data.success || !Array.isArray(data.episodes)) {
      console.error('[Movies4U Episodes] Invalid worker response:', data);
      return [];
    }

    console.log('[Movies4U Episodes] Received', data.episodes.length, 'episodes');

    return data.episodes;
  } catch (error) {
    console.error('[Movies4U Episodes] Error:', error);
    return [];
  }
};
