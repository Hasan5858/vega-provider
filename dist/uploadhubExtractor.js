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
exports.uploadhubExtractor = uploadhubExtractor;
var cheerio = __importStar(require("cheerio"));
/**
 * Uploadhub Extractor
 *
 * Flow:
 * 1. GET https://uploadhub.dad/{fileId} → 302 redirect to /f/{slug}
 * 2. Parse HTML → Find direct download link in <a> tag
 * 3. Direct link format: https://file*.kingfiles.club:8080/d/{hash}/{filename}
 */
var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
function uploadhubExtractor(url, axios) {
    return __awaiter(this, void 0, void 0, function () {
        var response, $_1, form, formData_1, urlEncoded, postResponse, $post_1, directLink_1, directLinkDiv, href, fileTypeMatch, fileType, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log("[Uploadhub] 🔍 Starting extraction from:", url);
                    return [4 /*yield*/, axios.get(url, {
                            headers: {
                                "User-Agent": USER_AGENT,
                                Referer: "https://howblogs.xyz/",
                            },
                            maxRedirects: 5,
                        })];
                case 1:
                    response = _a.sent();
                    $_1 = cheerio.load(response.data);
                    form = $_1('form[name="F1"]').first();
                    if (form.length === 0) {
                        console.log("[Uploadhub] ❌ Could not find form F1");
                        return [2 /*return*/, null];
                    }
                    formData_1 = {};
                    form.find('input[type="hidden"]').each(function (_, input) {
                        var name = $_1(input).attr("name");
                        var value = $_1(input).attr("value") || "";
                        if (name) {
                            formData_1[name] = value;
                        }
                    });
                    console.log("[Uploadhub] 📋 Form data:", formData_1);
                    urlEncoded = Object.entries(formData_1)
                        .map(function (_a) {
                        var _b = __read(_a, 2), k = _b[0], v = _b[1];
                        return "".concat(encodeURIComponent(k), "=").concat(encodeURIComponent(v));
                    })
                        .join("&");
                    return [4 /*yield*/, axios.post(response.request.res.responseUrl || url, urlEncoded, {
                            headers: {
                                "User-Agent": USER_AGENT,
                                "Content-Type": "application/x-www-form-urlencoded",
                                "Referer": response.request.res.responseUrl || url,
                                "Origin": "https://uploadhub.dad",
                            },
                            maxRedirects: 5,
                        })];
                case 2:
                    postResponse = _a.sent();
                    $post_1 = cheerio.load(postResponse.data);
                    directLink_1 = "";
                    directLinkDiv = $post_1('#direct_link a');
                    if (directLinkDiv.length > 0) {
                        href = directLinkDiv.attr("href");
                        if (href) {
                            directLink_1 = href;
                        }
                    }
                    // Fallback: search all links for kingfiles.club
                    if (!directLink_1) {
                        $post_1('a').each(function (_, link) {
                            var href = $post_1(link).attr("href");
                            if (href && href.includes("kingfiles.club") && href.includes("/d/")) {
                                directLink_1 = href;
                                return false; // break
                            }
                            // Also check for download icon
                            if (href && $post_1(link).find('i.fa-download, i.fas.fa-download').length > 0) {
                                if (href.includes("kingfiles.club") || href.includes("/d/")) {
                                    directLink_1 = href;
                                    return false; // break
                                }
                            }
                        });
                    }
                    if (!directLink_1) {
                        console.log("[Uploadhub] ❌ Could not find direct download link after POST");
                        return [2 /*return*/, null];
                    }
                    console.log("[Uploadhub] ✅ Successfully extracted direct link");
                    fileTypeMatch = directLink_1.match(/\.(mkv|mp4|avi|webm)(\?|$)/i);
                    fileType = fileTypeMatch ? fileTypeMatch[1].toLowerCase() : "mkv";
                    return [2 /*return*/, {
                            link: directLink_1,
                            type: fileType,
                        }];
                case 3:
                    error_1 = _a.sent();
                    console.log("[Uploadhub] ❌ Extraction failed:", (error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || error_1);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
