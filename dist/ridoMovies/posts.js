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
exports.getSearchPosts = exports.getPosts = void 0;
var getPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, getBaseUrl, headers, baseUrl_1, catalog_1, searchTerms, randomTerms, randomTerms_1, randomTerms_1_1, term, searchUrl, res, data, searchError_1, e_1_1, uniqueCatalog, err_1;
        var e_1, _c;
        var _d;
        var filter = _b.filter, page = _b.page, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 12, , 13]);
                    axios = providerContext.axios, getBaseUrl = providerContext.getBaseUrl, headers = providerContext.commonHeaders;
                    return [4 /*yield*/, getBaseUrl("ridomovies")];
                case 1:
                    baseUrl_1 = _e.sent();
                    catalog_1 = [];
                    searchTerms = [
                        "avengers", "batman", "superman", "spider", "iron man", "thor",
                        "captain america", "wonder woman", "black widow", "hulk",
                        "fast", "furious", "mission impossible", "james bond", "john wick",
                        "transformers", "terminator", "predator", "alien", "matrix"
                    ];
                    randomTerms = searchTerms.slice(0, 3);
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 9, 10, 11]);
                    randomTerms_1 = __values(randomTerms), randomTerms_1_1 = randomTerms_1.next();
                    _e.label = 3;
                case 3:
                    if (!!randomTerms_1_1.done) return [3 /*break*/, 8];
                    term = randomTerms_1_1.value;
                    _e.label = 4;
                case 4:
                    _e.trys.push([4, 6, , 7]);
                    searchUrl = "".concat(baseUrl_1, "/core/api/search?q=").concat(encodeURIComponent(term));
                    console.log("ridomovies search URL:", searchUrl);
                    return [4 /*yield*/, axios.get(searchUrl, {
                            headers: headers,
                            signal: signal,
                        })];
                case 5:
                    res = _e.sent();
                    data = res.data;
                    console.log("ridomovies search response:", data);
                    if ((_d = data === null || data === void 0 ? void 0 : data.data) === null || _d === void 0 ? void 0 : _d.items) {
                        data.data.items.forEach(function (item) {
                            if (item === null || item === void 0 ? void 0 : item.contentable) {
                                var movie = item.contentable;
                                // Check if it's a movie (not a series)
                                if (movie && item.type === 'movie') {
                                    catalog_1.push({
                                        title: movie.originalTitle || item.title,
                                        link: "".concat(baseUrl_1, "/").concat(item.fullSlug),
                                        image: movie.apiPosterPath || "".concat(baseUrl_1).concat(movie.posterPath),
                                    });
                                }
                            }
                        });
                    }
                    return [3 /*break*/, 7];
                case 6:
                    searchError_1 = _e.sent();
                    console.log("ridomovies search error for ".concat(term, ":"), searchError_1.message);
                    return [3 /*break*/, 7];
                case 7:
                    randomTerms_1_1 = randomTerms_1.next();
                    return [3 /*break*/, 3];
                case 8: return [3 /*break*/, 11];
                case 9:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 11];
                case 10:
                    try {
                        if (randomTerms_1_1 && !randomTerms_1_1.done && (_c = randomTerms_1.return)) _c.call(randomTerms_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 11:
                    uniqueCatalog = catalog_1.filter(function (item, index, self) {
                        return index === self.findIndex(function (t) { return t.link === item.link; });
                    });
                    console.log("ridomovies catalog length:", uniqueCatalog.length);
                    return [2 /*return*/, uniqueCatalog.slice(0, 30)]; // Limit to 30 items
                case 12:
                    err_1 = _e.sent();
                    console.error("ridomovies posts error:", err_1);
                    return [2 /*return*/, []];
                case 13: return [2 /*return*/];
            }
        });
    });
};
exports.getPosts = getPosts;
var getSearchPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, getBaseUrl, headers, baseUrl_2, catalog_2, searchUrl, res, data, err_2;
        var _c;
        var searchQuery = _b.searchQuery, page = _b.page, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 3, , 4]);
                    axios = providerContext.axios, getBaseUrl = providerContext.getBaseUrl, headers = providerContext.commonHeaders;
                    return [4 /*yield*/, getBaseUrl("ridomovies")];
                case 1:
                    baseUrl_2 = _d.sent();
                    if (page > 1) {
                        return [2 /*return*/, []];
                    }
                    catalog_2 = [];
                    searchUrl = "".concat(baseUrl_2, "/core/api/search?q=").concat(encodeURIComponent(searchQuery));
                    console.log("ridomovies search URL:", searchUrl);
                    return [4 /*yield*/, axios.get(searchUrl, {
                            headers: headers,
                            signal: signal,
                        })];
                case 2:
                    res = _d.sent();
                    data = res.data;
                    console.log("ridomovies search response:", data);
                    if ((_c = data === null || data === void 0 ? void 0 : data.data) === null || _c === void 0 ? void 0 : _c.items) {
                        data.data.items.forEach(function (item) {
                            if (item === null || item === void 0 ? void 0 : item.contentable) {
                                var movie = item.contentable;
                                catalog_2.push({
                                    title: movie.originalTitle || item.title,
                                    link: "".concat(baseUrl_2, "/").concat(item.fullSlug),
                                    image: movie.apiPosterPath || "".concat(baseUrl_2).concat(movie.posterPath),
                                });
                            }
                        });
                    }
                    console.log("ridomovies search results:", catalog_2.length);
                    return [2 /*return*/, catalog_2];
                case 3:
                    err_2 = _d.sent();
                    console.error("ridomovies search error:", err_2);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.getSearchPosts = getSearchPosts;
