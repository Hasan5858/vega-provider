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
        var axios, cheerio, extractors, hubcloudExtracter, streamtapeExtractor, streamhgExtractor, gdFlixExtracter, filepresExtractor, gofileExtracter, target, id, res, $, anchors, out, anchors_1, anchors_1_1, a, href, id, go, _c, links, _d, links, _e, fp, _f, e_1_1, shg, arr, st, arr, error_1;
        var e_1, _g;
        var _h;
        var link = _b.link, type = _b.type, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio, extractors = providerContext.extractors;
                    hubcloudExtracter = extractors.hubcloudExtracter;
                    streamtapeExtractor = extractors.streamtapeExtractor;
                    streamhgExtractor = extractors.streamhgExtractor;
                    gdFlixExtracter = extractors.gdFlixExtracter;
                    filepresExtractor = extractors.filepresExtractor;
                    gofileExtracter = extractors.gofileExtracter;
                    _j.label = 1;
                case 1:
                    _j.trys.push([1, 35, , 36]);
                    console.log("dotlink", link);
                    target = link;
                    // Normalize StreamHG hglink -> dumbalag embed
                    if (/hglink\.to\//i.test(target)) {
                        try {
                            id = (target.match(/hglink\.to\/([A-Za-z0-9_-]{4,})/i) || [])[1];
                            if (id)
                                target = "https://dumbalag.com/e/".concat(id);
                        }
                        catch (_k) { }
                    }
                    if (!/howblogs\.xyz\//i.test(target)) return [3 /*break*/, 29];
                    return [4 /*yield*/, axios.get(target, { signal: signal })];
                case 2:
                    res = _j.sent();
                    $ = cheerio.load(res.data || "");
                    anchors = $("a[href]").toArray();
                    out = [];
                    _j.label = 3;
                case 3:
                    _j.trys.push([3, 26, 27, 28]);
                    anchors_1 = __values(anchors), anchors_1_1 = anchors_1.next();
                    _j.label = 4;
                case 4:
                    if (!!anchors_1_1.done) return [3 /*break*/, 25];
                    a = anchors_1_1.value;
                    href = ($(a).attr("href") || "").trim();
                    if (!href)
                        return [3 /*break*/, 24];
                    // skip media.cm, dgdrive, hubdrive, gdtot
                    if (/media\.cm|dgdrive|hubdrive|gdtot/i.test(href))
                        return [3 /*break*/, 24];
                    if (!/gofile\.io\/d\//i.test(href)) return [3 /*break*/, 9];
                    id = (_h = href.split("/d/")[1]) === null || _h === void 0 ? void 0 : _h.split("?")[0];
                    if (!id) return [3 /*break*/, 8];
                    _j.label = 5;
                case 5:
                    _j.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, gofileExtracter(id)];
                case 6:
                    go = _j.sent();
                    if (go === null || go === void 0 ? void 0 : go.link)
                        out.push({ server: "GoFile", link: go.link, type: "mkv" });
                    return [3 /*break*/, 8];
                case 7:
                    _c = _j.sent();
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 24];
                case 9:
                    if (!/gdflix/i.test(href)) return [3 /*break*/, 14];
                    _j.label = 10;
                case 10:
                    _j.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, gdFlixExtracter(href, signal)];
                case 11:
                    links = _j.sent();
                    out.push.apply(out, __spreadArray([], __read(links.map(function (l) { return (__assign(__assign({}, l), { server: l.server || "GDFLIX" })); })), false));
                    return [3 /*break*/, 13];
                case 12:
                    _d = _j.sent();
                    return [3 /*break*/, 13];
                case 13: return [3 /*break*/, 24];
                case 14:
                    if (!/hubcloud/i.test(href)) return [3 /*break*/, 19];
                    _j.label = 15;
                case 15:
                    _j.trys.push([15, 17, , 18]);
                    return [4 /*yield*/, hubcloudExtracter(href, signal)];
                case 16:
                    links = _j.sent();
                    out.push.apply(out, __spreadArray([], __read(links.map(function (l) { return (__assign(__assign({}, l), { server: l.server || "HubCloud" })); })), false));
                    return [3 /*break*/, 18];
                case 17:
                    _e = _j.sent();
                    return [3 /*break*/, 18];
                case 18: return [3 /*break*/, 24];
                case 19:
                    if (!/filepress\./i.test(href)) return [3 /*break*/, 24];
                    _j.label = 20;
                case 20:
                    _j.trys.push([20, 22, , 23]);
                    return [4 /*yield*/, filepresExtractor(href, axios, signal)];
                case 21:
                    fp = _j.sent();
                    if (fp === null || fp === void 0 ? void 0 : fp.link)
                        out.push({ server: "FilePress", link: fp.link, type: fp.type || "m3u8", headers: fp.headers });
                    return [3 /*break*/, 23];
                case 22:
                    _f = _j.sent();
                    return [3 /*break*/, 23];
                case 23: return [3 /*break*/, 24];
                case 24:
                    anchors_1_1 = anchors_1.next();
                    return [3 /*break*/, 4];
                case 25: return [3 /*break*/, 28];
                case 26:
                    e_1_1 = _j.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 28];
                case 27:
                    try {
                        if (anchors_1_1 && !anchors_1_1.done && (_g = anchors_1.return)) _g.call(anchors_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 28: return [2 /*return*/, out];
                case 29:
                    if (!(/dumbalag\.com\//i.test(target) && typeof streamhgExtractor === "function")) return [3 /*break*/, 31];
                    return [4 /*yield*/, streamhgExtractor(target, axios, signal)];
                case 30:
                    shg = _j.sent();
                    if (shg) {
                        arr = [
                            { server: "StreamHG", link: shg.link, type: shg.type || "m3u8", headers: shg.headers },
                        ];
                        return [2 /*return*/, arr];
                    }
                    _j.label = 31;
                case 31:
                    if (!(/streamtape|watchadsontape|tape/i.test(target) && typeof streamtapeExtractor === "function")) return [3 /*break*/, 33];
                    return [4 /*yield*/, streamtapeExtractor(target, axios, signal)];
                case 32:
                    st = _j.sent();
                    if (st) {
                        arr = [
                            { server: "StreamTape", link: st.link, type: st.type || "mp4", headers: st.headers },
                        ];
                        return [2 /*return*/, arr];
                    }
                    _j.label = 33;
                case 33: return [4 /*yield*/, hubcloudExtracter(target, signal)];
                case 34: 
                // Fallback
                return [2 /*return*/, _j.sent()];
                case 35:
                    error_1 = _j.sent();
                    console.log("getStream error: ", error_1);
                    if (error_1.message.includes("Aborted")) {
                    }
                    else {
                    }
                    return [2 /*return*/, []];
                case 36: return [2 /*return*/];
            }
        });
    });
}
