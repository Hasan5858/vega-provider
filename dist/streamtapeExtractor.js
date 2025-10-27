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
exports.extractStreamTape = void 0;
var getOrigin = function (input) {
    var match = input.match(/^(https?:\/\/[^/]+)/i);
    return match ? match[1] : "https://streamtape.com";
};
/**
 * StreamTape Video Extractor
 * Extracts direct video links from StreamTape embed pages
 * Hosts: streamtape.com, streamta.pe, etc.
 */
var extractStreamTape = function (url, axios) { return __awaiter(void 0, void 0, void 0, function () {
    var data, html, directMatch, rawLink, normalized, finalUrl, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.get(url, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                            Referer: url,
                            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                            "Accept-Language": "en-US,en;q=0.9",
                            "Cache-Control": "no-cache",
                            Pragma: "no-cache",
                        },
                    })];
            case 1:
                data = (_b.sent()).data;
                html = data;
                directMatch = (_a = html.match(/id="robotlink"[^>]*>([^<]+)</)) !== null && _a !== void 0 ? _a : html.match(/document\.getElementById\('robotlink'\)\.innerHTML\s*=\s*'([^']+)'/);
                if (!directMatch || !directMatch[1]) {
                    console.warn("StreamTape extractor: Could not find video link");
                    return [2 /*return*/, null];
                }
                rawLink = directMatch[1]
                    .replace(/\\u0026/g, "&")
                    .replace(/&amp;/g, "&")
                    .trim();
                normalized = rawLink.startsWith("http") || rawLink.startsWith("https")
                    ? rawLink
                    : rawLink.startsWith("//")
                        ? "https:".concat(rawLink)
                        : rawLink.startsWith("/")
                            ? "".concat(getOrigin(url)).concat(rawLink)
                            : rawLink;
                finalUrl = normalized.includes("&stream=") || normalized.includes("stream=")
                    ? normalized
                    : "".concat(normalized, "&stream=1");
                return [2 /*return*/, {
                        link: finalUrl,
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                            Referer: url,
                        },
                        type: "mp4",
                    }];
            case 2:
                error_1 = _b.sent();
                console.error("StreamTape extractor failed", error_1);
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.extractStreamTape = extractStreamTape;
