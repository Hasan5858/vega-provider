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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
};
var getStream = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var axios, cheerio, downloadLink, ddl, driveLink, ServerLinks_1, driveRes, driveHtml, $drive, resumeBot, resumeBotRes, resumeBotToken, resumeBotBody, resumeBotPath, resumeBotBaseUrl, resumeBotDownload, resumeBotDownloadData, err_1, seed, instantToken, urlObj, driveId, pepeCookie, hexEncode, candidates, origin_1, videoSeedUrl, instantOk, candidates_1, candidates_1_1, candidate, fd, res, js, _1, e_1_1, err_2, resumeDrive, resumeDriveRes, resumeDriveHtml, $resumeDrive, resumeLink, err_3, cfWorkersLink, cfWorkersRes, cfWorkersHtml, $cfWorkers, cfWorkersStream, err_4, cfWorkersLink, cfWorkersRes, cfWorkersHtml, $cfWorkers, cfWorkersStream, err_5, err_6;
    var e_1, _c;
    var _d, _e, _f, _g, _h, _j;
    var url = _b.link, providerContext = _b.providerContext;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _k.trys.push([0, 34, , 35]);
                axios = providerContext.axios, cheerio = providerContext.cheerio;
                return [4 /*yield*/, modExtractor(url, providerContext)];
            case 1:
                downloadLink = _k.sent();
                ddl = ((_e = (_d = downloadLink === null || downloadLink === void 0 ? void 0 : downloadLink.data) === null || _d === void 0 ? void 0 : _d.match(/content="0;url=(.*?)"/)) === null || _e === void 0 ? void 0 : _e[1]) || url;
                console.log("ddl", ddl);
                return [4 /*yield*/, isDriveLink(ddl)];
            case 2:
                driveLink = _k.sent();
                ServerLinks_1 = [];
                return [4 /*yield*/, axios.get(driveLink, { headers: headers })];
            case 3:
                driveRes = _k.sent();
                driveHtml = driveRes.data;
                $drive = cheerio.load(driveHtml);
                _k.label = 4;
            case 4:
                _k.trys.push([4, 9, , 10]);
                resumeBot = $drive(".btn.btn-light").attr("href") || "";
                if (!resumeBot) return [3 /*break*/, 8];
                return [4 /*yield*/, axios.get(resumeBot, { headers: headers })];
            case 5:
                resumeBotRes = _k.sent();
                resumeBotToken = (_f = resumeBotRes.data.match(/formData\.append\('token', '([a-f0-9]+)'\)/)) === null || _f === void 0 ? void 0 : _f[1];
                resumeBotBody = new FormData();
                if (resumeBotToken) {
                    resumeBotBody.append("token", resumeBotToken);
                }
                resumeBotPath = (_g = resumeBotRes.data.match(/fetch\('\/download\?id=([a-zA-Z0-9\/+]+)'/)) === null || _g === void 0 ? void 0 : _g[1];
                resumeBotBaseUrl = resumeBot.split("/download")[0];
                if (!resumeBotPath) return [3 /*break*/, 8];
                return [4 /*yield*/, fetch(resumeBotBaseUrl + "/download?id=" + resumeBotPath, {
                        method: "POST",
                        body: resumeBotBody,
                        headers: {
                            Referer: resumeBot,
                            Cookie: "PHPSESSID=7e9658ce7c805dab5bbcea9046f7f308",
                        },
                    })];
            case 6:
                resumeBotDownload = _k.sent();
                return [4 /*yield*/, resumeBotDownload.json()];
            case 7:
                resumeBotDownloadData = _k.sent();
                if (resumeBotDownloadData === null || resumeBotDownloadData === void 0 ? void 0 : resumeBotDownloadData.url) {
                    ServerLinks_1.push({
                        server: "ResumeBot",
                        link: resumeBotDownloadData.url,
                        type: "mkv",
                    });
                }
                _k.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                err_1 = _k.sent();
                console.log("ResumeBot link not found", err_1);
                return [3 /*break*/, 10];
            case 10:
                _k.trys.push([10, 23, , 24]);
                seed = $drive("a.btn-danger").attr("href") ||
                    $drive('a[href*="/instant"]').attr("href") ||
                    "";
                if (!seed) return [3 /*break*/, 22];
                instantToken = "";
                try {
                    urlObj = new URL(seed);
                    instantToken =
                        urlObj.searchParams.get("keys") ||
                            urlObj.searchParams.get("key") ||
                            urlObj.searchParams.get("token") ||
                            "";
                }
                catch (_l) {
                    // Fallback to legacy split if URL constructor fails
                    instantToken = ((_h = (seed.split("?")[1] || "").split("&").find(function (p) { return p.startsWith("keys=") || p.startsWith("key=") || p.startsWith("token="); })) === null || _h === void 0 ? void 0 : _h.split("=")[1]) || seed.split("=")[1] || "";
                }
                driveId = (((_j = driveLink.match(/\/file\/([^/?#]+)/)) === null || _j === void 0 ? void 0 : _j[1]) || "").trim();
                pepeCookie = (downloadLink === null || downloadLink === void 0 ? void 0 : downloadLink.cookie) || "";
                hexEncode = function (s) { return Array.from(s).map(function (c) { return c.charCodeAt(0).toString(16).padStart(2, '0'); }).join(''); };
                candidates = Array.from(new Set([
                    instantToken,
                    driveId,
                    pepeCookie,
                    hexEncode(instantToken || ''),
                    hexEncode(driveId || ''),
                    hexEncode(pepeCookie || ''),
                ].filter(Boolean)));
                origin_1 = seed.split("/").slice(0, 3).join("/");
                videoSeedUrl = origin_1 + "/api";
                instantOk = false;
                _k.label = 11;
            case 11:
                _k.trys.push([11, 19, 20, 21]);
                candidates_1 = __values(candidates), candidates_1_1 = candidates_1.next();
                _k.label = 12;
            case 12:
                if (!!candidates_1_1.done) return [3 /*break*/, 18];
                candidate = candidates_1_1.value;
                _k.label = 13;
            case 13:
                _k.trys.push([13, 16, , 17]);
                fd = new FormData();
                fd.append("keys", candidate);
                return [4 /*yield*/, fetch(videoSeedUrl, {
                        method: "POST",
                        body: fd,
                        headers: { "x-token": videoSeedUrl, Referer: seed, Origin: origin_1 },
                    })];
            case 14:
                res = _k.sent();
                return [4 /*yield*/, res.json()];
            case 15:
                js = _k.sent();
                if (js && js.error === false && js.url) {
                    ServerLinks_1.push({ server: "Gdrive-Instant", link: js.url, type: "mkv" });
                    instantOk = true;
                    return [3 /*break*/, 18];
                }
                return [3 /*break*/, 17];
            case 16:
                _1 = _k.sent();
                return [3 /*break*/, 17];
            case 17:
                candidates_1_1 = candidates_1.next();
                return [3 /*break*/, 12];
            case 18: return [3 /*break*/, 21];
            case 19:
                e_1_1 = _k.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 21];
            case 20:
                try {
                    if (candidates_1_1 && !candidates_1_1.done && (_c = candidates_1.return)) _c.call(candidates_1);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 21:
                if (!instantOk) {
                    console.log("Instant link not found", { tried: candidates.length });
                }
                _k.label = 22;
            case 22: return [3 /*break*/, 24];
            case 23:
                err_2 = _k.sent();
                console.log("Instant link not found", err_2);
                return [3 /*break*/, 24];
            case 24:
                _k.trys.push([24, 26, , 27]);
                resumeDrive = driveLink.replace("/file", "/zfile");
                return [4 /*yield*/, axios.get(resumeDrive, { headers: headers })];
            case 25:
                resumeDriveRes = _k.sent();
                resumeDriveHtml = resumeDriveRes.data;
                $resumeDrive = cheerio.load(resumeDriveHtml);
                resumeLink = $resumeDrive(".btn-success").attr("href");
                if (!resumeLink) {
                    resumeLink =
                        $resumeDrive('a[href*="workers.dev"]').attr('href') ||
                            $resumeDrive('a.btn').attr('href') || '';
                }
                //   console.log('resumeLink', resumeLink);
                if (resumeLink) {
                    ServerLinks_1.push({
                        server: "ResumeCloud",
                        link: resumeLink,
                        type: "mkv",
                    });
                }
                return [3 /*break*/, 27];
            case 26:
                err_3 = _k.sent();
                console.log("Resume link not found");
                return [3 /*break*/, 27];
            case 27:
                _k.trys.push([27, 29, , 30]);
                cfWorkersLink = driveLink.replace("/file", "/wfile") + "?type=1";
                return [4 /*yield*/, axios.get(cfWorkersLink, { headers: headers })];
            case 28:
                cfWorkersRes = _k.sent();
                cfWorkersHtml = cfWorkersRes.data;
                $cfWorkers = cheerio.load(cfWorkersHtml);
                cfWorkersStream = $cfWorkers("a.btn-success, a.btn, a[href*=\"workers.dev\"]");
                cfWorkersStream.each(function (i, el) {
                    var _a;
                    var link = (_a = el.attribs) === null || _a === void 0 ? void 0 : _a.href;
                    if (link) {
                        ServerLinks_1.push({
                            server: "Cf Worker 1." + i,
                            link: link,
                            type: "mkv",
                        });
                    }
                });
                return [3 /*break*/, 30];
            case 29:
                err_4 = _k.sent();
                console.log("CF workers link not found", err_4);
                return [3 /*break*/, 30];
            case 30:
                _k.trys.push([30, 32, , 33]);
                cfWorkersLink = driveLink.replace("/file", "/wfile") + "?type=2";
                return [4 /*yield*/, axios.get(cfWorkersLink, { headers: headers })];
            case 31:
                cfWorkersRes = _k.sent();
                cfWorkersHtml = cfWorkersRes.data;
                $cfWorkers = cheerio.load(cfWorkersHtml);
                cfWorkersStream = $cfWorkers("a.btn-success, a.btn, a[href*=\"workers.dev\"]");
                cfWorkersStream.each(function (i, el) {
                    var _a;
                    var link = (_a = el.attribs) === null || _a === void 0 ? void 0 : _a.href;
                    if (link) {
                        ServerLinks_1.push({
                            server: "Cf Worker 2." + i,
                            link: link,
                            type: "mkv",
                        });
                    }
                });
                return [3 /*break*/, 33];
            case 32:
                err_5 = _k.sent();
                console.log("CF workers link not found", err_5);
                return [3 /*break*/, 33];
            case 33:
                // Generic anchors on main drive page that may directly point to workers/download mirrors
                try {
                    $drive('a[href*="workers.dev"], a[href*="/download"], a[href*="/wfile"], a[href*="/zfile"], a.btn-primary, a.btn-warning').each(function (i, el) {
                        var _a;
                        var link = (_a = el.attribs) === null || _a === void 0 ? void 0 : _a.href;
                        if (link && /^https?:\/\//.test(link)) {
                            ServerLinks_1.push({ server: "Drive Link " + i, link: link, type: "mkv" });
                        }
                    });
                }
                catch (err) {
                    // ignore
                }
                console.log("ServerLinks", ServerLinks_1);
                // If none found and ddl is a direct file (.mkv/.mp4), return it as fallback
                if (ServerLinks_1.length === 0 && /\.(mkv|mp4)(\?|$)/i.test(ddl)) {
                    ServerLinks_1.push({ server: "Direct", link: ddl, type: "mkv" });
                }
                return [2 /*return*/, ServerLinks_1];
            case 34:
                err_6 = _k.sent();
                console.log("getStream error", err_6);
                return [2 /*return*/, []];
            case 35: return [2 /*return*/];
        }
    });
}); };
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
                    // attach cookie for later token fallback attempts
                    downloadLink.cookie = cookie;
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
