"use strict";
/**
 * BigWarp Extractor
 * Extracts video streams from bigwarp.cc/bigwarp.pro
 *
 * Flow:
 * 1. Extract file_code from embed URL (e.g., /e/iw2hmw2sz246 -> iw2hmw2sz246)
 * 2. POST to /dl endpoint with form data (op=embed, file_code, auto=1)
 * 3. Parse jwplayer().setup() configuration from HTML response
 * 4. Extract video sources array with quality labels
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
exports.bigwarpExtractor = bigwarpExtractor;
var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
/**
 * Extract stream from BigWarp URL
 * @param url - BigWarp embed URL (e.g., https://bigwarp.cc/e/iw2hmw2sz246)
 * @param axios - Axios instance
 * @param signal - AbortSignal for cancellation
 * @returns Stream info with link and headers
 */
function bigwarpExtractor(url, axios, signal) {
    return __awaiter(this, void 0, void 0, function () {
        var codeMatch, fileCode, originMatch, origin_1, candidateHosts, candidateHosts_1, candidateHosts_1_1, host, dlUrl, formData, response, html, jwplayerMatch, configStr, sourcesMatch, sourcesStr, fileMatches, videoUrl, labelMatches, quality, error_1, e_1_1, error_2;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 11, , 12]);
                    console.log("BigWarp: Starting extraction for:", url.substring(0, 80));
                    codeMatch = url.match(/\/e\/([A-Za-z0-9_-]+)/i);
                    if (!codeMatch) {
                        console.error("BigWarp: Could not extract file code from URL");
                        return [2 /*return*/, null];
                    }
                    fileCode = codeMatch[1];
                    console.log("BigWarp: File code:", fileCode);
                    originMatch = url.match(/^(https?:\/\/[^/]+)/i);
                    origin_1 = originMatch ? originMatch[1] : "https://bigwarp.cc";
                    console.log("BigWarp: Origin:", origin_1);
                    candidateHosts = Array.from(new Set([
                        origin_1,
                        "https://bigwarp.pro",
                        "https://bigwarp.cc",
                    ]));
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, 9, 10]);
                    candidateHosts_1 = __values(candidateHosts), candidateHosts_1_1 = candidateHosts_1.next();
                    _b.label = 2;
                case 2:
                    if (!!candidateHosts_1_1.done) return [3 /*break*/, 7];
                    host = candidateHosts_1_1.value;
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    dlUrl = "".concat(host, "/dl");
                    console.log("BigWarp: Trying ".concat(dlUrl, "..."));
                    formData = new URLSearchParams();
                    formData.append('op', 'embed');
                    formData.append('file_code', fileCode);
                    formData.append('auto', '1');
                    formData.append('referer', url);
                    return [4 /*yield*/, axios.post(dlUrl, formData, {
                            headers: {
                                "User-Agent": USER_AGENT,
                                "Referer": url,
                                "Content-Type": "application/x-www-form-urlencoded",
                                "Origin": host,
                                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            },
                            signal: signal,
                            timeout: 15000,
                            maxRedirects: 10,
                        })];
                case 4:
                    response = _b.sent();
                    html = typeof response.data === 'string' ? response.data : '';
                    console.log("BigWarp: Response received (" + html.length + " chars)");
                    jwplayerMatch = html.match(/jwplayer\([^)]+\)\.setup\((\{[\s\S]+?\})\);/i);
                    if (!jwplayerMatch) {
                        console.error("BigWarp: Could not find jwplayer configuration");
                        return [3 /*break*/, 6]; // Try next host
                    }
                    configStr = jwplayerMatch[1];
                    console.log("BigWarp: Found jwplayer config");
                    sourcesMatch = configStr.match(/sources:\s*\[([^\]]+)\]/i);
                    if (!sourcesMatch) {
                        console.error("BigWarp: Could not extract sources from config");
                        return [3 /*break*/, 6];
                    }
                    sourcesStr = sourcesMatch[1];
                    fileMatches = __spreadArray([], __read(sourcesStr.matchAll(/file:\s*["']([^"']+)["']/gi)), false);
                    if (fileMatches.length === 0) {
                        console.error("BigWarp: No video files found in sources");
                        return [3 /*break*/, 6];
                    }
                    videoUrl = fileMatches[0][1];
                    console.log("BigWarp: Extracted video URL:", videoUrl.substring(0, 100) + "...");
                    labelMatches = __spreadArray([], __read(sourcesStr.matchAll(/label:\s*["']([^"']+)["']/gi)), false);
                    quality = labelMatches.length > 0 ? labelMatches[0][1] : undefined;
                    if (quality) {
                        console.log("BigWarp: Quality:", quality);
                    }
                    return [2 /*return*/, {
                            link: videoUrl,
                            headers: {
                                "User-Agent": USER_AGENT,
                                "Referer": host,
                            },
                            type: 'mp4',
                        }];
                case 5:
                    error_1 = _b.sent();
                    console.error("BigWarp: Error with host ".concat(host, ":"), error_1.message);
                    return [3 /*break*/, 6]; // Try next host
                case 6:
                    candidateHosts_1_1 = candidateHosts_1.next();
                    return [3 /*break*/, 2];
                case 7: return [3 /*break*/, 10];
                case 8:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 10];
                case 9:
                    try {
                        if (candidateHosts_1_1 && !candidateHosts_1_1.done && (_a = candidateHosts_1.return)) _a.call(candidateHosts_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 10:
                    console.error("BigWarp: All hosts failed");
                    return [2 /*return*/, null];
                case 11:
                    error_2 = _b.sent();
                    if (error_2.name === "AbortError" || error_2.code === "ERR_CANCELED") {
                        console.log("BigWarp: Request aborted");
                        return [2 /*return*/, null];
                    }
                    console.error("BigWarp: Extraction error:", error_2.message);
                    return [2 /*return*/, null];
                case 12: return [2 /*return*/];
            }
        });
    });
}
