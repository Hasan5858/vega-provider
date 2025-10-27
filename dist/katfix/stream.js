"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = getStream;
const headers = {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Cache-Control": "no-store",
    "Accept-Language": "en-US,en;q=0.9",
    DNT: "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};
// Simplified and working version based on FilmyFly approach
// Helper function to get server name from URL
function getServerName(url) {
    if (url.includes("gofile.io"))
        return "GoFile";
    if (url.includes("send.cm"))
        return "Send";
    if (url.includes("gdflix"))
        return "GDFlix";
    if (url.includes("filepress"))
        return "FilePress";
    if (url.includes("gdtot"))
        return "GDTot";
    if (url.includes("pixeldrain"))
        return "PixelDrain";
    if (url.includes("hubcloud"))
        return "HubCloud";
    if (url.includes("1fichier"))
        return "1fichier";
    if (url.includes("mega.nz"))
        return "Mega";
    if (url.includes("drive.google"))
        return "Google Drive";
    return "Unknown";
}
// Helper function to determine file type from URL or content
function getFileType(url, server) {
    // Check URL extension first
    const extension = url.match(/\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v)$/i);
    if (extension)
        return extension[1].toLowerCase();
    // Default based on server
    const serverDefaults = {
        "GoFile": "mkv",
        "Send": "mkv",
        "GDFlix": "mkv",
        "FilePress": "mkv",
        "GDTot": "mkv",
        "PixelDrain": "mp4",
        "HubCloud": "mkv",
        "1fichier": "mkv",
        "Mega": "mkv",
        "Google Drive": "mkv"
    };
    return serverDefaults[server] || "mkv";
}
// Helper function to extract direct video URLs from cloud storage services
function extractDirectVideoUrl(link, server, axios, cheerio) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            // Debug logging
            if (typeof window !== 'undefined' && window.console) {
                window.console.log(`🔍 DEBUG - Extracting direct URL from ${server}: ${link}`);
            }
            if (typeof process !== 'undefined' && process.stdout) {
                process.stdout.write(`🔍 DEBUG - Extracting direct URL from ${server}: ${link}\n`);
            }
            const response = yield axios.get(link, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                maxRedirects: 5,
                timeout: 10000
            });
            const finalUrl = ((_a = response.request) === null || _a === void 0 ? void 0 : _a.responseURL) || ((_b = response.config) === null || _b === void 0 ? void 0 : _b.url) || link;
            // Debug the final URL
            if (typeof window !== 'undefined' && window.console) {
                window.console.log(`🔍 DEBUG - Final URL for ${server}: ${finalUrl}`);
            }
            if (typeof process !== 'undefined' && process.stdout) {
                process.stdout.write(`🔍 DEBUG - Final URL for ${server}: ${finalUrl}\n`);
            }
            // Special handling for fastcdn-dl.pages.dev URLs - extract the actual video URL from query parameter
            if (finalUrl.includes('fastcdn-dl.pages.dev')) {
                try {
                    // Extract URL parameter manually since URLSearchParams might not be available
                    const urlMatch = finalUrl.match(/[?&]url=([^&]+)/);
                    if (urlMatch && urlMatch[1]) {
                        const encodedUrl = urlMatch[1];
                        const decodedUrl = decodeURIComponent(encodedUrl);
                        // Check if the decoded URL is a direct video file
                        const videoExtensions = /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|m3u8)$/i;
                        if (videoExtensions.test(decodedUrl)) {
                            return [{
                                    server: server,
                                    link: decodedUrl,
                                    type: getFileType(decodedUrl, server),
                                    quality: "1080"
                                }];
                        }
                    }
                }
                catch (error) {
                    // If decoding fails, continue with other methods
                }
            }
            // Check if the final URL is a direct video file
            const videoExtensions = /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|m3u8)$/i;
            if (videoExtensions.test(finalUrl)) {
                return [{
                        server: server,
                        link: finalUrl,
                        type: getFileType(finalUrl, server),
                        quality: "1080"
                    }];
            }
            // If not a direct video file, parse the HTML to find video links
            const $ = cheerio.load(response.data);
            const videoLinks = [];
            // Look for direct video links in the HTML
            const videoSelectors = [
                'a[href*=".mp4"]',
                'a[href*=".mkv"]',
                'a[href*=".avi"]',
                'a[href*=".mov"]',
                'a[href*=".webm"]',
                'a[href*=".m4v"]',
                'a[href*=".m3u8"]'
            ].join(', ');
            $(videoSelectors).each((_, el) => {
                var _a;
                const href = (_a = $(el).attr('href')) === null || _a === void 0 ? void 0 : _a.trim();
                const text = $(el).text().trim();
                if (href) {
                    // Make sure it's a full URL
                    const fullUrl = href.startsWith('http') ? href : new URL(href, finalUrl).href;
                    // Special handling for fastcdn-dl.pages.dev URLs
                    if (fullUrl.includes('fastcdn-dl.pages.dev')) {
                        try {
                            // Extract URL parameter manually since URLSearchParams might not be available
                            const urlMatch = fullUrl.match(/[?&]url=([^&]+)/);
                            if (urlMatch && urlMatch[1]) {
                                const encodedUrl = urlMatch[1];
                                const decodedUrl = decodeURIComponent(encodedUrl);
                                // Check if the decoded URL is a direct video file
                                const videoExtensions = /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|m3u8)$/i;
                                if (videoExtensions.test(decodedUrl)) {
                                    videoLinks.push({
                                        server: server,
                                        link: decodedUrl,
                                        type: getFileType(decodedUrl, server),
                                        quality: "1080"
                                    });
                                    return; // Skip adding the original URL
                                }
                            }
                        }
                        catch (error) {
                            // If decoding fails, continue with original URL
                        }
                    }
                    videoLinks.push({
                        server: server,
                        link: fullUrl,
                        type: getFileType(fullUrl, server),
                        quality: "1080"
                    });
                }
            });
            // Also look for video URLs in the HTML content using regex
            const videoUrlPattern = /https?:\/\/[^\s"']+\.(mp4|mkv|avi|mov|webm|m4v|m3u8)(\?[^\s"']*)?/gi;
            const matches = response.data.match(videoUrlPattern);
            if (matches) {
                matches.forEach((match) => {
                    videoLinks.push({
                        server: server,
                        link: match,
                        type: getFileType(match, server),
                        quality: "1080"
                    });
                });
            }
            if (videoLinks.length > 0) {
                // Debug found video links
                if (typeof window !== 'undefined' && window.console) {
                    window.console.log(`🔍 DEBUG - Found ${videoLinks.length} video links in HTML`);
                    videoLinks.forEach((link, i) => {
                        window.console.log(`  ${i + 1}. ${link.link}`);
                    });
                }
                if (typeof process !== 'undefined' && process.stdout) {
                    process.stdout.write(`🔍 DEBUG - Found ${videoLinks.length} video links in HTML\n`);
                    videoLinks.forEach((link, i) => {
                        process.stdout.write(`  ${i + 1}. ${link.link}\n`);
                    });
                }
                return videoLinks;
            }
            // If no video links found, return the original link as fallback
            return [{
                    server: server,
                    link: link,
                    type: getFileType(link, server),
                    quality: "1080"
                }];
        }
        catch (error) {
            // If extraction fails, return the original link as fallback
            return [{
                    server: server,
                    link: link,
                    type: getFileType(link, server),
                    quality: "1080"
                }];
        }
    });
}
function getStream(_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, type, signal, providerContext, }) {
        var _b;
        const { axios, cheerio, extractors } = providerContext;
        const { gofileExtracter, gdFlixExtracter } = extractors;
        try {
            const streamLinks = [];
            const response = yield axios.get(link, { headers, signal, timeout: 10000 });
            const $ = cheerio.load(response.data);
            // Extract all cloud storage links
            const cloudSelectors = [
                "a[href*='gofile.io']",
                "a[href*='gdflix']",
                "a[href*='gdtot']",
                "a[href*='hubcloud']",
                "a[href*='pixeldrain']",
                "a[href*='send.cm']",
                "a[href*='1fichier']",
                "a[href*='mega.nz']",
                "a[href*='drive.google']"
            ].join(", ");
            $(cloudSelectors).each((_, el) => {
                var _a;
                const href = (_a = $(el).attr("href")) === null || _a === void 0 ? void 0 : _a.trim();
                const text = $(el).text().trim();
                if (!href || !text)
                    return;
                // Skip clearly irrelevant options
                if (/(imdb|rating|score|share|telegram|whatsapp|how to)/i.test(text))
                    return;
                if (text.length < 2)
                    return;
                const server = getServerName(href);
                const fileType = getFileType(href, server);
                // Extract quality from text
                let quality = "1080";
                const qualityMatch = text.match(/(\d+)p/i);
                if (qualityMatch) {
                    const q = parseInt(qualityMatch[1]);
                    if (q <= 360)
                        quality = "360";
                    else if (q <= 480)
                        quality = "480";
                    else if (q <= 720)
                        quality = "720";
                    else if (q <= 1080)
                        quality = "1080";
                    else
                        quality = "2160";
                }
                streamLinks.push({
                    server: `${server} [${quality}p]`,
                    link: href,
                    type: fileType,
                    quality: quality
                });
            });
            // Extract actual URLs from cloud storage links
            const finalStreams = [];
            for (const stream of streamLinks) {
                try {
                    if (stream.link.includes("gofile.io")) {
                        const gofileId = (_b = stream.link.split("/d/")[1]) === null || _b === void 0 ? void 0 : _b.split("?")[0];
                        if (gofileId) {
                            const result = yield gofileExtracter(gofileId);
                            if (result === null || result === void 0 ? void 0 : result.link) {
                                finalStreams.push({
                                    server: stream.server,
                                    link: result.link,
                                    type: stream.type,
                                    quality: stream.quality
                                });
                                continue;
                            }
                        }
                    }
                    else if (stream.link.includes("gdflix")) {
                        const results = yield gdFlixExtracter(stream.link, signal);
                        if ((results === null || results === void 0 ? void 0 : results.length) > 0) {
                            results.forEach((r) => {
                                finalStreams.push({
                                    server: stream.server,
                                    link: r.link,
                                    type: stream.type,
                                    quality: stream.quality
                                });
                            });
                            continue;
                        }
                    }
                }
                catch (e) {
                    // Extraction failed, will use fallback
                }
                // Fallback: use cloud storage link directly
                finalStreams.push(stream);
            }
            // Remove duplicates
            const uniqueStreams = finalStreams.filter((s, i, arr) => i === arr.findIndex(t => t.link === s.link));
            return uniqueStreams;
        }
        catch (error) {
            console.error("KatFix getStream error:", error.message);
            return [];
        }
    });
}
