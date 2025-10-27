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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ringzData = exports.headers = exports.getSearchPosts = exports.getPosts = void 0;
exports.getRingzMovies = getRingzMovies;
exports.getRingzShows = getRingzShows;
exports.getRingzAnime = getRingzAnime;
exports.getRingzAdult = getRingzAdult;
var getPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var filter = _b.filter, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            return [2 /*return*/, posts({ filter: filter, signal: signal, providerContext: providerContext })];
        });
    });
};
exports.getPosts = getPosts;
var getSearchPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        function searchData(data, query) {
            // Convert query to lowercase for case-insensitive search
            var searchQuery = query.toLowerCase();
            // Filter movies based on movie name (mn)
            return data.filter(function (movie) {
                // Convert movie name to lowercase and check if it includes the search query
                var movieName = movie.mn.toLowerCase();
                return movieName.includes(searchQuery);
            });
        }
        var catalog_1, promises, responses, err_1;
        var searchQuery = _b.searchQuery, page = _b.page;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (page > 1)
                        return [2 /*return*/, []];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    catalog_1 = [];
                    promises = [getRingzMovies(), getRingzShows(), getRingzAnime()];
                    return [4 /*yield*/, Promise.all(promises)];
                case 2:
                    responses = _c.sent();
                    responses.map(function (response) {
                        var searchResults = searchData(response, searchQuery);
                        searchResults.map(function (element) {
                            var title = (element === null || element === void 0 ? void 0 : element.kn) || (element === null || element === void 0 ? void 0 : element.mn);
                            var link = JSON.stringify(element);
                            var image = element === null || element === void 0 ? void 0 : element.IV;
                            if (title && link) {
                                catalog_1.push({
                                    title: title,
                                    link: link,
                                    image: image,
                                });
                            }
                        });
                    });
                    return [2 /*return*/, catalog_1];
                case 3:
                    err_1 = _c.sent();
                    console.error("ringz error ", err_1);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.getSearchPosts = getSearchPosts;
function posts(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var response, data, catalog_2, err_2;
        var filter = _b.filter;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    response = void 0;
                    if (filter === "MOVIES") {
                        response = getRingzMovies();
                    }
                    if (filter === "SERIES") {
                        response = getRingzShows();
                    }
                    if (filter === "ANIME") {
                        response = getRingzAnime();
                    }
                    return [4 /*yield*/, response];
                case 1:
                    data = _c.sent();
                    catalog_2 = [];
                    data.map(function (element) {
                        var title = (element === null || element === void 0 ? void 0 : element.kn) || (element === null || element === void 0 ? void 0 : element.mn);
                        var link = JSON.stringify(element);
                        var image = element === null || element === void 0 ? void 0 : element.IV;
                        if (title && link) {
                            catalog_2.push({
                                title: title,
                                link: link,
                                image: image,
                            });
                        }
                    });
                    return [2 /*return*/, catalog_2];
                case 2:
                    err_2 = _c.sent();
                    console.error("ringz error ", err_2);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.headers = {
    "cf-access-client-id": "833049b087acf6e787cedfd85d1ccdb8.access",
    "cf-access-client-secret": "02db296a961d7513c3102d7785df4113eff036b2d57d060ffcc2ba3ba820c6aa",
};
var BASE_URL = "https://privatereporz.pages.dev";
function getRingzMovies() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(BASE_URL, "/test.json"), {
                            headers: __assign({}, exports.headers),
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.AllMovieDataList];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getRingzShows() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(BASE_URL, "/srs.json"), {
                            headers: __assign({}, exports.headers),
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.webSeriesDataList];
                case 3:
                    error_2 = _a.sent();
                    console.error(error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getRingzAnime() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(BASE_URL, "/anime.json"), {
                            headers: __assign({}, exports.headers),
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.webSeriesDataList];
                case 3:
                    error_3 = _a.sent();
                    console.error(error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getRingzAdult() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(BASE_URL, "/desihub.json"), {
                            headers: __assign({}, exports.headers),
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.webSeriesDataList];
                case 3:
                    error_4 = _a.sent();
                    console.error(error_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.ringzData = {
    getRingzMovies: getRingzMovies,
    getRingzShows: getRingzShows,
    getRingzAnime: getRingzAnime,
    getRingzAdult: getRingzAdult,
};
