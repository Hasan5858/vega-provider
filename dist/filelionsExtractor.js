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
exports.filelionsExtractor = filelionsExtractor;
var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
/**
 * FileLions extractor
 * - Convert view URL (/v/{id}) to embed (/embed/{id})
 * - Extract eval(...) obfuscated JS from the embed HTML (without surrounding <script> when possible)
 * - Send the eval string to an external deobfuscation API
 * - Parse the returned deobfuscated JS and extract the .m3u8 link
 */
function filelionsExtractor(url, axios, signal) {
    return __awaiter(this, void 0, void 0, function () {
        var idMatch, id, embedUrl, res, html, evalCode, evalPattern, evalMatch, directM3u8, apiResp, data, deob, m3u8Url, hls2Match, m3u8Match, cleanUrl, deErr_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    idMatch = url.match(/\/(?:v|embed)\/([A-Za-z0-9_-]{4,})/i);
                    id = idMatch ? idMatch[1] : null;
                    if (!id) {
                        console.error("FileLions: failed to parse id from url", url);
                        return [2 /*return*/, null];
                    }
                    embedUrl = "https://filelions.to/embed/".concat(id);
                    return [4 /*yield*/, axios.get(embedUrl, {
                            headers: {
                                "User-Agent": USER_AGENT,
                                Referer: url,
                            },
                            responseType: "text",
                            signal: signal,
                        })];
                case 1:
                    res = _a.sent();
                    html = res.data || "";
                    evalCode = null;
                    evalPattern = /eval\(function\(p,a,c,k,e,d\)[\s\S]+?\.split\('\|'\)\)\)/;
                    evalMatch = html.match(evalPattern);
                    if (evalMatch) {
                        evalCode = evalMatch[0];
                        console.log("FileLions: Extracted eval code (".concat(evalCode.length, " chars)"));
                    }
                    // If still not found, fallback: search for m3u8 directly in the page
                    if (!evalCode) {
                        directM3u8 = html.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/i);
                        if (directM3u8) {
                            return [2 /*return*/, {
                                    link: directM3u8[0].replace(/&amp;/g, "&"),
                                    headers: {
                                        "User-Agent": USER_AGENT,
                                        Referer: embedUrl,
                                    },
                                    type: "m3u8",
                                }];
                        }
                        console.error("FileLions: no eval block and no m3u8 found in embed page");
                        return [2 /*return*/, null];
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, axios.post("https://js-deobfuscator-api.replit.app/api/deobfuscate", { code: evalCode }, { headers: { "Content-Type": "application/json" }, timeout: 15000 })];
                case 3:
                    apiResp = _a.sent();
                    data = apiResp.data || {};
                    if (!data.success || !data.result) {
                        console.error("FileLions: deobfuscation API failed", data.error || data);
                        return [2 /*return*/, null];
                    }
                    deob = String(data.result);
                    m3u8Url = null;
                    hls2Match = deob.match(/"hls2"\s*:\s*"([^"]+\.m3u8[^"]*)"/i);
                    if (hls2Match && hls2Match[1]) {
                        m3u8Url = hls2Match[1];
                        console.log("FileLions: Found HLS2 source");
                    }
                    // Fallback: find any m3u8 URL
                    if (!m3u8Url) {
                        m3u8Match = deob.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/i);
                        if (m3u8Match) {
                            m3u8Url = m3u8Match[0];
                            console.log("FileLions: Found m3u8 (fallback)");
                        }
                    }
                    if (m3u8Url) {
                        cleanUrl = m3u8Url.replace(/&amp;/g, "&");
                        return [2 /*return*/, {
                                link: cleanUrl,
                                headers: {
                                    "User-Agent": USER_AGENT,
                                    Referer: embedUrl,
                                },
                                type: "m3u8",
                            }];
                    }
                    console.error("FileLions: no m3u8 found in deobfuscated code");
                    return [2 /*return*/, null];
                case 4:
                    deErr_1 = _a.sent();
                    console.error("FileLions: deobfuscation API error", deErr_1);
                    return [2 /*return*/, null];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error("FileLions extractor failed", error_1);
                    return [2 /*return*/, null];
                case 7: return [2 /*return*/];
            }
        });
    });
}
