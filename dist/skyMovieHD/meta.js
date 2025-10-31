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
exports.fetchEpisodesFromSelectedLink = fetchEpisodesFromSelectedLink;
var headers = {
    Referer: "https://google.com",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};
function fetchEpisodesFromSelectedLink(url, providerContext) {
    return __awaiter(this, void 0, void 0, function () {
        var axios, cheerio, res, $, episodes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    return [4 /*yield*/, axios.get(url, { headers: headers })];
                case 1:
                    res = _a.sent();
                    $ = cheerio.load(res.data);
                    episodes = [];
                    $("h4").each(function (_, h4El) {
                        var epTitle = $(h4El).text().trim();
                        if (!epTitle)
                            return;
                        var directLinks = [];
                        $(h4El)
                            .nextUntil("h4, hr")
                            .find("a[href]")
                            .each(function (_, linkEl) {
                            var href = ($(linkEl).attr("href") || "").trim();
                            if (!href)
                                return;
                            if (!href.startsWith("http"))
                                href = new URL(href, url).href;
                            var btnText = $(linkEl).text().trim() || "Watch Episode";
                            directLinks.push({
                                link: href,
                                title: btnText,
                                quality: "AUTO",
                                type: "series",
                            });
                        });
                        if (directLinks.length > 0) {
                            episodes.push({
                                title: epTitle,
                                directLinks: directLinks,
                            });
                        }
                    });
                    return [2 /*return*/, episodes];
            }
        });
    });
}
// --- Main getMeta function
var getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio, res, $_1, title, type, image, synopsis, imdbId, tags, extra, episodeList, links, directLinks_1, err_1;
        var _c;
        var link = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    if (!link.startsWith("http"))
                        link = new URL(link, "https://skymovieshd.mba").href;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get(link, { headers: headers })];
                case 2:
                    res = _d.sent();
                    $_1 = cheerio.load(res.data);
                    title = ($_1("title").text() || "").trim() || "Unknown";
                    type = "movie";
                    image = "";
                    synopsis = "";
                    imdbId = "";
                    tags = [];
                    extra = {};
                    episodeList = [];
                    links = [];
                    directLinks_1 = [];
                    $_1("a[href]")
                        .filter(function (_, a) {
                        var text = ($_1(a).text() || "").trim().toLowerCase();
                        // Only extract WATCH ONLINE and SERVER 01
                        return (text.includes("watch online") ||
                            text === "server 01");
                    })
                        .each(function (_, a) {
                        var href = ($_1(a).attr("href") || "").trim();
                        if (!href)
                            return;
                        if (!href.startsWith("http"))
                            href = new URL(href, link).href;
                        var text = ($_1(a).text() || "Link").trim();
                        directLinks_1.push({ link: href, title: text, quality: "AUTO", type: "movie" });
                    });
                    if (directLinks_1.length) {
                        links.push({
                            title: title,
                            quality: ((_c = title.match(/\d+p/)) === null || _c === void 0 ? void 0 : _c[0]) || "AUTO",
                            episodesLink: "",
                            directLinks: directLinks_1,
                        });
                    }
                    return [2 /*return*/, {
                            title: title,
                            synopsis: synopsis,
                            image: image,
                            imdbId: imdbId,
                            type: type,
                            tags: tags,
                            cast: [],
                            rating: "",
                            linkList: links,
                            extraInfo: extra,
                            episodeList: episodeList,
                        }];
                case 3:
                    err_1 = _d.sent();
                    console.error("getMeta error:", err_1);
                    return [2 /*return*/, {
                            title: "",
                            synopsis: "",
                            image: "",
                            imdbId: "",
                            type: "movie",
                            tags: [],
                            cast: [],
                            rating: "",
                            linkList: [],
                            extraInfo: {},
                            episodeList: [],
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.getMeta = getMeta;
