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
        var axios, cheerio, extractors, hubcloudExtracter, streamtapeExtractor, streamhgExtractor, gdFlixExtracter, filepresExtractor, gofileExtracter, target_1, id, res, $, anchors, collected_1, anchors_1, anchors_1_1, anchor, hrefRaw, href, st, stream, error_1, voeExtractor, voeStreams, error_2, e_1_1, cleaned, error_3, shg, arr, st, arr, fallbackStreams, cleanedFallback, error_4;
        var e_1, _c;
        var link = _b.link, type = _b.type, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_d) {
            switch (_d.label) {
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
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 28, , 29]);
                    console.log("[skyMovieHD] Incoming link:", link);
                    target_1 = link;
                    // Normalize StreamHG hglink -> dumbalag embed
                    if (/hglink\.to\//i.test(target_1)) {
                        try {
                            id = (target_1.match(/hglink\.to\/([A-Za-z0-9_-]{4,})/i) || [])[1];
                            if (id)
                                target_1 = "https://dumbalag.com/e/".concat(id);
                        }
                        catch (_e) { }
                    }
                    if (!/howblogs\.xyz\//i.test(target_1)) return [3 /*break*/, 22];
                    console.log("[skyMovieHD] 📥 Loading howblogs aggregator (SERVER 01):", target_1);
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 21, , 22]);
                    return [4 /*yield*/, axios.get(target_1, { signal: signal, headers: REQUEST_HEADERS })];
                case 3:
                    res = _d.sent();
                    $ = cheerio.load(res.data || "");
                    anchors = $("a[href]").toArray();
                    collected_1 = [];
                    _d.label = 4;
                case 4:
                    _d.trys.push([4, 18, 19, 20]);
                    anchors_1 = __values(anchors), anchors_1_1 = anchors_1.next();
                    _d.label = 5;
                case 5:
                    if (!!anchors_1_1.done) return [3 /*break*/, 17];
                    anchor = anchors_1_1.value;
                    hrefRaw = ($(anchor).attr("href") || "").trim();
                    if (!hrefRaw)
                        return [3 /*break*/, 16];
                    href = hrefRaw.startsWith("//") ? "https:".concat(hrefRaw) : hrefRaw;
                    if (!/^https?:\/\//i.test(href))
                        return [3 /*break*/, 16];
                    // Skip GoFile - causes parsing errors with MKV files
                    if (/gofile\.io/i.test(href)) {
                        console.log("[skyMovieHD] ⏭️ Skipping GoFile (causes parsing issues)");
                        return [3 /*break*/, 16];
                    }
                    if (!/streamtape/i.test(href)) return [3 /*break*/, 10];
                    _d.label = 6;
                case 6:
                    _d.trys.push([6, 8, , 9]);
                    console.log("[skyMovieHD] 🔗 Resolving StreamTape:", href);
                    return [4 /*yield*/, streamtapeExtractor(href, axios, signal)];
                case 7:
                    st = _d.sent();
                    if (st) {
                        stream = normaliseStream({
                            server: "StreamTape",
                            link: st.link,
                            type: st.type || "mp4",
                            headers: st.headers,
                        }, "StreamTape");
                        if (stream)
                            collected_1.push(stream);
                    }
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _d.sent();
                    console.log("[skyMovieHD] ❌ StreamTape extraction failed:", error_1);
                    return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 16];
                case 10:
                    if (!/voe\.sx|voe\./i.test(href)) return [3 /*break*/, 16];
                    _d.label = 11;
                case 11:
                    _d.trys.push([11, 14, , 15]);
                    console.log("[skyMovieHD] 🔗 Resolving VOE:", href);
                    voeExtractor = extractors.voeExtractor;
                    if (!(typeof voeExtractor === "function")) return [3 /*break*/, 13];
                    return [4 /*yield*/, voeExtractor(href, signal)];
                case 12:
                    voeStreams = _d.sent();
                    console.log("[skyMovieHD] VOE result:", (voeStreams === null || voeStreams === void 0 ? void 0 : voeStreams.length) || 0, "streams");
                    if (voeStreams && voeStreams.length > 0) {
                        voeStreams.forEach(function (voeStream) {
                            if (voeStream === null || voeStream === void 0 ? void 0 : voeStream.link) {
                                var stream = {
                                    server: "VOE",
                                    link: voeStream.link,
                                    type: voeStream.type || inferTypeFromUrl(voeStream.link) || "mp4",
                                    headers: voeStream.headers || DEFAULT_STREAM_HEADERS,
                                };
                                collected_1.push(stream);
                                console.log("[skyMovieHD] ✅ VOE stream added:", stream.link.slice(0, 100));
                            }
                        });
                    }
                    else {
                        console.log("[skyMovieHD] ⚠️ VOE returned no streams");
                    }
                    _d.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    error_2 = _d.sent();
                    console.log("[skyMovieHD] ❌ VOE extraction failed:", error_2);
                    return [3 /*break*/, 15];
                case 15: return [3 /*break*/, 16];
                case 16:
                    anchors_1_1 = anchors_1.next();
                    return [3 /*break*/, 5];
                case 17: return [3 /*break*/, 20];
                case 18:
                    e_1_1 = _d.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 20];
                case 19:
                    try {
                        if (anchors_1_1 && !anchors_1_1.done && (_c = anchors_1.return)) _c.call(anchors_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 20:
                    cleaned = dedupeStreams(collected_1);
                    console.log("[skyMovieHD] ✅ Total streams extracted:", collected_1.length);
                    console.log("[skyMovieHD] 📋 Servers:", cleaned.map(function (s) { return "".concat(s.server, " (").concat(s.type, ")"); }).join(", "));
                    return [2 /*return*/, cleaned];
                case 21:
                    error_3 = _d.sent();
                    console.log("[skyMovieHD] ❌ Howblogs aggregator failed:", error_3);
                    return [2 /*return*/, []];
                case 22:
                    if (!(/dumbalag\.com\//i.test(target_1) && typeof streamhgExtractor === "function")) return [3 /*break*/, 24];
                    return [4 /*yield*/, streamhgExtractor(target_1, axios, signal)];
                case 23:
                    shg = _d.sent();
                    if (shg) {
                        arr = [
                            { server: "StreamHG", link: shg.link, type: shg.type || "m3u8", headers: shg.headers },
                        ];
                        return [2 /*return*/, arr];
                    }
                    _d.label = 24;
                case 24:
                    if (!(/streamtape|watchadsontape|tape/i.test(target_1) && typeof streamtapeExtractor === "function")) return [3 /*break*/, 26];
                    return [4 /*yield*/, streamtapeExtractor(target_1, axios, signal)];
                case 25:
                    st = _d.sent();
                    if (st) {
                        arr = [
                            { server: "StreamTape", link: st.link, type: st.type || "mp4", headers: st.headers },
                        ];
                        return [2 /*return*/, arr];
                    }
                    _d.label = 26;
                case 26:
                    // Fallback
                    console.log("[skyMovieHD] ⚠️ Falling back to HubCloud extractor");
                    return [4 /*yield*/, hubcloudExtracter(target_1, signal)];
                case 27:
                    fallbackStreams = _d.sent();
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
                case 28:
                    error_4 = _d.sent();
                    console.log("[skyMovieHD] ❌ getStream error:", (error_4 === null || error_4 === void 0 ? void 0 : error_4.message) || error_4);
                    return [2 /*return*/, []];
                case 29: return [2 /*return*/];
            }
        });
    });
}
