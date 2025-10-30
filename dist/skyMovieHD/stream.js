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
        var axios, cheerio, extractors, hubcloudExtracter, streamtapeExtractor, streamhgExtractor, target, id, shg, arr, st, arr, error_1;
        var link = _b.link, type = _b.type, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio, extractors = providerContext.extractors;
                    hubcloudExtracter = extractors.hubcloudExtracter;
                    streamtapeExtractor = extractors.streamtapeExtractor;
                    streamhgExtractor = extractors.streamhgExtractor;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, , 8]);
                    console.log("dotlink", link);
                    target = link;
                    // Normalize StreamHG hglink -> dumbalag embed
                    if (/hglink\.to\//i.test(target)) {
                        try {
                            id = (target.match(/hglink\.to\/([A-Za-z0-9_-]{4,})/i) || [])[1];
                            if (id)
                                target = "https://dumbalag.com/e/".concat(id);
                        }
                        catch (_d) { }
                    }
                    if (!(/dumbalag\.com\//i.test(target) && typeof streamhgExtractor === "function")) return [3 /*break*/, 3];
                    return [4 /*yield*/, streamhgExtractor(target, axios, signal)];
                case 2:
                    shg = _c.sent();
                    if (shg) {
                        arr = [
                            { server: "StreamHG", link: shg.link, type: shg.type || "m3u8", headers: shg.headers },
                        ];
                        return [2 /*return*/, arr];
                    }
                    _c.label = 3;
                case 3:
                    if (!(/streamtape|watchadsontape|tape/i.test(target) && typeof streamtapeExtractor === "function")) return [3 /*break*/, 5];
                    return [4 /*yield*/, streamtapeExtractor(target, axios, signal)];
                case 4:
                    st = _c.sent();
                    if (st) {
                        arr = [
                            { server: "StreamTape", link: st.link, type: st.type || "mp4", headers: st.headers },
                        ];
                        return [2 /*return*/, arr];
                    }
                    _c.label = 5;
                case 5: return [4 /*yield*/, hubcloudExtracter(target, signal)];
                case 6: 
                // Fallback
                return [2 /*return*/, _c.sent()];
                case 7:
                    error_1 = _c.sent();
                    console.log("getStream error: ", error_1);
                    if (error_1.message.includes("Aborted")) {
                    }
                    else {
                    }
                    return [2 /*return*/, []];
                case 8: return [2 /*return*/];
            }
        });
    });
}
