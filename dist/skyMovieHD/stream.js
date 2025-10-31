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
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractLazyServer = void 0;
exports.getStream = getStream;
var REQUEST_HEADERS = {
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
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
};
var DEFAULT_STREAM_HEADERS = {
    Range: "bytes=0-",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
};
var preferHostScore = function (url) {
    if (/googleusercontent\.com|googlevideo\.com|googleapis\.com/i.test(url)) {
        return 60;
    }
    if (/gofile\.io|gofilecdn\.com/i.test(url)) {
        return 110;
    }
    if (/filepress/i.test(url)) {
        return 90;
    }
    if (/hubcloud|hubcdn|cloudflarestorage/i.test(url)) {
        return 80;
    }
    if (/gdflix|resumecloud|resumebot|fastcdn/i.test(url)) {
        return 70;
    }
    return 10;
};
var inferTypeFromUrl = function (url) {
    if (/\.m3u8($|\?|#)/i.test(url))
        return "m3u8";
    if (/\.mkv($|\?|#)/i.test(url))
        return "mkv";
    if (/\.mpd($|\?|#)/i.test(url))
        return "mpd";
    if (/\.mp4($|\?|#)|googleusercontent\.com/i.test(url))
        return "mp4";
    return "mp4";
};
var withDefaultHeaders = function (stream) {
    var _a, _b, _c, _d;
    var url = stream.link || "";
    var headers = __assign({}, (stream.headers || {}));
    if (/googleusercontent\.com|googlevideo\.com|gofile\.io|gofilecdn\.com/i.test(url)) {
        (_a = headers.Range) !== null && _a !== void 0 ? _a : (headers.Range = DEFAULT_STREAM_HEADERS.Range);
        (_b = headers["User-Agent"]) !== null && _b !== void 0 ? _b : (headers["User-Agent"] = DEFAULT_STREAM_HEADERS["User-Agent"]);
    }
    if (/hubcloud|hubcdn|resume|pixel/i.test(url)) {
        (_c = headers.Range) !== null && _c !== void 0 ? _c : (headers.Range = DEFAULT_STREAM_HEADERS.Range);
        (_d = headers["User-Agent"]) !== null && _d !== void 0 ? _d : (headers["User-Agent"] = DEFAULT_STREAM_HEADERS["User-Agent"]);
    }
    Object.keys(headers).forEach(function (key) {
        if (headers[key] === undefined || headers[key] === null) {
            delete headers[key];
        }
    });
    if (!Object.keys(headers).length) {
        return __assign(__assign({}, stream), { headers: undefined });
    }
    return __assign(__assign({}, stream), { headers: headers });
};
var normaliseStream = function (raw, fallbackServer, referer) {
    var _a, _b;
    if (!(raw === null || raw === void 0 ? void 0 : raw.link))
        return null;
    var link = raw.link.trim();
    if (!link)
        return null;
    var server = ((_a = raw.server) === null || _a === void 0 ? void 0 : _a.trim()) || fallbackServer;
    var type = raw.type || inferTypeFromUrl(link);
    var normalised = __assign(__assign({}, raw), { server: server, link: link, type: type });
    if (referer) {
        var headers = __assign({}, (normalised.headers || {}));
        (_b = headers.Referer) !== null && _b !== void 0 ? _b : (headers.Referer = referer);
        normalised.headers = headers;
    }
    return withDefaultHeaders(normalised);
};
var dedupeStreams = function (streams) {
    var seen = new Set();
    return streams.filter(function (item) {
        var key = item.link;
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
};
/**
 * Check if a host has a working extractor
 */
var hasExtractor = function (href) {
    if (/indishare\.info/i.test(href))
        return true;
    if (/uptomega\.net/i.test(href))
        return true;
    if (/uploadhub\.dad/i.test(href))
        return true;
    if (/streamtape/i.test(href))
        return true;
    if (/voe\.sx/i.test(href))
        return true;
    if (/gofile\.io/i.test(href))
        return false; // Skip GoFile
    return false;
};
/**
 * Extract server name from URL
 */
var getServerName = function (href) {
    if (/indishare\.info/i.test(href))
        return "Indishare";
    if (/uptomega\.net/i.test(href))
        return "Uptomega";
    if (/uploadhub\.dad/i.test(href))
        return "Uploadhub";
    if (/streamtape/i.test(href))
        return "StreamTape";
    if (/voe\.sx/i.test(href))
        return "VOE";
    return "Unknown";
};
/**
 * Extract stream for a specific host/server
 * On-demand extraction routing
 */
var extractStreamForHost = function (href, axios, providerContext, signal) { return __awaiter(void 0, void 0, void 0, function () {
    var extractors, indishareExtractor, uptomegaExtractor, uploadhubExtractor, streamtapeExtractor, voeExtractor, streams, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                extractors = providerContext.extractors;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 12, , 13]);
                if (!/indishare\.info/i.test(href)) return [3 /*break*/, 3];
                indishareExtractor = extractors.indishareExtractor;
                if (!(typeof indishareExtractor === "function")) return [3 /*break*/, 3];
                return [4 /*yield*/, indishareExtractor(href, axios)];
            case 2: return [2 /*return*/, _a.sent()];
            case 3:
                if (!/uptomega\.net/i.test(href)) return [3 /*break*/, 5];
                uptomegaExtractor = extractors.uptomegaExtractor;
                if (!(typeof uptomegaExtractor === "function")) return [3 /*break*/, 5];
                return [4 /*yield*/, uptomegaExtractor(href, axios)];
            case 4: return [2 /*return*/, _a.sent()];
            case 5:
                if (!/uploadhub\.dad/i.test(href)) return [3 /*break*/, 7];
                uploadhubExtractor = extractors.uploadhubExtractor;
                if (!(typeof uploadhubExtractor === "function")) return [3 /*break*/, 7];
                return [4 /*yield*/, uploadhubExtractor(href, axios)];
            case 6: return [2 /*return*/, _a.sent()];
            case 7:
                if (!/streamtape/i.test(href)) return [3 /*break*/, 9];
                streamtapeExtractor = extractors.streamtapeExtractor;
                if (!(typeof streamtapeExtractor === "function")) return [3 /*break*/, 9];
                return [4 /*yield*/, streamtapeExtractor(href, axios, signal)];
            case 8: return [2 /*return*/, _a.sent()];
            case 9:
                if (!/voe\.sx/i.test(href)) return [3 /*break*/, 11];
                voeExtractor = extractors.voeExtractor;
                if (!(typeof voeExtractor === "function")) return [3 /*break*/, 11];
                return [4 /*yield*/, voeExtractor(href)];
            case 10:
                streams = _a.sent();
                if (streams && streams.length > 0) {
                    return [2 /*return*/, {
                            link: streams[0].link,
                            type: streams[0].type,
                            headers: streams[0].headers,
                        }];
                }
                _a.label = 11;
            case 11: return [2 /*return*/, null];
            case 12:
                error_1 = _a.sent();
                console.error("[skyMovieHD] Extraction error for ".concat(getServerName(href), ":"), error_1);
                return [2 /*return*/, null];
            case 13: return [2 /*return*/];
        }
    });
}); };
/**
 * Extract a single skyMovieHD server on-demand (lazy extraction)
 * Used when user selects a lazy-loaded server from the player
 */
var extractLazyServer = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, metadata, extracted, error_2;
        var link = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    axios = providerContext.axios;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    metadata = JSON.parse(link);
                    if (metadata.type !== "skymovie-lazy") {
                        console.error("[skyMovieHD] Invalid lazy-load metadata");
                        return [2 /*return*/, []];
                    }
                    console.log("[skyMovieHD] On-demand extraction for ".concat(metadata.serverName));
                    return [4 /*yield*/, extractStreamForHost(metadata.href, axios, providerContext)];
                case 2:
                    extracted = _c.sent();
                    if (extracted) {
                        console.log("[skyMovieHD] \u2705 Successfully extracted ".concat(metadata.serverName));
                        return [2 /*return*/, [{
                                    server: metadata.serverName,
                                    link: extracted.link,
                                    type: extracted.type || "mkv",
                                    headers: extracted.headers,
                                }]];
                    }
                    console.error("[skyMovieHD] \u274C Extraction failed for ".concat(metadata.serverName));
                    return [2 /*return*/, []];
                case 3:
                    error_2 = _c.sent();
                    console.error("[skyMovieHD] Lazy-load extraction error:", error_2);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.extractLazyServer = extractLazyServer;
function getStream(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio, extractors, hubcloudExtracter, streamtapeExtractor, streamhgExtractor, gdFlixExtracter, filepresExtractor, gofileExtracter, target_1, id, aggregatorUrls, parsed, pageType, collected, extractedCount, MAX_EAGER_EXTRACTIONS, seenServers, aggregatorUrls_1, aggregatorUrls_1_1, aggUrl, res, $, anchors, anchors_1, anchors_1_1, anchor, hrefRaw, href, serverName, extracted, stream, error_3, e_1_1, error_4, e_2_1, error_5, shg, arr, st, arr, fallbackStreams, cleanedFallback, error_6;
        var e_2, _c, e_1, _d;
        var link = _b.link, type = _b.type, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio, extractors = providerContext.extractors;
                    hubcloudExtracter = extractors.hubcloudExtracter;
                    streamtapeExtractor = extractors
                        .streamtapeExtractor;
                    streamhgExtractor = extractors
                        .streamhgExtractor;
                    gdFlixExtracter = extractors.gdFlixExtracter;
                    filepresExtractor = extractors.filepresExtractor;
                    gofileExtracter = extractors.gofileExtracter;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 32, , 33]);
                    console.log("[skyMovieHD] Incoming link:", link);
                    target_1 = link;
                    // Normalize StreamHG hglink -> dumbalag embed
                    if (/hglink\.to\//i.test(target_1)) {
                        try {
                            id = (target_1.match(/hglink\.to\/([A-Za-z0-9_-]{4,})/i) || [])[1];
                            if (id)
                                target_1 = "https://dumbalag.com/e/".concat(id);
                        }
                        catch (_f) { }
                    }
                    aggregatorUrls = [];
                    try {
                        parsed = JSON.parse(target_1);
                        if (parsed.server01 && parsed.watchOnline) {
                            aggregatorUrls = [parsed.server01, parsed.watchOnline];
                            console.log("[skyMovieHD] 📥 Loading merged aggregators (SERVER 01 + WATCH ONLINE)");
                        }
                    }
                    catch (_g) {
                        // Not JSON, check if it's a direct aggregator URL
                        if (/howblogs\.xyz\//i.test(target_1) || /skymovieshd\.(live|mba|bond|rest|red)\//i.test(target_1)) {
                            aggregatorUrls = [target_1];
                            pageType = /howblogs\.xyz\//i.test(target_1) ? "SERVER 01" : "WATCH ONLINE";
                            console.log("[skyMovieHD] \uD83D\uDCE5 Loading ".concat(pageType, " aggregator"));
                        }
                    }
                    if (!(aggregatorUrls.length > 0)) return [3 /*break*/, 26];
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 25, , 26]);
                    collected = [];
                    extractedCount = 0;
                    MAX_EAGER_EXTRACTIONS = 2;
                    seenServers = new Set();
                    _e.label = 3;
                case 3:
                    _e.trys.push([3, 22, 23, 24]);
                    aggregatorUrls_1 = __values(aggregatorUrls), aggregatorUrls_1_1 = aggregatorUrls_1.next();
                    _e.label = 4;
                case 4:
                    if (!!aggregatorUrls_1_1.done) return [3 /*break*/, 21];
                    aggUrl = aggregatorUrls_1_1.value;
                    _e.label = 5;
                case 5:
                    _e.trys.push([5, 19, , 20]);
                    return [4 /*yield*/, axios.get(aggUrl, { signal: signal, headers: REQUEST_HEADERS })];
                case 6:
                    res = _e.sent();
                    $ = cheerio.load(res.data || "");
                    anchors = $("a[href]").toArray();
                    _e.label = 7;
                case 7:
                    _e.trys.push([7, 16, 17, 18]);
                    anchors_1 = (e_1 = void 0, __values(anchors)), anchors_1_1 = anchors_1.next();
                    _e.label = 8;
                case 8:
                    if (!!anchors_1_1.done) return [3 /*break*/, 15];
                    anchor = anchors_1_1.value;
                    hrefRaw = ($(anchor).attr("href") || "").trim();
                    if (!hrefRaw)
                        return [3 /*break*/, 14];
                    href = hrefRaw.startsWith("//") ? "https:".concat(hrefRaw) : hrefRaw;
                    if (!/^https?:\/\//i.test(href))
                        return [3 /*break*/, 14];
                    // Skip GoFile - causes parsing errors with MKV files
                    if (/gofile\.io/i.test(href))
                        return [3 /*break*/, 14];
                    // Check if host has extractor
                    if (!hasExtractor(href))
                        return [3 /*break*/, 14];
                    serverName = getServerName(href);
                    // Skip if we've already seen this server
                    if (seenServers.has(serverName))
                        return [3 /*break*/, 14];
                    seenServers.add(serverName);
                    if (!(extractedCount < MAX_EAGER_EXTRACTIONS)) return [3 /*break*/, 13];
                    _e.label = 9;
                case 9:
                    _e.trys.push([9, 11, , 12]);
                    console.log("[skyMovieHD] \uD83D\uDD17 Resolving ".concat(serverName, ":"), href);
                    return [4 /*yield*/, extractStreamForHost(href, axios, providerContext, signal)];
                case 10:
                    extracted = _e.sent();
                    if (extracted) {
                        stream = normaliseStream({
                            server: serverName,
                            link: extracted.link,
                            type: extracted.type || "mkv",
                            headers: extracted.headers,
                        }, serverName);
                        if (stream) {
                            collected.push(stream);
                            console.log("[skyMovieHD] \u2705 ".concat(serverName, " stream added:"), stream.link.slice(0, 100));
                            extractedCount++;
                        }
                    }
                    return [3 /*break*/, 12];
                case 11:
                    error_3 = _e.sent();
                    console.log("[skyMovieHD] \u274C ".concat(serverName, " extraction failed:"), error_3);
                    return [3 /*break*/, 12];
                case 12: return [3 /*break*/, 14];
                case 13:
                    // Add remaining servers as lazy-load
                    console.log("[skyMovieHD] \uD83D\uDCA4 Adding ".concat(serverName, " as lazy-load"));
                    collected.push({
                        server: serverName,
                        link: JSON.stringify({
                            type: "skymovie-lazy",
                            serverName: serverName,
                            href: href,
                        }),
                        type: "lazy",
                    });
                    _e.label = 14;
                case 14:
                    anchors_1_1 = anchors_1.next();
                    return [3 /*break*/, 8];
                case 15: return [3 /*break*/, 18];
                case 16:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 18];
                case 17:
                    try {
                        if (anchors_1_1 && !anchors_1_1.done && (_d = anchors_1.return)) _d.call(anchors_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 18: return [3 /*break*/, 20];
                case 19:
                    error_4 = _e.sent();
                    console.log("[skyMovieHD] \u26A0\uFE0F Failed to fetch aggregator ".concat(aggUrl, ":"), error_4);
                    return [3 /*break*/, 20];
                case 20:
                    aggregatorUrls_1_1 = aggregatorUrls_1.next();
                    return [3 /*break*/, 4];
                case 21: return [3 /*break*/, 24];
                case 22:
                    e_2_1 = _e.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 24];
                case 23:
                    try {
                        if (aggregatorUrls_1_1 && !aggregatorUrls_1_1.done && (_c = aggregatorUrls_1.return)) _c.call(aggregatorUrls_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 24:
                    if (collected.length > 0) {
                        console.log("[skyMovieHD] \u2705 Total streams: ".concat(collected.length, " (").concat(extractedCount, " eager, ").concat(collected.length - extractedCount, " lazy)"));
                        return [2 /*return*/, dedupeStreams(collected)];
                    }
                    console.log("[skyMovieHD] ⚠️ No streams extracted from aggregators");
                    return [3 /*break*/, 26];
                case 25:
                    error_5 = _e.sent();
                    console.log("[skyMovieHD] ❌ Aggregator processing failed:", error_5);
                    return [2 /*return*/, []];
                case 26:
                    if (!(/dumbalag\.com\//i.test(target_1) && typeof streamhgExtractor === "function")) return [3 /*break*/, 28];
                    return [4 /*yield*/, streamhgExtractor(target_1, axios, signal)];
                case 27:
                    shg = _e.sent();
                    if (shg) {
                        arr = [
                            { server: "StreamHG", link: shg.link, type: shg.type || "m3u8", headers: shg.headers },
                        ];
                        return [2 /*return*/, arr];
                    }
                    _e.label = 28;
                case 28:
                    if (!(/streamtape|watchadsontape|tape/i.test(target_1) && typeof streamtapeExtractor === "function")) return [3 /*break*/, 30];
                    return [4 /*yield*/, streamtapeExtractor(target_1, axios, signal)];
                case 29:
                    st = _e.sent();
                    if (st) {
                        arr = [
                            { server: "StreamTape", link: st.link, type: st.type || "mp4", headers: st.headers },
                        ];
                        return [2 /*return*/, arr];
                    }
                    _e.label = 30;
                case 30:
                    // Fallback
                    console.log("[skyMovieHD] ⚠️ Falling back to HubCloud extractor");
                    return [4 /*yield*/, hubcloudExtracter(target_1, signal)];
                case 31:
                    fallbackStreams = _e.sent();
                    cleanedFallback = dedupeStreams(fallbackStreams
                        .map(function (stream) {
                        return normaliseStream(__assign(__assign({}, stream), { server: stream.server || "HubCloud" }), "HubCloud", target_1);
                    })
                        .filter(Boolean));
                    console.log("[skyMovieHD] 🔄 Fallback streams:", cleanedFallback.map(function (item) {
                        var _a;
                        return ({
                            server: item.server,
                            type: item.type,
                            link: (_a = item.link) === null || _a === void 0 ? void 0 : _a.slice(0, 120),
                        });
                    }));
                    return [2 /*return*/, cleanedFallback];
                case 32:
                    error_6 = _e.sent();
                    console.log("[skyMovieHD] ❌ getStream error:", (error_6 === null || error_6 === void 0 ? void 0 : error_6.message) || error_6);
                    return [2 /*return*/, []];
                case 33: return [2 /*return*/];
            }
        });
    });
}
