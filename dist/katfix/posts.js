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
        return fetchPosts({
            filter: "",
            page,
            query: searchQuery,
            signal,
            providerContext,
        });
    });
}
// --- Core function ---
function fetchPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ filter, query, page = 1, signal, providerContext, }) {
        try {
            // Get base URL from provider context, with fallback to hardcoded URL
            let baseUrl = yield providerContext.getBaseUrl("katfix");
            // If base URL is empty or undefined, use hardcoded fallback
            if (!baseUrl || baseUrl.trim() === '') {
                baseUrl = 'https://katmoviefix.cards';
            }
            // Debug logging that survives minification
            if (typeof window !== 'undefined' && window.console) {
                window.console.log("🔍 DEBUG - Base URL received:", baseUrl);
                window.console.log("🔍 DEBUG - Base URL type:", typeof baseUrl);
                window.console.log("🔍 DEBUG - Base URL length:", baseUrl ? baseUrl.length : 'undefined');
            }
            // Fallback for Node.js environment
            if (typeof process !== 'undefined' && process.stdout) {
                process.stdout.write(`🔍 DEBUG - Base URL: ${baseUrl}\n`);
                process.stdout.write(`🔍 DEBUG - Type: ${typeof baseUrl}\n`);
                process.stdout.write(`🔍 DEBUG - Length: ${baseUrl ? baseUrl.length : 'undefined'}\n`);
            }
            let url;
            // --- Build URL for category filter or search query
            if (query && query.trim()) {
                url = `${baseUrl}/?s=${encodeURIComponent(query)}${page > 1 ? `&paged=${page}` : ""}`;
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
            // Debug the constructed URL
            if (typeof window !== 'undefined' && window.console) {
                window.console.log("🔍 DEBUG - Constructed URL:", url);
            }
            if (typeof process !== 'undefined' && process.stdout) {
                process.stdout.write(`🔍 DEBUG - Constructed URL: ${url}\n`);
            }
            const res = yield axios.get(url, { headers: defaultHeaders, signal });
            // Debug the response
            if (typeof window !== 'undefined' && window.console) {
                window.console.log("🔍 DEBUG - Response status:", res.status);
                window.console.log("🔍 DEBUG - Response data length:", res.data ? res.data.length : 'no data');
            }
            if (typeof process !== 'undefined' && process.stdout) {
                process.stdout.write(`🔍 DEBUG - Response status: ${res.status}\n`);
                process.stdout.write(`🔍 DEBUG - Response data length: ${res.data ? res.data.length : 'no data'}\n`);
            }
            const $ = cheerio.load(res.data || "");
            const resolveUrl = (href) => (href === null || href === void 0 ? void 0 : href.startsWith("http"))
                ? href
                : `${baseUrl}${href.startsWith("/") ? "" : "/"}${href}`;
            const seen = new Set();
            const seenTitles = new Set();
            const catalog = [];
            // --- HDMovie2 selectors
            const POST_SELECTORS = [
                ".pstr_box",
                "article",
                ".result-item",
                ".post",
                ".item",
                ".thumbnail",
                ".latest-movies",
                ".movie-item",
            ].join(",");
            // Debug: Check how many elements each selector finds
            if (typeof window !== 'undefined' && window.console) {
                window.console.log("🔍 DEBUG - Testing selectors:");
                POST_SELECTORS.split(',').forEach(selector => {
                    const count = $(selector).length;
                    window.console.log(`  ${selector}: ${count} elements`);
                });
            }
            if (typeof process !== 'undefined' && process.stdout) {
                process.stdout.write("🔍 DEBUG - Testing selectors:\n");
                POST_SELECTORS.split(',').forEach(selector => {
                    const count = $(selector).length;
                    process.stdout.write(`  ${selector}: ${count} elements\n`);
                });
            }
            $(POST_SELECTORS).each((_, el) => {
                var _a;
                const card = $(el);
                let link = card.find("a[href]").first().attr("href") || "";
                if (!link)
                    return;
                link = resolveUrl(link);
                if (seen.has(link))
                    return;
                let title = card.find("h2").first().text().trim() ||
                    ((_a = card.find("a[title]").first().attr("title")) === null || _a === void 0 ? void 0 : _a.trim()) ||
                    card.text().trim();
                title = title
                    .replace(/\[.*?\]/g, "")
                    .replace(/\(.+?\)/g, "")
                    .replace(/\s{2,}/g, " ")
                    .trim();
                if (!title)
                    return;
                // Check for duplicate titles (case-insensitive)
                const normalizedTitle = title.toLowerCase().trim();
                if (seenTitles.has(normalizedTitle))
                    return;
                const img = card.find("img").first().attr("src") ||
                    card.find("img").first().attr("data-src") ||
                    card.find("img").first().attr("data-original") ||
                    "";
                const image = img ? resolveUrl(img) : "";
                seen.add(link);
                seenTitles.add(normalizedTitle);
                catalog.push({ title, link, image });
            });
            // Debug: Show final results
            if (typeof window !== 'undefined' && window.console) {
                window.console.log("🔍 DEBUG - Final catalog length:", catalog.length);
                window.console.log("🔍 DEBUG - Sample posts:", catalog.slice(0, 3).map(p => p.title));
            }
            if (typeof process !== 'undefined' && process.stdout) {
                process.stdout.write(`🔍 DEBUG - Final catalog length: ${catalog.length}\n`);
                process.stdout.write(`🔍 DEBUG - Sample posts: ${catalog.slice(0, 3).map(p => p.title).join(', ')}\n`);
            }
            return catalog.slice(0, 20); // Reduced from 100 to 20 for faster loading
        }
        catch (err) {
            console.error("HDMovie2 fetchPosts error:", err instanceof Error ? err.message : String(err));
            return [];
        }
    });
}
