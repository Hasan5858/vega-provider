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
exports.getSearchPosts = exports.getPosts = void 0;
var getPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var getBaseUrl, cheerio, baseUrl_1, catalog_1, isPrime, url, res, data, $_1, err_1;
        var filter = _b.filter, page = _b.page, providerValue = _b.providerValue, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    getBaseUrl = providerContext.getBaseUrl, cheerio = providerContext.cheerio;
                    return [4 /*yield*/, getBaseUrl("nfMirror")];
                case 1:
                    baseUrl_1 = _c.sent();
                    catalog_1 = [];
                    if (page > 1) {
                        return [2 /*return*/, []];
                    }
                    isPrime = providerValue === "primeMirror" ? "isPrime=true" : "isPrime=false";
                    url = "https://netmirror.8man.dev/api/net-proxy?".concat(isPrime, "&url=").concat(baseUrl_1 + filter);
                    return [4 /*yield*/, fetch(url, {
                            signal: signal,
                            method: "GET",
                            credentials: "omit",
                        })];
                case 2:
                    res = _c.sent();
                    return [4 /*yield*/, res.text()];
                case 3:
                    data = _c.sent();
                    $_1 = cheerio.load(data);
                    $_1("a.post-data").map(function (i, element) {
                        var title = "";
                        var id = $_1(element).attr("data-post");
                        // console.log('id', id);
                        var image = $_1(element).find("img").attr("data-src") || "";
                        if (id) {
                            catalog_1.push({
                                title: title,
                                link: baseUrl_1 +
                                    "".concat(providerValue === "netflixMirror"
                                        ? "/post.php?id="
                                        : "/pv/post.php?id=") +
                                    id +
                                    "&t=" +
                                    Math.round(new Date().getTime() / 1000),
                                image: image,
                            });
                        }
                    });
                    // console.log(catalog);
                    return [2 /*return*/, catalog_1];
                case 4:
                    err_1 = _c.sent();
                    console.error("nf error ", err_1);
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    });
};
exports.getPosts = getPosts;
var getSearchPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var getBaseUrl, catalog_2, baseUrl_2, isPrime, url, res, data, err_2;
        var _c;
        var searchQuery = _b.searchQuery, page = _b.page, providerValue = _b.providerValue, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    getBaseUrl = providerContext.getBaseUrl;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 5, , 6]);
                    if (page > 1) {
                        return [2 /*return*/, []];
                    }
                    catalog_2 = [];
                    return [4 /*yield*/, getBaseUrl("nfMirror")];
                case 2:
                    baseUrl_2 = _d.sent();
                    isPrime = providerValue === "primeMirror" ? "isPrime=true" : "isPrime=false";
                    url = "https://netmirror.8man.dev/api/net-proxy?".concat(isPrime, "&url=").concat(baseUrl_2).concat(providerValue === "netflixMirror" ? "" : "/pv", "/search.php?s=").concat(encodeURI(searchQuery));
                    return [4 /*yield*/, fetch(url, {
                            signal: signal,
                            method: "GET",
                            credentials: "omit",
                        })];
                case 3:
                    res = _d.sent();
                    return [4 /*yield*/, res.json()];
                case 4:
                    data = _d.sent();
                    (_c = data === null || data === void 0 ? void 0 : data.searchResult) === null || _c === void 0 ? void 0 : _c.forEach(function (result) {
                        var title = (result === null || result === void 0 ? void 0 : result.t) || "";
                        var id = result === null || result === void 0 ? void 0 : result.id;
                        var image = providerValue === "netflixMirror"
                            ? "https://imgcdn.media/poster/v/".concat(id, ".jpg")
                            : "https://imgcdn.media/pv/341/".concat(id, ".jpg");
                        if (id) {
                            catalog_2.push({
                                title: title,
                                link: baseUrl_2 +
                                    "".concat(providerValue === "netflixMirror"
                                        ? "/mobile/post.php?id="
                                        : "/mobile/pv/post.php?id=") +
                                    id +
                                    "&t=" +
                                    Math.round(new Date().getTime() / 1000),
                                image: image,
                            });
                        }
                    });
                    return [2 /*return*/, catalog_2];
                case 5:
                    err_2 = _d.sent();
                    console.error("Search error:", err_2);
                    return [2 /*return*/, []];
                case 6: return [2 /*return*/];
            }
        });
    });
};
exports.getSearchPosts = getSearchPosts;
