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
exports.nexdriveExtractor = nexdriveExtractor;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const headers_1 = require("./headers");
/**
 * NexDrive Extractor
 * Extracts streaming links from nexdrive.top
 * NexDrive pages contain links to various streaming services
 */
function nexdriveExtractor(link, signal) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('[NexDrive] Extracting from:', link);
            const res = yield axios_1.default.get(link, { headers: headers_1.headers, signal, timeout: 15000 });
            const html = res.data;
            const $ = cheerio.load(html);
            const streams = [];
            const seenLinks = new Set();
            // Find all download buttons/links on the page
            const links = $('a[href*="fastdl"], a[href*="vcloud"], a[href*="filebee"], a[href*="gdtot"], a[href*="dropgalaxy"], a[href*="dgdrive"]');
            console.log('[NexDrive] Found', links.length, 'streaming service links');
            links.each((_, element) => {
                const href = $(element).attr('href');
                const text = $(element).text().trim();
                if (!href || seenLinks.has(href))
                    return;
                let server = 'Unknown';
                let extractorName = '';
                if (href.includes('fastdl')) {
                    server = 'FastDL';
                    extractorName = 'FastDL (Direct)';
                }
                else if (href.includes('vcloud')) {
                    server = 'VCloud';
                    extractorName = 'VCloud (Resumable)';
                }
                else if (href.includes('filebee') || href.includes('filepress')) {
                    server = 'FileBee';
                    extractorName = 'FileBee (Google Drive)';
                }
                else if (href.includes('gdtot')) {
                    server = 'GDTot';
                    extractorName = 'GDTot (Google Drive)';
                }
                else if (href.includes('dropgalaxy') || href.includes('dgdrive')) {
                    server = 'DropGalaxy';
                    extractorName = 'DropGalaxy';
                }
                streams.push({
                    server: server,
                    link: href,
                    type: 'mp4',
                    quality: '720',
                });
                seenLinks.add(href);
                console.log(`[NexDrive] Added ${extractorName}: ${server}`);
            });
            console.log('[NexDrive] Extracted', streams.length, 'streams');
            return streams;
        }
        catch (error) {
            console.error('[NexDrive] Error:', error.message);
            return [];
        }
    });
}
