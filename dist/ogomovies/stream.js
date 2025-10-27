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
function getStream(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio, streamLinks_1, dotlinkRes, dotlinkText, buttonMatches, _loop_1, buttonMatches_1, buttonMatches_1_1, match, e_1_1, uniqueStreams, error_1;
        var e_1, _c;
        var link = _b.link, type = _b.type, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 11, , 12]);
                    streamLinks_1 = [];
                    // 🔹 Check if link is an m3u8 URL - return it directly
                    if (link.includes('.m3u8')) {
                        console.log("🎬 M3U8 URL detected, returning directly");
                        return [2 /*return*/, [{
                                    server: "direct",
                                    link: link,
                                    type: "m3u8",
                                }]];
                    }
                    return [4 /*yield*/, axios("".concat(link), { headers: headers, signal: signal })];
                case 2:
                    dotlinkRes = _d.sent();
                    dotlinkText = dotlinkRes.data;
                    buttonMatches = dotlinkText.matchAll(/download_video\('([^']+)','([^']+)','([^']+)'\)/g);
                    _loop_1 = function (match) {
                        var _e, id, mode, hash, dlUrl, dlRes, dlText, $$_1, directMatches, directMatches_1, directMatches_1_1, m, href, err_1;
                        var e_2, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    _e = __read(match, 4), id = _e[1], mode = _e[2], hash = _e[3];
                                    dlUrl = "https://cdn.bewab.co/dl?op=download_orig&id=".concat(id, "&mode=").concat(mode, "&hash=").concat(hash);
                                    _g.label = 1;
                                case 1:
                                    _g.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, axios(dlUrl, { headers: headers, signal: signal })];
                                case 2:
                                    dlRes = _g.sent();
                                    dlText = dlRes.data;
                                    $$_1 = cheerio.load(dlText);
                                    directMatches = dlText.matchAll(/<a\s+href="([^"]+\.(?:mkv|mp4))"/gi);
                                    try {
                                        for (directMatches_1 = (e_2 = void 0, __values(directMatches)), directMatches_1_1 = directMatches_1.next(); !directMatches_1_1.done; directMatches_1_1 = directMatches_1.next()) {
                                            m = directMatches_1_1.value;
                                            href = m[1];
                                            if (href) {
                                                streamLinks_1.push({
                                                    server: "direct",
                                                    link: href,
                                                    type: href.endsWith(".mp4") ? "mp4" : "mkv",
                                                });
                                            }
                                        }
                                    }
                                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                    finally {
                                        try {
                                            if (directMatches_1_1 && !directMatches_1_1.done && (_f = directMatches_1.return)) _f.call(directMatches_1);
                                        }
                                        finally { if (e_2) throw e_2.error; }
                                    }
                                    // Method 2: Cheerio extraction (finds different URLs than regex)
                                    $$_1("a").each(function (_, el) {
                                        var _a;
                                        var href = (_a = $$_1(el).attr("href")) !== null && _a !== void 0 ? _a : null;
                                        if (href && (href.includes(".mkv") || href.includes(".mp4"))) {
                                            streamLinks_1.push({
                                                server: "direct",
                                                link: href,
                                                type: href.endsWith(".mp4") ? "mp4" : "mkv",
                                            });
                                        }
                                    });
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _g.sent();
                                    console.log("❌ error loading dl page:", err_1.message);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, 8, 9, 10]);
                    buttonMatches_1 = __values(buttonMatches), buttonMatches_1_1 = buttonMatches_1.next();
                    _d.label = 4;
                case 4:
                    if (!!buttonMatches_1_1.done) return [3 /*break*/, 7];
                    match = buttonMatches_1_1.value;
                    return [5 /*yield**/, _loop_1(match)];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6:
                    buttonMatches_1_1 = buttonMatches_1.next();
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 10];
                case 8:
                    e_1_1 = _d.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 10];
                case 9:
                    try {
                        if (buttonMatches_1_1 && !buttonMatches_1_1.done && (_c = buttonMatches_1.return)) _c.call(buttonMatches_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 10:
                    uniqueStreams = streamLinks_1.filter(function (stream, index, self) {
                        return index === self.findIndex(function (s) { return s.link === stream.link; });
                    });
                    return [2 /*return*/, uniqueStreams];
                case 11:
                    error_1 = _d.sent();
                    console.log("getStream error: ", error_1.message);
                    return [2 /*return*/, []];
                case 12: return [2 /*return*/];
            }
        });
    });
}
