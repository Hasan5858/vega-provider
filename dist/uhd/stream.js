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
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
};
var getStream = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var axios, cheerio, downloadLink, ddl, driveLink, ServerLinks_1, driveRes, driveHtml, $drive, seed, instantToken, InstantFromData, videoSeedUrl, instantLinkRes, instantLinkData, instantLink, err_1, resumeDrive, resumeDriveRes, resumeDriveHtml, $resumeDrive, resumeLink, err_2, cfWorkersLink, cfWorkersRes, cfWorkersHtml, $cfWorkers, cfWorkersStream, err_3, cfWorkersLink, cfWorkersRes, cfWorkersHtml, $cfWorkers, cfWorkersStream, err_4, err_5;
    var _c, _d;
    var url = _b.link, providerContext = _b.providerContext;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 18, , 19]);
                axios = providerContext.axios, cheerio = providerContext.cheerio;
                return [4 /*yield*/, modExtractor(url, providerContext)];
            case 1:
                downloadLink = _e.sent();
                ddl = ((_d = (_c = downloadLink === null || downloadLink === void 0 ? void 0 : downloadLink.data) === null || _c === void 0 ? void 0 : _c.match(/content="0;url=(.*?)"/)) === null || _d === void 0 ? void 0 : _d[1]) || url;
                console.log("ddl", ddl);
                return [4 /*yield*/, isDriveLink(ddl)];
            case 2:
                driveLink = _e.sent();
                ServerLinks_1 = [];
                return [4 /*yield*/, axios.get(driveLink, { headers: headers })];
            case 3:
                driveRes = _e.sent();
                driveHtml = driveRes.data;
                $drive = cheerio.load(driveHtml);
                _e.label = 4;
            case 4:
                _e.trys.push([4, 7, , 8]);
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
            case 5:
                instantLinkRes = _e.sent();
                return [4 /*yield*/, instantLinkRes.json()];
            case 6:
                instantLinkData = _e.sent();
                //   console.log('instantLinkData', instantLinkData);
                if (instantLinkData.error === false) {
                    instantLink = instantLinkData.url;
                    ServerLinks_1.push({
                        server: "Gdrive-Instant",
                        link: instantLink,
                        type: "mkv",
                    });
                }
                else {
                    console.log("Instant link not found", instantLinkData);
                }
                return [3 /*break*/, 8];
            case 7:
                err_1 = _e.sent();
                console.log("Instant link not found", err_1);
                return [3 /*break*/, 8];
            case 8:
                _e.trys.push([8, 10, , 11]);
                resumeDrive = driveLink.replace("/file", "/zfile");
                return [4 /*yield*/, axios.get(resumeDrive, { headers: headers })];
            case 9:
                resumeDriveRes = _e.sent();
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
                return [3 /*break*/, 11];
            case 10:
                err_2 = _e.sent();
                console.log("Resume link not found");
                return [3 /*break*/, 11];
            case 11:
                _e.trys.push([11, 13, , 14]);
                cfWorkersLink = driveLink.replace("/file", "/wfile") + "?type=1";
                return [4 /*yield*/, axios.get(cfWorkersLink, { headers: headers })];
            case 12:
                cfWorkersRes = _e.sent();
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
                return [3 /*break*/, 14];
            case 13:
                err_3 = _e.sent();
                console.log("CF workers link not found", err_3);
                return [3 /*break*/, 14];
            case 14:
                _e.trys.push([14, 16, , 17]);
                cfWorkersLink = driveLink.replace("/file", "/wfile") + "?type=2";
                return [4 /*yield*/, axios.get(cfWorkersLink, { headers: headers })];
            case 15:
                cfWorkersRes = _e.sent();
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
                return [3 /*break*/, 17];
            case 16:
                err_4 = _e.sent();
                console.log("CF workers link not found", err_4);
                return [3 /*break*/, 17];
            case 17:
                console.log("ServerLinks", ServerLinks_1);
                // If none found and ddl is a direct file (.mkv/.mp4), return it as fallback
                if (ServerLinks_1.length === 0 && /\.(mkv|mp4)(\?|$)/i.test(ddl)) {
                    ServerLinks_1.push({ server: "Direct", link: ddl, type: "mkv" });
                }
                return [2 /*return*/, ServerLinks_1];
            case 18:
                err_5 = _e.sent();
                console.log("getStream error", err_5);
                return [2 /*return*/, []];
            case 19: return [2 /*return*/];
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
        var axios, cheerio, wpHttp, bodyFormData0, res, data, html, $, wpHttp2, bodyFormData, formUrl1, formUrl, res2, html2, link, cookie, downloadLink, err_6;
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
                    err_6 = _a.sent();
                    console.log("modGetStream error", err_6);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
