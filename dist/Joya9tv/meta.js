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
exports.getMeta = void 0;
// Headers
var headers = {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Cache-Control": "no-store",
    "Accept-Language": "en-US,en;q=0.9",
    DNT: "1",
    "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    Cookie: "xla=s4t; _ga=GA1.1.1081149560.1756378968; _ga_BLZGKYN5PF=GS2.1.s1756378968$o1$g1$t1756378984$j44$l0$h0",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
};
var getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var cheerio, url, baseUrl, emptyResult, response, data, $_1, infoContainer, result_1, rawTitle_1, finalTitle, imdbMatch, image, links_1, downloadTable, err_1;
        var _c;
        var link = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    cheerio = providerContext.cheerio;
                    url = link;
                    baseUrl = url.split("/").slice(0, 3).join("/");
                    emptyResult = {
                        title: "",
                        synopsis: "",
                        image: "",
                        imdbId: "",
                        type: "movie",
                        linkList: [],
                    };
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url, {
                            headers: __assign(__assign({}, headers), { Referer: baseUrl }),
                        })];
                case 2:
                    response = _d.sent();
                    return [4 /*yield*/, response.text()];
                case 3:
                    data = _d.sent();
                    $_1 = cheerio.load(data);
                    infoContainer = $_1(".content.right").first();
                    result_1 = {
                        title: "",
                        synopsis: "",
                        image: "",
                        imdbId: "",
                        type: "movie",
                        linkList: [],
                    };
                    // --- Type determination (Based on content, the HTML is for a Series) ---
                    // Check for 'S' or 'Season' in the main heading
                    if (/S\d+|Season \d+|TV Series\/Shows/i.test(infoContainer.find("h1").text() + $_1(".sgeneros").text())) {
                        result_1.type = "series";
                    }
                    else {
                        result_1.type = "movie";
                    }
                    rawTitle_1 = $_1("h1").first().text().trim();
                    finalTitle = rawTitle_1
                        .replace(/ Download.*|\[Episode \d+ Added\]/g, "")
                        .trim();
                    // Extract base title before S19, (2025), etc.
                    finalTitle =
                        finalTitle.split(/\(2025\)| S\d+/i)[0].trim() || "Unknown Title";
                    result_1.title = finalTitle;
                    imdbMatch = (_c = infoContainer.html()) === null || _c === void 0 ? void 0 : _c.match(/tt\d+/);
                    result_1.imdbId = imdbMatch ? imdbMatch[0] : "";
                    image = infoContainer.find(".poster img[src]").first().attr("src") || "";
                    if (image.startsWith("//"))
                        image = "https:" + image;
                    // Check for "no-thumbnail" or "placeholder" in the filename
                    if (image.includes("no-thumbnail") || image.includes("placeholder"))
                        image = "";
                    result_1.image = image;
                    // --- Synopsis ---
                    // The synopsis is directly in the <div itemprop="description" class="wp-content"> inside #info
                    result_1.synopsis = $_1("#info .wp-content").text().trim() || "";
                    links_1 = [];
                    downloadTable = $_1("#download .links_table table tbody");
                    // The entire season/series batch links are in the table
                    downloadTable.find("tr").each(function (index, element) {
                        var _a;
                        var row = $_1(element);
                        var quality = row.find("strong.quality").text().trim();
                        // Get the size from the fourth <td> in the row
                        var size = row.find("td:nth-child(4)").text().trim();
                        var directLinkAnchor = row.find("td a").first();
                        var directLink = directLinkAnchor.attr("href");
                        var linkTitle = directLinkAnchor.text().trim();
                        if (quality && directLink) {
                            // FIX: Assert the type to satisfy the Link interface's literal type requirement
                            var assertedType = result_1.type;
                            // Assuming the table links are for the entire batch/season
                            var directLinks = [
                                {
                                    title: linkTitle || "Download Link",
                                    link: directLink,
                                    type: assertedType, // Use the asserted type
                                },
                            ];
                            // Combine title, quality, and size for the LinkList entry
                            var seasonMatch = (_a = rawTitle_1.match(/S(\d+)/)) === null || _a === void 0 ? void 0 : _a[1];
                            var fullTitle = "".concat(result_1.title);
                            if (seasonMatch)
                                fullTitle += " Season ".concat(seasonMatch);
                            fullTitle += " - ".concat(quality);
                            if (size)
                                fullTitle += " (".concat(size, ")"); // ADDED: Append size to the link title
                            links_1.push({
                                title: fullTitle,
                                quality: quality.replace(/[^0-9p]/g, ""), // Clean to just 480p, 720p, 1080p
                                // The direct link is to a page that lists all episodes, so it acts as the episodesLink
                                episodesLink: directLink,
                                directLinks: directLinks,
                            });
                        }
                    });
                    result_1.linkList = links_1;
                    return [2 /*return*/, result_1];
                case 4:
                    err_1 = _d.sent();
                    console.log("getMeta error:", err_1);
                    return [2 /*return*/, emptyResult];
                case 5: return [2 /*return*/];
            }
        });
    });
};
exports.getMeta = getMeta;
