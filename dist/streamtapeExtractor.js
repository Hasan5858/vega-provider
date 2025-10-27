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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamtapeExtractor = streamtapeExtractor;
var axios_1 = __importDefault(require("axios"));
var getOrigin = function (input) {
    var match = input.match(/^(https?:\/\/[^/]+)/i);
    return match ? match[1] : "https://streamta.site";
};
/**
 * StreamTape Video Extractor
 * Extracts direct video links from StreamTape embed pages by parsing obfuscated JavaScript
 *
 * The extractor handles StreamTape's JavaScript obfuscation which manipulates the robotlink
 * element's innerHTML using substring operations to hide the actual video URL.
 *
 * @param url - StreamTape embed URL (e.g., https://streamta.site/e/xxx)
 * @param axiosInstance - Axios instance to use for requests (defaults to imported axios)
 * @param signal - AbortSignal for request cancellation
 * @returns Object with video link and headers, or null if extraction fails
 */
function streamtapeExtractor(url_1) {
    return __awaiter(this, arguments, void 0, function (url, axiosInstance, signal) {
        var data, html, robotlinkMatch, rawLink, prefix, mangledString, firstSubstring, secondSubstring, processed, directMatch, normalized, finalUrl, error_1;
        if (axiosInstance === void 0) { axiosInstance = axios_1.default; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("StreamTape: Fetching embed page: ".concat(url));
                    return [4 /*yield*/, axiosInstance.get(url, {
                            headers: {
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                                Referer: url,
                                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                                "Accept-Language": "en-US,en;q=0.9",
                                "Cache-Control": "no-cache",
                                Pragma: "no-cache",
                            },
                            signal: signal,
                        })];
                case 1:
                    data = (_a.sent()).data;
                    html = data;
                    robotlinkMatch = html.match(/getElementById\('robotlink'\)\.innerHTML\s*=\s*'([^']+)'\s*\+\s*\('([^']+)'\)\.substring\((\d+)\)(?:\.substring\((\d+)\))?/);
                    rawLink = "";
                    if (robotlinkMatch) {
                        prefix = robotlinkMatch[1];
                        mangledString = robotlinkMatch[2];
                        firstSubstring = parseInt(robotlinkMatch[3]);
                        secondSubstring = robotlinkMatch[4] ? parseInt(robotlinkMatch[4]) : 0;
                        processed = mangledString.substring(firstSubstring);
                        if (secondSubstring > 0) {
                            processed = processed.substring(secondSubstring);
                        }
                        rawLink = prefix + processed;
                        console.log("StreamTape: Parsed JavaScript manipulation: ".concat(rawLink));
                    }
                    else {
                        directMatch = html.match(/id="robotlink"[^>]*>([^<]+)</);
                        if (!directMatch) {
                            directMatch = html.match(/document\.getElementById\('robotlink'\)\.innerHTML\s*=\s*'([^']+)'/);
                        }
                        if (!directMatch) {
                            directMatch = html.match(/'robotlink'\)\.innerHTML\s*=\s*'([^']+)'/);
                        }
                        if (!directMatch || !directMatch[1]) {
                            console.warn("StreamTape: Could not find video link in page");
                            return [2 /*return*/, null];
                        }
                        rawLink = directMatch[1];
                        console.log("StreamTape: Extracted from HTML: ".concat(rawLink));
                    }
                    rawLink = rawLink
                        .replace(/\\u0026/g, "&")
                        .replace(/&amp;/g, "&")
                        .trim();
                    console.log("StreamTape: Cleaned link: ".concat(rawLink));
                    normalized = void 0;
                    if (rawLink.startsWith("http") || rawLink.startsWith("https")) {
                        // Already a complete URL
                        normalized = rawLink;
                    }
                    else if (rawLink.startsWith("//")) {
                        // Protocol-relative URL
                        normalized = "https:".concat(rawLink);
                    }
                    else if (rawLink.startsWith("/")) {
                        // Normal path, prepend origin
                        normalized = "".concat(getOrigin(url)).concat(rawLink);
                    }
                    else {
                        // Relative path
                        normalized = "".concat(getOrigin(url), "/").concat(rawLink);
                    }
                    finalUrl = normalized.includes("&stream=") || normalized.includes("stream=")
                        ? normalized
                        : "".concat(normalized, "&stream=1");
                    console.log("StreamTape: Final URL: ".concat(finalUrl));
                    return [2 /*return*/, {
                            link: finalUrl,
                            headers: {
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                                Referer: url,
                            },
                            type: "mp4",
                        }];
                case 2:
                    error_1 = _a.sent();
                    console.error("StreamTape extractor failed", error_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
