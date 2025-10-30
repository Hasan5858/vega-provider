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
var SUPPORTED_AGGREGATE_SERVERS = [
    /gofile\.io\/d\//i,
    /gdflix/i,
    /hubcloud/i,
    /filepress\./i,
];
var UNSUPPORTED_SERVERS = /media\.cm|dgdrive|hubdrive|gdtot/i;
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
function getStream(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio, extractors, hubcloudExtracter, streamtapeExtractor, streamhgExtractor, gdFlixExtracter, filepresExtractor, gofileExtracter, target_1, id, res, $, anchors, collected_2, _loop_1, anchors_1, anchors_1_1, anchor, e_1_1, validated, collected_1, collected_1_1, stream, head, contentType, error_1, e_2_1, cleaned, shg, arr, st, arr, fallbackStreams, cleanedFallback, error_2;
        var e_1, _c, e_2, _d;
        var _e, _f;
        var link = _b.link, type = _b.type, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_g) {
            switch (_g.label) {
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
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 27, , 28]);
                    console.log("[skyMovieHD] Incoming link:", link);
                    target_1 = link;
                    // Normalize StreamHG hglink -> dumbalag embed
                    if (/hglink\.to\//i.test(target_1)) {
                        try {
                            id = (target_1.match(/hglink\.to\/([A-Za-z0-9_-]{4,})/i) || [])[1];
                            if (id)
                                target_1 = "https://dumbalag.com/e/".concat(id);
                        }
                        catch (_h) { }
                    }
                    if (!/howblogs\.xyz\//i.test(target_1)) return [3 /*break*/, 21];
                    console.log("[skyMovieHD] Loading howblogs aggregator:", target_1);
                    return [4 /*yield*/, axios.get(target_1, { signal: signal, headers: REQUEST_HEADERS })];
                case 2:
                    res = _g.sent();
                    $ = cheerio.load(res.data || "");
                    anchors = $("a[href]").toArray();
                    collected_2 = [];
                    _loop_1 = function (anchor) {
                        var hrefRaw, href, id, gofile, stream, error_3, streams, error_4, streams, error_5, streams, error_6;
                        return __generator(this, function (_j) {
                            switch (_j.label) {
                                case 0:
                                    hrefRaw = ($(anchor).attr("href") || "").trim();
                                    if (!hrefRaw)
                                        return [2 /*return*/, "continue"];
                                    href = hrefRaw.startsWith("//") ? "https:".concat(hrefRaw) : hrefRaw;
                                    if (UNSUPPORTED_SERVERS.test(href)) {
                                        console.log("[skyMovieHD] ⏭️ Skipping unsupported server:", href);
                                        return [2 /*return*/, "continue"];
                                    }
                                    if (!SUPPORTED_AGGREGATE_SERVERS.some(function (regex) { return regex.test(href); })) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    if (!/gofile\.io\/d\//i.test(href)) return [3 /*break*/, 5];
                                    id = (_e = href.split("/d/")[1]) === null || _e === void 0 ? void 0 : _e.split(/[?#]/)[0];
                                    if (!id) {
                                        console.log("[skyMovieHD] ⚠️ Unable to extract GoFile id from:", href);
                                        return [2 /*return*/, "continue"];
                                    }
                                    _j.label = 1;
                                case 1:
                                    _j.trys.push([1, 3, , 4]);
                                    console.log("[skyMovieHD] 🔗 Resolving GoFile:", id);
                                    return [4 /*yield*/, gofileExtracter(id)];
                                case 2:
                                    gofile = _j.sent();
                                    stream = normaliseStream({
                                        server: "GoFile",
                                        link: gofile === null || gofile === void 0 ? void 0 : gofile.link,
                                        type: inferTypeFromUrl((gofile === null || gofile === void 0 ? void 0 : gofile.link) || ""),
                                        headers: __assign(__assign({}, DEFAULT_STREAM_HEADERS), { Referer: "https://gofile.io/", Authorization: (gofile === null || gofile === void 0 ? void 0 : gofile.token)
                                                ? "Bearer ".concat(gofile.token)
                                                : undefined }),
                                    }, "GoFile");
                                    if (stream) {
                                        collected_2.push(stream);
                                    }
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_3 = _j.sent();
                                    console.log("[skyMovieHD] ❌ GoFile extraction failed:", error_3);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/, "continue"];
                                case 5:
                                    if (!/gdflix/i.test(href)) return [3 /*break*/, 10];
                                    _j.label = 6;
                                case 6:
                                    _j.trys.push([6, 8, , 9]);
                                    console.log("[skyMovieHD] 🔗 Resolving GDFlix:", href);
                                    return [4 /*yield*/, gdFlixExtracter(href, signal)];
                                case 7:
                                    streams = _j.sent();
                                    streams
                                        .filter(function (item) {
                                        var link = (item === null || item === void 0 ? void 0 : item.link) || "";
                                        if (!link)
                                            return false;
                                        // Skip PixelDrain wrappers – they trigger download UI instead of streaming.
                                        if (/pixeldrain|hubcdn|fastcdn-dl|pages\.dev/i.test(link)) {
                                            return false;
                                        }
                                        return true;
                                    })
                                        .forEach(function (item) {
                                        var stream = normaliseStream(__assign(__assign({}, item), { server: item.server || "GDFlix" }), "GDFlix", href);
                                        if (stream) {
                                            collected_2.push(stream);
                                        }
                                    });
                                    return [3 /*break*/, 9];
                                case 8:
                                    error_4 = _j.sent();
                                    console.log("[skyMovieHD] ❌ GDFlix extraction failed:", error_4);
                                    return [3 /*break*/, 9];
                                case 9: return [2 /*return*/, "continue"];
                                case 10:
                                    if (!/hubcloud/i.test(href)) return [3 /*break*/, 15];
                                    _j.label = 11;
                                case 11:
                                    _j.trys.push([11, 13, , 14]);
                                    console.log("[skyMovieHD] 🔗 Resolving HubCloud:", href);
                                    return [4 /*yield*/, hubcloudExtracter(href, signal)];
                                case 12:
                                    streams = _j.sent();
                                    streams
                                        .filter(function (item) {
                                        var link = (item === null || item === void 0 ? void 0 : item.link) || "";
                                        if (!link)
                                            return false;
                                        // Skip known slow CDN mirrors – we prefer direct hubcloud or google links.
                                        if (/pixeldrain|hubcdn|pages\.dev|fastcdn/i.test(link)) {
                                            return false;
                                        }
                                        return true;
                                    })
                                        .forEach(function (item) {
                                        var stream = normaliseStream(__assign(__assign({}, item), { server: item.server || "HubCloud" }), "HubCloud", href);
                                        if (stream) {
                                            collected_2.push(stream);
                                        }
                                    });
                                    return [3 /*break*/, 14];
                                case 13:
                                    error_5 = _j.sent();
                                    console.log("[skyMovieHD] ❌ HubCloud extraction failed:", error_5);
                                    return [3 /*break*/, 14];
                                case 14: return [2 /*return*/, "continue"];
                                case 15:
                                    if (!/filepress\./i.test(href)) return [3 /*break*/, 20];
                                    _j.label = 16;
                                case 16:
                                    _j.trys.push([16, 18, , 19]);
                                    console.log("[skyMovieHD] 🔗 Resolving FilePress:", href);
                                    return [4 /*yield*/, filepresExtractor(href, signal)];
                                case 17:
                                    streams = _j.sent();
                                    streams.forEach(function (item) {
                                        var stream = normaliseStream(__assign(__assign({}, item), { server: item.server || "FilePress" }), "FilePress", "https://new5.filepress.today/");
                                        if (stream) {
                                            collected_2.push(stream);
                                        }
                                    });
                                    return [3 /*break*/, 19];
                                case 18:
                                    error_6 = _j.sent();
                                    console.log("[skyMovieHD] ❌ FilePress extraction failed:", error_6);
                                    return [3 /*break*/, 19];
                                case 19: return [2 /*return*/, "continue"];
                                case 20: return [2 /*return*/];
                            }
                        });
                    };
                    _g.label = 3;
                case 3:
                    _g.trys.push([3, 8, 9, 10]);
                    anchors_1 = __values(anchors), anchors_1_1 = anchors_1.next();
                    _g.label = 4;
                case 4:
                    if (!!anchors_1_1.done) return [3 /*break*/, 7];
                    anchor = anchors_1_1.value;
                    return [5 /*yield**/, _loop_1(anchor)];
                case 5:
                    _g.sent();
                    _g.label = 6;
                case 6:
                    anchors_1_1 = anchors_1.next();
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 10];
                case 8:
                    e_1_1 = _g.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 10];
                case 9:
                    try {
                        if (anchors_1_1 && !anchors_1_1.done && (_c = anchors_1.return)) _c.call(anchors_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 10:
                    validated = [];
                    _g.label = 11;
                case 11:
                    _g.trys.push([11, 18, 19, 20]);
                    collected_1 = __values(collected_2), collected_1_1 = collected_1.next();
                    _g.label = 12;
                case 12:
                    if (!!collected_1_1.done) return [3 /*break*/, 17];
                    stream = collected_1_1.value;
                    _g.label = 13;
                case 13:
                    _g.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, axios.head(stream.link, {
                            headers: stream.headers,
                            signal: signal,
                            timeout: 8000,
                            maxRedirects: 5,
                            validateStatus: function (status) {
                                return (status >= 200 && status < 400) || status === 403;
                            },
                        })];
                case 14:
                    head = _g.sent();
                    contentType = ((_f = head.headers) === null || _f === void 0 ? void 0 : _f["content-type"]) || "";
                    if ((head.status === 200 || head.status === 206) &&
                        /video|octet-stream/i.test(contentType)) {
                        validated.push(stream);
                    }
                    else if (head.status === 302 || head.status === 301) {
                        // allow redirect chains for hosts like gofile
                        validated.push(stream);
                    }
                    else {
                        console.log("[skyMovieHD] ⚠️ Dropping non-video stream:", stream.server, head.status, contentType);
                    }
                    return [3 /*break*/, 16];
                case 15:
                    error_1 = _g.sent();
                    console.log("[skyMovieHD] ⚠️ Stream validation failed:", stream.server, (error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || error_1);
                    return [3 /*break*/, 16];
                case 16:
                    collected_1_1 = collected_1.next();
                    return [3 /*break*/, 12];
                case 17: return [3 /*break*/, 20];
                case 18:
                    e_2_1 = _g.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 20];
                case 19:
                    try {
                        if (collected_1_1 && !collected_1_1.done && (_d = collected_1.return)) _d.call(collected_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 20:
                    cleaned = dedupeStreams(validated.map(function (stream) { return (__assign(__assign({}, stream), { type: stream.type || inferTypeFromUrl(stream.link) })); })).sort(function (a, b) { return preferHostScore(b.link) - preferHostScore(a.link); });
                    console.log("[skyMovieHD] ✅ Aggregator resolved streams:", cleaned.map(function (item) {
                        var _a;
                        return ({
                            server: item.server,
                            type: item.type,
                            link: (_a = item.link) === null || _a === void 0 ? void 0 : _a.slice(0, 120),
                        });
                    }));
                    return [2 /*return*/, cleaned];
                case 21:
                    if (!(/dumbalag\.com\//i.test(target_1) && typeof streamhgExtractor === "function")) return [3 /*break*/, 23];
                    return [4 /*yield*/, streamhgExtractor(target_1, axios, signal)];
                case 22:
                    shg = _g.sent();
                    if (shg) {
                        arr = [
                            { server: "StreamHG", link: shg.link, type: shg.type || "m3u8", headers: shg.headers },
                        ];
                        return [2 /*return*/, arr];
                    }
                    _g.label = 23;
                case 23:
                    if (!(/streamtape|watchadsontape|tape/i.test(target_1) && typeof streamtapeExtractor === "function")) return [3 /*break*/, 25];
                    return [4 /*yield*/, streamtapeExtractor(target_1, axios, signal)];
                case 24:
                    st = _g.sent();
                    if (st) {
                        arr = [
                            { server: "StreamTape", link: st.link, type: st.type || "mp4", headers: st.headers },
                        ];
                        return [2 /*return*/, arr];
                    }
                    _g.label = 25;
                case 25:
                    // Fallback
                    console.log("[skyMovieHD] ⚠️ Falling back to HubCloud extractor");
                    return [4 /*yield*/, hubcloudExtracter(target_1, signal)];
                case 26:
                    fallbackStreams = _g.sent();
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
                case 27:
                    error_2 = _g.sent();
                    console.log("[skyMovieHD] ❌ getStream error:", (error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || error_2);
                    return [2 /*return*/, []];
                case 28: return [2 /*return*/];
            }
        });
    });
}
