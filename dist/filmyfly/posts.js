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
        var getBaseUrl, baseUrl, newBaseUrl, url, categoryId, categoryName;
        var _c, _d;
        var filter = _b.filter, page = _b.page, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    getBaseUrl = providerContext.getBaseUrl;
                    return [4 /*yield*/, getBaseUrl("filmyfly")];
                case 1:
                    baseUrl = _e.sent();
                    newBaseUrl = baseUrl.replace('filmyfly.deals', 'filmyfly.observer');
                    if (filter === '') {
                        // Homepage
                        url = page === 1 ? newBaseUrl : "".concat(newBaseUrl, "?to-page=").concat(page);
                    }
                    else {
                        categoryId = (_c = filter.match(/\/page-cat\/(\d+)\//)) === null || _c === void 0 ? void 0 : _c[1];
                        categoryName = (_d = filter.match(/\/page-cat\/\d+\/([^\/]+)\.html/)) === null || _d === void 0 ? void 0 : _d[1];
                        if (categoryId && categoryName) {
                            // Always use the paginated format for categories
                            url = "".concat(newBaseUrl, "/page-3/").concat(categoryId, "/").concat(categoryName, "/").concat(page);
                        }
                        else {
                            url = "".concat(newBaseUrl).concat(filter);
                        }
                    }
                    return [2 /*return*/, posts({ url: url, signal: signal, baseUrl: newBaseUrl, providerContext: providerContext })];
            }
        });
    });
};
exports.getPosts = getPosts;
var getSearchPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var getBaseUrl, baseUrl, newBaseUrl, url;
        var searchQuery = _b.searchQuery, page = _b.page, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    getBaseUrl = providerContext.getBaseUrl;
                    return [4 /*yield*/, getBaseUrl("filmyfly")];
                case 1:
                    baseUrl = _c.sent();
                    newBaseUrl = baseUrl.replace('filmyfly.deals', 'filmyfly.observer');
                    url = "".concat(newBaseUrl, "/site-1.html?to-search=").concat(searchQuery);
                    if (page > 1) {
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, posts({ url: url, signal: signal, baseUrl: newBaseUrl, providerContext: providerContext })];
            }
        });
    });
};
exports.getSearchPosts = getSearchPosts;
function posts(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var cheerio, headers, res, data, $_1, catalog_1, err_1;
        var url = _b.url, signal = _b.signal, baseUrl = _b.baseUrl, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    console.log('Fetching URL:', url);
                    cheerio = providerContext.cheerio, headers = providerContext.commonHeaders;
                    return [4 /*yield*/, fetch(url, { headers: headers, signal: signal })];
                case 1:
                    res = _c.sent();
                    return [4 /*yield*/, res.text()];
                case 2:
                    data = _c.sent();
                    $_1 = cheerio.load(data);
                    catalog_1 = [];
                    console.log('Page loaded, checking for content...');
                    // Handle homepage structure (.A10 divs)
                    $_1(".A10").each(function (i, element) {
                        var $el = $_1(element);
                        var linkEl = $el.find("a").first();
                        var titleEl = $el.find("div[style*='font-weight:bold']").first();
                        var title = titleEl.text().trim();
                        var link = linkEl.attr("href");
                        var image = $el.find("img").attr("src");
                        if (title && link && image) {
                            catalog_1.push({
                                title: title,
                                link: baseUrl + link,
                                image: image,
                            });
                        }
                    });
                    // Handle category pages structure (.fl divs)
                    $_1(".fl").each(function (i, element) {
                        var $el = $_1(element);
                        var linkEl = $el.find("a").first();
                        // Try different selectors for title
                        var title = linkEl.find("b").text().trim();
                        if (!title) {
                            title = linkEl.text().trim();
                        }
                        if (!title) {
                            title = $el.find("b").text().trim();
                        }
                        var link = linkEl.attr("href");
                        var image = $el.find("img").attr("src");
                        // Only add if we have all three components and title is not empty
                        if (title && link && image && title.length > 0) {
                            catalog_1.push({
                                title: title,
                                link: baseUrl + link,
                                image: image,
                            });
                        }
                    });
                    return [2 /*return*/, catalog_1];
                case 3:
                    err_1 = _c.sent();
                    console.error("ff error ", err_1);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
