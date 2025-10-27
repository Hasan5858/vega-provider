"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
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
    Cookie: "xla=s4t; _ga=GA1.1.1081149560.1756378968; _ga_BLZGKYN5PF=GS2.1.s1756378968$o1$g1$t1756378984$j44$l0$h0",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
};
var getPosts = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var getBaseUrl, axios, cheerio, baseUrl, url;
    var filter = _b.filter, page = _b.page, providerValue = _b.providerValue, signal = _b.signal, providerContext = _b.providerContext;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                getBaseUrl = providerContext.getBaseUrl, axios = providerContext.axios, cheerio = providerContext.cheerio;
                return [4 /*yield*/, getBaseUrl("Vega")];
            case 1:
                baseUrl = _c.sent();
                console.log("vegaGetPosts baseUrl:", providerValue, baseUrl);
                url = "".concat(baseUrl, "/").concat(filter, "/page/").concat(page, "/");
                console.log("vegaGetPosts url:", url);
                return [2 /*return*/, posts(baseUrl, url, signal, headers, axios, cheerio)];
        }
    });
}); };
exports.getPosts = getPosts;
var getSearchPosts = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var getBaseUrl, axios, cheerio, baseUrl, url;
    var searchQuery = _b.searchQuery, page = _b.page, providerValue = _b.providerValue, signal = _b.signal, providerContext = _b.providerContext;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                getBaseUrl = providerContext.getBaseUrl, axios = providerContext.axios, cheerio = providerContext.cheerio;
                return [4 /*yield*/, getBaseUrl("Vega")];
            case 1:
                baseUrl = _c.sent();
                console.log("vegaGetPosts baseUrl:", providerValue, baseUrl);
                url = "".concat(baseUrl, "/page/").concat(page, "/?s=").concat(searchQuery);
                console.log("vegaGetPosts url:", url);
                return [2 /*return*/, posts(baseUrl, url, signal, headers, axios, cheerio)];
        }
    });
}); };
exports.getSearchPosts = getSearchPosts;
function posts(baseUrl_1, url_1, signal_1) {
    return __awaiter(this, arguments, void 0, function (baseUrl, url, signal, headers, axios, cheerio) {
        var urlRes, $_1, _a, _b, posts_1, error_1;
        var _c, _d;
        if (headers === void 0) { headers = {}; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(url, {
                            headers: __assign(__assign({}, headers), { Referer: baseUrl }),
                            signal: signal,
                        })];
                case 1:
                    urlRes = _e.sent();
                    _b = (_a = cheerio).load;
                    return [4 /*yield*/, urlRes.text()];
                case 2:
                    $_1 = _b.apply(_a, [_e.sent()]);
                    posts_1 = [];
                    (_d = (_c = $_1(".blog-items,.post-list")) === null || _c === void 0 ? void 0 : _c.children("article")) === null || _d === void 0 ? void 0 : _d.each(function (index, element) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                        var post = {
                            title: (((_e = (_d = (_c = (_b = (_a = $_1(element)) === null || _a === void 0 ? void 0 : _a.find("a")) === null || _b === void 0 ? void 0 : _b.attr("title")) === null || _c === void 0 ? void 0 : _c.replace("Download", "")) === null || _d === void 0 ? void 0 : _d.match(/^(.*?)\s*\((\d{4})\)|^(.*?)\s*\((Season \d+)\)/)) === null || _e === void 0 ? void 0 : _e[0]) ||
                                ((_h = (_g = (_f = $_1(element)) === null || _f === void 0 ? void 0 : _f.find("a")) === null || _g === void 0 ? void 0 : _g.attr("title")) === null || _h === void 0 ? void 0 : _h.replace("Download", "")) ||
                                ((_k = (_j = $_1(element)) === null || _j === void 0 ? void 0 : _j.find(".post-title").text()) === null || _k === void 0 ? void 0 : _k.replace("Download", "")) ||
                                "").trim(),
                            link: ((_m = (_l = $_1(element)) === null || _l === void 0 ? void 0 : _l.find("a")) === null || _m === void 0 ? void 0 : _m.attr("href")) || "",
                            image: $_1(element).find("a").find("img").attr("data-lazy-src") ||
                                $_1(element).find("a").find("img").attr("data-src") ||
                                $_1(element).find("a").find("img").attr("src") ||
                                "",
                        };
                        if (post.image.startsWith("//")) {
                            post.image = "https:" + post.image;
                        }
                        posts_1.push(post);
                    });
                    // console.log(posts);
                    return [2 /*return*/, posts_1];
                case 3:
                    error_1 = _e.sent();
                    console.error("vegaGetPosts error:", error_1);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
