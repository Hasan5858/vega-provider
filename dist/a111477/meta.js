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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const axios_1 = __importDefault(require("axios"));
// Helper function to fetch movie poster from OMDB API
function getMoviePoster(title) {
    return __awaiter(this, void 0, void 0, function* () {
        // Clean the title for better matching
        const cleanTitle = title
            .replace(/[#\$]/g, '') // Remove special characters
            .replace(/\([^)]*\)/g, '') // Remove year in parentheses
            .replace(/\s+/g, ' ') // Normalize spaces
            .trim();
        try {
            const searchUrl = `http://www.omdbapi.com/?apikey=trilogy&t=${encodeURIComponent(cleanTitle)}`;
            const response = yield axios_1.default.get(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            if (response.data && response.data.Response === 'True' && response.data.Poster && response.data.Poster !== 'N/A') {
                return response.data.Poster;
            }
        }
        catch (error) {
            console.log(`Error fetching poster for "${title}":`, error instanceof Error ? error.message : error);
        }
        // Fallback to placeholder if API fails
        const imageTitle = cleanTitle.length > 30 ? cleanTitle.slice(0, 30) : cleanTitle;
        return `https://via.placeholder.com/300x450/2c2c2c/ffffff.png?text=${encodeURIComponent(imageTitle)}`;
    });
}
const getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext, }) {
        var _b;
        try {
            const { axios, cheerio } = providerContext;
            const url = link;
            // Add a longer delay to prevent rate limiting
            yield new Promise(resolve => setTimeout(resolve, 500));
            // Retry logic for rate limiting
            let res;
            let retryCount = 0;
            const maxRetries = 3;
            while (retryCount < maxRetries) {
                try {
                    res = yield axios.get(url, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                            'Accept-Language': 'en-US,en;q=0.9',
                            'Cache-Control': 'no-cache',
                            'Pragma': 'no-cache'
                        }
                    });
                    break; // Success, exit retry loop
                }
                catch (error) {
                    if (((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.status) === 429 && retryCount < maxRetries - 1) {
                        console.log(`Rate limited, retrying in ${(retryCount + 1) * 1000}ms...`);
                        yield new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
                        retryCount++;
                    }
                    else {
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
            const pageTitle = $("h1").text().trim() || url.split("/").filter(Boolean).pop() || "";
            const title = pageTitle.replace("Index of /", "").replace(/\/$/, "");
            const links = [];
            const directLinks = [];
            // Parse directory structure
            $("table tbody tr").each((i, element) => {
                const $row = $(element);
                const linkElement = $row.find("td:first-child a");
                const itemTitle = linkElement.text().trim();
                const itemLink = linkElement.attr("href");
                if (itemTitle &&
                    itemLink &&
                    itemTitle !== "../" &&
                    itemTitle !== "Parent Directory") {
                    // Construct full URL - handle both relative and absolute URLs
                    const fullLink = itemLink.startsWith('http')
                        ? itemLink
                        : (link.endsWith('/') ? link + itemLink : link + '/' + itemLink);
                    // If it's a directory (ends with /)
                    if (itemTitle.endsWith("/")) {
                        const cleanTitle = itemTitle.replace(/\/$/, "");
                        const episodeLinkUrl = itemLink.startsWith('http')
                            ? itemLink
                            : (link.endsWith('/') ? link + itemLink : link + '/' + itemLink);
                        links.push({
                            episodesLink: episodeLinkUrl,
                            title: cleanTitle,
                        });
                    }
                    // If it's a video file
                    else if (itemTitle.includes(".mp4") ||
                        itemTitle.includes(".mkv") ||
                        itemTitle.includes(".avi") ||
                        itemTitle.includes(".mov")) {
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
                    title: directLinks.length === 1 ? directLinks[0].title : title + " (Direct Files)",
                    directLinks: directLinks,
                });
            }
            // If no links found (neither directories nor direct files), create a fallback
            if (links.length === 0 && directLinks.length === 0) {
                links.push({
                    title: title,
                    directLinks: [],
                });
            }
            // Determine if this is a movie or series based on structure
            const type = links.some((link) => {
                var _a, _b;
                return ((_a = link.episodesLink) === null || _a === void 0 ? void 0 : _a.includes("Season")) ||
                    ((_b = link.episodesLink) === null || _b === void 0 ? void 0 : _b.includes("S0"));
            })
                ? "series"
                : directLinks.length > 1
                    ? "series"
                    : "movie";
            // Get real movie poster from OMDB API
            const image = yield getMoviePoster(title);
            return {
                title: title,
                synopsis: `Content from 111477.xyz directory`,
                image: image,
                imdbId: "",
                type: type,
                linkList: links,
            };
        }
        catch (err) {
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
    });
};
exports.getMeta = getMeta;
