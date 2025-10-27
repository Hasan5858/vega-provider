"use strict";
/**
 * SaveFiles Extractor
 * Extracts video streams from savefiles.com using the download mechanism
 *
 * Strategy:
 * 1. Convert embed URL (/e/{id}) to download URL (/d/{id}_n)
 * 2. Fetch the download page to extract form parameters (op, id, mode, hash)
 * 3. POST to the download URL with parameters to get the direct download link
 *
 * The download page contains a hidden form with:
 * - op: "download_orig"
 * - id: {video_id}
 * - mode: "n" (normal quality)
 * - hash: {generated_hash}
 *
 * POSTing this form returns the direct file URL
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
exports.savefilesExtractor = savefilesExtractor;
var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
/**
 * Extract stream from SaveFiles URL
 * @param url - SaveFiles embed or download URL (e.g., https://savefiles.com/e/k8zyey44415m)
 * @param axios - Axios instance
 * @param signal - AbortSignal for cancellation
 * @returns Stream info with link and headers
 */
function savefilesExtractor(url, axios, signal) {
    return __awaiter(this, void 0, void 0, function () {
        var idMatch, videoId, downloadUrl, pageResponse, html, hashMatch, hash, formData, downloadResponse, contentType, finalUrl_1, responseHtml, cdnLinkMatch, directLink, fallbackMatch, directLink, finalUrl, error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    console.log("SaveFiles: Starting extraction for:", url.substring(0, 80));
                    idMatch = url.match(/\/(?:e|d)\/([A-Za-z0-9_-]+)/i);
                    if (!idMatch) {
                        console.error("SaveFiles: Could not extract video ID from URL");
                        return [2 /*return*/, null];
                    }
                    videoId = idMatch[1];
                    console.log("SaveFiles: Video ID:", videoId);
                    downloadUrl = "https://savefiles.com/d/".concat(videoId, "_n");
                    console.log("SaveFiles: Download URL:", downloadUrl);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    // Step 1: Fetch the download page to get form parameters
                    console.log("SaveFiles: Fetching download page...");
                    return [4 /*yield*/, axios.get(downloadUrl, {
                            headers: {
                                "User-Agent": USER_AGENT,
                                "Referer": url,
                                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                            },
                            signal: signal,
                            timeout: 15000,
                        })];
                case 2:
                    pageResponse = _a.sent();
                    html = typeof pageResponse.data === 'string' ? pageResponse.data : '';
                    console.log("SaveFiles: Page fetched (" + html.length + " chars)");
                    hashMatch = html.match(/name="hash"\s+value="([^"]+)"/i);
                    if (!hashMatch) {
                        console.error("SaveFiles: Could not extract hash from download page");
                        return [2 /*return*/, null];
                    }
                    hash = hashMatch[1];
                    console.log("SaveFiles: Hash extracted");
                    // Step 2: POST the form to get the direct download link
                    console.log("SaveFiles: Submitting download form...");
                    formData = new URLSearchParams();
                    formData.append('op', 'download_orig');
                    formData.append('id', videoId);
                    formData.append('mode', 'n'); // normal quality
                    formData.append('hash', hash);
                    return [4 /*yield*/, axios.post(downloadUrl, formData, {
                            headers: {
                                "User-Agent": USER_AGENT,
                                "Referer": downloadUrl,
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            signal: signal,
                            timeout: 15000,
                            maxRedirects: 10,
                        })];
                case 3:
                    downloadResponse = _a.sent();
                    contentType = downloadResponse.headers['content-type'] || '';
                    console.log("SaveFiles: Response Content-Type:", contentType);
                    // Check if we got a direct file or redirect
                    if (contentType.includes('video') || contentType.includes('application/octet')) {
                        console.log("SaveFiles: Got direct video file");
                        finalUrl_1 = downloadResponse.config.url || downloadUrl;
                        return [2 /*return*/, {
                                link: typeof finalUrl_1 === 'string' ? finalUrl_1 : downloadUrl,
                                headers: {
                                    "User-Agent": USER_AGENT,
                                    "Referer": downloadUrl,
                                },
                                type: 'mp4',
                            }];
                    }
                    // If response is HTML, check if it contains a download link
                    if (contentType.includes('text/html')) {
                        responseHtml = typeof downloadResponse.data === 'string' ? downloadResponse.data : '';
                        cdnLinkMatch = responseHtml.match(/https?:\/\/s\d+\.savefiles\.com\/v\/[^\s"'<>]+/i);
                        if (cdnLinkMatch) {
                            directLink = cdnLinkMatch[0];
                            console.log("SaveFiles: Found CDN link:", directLink.substring(0, 100) + "...");
                            return [2 /*return*/, {
                                    link: directLink,
                                    headers: {
                                        "User-Agent": USER_AGENT,
                                        "Referer": downloadUrl,
                                    },
                                    type: 'mp4',
                                }];
                        }
                        fallbackMatch = responseHtml.match(/https?:\/\/[^\/\s"'<>]+\.savefiles\.com\/v\/[^\s"'<>]+/i);
                        if (fallbackMatch) {
                            directLink = fallbackMatch[0];
                            console.log("SaveFiles: Found fallback link");
                            return [2 /*return*/, {
                                    link: directLink,
                                    headers: {
                                        "User-Agent": USER_AGENT,
                                        "Referer": downloadUrl,
                                    },
                                    type: 'mp4',
                                }];
                        }
                        console.error("SaveFiles: No video link found in HTML response");
                        return [2 /*return*/, null];
                    }
                    // If form submission redirected to a file, use that URL
                    console.log("SaveFiles: Using submission response URL");
                    finalUrl = downloadResponse.config.url || downloadUrl;
                    return [2 /*return*/, {
                            link: typeof finalUrl === 'string' ? finalUrl : downloadUrl,
                            headers: {
                                "User-Agent": USER_AGENT,
                                "Referer": downloadUrl,
                            },
                            type: 'mp4',
                        }];
                case 4:
                    error_1 = _a.sent();
                    if (error_1.name === "AbortError" || error_1.code === "ERR_CANCELED") {
                        console.log("SaveFiles: Request aborted");
                        return [2 /*return*/, null];
                    }
                    console.error("SaveFiles: Error during extraction:", error_1.message);
                    return [2 /*return*/, null];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error("SaveFiles: Extraction error:", error_2.message);
                    return [2 /*return*/, null];
                case 7: return [2 /*return*/];
            }
        });
    });
}
