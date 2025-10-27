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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vcloudExtractor = vcloudExtractor;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const headers_1 = require("./headers");
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
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('[VCloud Extractor] Step 1: Fetching initial page:', link);
            // Step 1: Fetch the initial VCloud page
            const initialResponse = yield axios_1.default.get(link, {
                headers: headers_1.headers,
                signal,
                timeout: 15000
            });
            const initialHtml = initialResponse.data;
            // Step 2: Extract redirect URL from script tag
            // Pattern: var url = 'https://vcloud.zip/...'
            const redirectMatch = initialHtml.match(/var\s+url\s*=\s*['"]([^'"]+)['"]/);
            if (!redirectMatch || !redirectMatch[1]) {
                console.log('[VCloud Extractor] No redirect URL found in initial page');
                return [];
            }
            const redirectUrl = redirectMatch[1];
            console.log('[VCloud Extractor] Step 2: Found redirect URL, following...');
            // Step 3: Follow the redirect URL to get the download page
            const redirectResponse = yield axios_1.default.get(redirectUrl, {
                headers: headers_1.headers,
                signal,
                timeout: 15000
            });
            const downloadPageHtml = redirectResponse.data;
            const $ = cheerio.load(downloadPageHtml);
            const streams = [];
            const seenLinks = new Set();
            // Step 4: Extract direct download links from the download page
            // Look for href attributes with common direct download service domains
            const allLinks = $('a[href]');
            console.log('[VCloud Extractor] Step 3: Parsing download page for direct links...');
            allLinks.each((_, element) => {
                const href = $(element).attr('href');
                if (!href || seenLinks.has(href))
                    return;
                // Skip internal navigation links
                if (href === '#' || href.startsWith('javascript:') || href.startsWith('http://one.one.one.one')) {
                    return;
                }
                let server = 'Unknown';
                let quality = '720';
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
                streams.push({
                    server: server,
                    link: href,
                    type: 'mp4',
                    quality: quality
                });
                seenLinks.add(href);
                console.log(`[VCloud Extractor] Added ${server}: ${href.substring(0, 50)}...`);
            });
            console.log('[VCloud Extractor] Step 4: Extracted', streams.length, 'download links');
            return streams;
        }
        catch (error) {
            console.error('[VCloud Extractor Error]', error.message);
            return [];
        }
    });
}
