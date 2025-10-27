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
        var getBaseUrl, axios, baseUrl, url, res, data, catalog_1, err_1;
        var _c;
        var filter = _b.filter, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    getBaseUrl = providerContext.getBaseUrl, axios = providerContext.axios;
                    return [4 /*yield*/, getBaseUrl("kissKh")];
                case 1:
                    baseUrl = _d.sent();
                    url = "".concat(baseUrl + filter, "&type=0");
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, axios.get(url, { signal: signal })];
                case 3:
                    res = _d.sent();
                    data = (_c = res.data) === null || _c === void 0 ? void 0 : _c.data;
                    catalog_1 = [];
                    data === null || data === void 0 ? void 0 : data.map(function (element) {
                        var title = element.title;
                        var link = baseUrl + "/api/DramaList/Drama/".concat(element === null || element === void 0 ? void 0 : element.id, "?isq=false");
                        var image = element.thumbnail;
                        if (title && link && image) {
                            catalog_1.push({
                                title: title,
                                link: link,
                                image: image,
                            });
                        }
                    });
                    return [2 /*return*/, catalog_1];
                case 4:
                    err_1 = _d.sent();
                    console.error("kiss error ", err_1);
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    });
};
exports.getPosts = getPosts;
var getSearchPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var getBaseUrl, axios, baseUrl, url, res, data, catalog_2, err_2;
        var searchQuery = _b.searchQuery, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    getBaseUrl = providerContext.getBaseUrl, axios = providerContext.axios;
                    return [4 /*yield*/, getBaseUrl("kissKh")];
                case 1:
                    baseUrl = _c.sent();
                    url = "".concat(baseUrl, "/api/DramaList/Search?q=").concat(searchQuery, "&type=0");
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, axios.get(url, { signal: signal })];
                case 3:
                    res = _c.sent();
                    data = res.data;
                    catalog_2 = [];
                    data === null || data === void 0 ? void 0 : data.map(function (element) {
                        var title = element.title;
                        var link = baseUrl + "/api/DramaList/Drama/".concat(element === null || element === void 0 ? void 0 : element.id, "?isq=false");
                        var image = element.thumbnail;
                        if (title && link && image) {
                            catalog_2.push({
                                title: title,
                                link: link,
                                image: image,
                            });
                        }
                    });
                    return [2 /*return*/, catalog_2];
                case 4:
                    err_2 = _c.sent();
                    console.error("kiss error ", err_2);
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    });
};
exports.getSearchPosts = getSearchPosts;
