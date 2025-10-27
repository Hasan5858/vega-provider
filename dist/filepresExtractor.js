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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filepresExtractor = filepresExtractor;
const axios_1 = __importDefault(require("axios"));
const headers_1 = require("./headers");
/**
 * FilePres Extractor
 * Extracts direct download links from FilePres URLs using their API
 *
 * FilePres API flow:
 * Step 1: POST /api/file/downlaod/ with fileId
 *   - Payload: {id: fileId, method: "cloudR2Downlaod", captchaValue: ""}
 *   - Response: {data: {downloadId, progress, status}}
 *
 * Step 2: POST /api/file/downlaod2/ with downloadId
 *   - Payload: {id: downloadId, method: "cloudR2Downlaod", captchaValue: null}
 *   - Response: {data: "https://server.../path/to/file"}
 *
 * @param link - FilePres URL (https://new5.filepress.today/file/...)
 * @param signal - AbortSignal for request cancellation
 * @returns Promise<Stream[]> - Array with extracted direct download URL
 */
function filepresExtractor(link, signal) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('[FilePres Extractor] Step 1: Processing URL:', link);
            // Extract file ID from the link
            // Pattern: https://new5.filepress.today/file/{fileId}
            const fileIdMatch = link.match(/\/file\/([a-zA-Z0-9]+)/);
            if (!fileIdMatch || !fileIdMatch[1]) {
                console.log('[FilePres Extractor] Could not extract file ID from URL');
                return [];
            }
            const fileId = fileIdMatch[1];
            console.log('[FilePres Extractor] File ID:', fileId);
            // Step 1: Call /api/file/downlaod/ to get downloadId
            console.log('[FilePres Extractor] Step 2: Requesting initial download ID...');
            const step1Response = yield axios_1.default.post('https://new5.filepress.today/api/file/downlaod/', {
                id: fileId,
                method: 'cloudR2Downlaod',
                captchaValue: ''
            }, {
                headers: Object.assign(Object.assign({}, headers_1.headers), { 'Content-Type': 'application/json', 'Origin': 'https://new5.filepress.today', 'Referer': link, 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }),
                signal,
                timeout: 15000
            });
            if (!step1Response.data.status || !step1Response.data.data) {
                console.error('[FilePres Extractor] Step 1 failed:', step1Response.data);
                return [];
            }
            const downloadId = step1Response.data.data.downloadId;
            console.log('[FilePres Extractor] Step 3: Got download ID:', downloadId);
            // Step 2: Call /api/file/downlaod2/ to get the direct download URL
            console.log('[FilePres Extractor] Step 4: Requesting direct download link...');
            const step2Response = yield axios_1.default.post('https://new5.filepress.today/api/file/downlaod2/', {
                id: downloadId,
                method: 'cloudR2Downlaod',
                captchaValue: null
            }, {
                headers: Object.assign(Object.assign({}, headers_1.headers), { 'Content-Type': 'application/json', 'Origin': 'https://new5.filepress.today', 'Referer': `https://new5.filepress.today/download/`, 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }),
                signal,
                timeout: 15000
            });
            if (!step2Response.data.status || !step2Response.data.data) {
                console.error('[FilePres Extractor] Step 2 failed:', step2Response.data);
                return [];
            }
            const directDownloadUrl = step2Response.data.data;
            if (!directDownloadUrl || typeof directDownloadUrl !== 'string') {
                console.error('[FilePres Extractor] Invalid download URL received:', directDownloadUrl);
                return [];
            }
            console.log('[FilePres Extractor] Step 5: Got direct download URL');
            // Extract quality from URL if available
            let quality = '720';
            if (directDownloadUrl.includes('1080'))
                quality = '1080';
            else if (directDownloadUrl.includes('480'))
                quality = '480';
            else if (directDownloadUrl.includes('360'))
                quality = '360';
            return [
                {
                    server: 'FilePres',
                    link: directDownloadUrl,
                    type: 'mp4',
                    quality: quality
                }
            ];
        }
        catch (error) {
            console.error('[FilePres Extractor Error]', error.message);
            if (error.response) {
                console.error('[FilePres Extractor] Response:', error.response.data);
            }
            return [];
        }
    });
}
