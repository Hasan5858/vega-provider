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
exports.scrapeEpisodePage = exports.getMeta = void 0;
var headers = {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Cache-Control": "no-store",
    "Accept-Language": "en-US,en;q=0.9",
    DNT: "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};
// --- getMeta using Promise ---
var getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio;
        var link = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            axios = providerContext.axios, cheerio = providerContext.cheerio;
            return [2 /*return*/, axios
                    .get(link, { headers: headers })
                    .then(function (response) {
                    var _a;
                    var $ = cheerio.load(response.data);
                    var infoContainer = $(".entry-content,.post-inner");
                    var title = $("h1.entry-title").text().trim() ||
                        $("h2.entry-title").text().trim() ||
                        "";
                    var imdbMatch = (_a = infoContainer.html()) === null || _a === void 0 ? void 0 : _a.match(/tt\d+/);
                    var imdbId = imdbMatch ? imdbMatch[0] : "";
                    var synopsis = infoContainer
                        .find("h3:contains('SYNOPSIS'), h3:contains('synopsis')")
                        .next("p")
                        .text()
                        .trim() || "";
                    var image = infoContainer.find("img").first().attr("src") || "";
                    if (image.startsWith("//"))
                        image = "https:" + image;
                    var type = /Season \d+/i.test(infoContainer.text())
                        ? "series"
                        : "movie";
                    var linkList = [];
                    if (type === "series") {
                        // Single Episode Links
                        infoContainer.find("h2 a").each(function (_, el) {
                            var _a;
                            var el$ = $(el);
                            var href = (_a = el$.attr("href")) === null || _a === void 0 ? void 0 : _a.trim();
                            var linkText = el$.text().trim();
                            if (href && linkText.includes("Single Episode")) {
                                linkList.push({
                                    title: linkText,
                                    episodesLink: href,
                                    directLinks: [],
                                });
                            }
                        });
                    }
                    else {
                        // Movies - Extract only quality links, filter out irrelevant ones
                        infoContainer.find("a[href]").each(function (_, aEl) {
                            var _a;
                            var el$ = $(aEl);
                            var href = ((_a = el$.attr("href")) === null || _a === void 0 ? void 0 : _a.trim()) || "";
                            if (!href)
                                return;
                            var btnText = el$.text().trim() || "Download";
                            // Filter: Only include quality-related links, exclude irrelevant options
                            var isQualityLink = /(\d+p|hd|sd|4k|1080|720|480|360|240|links?|download|watch|stream)/i.test(btnText) ||
                                /(mb|gb|tb)/i.test(btnText);
                            var isIrrelevant = /(imdb|rating|score|\d+\.\d+\/10)/i.test(btnText) ||
                                /^(hindi|english|tamil|telugu|bengali|korean|turkish|urdu)$/i.test(btnText) ||
                                /(share|telegram|whatsapp|facebook|twitter|instagram)/i.test(btnText) ||
                                /(how to download|click to|open in new window|disclaimer)/i.test(btnText) ||
                                btnText.length < 3 ||
                                btnText === "Download"; // Generic download without quality info
                            // Only add if it looks like a quality option and isn't irrelevant
                            if (isQualityLink && !isIrrelevant) {
                                linkList.push({
                                    title: btnText,
                                    directLinks: [{ title: btnText, link: href, type: "movie" }],
                                    episodesLink: "",
                                });
                            }
                        });
                    }
                    return { title: title, synopsis: synopsis, image: image, imdbId: imdbId, type: type, linkList: linkList };
                })
                    .catch(function (err) {
                    console.error("getMeta error:", err);
                    return {
                        title: "",
                        synopsis: "",
                        image: "",
                        imdbId: "",
                        type: "movie",
                        linkList: [],
                    };
                })];
        });
    });
};
exports.getMeta = getMeta;
// --- scrapeEpisodePage using Promise ---
var scrapeEpisodePage = function (_a) {
    var link = _a.link, providerContext = _a.providerContext;
    var axios = providerContext.axios, cheerio = providerContext.cheerio;
    var result = [];
    return axios
        .get(link, { headers: headers })
        .then(function (response) {
        var $ = cheerio.load(response.data);
        $(".entry-content,.post-inner")
            .find("h3 a")
            .each(function (_, el) {
            var _a;
            var el$ = $(el);
            var href = (_a = el$.attr("href")) === null || _a === void 0 ? void 0 : _a.trim();
            var btnText = el$.text().trim() || "Download";
            if (href)
                result.push({ title: btnText, link: href, type: "series" });
        });
        return result;
    })
        .catch(function (err) {
        console.error("scrapeEpisodePage error:", err);
        return result;
    });
};
exports.scrapeEpisodePage = scrapeEpisodePage;
