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
exports.getSearchPosts = exports.getPosts = void 0;
var getPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var getBaseUrl, axios, cheerio, baseUrl, pageSep, relativePath;
        var filter = _b.filter, page = _b.page, 
        // providerValue,
        signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    getBaseUrl = providerContext.getBaseUrl, axios = providerContext.axios, cheerio = providerContext.cheerio;
                    return [4 /*yield*/, getBaseUrl("showbox")];
                case 1:
                    baseUrl = _c.sent();
                    pageSep = filter.includes("?") ? "&" : "?";
                    relativePath = "".concat(filter).concat(pageSep, "page=").concat(page);
                    return [2 /*return*/, posts({ url: relativePath, signal: signal, baseUrl: baseUrl, axios: axios, cheerio: cheerio })];
            }
        });
    });
};
exports.getPosts = getPosts;
var getSearchPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var getBaseUrl, axios, cheerio, baseUrl, relativePath;
        var searchQuery = _b.searchQuery, page = _b.page, 
        // providerValue,
        signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    getBaseUrl = providerContext.getBaseUrl, axios = providerContext.axios, cheerio = providerContext.cheerio;
                    return [4 /*yield*/, getBaseUrl("showbox")];
                case 1:
                    baseUrl = _c.sent();
                    relativePath = "/search?keyword=".concat(encodeURIComponent(searchQuery), "&page=").concat(page);
                    return [2 /*return*/, posts({ url: relativePath, signal: signal, baseUrl: baseUrl, axios: axios, cheerio: cheerio })];
            }
        });
    });
};
exports.getSearchPosts = getSearchPosts;
function posts(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var workerUrl, res, retryCount, maxRetries, _loop_1, state_1, responseData, data, $_1, catalog_1, err_1;
        var _c, _d, _e;
        var url = _b.url, signal = _b.signal, baseUrl = _b.baseUrl, axios = _b.axios, cheerio = _b.cheerio;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 5, , 6]);
                    // Add delay to prevent rate limiting (Cloudflare Worker may enforce rate limits)
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 800); })];
                case 1:
                    // Add delay to prevent rate limiting (Cloudflare Worker may enforce rate limits)
                    _f.sent();
                    workerUrl = "".concat(baseUrl, "/api?url=").concat(encodeURIComponent(url));
                    res = void 0;
                    retryCount = 0;
                    maxRetries = 3;
                    _loop_1 = function () {
                        var error_1, retryDelay_1;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    _g.trys.push([0, 2, , 6]);
                                    return [4 /*yield*/, axios.get(workerUrl, {
                                            signal: signal,
                                            timeout: 30000, // 30 second timeout
                                        })];
                                case 1:
                                    res = _g.sent();
                                    return [2 /*return*/, "break"];
                                case 2:
                                    error_1 = _g.sent();
                                    if (!((((_c = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _c === void 0 ? void 0 : _c.status) === 429 || ((_d = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _d === void 0 ? void 0 : _d.status) === 403) && retryCount < maxRetries - 1)) return [3 /*break*/, 4];
                                    retryDelay_1 = (retryCount + 1) * 2000;
                                    console.log("Showbox worker rate limited (".concat((_e = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _e === void 0 ? void 0 : _e.status, "), retrying in ").concat(retryDelay_1, "ms..."));
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, retryDelay_1); })];
                                case 3:
                                    _g.sent();
                                    retryCount++;
                                    return [3 /*break*/, 5];
                                case 4: throw error_1; // Re-throw if not rate limit or max retries reached
                                case 5: return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    };
                    _f.label = 2;
                case 2:
                    if (!(retryCount < maxRetries)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1()];
                case 3:
                    state_1 = _f.sent();
                    if (state_1 === "break")
                        return [3 /*break*/, 4];
                    return [3 /*break*/, 2];
                case 4:
                    if (!res || !res.data) {
                        console.error('Showbox worker: No data received', workerUrl);
                        return [2 /*return*/, []];
                    }
                    responseData = res.data;
                    if (!responseData.html) {
                        console.error('Showbox worker: Missing HTML in response', responseData);
                        return [2 /*return*/, []];
                    }
                    data = responseData.html;
                    $_1 = cheerio.load(data);
                    catalog_1 = [];
                    $_1(".movie-item,.flw-item").map(function (i, element) {
                        var title = $_1(element).find(".film-name").text().trim();
                        var link = $_1(element).find("a").attr("href");
                        var image = $_1(element).find("img").attr("src");
                        if (title && link && image) {
                            catalog_1.push({
                                title: title,
                                link: link,
                                image: image,
                            });
                        }
                    });
                    return [2 /*return*/, catalog_1];
                case 5:
                    err_1 = _f.sent();
                    console.error('Showbox posts error:', err_1);
                    return [2 /*return*/, []];
                case 6: return [2 /*return*/];
            }
        });
    });
}
