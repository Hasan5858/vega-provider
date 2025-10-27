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
exports.getStream = void 0;
var getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio, headers, linkRes, linkData, $_1, w4linksRes, w4linksData, $w4, fastilinksRedirect, fastilinksRes, fastilinksData, $$, fastilinksKey, anyCsrfToken, fastilinksFormData, fastilinksRes2, fastilinksHtml, $$$_1, photolinxLink, mediafireLink, fastilinksLink, allLinks, photolinxBaseUrl, photolinxRes, photolinxData, $$$, access_token, uid, body, photolinxRes2, photolinxData2, dwUrl, streamLinks_1, res, html, streamLinks, data, key, formData, streamRes, err_1, $, mediafireUrl, directUrl, urlContentType, repairRes, repairHtml, base64Link, href, downloadLInk, requireRepairRes, contentType, repairRes, repairHtml, $_2, repairLink, repairRequireRepairRes, $$, _c, _d, repairDownloadLink, err_2;
        var _e;
        var url = _b.link, type = _b.type, providerContext = _b.providerContext;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    headers = {
                        "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": '"Windows"',
                        "Sec-Fetch-Site": "none",
                        "Sec-Fetch-User": "?1",
                        "Upgrade-Insecure-Requests": "1",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
                        Cookie: "61cn=1; 61wk=1; __cf_bm=wtv9Eoa2wrUDgevtAnJ6wUOZrxtVYBcddhUDtT0Wj_M-1757137848-1.0.1.1-8Tr7rV19zNgUcRYe_5567LKb2IZrKyxwrc1VWgTmMDd06Givhil3U2kMtUYTYkTnuD3sHUgfh8CO9Y5LrEcZACBbrPE.3Sq5F_JLXaK7Hrw; conv_tracking_data-2=%7B%22mf_source%22%3A%22regular_download-59%22%2C%22mf_content%22%3A%22Free%22%2C%22mf_medium%22%3A%22unknown%5C%2FDefault%20Browser%22%2C%22mf_campaign%22%3A%22616qpccbrq0y4oe%22%2C%22mf_term%22%3A%22d11b8f533377139aa38d757e5057630e%22%7D; ukey=pu2dyp35fyongstav3km969l8d6u2z82",
                    };
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 34, , 35]);
                    if (!(type === "movie")) return [3 /*break*/, 3];
                    return [4 /*yield*/, axios.get(url, { headers: headers })];
                case 2:
                    linkRes = _f.sent();
                    linkData = linkRes.data;
                    $_1 = cheerio.load(linkData);
                    url = $_1('strong:contains("INSTANT")').parent().attr("href") || url;
                    _f.label = 3;
                case 3:
                    if (!url.includes("w4links.skin")) return [3 /*break*/, 5];
                    console.log("w4links.skin detected, following redirect...");
                    return [4 /*yield*/, axios.get(url, { headers: headers })];
                case 4:
                    w4linksRes = _f.sent();
                    w4linksData = w4linksRes.data;
                    $w4 = cheerio.load(w4linksData);
                    fastilinksRedirect = $w4('a[href*="fastilinks.online"]').attr("href");
                    if (fastilinksRedirect) {
                        console.log("Found fastilinks.online redirect:", fastilinksRedirect);
                        url = fastilinksRedirect;
                    }
                    else {
                        console.log("No fastilinks.online redirect found in w4links.skin");
                    }
                    _f.label = 5;
                case 5:
                    if (!url.includes("fastilinks")) return [3 /*break*/, 9];
                    console.log("Processing fastilinks URL:", url);
                    return [4 /*yield*/, axios.get(url, { headers: headers })];
                case 6:
                    fastilinksRes = _f.sent();
                    fastilinksData = fastilinksRes.data;
                    $$ = cheerio.load(fastilinksData);
                    fastilinksKey = $$('input[name="_csrf_token_645a83a41868941e4692aa31e7235f2"]').attr("value");
                    console.log("fastilinksKey", fastilinksKey);
                    if (!fastilinksKey) {
                        console.log("No CSRF token found, checking for other patterns...");
                        anyCsrfToken = $$('input[name*="csrf"]').attr("value");
                        console.log("Any CSRF token found:", anyCsrfToken);
                    }
                    fastilinksFormData = new FormData();
                    fastilinksFormData.append("_csrf_token_645a83a41868941e4692aa31e7235f2", fastilinksKey || "");
                    console.log("fastilinksFormData", fastilinksFormData, "fastilinksUrl", url);
                    return [4 /*yield*/, fetch(url, {
                            method: "POST",
                            headers: headers,
                            body: fastilinksFormData,
                        })];
                case 7:
                    fastilinksRes2 = _f.sent();
                    return [4 /*yield*/, fastilinksRes2.text()];
                case 8:
                    fastilinksHtml = _f.sent();
                    console.log("fastilinks response status:", fastilinksRes2.status);
                    console.log("fastilinks response length:", fastilinksHtml.length);
                    $$$_1 = cheerio.load(fastilinksHtml);
                    photolinxLink = $$$_1('a:contains("photolinx")').attr("href");
                    mediafireLink = $$$_1('a:contains("mediafire")').attr("href");
                    console.log("photolinxLink", photolinxLink);
                    console.log("mediafireLink", mediafireLink);
                    fastilinksLink = photolinxLink || mediafireLink;
                    console.log("fastilinksLink (selected)", fastilinksLink);
                    allLinks = $$$_1('a[href]');
                    console.log("Total links found:", allLinks.length);
                    allLinks.each(function (i, el) {
                        var href = $$$_1(el).attr("href");
                        var text = $$$_1(el).text();
                        if (href && (href.includes("mediafire") || href.includes("photolinx") || href.includes("download"))) {
                            console.log("Link ".concat(i, ": \"").concat(text, "\" -> ").concat(href));
                        }
                    });
                    url = fastilinksLink || url;
                    _f.label = 9;
                case 9:
                    console.log("world4uGetStream", type, url);
                    if (!url.includes("photolinx")) return [3 /*break*/, 14];
                    console.log("photolinx", url);
                    photolinxBaseUrl = url.split("/").slice(0, 3).join("/");
                    console.log("photolinxBaseUrl", photolinxBaseUrl);
                    return [4 /*yield*/, fetch(url, {
                            headers: {
                                accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                                "accept-language": "en-US,en;q=0.9,en-IN;q=0.8",
                                "cache-control": "no-cache",
                                pragma: "no-cache",
                                priority: "u=0, i",
                                "sec-ch-ua": '"Not;A=Brand";v="99", "Microsoft Edge";v="139", "Chromium";v="139"',
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": '"Windows"',
                                "sec-fetch-dest": "document",
                                "sec-fetch-mode": "navigate",
                                "sec-fetch-site": "none",
                                "sec-fetch-user": "?1",
                                "upgrade-insecure-requests": "1",
                                cookie: "PHPSESSID=f2211def7938d7228daaa37ffeabcfe0; ext_name=ojplmecpdpgccookcobabopnaifgidhf",
                            },
                            body: null,
                            method: "GET",
                        })];
                case 10:
                    photolinxRes = _f.sent();
                    return [4 /*yield*/, photolinxRes.text()];
                case 11:
                    photolinxData = _f.sent();
                    $$$ = cheerio.load(photolinxData);
                    access_token = $$$("#generate_url").attr("data-token");
                    uid = $$$("#generate_url").attr("data-uid");
                    body = {
                        type: "DOWNLOAD_GENERATE",
                        payload: {
                            access_token: access_token,
                            uid: uid,
                        },
                    };
                    console.log("photolinxData", JSON.stringify(body));
                    return [4 /*yield*/, fetch("".concat(photolinxBaseUrl, "/action"), {
                            headers: {
                                accept: "application/json, text/plain, */*",
                                "accept-language": "en-US,en;q=0.9,en-IN;q=0.8",
                                "cache-control": "no-cache",
                                "content-type": "application/json; charset=UTF-8",
                                pragma: "no-cache",
                                priority: "u=1, i",
                                "sec-ch-ua": '"Not;A=Brand";v="99", "Microsoft Edge";v="139", "Chromium";v="139"',
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": '"Windows"',
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                "x-requested-with": "xmlhttprequest",
                                cookie: "PHPSESSID=f2211def7938d7228daaa37ffeabcfe0; ext_name=ojplmecpdpgccookcobabopnaifgidhf",
                                Referer: url,
                            },
                            body: JSON.stringify(body),
                            method: "POST",
                        })];
                case 12:
                    photolinxRes2 = _f.sent();
                    return [4 /*yield*/, photolinxRes2.json()];
                case 13:
                    photolinxData2 = _f.sent();
                    console.log("photolinxData2", photolinxData2);
                    dwUrl = photolinxData2 === null || photolinxData2 === void 0 ? void 0 : photolinxData2.download_url;
                    if (dwUrl) {
                        streamLinks_1 = [
                            {
                                server: "Photolinx",
                                link: dwUrl,
                                type: "mkv",
                            },
                        ];
                        return [2 /*return*/, streamLinks_1];
                    }
                    _f.label = 14;
                case 14: return [4 /*yield*/, fetch(url, { headers: headers })];
                case 15:
                    res = _f.sent();
                    if (!res.ok) {
                        console.log("Failed to fetch URL: ".concat(url, ", Status: ").concat(res.status));
                        // If this is a mediafire link that failed, try to find alternative links
                        if (url.includes("mediafire")) {
                            console.log("Mediafire link failed, returning empty array");
                        }
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, res.text()];
                case 16:
                    html = _f.sent();
                    streamLinks = [];
                    data = { download: "" };
                    _f.label = 17;
                case 17:
                    _f.trys.push([17, 20, , 21]);
                    key = ((_e = html.match(/formData\.append\('key',\s*'(\d+)'\);/)) === null || _e === void 0 ? void 0 : _e[1]) || "";
                    console.log("key", key, "url", url);
                    formData = new FormData();
                    formData.append("key", key);
                    return [4 /*yield*/, fetch(url, {
                            method: "POST",
                            headers: headers,
                            body: formData,
                        })];
                case 18:
                    streamRes = _f.sent();
                    return [4 /*yield*/, streamRes.json()];
                case 19:
                    data = _f.sent();
                    return [3 /*break*/, 21];
                case 20:
                    err_1 = _f.sent();
                    console.log("error in world4uGetStream key extraction", err_1 instanceof Error ? err_1.message : err_1);
                    console.log("URL that failed:", url);
                    return [3 /*break*/, 21];
                case 21:
                    $ = cheerio.load(html);
                    mediafireUrl = $('h1:contains("Download")').find("a").attr("href") ||
                        $(".input.popsok").attr("href") ||
                        url;
                    console.log("mediafireUrl", mediafireUrl);
                    console.log("HTML content preview:", html.substring(0, 500));
                    if (!mediafireUrl) return [3 /*break*/, 26];
                    return [4 /*yield*/, fetch(mediafireUrl, {
                            headers: {
                                Referer: url,
                            },
                        })];
                case 22:
                    directUrl = _f.sent();
                    urlContentType = directUrl.headers.get("content-type");
                    console.log("mfcontentType", urlContentType);
                    if (!(urlContentType && urlContentType.includes("video"))) return [3 /*break*/, 23];
                    streamLinks.push({
                        server: "Mediafire",
                        link: mediafireUrl,
                        type: "mkv",
                    });
                    return [2 /*return*/, streamLinks];
                case 23: return [4 /*yield*/, fetch(mediafireUrl, {
                        headers: {
                            Referer: url,
                        },
                    })];
                case 24:
                    repairRes = _f.sent();
                    return [4 /*yield*/, repairRes.text()];
                case 25:
                    repairHtml = _f.sent();
                    base64Link = cheerio
                        .load(repairHtml)(".input.popsok")
                        .attr("data-scrambled-url");
                    console.log("base64Link", base64Link);
                    href = base64Link ? atob(base64Link) : null;
                    console.log("href", href);
                    downloadLInk = (href === null || href === void 0 ? void 0 : href.startsWith("https://")) ? href : null;
                    console.log("downloadLInk", downloadLInk);
                    if (downloadLInk) {
                        streamLinks.push({
                            server: "Mediafire",
                            link: downloadLInk,
                            type: "mkv",
                        });
                    }
                    return [2 /*return*/, streamLinks];
                case 26: return [4 /*yield*/, fetch(data.download)];
                case 27:
                    requireRepairRes = _f.sent();
                    contentType = requireRepairRes.headers.get("content-type");
                    console.log("contentType", contentType);
                    if (!(contentType && contentType.includes("video"))) return [3 /*break*/, 28];
                    streamLinks.push({
                        server: "Mediafire",
                        link: data.download,
                        type: "mkv",
                    });
                    return [2 /*return*/, streamLinks];
                case 28: return [4 /*yield*/, fetch(data.download, {
                        headers: {
                            Referer: url,
                        },
                    })];
                case 29:
                    repairRes = _f.sent();
                    return [4 /*yield*/, repairRes.text()];
                case 30:
                    repairHtml = _f.sent();
                    $_2 = cheerio.load(repairHtml);
                    repairLink = $_2("#continue-btn").attr("href");
                    console.log("repairLink", "https://www.mediafire.com" + repairLink);
                    return [4 /*yield*/, fetch("https://www.mediafire.com" + repairLink)];
                case 31:
                    repairRequireRepairRes = _f.sent();
                    _d = (_c = cheerio).load;
                    return [4 /*yield*/, repairRequireRepairRes.text()];
                case 32:
                    $$ = _d.apply(_c, [_f.sent()]);
                    repairDownloadLink = $$(".input.popsok").attr("href");
                    console.log("repairDownloadLink", repairDownloadLink);
                    if (repairDownloadLink) {
                        streamLinks.push({
                            server: "Mediafire",
                            link: repairDownloadLink,
                            type: "mkv",
                        });
                    }
                    _f.label = 33;
                case 33: return [2 /*return*/, streamLinks];
                case 34:
                    err_2 = _f.sent();
                    console.log(err_2 instanceof Error ? err_2.message : err_2);
                    return [2 /*return*/, []];
                case 35: return [2 /*return*/];
            }
        });
    });
};
exports.getStream = getStream;
