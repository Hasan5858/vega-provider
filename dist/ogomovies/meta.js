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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
exports.getMeta = void 0;
// Headers (omitted for brevity, assume they are the same)
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
/**
 * Deobfuscate JavaScript code using external API
 */
function deobfuscateCode(code, providerContext) {
    return __awaiter(this, void 0, void 0, function () {
        var axios, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    axios = providerContext.axios;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.post('https://js-deobfuscator-api.replit.app/api/deobfuscate', {
                            code: code
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            timeout: 10000
                        })];
                case 2:
                    response = _a.sent();
                    if (response.data.success) {
                        return [2 /*return*/, response.data.result];
                    }
                    else {
                        console.log("Deobfuscation failed:", response.data.error);
                        return [2 /*return*/, code]; // Return original code if deobfuscation fails
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log("Deobfuscation API error:", error_1.message);
                    return [2 /*return*/, code]; // Return original code if API fails
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Extract m3u8 links from embed page using deobfuscation
 */
function getM3u8FromEmbed(embedUrl, movieTitle, providerContext) {
    return __awaiter(this, void 0, void 0, function () {
        var axios, cheerio, finalLinks, embedResponse, $_1, evalPackedCode_1, deobfuscatedCode, m3u8Links, sourcesMatch, fileUrl, m3u8Matches, m3u8Matches_1, m3u8Matches_1_1, match, m3u8Url, error_2;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    finalLinks = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios.get(embedUrl, { headers: headers })];
                case 2:
                    embedResponse = _b.sent();
                    $_1 = cheerio.load(embedResponse.data);
                    evalPackedCode_1 = '';
                    $_1('script').each(function (_, el) {
                        var scriptContent = $_1(el).html();
                        if (scriptContent && scriptContent.includes('eval(')) {
                            // Extract the entire eval code using pattern matching
                            var evalStart = scriptContent.indexOf('eval(');
                            if (evalStart !== -1) {
                                // Find the end by looking for the pattern that ends with .split('|')))
                                var evalEndPattern = /\.split\('\|'\)\)\)/;
                                var match = scriptContent.substring(evalStart).match(evalEndPattern);
                                if (match && match.index !== undefined) {
                                    var evalEnd = evalStart + match.index + match[0].length;
                                    evalPackedCode_1 = scriptContent.substring(evalStart, evalEnd);
                                    return false; // Break the loop
                                }
                            }
                        }
                    });
                    if (!evalPackedCode_1) {
                        console.log("No eval packed code found in embed page");
                        return [2 /*return*/, finalLinks];
                    }
                    // Step 3: Deobfuscate the eval packed code
                    console.log("Deobfuscating eval packed code...");
                    return [4 /*yield*/, deobfuscateCode(evalPackedCode_1, providerContext)];
                case 3:
                    deobfuscatedCode = _b.sent();
                    m3u8Links = [];
                    sourcesMatch = deobfuscatedCode.match(/sources:\s*\[\s*\{\s*file:\s*["']([^"']+)["']/);
                    if (sourcesMatch) {
                        fileUrl = sourcesMatch[1];
                        // Check if it's an m3u8 URL
                        if (fileUrl.includes('.m3u8')) {
                            m3u8Links.push(fileUrl);
                        }
                    }
                    else {
                        m3u8Matches = deobfuscatedCode.matchAll(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/g);
                        try {
                            for (m3u8Matches_1 = __values(m3u8Matches), m3u8Matches_1_1 = m3u8Matches_1.next(); !m3u8Matches_1_1.done; m3u8Matches_1_1 = m3u8Matches_1.next()) {
                                match = m3u8Matches_1_1.value;
                                m3u8Url = match[0];
                                if (!m3u8Links.includes(m3u8Url)) {
                                    m3u8Links.push(m3u8Url);
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (m3u8Matches_1_1 && !m3u8Matches_1_1.done && (_a = m3u8Matches_1.return)) _a.call(m3u8Matches_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                    // Step 5: Create link objects for m3u8 streams
                    if (m3u8Links.length > 0) {
                        finalLinks.push({
                            title: "".concat(movieTitle, " - Adaptive Stream"),
                            quality: 'Adaptive',
                            episodesLink: embedUrl,
                            directLinks: m3u8Links.map(function (m3u8Url) { return ({
                                title: 'Adaptive Stream',
                                link: m3u8Url,
                                type: "movie",
                            }); }),
                        });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _b.sent();
                    console.error("Error extracting m3u8 from embed:", error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, finalLinks];
            }
        });
    });
}
/**
 * Simplified approach: Get download links directly from watching page
 */
function getDownloadLinks(movieUrl, movieTitle, providerContext) {
    return __awaiter(this, void 0, void 0, function () {
        var axios, cheerio, finalLinks, watchingUrl, watchingResponse, $, embedUrl, m3u8Links, downloadUrl_1, downloadResponse, $$_1, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    finalLinks = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    watchingUrl = movieUrl + 'watching/';
                    return [4 /*yield*/, axios.get(watchingUrl, { headers: headers })];
                case 2:
                    watchingResponse = _a.sent();
                    $ = cheerio.load(watchingResponse.data);
                    embedUrl = $('li[data-drive]').attr('data-drive');
                    if (!embedUrl) {
                        console.log("Failed to find embed URL in watching page.");
                        return [2 /*return*/, finalLinks];
                    }
                    return [4 /*yield*/, getM3u8FromEmbed(embedUrl, movieTitle, providerContext)];
                case 3:
                    m3u8Links = _a.sent();
                    finalLinks.push.apply(finalLinks, __spreadArray([], __read(m3u8Links), false));
                    downloadUrl_1 = embedUrl.replace('/embed-', '/');
                    return [4 /*yield*/, axios.get(downloadUrl_1, { headers: headers })];
                case 4:
                    downloadResponse = _a.sent();
                    $$_1 = cheerio.load(downloadResponse.data);
                    // Extract download buttons with download_video() calls
                    $$_1('button[onclick^="download_video"]').each(function (_, element) {
                        var btnEl = $$_1(element);
                        var qualityText = btnEl.text().trim(); // e.g., "Normal quality 1128x480, 1.2 GB"
                        // Extract Quality (e.g., Normal/Low) and Size (e.g., 1.2 GB)
                        var qualityMatch = qualityText.match(/(Normal|Low)\squality/i);
                        var quality = qualityMatch ? qualityMatch[1] : 'Unknown';
                        var sizeMatch = qualityText.match(/(\d+(\.\d+)?\s(GB|MB))$/i);
                        var size = sizeMatch ? sizeMatch[0] : 'Unknown Size';
                        // Construct link object for download buttons
                        finalLinks.push({
                            title: "".concat(movieTitle, " - ").concat(qualityText),
                            quality: quality,
                            episodesLink: downloadUrl_1, // Points to download page
                            directLinks: [
                                {
                                    title: "Download (".concat(size, ")"),
                                    link: downloadUrl_1,
                                    type: "movie",
                                },
                            ],
                        });
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error("Error during simplified download link extraction:", error_3);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, finalLinks];
            }
        });
    });
}
var getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio, url, baseUrl, emptyResult, response, $_2, detailEl, result_1, qualityText, finalLinks_1, deepDownloadLinks, err_1;
        var link = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    url = link;
                    baseUrl = url.split("/").slice(0, 3).join("/");
                    emptyResult = {
                        title: "",
                        synopsis: "",
                        image: "",
                        imdbId: "",
                        type: "movie",
                        linkList: [],
                    };
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, axios.get(url, {
                            headers: __assign(__assign({}, headers), { Referer: baseUrl }),
                        })];
                case 2:
                    response = _c.sent();
                    $_2 = cheerio.load(response.data);
                    detailEl = $_2(".main-detail");
                    result_1 = {
                        title: "",
                        synopsis: "",
                        image: "",
                        imdbId: "",
                        type: "movie",
                        linkList: [],
                    };
                    // --- Metadata Extraction ---
                    result_1.title = detailEl.find(".detail-mod h3").text().trim() ||
                        detailEl.find(".breadcrumb .active span[itemprop='name']").text().trim().replace('(Tamil)', '').trim() ||
                        $_2("title").text().split("|")[0].trim();
                    result_1.image = detailEl.find(".dm-thumb img").attr("src") || "";
                    if (result_1.image.startsWith("//"))
                        result_1.image = "https:" + result_1.image;
                    result_1.synopsis = detailEl.find(".desc p").text().trim() || "Synopsis not found.";
                    result_1.imdbId = detailEl.find("#imdb_id").text().trim();
                    result_1.type = "movie";
                    qualityText = detailEl.find(".mvici-right .quality a").text().trim() || "Unknown";
                    finalLinks_1 = [];
                    return [4 /*yield*/, getDownloadLinks(url, result_1.title, providerContext)];
                case 3:
                    deepDownloadLinks = _c.sent();
                    finalLinks_1 = finalLinks_1.concat(deepDownloadLinks);
                    // 2. Fetch External Links (excluding "Download Android APP")
                    detailEl.find(".mobile-btn a.mod-btn").each(function (index, element) {
                        var _a;
                        var btnEl = $_2(element);
                        var linkUrl = btnEl.attr("href");
                        var rawTitle = (_a = btnEl.attr("title")) !== null && _a !== void 0 ? _a : '';
                        var fallbackTitle = btnEl.text().trim();
                        var title = rawTitle.trim() || fallbackTitle;
                        // EXCLUSION: Skip the Android App link
                        if (title.includes('Download Android APP')) {
                            return;
                        }
                        if (linkUrl && (title.includes('Download') || title.includes('Watch') || title.includes('Join Us'))) {
                            finalLinks_1.push({
                                title: "".concat(result_1.title, " - ").concat(title),
                                quality: 'External Link',
                                episodesLink: linkUrl,
                                directLinks: [
                                    {
                                        title: title,
                                        link: linkUrl,
                                        type: "movie",
                                    }
                                ]
                            });
                        }
                    });
                    result_1.linkList = finalLinks_1;
                    return [2 /*return*/, result_1];
                case 4:
                    err_1 = _c.sent();
                    console.log("getMeta error:", err_1);
                    return [2 /*return*/, emptyResult];
                case 5: return [2 /*return*/];
            }
        });
    });
};
exports.getMeta = getMeta;
