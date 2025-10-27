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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
var getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios_1, baseUrl_1, _c, animeId_1, episodeNumber_1, servers, streamLinks_1, err_1;
        var _this = this;
        var id = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 3, , 4]);
                    axios_1 = providerContext.axios;
                    baseUrl_1 = "https://backend.animetsu.to";
                    _c = __read(id.split(":"), 2), animeId_1 = _c[0], episodeNumber_1 = _c[1];
                    if (!animeId_1 || !episodeNumber_1) {
                        throw new Error("Invalid link format");
                    }
                    servers = ["pahe", "zoro"];
                    streamLinks_1 = [];
                    return [4 /*yield*/, Promise.all(servers.map(function (server) { return __awaiter(_this, void 0, void 0, function () {
                            var url, res, subtitles_1, e_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        url = "".concat(baseUrl_1, "/api/anime/tiddies?server=").concat(server, "&id=").concat(animeId_1, "&num=").concat(episodeNumber_1, "&subType=sub");
                                        return [4 /*yield*/, axios_1.get(url, {
                                                headers: {
                                                    Referer: "https://animetsu.to/",
                                                },
                                            })];
                                    case 1:
                                        res = _a.sent();
                                        if (res.data && res.data.sources) {
                                            subtitles_1 = [];
                                            // if (res.data.subtitles && Array.isArray(res.data.subtitles)) {
                                            //   res.data.subtitles.forEach((sub: any) => {
                                            //     if (sub.url && sub.lang) {
                                            //       // Extract language code from lang string (e.g., "English" -> "en", "Arabic - CR" -> "ar")
                                            //       const langCode = sub.lang.toLowerCase().includes("english")
                                            //         ? "en"
                                            //         : sub.lang.toLowerCase().includes("arabic")
                                            //         ? "ar"
                                            //         : sub.lang.toLowerCase().includes("french")
                                            //         ? "fr"
                                            //         : sub.lang.toLowerCase().includes("german")
                                            //         ? "de"
                                            //         : sub.lang.toLowerCase().includes("italian")
                                            //         ? "it"
                                            //         : sub.lang.toLowerCase().includes("portuguese")
                                            //         ? "pt"
                                            //         : sub.lang.toLowerCase().includes("russian")
                                            //         ? "ru"
                                            //         : sub.lang.toLowerCase().includes("spanish")
                                            //         ? "es"
                                            //         : "und";
                                            //       subtitles.push({
                                            //         title: sub.lang,
                                            //         language: langCode,
                                            //         type: "text/vtt",
                                            //         uri: sub.url,
                                            //       });
                                            //     }
                                            //   });
                                            // }
                                            res.data.sources.forEach(function (source) {
                                                streamLinks_1.push({
                                                    server: server + ": ".concat(source.quality),
                                                    link: "https://m3u8.8man.workers.dev?url=".concat(source.url),
                                                    type: "m3u8",
                                                    quality: source.quality,
                                                    headers: {
                                                        referer: "https://animetsu.to/",
                                                    },
                                                    subtitles: subtitles_1.length > 0 ? subtitles_1 : [],
                                                });
                                            });
                                        }
                                        return [3 /*break*/, 3];
                                    case 2:
                                        e_1 = _a.sent();
                                        console.log("Error with server ".concat(server, ":"), e_1);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _d.sent();
                    // Try dub version as well
                    return [4 /*yield*/, Promise.all(servers.map(function (server) { return __awaiter(_this, void 0, void 0, function () {
                            var url, res, subtitles_2, e_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        url = "".concat(baseUrl_1, "/api/anime/tiddies?server=").concat(server, "&id=").concat(animeId_1, "&num=").concat(episodeNumber_1, "&subType=dub");
                                        return [4 /*yield*/, axios_1.get(url, {
                                                headers: {
                                                    referer: "https://animetsu.to/",
                                                },
                                            })];
                                    case 1:
                                        res = _a.sent();
                                        if (res.data && res.data.sources) {
                                            subtitles_2 = [];
                                            // if (res.data.subtitles && Array.isArray(res.data.subtitles)) {
                                            //   res.data.subtitles.forEach((sub: any) => {
                                            //     if (sub.url && sub.lang) {
                                            //       // Extract language code from lang string (e.g., "English" -> "en", "Arabic - CR" -> "ar")
                                            //       const langCode = sub.lang.toLowerCase().includes("english")
                                            //         ? "en"
                                            //         : sub.lang.toLowerCase().includes("arabic")
                                            //         ? "ar"
                                            //         : sub.lang.toLowerCase().includes("french")
                                            //         ? "fr"
                                            //         : sub.lang.toLowerCase().includes("german")
                                            //         ? "de"
                                            //         : sub.lang.toLowerCase().includes("italian")
                                            //         ? "it"
                                            //         : sub.lang.toLowerCase().includes("portuguese")
                                            //         ? "pt"
                                            //         : sub.lang.toLowerCase().includes("russian")
                                            //         ? "ru"
                                            //         : sub.lang.toLowerCase().includes("spanish")
                                            //         ? "es"
                                            //         : "und";
                                            //       subtitles.push({
                                            //         title: sub.lang,
                                            //         language: langCode,
                                            //         type: "text/vtt",
                                            //         uri: sub.url,
                                            //       });
                                            //     }
                                            //   });
                                            // }
                                            res.data.sources.forEach(function (source) {
                                                streamLinks_1.push({
                                                    server: "".concat(server, " (Dub) : ").concat(source.quality),
                                                    link: "https://m3u8.8man.workers.dev?url=".concat(source.url),
                                                    type: "m3u8",
                                                    quality: source.quality,
                                                    headers: {
                                                        referer: "https://animetsu.to/",
                                                    },
                                                    subtitles: subtitles_2.length > 0 ? subtitles_2 : [],
                                                });
                                            });
                                        }
                                        return [3 /*break*/, 3];
                                    case 2:
                                        e_2 = _a.sent();
                                        console.log("Error with server ".concat(server, " (dub):"), e_2);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    // Try dub version as well
                    _d.sent();
                    console.log("Stream links:", streamLinks_1);
                    return [2 /*return*/, streamLinks_1];
                case 3:
                    err_1 = _d.sent();
                    console.error("animetsu stream error:", err_1);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.getStream = getStream;
