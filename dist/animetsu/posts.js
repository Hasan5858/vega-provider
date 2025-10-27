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
        var axios, baseUrl, url;
        var filter = _b.filter, page = _b.page, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            axios = providerContext.axios;
            baseUrl = "https://backend.animetsu.to";
            url = baseUrl + filter + "&page=" + page.toString();
            console.log("animetsuGetPosts url", url);
            return [2 /*return*/, posts({ url: url.toString(), signal: signal, axios: axios })];
        });
    });
};
exports.getPosts = getPosts;
var getSearchPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, baseUrl, url;
        var searchQuery = _b.searchQuery, page = _b.page, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            axios = providerContext.axios;
            baseUrl = "https://backend.animetsu.to";
            url = "".concat(baseUrl, "/api/anime/search?query=").concat(encodeURIComponent(searchQuery), "&page=").concat(page, "&perPage=35&year=any&sort=favourites&season=any&format=any&status=any");
            return [2 /*return*/, posts({ url: url, signal: signal, axios: axios })];
        });
    });
};
exports.getSearchPosts = getSearchPosts;
function posts(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var res, data, catalog_1, err_1;
        var _c;
        var url = _b.url, signal = _b.signal, axios = _b.axios;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get(url, {
                            signal: signal,
                            headers: {
                                Referer: "https://animetsu.to/",
                            },
                        })];
                case 1:
                    res = _d.sent();
                    data = (_c = res.data) === null || _c === void 0 ? void 0 : _c.results;
                    catalog_1 = [];
                    data === null || data === void 0 ? void 0 : data.map(function (element) {
                        var _a, _b, _c, _d, _e, _f, _g;
                        var title = ((_a = element.title) === null || _a === void 0 ? void 0 : _a.english) ||
                            ((_b = element.title) === null || _b === void 0 ? void 0 : _b.romaji) ||
                            ((_c = element.title) === null || _c === void 0 ? void 0 : _c.native);
                        var link = (_d = element.id) === null || _d === void 0 ? void 0 : _d.toString();
                        var image = ((_e = element.coverImage) === null || _e === void 0 ? void 0 : _e.large) ||
                            ((_f = element.coverImage) === null || _f === void 0 ? void 0 : _f.extraLarge) ||
                            ((_g = element.coverImage) === null || _g === void 0 ? void 0 : _g.medium);
                        if (title && link && image) {
                            catalog_1.push({
                                title: title,
                                link: link,
                                image: image,
                            });
                        }
                    });
                    return [2 /*return*/, catalog_1];
                case 2:
                    err_1 = _d.sent();
                    console.error("animetsu error ", err_1);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
