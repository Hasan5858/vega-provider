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
exports.extractDood = void 0;
var getLastPathSegment = function (input) {
    var cleaned = input.split("?")[0];
    var segments = cleaned.split("/").filter(Boolean);
    return segments[segments.length - 1] || "";
};
var getOrigin = function (input) {
    var match = input.match(/^(https?:\/\/[^/]+)/i);
    return match ? match[1] : "https://dood.la";
};
var randomAlphaNumeric = function (length) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var result = "";
    for (var i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
/**
 * DoodStream Video Extractor
 * Extracts direct video links from DoodStream embed pages
 * Hosts: dood.la, dood.ws, dood.cx, dsvplay.com, etc.
 *
 * This extractor tries multiple known DoodStream hosts to find working streams
 */
var extractDood = function (url, axios) { return __awaiter(void 0, void 0, void 0, function () {
    var id, candidateHosts, embedHtml, activeHost, candidateHosts_1, candidateHosts_1_1, host, embedUrl_1, data, _a, e_1_1, passMatch, tokenMatch, embedUrl, passUrl, response, baseStream, token, finalUrl, error_1;
    var e_1, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 12, , 13]);
                id = getLastPathSegment(url);
                if (!id) {
                    console.warn("Dood extractor: Could not extract video ID from URL");
                    return [2 /*return*/, null];
                }
                candidateHosts = Array.from(new Set([
                    getOrigin(url),
                    "https://dsvplay.com",
                    "https://dood.la",
                    "https://dood.ws",
                    "https://dood.cx",
                ]));
                embedHtml = null;
                activeHost = null;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 8, 9, 10]);
                candidateHosts_1 = __values(candidateHosts), candidateHosts_1_1 = candidateHosts_1.next();
                _c.label = 2;
            case 2:
                if (!!candidateHosts_1_1.done) return [3 /*break*/, 7];
                host = candidateHosts_1_1.value;
                embedUrl_1 = "".concat(host, "/e/").concat(id);
                _c.label = 3;
            case 3:
                _c.trys.push([3, 5, , 6]);
                return [4 /*yield*/, axios.get(embedUrl_1, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                            Referer: "".concat(host, "/d/").concat(id),
                            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                            "Accept-Language": "en-US,en;q=0.9",
                            "Cache-Control": "no-cache",
                            Pragma: "no-cache",
                        },
                    })];
            case 4:
                data = (_c.sent()).data;
                embedHtml = data;
                activeHost = host;
                return [3 /*break*/, 7];
            case 5:
                _a = _c.sent();
                return [3 /*break*/, 6];
            case 6:
                candidateHosts_1_1 = candidateHosts_1.next();
                return [3 /*break*/, 2];
            case 7: return [3 /*break*/, 10];
            case 8:
                e_1_1 = _c.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 10];
            case 9:
                try {
                    if (candidateHosts_1_1 && !candidateHosts_1_1.done && (_b = candidateHosts_1.return)) _b.call(candidateHosts_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 10:
                if (!embedHtml || !activeHost) {
                    console.warn("Dood extractor: Could not fetch embed page from any host");
                    return [2 /*return*/, null];
                }
                passMatch = embedHtml.match(/\/pass_md5\/([^'"\n]+)/);
                tokenMatch = embedHtml.match(/token=([a-z0-9]+)/i);
                if (!passMatch || !tokenMatch) {
                    console.warn("Dood extractor: Could not find pass_md5 or token in embed page");
                    return [2 /*return*/, null];
                }
                embedUrl = "".concat(activeHost, "/e/").concat(id);
                passUrl = "".concat(activeHost, "/pass_md5/").concat(passMatch[1]);
                return [4 /*yield*/, axios.get(passUrl, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                            Referer: embedUrl,
                            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                            "Accept-Language": "en-US,en;q=0.9",
                            "Cache-Control": "no-cache",
                            Pragma: "no-cache",
                        },
                    })];
            case 11:
                response = _c.sent();
                baseStream = typeof response.data === "string" ? response.data : null;
                if (!baseStream) {
                    console.warn("Dood extractor: Invalid response from pass_md5 endpoint");
                    return [2 /*return*/, null];
                }
                token = tokenMatch[1];
                finalUrl = "".concat(baseStream).concat(randomAlphaNumeric(10), "?token=").concat(token, "&expiry=").concat(Date.now());
                return [2 /*return*/, {
                        link: finalUrl,
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                            Referer: embedUrl,
                        },
                        type: "mp4",
                    }];
            case 12:
                error_1 = _c.sent();
                console.error("Dood extractor failed", error_1);
                return [2 /*return*/, null];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.extractDood = extractDood;
