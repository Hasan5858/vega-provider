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
        var axios, cheerio, url, res, data, $_1, container, imdbId, title, type, synopsis, image, links_1, directLink_1, err_1;
        var _c;
        var link = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    url = link;
                    return [4 /*yield*/, axios.get(url)];
                case 1:
                    res = _d.sent();
                    data = res.data;
                    $_1 = cheerio.load(data);
                    container = $_1(".yQ8hqd.ksSzJd.LoQAYe").html()
                        ? $_1(".yQ8hqd.ksSzJd.LoQAYe")
                        : $_1(".FxvUNb");
                    imdbId = ((_c = container
                        .find('a[href*="imdb.com/title/tt"]:not([href*="imdb.com/title/tt/"])')
                        .attr("href")) === null || _c === void 0 ? void 0 : _c.split("/")[4]) || "";
                    title = container
                        .find('li:contains("Name")')
                        .children()
                        .remove()
                        .end()
                        .text();
                    type = $_1(".yQ8hqd.ksSzJd.LoQAYe").html() ? "series" : "movie";
                    synopsis = container.find('li:contains("Stars")').text();
                    image = $_1('h4:contains("SCREENSHOTS")').next().find("img").attr("src") || "";
                    console.log("katGetInfo", title, synopsis, image, imdbId, type);
                    links_1 = [];
                    directLink_1 = [];
                    // direct links
                    $_1(".entry-content")
                        .find('p:contains("Episode")')
                        .each(function (i, element) {
                        var dlLink = $_1(element)
                            .nextAll("h3,h2")
                            .first()
                            .find('a:contains("1080"),a:contains("720"),a:contains("480")')
                            .attr("href") || "";
                        var dlTitle = $_1(element).find("span").text();
                        if (link.trim().length > 0 && dlTitle.includes("Episode ")) {
                            directLink_1.push({
                                title: dlTitle,
                                link: dlLink,
                            });
                        }
                    });
                    if (directLink_1.length > 0) {
                        links_1.push({
                            quality: "",
                            title: title,
                            directLinks: directLink_1,
                        });
                    }
                    $_1(".entry-content")
                        .find("pre")
                        .nextUntil("div")
                        .filter("h2")
                        .each(function (i, element) {
                        var _a;
                        var link = $_1(element).find("a").attr("href");
                        var quality = ((_a = $_1(element)
                            .text()
                            .match(/\b(480p|720p|1080p|2160p)\b/i)) === null || _a === void 0 ? void 0 : _a[0]) || "";
                        var title = $_1(element).text();
                        if (link && title.includes("")) {
                            links_1.push({
                                quality: quality,
                                title: title,
                                episodesLink: link,
                            });
                        }
                    });
                    if (links_1.length === 0 && type === "movie") {
                        $_1(".entry-content")
                            .find('h2:contains("DOWNLOAD"),h3:contains("DOWNLOAD")')
                            .nextUntil("pre,div")
                            .filter("h2")
                            .each(function (i, element) {
                            var _a;
                            var link = $_1(element).find("a").attr("href");
                            var quality = ((_a = $_1(element)
                                .text()
                                .match(/\b(480p|720p|1080p|2160p)\b/i)) === null || _a === void 0 ? void 0 : _a[0]) || "";
                            var title = $_1(element).text();
                            if (link && !title.includes("Online")) {
                                links_1.push({
                                    quality: quality,
                                    title: title,
                                    directLinks: [{ link: link, title: title, type: "movie" }],
                                });
                            }
                        });
                    }
                    // console.log('drive meta', title, synopsis, image, imdbId, type, links);
                    return [2 /*return*/, {
                            title: title,
                            synopsis: synopsis,
                            image: image,
                            imdbId: imdbId,
                            type: type,
                            linkList: links_1,
                        }];
                case 2:
                    err_1 = _d.sent();
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
