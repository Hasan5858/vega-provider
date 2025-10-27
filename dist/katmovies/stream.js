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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const cheerio = __importStar(require("cheerio"));
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
    return __awaiter(this, void 0, void 0, function* () {
        const { axios, cheerio } = providerContext;
        try {
            const response = yield axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                },
                timeout: 10000
            });
            const $ = cheerio.load(response.data);
            // Look for direct download links
            const downloadLinks = $('a[href*="download"], a[href*=".mp4"], a[href*=".mkv"], a[href*=".avi"], a[href*=".mov"], a[href*=".wmv"], a[href*=".flv"], a[href*=".webm"]');
            if (downloadLinks.length > 0) {
                const directLink = downloadLinks.first().attr('href');
                if (directLink) {
                    const fullUrl = directLink.startsWith('http') ? directLink : `${url.split('/').slice(0, 3).join('/')}${directLink}`;
                    return fullUrl;
                }
            }
            // Look for JavaScript variables containing direct URLs
            const scriptContent = response.data;
            const urlPatterns = [
                /downloadUrl['":\s]*['"]([^'"]+)['"]/gi,
                /fileUrl['":\s]*['"]([^'"]+)['"]/gi,
                /directUrl['":\s]*['"]([^'"]+)['"]/gi,
                /url['":\s]*['"]([^'"]+\.(mp4|mkv|avi|mov|wmv|flv|webm))['"]/gi
            ];
            for (const pattern of urlPatterns) {
                const matches = scriptContent.match(pattern);
                if (matches && matches.length > 0) {
                    const directUrl = matches[1];
                    if (directUrl) {
                        const fullUrl = directUrl.startsWith('http') ? directUrl : `${url.split('/').slice(0, 3).join('/')}${directUrl}`;
                        return fullUrl;
                    }
                }
            }
            // For some services, the URL might already be direct
            if (url.includes('.mp4') || url.includes('.mkv') || url.includes('.avi') || url.includes('.mov') || url.includes('.wmv') || url.includes('.flv') || url.includes('.webm')) {
                return url;
            }
            return null;
        }
        catch (error) {
            console.error("Error extracting direct file URL:", error);
            return null;
        }
    });
}
function scrape1xplayerDirectUrl(url, providerContext) {
    return __awaiter(this, void 0, void 0, function* () {
        const { axios, cheerio } = providerContext;
        try {
            const response = yield axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            const $ = cheerio.load(response.data);
            // Look for various patterns that might contain the direct URL
            let directUrl = null;
            // Pattern 1: Look for video source tags
            const videoSrc = $('video source').attr('src');
            if (videoSrc) {
                directUrl = videoSrc.startsWith('http') ? videoSrc : `${url.split('/').slice(0, 3).join('/')}${videoSrc}`;
                return directUrl;
            }
            // Pattern 2: Look for iframe sources
            const iframeElements = $('iframe');
            for (let i = 0; i < iframeElements.length; i++) {
                const iframeSrc = $(iframeElements[i]).attr('src');
                if (iframeSrc) {
                    if (iframeSrc.includes('player') || iframeSrc.includes('embed')) {
                        try {
                            const iframeResponse = yield axios.get(iframeSrc, {
                                timeout: 10000,
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                                }
                            });
                            const $iframe = cheerio.load(iframeResponse.data);
                            const iframeVideoSrc = $iframe('video source').attr('src');
                            if (iframeVideoSrc) {
                                directUrl = iframeVideoSrc.startsWith('http') ? iframeVideoSrc : `${iframeSrc.split('/').slice(0, 3).join('/')}${iframeVideoSrc}`;
                                return directUrl;
                            }
                        }
                        catch (iframeError) {
                        }
                    }
                }
            }
            // Pattern 3: Look for JavaScript variables containing URLs
            const scriptContent = response.data;
            const urlPatterns = [
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
            for (let i = 0; i < urlPatterns.length; i++) {
                const pattern = urlPatterns[i];
                const match = scriptContent.match(pattern);
                if (match && match[1]) {
                    directUrl = match[1].startsWith('http') ? match[1] : `${url.split('/').slice(0, 3).join('/')}${match[1]}`;
                    return directUrl;
                }
            }
            // Pattern 4: Look for data attributes
            const dataUrl = $('[data-url]').attr('data-url') ||
                $('[data-src]').attr('data-src') ||
                $('[data-file]').attr('data-file');
            if (dataUrl) {
                directUrl = dataUrl.startsWith('http') ? dataUrl : `${url.split('/').slice(0, 3).join('/')}${dataUrl}`;
                return directUrl;
            }
            // Pattern 5: Look for any link that might be a video file
            const videoLinks = $('a[href*=".mp4"], a[href*=".mkv"], a[href*=".avi"], a[href*=".mov"], a[href*=".wmv"], a[href*=".flv"], a[href*=".webm"]');
            if (videoLinks.length > 0) {
                const videoLink = videoLinks.first().attr('href');
                if (videoLink) {
                    directUrl = videoLink.startsWith('http') ? videoLink : `${url.split('/').slice(0, 3).join('/')}${videoLink}`;
                    return directUrl;
                }
            }
            // Pattern 6: Look for any URLs in the page that might be video files
            const allLinks = $('a[href]');
            for (let i = 0; i < Math.min(allLinks.length, 10); i++) {
                const href = $(allLinks[i]).attr('href');
                if (href && (href.includes('.mp4') || href.includes('.mkv') || href.includes('.avi') || href.includes('.mov') || href.includes('.wmv') || href.includes('.flv') || href.includes('.webm'))) {
                    directUrl = href.startsWith('http') ? href : `${url.split('/').slice(0, 3).join('/')}${href}`;
                    return directUrl;
                }
            }
            return null;
        }
        catch (error) {
            console.error("Error scraping 1xplayer URL:", error);
            return null;
        }
    });
}
function extractKmhdLink(katlink, providerContext) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const { axios } = providerContext;
        try {
            // Step 1: Get the initial links page
            const initialResponse = yield axios.get(katlink, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Referer': 'https://katmoviehd.observer/'
                }
            });
            // Check if we need to unlock
            // Handle different response structures in React Native vs Node.js
            const responseUrl = ((_b = (_a = initialResponse.request) === null || _a === void 0 ? void 0 : _a.res) === null || _b === void 0 ? void 0 : _b.responseURL) ||
                ((_c = initialResponse.request) === null || _c === void 0 ? void 0 : _c.responseURL) ||
                ((_d = initialResponse.config) === null || _d === void 0 ? void 0 : _d.url);
            if (responseUrl === null || responseUrl === void 0 ? void 0 : responseUrl.includes('/locked')) {
                // Step 2: Extract unlock form data
                const $locked = cheerio.load(initialResponse.data);
                const form = $locked('form');
                const action = form.attr('action');
                if (!action) {
                    console.error("No unlock form found");
                    return null;
                }
                // Step 3: Submit unlock form
                // Use the exact action as-is since it works
                const unlockUrl = `https://links.kmhd.net/locked${action}`;
                const unlockResponse = yield axios.post(unlockUrl, {}, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Referer': responseUrl,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Origin': 'https://links.kmhd.net'
                    },
                    maxRedirects: 5
                });
                // Step 4: Get the unlocked page
                // Get the unlock response URL safely
                const unlockResponseUrl = ((_f = (_e = unlockResponse.request) === null || _e === void 0 ? void 0 : _e.res) === null || _f === void 0 ? void 0 : _f.responseURL) ||
                    ((_g = unlockResponse.request) === null || _g === void 0 ? void 0 : _g.responseURL) ||
                    ((_h = unlockResponse.config) === null || _h === void 0 ? void 0 : _h.url) ||
                    katlink;
                const unlockedResponse = yield axios.get(katlink, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Referer': unlockResponseUrl,
                        'Cookie': unlockResponse.headers['set-cookie'] ? unlockResponse.headers['set-cookie'].join('; ') : ''
                    }
                });
                // Step 5: Extract server data from unlocked page
                const unlockedData = unlockedResponse.data;
                // Extract upload_links using simple regex
                const uploadLinksMatch = unlockedData.match(/upload_links:\{([^}]+)\}/);
                if (uploadLinksMatch) {
                    const uploadLinksStr = uploadLinksMatch[1];
                    // Parse upload links manually
                    const uploadLinks = {};
                    const linkPairs = uploadLinksStr.split(',');
                    linkPairs.forEach((pair) => {
                        const [key, value] = pair.split(':');
                        if (key && value) {
                            uploadLinks[key.trim()] = value.trim().replace(/"/g, '');
                        }
                    });
                    // Extract server links using simple regex patterns
                    const serverLinks = {};
                    // HubDrive
                    const hubdriveMatch = unlockedData.match(/hubdrive_res:\{mx:(\d+),link:"([^"]+)"/);
                    if (hubdriveMatch) {
                        serverLinks.hubdrive_res = {
                            mx: parseInt(hubdriveMatch[1]),
                            link: hubdriveMatch[2]
                        };
                    }
                    // GDFlix
                    const gdflixMatch = unlockedData.match(/gdflix_res:\{mx:(\d+),link:"([^"]+)"/);
                    if (gdflixMatch) {
                        serverLinks.gdflix_res = {
                            mx: parseInt(gdflixMatch[1]),
                            link: gdflixMatch[2]
                        };
                    }
                    // KatDrive
                    const katdriveMatch = unlockedData.match(/katdrive_res:\{mx:(\d+),link:"([^"]+)"/);
                    if (katdriveMatch) {
                        serverLinks.katdrive_res = {
                            mx: parseInt(katdriveMatch[1]),
                            link: katdriveMatch[2]
                        };
                    }
                    // ClicknUpload
                    const clicknuploadMatch = unlockedData.match(/clicknupload_res:\{mx:(\d+),link:"([^"]+)"/);
                    if (clicknuploadMatch) {
                        serverLinks.clicknupload_res = {
                            mx: parseInt(clicknuploadMatch[1]),
                            link: clicknuploadMatch[2]
                        };
                    }
                    // FuckingFast
                    const ffastMatch = unlockedData.match(/ffast_res:\{mx:(\d+),link:"([^"]+)"/);
                    if (ffastMatch) {
                        serverLinks.ffast_res = {
                            mx: parseInt(ffastMatch[1]),
                            link: ffastMatch[2]
                        };
                    }
                    // 1fichier
                    const fichierMatch = unlockedData.match(/fichier_res:\{mx:(\d+),link:"([^"]+)"/);
                    if (fichierMatch) {
                        serverLinks.fichier_res = {
                            mx: parseInt(fichierMatch[1]),
                            link: fichierMatch[2]
                        };
                    }
                    // Try different servers in order of preference
                    const serverOrder = ['hubdrive_res', 'gdflix_res', 'katdrive_res', 'clicknupload_res', 'ffast_res', 'fichier_res'];
                    for (const serverKey of serverOrder) {
                        if (uploadLinks[serverKey] && uploadLinks[serverKey] !== 'None' && serverLinks[serverKey]) {
                            const serverUrl = serverLinks[serverKey].link + uploadLinks[serverKey];
                            return serverUrl;
                        }
                    }
                }
                // Fallback: Look for 1xplayer pattern
                const chibiPathMatch = unlockedData.match(/"PUBLIC_CHIBI_PATH":"([^"]+)"/);
                if (chibiPathMatch && chibiPathMatch[1]) {
                    const baseUrl = chibiPathMatch[1];
                    const fileIdMatch = katlink.match(/\/file\/([^\/]+)$/);
                    if (fileIdMatch && fileIdMatch[1]) {
                        const finalLink = `${baseUrl}/${fileIdMatch[1]}`;
                        return finalLink;
                    }
                }
            }
            else {
                // Direct access - look for 1xplayer pattern
                const data = initialResponse.data;
                const chibiPathMatch = data.match(/"PUBLIC_CHIBI_PATH":"([^"]+)"/);
                if (chibiPathMatch && chibiPathMatch[1]) {
                    const baseUrl = chibiPathMatch[1];
                    const fileIdMatch = katlink.match(/\/file\/([^\/]+)$/);
                    if (fileIdMatch && fileIdMatch[1]) {
                        const finalLink = `${baseUrl}/${fileIdMatch[1]}`;
                        return finalLink;
                    }
                }
            }
            console.error("No valid streaming link found");
            return null;
        }
        catch (error) {
            console.error("Error in extractKmhdLink:", error.message);
            return null;
        }
    });
}
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, signal, providerContext, }) {
        const { axios, cheerio, extractors } = providerContext;
        const { hubcloudExtracter, gdFlixExtracter } = extractors;
        const streamLinks = [];
        try {
            if (link.includes("gdflix")) {
                return yield gdFlixExtracter(link, signal);
            }
            if (link.includes("kmhd")) {
                const hubcloudLink = yield extractKmhdLink(link, providerContext);
                if (!hubcloudLink) {
                    console.error("Failed to extract hubcloud link from kmhd");
                    return [];
                }
                // Check the type of server and handle accordingly
                if (hubcloudLink.includes("hubcloud.ink")) {
                    // Use hubcloudExtractor for HubCloud links
                    const result = yield hubcloudExtracter(hubcloudLink, signal);
                    return result;
                }
                else if (hubcloudLink.includes("1xplayer.com")) {
                    try {
                        const directUrl = yield scrape1xplayerDirectUrl(hubcloudLink, providerContext);
                        if (directUrl) {
                            return [{
                                    server: "1xPlayer",
                                    link: directUrl,
                                    type: "mkv",
                                    quality: "1080"
                                }];
                        }
                        else {
                            // Try using hubcloudExtractor as fallback for 1xplayer URLs
                            try {
                                const hubcloudStreams = yield hubcloudExtracter(hubcloudLink, signal);
                                if (hubcloudStreams.length > 0) {
                                    return hubcloudStreams;
                                }
                            }
                            catch (hubcloudError) {
                            }
                            // Final fallback - return the original URL
                            return [{
                                    server: "1xPlayer",
                                    link: hubcloudLink,
                                    type: "mkv",
                                    quality: "1080"
                                }];
                        }
                    }
                    catch (error) {
                        return [{
                                server: "1xPlayer",
                                link: hubcloudLink,
                                type: "mkv",
                                quality: "1080"
                            }];
                    }
                }
                else if (hubcloudLink.includes("gd.kmhd.net") || hubcloudLink.includes("katdrive.eu") || hubcloudLink.includes("clicknupload.click") || hubcloudLink.includes("fuckingfast.net") || hubcloudLink.includes("1fichier.com")) {
                    // These are direct file hosting services, try to extract direct links
                    try {
                        const directUrl = yield extractDirectFileUrl(hubcloudLink, providerContext);
                        if (directUrl) {
                            return [{
                                    server: getServerName(hubcloudLink),
                                    link: directUrl,
                                    type: "mkv",
                                    quality: "1080"
                                }];
                        }
                        else {
                            return [{
                                    server: getServerName(hubcloudLink),
                                    link: hubcloudLink,
                                    type: "mkv",
                                    quality: "1080"
                                }];
                        }
                    }
                    catch (error) {
                        return [{
                                server: getServerName(hubcloudLink),
                                link: hubcloudLink,
                                type: "mkv",
                                quality: "1080"
                            }];
                    }
                }
                return yield hubcloudExtracter(hubcloudLink, signal);
            }
            const streams = yield hubcloudExtracter(link, signal);
            return streams;
        }
        catch (error) {
            return [];
        }
    });
};
exports.getStream = getStream;
