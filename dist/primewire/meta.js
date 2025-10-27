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
        var axios, cheerio, url, baseUrl_1, res, html, $_1, title, image, synopsis, imdbId, type, linkList_1, iframeSrc, streamLink, error_1;
        var _c;
        var link = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 3, , 4]);
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    url = link;
                    baseUrl_1 = link.split("/").slice(0, 3).join("/");
                    return [4 /*yield*/, axios.get(url)];
                case 1:
                    res = _d.sent();
                    return [4 /*yield*/, res.data];
                case 2:
                    html = _d.sent();
                    $_1 = cheerio.load(html);
                    title = $_1("h1").text().trim() || "";
                    image = $_1(".movie_thumb").find("img").attr("src") || "";
                    if (image && image.startsWith("/")) {
                        image = baseUrl_1 + image;
                    }
                    synopsis = $_1(".movie_description").text().trim() || "";
                    imdbId = ((_c = $_1(".movie_info")
                        .find('a[href*="imdb.com/title/tt"]:not([href*="imdb.com/title/tt/"])')
                        .attr("href")) === null || _c === void 0 ? void 0 : _c.split("/")[4]) || "";
                    type = $_1(".show_season").html() ? "series" : "movie";
                    linkList_1 = [];
                    iframeSrc = $_1('iframe').first().attr('src');
                    $_1(".show_season").each(function (i, element) {
                        var seasonTitle = "Season " + $_1(element).attr("data-id");
                        var episodes = [];
                        $_1(element)
                            .children()
                            .each(function (i, element2) {
                            var episodeTitle = $_1(element2)
                                .find("a")
                                .children()
                                .remove()
                                .end()
                                .text()
                                .trim()
                                .replace("E", "Epiosode ");
                            var episodeLink = baseUrl_1 + $_1(element2).find("a").attr("href");
                            if (episodeTitle && episodeLink) {
                                episodes.push({
                                    title: episodeTitle,
                                    link: episodeLink,
                                });
                            }
                        });
                        linkList_1.push({
                            title: seasonTitle,
                            directLinks: episodes,
                        });
                    });
                    if (type === "movie") {
                        streamLink = iframeSrc ? iframeSrc : link;
                        linkList_1.push({
                            title: "Movie",
                            directLinks: [
                                {
                                    link: streamLink,
                                    title: "Movie",
                                    type: "movie",
                                },
                            ],
                        });
                    }
                    return [2 /*return*/, {
                            title: title,
                            image: image,
                            imdbId: imdbId,
                            synopsis: synopsis,
                            type: type,
                            linkList: linkList_1,
                        }];
                case 3:
                    error_1 = _d.sent();
                    console.error(error_1);
                    return [2 /*return*/, {
                            title: "",
                            image: "",
                            imdbId: "",
                            synopsis: "",
                            linkList: [],
                            type: "uhd",
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.getMeta = getMeta;
