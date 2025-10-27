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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
var axios_1 = __importDefault(require("axios"));
// Helper function to fetch movie poster from OMDB API
function getMoviePoster(title) {
    return __awaiter(this, void 0, void 0, function () {
        var cleanTitle, searchUrl, response, error_1, imageTitle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cleanTitle = title
                        .replace(/[#\$]/g, '') // Remove special characters
                        .replace(/\([^)]*\)/g, '') // Remove year in parentheses
                        .replace(/\s+/g, ' ') // Normalize spaces
                        .trim();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    searchUrl = "http://www.omdbapi.com/?apikey=trilogy&t=".concat(encodeURIComponent(cleanTitle));
                    return [4 /*yield*/, axios_1.default.get(searchUrl, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                            }
                        })];
                case 2:
                    response = _a.sent();
                    if (response.data && response.data.Response === 'True' && response.data.Poster && response.data.Poster !== 'N/A') {
                        return [2 /*return*/, response.data.Poster];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log("Error fetching poster for \"".concat(title, "\":"), error_1 instanceof Error ? error_1.message : error_1);
                    return [3 /*break*/, 4];
                case 4:
                    imageTitle = cleanTitle.length > 30 ? cleanTitle.slice(0, 30) : cleanTitle;
                    return [2 /*return*/, "https://via.placeholder.com/300x450/2c2c2c/ffffff.png?text=".concat(encodeURIComponent(imageTitle))];
            }
        });
    });
}
var getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios_2, cheerio, url, res, retryCount_1, maxRetries, error_2, data, $_1, pageTitle, title, links_1, directLinks_1, type, image, err_1;
        var _c;
        var link = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 12, , 13]);
                    axios_2 = providerContext.axios, cheerio = providerContext.cheerio;
                    url = link;
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
                    return [4 /*yield*/, axios_2.get(url, {
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
                    error_2 = _d.sent();
                    if (!(((_c = error_2 === null || error_2 === void 0 ? void 0 : error_2.response) === null || _c === void 0 ? void 0 : _c.status) === 429 && retryCount_1 < maxRetries - 1)) return [3 /*break*/, 7];
                    console.log("Rate limited, retrying in ".concat((retryCount_1 + 1) * 1000, "ms..."));
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, (retryCount_1 + 1) * 1000); })];
                case 6:
                    _d.sent();
                    retryCount_1++;
                    return [3 /*break*/, 8];
                case 7: throw error_2; // Re-throw if not rate limit or max retries reached
                case 8: return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 2];
                case 10:
                    if (!res || !res.data) {
                        throw new Error('No data received from server');
                    }
                    data = res.data;
                    $_1 = cheerio.load(data);
                    pageTitle = $_1("h1").text().trim() || url.split("/").filter(Boolean).pop() || "";
                    title = pageTitle.replace("Index of /", "").replace(/\/$/, "");
                    links_1 = [];
                    directLinks_1 = [];
                    // Parse directory structure
                    $_1("table tbody tr").each(function (i, element) {
                        var $row = $_1(element);
                        var linkElement = $row.find("td:first-child a");
                        var itemTitle = linkElement.text().trim();
                        var itemLink = linkElement.attr("href");
                        if (itemTitle &&
                            itemLink &&
                            itemTitle !== "../" &&
                            itemTitle !== "Parent Directory") {
                            // Construct full URL - handle both relative and absolute URLs
                            var fullLink = itemLink.startsWith('http')
                                ? itemLink
                                : (link.endsWith('/') ? link + itemLink : link + '/' + itemLink);
                            // If it's a directory (ends with /)
                            if (itemTitle.endsWith("/")) {
                                var cleanTitle = itemTitle.replace(/\/$/, "");
                                var episodeLinkUrl = itemLink.startsWith('http')
                                    ? itemLink
                                    : (link.endsWith('/') ? link + itemLink : link + '/' + itemLink);
                                links_1.push({
                                    episodesLink: episodeLinkUrl,
                                    title: cleanTitle,
                                });
                            }
                            // If it's a video file
                            else if (itemTitle.includes(".mp4") ||
                                itemTitle.includes(".mkv") ||
                                itemTitle.includes(".avi") ||
                                itemTitle.includes(".mov")) {
                                directLinks_1.push({
                                    title: itemTitle,
                                    link: fullLink,
                                });
                            }
                        }
                    });
                    // If there are direct video files, add them as a direct link group
                    if (directLinks_1.length > 0) {
                        links_1.push({
                            title: directLinks_1.length === 1 ? directLinks_1[0].title : title + " (Direct Files)",
                            directLinks: directLinks_1,
                        });
                    }
                    // If no links found (neither directories nor direct files), create a fallback
                    if (links_1.length === 0 && directLinks_1.length === 0) {
                        links_1.push({
                            title: title,
                            directLinks: [],
                        });
                    }
                    type = links_1.some(function (link) {
                        var _a, _b;
                        return ((_a = link.episodesLink) === null || _a === void 0 ? void 0 : _a.includes("Season")) ||
                            ((_b = link.episodesLink) === null || _b === void 0 ? void 0 : _b.includes("S0"));
                    })
                        ? "series"
                        : directLinks_1.length > 1
                            ? "series"
                            : "movie";
                    return [4 /*yield*/, getMoviePoster(title)];
                case 11:
                    image = _d.sent();
                    return [2 /*return*/, {
                            title: title,
                            synopsis: "Content from 111477.xyz directory",
                            image: image,
                            imdbId: "",
                            type: type,
                            linkList: links_1,
                        }];
                case 12:
                    err_1 = _d.sent();
                    console.error("111477 meta error:", err_1);
                    return [2 /*return*/, {
                            title: "",
                            synopsis: "",
                            image: "",
                            imdbId: "",
                            type: "movie",
                            linkList: [],
                        }];
                case 13: return [2 /*return*/];
            }
        });
    });
};
exports.getMeta = getMeta;
