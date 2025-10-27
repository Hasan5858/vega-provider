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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vcloudExtractor = vcloudExtractor;
var axios_1 = __importDefault(require("axios"));
var cheerio = __importStar(require("cheerio"));
var headers_1 = require("./headers");
/**
 * VCloud Extractor
 * Extracts direct download links from VCloud pages
 *
 * VCloud flow:
 * 1. Initial page contains a redirect URL in a script tag with token
 * 2. Follow redirect URL to get to the download page
 * 3. Download page contains direct links to HubCDN, workers.dev, and other file hosting services
 *
 * @param link - VCloud URL (https://vcloud.zip/...)
 * @param signal - AbortSignal for request cancellation
 * @returns Promise<Stream[]> - Array with extracted direct download streams
 */
function vcloudExtractor(link, signal) {
    return __awaiter(this, void 0, void 0, function () {
        var initialResponse, initialHtml, redirectMatch, redirectUrl, redirectResponse, downloadPageHtml, $_1, streams_1, seenLinks_1, allLinks, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log('[VCloud Extractor] Step 1: Fetching initial page:', link);
                    return [4 /*yield*/, axios_1.default.get(link, {
                            headers: headers_1.headers,
                            signal: signal,
                            timeout: 15000
                        })];
                case 1:
                    initialResponse = _a.sent();
                    initialHtml = initialResponse.data;
                    redirectMatch = initialHtml.match(/var\s+url\s*=\s*['"]([^'"]+)['"]/);
                    if (!redirectMatch || !redirectMatch[1]) {
                        console.log('[VCloud Extractor] No redirect URL found in initial page');
                        return [2 /*return*/, []];
                    }
                    redirectUrl = redirectMatch[1];
                    console.log('[VCloud Extractor] Step 2: Found redirect URL, following...');
                    return [4 /*yield*/, axios_1.default.get(redirectUrl, {
                            headers: headers_1.headers,
                            signal: signal,
                            timeout: 15000
                        })];
                case 2:
                    redirectResponse = _a.sent();
                    downloadPageHtml = redirectResponse.data;
                    $_1 = cheerio.load(downloadPageHtml);
                    streams_1 = [];
                    seenLinks_1 = new Set();
                    allLinks = $_1('a[href]');
                    console.log('[VCloud Extractor] Step 3: Parsing download page for direct links...');
                    allLinks.each(function (_, element) {
                        var href = $_1(element).attr('href');
                        if (!href || seenLinks_1.has(href))
                            return;
                        // Skip internal navigation links
                        if (href === '#' || href.startsWith('javascript:') || href.startsWith('http://one.one.one.one')) {
                            return;
                        }
                        var server = 'Unknown';
                        var quality = '720';
                        // Identify server type from URL
                        if (href.includes('gpdl') || href.includes('hubcdn')) {
                            server = 'HubCDN';
                        }
                        else if (href.includes('workers.dev') || href.includes('cloudflare')) {
                            server = 'Cloudflare Worker';
                        }
                        else if (href.includes('fsl.') || href.includes('anime4u')) {
                            server = 'Direct Link';
                        }
                        else if (href.includes('binidek') || href.includes('holy-frost')) {
                            server = 'Backup Server';
                        }
                        else if (href.includes('drive.google.com') || href.includes('gdtot')) {
                            server = 'Google Drive';
                        }
                        else if (href.includes('fastdl')) {
                            server = 'FastDL';
                        }
                        else if (href.includes('filebee') || href.includes('filepress')) {
                            server = 'FileBee';
                        }
                        else if (href.includes('dropgalaxy')) {
                            server = 'DropGalaxy';
                        }
                        else if (href.match(/\.(mp4|mkv|avi|mov|flv)$/i)) {
                            // Direct file link
                            server = 'Direct File';
                        }
                        else {
                            // Skip unknown links
                            return;
                        }
                        // Extract quality if available in filename
                        if (href.includes('1080p'))
                            quality = '1080';
                        else if (href.includes('720p'))
                            quality = '720';
                        else if (href.includes('480p'))
                            quality = '480';
                        else if (href.includes('360p'))
                            quality = '360';
                        streams_1.push({
                            server: server,
                            link: href,
                            type: 'mp4',
                            quality: quality
                        });
                        seenLinks_1.add(href);
                        console.log("[VCloud Extractor] Added ".concat(server, ": ").concat(href.substring(0, 50), "..."));
                    });
                    console.log('[VCloud Extractor] Step 4: Extracted', streams_1.length, 'download links');
                    return [2 /*return*/, streams_1];
                case 3:
                    error_1 = _a.sent();
                    console.error('[VCloud Extractor Error]', error_1.message);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
