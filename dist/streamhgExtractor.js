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
exports.streamhgExtractor = streamhgExtractor;
var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
/**
 * StreamHG extractor (dumbalag.com)
 * - Normalize hglink.to/<id> to https://dumbalag.com/e/<id>
 * - Extract eval(...) obfuscated JS from embed HTML
 * - Unpack locally (P.A.C.K.E.R); fallback to public deobfuscator
 * - Parse .m3u8 from result
 */
function streamhgExtractor(url, axios, signal) {
    return __awaiter(this, void 0, void 0, function () {
        var idMatch, id, embedUrl, res, html, direct, evalPattern, evalMatch, evalCode, deob, apiResp, data, e_1, m3u8Match, m3u8Url, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    idMatch = url.match(/https?:\/\/(?:www\.)?(?:hglink\.to|dumbalag\.com)(?:\/(?:e|v))?\/([A-Za-z0-9_-]{4,})/i);
                    id = idMatch ? idMatch[1] : null;
                    if (!id) {
                        console.error("StreamHG: failed to parse id from url", url);
                        return [2 /*return*/, null];
                    }
                    embedUrl = "https://dumbalag.com/e/".concat(id);
                    return [4 /*yield*/, axios.get(embedUrl, {
                            headers: { "User-Agent": USER_AGENT, Referer: url },
                            responseType: "text",
                            signal: signal,
                        })];
                case 1:
                    res = _a.sent();
                    html = res.data || "";
                    direct = html.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/i);
                    if (direct) {
                        return [2 /*return*/, { link: direct[0].replace(/&amp;/g, "&"), headers: { "User-Agent": USER_AGENT, Referer: embedUrl }, type: "m3u8" }];
                    }
                    evalPattern = /eval\s*\(\s*function\s*\(\s*p\s*,\s*a\s*,\s*c\s*,\s*k\s*,\s*e\s*,\s*d\s*\)\s*\{[\s\S]*?\}\s*\(\s*['\"][\s\S]*?\.split\(\s*['\"]\|['\"]\s*\)\s*\)\s*\)/i;
                    evalMatch = html.match(evalPattern);
                    if (!evalMatch) {
                        console.error("StreamHG: no eval block found in embed page");
                        return [2 /*return*/, null];
                    }
                    evalCode = evalMatch[0];
                    deob = unpackPackerFromGroups(evalCode) || unpackPacker(evalCode) || "";
                    if (!!deob) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, axios.post("https://js-deobfuscator-api.replit.app/api/deobfuscate", { code: evalCode }, { headers: { "Content-Type": "application/json" }, timeout: 15000 })];
                case 3:
                    apiResp = _a.sent();
                    data = apiResp.data || {};
                    if (data.success && data.result)
                        deob = String(data.result);
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.error("StreamHG: deobfuscation API error", e_1);
                    return [3 /*break*/, 5];
                case 5:
                    m3u8Match = deob.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/i);
                    m3u8Url = m3u8Match ? m3u8Match[0] : null;
                    if (!m3u8Url) {
                        console.error("StreamHG: no m3u8 found after unpack");
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, {
                            link: m3u8Url.replace(/&amp;/g, "&"),
                            headers: { "User-Agent": USER_AGENT, Referer: embedUrl },
                            type: "m3u8",
                        }];
                case 6:
                    error_1 = _a.sent();
                    console.error("StreamHG extractor failed", error_1);
                    return [2 /*return*/, null];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function unpackPacker(code) {
    try {
        var argsMatch = code.match(/eval\(function\(p,a,c,k,e,d\)\{[\s\S]*?\}\(([^)]+)\)\)/);
        if (!argsMatch)
            return null;
        var argsSrc = argsMatch[1];
        var list = Function("return [" + argsSrc + "]; ")();
        var p = String(list[0]);
        var a = parseInt(list[1]);
        var c = parseInt(list[2]);
        var ks = list[3];
        if (typeof ks === "string")
            ks = ks.split("|");
        var k = ks;
        var result = p;
        for (var i = c; i >= 0; i--) {
            var from = new RegExp("\\b" + i.toString(a) + "\\b", "g");
            var to = k[i] || i.toString(a);
            result = result.replace(from, to);
        }
        return result;
    }
    catch (_a) {
        return null;
    }
}
function unpackPackerFromGroups(code) {
    try {
        var rx = /eval\s*\(\s*function\s*\(\s*p\s*,\s*a\s*,\s*c\s*,\s*k\s*,\s*e\s*,\s*d\s*\)[\s\S]*?\}\s*\(\s*(["'])([\s\S]*?)\1\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(["'])([\s\S]*?)\5\s*\.split\(\s*['\"]\|['\"]\s*\)/i;
        var m = code.match(rx);
        if (!m)
            return null;
        var p = String(m[2]);
        var a = parseInt(String(m[3]), 10);
        var c = parseInt(String(m[4]), 10);
        var k = String(m[6]).split("|");
        var result = p;
        for (var i = c; i >= 0; i--) {
            var from = new RegExp("\\b" + i.toString(a) + "\\b", "g");
            var to = k[i] || i.toString(a);
            result = result.replace(from, to);
        }
        return result;
    }
    catch (_a) {
        return null;
    }
}
