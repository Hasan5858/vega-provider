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
exports.getStream = void 0;
var getStream = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var cheerio, headers_1, axios, getBaseUrl, baseUrl, slug_1, streamLinks_1, searchQuery, searchUrl, searchRes, searchData, match, content, slugParts, movieSlug, embedUrl, apiUrl, apiRes, apiData, streamData, embedLink, apiError_1, embedRes, setCookieHeaders, cookies_1, $embed_1, uniqueStreams, embedError_1, e_1;
    var _c, _d, _e, _f;
    var link = _b.link, providerContext = _b.providerContext;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 15, , 16]);
                cheerio = providerContext.cheerio, headers_1 = providerContext.commonHeaders, axios = providerContext.axios, getBaseUrl = providerContext.getBaseUrl;
                return [4 /*yield*/, getBaseUrl("ridomovies")];
            case 1:
                baseUrl = _g.sent();
                console.log("ridomovies stream link:", link);
                slug_1 = link.replace(baseUrl + "/", "");
                console.log("ridomovies stream slug:", slug_1);
                streamLinks_1 = [];
                searchQuery = "lego";
                searchUrl = "".concat(baseUrl, "/core/api/search?q=").concat(encodeURIComponent(searchQuery));
                console.log("ridomovies stream search URL (strategy 1):", searchUrl);
                return [4 /*yield*/, axios.get(searchUrl, { headers: headers_1 })];
            case 2:
                searchRes = _g.sent();
                searchData = searchRes.data;
                console.log("ridomovies stream search response:", searchData);
                match = (_d = (_c = searchData === null || searchData === void 0 ? void 0 : searchData.data) === null || _c === void 0 ? void 0 : _c.items) === null || _d === void 0 ? void 0 : _d.find(function (it) { return (it === null || it === void 0 ? void 0 : it.fullSlug) === slug_1; });
                if (!!match) return [3 /*break*/, 4];
                searchQuery = "avengers";
                searchUrl = "".concat(baseUrl, "/core/api/search?q=").concat(encodeURIComponent(searchQuery));
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
                slugParts = slug_1.split('/');
                movieSlug = slugParts[slugParts.length - 1];
                console.log("ridomovies movie slug:", movieSlug);
                embedUrl = null;
                _g.label = 5;
            case 5:
                _g.trys.push([5, 7, , 8]);
                apiUrl = "".concat(baseUrl, "/api/movies/").concat(movieSlug);
                console.log("ridomovies API URL for embed:", apiUrl);
                return [4 /*yield*/, axios.get(apiUrl, {
                        headers: __assign(__assign({}, headers_1), { 'Referer': link, 'Accept': '*/*' })
                    })];
            case 6:
                apiRes = _g.sent();
                apiData = apiRes.data;
                console.log("ridomovies API response:", JSON.stringify(apiData, null, 2));
                if ((apiData === null || apiData === void 0 ? void 0 : apiData.code) === 200 && (apiData === null || apiData === void 0 ? void 0 : apiData.data) && Array.isArray(apiData.data) && apiData.data.length > 0) {
                    streamData = apiData.data[0];
                    embedLink = streamData.link;
                    if (embedLink) {
                        // Construct embed URL: https://closeload.top/video/embed/{link}/
                        embedUrl = "https://closeload.top/video/embed/".concat(embedLink, "/");
                        console.log("ridomovies embed URL constructed:", embedUrl);
                    }
                    else {
                        console.log("ridomovies warning: No link field in API response");
                    }
                }
                else {
                    console.log("ridomovies warning: Invalid API response structure");
                }
                return [3 /*break*/, 8];
            case 7:
                apiError_1 = _g.sent();
                console.log("ridomovies API error:", apiError_1.message);
                if (apiError_1.response) {
                    console.log("ridomovies API error response:", apiError_1.response.status, apiError_1.response.data);
                }
                return [3 /*break*/, 8];
            case 8:
                if (!embedUrl) return [3 /*break*/, 13];
                _g.label = 9;
            case 9:
                _g.trys.push([9, 11, , 12]);
                console.log("ridomovies fetching embed page:", embedUrl);
                return [4 /*yield*/, axios.get(embedUrl, {
                        headers: __assign(__assign({}, headers_1), { 'Referer': link, 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'Accept-Language': 'en-US,en;q=0.9' }),
                        withCredentials: true,
                    })];
            case 10:
                embedRes = _g.sent();
                setCookieHeaders = embedRes.headers['set-cookie'] || [];
                cookies_1 = setCookieHeaders.join('; ');
                $embed_1 = cheerio.load(embedRes.data);
                // Extract contentUrl from JSON-LD structured data
                $embed_1('script[type="application/ld+json"]').each(function (i, element) {
                    try {
                        var jsonText = $embed_1(element).text();
                        var jsonData = JSON.parse(jsonText);
                        if (jsonData['@type'] === 'VideoObject' && jsonData.contentUrl) {
                            var contentUrl = jsonData.contentUrl;
                            console.log("ridomovies contentUrl found:", contentUrl);
                            // Determine stream type based on URL
                            // Priority: Check for HLS indicators first (even if URL has .mp4, if it's in /hls/ path, it's HLS)
                            var streamType = "m3u8";
                            if (contentUrl.includes('/hls/') || contentUrl.includes('master.txt') || contentUrl.includes('.m3u8')) {
                                streamType = "m3u8"; // HLS stream
                            }
                            else if (contentUrl.includes('.mp4') && !contentUrl.includes('/hls/')) {
                                streamType = "mp4"; // Direct MP4 stream
                            }
                            streamLinks_1.push({
                                link: contentUrl,
                                server: "rido closeload",
                                type: streamType,
                                headers: __assign({ Referer: 'https://closeload.top/', Origin: 'https://closeload.top', 'User-Agent': headers_1['User-Agent'] || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'Accept': '*/*', 'Accept-Language': 'en-US,en;q=0.9,bn;q=0.8', 'Accept-Encoding': 'gzip, deflate, br, zstd' }, (cookies_1 && { Cookie: cookies_1 })),
                            });
                        }
                    }
                    catch (parseError) {
                        console.log("ridomovies JSON-LD parse error:", parseError);
                    }
                });
                // Also look for HLS URLs in script tags (including obfuscated JavaScript)
                $embed_1('script').each(function (i, element) {
                    var text = $embed_1(element).text();
                    if (!text)
                        return;
                    // Look for HLS master playlist URLs (including .txt extensions and various patterns)
                    var hlsPatterns = [
                        /https?:\/\/[^\s"']+\/(?:hls|master|playlist)[^\s"']*\.(m3u8|txt)/gi,
                        /https?:\/\/[^\s"']+\.(playmix|cdnimages)[^\s"']*\/hls\/[^\s"']*(?:\.mp4)?\/?txt\/master\.txt/gi, // /txt/master.txt format
                        /https?:\/\/[^\s"']+\.(playmix|cdnimages)[^\s"']*\/hls\/[^\s"']*\.(mp4|txt)/gi,
                        /https?:\/\/[^\s"']*\/(?:txt\/)?master\.txt/gi,
                        /contentUrl["']?\s*:\s*["'](https?:\/\/[^"']+(?:\/txt\/)?master\.txt[^"']*)/gi,
                        /src["']?\s*:\s*["'](https?:\/\/[^"']+(?:\/txt\/)?master\.txt[^"']*)/gi,
                        /https?:\/\/srv\d+\.cdnimages\d+\.sbs\/hls\/[^\s"']+\.mp4\/txt\/master\.txt/gi, // Exact pattern from the network request
                    ];
                    hlsPatterns.forEach(function (pattern) {
                        var matches = text.match(pattern);
                        if (matches) {
                            matches.forEach(function (url) {
                                // Clean up the URL (remove quotes, whitespace)
                                var cleanUrl = url.replace(/["'\s]/g, '').trim();
                                if (cleanUrl && cleanUrl.includes('http')) {
                                    streamLinks_1.push({
                                        link: cleanUrl,
                                        server: "rido hls",
                                        type: "m3u8",
                                        headers: __assign({ Referer: 'https://closeload.top/', Origin: 'https://closeload.top', 'User-Agent': headers_1['User-Agent'] || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'Accept': '*/*', 'Accept-Language': 'en-US,en;q=0.9,bn;q=0.8', 'Accept-Encoding': 'gzip, deflate, br, zstd' }, (cookies_1 && { Cookie: cookies_1 })),
                                    });
                                }
                            });
                        }
                    });
                });
                uniqueStreams = streamLinks_1.filter(function (stream, index, self) {
                    return index === self.findIndex(function (s) { return s.link === stream.link; });
                });
                streamLinks_1.length = 0;
                streamLinks_1.push.apply(streamLinks_1, __spreadArray([], __read(uniqueStreams), false));
                console.log("ridomovies stream extraction found:", streamLinks_1.length, "sources");
                return [3 /*break*/, 12];
            case 11:
                embedError_1 = _g.sent();
                console.log("ridomovies embed page error:", embedError_1);
                return [3 /*break*/, 12];
            case 12: return [3 /*break*/, 14];
            case 13:
                console.log("ridomovies error: Could not get embed URL from API");
                _g.label = 14;
            case 14:
                console.log("ridomovies stream links found:", streamLinks_1.length);
                return [2 /*return*/, streamLinks_1];
            case 15:
                e_1 = _g.sent();
                console.log("ridomovies get stream error:", e_1);
                return [2 /*return*/, []];
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.getStream = getStream;
