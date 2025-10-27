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
                                type: "episode",
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
        var axios, cheerio, res, $_1, content, title, pageText, type, image, synopsis_1, imdbLink, imdbId, tags_1, extra_1, links_1, episodeList, isInformationalHeading_1, err_1;
        var _c, _d;
        var link = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    if (!link.startsWith("http"))
                        link = new URL(link, "https://vgmlinks.click").href;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get(link, { headers: headers })];
                case 2:
                    res = _e.sent();
                    $_1 = cheerio.load(res.data);
                    content = $_1(".entry-content, .post-inner").length
                        ? $_1(".entry-content, .post-inner")
                        : $_1("body");
                    title = $_1("h1.entry-title").first().text().trim() ||
                        ((_c = $_1("meta[property='og:title']").attr("content")) === null || _c === void 0 ? void 0 : _c.trim()) ||
                        "Unknown";
                    pageText = content.text();
                    type = /Season\s*\d+/i.test(pageText) || /Episode\s*\d+/i.test(pageText)
                        ? "series"
                        : "movie";
                    image = $_1(".poster img").attr("src") ||
                        $_1("meta[property='og:image']").attr("content") ||
                        $_1("meta[name='twitter:image']").attr("content") ||
                        "";
                    if (image && !image.startsWith("http"))
                        image = new URL(image, link).href;
                    synopsis_1 = "";
                    $_1(".entry-content p").each(function (_, el) {
                        var txt = $_1(el).text().trim();
                        if (txt.length > 40 && !txt.toLowerCase().includes("download")) {
                            synopsis_1 = txt;
                            return false;
                        }
                    });
                    imdbLink = $_1("a[href*='imdb.com']").attr("href") || "";
                    imdbId = imdbLink
                        ? "tt" + (((_d = imdbLink.split("/tt")[1]) === null || _d === void 0 ? void 0 : _d.split("/")[0]) || "")
                        : "";
                    tags_1 = [];
                    $_1(".entry-content p strong").each(function (_, el) {
                        var txt = $_1(el).text().trim();
                        if (txt.match(/drama|biography|action|thriller|romance|adventure|animation/i))
                            tags_1.push(txt);
                    });
                    extra_1 = {};
                    $_1("p").each(function (_, el) {
                        var _a, _b, _c, _d, _e, _f;
                        var html = $_1(el).html() || "";
                        if (html.includes("Series Name"))
                            extra_1.name = (_a = $_1(el).text().split(":")[1]) === null || _a === void 0 ? void 0 : _a.trim();
                        if (html.includes("Language"))
                            extra_1.language = (_b = $_1(el).text().split(":")[1]) === null || _b === void 0 ? void 0 : _b.trim();
                        if (html.includes("Released Year"))
                            extra_1.year = (_c = $_1(el).text().split(":")[1]) === null || _c === void 0 ? void 0 : _c.trim();
                        if (html.includes("Quality"))
                            extra_1.quality = (_d = $_1(el).text().split(":")[1]) === null || _d === void 0 ? void 0 : _d.trim();
                        if (html.includes("Episode Size"))
                            extra_1.size = (_e = $_1(el).text().split(":")[1]) === null || _e === void 0 ? void 0 : _e.trim();
                        if (html.includes("Format"))
                            extra_1.format = (_f = $_1(el).text().split(":")[1]) === null || _f === void 0 ? void 0 : _f.trim();
                    });
                    links_1 = [];
                    episodeList = [];
                    isInformationalHeading_1 = function (text) {
                        var lowerText = text.toLowerCase();
                        return (lowerText.includes("series info") ||
                            lowerText.includes("series name") ||
                            lowerText.includes("language") ||
                            lowerText.includes("released year") ||
                            lowerText.includes("episode size") ||
                            lowerText.includes("format") ||
                            lowerText.includes("imdb rating") ||
                            lowerText.includes("winding up") ||
                            (lowerText.length < 5 && !/\d/.test(lowerText)));
                    };
                    if (type === "series") {
                        // Series case: h3 text as title + episode link button (V-Cloud)
                        content.find("h3").each(function (_, h3) {
                            var _a;
                            var h3Text = $_1(h3).text().trim();
                            if (isInformationalHeading_1(h3Text))
                                return;
                            var qualityMatch = ((_a = h3Text.match(/\d+p/)) === null || _a === void 0 ? void 0 : _a[0]) || "AUTO";
                            var vcloudLink = $_1(h3)
                                .nextUntil("h3, hr")
                                .find("a")
                                .filter(function (_, a) { return /v-cloud|mega|gdrive|download/i.test($_1(a).text()); })
                                .first();
                            var href = vcloudLink.attr("href");
                            if (href) {
                                // Hide unwanted texts
                                var btnText = vcloudLink.text().trim() || "Link";
                                if (btnText.toLowerCase().includes("imdb rating") ||
                                    btnText.toLowerCase().includes("winding up"))
                                    return;
                                links_1.push({
                                    title: h3Text,
                                    quality: qualityMatch,
                                    episodesLink: href,
                                });
                            }
                        });
                    }
                    else {
                        // Movie case: h5/h3 text as title + direct download link
                        content.find("h3, h5").each(function (_, heading) {
                            var _a;
                            var headingText = $_1(heading).text().trim();
                            if (isInformationalHeading_1(headingText))
                                return;
                            var qualityMatch = ((_a = headingText.match(/\d+p/)) === null || _a === void 0 ? void 0 : _a[0]) || "AUTO";
                            var linkEl = $_1(heading)
                                .nextUntil("h3, h5, hr")
                                .find("a[href]")
                                .first();
                            var href = linkEl.attr("href");
                            if (href) {
                                var finalHref = href.trim();
                                if (!finalHref.startsWith("http"))
                                    finalHref = new URL(finalHref, link).href;
                                var btnText = linkEl.text().trim() || "Download Link"; // Hide unwanted texts
                                if (btnText.toLowerCase().includes("imdb rating") ||
                                    btnText.toLowerCase().includes("winding up"))
                                    return;
                                links_1.push({
                                    title: headingText,
                                    quality: qualityMatch,
                                    episodesLink: "",
                                    directLinks: [
                                        {
                                            title: btnText,
                                            link: finalHref,
                                            type: "movie",
                                        },
                                    ],
                                });
                            }
                        });
                    }
                    return [2 /*return*/, {
                            title: title,
                            synopsis: synopsis_1,
                            image: image,
                            imdbId: imdbId,
                            type: type,
                            tags: tags_1,
                            cast: [],
                            rating: $_1(".entry-meta .entry-date").text().trim() || "",
                            linkList: links_1,
                            extraInfo: extra_1,
                            episodeList: episodeList,
                        }];
                case 3:
                    err_1 = _e.sent();
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
