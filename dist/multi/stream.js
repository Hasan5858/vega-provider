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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
var getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio, headers, res, html, $, streamLinks, postId, nume, typeValue, baseUrl, formData, playerRes, playerData, ifameUrl, playerBaseUrl, newPlayerBaseUrl, playerId, NewformData, playerRes_1, playerData_1, siteUrl, siteId, newIframeUrl, iframeRes, iframeData, functionRegex, match, p, encodedString, a, c, k, regex, streamUrl, subtitles_1, subtitleMatch, err_1;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        var url = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    headers = {
                        "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": '"Windows"',
                        Referer: "https://multimovies.online/",
                        "Sec-Fetch-User": "?1",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
                    };
                    _q.label = 1;
                case 1:
                    _q.trys.push([1, 12, , 13]);
                    return [4 /*yield*/, axios.get(url, { headers: headers })];
                case 2:
                    res = _q.sent();
                    html = res.data;
                    $ = cheerio.load(html);
                    streamLinks = [];
                    postId = $("#player-option-1").attr("data-post");
                    nume = $("#player-option-1").attr("data-nume");
                    typeValue = $("#player-option-1").attr("data-type");
                    baseUrl = url.split("/").slice(0, 3).join("/");
                    console.log("baseUrl", baseUrl);
                    formData = new FormData();
                    formData.append("action", "doo_player_ajax");
                    formData.append("post", postId || "");
                    formData.append("nume", nume || "");
                    formData.append("type", typeValue || "");
                    console.log("formData", formData);
                    return [4 /*yield*/, fetch("".concat(baseUrl, "/wp-admin/admin-ajax.php"), {
                            headers: headers,
                            body: formData,
                            method: "POST",
                        })];
                case 3:
                    playerRes = _q.sent();
                    return [4 /*yield*/, playerRes.json()];
                case 4:
                    playerData = _q.sent();
                    console.log("playerData", playerData);
                    ifameUrl = ((_d = (_c = playerData === null || playerData === void 0 ? void 0 : playerData.embed_url) === null || _c === void 0 ? void 0 : _c.match(/<iframe[^>]+src="([^"]+)"[^>]*>/i)) === null || _d === void 0 ? void 0 : _d[1]) ||
                        (playerData === null || playerData === void 0 ? void 0 : playerData.embed_url);
                    console.log("ifameUrl", ifameUrl);
                    if (!!ifameUrl.includes("multimovies")) return [3 /*break*/, 10];
                    playerBaseUrl = ifameUrl.split("/").slice(0, 3).join("/");
                    return [4 /*yield*/, axios.head(playerBaseUrl, { headers: headers })];
                case 5:
                    newPlayerBaseUrl = _q.sent();
                    if ((_e = newPlayerBaseUrl === null || newPlayerBaseUrl === void 0 ? void 0 : newPlayerBaseUrl.request) === null || _e === void 0 ? void 0 : _e.responseURL) {
                        playerBaseUrl = (_g = (_f = newPlayerBaseUrl.request) === null || _f === void 0 ? void 0 : _f.responseURL) === null || _g === void 0 ? void 0 : _g.split("/").slice(0, 3).join("/");
                    }
                    if (!!((_h = newPlayerBaseUrl === null || newPlayerBaseUrl === void 0 ? void 0 : newPlayerBaseUrl.request) === null || _h === void 0 ? void 0 : _h.responseURL)) return [3 /*break*/, 7];
                    return [4 /*yield*/, axios.head(playerBaseUrl, {
                            headers: headers,
                            maxRedirects: 0, // Don't follow redirects
                            validateStatus: function (status) { return status >= 200 && status < 400; },
                        })];
                case 6:
                    playerBaseUrl = (_j = (_q.sent()).headers) === null || _j === void 0 ? void 0 : _j.location;
                    _q.label = 7;
                case 7:
                    playerId = ifameUrl.split("/").pop();
                    NewformData = new FormData();
                    NewformData.append("sid", playerId);
                    console.log("NewformData", playerBaseUrl + "/embedhelper.php", NewformData);
                    return [4 /*yield*/, fetch("".concat(playerBaseUrl, "/embedhelper.php"), {
                            headers: headers,
                            body: NewformData,
                            method: "POST",
                        })];
                case 8:
                    playerRes_1 = _q.sent();
                    return [4 /*yield*/, playerRes_1.json()];
                case 9:
                    playerData_1 = _q.sent();
                    siteUrl = (_k = playerData_1 === null || playerData_1 === void 0 ? void 0 : playerData_1.siteUrls) === null || _k === void 0 ? void 0 : _k.smwh;
                    siteId = ((_l = JSON.parse(atob(playerData_1 === null || playerData_1 === void 0 ? void 0 : playerData_1.mresult))) === null || _l === void 0 ? void 0 : _l.smwh) ||
                        ((_m = playerData_1 === null || playerData_1 === void 0 ? void 0 : playerData_1.mresult) === null || _m === void 0 ? void 0 : _m.smwh);
                    newIframeUrl = siteUrl + siteId;
                    console.log("newIframeUrl", newIframeUrl);
                    if (newIframeUrl) {
                        ifameUrl = newIframeUrl;
                    }
                    _q.label = 10;
                case 10: return [4 /*yield*/, axios.get(ifameUrl, {
                        headers: __assign(__assign({}, headers), { Referer: url }),
                    })];
                case 11:
                    iframeRes = _q.sent();
                    iframeData = iframeRes.data;
                    functionRegex = /eval\(function\((.*?)\)\{.*?return p\}.*?\('(.*?)'\.split/;
                    match = functionRegex.exec(iframeData);
                    p = "";
                    if (match) {
                        encodedString = match[2];
                        // console.log('Parameters:', params);
                        // console.log('Encoded String:', encodedString.split("',36,")[0], '🔥🔥');
                        p = (_o = encodedString.split("',36,")) === null || _o === void 0 ? void 0 : _o[0].trim();
                        a = 36;
                        c = encodedString.split("',36,")[1].slice(2).split("|").length;
                        k = encodedString.split("',36,")[1].slice(2).split("|");
                        while (c--) {
                            if (k[c]) {
                                regex = new RegExp("\\b" + c.toString(a) + "\\b", "g");
                                p = p.replace(regex, k[c]);
                            }
                        }
                        // console.log('Decoded String:', p);
                    }
                    else {
                        console.log("No match found");
                    }
                    streamUrl = (_p = p === null || p === void 0 ? void 0 : p.match(/https?:\/\/[^"]+?\.m3u8[^"]*/)) === null || _p === void 0 ? void 0 : _p[0];
                    subtitles_1 = [];
                    subtitleMatch = p === null || p === void 0 ? void 0 : p.match(/https:\/\/[^\s"]+\.vtt/g);
                    // console.log('subtitleMatch', subtitleMatch);
                    // console.log('streamUrl', streamUrl);
                    if (subtitleMatch === null || subtitleMatch === void 0 ? void 0 : subtitleMatch.length) {
                        subtitleMatch.forEach(function (sub) {
                            var lang = sub.match(/_([a-zA-Z]{3})\.vtt$/)[1];
                            subtitles_1.push({
                                language: lang,
                                uri: sub,
                                type: "text/vtt",
                                title: lang,
                            });
                        });
                    }
                    console.log("streamUrl", streamUrl);
                    console.log("newUrl", streamUrl === null || streamUrl === void 0 ? void 0 : streamUrl.replace(/&i=\d+,'\.4&/, "&i=0.4&"));
                    if (streamUrl) {
                        streamLinks.push({
                            server: "Multi",
                            link: streamUrl.replace(/&i=\d+,'\.4&/, "&i=0.4&"),
                            type: "m3u8",
                            subtitles: [],
                        });
                    }
                    return [2 /*return*/, streamLinks];
                case 12:
                    err_1 = _q.sent();
                    console.error(err_1);
                    return [2 /*return*/, []];
                case 13: return [2 /*return*/];
            }
        });
    });
};
exports.getStream = getStream;
