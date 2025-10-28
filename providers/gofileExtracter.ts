import axios from 'axios';

export async function gofileExtracter(
  id: string,
): Promise<{link: string; token: string}> {
  try {
    console.log('gofile extracter starting for ID:', id);
    
    const gofileRes = await axios.get('https://gofile.io/d/' + id);
    const genAccountres = await axios.post('https://api.gofile.io/accounts');
    const token = genAccountres.data.data.token;
    console.log('gofile token', token);

    const wtRes = await axios.get('https://gofile.io/dist/js/global.js');
    const wtMatch = wtRes.data.match(/appdata\.wt\s*=\s*["']([^"']+)["']/);
    
    if (!wtMatch) {
      throw new Error('Could not extract wt parameter');
    }
    
    const wt = wtMatch[1];
    console.log('gofile wt', wt);

    const res = await axios.get(
      `https://api.gofile.io/contents/${id}?wt=${wt}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    
    if (!res.data.data || !res.data.data.children) {
      throw new Error('Invalid response structure from gofile API');
    }
    
    const childrenKeys = Object.keys(res.data.data.children);
    if (childrenKeys.length === 0) {
      throw new Error('No children found in gofile response');
    }
    
    const oId = childrenKeys[0];
    const link = res.data.data.children[oId].link;
    
    if (!link) {
      throw new Error('No link found in gofile response');
    }
    
    console.log('gofile extracter', link);
    return {
      link,
      token,
    };
  } catch (e) {
    console.log('gofile extracter err', e);
    return {
      link: '',
      token: '',
    };
  }
}
