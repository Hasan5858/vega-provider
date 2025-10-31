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
exports.indishareExtractor = indishareExtractor;
var axios_1 = __importDefault(require("axios"));
var cheerio = __importStar(require("cheerio"));
/**
 * Indishare Extractor
 *
 * Flow (based on browser analysis):
 * 1. dl6.indishare.info/xxx → 301 → indi-share.com/xxx → 302 → indi-down4.org/xxx
 * 2. Parse download button URL from indi-down4.org (links to random blog post)
 * 3. GET the blog post page (collects cookies including file_code)
 * 4. Extract form fields (op, id, referer, etc.) from the page
 * 5. POST form data to the form action URL
 * 6. Parse the response HTML - direct link is already there (countdown is client-side JS only)
 * 7. Extract link: https://uyh4ghd4gh4uy.indiworlds.com:183/d/[hash]/filename.mkv
 */
var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
function indishareExtractor(url) {
    return __awaiter(this, void 0, void 0, function () {
        var step1Response, downPageUrl, fileCodeMatch, fileCode, serverCookies, cookieString, $down, downloadButton, blogUrl, step2Response, newCookies, additionalCookies, $blog_1, form, formData_1, formAction, formUrl, step3Response, $final, directLink, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    console.log("[Indishare] 🔍 Starting extraction from:", url);
                    return [4 /*yield*/, axios_1.default.get(url, {
                            headers: {
                                "User-Agent": USER_AGENT,
                                Referer: "https://skymovieshd.mba/",
                            },
                            maxRedirects: 5,
                            validateStatus: function (status) { return status < 400; },
                        })];
                case 1:
                    step1Response = _a.sent();
                    downPageUrl = step1Response.request.res.responseUrl || url;
                    console.log("[Indishare] 📍 Redirected to:", downPageUrl);
                    fileCodeMatch = downPageUrl.match(/\/([a-z0-9]+)$/i);
                    fileCode = fileCodeMatch ? fileCodeMatch[1] : "";
                    if (!fileCode) {
                        console.log("[Indishare] ❌ Could not extract file code from URL");
                        return [2 /*return*/, null];
                    }
                    console.log("[Indishare] 🔑 File code:", fileCode);
                    serverCookies = step1Response.headers["set-cookie"] || [];
                    cookieString = serverCookies
                        .map(function (cookie) { return cookie.split(";")[0]; })
                        .join("; ");
                    // Add file_code cookie
                    cookieString = cookieString
                        ? "file_code=".concat(fileCode, "; ").concat(cookieString)
                        : "file_code=".concat(fileCode);
                    console.log("[Indishare] 🍪 Cookies:", cookieString);
                    $down = cheerio.load(step1Response.data);
                    downloadButton = $down('a.button[href*="indi-share.com"]').first();
                    blogUrl = downloadButton.attr("href");
                    if (!blogUrl) {
                        console.log("[Indishare] ❌ Could not find download button");
                        return [2 /*return*/, null];
                    }
                    console.log("[Indishare] 🔗 Found blog URL:", blogUrl);
                    return [4 /*yield*/, axios_1.default.get(blogUrl, {
                            headers: {
                                "User-Agent": USER_AGENT,
                                Referer: downPageUrl,
                                Cookie: cookieString,
                            },
                            maxRedirects: 5,
                        })];
                case 2:
                    step2Response = _a.sent();
                    newCookies = step2Response.headers["set-cookie"] || [];
                    if (newCookies.length > 0) {
                        additionalCookies = newCookies
                            .map(function (cookie) { return cookie.split(";")[0]; })
                            .join("; ");
                        cookieString = cookieString
                            ? "".concat(cookieString, "; ").concat(additionalCookies)
                            : additionalCookies;
                    }
                    console.log("[Indishare] 🍪 Total cookies:", cookieString);
                    $blog_1 = cheerio.load(step2Response.data);
                    form = $blog_1('form[name="F1"]').first();
                    if (form.length === 0) {
                        // Fallback: look for any form with POST method
                        form = $blog_1('form[method="POST"]').first();
                    }
                    if (form.length === 0) {
                        console.log("[Indishare] ❌ Could not find download form");
                        return [2 /*return*/, null];
                    }
                    formData_1 = {};
                    formAction = $blog_1(form).attr("action");
                    if (!formAction) {
                        console.log("[Indishare] ❌ Form has no action");
                        return [2 /*return*/, null];
                    }
                    formUrl = formAction.startsWith("http")
                        ? formAction
                        : "https://indi-share.com".concat(formAction);
                    // Extract all form fields
                    $blog_1(form).find("input").each(function (_, input) {
                        var name = $blog_1(input).attr("name");
                        var value = $blog_1(input).attr("value") || "";
                        if (name) {
                            formData_1[name] = value;
                        }
                    });
                    console.log("[Indishare] 📝 Form action:", formUrl);
                    console.log("[Indishare] 📝 Form data:", formData_1);
                    return [4 /*yield*/, axios_1.default.post(formUrl, formData_1, {
                            headers: {
                                "User-Agent": USER_AGENT,
                                Referer: blogUrl,
                                "Content-Type": "application/x-www-form-urlencoded",
                                Cookie: cookieString,
                            },
                            maxRedirects: 5,
                        })];
                case 3:
                    step3Response = _a.sent();
                    $final = cheerio.load(step3Response.data);
                    directLink = $final('a[href*="indiworlds.com"]').attr("href");
                    if (directLink) {
                        console.log("[Indishare] ✅ Successfully extracted direct link");
                        return [2 /*return*/, {
                                link: directLink,
                                type: "mkv",
                            }];
                    }
                    console.log("[Indishare] ❌ Could not find direct download link in response");
                    return [2 /*return*/, null];
                case 4:
                    error_1 = _a.sent();
                    console.log("[Indishare] ❌ Extraction failed:", (error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || error_1);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
