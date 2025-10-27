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
        var axios, cheerio, headers, url, res, data, $_1, type_1, imdbId, title, image, synopsis, tags, rating, links_1, downloadLink_1, downloadText, qualityMatch, err_1;
        var link = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    axios = providerContext.axios, cheerio = providerContext.cheerio, headers = providerContext.commonHeaders;
                    url = link.replace('filmyfly.deals', 'filmyfly.observer');
                    return [4 /*yield*/, axios.get(url, { headers: headers })];
                case 1:
                    res = _c.sent();
                    data = res.data;
                    $_1 = cheerio.load(data);
                    type_1 = url.includes("tvshows") || url.includes("series") || $_1('h2').text().includes('Series') ? "series" : "movie";
                    imdbId = "";
                    title = $_1('h2').first().text().trim() ||
                        $_1('title').text().replace('FilmyFly', '').trim() ||
                        $_1('.fname').filter(function (i, el) { return $_1(el).text().includes('Name:'); }).find(".colora").text().trim();
                    image = $_1('.movie-thumb img').attr('src') ||
                        $_1(".ss img").attr("src") ||
                        "";
                    synopsis = $_1('.fname').filter(function (i, el) { return $_1(el).text().includes('Description:'); }).find(".colorg").text().trim();
                    tags = $_1('.fname').filter(function (i, el) { return $_1(el).text().includes('Genre:'); }).find(".colorb").text().split(",").map(function (tag) { return tag.trim(); }) || [];
                    rating = "";
                    links_1 = [];
                    downloadLink_1 = $_1(".dlbtn a").attr("href");
                    downloadText = $_1(".dlbtn a").text().trim();
                    if (downloadLink_1 && downloadText) {
                        qualityMatch = downloadText.match(/(\d+p|4k|2160p)/gi);
                        if (qualityMatch && qualityMatch.length > 0) {
                            // Create separate Link objects for each quality
                            qualityMatch.forEach(function (quality) {
                                var normalizedQuality = quality.toLowerCase();
                                links_1.push({
                                    title: "".concat(normalizedQuality.toUpperCase(), " Quality"),
                                    quality: normalizedQuality,
                                    episodesLink: downloadLink_1,
                                    directLinks: [{
                                            title: "Download ".concat(normalizedQuality.toUpperCase()),
                                            link: downloadLink_1,
                                            type: type_1
                                        }]
                                });
                            });
                        }
                        else {
                            // Fallback: create a single download link
                            links_1.push({
                                title: "Download",
                                episodesLink: downloadLink_1,
                                directLinks: [{
                                        title: "Download Movie",
                                        link: downloadLink_1,
                                        type: type_1
                                    }]
                            });
                        }
                    }
                    // Fallback: if no dlbtn found, try other selectors
                    if (links_1.length === 0) {
                        $_1(".dwd-button").each(function (i, el) {
                            var btnEl = $_1(el);
                            var parentLink = btnEl.parent("a").attr("href");
                            var text = btnEl.text().trim();
                            if (parentLink && !parentLink.includes("javascript:") && !parentLink.includes("mailto:")) {
                                links_1.push({
                                    title: "Download",
                                    episodesLink: parentLink,
                                    directLinks: [{
                                            title: text || "Download",
                                            link: parentLink.startsWith("http") ? parentLink : "https://filmyfly.observer".concat(parentLink),
                                            type: type_1
                                        }]
                                });
                            }
                        });
                    }
                    return [2 /*return*/, {
                            title: title,
                            tags: tags,
                            rating: rating,
                            synopsis: synopsis,
                            image: image,
                            imdbId: imdbId,
                            type: type_1,
                            linkList: links_1,
                        }];
                case 2:
                    err_1 = _c.sent();
                    console.error(err_1);
                    return [2 /*return*/, {
                            title: "",
                            synopsis: "",
                            image: "",
                            imdbId: "",
                            type: "movie",
                            linkList: [],
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
};
exports.getMeta = getMeta;
