import { Info, ProviderContext } from '../types';

const WORKER_URL = 'https://movies4u.steep-bread-3c84.workers.dev';

export const getMeta = async ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> => {
  const { axios } = providerContext;

  try {
    console.log('[Movies4U Meta] Fetching metadata for:', link);

    const { data } = await axios.get(WORKER_URL, {
      params: {
        action: 'meta',
        link: link,
      },
      timeout: 30000,
    });

    if (!data.success || !data.data) {
      console.error('[Movies4U Meta] Invalid worker response:', data);
      return {
        title: '',
        synopsis: '',
        image: '',
        imdbId: '',
        type: 'movie',
        linkList: [],
      };
    }

    const meta = data.data;
    console.log('[Movies4U Meta] Received metadata:', {
      title: meta.title,
      type: meta.type,
      links: meta.linkList?.length || 0,
    });

    return {
      title: meta.title || '',
      synopsis: meta.synopsis || '',
      image: meta.image || '',
      imdbId: meta.imdbId || '',
      type: meta.type || 'movie',
      linkList: meta.linkList || [],
    };
  } catch (error) {
    console.error('[Movies4U Meta] Error:', error);
    return {
      title: '',
      synopsis: '',
      image: '',
      imdbId: '',
      type: 'movie',
      linkList: [],
    };
  }
};
