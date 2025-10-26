import { Info, Link, ProviderContext } from "../types";

// Headers (omitted for brevity, assume they are the same)
const headers = {
    Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Cache-Control": "no-store",
    "Accept-Language": "en-US,en;q=0.9",
    DNT: "1",
    "sec-ch-ua":
        '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    Cookie:
        "xla=s4t; _ga=GA1.1.1081149560.1756378968; _ga_BLZGKYN5PF=GS2.1.s1756378968$o1$g1$t1756378984$j44$l0$h0",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
};

/**
 * Deobfuscate JavaScript code using external API
 */
async function deobfuscateCode(code: string, providerContext: ProviderContext): Promise<string> {
    const { axios } = providerContext;
    try {
        const response = await axios.post('https://js-deobfuscator-api.replit.app/api/deobfuscate', {
            code: code
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        if (response.data.success) {
            return response.data.result;
        } else {
            console.log("Deobfuscation failed:", response.data.error);
            return code; // Return original code if deobfuscation fails
        }
    } catch (error: any) {
        console.log("Deobfuscation API error:", error.message);
        return code; // Return original code if API fails
    }
}

/**
 * Extract m3u8 links from embed page using deobfuscation
 */
async function getM3u8FromEmbed(
    embedUrl: string,
    movieTitle: string,
    providerContext: ProviderContext
): Promise<Link[]> {
    const { axios, cheerio } = providerContext;
    const finalLinks: Link[] = [];

    try {
        // Step 1: Fetch embed page
        const embedResponse = await axios.get(embedUrl, { headers });
        const $ = cheerio.load(embedResponse.data);
        
        // Step 2: Find eval packed code in script tags
        let evalPackedCode = '';
        $('script').each((_, el) => {
            const scriptContent = $(el).html();
            if (scriptContent && scriptContent.includes('eval(')) {
                // Extract the entire eval code using pattern matching
                const evalStart = scriptContent.indexOf('eval(');
                if (evalStart !== -1) {
                    // Find the end by looking for the pattern that ends with .split('|')))
                    const evalEndPattern = /\.split\('\|'\)\)\)/;
                    const match = scriptContent.substring(evalStart).match(evalEndPattern);
                    
                    if (match && match.index !== undefined) {
                        const evalEnd = evalStart + match.index + match[0].length;
                        evalPackedCode = scriptContent.substring(evalStart, evalEnd);
                        return false; // Break the loop
                    }
                }
            }
        });

        if (!evalPackedCode) {
            console.log("No eval packed code found in embed page");
            return finalLinks;
        }

        // Step 3: Deobfuscate the eval packed code
        console.log("Deobfuscating eval packed code...");
        const deobfuscatedCode = await deobfuscateCode(evalPackedCode, providerContext);
        
        // Step 4: Extract m3u8 links from deobfuscated code
        const m3u8Links: string[] = [];
        
        // Look for jwplayer setup with sources array
        const sourcesMatch = deobfuscatedCode.match(/sources:\s*\[\s*\{\s*file:\s*["']([^"']+)["']/);
        
        if (sourcesMatch) {
            const fileUrl = sourcesMatch[1];
            
            // Check if it's an m3u8 URL
            if (fileUrl.includes('.m3u8')) {
                m3u8Links.push(fileUrl);
            }
        } else {
            // Fallback: direct m3u8 search
            const m3u8Matches = deobfuscatedCode.matchAll(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/g);
            for (const match of m3u8Matches) {
                const m3u8Url = match[0];
                if (!m3u8Links.includes(m3u8Url)) {
                    m3u8Links.push(m3u8Url);
                }
            }
        }

        // Step 5: Create link objects for m3u8 streams
        if (m3u8Links.length > 0) {
            finalLinks.push({
                title: `${movieTitle} - Adaptive Stream`,
                quality: 'Adaptive',
                episodesLink: embedUrl,
                directLinks: m3u8Links.map(m3u8Url => ({
                    title: 'Adaptive Stream',
                    link: m3u8Url,
                    type: "movie",
                })),
            });
        }

    } catch (error) {
        console.error("Error extracting m3u8 from embed:", error);
    }

    return finalLinks;
}

/**
 * Simplified approach: Get download links directly from watching page
 */
async function getDownloadLinks(
    movieUrl: string,
    movieTitle: string,
    providerContext: ProviderContext
): Promise<Link[]> {
    const { axios, cheerio } = providerContext;
    const finalLinks: Link[] = [];

    try {
        // Step 1: Construct watching page URL
        const watchingUrl = movieUrl + 'watching/';
        
        // Step 2: Fetch watching page and find embed URL
        const watchingResponse = await axios.get(watchingUrl, { headers });
        const $ = cheerio.load(watchingResponse.data);
        
        // Find embed URL in data-drive attribute
        const embedUrl = $('li[data-drive]').attr('data-drive');
        
        if (!embedUrl) {
            console.log("Failed to find embed URL in watching page.");
            return finalLinks;
        }
        
        // Step 3: Get m3u8 links from embed URL
        const m3u8Links = await getM3u8FromEmbed(embedUrl, movieTitle, providerContext);
        finalLinks.push(...m3u8Links);
        
        // Step 4: Convert embed URL to download URL for direct downloads
        const downloadUrl = embedUrl.replace('/embed-', '/');
        
        // Step 5: Fetch download page and extract download buttons
        const downloadResponse = await axios.get(downloadUrl, { headers });
        const $$ = cheerio.load(downloadResponse.data);
        
        // Extract download buttons with download_video() calls
        $$('button[onclick^="download_video"]').each((_, element) => {
            const btnEl = $$(element);
            const qualityText = btnEl.text().trim(); // e.g., "Normal quality 1128x480, 1.2 GB"
            
            // Extract Quality (e.g., Normal/Low) and Size (e.g., 1.2 GB)
            const qualityMatch = qualityText.match(/(Normal|Low)\squality/i);
            const quality = qualityMatch ? qualityMatch[1] : 'Unknown';
            const sizeMatch = qualityText.match(/(\d+(\.\d+)?\s(GB|MB))$/i);
            const size = sizeMatch ? sizeMatch[0] : 'Unknown Size';

            // Construct link object for download buttons
            finalLinks.push({
                title: `${movieTitle} - ${qualityText}`,
                quality: quality,
                episodesLink: downloadUrl, // Points to download page
                directLinks: [
                    {
                        title: `Download (${size})`,
                        link: downloadUrl,
                        type: "movie",
                    },
                ],
            });
        });

    } catch (error) {
        console.error("Error during simplified download link extraction:", error);
    }

    return finalLinks;
}


export const getMeta = async function ({
    link,
    providerContext,
}: {
    link: string;
    providerContext: ProviderContext;
}): Promise<Info> {
    const { axios, cheerio } = providerContext;
    const url = link;
    const baseUrl = url.split("/").slice(0, 3).join("/");

    const emptyResult: Info = {
        title: "",
        synopsis: "",
        image: "",
        imdbId: "",
        type: "movie",
        linkList: [],
    };

    try {
        const response = await axios.get(url, {
            headers: { ...headers, Referer: baseUrl },
        });

        const $ = cheerio.load(response.data);
        const detailEl = $(".main-detail");

        const result: Info = {
            title: "",
            synopsis: "",
            image: "",
            imdbId: "",
            type: "movie", 
            linkList: [],
        };

        // --- Metadata Extraction ---
        result.title = detailEl.find(".detail-mod h3").text().trim() || 
                       detailEl.find(".breadcrumb .active span[itemprop='name']").text().trim().replace('(Tamil)', '').trim() ||
                       $("title").text().split("|")[0].trim();

        result.image = detailEl.find(".dm-thumb img").attr("src") || "";
        if (result.image.startsWith("//")) result.image = "https:" + result.image;

        result.synopsis = detailEl.find(".desc p").text().trim() || "Synopsis not found.";
        result.imdbId = detailEl.find("#imdb_id").text().trim(); 
        result.type = "movie"; 
        
        const qualityText = detailEl.find(".mvici-right .quality a").text().trim() || "Unknown";

        // --- LinkList Aggregation ---
        let finalLinks: Link[] = [];

        // 1. Fetch download links using simplified approach
        const deepDownloadLinks = await getDownloadLinks(url, result.title, providerContext);
        finalLinks = finalLinks.concat(deepDownloadLinks);
        
        // 2. Fetch External Links (excluding "Download Android APP")
        detailEl.find(".mobile-btn a.mod-btn").each((index, element) => {
            const btnEl = $(element);
            const linkUrl = btnEl.attr("href");
            
            const rawTitle = btnEl.attr("title") ?? ''; 
            const fallbackTitle = btnEl.text().trim();
            const title = rawTitle.trim() || fallbackTitle; 
            
            // EXCLUSION: Skip the Android App link
            if (title.includes('Download Android APP')) {
                return;
            }

            if (linkUrl && (title.includes('Download') || title.includes('Watch') || title.includes('Join Us'))) {
                 finalLinks.push({
                    title: `${result.title} - ${title}`, 
                    quality: 'External Link',
                    episodesLink: linkUrl,
                    directLinks: [
                        {
                            title: title,
                            link: linkUrl,
                            type: "movie", 
                        }
                    ]
                 });
            }
        });


        result.linkList = finalLinks;

        return result;
    } catch (err) {
        console.log("getMeta error:", err);
        return emptyResult;
    }
};