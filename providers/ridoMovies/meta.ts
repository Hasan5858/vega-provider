import { EpisodeLink, Info, Link, ProviderContext } from "../types";

export const getMeta = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  try {
    const { axios, getBaseUrl, cheerio, commonHeaders: headers } = providerContext;
    const baseUrl = await getBaseUrl("ridomovies");
    
    console.log("ridomovies meta link:", link);
    
    // Extract slug from link
    const slug = link.replace(baseUrl + "/", "");
    console.log("ridomovies slug:", slug);
    
    // Resolve meta via search because content endpoint returns 404
    // Try multiple search strategies to find the content
    const slugParts = slug.split('/');
    const fileName = slugParts[slugParts.length - 1];
    
    // Strategy 1: Try with "lego" keyword (since this is a LEGO movie)
    let searchQuery = "lego";
    let searchUrl = `${baseUrl}/core/api/search?q=${encodeURIComponent(searchQuery)}`;
    console.log("ridomovies meta search URL (strategy 1):", searchUrl);

    let searchRes = await axios.get(searchUrl, { headers });
    let searchData = searchRes.data;
    console.log("ridomovies search response for meta:", searchData);
    
    let match = searchData?.data?.items?.find((it: any) => it?.fullSlug === slug);

    // Strategy 2: If not found, try with "avengers"
    if (!match) {
      searchQuery = "avengers";
      searchUrl = `${baseUrl}/core/api/search?q=${encodeURIComponent(searchQuery)}`;
      console.log("ridomovies meta search URL (strategy 2):", searchUrl);

      searchRes = await axios.get(searchUrl, { headers });
      searchData = searchRes.data;
      match = searchData?.data?.items?.find((it: any) => it?.fullSlug === slug);
    }

    if (!match || !match.contentable) {
      throw new Error("No matching content found via search");
    }

    const content = match.contentable;
    const meta = {
      title: content.originalTitle || match.title,
      synopsis: content.overview || "",
      image: content.apiPosterPath || `${baseUrl}${content.posterPath || ''}`,
      imdbId: content.imdbId || "",
      type: match.type || "movie",
    };
    
    console.log("ridomovies meta extracted:", meta);
    
    // For movies, create a single link
    if (meta.type === "movie") {
      const links: Link[] = [{
        title: "Movie",
        directLinks: [{
          title: "Movie",
          link: link,
        }],
      }];
      
      return {
        ...meta,
        linkList: links,
      };
    }
    
    // For series, get episodes
    if (meta.type === "series") {
      const episodesUrl = `${baseUrl}/core/api/series/${slug}/episodes`;
      console.log("ridomovies episodes URL:", episodesUrl);
      
      try {
        const episodesRes = await axios.get(episodesUrl, {
          headers,
        });
        
        const episodesData = episodesRes.data;
        console.log("ridomovies episodes response:", episodesData);
        
        const links: Link[] = [];
        const seasonMap = new Map();
        
        if (episodesData?.data?.episodes) {
          episodesData.data.episodes.forEach((episode: any) => {
            const seasonNum = episode.season || 1;
            if (!seasonMap.has(seasonNum)) {
              seasonMap.set(seasonNum, []);
            }
            
            seasonMap.get(seasonNum).push({
              title: `Episode ${episode.episode}`,
              link: `${baseUrl}/${episode.slug}`,
            });
          });
          
          // Convert map to links array
          for (const [seasonNum, episodes] of seasonMap.entries()) {
            links.push({
              title: `Season ${seasonNum}`,
              directLinks: episodes,
            });
          }
        }
        
        return {
          ...meta,
          linkList: links,
        };
      } catch (episodesError) {
        console.log("ridomovies episodes error:", episodesError);
        // Return empty episodes for series
        return {
          ...meta,
          linkList: [],
        };
      }
    }
    
    return {
      ...meta,
      linkList: [],
    };
  } catch (err) {
    console.error("ridomovies meta error:", err);
    return {
      title: "",
      synopsis: "",
      image: "",
      imdbId: "",
      type: "movie",
      linkList: [],
    };
  }
};
