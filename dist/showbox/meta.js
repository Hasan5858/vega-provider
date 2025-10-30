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
exports.getMeta = void 0;
var getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio, getBaseUrl, baseUrlWorker, detailWorkerUrl, detailRes, retryCount, maxRetries, _loop_1, state_1, data, $, type, imdbId, title, rating, image, synopsis, febID, indexPath, indexWorkerUrl, indexRes, _loop_2, state_2, indexData, indexHtml, febKey_1, febLink, febRes, febData, fileList, links_1, err_1;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        var link = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    _t.trys.push([0, 11, , 12]);
                    axios = providerContext.axios, cheerio = providerContext.cheerio, getBaseUrl = providerContext.getBaseUrl;
                    return [4 /*yield*/, getBaseUrl("showbox")];
                case 1:
                    baseUrlWorker = _t.sent();
                    // Add delay to prevent rate limiting
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 600); })];
                case 2:
                    // Add delay to prevent rate limiting
                    _t.sent();
                    detailWorkerUrl = "".concat(baseUrlWorker, "/api?url=").concat(encodeURIComponent(link));
                    detailRes = void 0;
                    retryCount = 0;
                    maxRetries = 3;
                    _loop_1 = function () {
                        var error_1, retryDelay_1;
                        return __generator(this, function (_v) {
                            switch (_v.label) {
                                case 0:
                                    _v.trys.push([0, 2, , 6]);
                                    return [4 /*yield*/, axios.get(detailWorkerUrl, { timeout: 30000 })];
                                case 1:
                                    detailRes = _v.sent();
                                    return [2 /*return*/, "break"];
                                case 2:
                                    error_1 = _v.sent();
                                    if (!((((_c = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _c === void 0 ? void 0 : _c.status) === 429 || ((_d = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _d === void 0 ? void 0 : _d.status) === 403) && retryCount < maxRetries - 1)) return [3 /*break*/, 4];
                                    retryDelay_1 = (retryCount + 1) * 2000;
                                    console.log("Showbox meta rate limited (".concat((_e = error_1 === null || error_1 === void 0 ? void 0 : error_1.response) === null || _e === void 0 ? void 0 : _e.status, "), retrying in ").concat(retryDelay_1, "ms..."));
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, retryDelay_1); })];
                                case 3:
                                    _v.sent();
                                    retryCount++;
                                    return [3 /*break*/, 5];
                                case 4: throw error_1;
                                case 5: return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    };
                    _t.label = 3;
                case 3:
                    if (!(retryCount < maxRetries)) return [3 /*break*/, 5];
                    return [5 /*yield**/, _loop_1()];
                case 4:
                    state_1 = _t.sent();
                    if (state_1 === "break")
                        return [3 /*break*/, 5];
                    return [3 /*break*/, 3];
                case 5:
                    // Check if request succeeded
                    if (!detailRes || !detailRes.data) {
                        throw new Error('Failed to fetch detail page after retries');
                    }
                    // Worker returns {html: "..."}
                    if (!detailRes.data.html) {
                        throw new Error('Worker returned empty HTML');
                    }
                    data = detailRes.data.html;
                    $ = cheerio.load(data);
                    type = link.includes("tv") ? "series" : "movie";
                    imdbId = "";
                    title = $(".heading-name").text();
                    rating = ((_g = (_f = $(".btn-imdb")
                        .text()) === null || _f === void 0 ? void 0 : _f.match(/\d+(\.\d+)?/g)) === null || _g === void 0 ? void 0 : _g[0]) || "";
                    image = ((_j = (_h = $(".cover_follow").attr("style")) === null || _h === void 0 ? void 0 : _h.split("url(")[1]) === null || _j === void 0 ? void 0 : _j.split(")")[0]) || "";
                    synopsis = (_l = (_k = $(".description")
                        .text()) === null || _k === void 0 ? void 0 : _k.replace(/[\n\t]/g, "")) === null || _l === void 0 ? void 0 : _l.trim();
                    febID = (_o = (_m = $(".heading-name").find("a").attr("href")) === null || _m === void 0 ? void 0 : _m.split("/")) === null || _o === void 0 ? void 0 : _o.pop();
                    // Add delay before second API call
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 600); })];
                case 6:
                    // Add delay before second API call
                    _t.sent();
                    indexPath = "/index/share_link?id=".concat(febID, "&type=").concat(type === "movie" ? "1" : "2");
                    indexWorkerUrl = "".concat(baseUrlWorker, "/api?url=").concat(encodeURIComponent(indexPath));
                    indexRes = void 0;
                    retryCount = 0;
                    _loop_2 = function () {
                        var error_2, retryDelay_2;
                        return __generator(this, function (_w) {
                            switch (_w.label) {
                                case 0:
                                    _w.trys.push([0, 2, , 6]);
                                    return [4 /*yield*/, axios.get(indexWorkerUrl, { timeout: 30000 })];
                                case 1:
                                    indexRes = _w.sent();
                                    return [2 /*return*/, "break"];
                                case 2:
                                    error_2 = _w.sent();
                                    if (!((((_p = error_2 === null || error_2 === void 0 ? void 0 : error_2.response) === null || _p === void 0 ? void 0 : _p.status) === 429 || ((_q = error_2 === null || error_2 === void 0 ? void 0 : error_2.response) === null || _q === void 0 ? void 0 : _q.status) === 403) && retryCount < maxRetries - 1)) return [3 /*break*/, 4];
                                    retryDelay_2 = (retryCount + 1) * 2000;
                                    console.log("Showbox share_link rate limited (".concat((_r = error_2 === null || error_2 === void 0 ? void 0 : error_2.response) === null || _r === void 0 ? void 0 : _r.status, "), retrying in ").concat(retryDelay_2, "ms..."));
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, retryDelay_2); })];
                                case 3:
                                    _w.sent();
                                    retryCount++;
                                    return [3 /*break*/, 5];
                                case 4: throw error_2;
                                case 5: return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    };
                    _t.label = 7;
                case 7:
                    if (!(retryCount < maxRetries)) return [3 /*break*/, 9];
                    return [5 /*yield**/, _loop_2()];
                case 8:
                    state_2 = _t.sent();
                    if (state_2 === "break")
                        return [3 /*break*/, 9];
                    return [3 /*break*/, 7];
                case 9:
                    // Check if request succeeded
                    if (!indexRes || !indexRes.data) {
                        throw new Error('Failed to fetch share_link after retries');
                    }
                    indexData = void 0;
                    if (indexRes.data.data) {
                        // Worker forwards JSON directly as {data: {...}}
                        indexData = indexRes.data;
                    }
                    else if (indexRes.data.html) {
                        // Worker wraps JSON in {html: "..."} - try to parse it
                        try {
                            indexHtml = indexRes.data.html;
                            indexData = typeof indexHtml === 'string' ? JSON.parse(indexHtml) : indexHtml;
                        }
                        catch (_u) {
                            indexData = indexRes.data;
                        }
                    }
                    else {
                        indexData = indexRes.data;
                    }
                    febKey_1 = indexData.data.link.split("/").pop();
                    febLink = "https://www.febbox.com/file/file_share_list?share_key=".concat(febKey_1, "&is_html=0");
                    return [4 /*yield*/, axios.get(febLink)];
                case 10:
                    febRes = _t.sent();
                    febData = febRes.data;
                    fileList = (_s = febData === null || febData === void 0 ? void 0 : febData.data) === null || _s === void 0 ? void 0 : _s.file_list;
                    links_1 = [];
                    if (fileList) {
                        fileList.map(function (file) {
                            var fileName = "".concat(file.file_name, " (").concat(file.file_size, ")");
                            var fileId = file.fid;
                            links_1.push({
                                title: fileName,
                                episodesLink: file.is_dir ? "".concat(febKey_1, "&").concat(fileId) : "".concat(febKey_1, "&"),
                            });
                        });
                    }
                    return [2 /*return*/, {
                            title: title,
                            rating: rating,
                            synopsis: synopsis,
                            image: image,
                            imdbId: imdbId,
                            type: type,
                            linkList: links_1,
                        }];
                case 11:
                    err_1 = _t.sent();
                    console.error("Error fetching metadata:", err_1);
                    return [2 /*return*/, {
                            title: "",
                            rating: "",
                            synopsis: "",
                            image: "",
                            imdbId: "",
                            type: "",
                            linkList: [],
                        }];
                case 12: return [2 /*return*/];
            }
        });
    });
};
exports.getMeta = getMeta;
