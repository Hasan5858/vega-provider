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
exports.getStream = getStream;
exports.getRedirectLinks = getRedirectLinks;
exports.decodeString = decodeString;
function getStream(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio, extractors, headers, hubcloudExtracter, hubdriveLink, hubdriveRes, hubdriveText, $, res, text, encryptedString, decodedString, redirectLink, redirectLinkRes, redirectLinkText, $, hubdriveRes, hubdriveText, $$, hubdriveLinkRes, hubcloudText, hubcloudLink, error_1;
        var _c, _d, _e, _f;
        var link = _b.link, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio, extractors = providerContext.extractors, headers = providerContext.commonHeaders;
                    hubcloudExtracter = extractors.hubcloudExtracter;
                    hubdriveLink = "";
                    if (!link.includes("hubdrive")) return [3 /*break*/, 2];
                    return [4 /*yield*/, axios.get(link, { headers: headers, signal: signal })];
                case 1:
                    hubdriveRes = _g.sent();
                    hubdriveText = hubdriveRes.data;
                    $ = cheerio.load(hubdriveText);
                    hubdriveLink =
                        $(".btn.btn-primary.btn-user.btn-success1.m-1").attr("href") || link;
                    return [3 /*break*/, 7];
                case 2: return [4 /*yield*/, axios.get(link, { headers: headers, signal: signal })];
                case 3:
                    res = _g.sent();
                    text = res.data;
                    encryptedString = (_e = (_d = (_c = text.split("s('o','")) === null || _c === void 0 ? void 0 : _c[1]) === null || _d === void 0 ? void 0 : _d.split("',180")) === null || _e === void 0 ? void 0 : _e[0];
                    decodedString = decodeString(encryptedString);
                    link = atob(decodedString === null || decodedString === void 0 ? void 0 : decodedString.o);
                    return [4 /*yield*/, getRedirectLinks(link, signal, headers)];
                case 4:
                    redirectLink = _g.sent();
                    return [4 /*yield*/, axios.get(redirectLink, { headers: headers, signal: signal })];
                case 5:
                    redirectLinkRes = _g.sent();
                    redirectLinkText = redirectLinkRes.data;
                    $ = cheerio.load(redirectLinkText);
                    hubdriveLink =
                        $('h3:contains("1080p")').find("a").attr("href") ||
                            redirectLinkText.match(/href="(https:\/\/hubcloud\.[^\/]+\/drive\/[^"]+)"/)[1];
                    if (!hubdriveLink.includes("hubdrive")) return [3 /*break*/, 7];
                    return [4 /*yield*/, axios.get(hubdriveLink, { headers: headers, signal: signal })];
                case 6:
                    hubdriveRes = _g.sent();
                    hubdriveText = hubdriveRes.data;
                    $$ = cheerio.load(hubdriveText);
                    hubdriveLink =
                        $$(".btn.btn-primary.btn-user.btn-success1.m-1").attr("href") ||
                            hubdriveLink;
                    _g.label = 7;
                case 7: return [4 /*yield*/, axios.get(hubdriveLink, { headers: headers, signal: signal })];
                case 8:
                    hubdriveLinkRes = _g.sent();
                    hubcloudText = hubdriveLinkRes.data;
                    hubcloudLink = ((_f = hubcloudText.match(/<META HTTP-EQUIV="refresh" content="0; url=([^"]+)">/i)) === null || _f === void 0 ? void 0 : _f[1]) || hubdriveLink;
                    _g.label = 9;
                case 9:
                    _g.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, hubcloudExtracter(hubcloudLink, signal)];
                case 10: return [2 /*return*/, _g.sent()];
                case 11:
                    error_1 = _g.sent();
                    console.log("hd hub 4 getStream error: ", error_1);
                    return [2 /*return*/, []];
                case 12: return [2 /*return*/];
            }
        });
    });
}
var encode = function (value) {
    return btoa(value.toString());
};
var decode = function (value) {
    if (value === undefined) {
        return "";
    }
    return atob(value.toString());
};
var pen = function (value) {
    return value.replace(/[a-zA-Z]/g, function (_0x1a470e) {
        return String.fromCharCode((_0x1a470e <= "Z" ? 90 : 122) >=
            (_0x1a470e = _0x1a470e.charCodeAt(0) + 13)
            ? _0x1a470e
            : _0x1a470e - 26);
    });
};
var abortableTimeout = function (ms, _a) {
    var _b = _a === void 0 ? {} : _a, signal = _b.signal;
    return new Promise(function (resolve, reject) {
        if (signal && signal.aborted) {
            return reject(new Error("Aborted"));
        }
        var timer = setTimeout(resolve, ms);
        if (signal) {
            signal.addEventListener("abort", function () {
                clearTimeout(timer);
                reject(new Error("Aborted"));
            });
        }
    });
};
function getRedirectLinks(link, signal, headers) {
    return __awaiter(this, void 0, void 0, function () {
        var res, resText, regex, combinedString, match, decodedString, data, token, blogLink, wait, vcloudLink, blogRes, blogResText, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, fetch(link, { headers: headers, signal: signal })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.text()];
                case 2:
                    resText = _a.sent();
                    regex = /ck\('_wp_http_\d+','([^']+)'/g;
                    combinedString = "";
                    while ((match = regex.exec(resText)) !== null) {
                        // console.log(match[1]);
                        combinedString += match[1];
                    }
                    decodedString = decode(pen(decode(decode(combinedString))));
                    data = JSON.parse(decodedString);
                    console.log(data);
                    token = encode(data === null || data === void 0 ? void 0 : data.data);
                    blogLink = (data === null || data === void 0 ? void 0 : data.wp_http1) + "?re=" + token;
                    wait = abortableTimeout((Number(data === null || data === void 0 ? void 0 : data.total_time) + 3) * 1000, {
                        signal: signal,
                    });
                    return [4 /*yield*/, wait];
                case 3:
                    _a.sent();
                    console.log("blogLink", blogLink);
                    vcloudLink = "Invalid Request";
                    _a.label = 4;
                case 4:
                    if (!vcloudLink.includes("Invalid Request")) return [3 /*break*/, 7];
                    return [4 /*yield*/, fetch(blogLink, { headers: headers, signal: signal })];
                case 5:
                    blogRes = _a.sent();
                    return [4 /*yield*/, blogRes.text()];
                case 6:
                    blogResText = (_a.sent());
                    if (blogResText.includes("Invalid Request")) {
                        console.log(blogResText);
                    }
                    else {
                        vcloudLink = blogResText.match(/var reurl = "([^"]+)"/) || "";
                        return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 4];
                case 7: 
                // console.log('vcloudLink', vcloudLink?.[1]);
                return [2 /*return*/, blogLink || link];
                case 8:
                    err_1 = _a.sent();
                    console.log("Error in getRedirectLinks", err_1);
                    return [2 /*return*/, link];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function rot13(str) {
    return str.replace(/[a-zA-Z]/g, function (char) {
        var charCode = char.charCodeAt(0);
        var isUpperCase = char <= "Z";
        var baseCharCode = isUpperCase ? 65 : 97;
        return String.fromCharCode(((charCode - baseCharCode + 13) % 26) + baseCharCode);
    });
}
function decodeString(encryptedString) {
    try {
        // First base64 decode
        var decoded = atob(encryptedString);
        // Second base64 decode
        decoded = atob(decoded);
        // ROT13 decode
        decoded = rot13(decoded);
        // Third base64 decode
        decoded = atob(decoded);
        // Parse JSON
        return JSON.parse(decoded);
    }
    catch (error) {
        console.error("Error decoding string:", error);
        return null;
    }
}
