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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = getPosts;
exports.getSearchPosts = getSearchPosts;
var defaultHeaders = {
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
    return __awaiter(this, arguments, void 0, function (_b) {
        var filter = _b.filter, _c = _b.page, page = _c === void 0 ? 1 : _c, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_d) {
            return [2 /*return*/, fetchPosts({ filter: filter, page: page, query: "", signal: signal, providerContext: providerContext })];
        });
    });
}
// --- Search posts ---
function getSearchPosts(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var searchQuery = _b.searchQuery, _c = _b.page, page = _c === void 0 ? 1 : _c, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_d) {
            return [2 /*return*/, fetchPosts({ filter: "", page: page, query: searchQuery, signal: signal, providerContext: providerContext })];
        });
    });
}
// --- Core function ---
function fetchPosts(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var baseUrl_1, url, encodedQuery, axios, cheerio, res, $_1, resolveUrl_1, seen_1, seenTitles_1, catalog_1, maxPosts_1, err_1;
        var filter = _b.filter, query = _b.query, _c = _b.page, page = _c === void 0 ? 1 : _c, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    baseUrl_1 = "https://ogomovies.dad/";
                    url = void 0;
                    if (query && query.trim()) {
                        encodedQuery = encodeURIComponent(query.trim());
                        url =
                            page > 1
                                ? "".concat(baseUrl_1, "/search-query/").concat(encodedQuery, "/page/").concat(page, "/")
                                : "".concat(baseUrl_1, "/search-query/").concat(encodedQuery, "/");
                    }
                    else if (filter) {
                        url = filter.startsWith("/")
                            ? "".concat(baseUrl_1).concat(filter.replace(/\/$/, "")).concat(page > 1 ? "/page/".concat(page) : "")
                            : "".concat(baseUrl_1, "/").concat(filter).concat(page > 1 ? "/page/".concat(page) : "");
                    }
                    else {
                        url = "".concat(baseUrl_1).concat(page > 1 ? "/page/".concat(page) : "");
                    }
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    return [4 /*yield*/, axios.get(url, { headers: defaultHeaders, signal: signal })];
                case 1:
                    res = _d.sent();
                    $_1 = cheerio.load(res.data || "");
                    resolveUrl_1 = function (href) {
                        return (href === null || href === void 0 ? void 0 : href.startsWith("http")) ? href : new URL(href, baseUrl_1).href;
                    };
                    seen_1 = new Set();
                    seenTitles_1 = new Set();
                    catalog_1 = [];
                    maxPosts_1 = 20;
                    // ✅ OGOMovies structure -> .ml-item
                    $_1(".ml-item").each(function (_, el) {
                        var _a;
                        // Early exit if we already have enough posts
                        if (catalog_1.length >= maxPosts_1)
                            return false;
                        var anchor = $_1(el).find("a.ml-mask");
                        var link = anchor.attr("href") || "";
                        if (!link)
                            return;
                        link = resolveUrl_1(link);
                        if (seen_1.has(link))
                            return;
                        // Title
                        var title = ((_a = anchor.attr("title")) === null || _a === void 0 ? void 0 : _a.trim()) || anchor.find("h2").text().trim() || "";
                        // Image - try multiple attributes for better extraction
                        var imgElement = anchor.find("img");
                        var img = imgElement.attr("data-original") ||
                            imgElement.attr("data-src") ||
                            imgElement.attr("data-lazy") ||
                            imgElement.attr("src") ||
                            "";
                        // Additional fallback: check parent elements for images
                        if (!img) {
                            img = $_1(el).find("img").attr("data-original") ||
                                $_1(el).find("img").attr("data-src") ||
                                $_1(el).find("img").attr("src") ||
                                "";
                        }
                        var image = img ? resolveUrl_1(img) : "";
                        if (!title || !image)
                            return;
                        // Additional deduplication by title to avoid same content with different URLs
                        if (seenTitles_1.has(title.toLowerCase()))
                            return;
                        seen_1.add(link);
                        seenTitles_1.add(title.toLowerCase());
                        catalog_1.push({ title: title, link: link, image: image });
                    });
                    return [2 /*return*/, catalog_1]; // No need for slice since we limit during processing
                case 2:
                    err_1 = _d.sent();
                    console.error("fetchPosts error:", err_1 instanceof Error ? err_1.message : String(err_1));
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
