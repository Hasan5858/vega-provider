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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = getStream;
var headers = {
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en;q=0.9,en-IN;q=0.8",
    "cache-control": "no-cache",
    pragma: "no-cache",
    priority: "u=0, i",
    "sec-ch-ua": '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
};
function getStream(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio, extractors, hubcloudExtracter, gdFlixExtracter, streamLinks, dotlinkRes, dotlinkText, vlink, $, filepressLink, filepressID, filepressBaseUrl, filepressTokenRes, filepressToken, filepressStreamLink, error_1, extractedLinks, error_2;
        var _c, _d, _e, _f, _g, _h, _j;
        var link = _b.link, type = _b.type, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio, extractors = providerContext.extractors;
                    hubcloudExtracter = extractors.hubcloudExtracter, gdFlixExtracter = extractors.gdFlixExtracter;
                    _k.label = 1;
                case 1:
                    _k.trys.push([1, 15, , 16]);
                    streamLinks = [];
                    console.log("Joya9tv getStream - processing link:", link === null || link === void 0 ? void 0 : link.substring(0, 80));
                    if (!(type === "movie")) return [3 /*break*/, 9];
                    return [4 /*yield*/, fetch("".concat(link), { headers: headers })];
                case 2:
                    dotlinkRes = _k.sent();
                    return [4 /*yield*/, dotlinkRes.text()];
                case 3:
                    dotlinkText = _k.sent();
                    vlink = dotlinkText.match(/<a\s+href="([^"]*cloud\.[^"]*)"/i) || [];
                    // console.log('vLink', vlink[1]);
                    link = vlink[1];
                    console.log("Joya9tv getStream - extracted vlink:", link === null || link === void 0 ? void 0 : link.substring(0, 80));
                    _k.label = 4;
                case 4:
                    _k.trys.push([4, 8, , 9]);
                    $ = cheerio.load(dotlinkText);
                    filepressLink = $('.btn.btn-sm.btn-outline[style="background:linear-gradient(135deg,rgb(252,185,0) 0%,rgb(0,0,0)); color: #fdf8f2;"]')
                        .parent()
                        .attr("href");
                    filepressID = filepressLink === null || filepressLink === void 0 ? void 0 : filepressLink.split("/").pop();
                    filepressBaseUrl = filepressLink === null || filepressLink === void 0 ? void 0 : filepressLink.split("/").slice(0, -2).join("/");
                    console.log("Joya9tv getStream - found filepress link");
                    if (!(filepressBaseUrl && filepressID)) return [3 /*break*/, 7];
                    return [4 /*yield*/, axios.post(filepressBaseUrl + "/api/file/downlaod/", {
                            id: filepressID,
                            method: "indexDownlaod",
                            captchaValue: null,
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                Referer: filepressBaseUrl,
                            },
                        })];
                case 5:
                    filepressTokenRes = _k.sent();
                    if (!((_c = filepressTokenRes.data) === null || _c === void 0 ? void 0 : _c.status)) return [3 /*break*/, 7];
                    filepressToken = (_d = filepressTokenRes.data) === null || _d === void 0 ? void 0 : _d.data;
                    return [4 /*yield*/, axios.post(filepressBaseUrl + "/api/file/downlaod2/", {
                            id: filepressToken,
                            method: "indexDownlaod",
                            captchaValue: null,
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                Referer: filepressBaseUrl,
                            },
                        })];
                case 6:
                    filepressStreamLink = _k.sent();
                    // console.log('filepressStreamLink', filepressStreamLink.data);
                    if ((_f = (_e = filepressStreamLink.data) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f[0]) {
                        streamLinks.push({
                            server: "filepress",
                            link: (_h = (_g = filepressStreamLink.data) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h[0],
                            type: "mkv",
                        });
                        console.log("Joya9tv getStream - filepress link added");
                    }
                    _k.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_1 = _k.sent();
                    console.log("Joya9tv getStream - filepress extraction failed:", error_1 instanceof Error ? error_1.message : String(error_1));
                    return [3 /*break*/, 9];
                case 9:
                    if (!link) return [3 /*break*/, 14];
                    console.log("Joya9tv getStream - extracting from:", link === null || link === void 0 ? void 0 : link.substring(0, 80));
                    extractedLinks = [];
                    if (!link.includes("hubcloud")) return [3 /*break*/, 11];
                    return [4 /*yield*/, hubcloudExtracter(link, signal)];
                case 10:
                    extractedLinks = _k.sent();
                    console.log("Joya9tv getStream - extracted", extractedLinks.length, "links from hubcloud");
                    return [3 /*break*/, 13];
                case 11:
                    if (!(link.includes("gdflix") || extractedLinks.length === 0)) return [3 /*break*/, 13];
                    console.log("Joya9tv getStream - trying gdflix extractor");
                    return [4 /*yield*/, gdFlixExtracter(link, signal)];
                case 12:
                    extractedLinks = _k.sent();
                    console.log("Joya9tv getStream - extracted", extractedLinks.length, "links from gdflix");
                    _k.label = 13;
                case 13:
                    if (extractedLinks.length > 0) {
                        streamLinks.push.apply(streamLinks, __spreadArray([], __read(extractedLinks), false));
                    }
                    else {
                        console.log("Joya9tv getStream - extraction failed, returning intermediate link as fallback");
                        // Fallback: return the intermediate link as-is
                        streamLinks.push({
                            server: "hubcloud/gdflix",
                            link: link,
                            type: "mkv",
                        });
                    }
                    _k.label = 14;
                case 14:
                    console.log("Joya9tv getStream - returning", streamLinks.length, "total stream links");
                    return [2 /*return*/, streamLinks];
                case 15:
                    error_2 = _k.sent();
                    console.log("Joya9tv getStream - error:", (error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || String(error_2));
                    if ((_j = error_2.message) === null || _j === void 0 ? void 0 : _j.includes("Aborted")) {
                        console.log("Joya9tv getStream - request was aborted");
                    }
                    return [2 /*return*/, []];
                case 16: return [2 /*return*/];
            }
        });
    });
}
