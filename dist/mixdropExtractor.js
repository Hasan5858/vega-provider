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
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractMixdrop = void 0;
var PACKED_EVAL_REGEX = /eval\(function\(p,a,c,k,e,d\)\{[\s\S]*?\}\([\s\S]*?\)\)/;
/**
 * Mixdrop Video Extractor
 * Extracts direct video links from Mixdrop embed pages
 * Hosts: mixdrop.co, mixdrop.to, etc.
 *
 * This extractor unpacks obfuscated JavaScript to find the video URL
 */
var extractMixdrop = function (mixdropUrl, axios) { return __awaiter(void 0, void 0, void 0, function () {
    var embedUrl, data, match, decoded, transformed, wurl, link, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                embedUrl = mixdropUrl.replace("/f/", "/e/");
                return [4 /*yield*/, axios.get(embedUrl, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                            Referer: mixdropUrl,
                            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                            "Accept-Language": "en-US,en;q=0.9",
                            "Cache-Control": "no-cache",
                            Pragma: "no-cache",
                        },
                    })];
            case 1:
                data = (_a.sent()).data;
                match = data.match(PACKED_EVAL_REGEX);
                if (!match) {
                    console.warn("Mixdrop extractor: Could not find packed JavaScript");
                    return [2 /*return*/, null];
                }
                decoded = void 0;
                try {
                    transformed = match[0].replace(/^eval\(/, "(") + ";";
                    decoded = Function("\"use strict\"; return ".concat(transformed))();
                }
                catch (error) {
                    console.error("Mixdrop extractor: Failed to unpack JavaScript", error);
                    return [2 /*return*/, null];
                }
                wurl = decoded.match(/MDCore\\.wurl="([^"\n]+)"/);
                if (!wurl || !wurl[1]) {
                    console.warn("Mixdrop extractor: Could not find wurl in unpacked code");
                    return [2 /*return*/, null];
                }
                link = wurl[1].startsWith("http") ? wurl[1] : "https:".concat(wurl[1]);
                return [2 /*return*/, {
                        link: link,
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                            Referer: embedUrl,
                        },
                        type: "mp4",
                    }];
            case 2:
                error_1 = _a.sent();
                console.error("Mixdrop extractor failed", error_1);
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.extractMixdrop = extractMixdrop;
