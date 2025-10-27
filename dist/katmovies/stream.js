"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
var cheerio = __importStar(require("cheerio"));
function getServerName(url) {
    if (url.includes("hubcloud.ink"))
        return "HubCloud";
    if (url.includes("gd.kmhd.net"))
        return "GDFlix";
    if (url.includes("katdrive.eu"))
        return "KatDrive";
    if (url.includes("clicknupload.click"))
        return "ClicknUpload";
    if (url.includes("fuckingfast.net"))
        return "FuckingFast";
    if (url.includes("1fichier.com"))
        return "1fichier";
    if (url.includes("1xplayer.com"))
        return "1xPlayer";
    return "Unknown";
}
function extractDirectFileUrl(url, providerContext) {
    return __awaiter(this, void 0, void 0, function () {
        var axios, cheerio, response, $, downloadLinks, directLink, fullUrl, scriptContent, urlPatterns, urlPatterns_1, urlPatterns_1_1, pattern, matches, directUrl, fullUrl, error_1;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get(url, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                            },
                            timeout: 10000
                        })];
                case 2:
                    response = _b.sent();
                    $ = cheerio.load(response.data);
                    downloadLinks = $('a[href*="download"], a[href*=".mp4"], a[href*=".mkv"], a[href*=".avi"], a[href*=".mov"], a[href*=".wmv"], a[href*=".flv"], a[href*=".webm"]');
                    if (downloadLinks.length > 0) {
                        directLink = downloadLinks.first().attr('href');
                        if (directLink) {
                            fullUrl = directLink.startsWith('http') ? directLink : "".concat(url.split('/').slice(0, 3).join('/')).concat(directLink);
                            return [2 /*return*/, fullUrl];
                        }
                    }
                    scriptContent = response.data;
                    urlPatterns = [
                        /downloadUrl['":\s]*['"]([^'"]+)['"]/gi,
                        /fileUrl['":\s]*['"]([^'"]+)['"]/gi,
                        /directUrl['":\s]*['"]([^'"]+)['"]/gi,
                        /url['":\s]*['"]([^'"]+\.(mp4|mkv|avi|mov|wmv|flv|webm))['"]/gi
                    ];
                    try {
                        for (urlPatterns_1 = __values(urlPatterns), urlPatterns_1_1 = urlPatterns_1.next(); !urlPatterns_1_1.done; urlPatterns_1_1 = urlPatterns_1.next()) {
                            pattern = urlPatterns_1_1.value;
                            matches = scriptContent.match(pattern);
                            if (matches && matches.length > 0) {
                                directUrl = matches[1];
                                if (directUrl) {
                                    fullUrl = directUrl.startsWith('http') ? directUrl : "".concat(url.split('/').slice(0, 3).join('/')).concat(directUrl);
                                    return [2 /*return*/, fullUrl];
                                }
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (urlPatterns_1_1 && !urlPatterns_1_1.done && (_a = urlPatterns_1.return)) _a.call(urlPatterns_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    // For some services, the URL might already be direct
                    if (url.includes('.mp4') || url.includes('.mkv') || url.includes('.avi') || url.includes('.mov') || url.includes('.wmv') || url.includes('.flv') || url.includes('.webm')) {
                        return [2 /*return*/, url];
                    }
                    return [2 /*return*/, null];
                case 3:
                    error_1 = _b.sent();
                    console.error("Error extracting direct file URL:", error_1);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function scrape1xplayerDirectUrl(url, providerContext) {
    return __awaiter(this, void 0, void 0, function () {
        var axios, cheerio, response, $, directUrl, videoSrc, iframeElements, i, iframeSrc, iframeResponse, $iframe, iframeVideoSrc, iframeError_1, scriptContent, urlPatterns, i, pattern, match, dataUrl, videoLinks, videoLink, allLinks, i, href, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, axios.get(url, {
                            timeout: 10000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                            }
                        })];
                case 2:
                    response = _a.sent();
                    $ = cheerio.load(response.data);
                    directUrl = null;
                    videoSrc = $('video source').attr('src');
                    if (videoSrc) {
                        directUrl = videoSrc.startsWith('http') ? videoSrc : "".concat(url.split('/').slice(0, 3).join('/')).concat(videoSrc);
                        return [2 /*return*/, directUrl];
                    }
                    iframeElements = $('iframe');
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < iframeElements.length)) return [3 /*break*/, 8];
                    iframeSrc = $(iframeElements[i]).attr('src');
                    if (!iframeSrc) return [3 /*break*/, 7];
                    if (!(iframeSrc.includes('player') || iframeSrc.includes('embed'))) return [3 /*break*/, 7];
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, axios.get(iframeSrc, {
                            timeout: 10000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                            }
                        })];
                case 5:
                    iframeResponse = _a.sent();
                    $iframe = cheerio.load(iframeResponse.data);
                    iframeVideoSrc = $iframe('video source').attr('src');
                    if (iframeVideoSrc) {
                        directUrl = iframeVideoSrc.startsWith('http') ? iframeVideoSrc : "".concat(iframeSrc.split('/').slice(0, 3).join('/')).concat(iframeVideoSrc);
                        return [2 /*return*/, directUrl];
                    }
                    return [3 /*break*/, 7];
                case 6:
                    iframeError_1 = _a.sent();
                    return [3 /*break*/, 7];
                case 7:
                    i++;
                    return [3 /*break*/, 3];
                case 8:
                    scriptContent = response.data;
                    urlPatterns = [
                        /file:\s*["']([^"']+\.(mp4|mkv|avi|mov|wmv|flv|webm))["']/i,
                        /src:\s*["']([^"']+\.(mp4|mkv|avi|mov|wmv|flv|webm))["']/i,
                        /url:\s*["']([^"']+\.(mp4|mkv|avi|mov|wmv|flv|webm))["']/i,
                        /"url":\s*"([^"]+\.(mp4|mkv|avi|mov|wmv|flv|webm))"/i,
                        /'url':\s*'([^']+\.(mp4|mkv|avi|mov|wmv|flv|webm))'/i,
                        /videoUrl:\s*["']([^"']+)["']/i,
                        /streamUrl:\s*["']([^"']+)["']/i,
                        /playUrl:\s*["']([^"']+)["']/i,
                        /downloadUrl:\s*["']([^"']+)["']/i,
                        /fileUrl:\s*["']([^"']+)["']/i
                    ];
                    for (i = 0; i < urlPatterns.length; i++) {
                        pattern = urlPatterns[i];
                        match = scriptContent.match(pattern);
                        if (match && match[1]) {
                            directUrl = match[1].startsWith('http') ? match[1] : "".concat(url.split('/').slice(0, 3).join('/')).concat(match[1]);
                            return [2 /*return*/, directUrl];
                        }
                    }
                    dataUrl = $('[data-url]').attr('data-url') ||
                        $('[data-src]').attr('data-src') ||
                        $('[data-file]').attr('data-file');
                    if (dataUrl) {
                        directUrl = dataUrl.startsWith('http') ? dataUrl : "".concat(url.split('/').slice(0, 3).join('/')).concat(dataUrl);
                        return [2 /*return*/, directUrl];
                    }
                    videoLinks = $('a[href*=".mp4"], a[href*=".mkv"], a[href*=".avi"], a[href*=".mov"], a[href*=".wmv"], a[href*=".flv"], a[href*=".webm"]');
                    if (videoLinks.length > 0) {
                        videoLink = videoLinks.first().attr('href');
                        if (videoLink) {
                            directUrl = videoLink.startsWith('http') ? videoLink : "".concat(url.split('/').slice(0, 3).join('/')).concat(videoLink);
                            return [2 /*return*/, directUrl];
                        }
                    }
                    allLinks = $('a[href]');
                    for (i = 0; i < Math.min(allLinks.length, 10); i++) {
                        href = $(allLinks[i]).attr('href');
                        if (href && (href.includes('.mp4') || href.includes('.mkv') || href.includes('.avi') || href.includes('.mov') || href.includes('.wmv') || href.includes('.flv') || href.includes('.webm'))) {
                            directUrl = href.startsWith('http') ? href : "".concat(url.split('/').slice(0, 3).join('/')).concat(href);
                            return [2 /*return*/, directUrl];
                        }
                    }
                    return [2 /*return*/, null];
                case 9:
                    error_2 = _a.sent();
                    console.error("Error scraping 1xplayer URL:", error_2);
                    return [2 /*return*/, null];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function extractKmhdLink(katlink, providerContext) {
    return __awaiter(this, void 0, void 0, function () {
        var axios, initialResponse, responseUrl, $locked, form, action, unlockUrl, unlockResponse, unlockResponseUrl, unlockedResponse, unlockedData, uploadLinksMatch, uploadLinksStr, uploadLinks_1, linkPairs, serverLinks, hubdriveMatch, gdflixMatch, katdriveMatch, clicknuploadMatch, ffastMatch, fichierMatch, serverOrder, serverOrder_1, serverOrder_1_1, serverKey, serverUrl, chibiPathMatch, baseUrl, fileIdMatch, finalLink, data, chibiPathMatch, baseUrl, fileIdMatch, finalLink, error_3;
        var e_2, _a;
        var _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    axios = providerContext.axios;
                    _k.label = 1;
                case 1:
                    _k.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, axios.get(katlink, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                                'Referer': 'https://katmoviehd.observer/'
                            }
                        })];
                case 2:
                    initialResponse = _k.sent();
                    responseUrl = ((_c = (_b = initialResponse.request) === null || _b === void 0 ? void 0 : _b.res) === null || _c === void 0 ? void 0 : _c.responseURL) ||
                        ((_d = initialResponse.request) === null || _d === void 0 ? void 0 : _d.responseURL) ||
                        ((_e = initialResponse.config) === null || _e === void 0 ? void 0 : _e.url);
                    if (!(responseUrl === null || responseUrl === void 0 ? void 0 : responseUrl.includes('/locked'))) return [3 /*break*/, 5];
                    $locked = cheerio.load(initialResponse.data);
                    form = $locked('form');
                    action = form.attr('action');
                    if (!action) {
                        console.error("No unlock form found");
                        return [2 /*return*/, null];
                    }
                    unlockUrl = "https://links.kmhd.net/locked".concat(action);
                    return [4 /*yield*/, axios.post(unlockUrl, {}, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                                'Referer': responseUrl,
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Origin': 'https://links.kmhd.net'
                            },
                            maxRedirects: 5
                        })];
                case 3:
                    unlockResponse = _k.sent();
                    unlockResponseUrl = ((_g = (_f = unlockResponse.request) === null || _f === void 0 ? void 0 : _f.res) === null || _g === void 0 ? void 0 : _g.responseURL) ||
                        ((_h = unlockResponse.request) === null || _h === void 0 ? void 0 : _h.responseURL) ||
                        ((_j = unlockResponse.config) === null || _j === void 0 ? void 0 : _j.url) ||
                        katlink;
                    return [4 /*yield*/, axios.get(katlink, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                                'Referer': unlockResponseUrl,
                                'Cookie': unlockResponse.headers['set-cookie'] ? unlockResponse.headers['set-cookie'].join('; ') : ''
                            }
                        })];
                case 4:
                    unlockedResponse = _k.sent();
                    unlockedData = unlockedResponse.data;
                    uploadLinksMatch = unlockedData.match(/upload_links:\{([^}]+)\}/);
                    if (uploadLinksMatch) {
                        uploadLinksStr = uploadLinksMatch[1];
                        uploadLinks_1 = {};
                        linkPairs = uploadLinksStr.split(',');
                        linkPairs.forEach(function (pair) {
                            var _a = __read(pair.split(':'), 2), key = _a[0], value = _a[1];
                            if (key && value) {
                                uploadLinks_1[key.trim()] = value.trim().replace(/"/g, '');
                            }
                        });
                        serverLinks = {};
                        hubdriveMatch = unlockedData.match(/hubdrive_res:\{mx:(\d+),link:"([^"]+)"/);
                        if (hubdriveMatch) {
                            serverLinks.hubdrive_res = {
                                mx: parseInt(hubdriveMatch[1]),
                                link: hubdriveMatch[2]
                            };
                        }
                        gdflixMatch = unlockedData.match(/gdflix_res:\{mx:(\d+),link:"([^"]+)"/);
                        if (gdflixMatch) {
                            serverLinks.gdflix_res = {
                                mx: parseInt(gdflixMatch[1]),
                                link: gdflixMatch[2]
                            };
                        }
                        katdriveMatch = unlockedData.match(/katdrive_res:\{mx:(\d+),link:"([^"]+)"/);
                        if (katdriveMatch) {
                            serverLinks.katdrive_res = {
                                mx: parseInt(katdriveMatch[1]),
                                link: katdriveMatch[2]
                            };
                        }
                        clicknuploadMatch = unlockedData.match(/clicknupload_res:\{mx:(\d+),link:"([^"]+)"/);
                        if (clicknuploadMatch) {
                            serverLinks.clicknupload_res = {
                                mx: parseInt(clicknuploadMatch[1]),
                                link: clicknuploadMatch[2]
                            };
                        }
                        ffastMatch = unlockedData.match(/ffast_res:\{mx:(\d+),link:"([^"]+)"/);
                        if (ffastMatch) {
                            serverLinks.ffast_res = {
                                mx: parseInt(ffastMatch[1]),
                                link: ffastMatch[2]
                            };
                        }
                        fichierMatch = unlockedData.match(/fichier_res:\{mx:(\d+),link:"([^"]+)"/);
                        if (fichierMatch) {
                            serverLinks.fichier_res = {
                                mx: parseInt(fichierMatch[1]),
                                link: fichierMatch[2]
                            };
                        }
                        serverOrder = ['hubdrive_res', 'gdflix_res', 'katdrive_res', 'clicknupload_res', 'ffast_res', 'fichier_res'];
                        try {
                            for (serverOrder_1 = __values(serverOrder), serverOrder_1_1 = serverOrder_1.next(); !serverOrder_1_1.done; serverOrder_1_1 = serverOrder_1.next()) {
                                serverKey = serverOrder_1_1.value;
                                if (uploadLinks_1[serverKey] && uploadLinks_1[serverKey] !== 'None' && serverLinks[serverKey]) {
                                    serverUrl = serverLinks[serverKey].link + uploadLinks_1[serverKey];
                                    return [2 /*return*/, serverUrl];
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (serverOrder_1_1 && !serverOrder_1_1.done && (_a = serverOrder_1.return)) _a.call(serverOrder_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                    chibiPathMatch = unlockedData.match(/"PUBLIC_CHIBI_PATH":"([^"]+)"/);
                    if (chibiPathMatch && chibiPathMatch[1]) {
                        baseUrl = chibiPathMatch[1];
                        fileIdMatch = katlink.match(/\/file\/([^\/]+)$/);
                        if (fileIdMatch && fileIdMatch[1]) {
                            finalLink = "".concat(baseUrl, "/").concat(fileIdMatch[1]);
                            return [2 /*return*/, finalLink];
                        }
                    }
                    return [3 /*break*/, 6];
                case 5:
                    data = initialResponse.data;
                    chibiPathMatch = data.match(/"PUBLIC_CHIBI_PATH":"([^"]+)"/);
                    if (chibiPathMatch && chibiPathMatch[1]) {
                        baseUrl = chibiPathMatch[1];
                        fileIdMatch = katlink.match(/\/file\/([^\/]+)$/);
                        if (fileIdMatch && fileIdMatch[1]) {
                            finalLink = "".concat(baseUrl, "/").concat(fileIdMatch[1]);
                            return [2 /*return*/, finalLink];
                        }
                    }
                    _k.label = 6;
                case 6:
                    console.error("No valid streaming link found");
                    return [2 /*return*/, null];
                case 7:
                    error_3 = _k.sent();
                    console.error("Error in extractKmhdLink:", error_3.message);
                    return [2 /*return*/, null];
                case 8: return [2 /*return*/];
            }
        });
    });
}
var getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio, extractors, hubcloudExtracter, gdFlixExtracter, streamLinks, hubcloudLink, result, directUrl, hubcloudStreams, hubcloudError_1, error_4, directUrl, error_5, streams, error_6;
        var link = _b.link, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio, extractors = providerContext.extractors;
                    hubcloudExtracter = extractors.hubcloudExtracter, gdFlixExtracter = extractors.gdFlixExtracter;
                    streamLinks = [];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 24, , 25]);
                    if (!link.includes("gdflix")) return [3 /*break*/, 3];
                    return [4 /*yield*/, gdFlixExtracter(link, signal)];
                case 2: return [2 /*return*/, _c.sent()];
                case 3:
                    if (!link.includes("kmhd")) return [3 /*break*/, 22];
                    return [4 /*yield*/, extractKmhdLink(link, providerContext)];
                case 4:
                    hubcloudLink = _c.sent();
                    if (!hubcloudLink) {
                        console.error("Failed to extract hubcloud link from kmhd");
                        return [2 /*return*/, []];
                    }
                    if (!hubcloudLink.includes("hubcloud.ink")) return [3 /*break*/, 6];
                    return [4 /*yield*/, hubcloudExtracter(hubcloudLink, signal)];
                case 5:
                    result = _c.sent();
                    return [2 /*return*/, result];
                case 6:
                    if (!hubcloudLink.includes("1xplayer.com")) return [3 /*break*/, 16];
                    _c.label = 7;
                case 7:
                    _c.trys.push([7, 14, , 15]);
                    return [4 /*yield*/, scrape1xplayerDirectUrl(hubcloudLink, providerContext)];
                case 8:
                    directUrl = _c.sent();
                    if (!directUrl) return [3 /*break*/, 9];
                    return [2 /*return*/, [{
                                server: "1xPlayer",
                                link: directUrl,
                                type: "mkv",
                                quality: "1080"
                            }]];
                case 9:
                    _c.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, hubcloudExtracter(hubcloudLink, signal)];
                case 10:
                    hubcloudStreams = _c.sent();
                    if (hubcloudStreams.length > 0) {
                        return [2 /*return*/, hubcloudStreams];
                    }
                    return [3 /*break*/, 12];
                case 11:
                    hubcloudError_1 = _c.sent();
                    return [3 /*break*/, 12];
                case 12: 
                // Final fallback - return the original URL
                return [2 /*return*/, [{
                            server: "1xPlayer",
                            link: hubcloudLink,
                            type: "mkv",
                            quality: "1080"
                        }]];
                case 13: return [3 /*break*/, 15];
                case 14:
                    error_4 = _c.sent();
                    return [2 /*return*/, [{
                                server: "1xPlayer",
                                link: hubcloudLink,
                                type: "mkv",
                                quality: "1080"
                            }]];
                case 15: return [3 /*break*/, 20];
                case 16:
                    if (!(hubcloudLink.includes("gd.kmhd.net") || hubcloudLink.includes("katdrive.eu") || hubcloudLink.includes("clicknupload.click") || hubcloudLink.includes("fuckingfast.net") || hubcloudLink.includes("1fichier.com"))) return [3 /*break*/, 20];
                    _c.label = 17;
                case 17:
                    _c.trys.push([17, 19, , 20]);
                    return [4 /*yield*/, extractDirectFileUrl(hubcloudLink, providerContext)];
                case 18:
                    directUrl = _c.sent();
                    if (directUrl) {
                        return [2 /*return*/, [{
                                    server: getServerName(hubcloudLink),
                                    link: directUrl,
                                    type: "mkv",
                                    quality: "1080"
                                }]];
                    }
                    else {
                        return [2 /*return*/, [{
                                    server: getServerName(hubcloudLink),
                                    link: hubcloudLink,
                                    type: "mkv",
                                    quality: "1080"
                                }]];
                    }
                    return [3 /*break*/, 20];
                case 19:
                    error_5 = _c.sent();
                    return [2 /*return*/, [{
                                server: getServerName(hubcloudLink),
                                link: hubcloudLink,
                                type: "mkv",
                                quality: "1080"
                            }]];
                case 20: return [4 /*yield*/, hubcloudExtracter(hubcloudLink, signal)];
                case 21: return [2 /*return*/, _c.sent()];
                case 22: return [4 /*yield*/, hubcloudExtracter(link, signal)];
                case 23:
                    streams = _c.sent();
                    return [2 /*return*/, streams];
                case 24:
                    error_6 = _c.sent();
                    return [2 /*return*/, []];
                case 25: return [2 /*return*/];
            }
        });
    });
};
exports.getStream = getStream;
