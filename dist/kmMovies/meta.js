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
var kmmHeaders = {
    Referer: "https://google.com",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};
var getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio, baseUrl, res, $_1, title, image, synopsis_1, tags, cast_1, rating, imdbLink, imdbId, linkList_1, isSeries, err_1;
        var _c, _d;
        var link = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 4, , 5]);
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    if (!!link.startsWith("http")) return [3 /*break*/, 2];
                    return [4 /*yield*/, providerContext.getBaseUrl("kmmovies")];
                case 1:
                    baseUrl = _e.sent();
                    link = "".concat(baseUrl).concat(link.startsWith("/") ? "" : "/").concat(link);
                    _e.label = 2;
                case 2: return [4 /*yield*/, axios.get(link, { headers: kmmHeaders })];
                case 3:
                    res = _e.sent();
                    $_1 = cheerio.load(res.data);
                    title = $_1("h1, h2, .animated-text").first().text().trim() ||
                        ((_c = $_1("meta[property='og:title']").attr("content")) === null || _c === void 0 ? void 0 : _c.trim()) ||
                        $_1("title").text().trim() ||
                        "Unknown";
                    image = $_1("div.wp-slider-container img").first().attr("src") ||
                        $_1("meta[property='og:image']").attr("content") ||
                        $_1("meta[name='twitter:image']").attr("content") ||
                        "";
                    if (!image || !image.startsWith("http")) {
                        image = new URL(image || "/placeholder.png", link).href;
                    }
                    synopsis_1 = "";
                    $_1("p").each(function (_, el) {
                        var text = $_1(el).text().trim();
                        if (text &&
                            text.length > 40 &&
                            !text.toLowerCase().includes("download") &&
                            !text.toLowerCase().includes("quality")) {
                            synopsis_1 = text;
                            return false;
                        }
                    });
                    if (!synopsis_1) {
                        synopsis_1 =
                            $_1("meta[property='og:description']").attr("content") ||
                                $_1("meta[name='description']").attr("content") ||
                                "";
                    }
                    tags = [];
                    if (res.data.toLowerCase().includes("action"))
                        tags.push("Action");
                    if (res.data.toLowerCase().includes("drama"))
                        tags.push("Drama");
                    if (res.data.toLowerCase().includes("romance"))
                        tags.push("Romance");
                    if (res.data.toLowerCase().includes("thriller"))
                        tags.push("Thriller");
                    cast_1 = [];
                    $_1("p").each(function (_, el) {
                        var text = $_1(el).text().trim();
                        if (/starring|cast/i.test(text)) {
                            text.split(",").forEach(function (name) { return cast_1.push(name.trim()); });
                        }
                    });
                    rating = ((_d = $_1("p")
                        .text()
                        .match(/IMDb Rating[:\s]*([0-9.]+)/i)) === null || _d === void 0 ? void 0 : _d[1]) || "";
                    if (rating && !rating.includes("/"))
                        rating = rating + "/10";
                    imdbLink = $_1("p a[href*='imdb.com']").attr("href") || "";
                    imdbId = imdbLink && imdbLink.includes("/tt")
                        ? "tt" + imdbLink.split("/tt")[1].split("/")[0]
                        : "";
                    linkList_1 = [];
                    isSeries = $_1(".download-options-grid").length > 0;
                    if (isSeries) {
                        // --- Series: loop through each download-card
                        $_1(".download-card").each(function (_, card) {
                            var card$ = $_1(card);
                            var quality = card$.find(".download-quality-text").text().trim();
                            var size = card$.find(".download-size-info").text().trim() || "";
                            var href = card$.find("a.tabs-download-button").attr("href") || "";
                            if (href) {
                                var titleText = "Download ".concat(quality, " ").concat(size).trim();
                                linkList_1.push({
                                    title: titleText,
                                    episodesLink: href,
                                    quality: quality || "AUTO",
                                    directLinks: [
                                        {
                                            link: href,
                                            title: titleText,
                                            type: "series",
                                        },
                                    ],
                                });
                            }
                        });
                    }
                    else {
                        // --- Movie: same as before
                        $_1("a.modern-download-button").each(function (_, a) {
                            var parent = $_1(a).closest(".modern-option-card");
                            var quality = parent.find(".modern-badge").text().trim() || "AUTO";
                            var href = $_1(a).attr("href") || "";
                            var titleText = "Download ".concat(quality);
                            if (href) {
                                linkList_1.push({
                                    title: titleText,
                                    episodesLink: href,
                                    quality: quality,
                                    directLinks: [
                                        {
                                            link: href,
                                            title: titleText,
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
                            type: isSeries ? "series" : "movie",
                            tags: tags,
                            cast: cast_1,
                            rating: rating,
                            linkList: linkList_1,
                        }];
                case 4:
                    err_1 = _e.sent();
                    console.error("KMMOVIES getMeta error:", err_1);
                    return [2 /*return*/, {
                            title: "",
                            synopsis: "",
                            image: "https://via.placeholder.com/300x450",
                            imdbId: "",
                            type: "movie",
                            tags: [],
                            cast: [],
                            rating: "",
                            linkList: [],
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
};
exports.getMeta = getMeta;
