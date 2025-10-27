"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.filepresExtractor = filepresExtractor;
var axios_1 = __importDefault(require("axios"));
var headers_1 = require("./headers");
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
    return __awaiter(this, void 0, void 0, function () {
        var fileIdMatch, fileId, step1Response, downloadId, step2Response, directDownloadUrl, quality, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log('[FilePres Extractor] Step 1: Processing URL:', link);
                    fileIdMatch = link.match(/\/file\/([a-zA-Z0-9]+)/);
                    if (!fileIdMatch || !fileIdMatch[1]) {
                        console.log('[FilePres Extractor] Could not extract file ID from URL');
                        return [2 /*return*/, []];
                    }
                    fileId = fileIdMatch[1];
                    console.log('[FilePres Extractor] File ID:', fileId);
                    // Step 1: Call /api/file/downlaod/ to get downloadId
                    console.log('[FilePres Extractor] Step 2: Requesting initial download ID...');
                    return [4 /*yield*/, axios_1.default.post('https://new5.filepress.today/api/file/downlaod/', {
                            id: fileId,
                            method: 'cloudR2Downlaod',
                            captchaValue: ''
                        }, {
                            headers: __assign(__assign({}, headers_1.headers), { 'Content-Type': 'application/json', 'Origin': 'https://new5.filepress.today', 'Referer': link, 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }),
                            signal: signal,
                            timeout: 15000
                        })];
                case 1:
                    step1Response = _a.sent();
                    if (!step1Response.data.status || !step1Response.data.data) {
                        console.error('[FilePres Extractor] Step 1 failed:', step1Response.data);
                        return [2 /*return*/, []];
                    }
                    downloadId = step1Response.data.data.downloadId;
                    console.log('[FilePres Extractor] Step 3: Got download ID:', downloadId);
                    // Step 2: Call /api/file/downlaod2/ to get the direct download URL
                    console.log('[FilePres Extractor] Step 4: Requesting direct download link...');
                    return [4 /*yield*/, axios_1.default.post('https://new5.filepress.today/api/file/downlaod2/', {
                            id: downloadId,
                            method: 'cloudR2Downlaod',
                            captchaValue: null
                        }, {
                            headers: __assign(__assign({}, headers_1.headers), { 'Content-Type': 'application/json', 'Origin': 'https://new5.filepress.today', 'Referer': "https://new5.filepress.today/download/", 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }),
                            signal: signal,
                            timeout: 15000
                        })];
                case 2:
                    step2Response = _a.sent();
                    if (!step2Response.data.status || !step2Response.data.data) {
                        console.error('[FilePres Extractor] Step 2 failed:', step2Response.data);
                        return [2 /*return*/, []];
                    }
                    directDownloadUrl = step2Response.data.data;
                    if (!directDownloadUrl || typeof directDownloadUrl !== 'string') {
                        console.error('[FilePres Extractor] Invalid download URL received:', directDownloadUrl);
                        return [2 /*return*/, []];
                    }
                    console.log('[FilePres Extractor] Step 5: Got direct download URL');
                    quality = '720';
                    if (directDownloadUrl.includes('1080'))
                        quality = '1080';
                    else if (directDownloadUrl.includes('480'))
                        quality = '480';
                    else if (directDownloadUrl.includes('360'))
                        quality = '360';
                    return [2 /*return*/, [
                            {
                                server: 'FilePres',
                                link: directDownloadUrl,
                                type: 'mp4',
                                quality: quality
                            }
                        ]];
                case 3:
                    error_1 = _a.sent();
                    console.error('[FilePres Extractor Error]', error_1.message);
                    if (error_1.response) {
                        console.error('[FilePres Extractor] Response:', error_1.response.data);
                    }
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
