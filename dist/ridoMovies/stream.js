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
exports.getStream = void 0;
var getStream = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var cheerio, headers_1, axios, getBaseUrl, baseUrl_1, slug_1, streamLinks_1, slugParts, fileName, searchQuery, searchUrl, searchRes, searchData, match, content, pageRes, $_1, pageError_1, e_1;
    var _c, _d, _e, _f;
    var link = _b.link, providerContext = _b.providerContext;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 9, , 10]);
                cheerio = providerContext.cheerio, headers_1 = providerContext.commonHeaders, axios = providerContext.axios, getBaseUrl = providerContext.getBaseUrl;
                return [4 /*yield*/, getBaseUrl("ridomovies")];
            case 1:
                baseUrl_1 = _g.sent();
                console.log("ridomovies stream link:", link);
                slug_1 = link.replace(baseUrl_1 + "/", "");
                console.log("ridomovies stream slug:", slug_1);
                streamLinks_1 = [];
                slugParts = slug_1.split('/');
                fileName = slugParts[slugParts.length - 1];
                searchQuery = "lego";
                searchUrl = "".concat(baseUrl_1, "/core/api/search?q=").concat(encodeURIComponent(searchQuery));
                console.log("ridomovies stream search URL (strategy 1):", searchUrl);
                return [4 /*yield*/, axios.get(searchUrl, { headers: headers_1 })];
            case 2:
                searchRes = _g.sent();
                searchData = searchRes.data;
                console.log("ridomovies stream search response:", searchData);
                match = (_d = (_c = searchData === null || searchData === void 0 ? void 0 : searchData.data) === null || _c === void 0 ? void 0 : _c.items) === null || _d === void 0 ? void 0 : _d.find(function (it) { return (it === null || it === void 0 ? void 0 : it.fullSlug) === slug_1; });
                if (!!match) return [3 /*break*/, 4];
                searchQuery = "avengers";
                searchUrl = "".concat(baseUrl_1, "/core/api/search?q=").concat(encodeURIComponent(searchQuery));
                console.log("ridomovies stream search URL (strategy 2):", searchUrl);
                return [4 /*yield*/, axios.get(searchUrl, { headers: headers_1 })];
            case 3:
                searchRes = _g.sent();
                searchData = searchRes.data;
                match = (_f = (_e = searchData === null || searchData === void 0 ? void 0 : searchData.data) === null || _e === void 0 ? void 0 : _e.items) === null || _f === void 0 ? void 0 : _f.find(function (it) { return (it === null || it === void 0 ? void 0 : it.fullSlug) === slug_1; });
                _g.label = 4;
            case 4:
                if (!match || !match.contentable) {
                    throw new Error("No matching content found for streaming");
                }
                content = match.contentable;
                _g.label = 5;
            case 5:
                _g.trys.push([5, 7, , 8]);
                console.log("ridomovies scraping page for video sources:", link);
                return [4 /*yield*/, axios.get(link, {
                        headers: __assign(__assign({}, headers_1), { 'Referer': baseUrl_1 })
                    })];
            case 6:
                pageRes = _g.sent();
                $_1 = cheerio.load(pageRes.data);
                // Debug: Log page content structure
                console.log("ridomovies page title:", $_1('title').text());
                console.log("ridomovies page has video tags:", $_1('video').length);
                console.log("ridomovies page has iframe tags:", $_1('iframe').length);
                console.log("ridomovies page has script tags:", $_1('script').length);
                // Look for video sources in script tags
                $_1('script').each(function (i, element) {
                    var text = $_1(element).text();
                    // Check for various video URL patterns
                    if (text) {
                        // Look for direct video URLs
                        var videoUrls = text.match(/https?:\/\/[^\s"']+\.(mp4|m3u8|avi|mkv|webm)/gi);
                        if (videoUrls) {
                            videoUrls.forEach(function (url) {
                                streamLinks_1.push({
                                    link: url,
                                    server: "rido script",
                                    type: url.includes('.m3u8') ? "m3u8" : "mp4",
                                    headers: {
                                        Referer: baseUrl_1,
                                        'User-Agent': headers_1['User-Agent'],
                                    },
                                });
                            });
                        }
                        // Look for base64 encoded video URLs
                        var base64Urls = text.match(/data:video\/[^;]+;base64,[A-Za-z0-9+/=]+/g);
                        if (base64Urls) {
                            base64Urls.forEach(function (url) {
                                streamLinks_1.push({
                                    link: url,
                                    server: "rido base64",
                                    type: "mp4",
                                    headers: {
                                        Referer: baseUrl_1,
                                        'User-Agent': headers_1['User-Agent'],
                                    },
                                });
                            });
                        }
                        // Look for player URLs
                        var playerUrls = text.match(/https?:\/\/[^\s"']*player[^\s"']*/gi);
                        if (playerUrls) {
                            playerUrls.forEach(function (url) {
                                streamLinks_1.push({
                                    link: url,
                                    server: "rido player",
                                    type: "m3u8",
                                    headers: {
                                        Referer: baseUrl_1,
                                        'User-Agent': headers_1['User-Agent'],
                                    },
                                });
                            });
                        }
                    }
                });
                console.log("ridomovies page scraping found:", streamLinks_1.length, "sources");
                return [3 /*break*/, 8];
            case 7:
                pageError_1 = _g.sent();
                console.log("ridomovies page scraping error:", pageError_1);
                return [3 /*break*/, 8];
            case 8:
                console.log("ridomovies stream links found:", streamLinks_1.length);
                return [2 /*return*/, streamLinks_1];
            case 9:
                e_1 = _g.sent();
                console.log("ridomovies get stream error:", e_1);
                return [2 /*return*/, []];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.getStream = getStream;
