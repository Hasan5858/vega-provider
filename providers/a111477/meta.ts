import { EpisodeLink, Info, Link, ProviderContext } from "../types";
import axios from "axios";

// Helper function to fetch movie poster from OMDB API
async function getMoviePoster(title: string): Promise<string> {
  // Clean the title for better matching
  const cleanTitle = title
    .replace(/[#\$]/g, '') // Remove special characters
    .replace(/\([^)]*\)/g, '') // Remove year in parentheses
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  
  try {
    const searchUrl = `http://www.omdbapi.com/?apikey=trilogy&t=${encodeURIComponent(cleanTitle)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (response.data && response.data.Response === 'True' && response.data.Poster && response.data.Poster !== 'N/A') {
      return response.data.Poster;
    }
  } catch (error) {
    console.log(`Error fetching poster for "${title}":`, error instanceof Error ? error.message : error);
  }
  
  // Fallback to placeholder if API fails
  const imageTitle = cleanTitle.length > 30 ? cleanTitle.slice(0, 30) : cleanTitle;
  return `https://via.placeholder.com/300x450/2c2c2c/ffffff.png?text=${encodeURIComponent(imageTitle)}`;
}

export const getMeta = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  try {
    const { axios, cheerio } = providerContext;
    const url = link;
    
    // Add a longer delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Retry logic for rate limiting
    let res;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        res = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        break; // Success, exit retry loop
      } catch (error: any) {
        if (error?.response?.status === 429 && retryCount < maxRetries - 1) {
          console.log(`Rate limited, retrying in ${(retryCount + 1) * 1000}ms...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
          retryCount++;
        } else {
          throw error; // Re-throw if not rate limit or max retries reached
        }
      }
    }
    if (!res || !res.data) {
      throw new Error('No data received from server');
    }
    
    const data = res.data;
    const $ = cheerio.load(data);

    // Extract title from the page header or URL
    const pageTitle =
      $("h1").text().trim() || url.split("/").filter(Boolean).pop() || "";
    const title = pageTitle.replace("Index of /", "").replace(/\/$/, "");

    const links: Link[] = [];
    const directLinks: EpisodeLink[] = [];

    // Parse directory structure
    $("table tbody tr").each((i, element) => {
      const $row = $(element);
      const linkElement = $row.find("td:first-child a");
      const itemTitle = linkElement.text().trim();
      const itemLink = linkElement.attr("href");

      if (
        itemTitle &&
        itemLink &&
        itemTitle !== "../" &&
        itemTitle !== "Parent Directory"
      ) {
        const fullLink = itemLink;

        // If it's a directory (ends with /)
        if (itemTitle.endsWith("/")) {
          const cleanTitle = itemTitle.replace(/\/$/, "");
          links.push({
            episodesLink: link.endsWith('/') ? link + itemLink : link + '/' + itemLink,
            title: cleanTitle,
          });
        }
        // If it's a video file
        else if (
          itemTitle.includes(".mp4") ||
          itemTitle.includes(".mkv") ||
          itemTitle.includes(".avi") ||
          itemTitle.includes(".mov")
        ) {
          directLinks.push({
            title: itemTitle,
            link: fullLink,
          });
        }
      }
    });

    // If there are direct video files, add them as a direct link group
    if (directLinks.length > 0) {
      links.push({
        title: title + " (Direct Files)",
        directLinks: directLinks,
      });
    }

    // Determine if this is a movie or series based on structure
    const type = links.some(
      (link) =>
        link.episodesLink?.includes("Season") ||
        link.episodesLink?.includes("S0")
    )
      ? "series"
      : directLinks.length > 1
      ? "series"
      : "movie";

    // Get real movie poster from OMDB API
    const image = await getMoviePoster(title);

    return {
      title: title,
      synopsis: `Content from 111477.xyz directory`,
      image: image,
      imdbId: "",
      type: type,
      linkList: links,
    };
  } catch (err) {
    console.error("111477 meta error:", err);
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
