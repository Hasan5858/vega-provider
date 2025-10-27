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
var headers = {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Cache-Control": "no-store",
    "Accept-Language": "en-US,en;q=0.9",
    DNT: "1",
    "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
};
var getPosts = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var getBaseUrl, baseUrl, url;
    var filter = _b.filter, page = _b.page, 
    // providerValue,
    signal = _b.signal, providerContext = _b.providerContext;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                getBaseUrl = providerContext.getBaseUrl;
                return [4 /*yield*/, getBaseUrl("UhdMovies")];
            case 1:
                baseUrl = _c.sent();
                url = page === 1 ? "".concat(baseUrl, "/").concat(filter, "/") : "".concat(baseUrl + filter, "/page/").concat(page, "/");
                console.log("url", url);
                return [2 /*return*/, posts(baseUrl, url, signal, providerContext)];
        }
    });
}); };
exports.getPosts = getPosts;
var getSearchPosts = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var getBaseUrl, baseUrl, url;
    var searchQuery = _b.searchQuery, page = _b.page, 
    // providerValue,
    signal = _b.signal, providerContext = _b.providerContext;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                getBaseUrl = providerContext.getBaseUrl;
                return [4 /*yield*/, getBaseUrl("UhdMovies")];
            case 1:
                baseUrl = _c.sent();
                url = "".concat(baseUrl, "/search/").concat(searchQuery, "/page/").concat(page, "/");
                return [2 /*return*/, posts(baseUrl, url, signal, providerContext)];
        }
    });
}); };
exports.getSearchPosts = getSearchPosts;
function posts(baseURL, url, signal, providerContext) {
    return __awaiter(this, void 0, void 0, function () {
        var axios, cheerio, res, html, $_1, uhdCatalog_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    return [4 /*yield*/, axios.get(url, { headers: headers, signal: signal })];
                case 1:
                    res = _a.sent();
                    html = res.data;
                    $_1 = cheerio.load(html);
                    uhdCatalog_1 = [];
                    $_1(".gridlove-posts")
                        .find(".layout-masonry")
                        .each(function (index, element) {
                        var title = $_1(element).find("a").attr("title");
                        var link = $_1(element).find("a").attr("href");
                        var image = $_1(element).find("a").find("img").attr("src");
                        if (title && link && image) {
                            uhdCatalog_1.push({
                                title: title.replace("Download", "").trim(),
                                link: link,
                                image: image,
                            });
                        }
                    });
                    return [2 /*return*/, uhdCatalog_1];
                case 2:
                    err_1 = _a.sent();
                    console.error("uhd error ", err_1);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
