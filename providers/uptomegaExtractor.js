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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uptomegaExtractor = uptomegaExtractor;
var cheerio = __importStar(require("cheerio"));
/**
 * Uptomega Extractor
 *
 * Flow:
 * 1. GET https://uptomega.net/{fileId} → parse form
 * 2. POST with op=download1, id, fname, referer → get countdown page
 * 3. POST with op=download2, id, rand, referer → 302 redirect to direct download
 * 4. Extract location header: http://down1.uptodown1.com:8080/d/[hash]/[filename]
 */
var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
function uptomegaExtractor(url, axios) {
    return __awaiter(this, void 0, void 0, function () {
        var step1Response, $initial_1, formData_1, form, submitBtn, urlEncodedData, step2Response, $countdown_1, finalForm, anyForms, finalFormData_1, finalData, step3Response, directLink, fileType, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    console.log("[Uptomega] 🔍 Starting extraction from:", url);
                    return [4 /*yield*/, axios.get(url, {
                            headers: {
                                "User-Agent": USER_AGENT,
                                Referer: "https://howblogs.xyz/",
                            },
                            maxRedirects: 5,
                        })];
                case 1:
                    step1Response = _b.sent();
                    $initial_1 = cheerio.load(step1Response.data);
                    formData_1 = {};
                    form = $initial_1('form[method="POST"][action=""]').first();
                    if (form.length === 0) {
                        console.log("[Uptomega] ❌ Could not find form");
                        return [2 /*return*/, null];
                    }
                    // Extract all hidden form fields (includes op, usr_login, id, fname, referer)
                    form.find('input[type="hidden"]').each(function (_, input) {
                        var name = $initial_1(input).attr("name");
                        var value = $initial_1(input).attr("value") || "";
                        if (name) {
                            formData_1[name] = value;
                        }
                    });
                    submitBtn = form.find('input[type="submit"][name="method_free"]');
                    if (submitBtn.length) {
                        formData_1.method_free = submitBtn.attr("value") || "Free Download >>";
                    }
                    // Ensure required fields are present
                    if (!formData_1.id) {
                        console.log("[Uptomega] ❌ Missing file ID in form");
                        return [2 /*return*/, null];
                    }
                    console.log("[Uptomega] 📝 File ID:", formData_1.id);
                    urlEncodedData = Object.entries(formData_1)
                        .map(function (_a) {
                        var key = _a[0], value = _a[1];
                        return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(value));
                    })
                        .join("&");
                    return [4 /*yield*/, axios.post(url, urlEncodedData, {
                            headers: {
                                "User-Agent": USER_AGENT,
                                "Content-Type": "application/x-www-form-urlencoded",
                                Referer: url,
                                Origin: "https://uptomega.net",
                            },
                            maxRedirects: 5,
                        })];
                case 2:
                    step2Response = _b.sent();
                    $countdown_1 = cheerio.load(step2Response.data);
                    finalForm = $countdown_1('form[name="F1"]').first();
                    if (finalForm.length === 0) {
                        console.log("[Uptomega] ❌ Could not find final form (name=F1)");
                        console.log("[Uptomega] Checking for any forms...");
                        anyForms = $countdown_1('form');
                        console.log("[Uptomega] Found", anyForms.length, "forms on countdown page");
                        return [2 /*return*/, null];
                    }
                    finalFormData_1 = {};
                    finalForm.find("input").each(function (_, input) {
                        var name = $countdown_1(input).attr("name");
                        var value = $countdown_1(input).attr("value") || "";
                        if (name && name !== "adblock_detected") {
                            finalFormData_1[name] = value;
                        }
                    });
                    console.log("[Uptomega] 📋 Final form data:", finalFormData_1);
                    // Verify we have the required fields
                    if (!finalFormData_1.id || !finalFormData_1.op) {
                        console.log("[Uptomega] ❌ Missing required fields in final form");
                        return [2 /*return*/, null];
                    }
                    console.log("[Uptomega] 🔗 Submitting final download request");
                    finalData = Object.entries(finalFormData_1)
                        .map(function (_a) {
                        var key = _a[0], value = _a[1];
                        return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(value));
                    })
                        .join("&");
                    return [4 /*yield*/, axios.post(url, finalData, {
                            headers: {
                                "User-Agent": USER_AGENT,
                                "Content-Type": "application/x-www-form-urlencoded",
                                Referer: url,
                                Origin: "https://uptomega.net",
                            },
                            maxRedirects: 0, // Don't follow redirect, we want the Location header
                            validateStatus: function (status) { return status === 302 || status === 301; },
                        })];
                case 3:
                    step3Response = _b.sent();
                    directLink = step3Response.headers.location;
                    if (directLink) {
                        console.log("[Uptomega] ✅ Successfully extracted direct link");
                        fileType = ((_a = directLink.match(/\.(mkv|mp4|avi|webm)(\?|$)/i)) === null || _a === void 0 ? void 0 : _a[1]) || "mkv";
                        return [2 /*return*/, {
                                link: directLink,
                                type: fileType.toLowerCase(),
                            }];
                    }
                    console.log("[Uptomega] ❌ Could not find download link in response");
                    return [2 /*return*/, null];
                case 4:
                    error_1 = _b.sent();
                    console.log("[Uptomega] ❌ Extraction failed:", (error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || error_1);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
