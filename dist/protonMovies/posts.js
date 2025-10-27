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
        var getBaseUrl, axios, cheerio, baseUrl, url;
        var filter = _b.filter, page = _b.page, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    getBaseUrl = providerContext.getBaseUrl, axios = providerContext.axios, cheerio = providerContext.cheerio;
                    return [4 /*yield*/, getBaseUrl("protonMovies")];
                case 1:
                    baseUrl = _c.sent();
                    url = "".concat(baseUrl + filter, "/page/").concat(page, "/");
                    return [2 /*return*/, posts({ url: url, baseUrl: baseUrl, signal: signal, axios: axios, cheerio: cheerio })];
            }
        });
    });
};
exports.getPosts = getPosts;
var getSearchPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var getBaseUrl, axios, cheerio, baseUrl, url;
        var searchQuery = _b.searchQuery, page = _b.page, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    getBaseUrl = providerContext.getBaseUrl, axios = providerContext.axios, cheerio = providerContext.cheerio;
                    return [4 /*yield*/, getBaseUrl("protonMovies")];
                case 1:
                    baseUrl = _c.sent();
                    url = "".concat(baseUrl, "/search/").concat(searchQuery, "/page/").concat(page, "/");
                    return [2 /*return*/, posts({ url: url, baseUrl: baseUrl, signal: signal, axios: axios, cheerio: cheerio })];
            }
        });
    });
};
exports.getSearchPosts = getSearchPosts;
function posts(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var decodeHtml, res, data, regex, htmlArray, html, $_1, catalog_1, err_1;
        var url = _b.url, baseUrl = _b.baseUrl, signal = _b.signal, axios = _b.axios, cheerio = _b.cheerio;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    decodeHtml = function (encodedArray) {
                        // Join array elements into a single string
                        var joined = encodedArray.join("");
                        // Replace escaped quotes
                        var unescaped = joined.replace(/\\"/g, '"').replace(/\\'/g, "'");
                        // Remove remaining escape characters
                        var cleaned = unescaped
                            .replace(/\\n/g, "\n")
                            .replace(/\\t/g, "\t")
                            .replace(/\\r/g, "\r");
                        // Convert literal string representations back to characters
                        var decoded = cleaned
                            .replace(/&quot;/g, '"')
                            .replace(/&lt;/g, "<")
                            .replace(/&gt;/g, ">")
                            .replace(/&amp;/g, "&");
                        return decoded;
                    };
                    return [4 /*yield*/, axios.get(url, {
                            headers: {
                                referer: baseUrl,
                            },
                            signal: signal,
                        })];
                case 1:
                    res = _c.sent();
                    data = res.data;
                    regex = /\[(?=.*?"<div class")(.*?)\]/g;
                    htmlArray = data === null || data === void 0 ? void 0 : data.match(regex);
                    html = decodeHtml(JSON.parse(htmlArray[htmlArray.length - 1]));
                    $_1 = cheerio.load(html);
                    catalog_1 = [];
                    $_1(".col.mb-4").map(function (i, element) {
                        var title = $_1(element).find("h5").text();
                        var link = $_1(element).find("h5").find("a").attr("href");
                        var image = $_1(element).find("img").attr("data-src") ||
                            $_1(element).find("img").attr("src") ||
                            "";
                        if (title && link && image) {
                            catalog_1.push({
                                title: title,
                                link: link,
                                image: image,
                            });
                        }
                    });
                    return [2 /*return*/, catalog_1];
                case 2:
                    err_1 = _c.sent();
                    console.error("protonGetPosts error ", err_1);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
