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
var headers = {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Cache-Control": "no-store",
    "Accept-Language": "en-US,en;q=0.9",
    DNT: "1",
    "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    Cookie: "popads_user_id=6ba8fe60a481387a3249f05aa058822d",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
};
var getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio, modGetEpisodeLinks, servers_1, downloadLink, ddl, servers_2, driveLink, driveRes, driveHtml, $drive, resumeBot, resumeBotRes, resumeBotToken, resumeBotBody, resumeBotPath, resumeBotBaseUrl, resumeBotDownload, resumeBotDownloadData, err_1, cfWorkersLink, cfWorkersRes, cfWorkersHtml, $cfWorkers, cfWorkersStream, err_2, cfWorkersLink, cfWorkersRes, cfWorkersHtml, $cfWorkers, cfWorkersStream, err_3, seed, instantToken, InstantFromData, videoSeedUrl, instantLinkRes, instantLinkData, instantLink, err_4, err_5;
        var _c, _d;
        var url = _b.link, type = _b.type, providerContext = _b.providerContext;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 23, , 24]);
                    modGetEpisodeLinks = function (_a) {
                        return __awaiter(this, arguments, void 0, function (_b) {
                            var axios, cheerio, res, html, $_1, newUrl, res2, html2, episodeLinks_1, err_6;
                            var _c;
                            var url = _b.url, providerContext = _b.providerContext;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        axios = providerContext.axios, cheerio = providerContext.cheerio;
                                        _d.label = 1;
                                    case 1:
                                        _d.trys.push([1, 5, , 6]);
                                        if (url.includes("url=")) {
                                            url = atob(url.split("url=")[1]);
                                        }
                                        return [4 /*yield*/, axios.get(url)];
                                    case 2:
                                        res = _d.sent();
                                        html = res.data;
                                        $_1 = cheerio.load(html);
                                        if (!url.includes("url=")) return [3 /*break*/, 4];
                                        newUrl = (_c = $_1("meta[http-equiv='refresh']")
                                            .attr("content")) === null || _c === void 0 ? void 0 : _c.split("url=")[1];
                                        return [4 /*yield*/, axios.get(newUrl || url)];
                                    case 3:
                                        res2 = _d.sent();
                                        html2 = res2.data;
                                        $_1 = cheerio.load(html2);
                                        _d.label = 4;
                                    case 4:
                                        episodeLinks_1 = [];
                                        $_1("h3,h4").map(function (i, element) {
                                            var seriesTitle = $_1(element).text();
                                            var episodesLink = $_1(element).find("a").attr("href");
                                            if (episodesLink && episodesLink !== "#") {
                                                episodeLinks_1.push({
                                                    title: seriesTitle.trim() || "No title found",
                                                    link: episodesLink || "",
                                                });
                                            }
                                        });
                                        $_1("a.maxbutton").map(function (i, element) {
                                            var seriesTitle = $_1(element).children("span").text();
                                            var episodesLink = $_1(element).attr("href");
                                            if (episodesLink && episodesLink !== "#") {
                                                episodeLinks_1.push({
                                                    title: seriesTitle.trim() || "No title found",
                                                    link: episodesLink || "",
                                                });
                                            }
                                        });
                                        return [2 /*return*/, episodeLinks_1];
                                    case 5:
                                        err_6 = _d.sent();
                                        console.error(err_6);
                                        return [2 /*return*/, []];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        });
                    };
                    console.log("modGetStream", type, url);
                    if (!(type === "movie")) return [3 /*break*/, 3];
                    return [4 /*yield*/, modGetEpisodeLinks({ url: url, providerContext: providerContext })];
                case 2:
                    servers_1 = _e.sent();
                    url = servers_1[0].link || url;
                    _e.label = 3;
                case 3: return [4 /*yield*/, modExtractor(url, providerContext)];
                case 4:
                    downloadLink = _e.sent();
                    ddl = ((_d = (_c = downloadLink === null || downloadLink === void 0 ? void 0 : downloadLink.data) === null || _c === void 0 ? void 0 : _c.match(/content="0;url=(.*?)"/)) === null || _d === void 0 ? void 0 : _d[1]) || url;
                    servers_2 = [];
                    return [4 /*yield*/, isDriveLink(ddl)];
                case 5:
                    driveLink = _e.sent();
                    return [4 /*yield*/, axios.get(driveLink, { headers: headers })];
                case 6:
                    driveRes = _e.sent();
                    driveHtml = driveRes.data;
                    $drive = cheerio.load(driveHtml);
                    _e.label = 7;
                case 7:
                    _e.trys.push([7, 11, , 12]);
                    resumeBot = $drive(".btn.btn-light").attr("href") || "";
                    return [4 /*yield*/, axios.get(resumeBot, { headers: headers })];
                case 8:
                    resumeBotRes = _e.sent();
                    resumeBotToken = resumeBotRes.data.match(/formData\.append\('token', '([a-f0-9]+)'\)/)[1];
                    resumeBotBody = new FormData();
                    resumeBotBody.append("token", resumeBotToken);
                    resumeBotPath = resumeBotRes.data.match(/fetch\('\/download\?id=([a-zA-Z0-9\/+]+)'/)[1];
                    resumeBotBaseUrl = resumeBot.split("/download")[0];
                    return [4 /*yield*/, fetch(resumeBotBaseUrl + "/download?id=" + resumeBotPath, {
                            method: "POST",
                            body: resumeBotBody,
                            headers: {
                                Referer: resumeBot,
                                Cookie: "PHPSESSID=7e9658ce7c805dab5bbcea9046f7f308",
                            },
                        })];
                case 9:
                    resumeBotDownload = _e.sent();
                    return [4 /*yield*/, resumeBotDownload.json()];
                case 10:
                    resumeBotDownloadData = _e.sent();
                    console.log("resumeBotDownloadData", resumeBotDownloadData.url);
                    servers_2.push({
                        server: "ResumeBot",
                        link: resumeBotDownloadData.url,
                        type: "mkv",
                    });
                    return [3 /*break*/, 12];
                case 11:
                    err_1 = _e.sent();
                    console.log("ResumeBot link not found", err_1);
                    return [3 /*break*/, 12];
                case 12:
                    _e.trys.push([12, 14, , 15]);
                    cfWorkersLink = driveLink.replace("/file", "/wfile") + "?type=1";
                    return [4 /*yield*/, axios.get(cfWorkersLink, { headers: headers })];
                case 13:
                    cfWorkersRes = _e.sent();
                    cfWorkersHtml = cfWorkersRes.data;
                    $cfWorkers = cheerio.load(cfWorkersHtml);
                    cfWorkersStream = $cfWorkers(".btn-success");
                    cfWorkersStream.each(function (i, el) {
                        var _a;
                        var link = (_a = el.attribs) === null || _a === void 0 ? void 0 : _a.href;
                        if (link) {
                            servers_2.push({
                                server: "Cf Worker 1." + i,
                                link: link,
                                type: "mkv",
                            });
                        }
                    });
                    return [3 /*break*/, 15];
                case 14:
                    err_2 = _e.sent();
                    console.log("CF workers link not found", err_2);
                    return [3 /*break*/, 15];
                case 15:
                    _e.trys.push([15, 17, , 18]);
                    cfWorkersLink = driveLink.replace("/file", "/wfile") + "?type=2";
                    return [4 /*yield*/, axios.get(cfWorkersLink, { headers: headers })];
                case 16:
                    cfWorkersRes = _e.sent();
                    cfWorkersHtml = cfWorkersRes.data;
                    $cfWorkers = cheerio.load(cfWorkersHtml);
                    cfWorkersStream = $cfWorkers(".btn-success");
                    cfWorkersStream.each(function (i, el) {
                        var _a;
                        var link = (_a = el.attribs) === null || _a === void 0 ? void 0 : _a.href;
                        if (link) {
                            servers_2.push({
                                server: "Cf Worker 2." + i,
                                link: link,
                                type: "mkv",
                            });
                        }
                    });
                    return [3 /*break*/, 18];
                case 17:
                    err_3 = _e.sent();
                    console.log("CF workers link not found", err_3);
                    return [3 /*break*/, 18];
                case 18:
                    _e.trys.push([18, 21, , 22]);
                    seed = $drive(".btn-danger").attr("href") || "";
                    instantToken = seed.split("=")[1];
                    InstantFromData = new FormData();
                    InstantFromData.append("keys", instantToken);
                    videoSeedUrl = seed.split("/").slice(0, 3).join("/") + "/api";
                    return [4 /*yield*/, fetch(videoSeedUrl, {
                            method: "POST",
                            body: InstantFromData,
                            headers: {
                                "x-token": videoSeedUrl,
                            },
                        })];
                case 19:
                    instantLinkRes = _e.sent();
                    return [4 /*yield*/, instantLinkRes.json()];
                case 20:
                    instantLinkData = _e.sent();
                    //   console.log('instantLinkData', instantLinkData);
                    if (instantLinkData.error === false) {
                        instantLink = instantLinkData.url;
                        servers_2.push({
                            server: "Gdrive-Instant",
                            link: instantLink,
                            type: "mkv",
                        });
                    }
                    else {
                        console.log("Instant link not found", instantLinkData);
                    }
                    return [3 /*break*/, 22];
                case 21:
                    err_4 = _e.sent();
                    console.log("Instant link not found", err_4);
                    return [3 /*break*/, 22];
                case 22: return [2 /*return*/, servers_2];
                case 23:
                    err_5 = _e.sent();
                    console.log("getStream error", err_5);
                    return [2 /*return*/, []];
                case 24: return [2 /*return*/];
            }
        });
    });
};
exports.getStream = getStream;
var isDriveLink = function (ddl) { return __awaiter(void 0, void 0, void 0, function () {
    var driveLeach, driveLeachData, pathMatch, path, mainUrl;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ddl.includes("drive")) return [3 /*break*/, 3];
                return [4 /*yield*/, fetch(ddl)];
            case 1:
                driveLeach = _a.sent();
                return [4 /*yield*/, driveLeach.text()];
            case 2:
                driveLeachData = _a.sent();
                pathMatch = driveLeachData.match(/window\.location\.replace\("([^"]+)"\)/);
                path = pathMatch === null || pathMatch === void 0 ? void 0 : pathMatch[1];
                mainUrl = ddl.split("/")[2];
                console.log("driveUrl = https://".concat(mainUrl).concat(path));
                return [2 /*return*/, "https://".concat(mainUrl).concat(path)];
            case 3: return [2 /*return*/, ddl];
        }
    });
}); };
function modExtractor(url, providerContext) {
    return __awaiter(this, void 0, void 0, function () {
        var axios, cheerio, wpHttp, bodyFormData0, res, data, html, $, wpHttp2, bodyFormData, formUrl1, formUrl, res2, html2, link, cookie, downloadLink, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    wpHttp = url.split("sid=")[1];
                    bodyFormData0 = new FormData();
                    bodyFormData0.append("_wp_http", wpHttp);
                    return [4 /*yield*/, fetch(url.split("?")[0], {
                            method: "POST",
                            body: bodyFormData0,
                        })];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, res.text()];
                case 3:
                    data = _a.sent();
                    html = data;
                    $ = cheerio.load(html);
                    wpHttp2 = $("input").attr("name", "_wp_http2").val();
                    bodyFormData = new FormData();
                    bodyFormData.append("_wp_http2", wpHttp2);
                    formUrl1 = $("form").attr("action");
                    formUrl = formUrl1 || url.split("?")[0];
                    return [4 /*yield*/, fetch(formUrl, {
                            method: "POST",
                            body: bodyFormData,
                        })];
                case 4:
                    res2 = _a.sent();
                    return [4 /*yield*/, res2.text()];
                case 5:
                    html2 = _a.sent();
                    link = html2.match(/setAttribute\("href",\s*"(.*?)"/)[1];
                    console.log(link);
                    cookie = link.split("=")[1];
                    console.log("cookie", cookie);
                    return [4 /*yield*/, axios.get(link, {
                            headers: {
                                Referer: formUrl,
                                Cookie: "".concat(cookie, "=").concat(wpHttp2),
                            },
                        })];
                case 6:
                    downloadLink = _a.sent();
                    return [2 /*return*/, downloadLink];
                case 7:
                    err_7 = _a.sent();
                    console.log("modGetStream error", err_7);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
