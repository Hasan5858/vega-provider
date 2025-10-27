"use strict";
/**
 * StreamWish Extractor
 * Extracts video streams from streamwish.to using a manually configured DMCA-free domain
 *
 * Strategy: StreamWish checks domains against DMCA lists and redirects.
 * We bypass this by using a working domain (yuguaab.com) and updating it when needed.
 *
 * Update Instructions:
 * If yuguaab.com becomes blocked, find a new working domain and replace WORKING_DOMAIN constant.
 * Working domains usually last months to a year before DMCA blocking.
 */
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
exports.streamwishExtractor = streamwishExtractor;
// Manual DMCA-free domain (update when blocked)
var WORKING_DOMAIN = "https://yuguaab.com";
var DEOBFUSCATE_API = "https://js-deobfuscator-api.replit.app/api/deobfuscate";
var headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Referer": "".concat(WORKING_DOMAIN, "/"),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
};
/**
 * Extract stream from StreamWish URL
 * @param url - StreamWish embed or video URL (any domain)
 * @param axios - Axios instance
 * @param signal - AbortSignal for cancellation
 * @returns Stream info with link and headers
 */
function streamwishExtractor(url, axios, signal) {
    return __awaiter(this, void 0, void 0, function () {
        var idMatch, videoId, embedUrl, response, html, evalPattern, evalMatch, evalCode, deobfuscateResponse, deobfuscated, m3u8Match, m3u8Url, sourcesMatch, fileUrl, fileMatch, fileUrl, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log("StreamWish: Starting extraction for:", url.substring(0, 80));
                    idMatch = url.match(/\/(?:e|embed|v)\/([A-Za-z0-9_-]+)/i);
                    if (!idMatch) {
                        console.error("StreamWish: Could not extract video ID from URL");
                        return [2 /*return*/, null];
                    }
                    videoId = idMatch[1];
                    console.log("StreamWish: Video ID:", videoId);
                    embedUrl = "".concat(WORKING_DOMAIN, "/e/").concat(videoId);
                    console.log("StreamWish: Using working domain:", embedUrl);
                    return [4 /*yield*/, axios.get(embedUrl, {
                            headers: headers,
                            signal: signal,
                            timeout: 15000,
                        })];
                case 1:
                    response = _a.sent();
                    html = response.data;
                    console.log("StreamWish: Embed page fetched (" + html.length + " chars)");
                    evalPattern = /eval\(function\(p,a,c,k,e,d\)[\s\S]+?\.split\('\|'\)\)\)/;
                    evalMatch = html.match(evalPattern);
                    if (!evalMatch) {
                        console.error("StreamWish: Could not find eval code in embed page");
                        return [2 /*return*/, null];
                    }
                    evalCode = evalMatch[0];
                    console.log("StreamWish: Extracted eval code (" + evalCode.length + " chars)");
                    // Deobfuscate using API
                    console.log("StreamWish: Sending to deobfuscation API...");
                    return [4 /*yield*/, axios.post(DEOBFUSCATE_API, { code: evalCode }, {
                            headers: { "Content-Type": "application/json" },
                            timeout: 15000,
                        })];
                case 2:
                    deobfuscateResponse = _a.sent();
                    if (!deobfuscateResponse.data.success) {
                        console.error("StreamWish: Deobfuscation failed:", deobfuscateResponse.data.error);
                        return [2 /*return*/, null];
                    }
                    deobfuscated = deobfuscateResponse.data.result;
                    console.log("StreamWish: Deobfuscation successful (" + deobfuscated.length + " chars)");
                    m3u8Match = deobfuscated.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/i);
                    if (m3u8Match) {
                        m3u8Url = m3u8Match[0].replace(/&amp;/g, "&");
                        console.log("StreamWish: Found m3u8 URL (direct)");
                        return [2 /*return*/, {
                                link: m3u8Url,
                                headers: {
                                    "User-Agent": headers["User-Agent"],
                                    "Referer": "".concat(WORKING_DOMAIN, "/"),
                                },
                                type: "m3u8",
                            }];
                    }
                    sourcesMatch = deobfuscated.match(/"sources":\s*\[[\s\S]*?"file":\s*"([^"]+)"/);
                    if (sourcesMatch) {
                        fileUrl = sourcesMatch[1].replace(/\\/g, "").replace(/&amp;/g, "&");
                        console.log("StreamWish: Found stream URL (sources)");
                        return [2 /*return*/, {
                                link: fileUrl,
                                headers: {
                                    "User-Agent": headers["User-Agent"],
                                    "Referer": "".concat(WORKING_DOMAIN, "/"),
                                },
                                type: fileUrl.includes(".m3u8") ? "m3u8" : "mp4",
                            }];
                    }
                    fileMatch = deobfuscated.match(/"file":\s*"([^"]+)"/);
                    if (fileMatch) {
                        fileUrl = fileMatch[1].replace(/\\/g, "").replace(/&amp;/g, "&");
                        console.log("StreamWish: Found stream URL (file)");
                        return [2 /*return*/, {
                                link: fileUrl,
                                headers: {
                                    "User-Agent": headers["User-Agent"],
                                    "Referer": "".concat(WORKING_DOMAIN, "/"),
                                },
                                type: fileUrl.includes(".m3u8") ? "m3u8" : "mp4",
                            }];
                    }
                    console.error("StreamWish: Could not find stream URL in deobfuscated code");
                    return [2 /*return*/, null];
                case 3:
                    error_1 = _a.sent();
                    if (error_1.name === "AbortError" || error_1.code === "ERR_CANCELED") {
                        console.log("StreamWish: Request aborted");
                        return [2 /*return*/, null];
                    }
                    console.error("StreamWish: Extraction error:", error_1.message);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
