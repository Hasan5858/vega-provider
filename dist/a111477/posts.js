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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;
// Helper function to fetch movie poster from OMDB API
// DISABLED: This was causing massive performance issues (100+ minutes load time)
// async function getMoviePoster(title: string): Promise<string> {
//   // Clean the title for better matching
//   const cleanTitle = title
//     .replace(/[#\$]/g, '') // Remove special characters
//     .replace(/\([^)]*\)/g, '') // Remove year in parentheses
//     .replace(/\s+/g, ' ') // Normalize spaces
//     .trim();
//   
//   try {
//     const searchUrl = `http://www.omdbapi.com/?apikey=trilogy&t=${encodeURIComponent(cleanTitle)}`;
//     const response = await axios.get(searchUrl, {
//       headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
//       }
//     });
//     
//     if (response.data && response.data.Response === 'True' && response.data.Poster && response.data.Poster !== 'N/A') {
//       return response.data.Poster;
//     }
//   } catch (error) {
//     console.log(`Error fetching poster for "${title}":`, error instanceof Error ? error.message : error);
//   }
//   
//   // Fallback to placeholder if API fails
//   const imageTitle = cleanTitle.length > 30 ? cleanTitle.slice(0, 30) : cleanTitle;
//   return `https://via.placeholder.com/200x300/2c2c2c/ffffff.png?text=${encodeURIComponent(imageTitle)}`;
// }
var getPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio, getBaseUrl, baseUrl, url, result, error_1;
        var filter = _b.filter, page = _b.page, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio, getBaseUrl = providerContext.getBaseUrl;
                    return [4 /*yield*/, getBaseUrl("a111477")];
                case 1:
                    baseUrl = _c.sent();
                    if (page > 1) {
                        return [2 /*return*/, []];
                    }
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    url = "".concat(baseUrl).concat(filter);
                    return [4 /*yield*/, posts({ baseUrl: baseUrl, url: url, signal: signal, axios: axios, cheerio: cheerio })];
                case 3:
                    result = _c.sent();
                    return [2 /*return*/, result.slice(0, 50)]; // Limit only for getPosts
                case 4:
                    error_1 = _c.sent();
                    console.error("Error in getPosts:", error_1);
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    });
};
exports.getPosts = getPosts;
var getSearchPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio, getBaseUrl, baseUrl, moviesPosts, tvsPosts, allPosts, filteredPosts, error_2;
        var searchQuery = _b.searchQuery, page = _b.page, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio, getBaseUrl = providerContext.getBaseUrl;
                    return [4 /*yield*/, getBaseUrl("a111477")];
                case 1:
                    baseUrl = _c.sent();
                    if (page > 1) {
                        return [2 /*return*/, []];
                    }
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, posts({
                            baseUrl: baseUrl,
                            url: "".concat(baseUrl, "/movies/"),
                            signal: signal,
                            axios: axios,
                            cheerio: cheerio,
                        })];
                case 3:
                    moviesPosts = _c.sent();
                    return [4 /*yield*/, posts({
                            baseUrl: baseUrl,
                            url: "".concat(baseUrl, "/tvs/"),
                            signal: signal,
                            axios: axios,
                            cheerio: cheerio,
                        })];
                case 4:
                    tvsPosts = _c.sent();
                    allPosts = __spreadArray(__spreadArray([], __read(moviesPosts), false), __read(tvsPosts), false);
                    filteredPosts = allPosts.filter(function (post) {
                        var title = post.title.toLowerCase();
                        var query = searchQuery.toLowerCase();
                        // Direct substring match
                        if (title.includes(query)) {
                            return true;
                        }
                        // Word boundary matching
                        var queryWords = query.split(/\s+/).filter(function (word) { return word.length > 0; });
                        var titleWords = title
                            .split(/[\s\-\.\(\)\[\]]+/)
                            .filter(function (word) { return word.length > 0; });
                        // Check if all query words are found in title words
                        var allWordsMatch = queryWords.every(function (queryWord) {
                            return titleWords.some(function (titleWord) { return titleWord.includes(queryWord); });
                        });
                        if (allWordsMatch) {
                            return true;
                        }
                        // Fuzzy matching for single word queries
                        if (queryWords.length === 1) {
                            var queryWord_1 = queryWords[0];
                            if (queryWord_1.length >= 3) {
                                // Check if any title word starts with the query
                                var startsWithMatch = titleWords.some(function (titleWord) {
                                    return titleWord.startsWith(queryWord_1);
                                });
                                if (startsWithMatch) {
                                    return true;
                                }
                                // Levenshtein distance for close matches
                                var hasCloseMatch = titleWords.some(function (titleWord) {
                                    if (Math.abs(titleWord.length - queryWord_1.length) > 2)
                                        return false;
                                    var distance = levenshteinDistance(titleWord, queryWord_1);
                                    return distance <= Math.max(1, Math.floor(queryWord_1.length * 0.2));
                                });
                                if (hasCloseMatch) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    });
                    return [2 /*return*/, filteredPosts];
                case 5:
                    error_2 = _c.sent();
                    console.error("Error in getSearchPosts:", error_2);
                    return [2 /*return*/, []];
                case 6: return [2 /*return*/];
            }
        });
    });
};
exports.getSearchPosts = getSearchPosts;
function posts(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var res, retryCount_1, maxRetries, error_3, data, $, catalog, rows, i, $row, linkElement, title, link, cleanTitle, fullLink, omdbSearchTitle, yearMatch, posterTitle, placeholderImage, omdbUrl, image, err_1;
        var _c;
        var baseUrl = _b.baseUrl, url = _b.url, signal = _b.signal, axios = _b.axios, cheerio = _b.cheerio;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 11, , 12]);
                    // Add a longer delay to prevent rate limiting
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 1:
                    // Add a longer delay to prevent rate limiting
                    _d.sent();
                    res = void 0;
                    retryCount_1 = 0;
                    maxRetries = 3;
                    _d.label = 2;
                case 2:
                    if (!(retryCount_1 < maxRetries)) return [3 /*break*/, 10];
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, 5, , 9]);
                    return [4 /*yield*/, axios.get(url, {
                            signal: signal,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                                'Accept-Language': 'en-US,en;q=0.9',
                                'Cache-Control': 'no-cache',
                                'Pragma': 'no-cache'
                            }
                        })];
                case 4:
                    res = _d.sent();
                    return [3 /*break*/, 10]; // Success, exit retry loop
                case 5:
                    error_3 = _d.sent();
                    if (!(((_c = error_3 === null || error_3 === void 0 ? void 0 : error_3.response) === null || _c === void 0 ? void 0 : _c.status) === 429 && retryCount_1 < maxRetries - 1)) return [3 /*break*/, 7];
                    console.log("Rate limited, retrying in ".concat((retryCount_1 + 1) * 1000, "ms..."));
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, (retryCount_1 + 1) * 1000); })];
                case 6:
                    _d.sent();
                    retryCount_1++;
                    return [3 /*break*/, 8];
                case 7: throw error_3; // Re-throw if not rate limit or max retries reached
                case 8: return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 2];
                case 10:
                    if (!res || !res.data) {
                        console.log('No data received from', url);
                        return [2 /*return*/, []];
                    }
                    data = res.data;
                    $ = cheerio.load(data);
                    catalog = [];
                    rows = $("table tbody tr");
                    for (i = 0; i < rows.length; i++) {
                        $row = $(rows[i]);
                        linkElement = $row.find("td:first-child a");
                        title = linkElement.text().trim();
                        link = linkElement.attr("href");
                        // Skip parent directory and files, only get folders
                        if (title &&
                            link &&
                            title !== "../" &&
                            title !== "Parent Directory" &&
                            title.endsWith("/")) {
                            cleanTitle = title.replace(/\/$/, "");
                            fullLink = url.endsWith('/') ? url + link : url + '/' + link;
                            omdbSearchTitle = cleanTitle;
                            yearMatch = cleanTitle.match(/^(.+?)\s*\(\d{4}\)$/);
                            if (yearMatch) {
                                omdbSearchTitle = yearMatch[1].trim();
                            }
                            else {
                                // First remove season/episode patterns (can have dots or spaces before)
                                // Patterns: S01E05, S01-E05, S01.E05, etc.
                                omdbSearchTitle = cleanTitle
                                    .replace(/[\s\.]*(S\d{2}|Season\s*\d+)[\.\s]*(E\d{2}|Episode\s*\d+)?.*$/i, '') // Remove season/episode and everything after
                                    .replace(/[\s\.]*(BATCH|COMPLETE|Collection|Series).*$/i, '') // Remove batch/complete/collection labels
                                    .replace(/[\s\.]*\d{3,4}p.*$/i, '') // Remove resolution info (720p, 1080p, etc.)
                                    .replace(/[\s\.]*WEB-DL.*$/i, '') // Remove quality info
                                    .replace(/[\s\.]*\[.*\].*$/i, '') // Remove bracketed info
                                    .replace(/\.[a-zA-Z0-9]+$/, '') // Remove file extensions
                                    .trim();
                                // Convert dots to spaces for better OMDB matching (show.name.2020 -> show name 2020)
                                omdbSearchTitle = omdbSearchTitle.replace(/\./g, ' ').trim();
                                // Remove extra spaces
                                omdbSearchTitle = omdbSearchTitle.replace(/\s+/g, ' ').trim();
                            }
                            posterTitle = cleanTitle.substring(0, 40);
                            placeholderImage = "https://via.placeholder.com/300x450/2a2a2a/ff6b35?text=".concat(encodeURIComponent(posterTitle));
                            omdbUrl = "https://www.omdbapi.com/?apikey=trilogy&t=".concat(encodeURIComponent(omdbSearchTitle), "&type=movie");
                            image = placeholderImage;
                            catalog.push({
                                title: cleanTitle,
                                link: fullLink,
                                image: image,
                                poster_url: omdbUrl, // For lazy-loading real posters (with fallback to placeholder)
                            });
                        }
                    }
                    // Only limit for regular getPosts, not for search
                    return [2 /*return*/, catalog];
                case 11:
                    err_1 = _d.sent();
                    console.error("111477 directory listing error:", err_1);
                    return [2 /*return*/, []];
                case 12: return [2 /*return*/];
            }
        });
    });
}
// Levenshtein distance function for fuzzy matching
function levenshteinDistance(str1, str2) {
    var matrix = Array(str2.length + 1)
        .fill(null)
        .map(function () { return Array(str1.length + 1).fill(null); });
    for (var i = 0; i <= str1.length; i++)
        matrix[0][i] = i;
    for (var j = 0; j <= str2.length; j++)
        matrix[j][0] = j;
    for (var j = 1; j <= str2.length; j++) {
        for (var i = 1; i <= str1.length; i++) {
            var indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(matrix[j][i - 1] + 1, // deletion
            matrix[j - 1][i] + 1, // insertion
            matrix[j - 1][i - 1] + indicator // substitution
            );
        }
    }
    return matrix[str2.length][str1.length];
}
