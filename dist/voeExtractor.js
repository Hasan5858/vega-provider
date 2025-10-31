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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voeExtractor = voeExtractor;
var axios_1 = __importDefault(require("axios"));
/**
 * VOE.sx Video Extractor
 *
 * Extracts direct download links from voe.sx using the download page.
 * Flow:
 * 1. voe.sx/e/{id} redirects to lukesitturn.com/{id}
 * 2. Append /download to get lukesitturn.com/{id}/download
 * 3. Follow redirect to final download page (e.g., jilliandescribecompany.com/{id}/download)
 * 4. Extract direct download link from the download button
 */
function voeExtractor(url) {
    return __awaiter(this, void 0, void 0, function () {
        var redirectResponse, initialHtml, locationMatch, windowLocationMatch, redirectedUrl, baseUrl, downloadUrl, downloadPageResponse, downloadPageHtml, finalLocationMatch, finalDownloadUrl, finalPageResponse, patterns, patterns_1, patterns_1_1, pattern, match, videoUrl, quality, urlObj, error_1;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    console.log("VOE: Starting extraction from ".concat(url));
                    return [4 /*yield*/, axios_1.default.get(url, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                                'Referer': url,
                            },
                            maxRedirects: 5,
                            timeout: 30000,
                        })];
                case 1:
                    redirectResponse = _b.sent();
                    initialHtml = redirectResponse.data;
                    locationMatch = initialHtml.match(/location\.href\s*=\s*["']([^"']+)["']/);
                    windowLocationMatch = initialHtml.match(/window\.location\s*=\s*["']([^"']+)["']/);
                    redirectedUrl = url;
                    if (locationMatch || windowLocationMatch) {
                        redirectedUrl = (locationMatch || windowLocationMatch)[1];
                        console.log("VOE: Found JS redirect to ".concat(redirectedUrl));
                    }
                    else {
                        console.log("VOE: No JS redirect found, using original URL");
                    }
                    baseUrl = redirectedUrl.replace(/\/e\//, '/').split('?')[0].replace(/\/$/, '');
                    downloadUrl = "".concat(baseUrl, "/download");
                    console.log("VOE: Constructed download URL: ".concat(downloadUrl));
                    return [4 /*yield*/, axios_1.default.get(downloadUrl, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                                'Referer': redirectedUrl,
                            },
                            maxRedirects: 0, // Don't follow HTTP redirects, handle JS redirects
                            validateStatus: function (status) { return status < 400; }, // Accept all non-error responses
                            timeout: 30000,
                        })];
                case 2:
                    downloadPageResponse = _b.sent();
                    downloadPageHtml = downloadPageResponse.data;
                    finalLocationMatch = downloadPageHtml.match(/window\.location\.href\s*=\s*["']([^"']+)["']/);
                    finalDownloadUrl = downloadUrl;
                    if (!finalLocationMatch) return [3 /*break*/, 4];
                    finalDownloadUrl = finalLocationMatch[1];
                    console.log("VOE: Found final JS redirect to ".concat(finalDownloadUrl));
                    return [4 /*yield*/, axios_1.default.get(finalDownloadUrl, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                                'Referer': downloadUrl,
                            },
                            maxRedirects: 5,
                            timeout: 30000,
                        })];
                case 3:
                    finalPageResponse = _b.sent();
                    downloadPageHtml = finalPageResponse.data;
                    finalDownloadUrl = finalLocationMatch[1]; // Use the matched URL
                    _b.label = 4;
                case 4:
                    console.log("VOE: Final download page: ".concat(finalDownloadUrl));
                    patterns = [
                        // Specific CDN pattern (edgeon-bandwidth, etc.)
                        /href=["']([^"']*(?:edgeon-bandwidth|cdn)[^"']*\.mp4[^"']*)[^"']*["']/i,
                        // Direct download link with quality text
                        /<a[^>]*href=["'](https?:\/\/[^"']+\.(?:mp4|mkv)(?:\?[^"']*)?)[^"']*["'][^>]*>[\s\S]*?Quality\s+(\d+)p[\s\S]*?<\/a>/i,
                        // More specific pattern for VOE download button
                        /<a[^>]*href=["']([^"']+)["'][^>]*>[\s\S]*?Quality[\s\S]*?Direct\s+Download\s+Link[\s\S]*?<\/a>/i,
                        // Download button with download attribute
                        /<a[^>]*href=["']([^"']+)["'][^>]*download[^>]*>/i,
                    ];
                    try {
                        for (patterns_1 = __values(patterns), patterns_1_1 = patterns_1.next(); !patterns_1_1.done; patterns_1_1 = patterns_1.next()) {
                            pattern = patterns_1_1.value;
                            match = downloadPageHtml.match(pattern);
                            if (match && match[1]) {
                                videoUrl = match[1];
                                // Decode HTML entities (&amp; -> &)
                                videoUrl = videoUrl.replace(/&amp;/g, '&');
                                // Skip non-video URLs
                                if (!videoUrl.includes('://') || (!videoUrl.includes('.mp4') && !videoUrl.includes('.mkv'))) {
                                    continue;
                                }
                                quality = match[2] || '720';
                                // Make sure URL is absolute
                                if (videoUrl.startsWith('/')) {
                                    urlObj = new URL(finalDownloadUrl);
                                    videoUrl = "".concat(urlObj.protocol, "//").concat(urlObj.host).concat(videoUrl);
                                }
                                console.log("VOE: Found download link: ".concat(videoUrl));
                                return [2 /*return*/, [
                                        {
                                            server: 'VOE',
                                            quality: quality,
                                            link: videoUrl,
                                            type: 'mp4', // Use mp4 instead of mkv for better compatibility
                                            headers: {
                                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                                                'Referer': 'https://voe.sx/',
                                                'Origin': 'https://voe.sx',
                                                'Accept': '*/*',
                                                'Accept-Language': 'en-US,en;q=0.9',
                                                'Sec-Fetch-Dest': 'video',
                                                'Sec-Fetch-Mode': 'no-cors',
                                                'Sec-Fetch-Site': 'cross-site',
                                            },
                                        },
                                    ]];
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (patterns_1_1 && !patterns_1_1.done && (_a = patterns_1.return)) _a.call(patterns_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    console.log('VOE: No download link found on page');
                    return [2 /*return*/, []];
                case 5:
                    error_1 = _b.sent();
                    console.error("VOE: Extraction failed - ".concat(error_1.message));
                    return [2 /*return*/, []];
                case 6: return [2 /*return*/];
            }
        });
    });
}
