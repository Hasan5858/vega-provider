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
exports.getStream = getStream;
var headers = {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Cache-Control": "no-store",
    "Accept-Language": "en-US,en;q=0.9",
    DNT: "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};
// Simplified and working version based on FilmyFly approach
// Helper function to get server name from URL
function getServerName(url) {
    if (url.includes("gofile.io"))
        return "GoFile";
    if (url.includes("send.cm"))
        return "Send";
    if (url.includes("gdflix"))
        return "GDFlix";
    if (url.includes("filepress"))
        return "FilePress";
    if (url.includes("gdtot"))
        return "GDTot";
    if (url.includes("pixeldrain"))
        return "PixelDrain";
    if (url.includes("hubcloud"))
        return "HubCloud";
    if (url.includes("1fichier"))
        return "1fichier";
    if (url.includes("mega.nz"))
        return "Mega";
    if (url.includes("drive.google"))
        return "Google Drive";
    return "Unknown";
}
// Helper function to determine file type from URL or content
function getFileType(url, server) {
    // Check URL extension first
    var extension = url.match(/\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v)$/i);
    if (extension)
        return extension[1].toLowerCase();
    // Default based on server
    var serverDefaults = {
        "GoFile": "mkv",
        "Send": "mkv",
        "GDFlix": "mkv",
        "FilePress": "mkv",
        "GDTot": "mkv",
        "PixelDrain": "mp4",
        "HubCloud": "mkv",
        "1fichier": "mkv",
        "Mega": "mkv",
        "Google Drive": "mkv"
    };
    return serverDefaults[server] || "mkv";
}
// Helper function to extract direct video URLs from cloud storage services
function extractDirectVideoUrl(link, server, axios, cheerio) {
    return __awaiter(this, void 0, void 0, function () {
        var response, finalUrl_1, urlMatch, encodedUrl, decodedUrl, videoExtensions_1, videoExtensions, $_1, videoLinks_1, videoSelectors, videoUrlPattern, matches, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    // Debug logging
                    if (typeof window !== 'undefined' && window.console) {
                        window.console.log("\uD83D\uDD0D DEBUG - Extracting direct URL from ".concat(server, ": ").concat(link));
                    }
                    if (typeof process !== 'undefined' && process.stdout) {
                        process.stdout.write("\uD83D\uDD0D DEBUG - Extracting direct URL from ".concat(server, ": ").concat(link, "\n"));
                    }
                    return [4 /*yield*/, axios.get(link, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                                'Accept-Language': 'en-US,en;q=0.9',
                                'Cache-Control': 'no-cache',
                                'Pragma': 'no-cache'
                            },
                            maxRedirects: 5,
                            timeout: 10000
                        })];
                case 1:
                    response = _c.sent();
                    finalUrl_1 = ((_a = response.request) === null || _a === void 0 ? void 0 : _a.responseURL) || ((_b = response.config) === null || _b === void 0 ? void 0 : _b.url) || link;
                    // Debug the final URL
                    if (typeof window !== 'undefined' && window.console) {
                        window.console.log("\uD83D\uDD0D DEBUG - Final URL for ".concat(server, ": ").concat(finalUrl_1));
                    }
                    if (typeof process !== 'undefined' && process.stdout) {
                        process.stdout.write("\uD83D\uDD0D DEBUG - Final URL for ".concat(server, ": ").concat(finalUrl_1, "\n"));
                    }
                    // Special handling for fastcdn-dl.pages.dev URLs - extract the actual video URL from query parameter
                    if (finalUrl_1.includes('fastcdn-dl.pages.dev')) {
                        try {
                            urlMatch = finalUrl_1.match(/[?&]url=([^&]+)/);
                            if (urlMatch && urlMatch[1]) {
                                encodedUrl = urlMatch[1];
                                decodedUrl = decodeURIComponent(encodedUrl);
                                videoExtensions_1 = /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|m3u8)$/i;
                                if (videoExtensions_1.test(decodedUrl)) {
                                    return [2 /*return*/, [{
                                                server: server,
                                                link: decodedUrl,
                                                type: getFileType(decodedUrl, server),
                                                quality: "1080"
                                            }]];
                                }
                            }
                        }
                        catch (error) {
                            // If decoding fails, continue with other methods
                        }
                    }
                    videoExtensions = /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|m3u8)$/i;
                    if (videoExtensions.test(finalUrl_1)) {
                        return [2 /*return*/, [{
                                    server: server,
                                    link: finalUrl_1,
                                    type: getFileType(finalUrl_1, server),
                                    quality: "1080"
                                }]];
                    }
                    $_1 = cheerio.load(response.data);
                    videoLinks_1 = [];
                    videoSelectors = [
                        'a[href*=".mp4"]',
                        'a[href*=".mkv"]',
                        'a[href*=".avi"]',
                        'a[href*=".mov"]',
                        'a[href*=".webm"]',
                        'a[href*=".m4v"]',
                        'a[href*=".m3u8"]'
                    ].join(', ');
                    $_1(videoSelectors).each(function (_, el) {
                        var _a;
                        var href = (_a = $_1(el).attr('href')) === null || _a === void 0 ? void 0 : _a.trim();
                        var text = $_1(el).text().trim();
                        if (href) {
                            // Make sure it's a full URL
                            var fullUrl = href.startsWith('http') ? href : new URL(href, finalUrl_1).href;
                            // Special handling for fastcdn-dl.pages.dev URLs
                            if (fullUrl.includes('fastcdn-dl.pages.dev')) {
                                try {
                                    // Extract URL parameter manually since URLSearchParams might not be available
                                    var urlMatch = fullUrl.match(/[?&]url=([^&]+)/);
                                    if (urlMatch && urlMatch[1]) {
                                        var encodedUrl = urlMatch[1];
                                        var decodedUrl = decodeURIComponent(encodedUrl);
                                        // Check if the decoded URL is a direct video file
                                        var videoExtensions_2 = /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|m3u8)$/i;
                                        if (videoExtensions_2.test(decodedUrl)) {
                                            videoLinks_1.push({
                                                server: server,
                                                link: decodedUrl,
                                                type: getFileType(decodedUrl, server),
                                                quality: "1080"
                                            });
                                            return; // Skip adding the original URL
                                        }
                                    }
                                }
                                catch (error) {
                                    // If decoding fails, continue with original URL
                                }
                            }
                            videoLinks_1.push({
                                server: server,
                                link: fullUrl,
                                type: getFileType(fullUrl, server),
                                quality: "1080"
                            });
                        }
                    });
                    videoUrlPattern = /https?:\/\/[^\s"']+\.(mp4|mkv|avi|mov|webm|m4v|m3u8)(\?[^\s"']*)?/gi;
                    matches = response.data.match(videoUrlPattern);
                    if (matches) {
                        matches.forEach(function (match) {
                            videoLinks_1.push({
                                server: server,
                                link: match,
                                type: getFileType(match, server),
                                quality: "1080"
                            });
                        });
                    }
                    if (videoLinks_1.length > 0) {
                        // Debug found video links
                        if (typeof window !== 'undefined' && window.console) {
                            window.console.log("\uD83D\uDD0D DEBUG - Found ".concat(videoLinks_1.length, " video links in HTML"));
                            videoLinks_1.forEach(function (link, i) {
                                window.console.log("  ".concat(i + 1, ". ").concat(link.link));
                            });
                        }
                        if (typeof process !== 'undefined' && process.stdout) {
                            process.stdout.write("\uD83D\uDD0D DEBUG - Found ".concat(videoLinks_1.length, " video links in HTML\n"));
                            videoLinks_1.forEach(function (link, i) {
                                process.stdout.write("  ".concat(i + 1, ". ").concat(link.link, "\n"));
                            });
                        }
                        return [2 /*return*/, videoLinks_1];
                    }
                    // If no video links found, return the original link as fallback
                    return [2 /*return*/, [{
                                server: server,
                                link: link,
                                type: getFileType(link, server),
                                quality: "1080"
                            }]];
                case 2:
                    error_1 = _c.sent();
                    // If extraction fails, return the original link as fallback
                    return [2 /*return*/, [{
                                server: server,
                                link: link,
                                type: getFileType(link, server),
                                quality: "1080"
                            }]];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getStream(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio, extractors, gofileExtracter, gdFlixExtracter, streamLinks_2, response, $_2, cloudSelectors, finalStreams_1, _loop_1, streamLinks_1, streamLinks_1_1, stream, e_1_1, uniqueStreams, error_2;
        var e_1, _c;
        var _d;
        var link = _b.link, type = _b.type, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio, extractors = providerContext.extractors;
                    gofileExtracter = extractors.gofileExtracter, gdFlixExtracter = extractors.gdFlixExtracter;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 11, , 12]);
                    streamLinks_2 = [];
                    return [4 /*yield*/, axios.get(link, { headers: headers, signal: signal, timeout: 10000 })];
                case 2:
                    response = _e.sent();
                    $_2 = cheerio.load(response.data);
                    cloudSelectors = [
                        "a[href*='gofile.io']",
                        "a[href*='gdflix']",
                        "a[href*='gdtot']",
                        "a[href*='hubcloud']",
                        "a[href*='pixeldrain']",
                        "a[href*='send.cm']",
                        "a[href*='1fichier']",
                        "a[href*='mega.nz']",
                        "a[href*='drive.google']"
                    ].join(", ");
                    $_2(cloudSelectors).each(function (_, el) {
                        var _a;
                        var href = (_a = $_2(el).attr("href")) === null || _a === void 0 ? void 0 : _a.trim();
                        var text = $_2(el).text().trim();
                        if (!href || !text)
                            return;
                        // Skip clearly irrelevant options
                        if (/(imdb|rating|score|share|telegram|whatsapp|how to)/i.test(text))
                            return;
                        if (text.length < 2)
                            return;
                        var server = getServerName(href);
                        var fileType = getFileType(href, server);
                        // Extract quality from text
                        var quality = "1080";
                        var qualityMatch = text.match(/(\d+)p/i);
                        if (qualityMatch) {
                            var q = parseInt(qualityMatch[1]);
                            if (q <= 360)
                                quality = "360";
                            else if (q <= 480)
                                quality = "480";
                            else if (q <= 720)
                                quality = "720";
                            else if (q <= 1080)
                                quality = "1080";
                            else
                                quality = "2160";
                        }
                        streamLinks_2.push({
                            server: "".concat(server, " [").concat(quality, "p]"),
                            link: href,
                            type: fileType,
                            quality: quality
                        });
                    });
                    finalStreams_1 = [];
                    _loop_1 = function (stream) {
                        var gofileId, result, results, e_2;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    _f.trys.push([0, 6, , 7]);
                                    if (!stream.link.includes("gofile.io")) return [3 /*break*/, 3];
                                    gofileId = (_d = stream.link.split("/d/")[1]) === null || _d === void 0 ? void 0 : _d.split("?")[0];
                                    if (!gofileId) return [3 /*break*/, 2];
                                    return [4 /*yield*/, gofileExtracter(gofileId)];
                                case 1:
                                    result = _f.sent();
                                    if (result === null || result === void 0 ? void 0 : result.link) {
                                        finalStreams_1.push({
                                            server: stream.server,
                                            link: result.link,
                                            type: stream.type,
                                            quality: stream.quality
                                        });
                                        return [2 /*return*/, "continue"];
                                    }
                                    _f.label = 2;
                                case 2: return [3 /*break*/, 5];
                                case 3:
                                    if (!stream.link.includes("gdflix")) return [3 /*break*/, 5];
                                    return [4 /*yield*/, gdFlixExtracter(stream.link, signal)];
                                case 4:
                                    results = _f.sent();
                                    if ((results === null || results === void 0 ? void 0 : results.length) > 0) {
                                        results.forEach(function (r) {
                                            finalStreams_1.push({
                                                server: stream.server,
                                                link: r.link,
                                                type: stream.type,
                                                quality: stream.quality
                                            });
                                        });
                                        return [2 /*return*/, "continue"];
                                    }
                                    _f.label = 5;
                                case 5: return [3 /*break*/, 7];
                                case 6:
                                    e_2 = _f.sent();
                                    return [3 /*break*/, 7];
                                case 7:
                                    // Fallback: use cloud storage link directly
                                    finalStreams_1.push(stream);
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _e.label = 3;
                case 3:
                    _e.trys.push([3, 8, 9, 10]);
                    streamLinks_1 = __values(streamLinks_2), streamLinks_1_1 = streamLinks_1.next();
                    _e.label = 4;
                case 4:
                    if (!!streamLinks_1_1.done) return [3 /*break*/, 7];
                    stream = streamLinks_1_1.value;
                    return [5 /*yield**/, _loop_1(stream)];
                case 5:
                    _e.sent();
                    _e.label = 6;
                case 6:
                    streamLinks_1_1 = streamLinks_1.next();
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 10];
                case 8:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 10];
                case 9:
                    try {
                        if (streamLinks_1_1 && !streamLinks_1_1.done && (_c = streamLinks_1.return)) _c.call(streamLinks_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 10:
                    uniqueStreams = finalStreams_1.filter(function (s, i, arr) {
                        return i === arr.findIndex(function (t) { return t.link === s.link; });
                    });
                    return [2 /*return*/, uniqueStreams];
                case 11:
                    error_2 = _e.sent();
                    console.error("KatFix getStream error:", error_2.message);
                    return [2 /*return*/, []];
                case 12: return [2 /*return*/];
            }
        });
    });
}
