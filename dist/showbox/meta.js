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
        var axios, cheerio, getBaseUrl, baseUrlShowbox, url, res, data, $, type, imdbId, title, rating, image, synopsis, febID, baseUrl, indexUrl, indexRes, indexData, febKey_1, febLink, febRes, febData, fileList, links_1, err_1;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l;
        var link = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    _m.trys.push([0, 5, , 6]);
                    axios = providerContext.axios, cheerio = providerContext.cheerio, getBaseUrl = providerContext.getBaseUrl;
                    return [4 /*yield*/, getBaseUrl("showbox")];
                case 1:
                    baseUrlShowbox = _m.sent();
                    url = baseUrlShowbox + link;
                    return [4 /*yield*/, axios.get(url)];
                case 2:
                    res = _m.sent();
                    data = res.data;
                    $ = cheerio.load(data);
                    type = url.includes("tv") ? "series" : "movie";
                    imdbId = "";
                    title = $(".heading-name").text();
                    rating = ((_d = (_c = $(".btn-imdb")
                        .text()) === null || _c === void 0 ? void 0 : _c.match(/\d+(\.\d+)?/g)) === null || _d === void 0 ? void 0 : _d[0]) || "";
                    image = ((_f = (_e = $(".cover_follow").attr("style")) === null || _e === void 0 ? void 0 : _e.split("url(")[1]) === null || _f === void 0 ? void 0 : _f.split(")")[0]) || "";
                    synopsis = (_h = (_g = $(".description")
                        .text()) === null || _g === void 0 ? void 0 : _g.replace(/[\n\t]/g, "")) === null || _h === void 0 ? void 0 : _h.trim();
                    febID = (_k = (_j = $(".heading-name").find("a").attr("href")) === null || _j === void 0 ? void 0 : _j.split("/")) === null || _k === void 0 ? void 0 : _k.pop();
                    baseUrl = url.split("/").slice(0, 3).join("/");
                    indexUrl = "".concat(baseUrl, "/index/share_link?id=").concat(febID, "&type=").concat(type === "movie" ? "1" : "2");
                    return [4 /*yield*/, axios.get(indexUrl)];
                case 3:
                    indexRes = _m.sent();
                    indexData = indexRes.data;
                    febKey_1 = indexData.data.link.split("/").pop();
                    febLink = "https://www.febbox.com/file/file_share_list?share_key=".concat(febKey_1, "&is_html=0");
                    return [4 /*yield*/, axios.get(febLink)];
                case 4:
                    febRes = _m.sent();
                    febData = febRes.data;
                    fileList = (_l = febData === null || febData === void 0 ? void 0 : febData.data) === null || _l === void 0 ? void 0 : _l.file_list;
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
                case 5:
                    err_1 = _m.sent();
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
                case 6: return [2 /*return*/];
            }
        });
    });
};
exports.getMeta = getMeta;
