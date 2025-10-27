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
exports.getPosts = getPosts;
exports.getSearchPosts = getSearchPosts;
const defaultHeaders = {
    Referer: "https://www.google.com",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
};
// --- Normal catalog posts ---
function getPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ filter, page = 1, signal, providerContext, }) {
        return fetchPosts({ filter, page, query: "", signal, providerContext });
    });
}
// --- Search posts ---
function getSearchPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ searchQuery, page = 1, signal, providerContext, }) {
        return fetchPosts({ filter: "", page, query: searchQuery, signal, providerContext });
    });
}
// --- Core function ---
function fetchPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ filter, query, page = 1, signal, providerContext, }) {
        try {
            const baseUrl = "https://ogomovies.dad/";
            let url;
            if (query && query.trim()) {
                // ✅ OGOMovies new search URL
                const encodedQuery = encodeURIComponent(query.trim());
                url =
                    page > 1
                        ? `${baseUrl}/search-query/${encodedQuery}/page/${page}/`
                        : `${baseUrl}/search-query/${encodedQuery}/`;
            }
            else if (filter) {
                url = filter.startsWith("/")
                    ? `${baseUrl}${filter.replace(/\/$/, "")}${page > 1 ? `/page/${page}` : ""}`
                    : `${baseUrl}/${filter}${page > 1 ? `/page/${page}` : ""}`;
            }
            else {
                url = `${baseUrl}${page > 1 ? `/page/${page}` : ""}`;
            }
            const { axios, cheerio } = providerContext;
            const res = yield axios.get(url, { headers: defaultHeaders, signal });
            const $ = cheerio.load(res.data || "");
            const resolveUrl = (href) => (href === null || href === void 0 ? void 0 : href.startsWith("http")) ? href : new URL(href, baseUrl).href;
            const seen = new Set();
            const seenTitles = new Set(); // Additional deduplication by title
            const catalog = [];
            const maxPosts = 20; // Reduced from 100 to 20 for faster loading
            // ✅ OGOMovies structure -> .ml-item
            $(".ml-item").each((_, el) => {
                var _a;
                // Early exit if we already have enough posts
                if (catalog.length >= maxPosts)
                    return false;
                const anchor = $(el).find("a.ml-mask");
                let link = anchor.attr("href") || "";
                if (!link)
                    return;
                link = resolveUrl(link);
                if (seen.has(link))
                    return;
                // Title
                const title = ((_a = anchor.attr("title")) === null || _a === void 0 ? void 0 : _a.trim()) || anchor.find("h2").text().trim() || "";
                // Image - try multiple attributes for better extraction
                const imgElement = anchor.find("img");
                let img = imgElement.attr("data-original") ||
                    imgElement.attr("data-src") ||
                    imgElement.attr("data-lazy") ||
                    imgElement.attr("src") ||
                    "";
                // Additional fallback: check parent elements for images
                if (!img) {
                    img = $(el).find("img").attr("data-original") ||
                        $(el).find("img").attr("data-src") ||
                        $(el).find("img").attr("src") ||
                        "";
                }
                const image = img ? resolveUrl(img) : "";
                if (!title || !image)
                    return;
                // Additional deduplication by title to avoid same content with different URLs
                if (seenTitles.has(title.toLowerCase()))
                    return;
                seen.add(link);
                seenTitles.add(title.toLowerCase());
                catalog.push({ title, link, image });
            });
            return catalog; // No need for slice since we limit during processing
        }
        catch (err) {
            console.error("fetchPosts error:", err instanceof Error ? err.message : String(err));
            return [];
        }
    });
}
