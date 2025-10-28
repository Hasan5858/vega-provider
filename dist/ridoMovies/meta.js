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
exports.getMeta = void 0;
var getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, getBaseUrl, cheerio, headers, baseUrl_1, slug_1, slugParts, fileName, searchQuery, searchUrl, searchRes, searchData, match, content, meta, links, episodesUrl, episodesRes, episodesData, links, seasonMap_1, _c, _d, _e, seasonNum, episodes, episodesError_1, err_1;
        var e_1, _f;
        var _g, _h, _j, _k, _l;
        var link = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    _m.trys.push([0, 9, , 10]);
                    axios = providerContext.axios, getBaseUrl = providerContext.getBaseUrl, cheerio = providerContext.cheerio, headers = providerContext.commonHeaders;
                    return [4 /*yield*/, getBaseUrl("ridomovies")];
                case 1:
                    baseUrl_1 = _m.sent();
                    console.log("ridomovies meta link:", link);
                    slug_1 = link.replace(baseUrl_1 + "/", "");
                    console.log("ridomovies slug:", slug_1);
                    slugParts = slug_1.split('/');
                    fileName = slugParts[slugParts.length - 1];
                    searchQuery = "lego";
                    searchUrl = "".concat(baseUrl_1, "/core/api/search?q=").concat(encodeURIComponent(searchQuery));
                    console.log("ridomovies meta search URL (strategy 1):", searchUrl);
                    return [4 /*yield*/, axios.get(searchUrl, { headers: headers })];
                case 2:
                    searchRes = _m.sent();
                    searchData = searchRes.data;
                    console.log("ridomovies search response for meta:", searchData);
                    match = (_h = (_g = searchData === null || searchData === void 0 ? void 0 : searchData.data) === null || _g === void 0 ? void 0 : _g.items) === null || _h === void 0 ? void 0 : _h.find(function (it) { return (it === null || it === void 0 ? void 0 : it.fullSlug) === slug_1; });
                    if (!!match) return [3 /*break*/, 4];
                    searchQuery = "avengers";
                    searchUrl = "".concat(baseUrl_1, "/core/api/search?q=").concat(encodeURIComponent(searchQuery));
                    console.log("ridomovies meta search URL (strategy 2):", searchUrl);
                    return [4 /*yield*/, axios.get(searchUrl, { headers: headers })];
                case 3:
                    searchRes = _m.sent();
                    searchData = searchRes.data;
                    match = (_k = (_j = searchData === null || searchData === void 0 ? void 0 : searchData.data) === null || _j === void 0 ? void 0 : _j.items) === null || _k === void 0 ? void 0 : _k.find(function (it) { return (it === null || it === void 0 ? void 0 : it.fullSlug) === slug_1; });
                    _m.label = 4;
                case 4:
                    if (!match || !match.contentable) {
                        throw new Error("No matching content found via search");
                    }
                    content = match.contentable;
                    meta = {
                        title: content.originalTitle || match.title,
                        synopsis: content.overview || "",
                        image: content.apiPosterPath || "".concat(baseUrl_1).concat(content.posterPath || ''),
                        imdbId: content.imdbId || "",
                        type: match.type || "movie",
                    };
                    console.log("ridomovies meta extracted:", meta);
                    // For movies, create a single link
                    if (meta.type === "movie") {
                        links = [{
                                title: "Movie",
                                directLinks: [{
                                        title: "Movie",
                                        link: link,
                                    }],
                            }];
                        return [2 /*return*/, __assign(__assign({}, meta), { linkList: links })];
                    }
                    if (!(meta.type === "series")) return [3 /*break*/, 8];
                    episodesUrl = "".concat(baseUrl_1, "/core/api/series/").concat(slug_1, "/episodes");
                    console.log("ridomovies episodes URL:", episodesUrl);
                    _m.label = 5;
                case 5:
                    _m.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, axios.get(episodesUrl, {
                            headers: headers,
                        })];
                case 6:
                    episodesRes = _m.sent();
                    episodesData = episodesRes.data;
                    console.log("ridomovies episodes response:", episodesData);
                    links = [];
                    seasonMap_1 = new Map();
                    if ((_l = episodesData === null || episodesData === void 0 ? void 0 : episodesData.data) === null || _l === void 0 ? void 0 : _l.episodes) {
                        episodesData.data.episodes.forEach(function (episode) {
                            var seasonNum = episode.season || 1;
                            if (!seasonMap_1.has(seasonNum)) {
                                seasonMap_1.set(seasonNum, []);
                            }
                            seasonMap_1.get(seasonNum).push({
                                title: "Episode ".concat(episode.episode),
                                link: "".concat(baseUrl_1, "/").concat(episode.slug),
                            });
                        });
                        try {
                            // Convert map to links array
                            for (_c = __values(seasonMap_1.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                                _e = __read(_d.value, 2), seasonNum = _e[0], episodes = _e[1];
                                links.push({
                                    title: "Season ".concat(seasonNum),
                                    directLinks: episodes,
                                });
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                    return [2 /*return*/, __assign(__assign({}, meta), { linkList: links })];
                case 7:
                    episodesError_1 = _m.sent();
                    console.log("ridomovies episodes error:", episodesError_1);
                    // Return empty episodes for series
                    return [2 /*return*/, __assign(__assign({}, meta), { linkList: [] })];
                case 8: return [2 /*return*/, __assign(__assign({}, meta), { linkList: [] })];
                case 9:
                    err_1 = _m.sent();
                    console.error("ridomovies meta error:", err_1);
                    return [2 /*return*/, {
                            title: "",
                            synopsis: "",
                            image: "",
                            imdbId: "",
                            type: "movie",
                            linkList: [],
                        }];
                case 10: return [2 /*return*/];
            }
        });
    });
};
exports.getMeta = getMeta;
