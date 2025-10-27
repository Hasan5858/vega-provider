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
        var getBaseUrl, axios, res, data, meta, baseUrl, slug, res2, data2, err_1, links, directLinks, season_1, _c, _d, _e, seasonNum, episodes, err_2;
        var e_1, _f;
        var _g, _h, _j, _k, _l, _m, _o;
        var link = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    _p.trys.push([0, 7, , 8]);
                    getBaseUrl = providerContext.getBaseUrl, axios = providerContext.axios;
                    return [4 /*yield*/, axios.get(link)];
                case 1:
                    res = _p.sent();
                    data = res.data;
                    meta = {
                        title: "",
                        synopsis: "",
                        image: "",
                        imdbId: ((_g = data === null || data === void 0 ? void 0 : data.meta) === null || _g === void 0 ? void 0 : _g.imdb_id) || "",
                        type: ((_h = data === null || data === void 0 ? void 0 : data.meta) === null || _h === void 0 ? void 0 : _h.type) || "movie",
                    };
                    return [4 /*yield*/, getBaseUrl("ridomovies")];
                case 2:
                    baseUrl = _p.sent();
                    slug = "";
                    _p.label = 3;
                case 3:
                    _p.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, axios.get(baseUrl + "/core/api/search?q=" + meta.imdbId)];
                case 4:
                    res2 = _p.sent();
                    data2 = res2.data;
                    slug = (_k = (_j = data2 === null || data2 === void 0 ? void 0 : data2.data) === null || _j === void 0 ? void 0 : _j.items[0]) === null || _k === void 0 ? void 0 : _k.fullSlug;
                    if (!slug || (meta === null || meta === void 0 ? void 0 : meta.type) === "series") {
                        return [2 /*return*/, {
                                title: "",
                                synopsis: "",
                                image: "",
                                imdbId: ((_l = data === null || data === void 0 ? void 0 : data.meta) === null || _l === void 0 ? void 0 : _l.imdb_id) || "",
                                type: (meta === null || meta === void 0 ? void 0 : meta.type) || "movie",
                                linkList: [],
                            }];
                    }
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _p.sent();
                    return [2 /*return*/, {
                            title: "",
                            synopsis: "",
                            image: "",
                            imdbId: (meta === null || meta === void 0 ? void 0 : meta.imdbId) || "",
                            type: (meta === null || meta === void 0 ? void 0 : meta.type) || "movie",
                            linkList: [],
                        }];
                case 6:
                    links = [];
                    directLinks = [];
                    season_1 = new Map();
                    if (meta.type === "series") {
                        (_o = (_m = data === null || data === void 0 ? void 0 : data.meta) === null || _m === void 0 ? void 0 : _m.videos) === null || _o === void 0 ? void 0 : _o.map(function (video) {
                            if ((video === null || video === void 0 ? void 0 : video.season) <= 0)
                                return;
                            if (!season_1.has(video === null || video === void 0 ? void 0 : video.season)) {
                                season_1.set(video === null || video === void 0 ? void 0 : video.season, []);
                            }
                            season_1.get(video === null || video === void 0 ? void 0 : video.season).push({
                                title: "Episode " + (video === null || video === void 0 ? void 0 : video.episode),
                                link: "",
                            });
                        });
                        try {
                            for (_c = __values(season_1.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                                _e = __read(_d.value, 2), seasonNum = _e[0], episodes = _e[1];
                                links.push({
                                    title: "Season " + seasonNum,
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
                    else {
                        directLinks.push({ title: "Movie", link: link });
                        links.push({ title: "Movie", directLinks: directLinks });
                    }
                    return [2 /*return*/, __assign(__assign({}, meta), { linkList: links })];
                case 7:
                    err_2 = _p.sent();
                    return [2 /*return*/, {
                            title: "",
                            synopsis: "",
                            image: "",
                            imdbId: "",
                            type: "movie",
                            linkList: [],
                        }];
                case 8: return [2 /*return*/];
            }
        });
    });
};
exports.getMeta = getMeta;
