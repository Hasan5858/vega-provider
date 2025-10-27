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
var getMeta = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var axios, cheerio, url, baseUrl, response, $_1, infoContainer, heading, imdbId, type, titleRegex, title, synopsisNode, synopsis, image, hr, list, links_1, error_1;
    var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    var link = _b.link, providerContext = _b.providerContext;
    return __generator(this, function (_x) {
        switch (_x.label) {
            case 0:
                _x.trys.push([0, 2, , 3]);
                axios = providerContext.axios, cheerio = providerContext.cheerio;
                url = link;
                console.log("url", url);
                baseUrl = url.split("/").slice(0, 3).join("/");
                return [4 /*yield*/, axios.get(url, {
                        headers: __assign(__assign({}, headers), { Referer: baseUrl }),
                    })];
            case 1:
                response = _x.sent();
                $_1 = cheerio.load(response.data);
                infoContainer = $_1(".entry-content,.post-inner");
                heading = infoContainer === null || infoContainer === void 0 ? void 0 : infoContainer.find("h3");
                imdbId = 
                //@ts-ignore
                ((_h = (_g = (_f = (_e = (_d = (_c = heading === null || heading === void 0 ? void 0 : heading.next("p")) === null || _c === void 0 ? void 0 : _c.find("a")) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.attribs) === null || _f === void 0 ? void 0 : _f.href) === null || _g === void 0 ? void 0 : _g.match(/tt\d+/g)) === null || _h === void 0 ? void 0 : _h[0]) ||
                    ((_j = infoContainer.text().match(/tt\d+/g)) === null || _j === void 0 ? void 0 : _j[0]) ||
                    "";
                type = ((_l = (_k = heading === null || heading === void 0 ? void 0 : heading.next("p")) === null || _k === void 0 ? void 0 : _k.text()) === null || _l === void 0 ? void 0 : _l.includes("Series Name"))
                    ? "series"
                    : "movie";
                titleRegex = /Name: (.+)/;
                title = ((_p = (_o = (_m = heading === null || heading === void 0 ? void 0 : heading.next("p")) === null || _m === void 0 ? void 0 : _m.text()) === null || _o === void 0 ? void 0 : _o.match(titleRegex)) === null || _p === void 0 ? void 0 : _p[1]) || "";
                synopsisNode = (_u = (_t = (_s = (_r = (_q = infoContainer === null || infoContainer === void 0 ? void 0 : infoContainer.find("p")) === null || _q === void 0 ? void 0 : _q.next("h3,h4")) === null || _r === void 0 ? void 0 : _r.next("p")) === null || _s === void 0 ? void 0 : _s[0]) === null || _t === void 0 ? void 0 : _t.children) === null || _u === void 0 ? void 0 : _u[0];
                synopsis = synopsisNode && "data" in synopsisNode ? synopsisNode.data : "";
                image = ((_v = infoContainer === null || infoContainer === void 0 ? void 0 : infoContainer.find("img[data-lazy-src]")) === null || _v === void 0 ? void 0 : _v.attr("data-lazy-src")) || "";
                if (image.startsWith("//")) {
                    image = "https:" + image;
                }
                // console.log(image);
                console.log({ title: title, synopsis: synopsis, image: image, imdbId: imdbId, type: type });
                hr = (_w = infoContainer === null || infoContainer === void 0 ? void 0 : infoContainer.first()) === null || _w === void 0 ? void 0 : _w.find("hr");
                list = hr === null || hr === void 0 ? void 0 : hr.nextUntil("hr");
                links_1 = [];
                list.each(function (index, element) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                    element = $_1(element);
                    // title
                    var title = (element === null || element === void 0 ? void 0 : element.text()) || "";
                    var quality = ((_a = element === null || element === void 0 ? void 0 : element.text().match(/\d+p\b/)) === null || _a === void 0 ? void 0 : _a[0]) || "";
                    // console.log(title);
                    // movieLinks
                    var movieLinks = (element === null || element === void 0 ? void 0 : element.next().find(".dwd-button").text().toLowerCase().includes("download"))
                        ? (_c = (_b = element === null || element === void 0 ? void 0 : element.next().find(".dwd-button")) === null || _b === void 0 ? void 0 : _b.parent()) === null || _c === void 0 ? void 0 : _c.attr("href")
                        : "";
                    // episode links
                    var vcloudLinks = (_e = (_d = element === null || element === void 0 ? void 0 : element.next().find(".btn-outline[style='background:linear-gradient(135deg,#ed0b0b,#f2d152); color: white;'],.btn-outline[style='background:linear-gradient(135deg,#ed0b0b,#f2d152); color: #fdf8f2;'],.btn-outline[style='background:linear-gradient(135deg,#ed0b0b,#f2d152);color: white']")) === null || _d === void 0 ? void 0 : _d.parent()) === null || _e === void 0 ? void 0 : _e.attr("href");
                    var episodesLink = (vcloudLinks
                        ? vcloudLinks
                        : (element === null || element === void 0 ? void 0 : element.next().find(".dwd-button").text().toLowerCase().includes("episode"))
                            ? (_g = (_f = element === null || element === void 0 ? void 0 : element.next().find(".dwd-button")) === null || _f === void 0 ? void 0 : _f.parent()) === null || _g === void 0 ? void 0 : _g.attr("href")
                            : "") ||
                        ((_j = (_h = element === null || element === void 0 ? void 0 : element.next().find(".btn-outline[style='background:linear-gradient(135deg,#0ebac3,#09d261); color: white;']")) === null || _h === void 0 ? void 0 : _h.parent()) === null || _j === void 0 ? void 0 : _j.attr("href"));
                    if (movieLinks || episodesLink) {
                        links_1.push({
                            title: title,
                            directLinks: movieLinks
                                ? [{ title: "Movie", link: movieLinks, type: "movie" }]
                                : [],
                            episodesLink: episodesLink,
                            quality: quality,
                        });
                    }
                });
                // console.log(links);
                return [2 /*return*/, {
                        title: title,
                        synopsis: synopsis,
                        image: image,
                        imdbId: imdbId,
                        type: type,
                        linkList: links_1,
                    }];
            case 2:
                error_1 = _x.sent();
                console.log("getInfo error");
                console.error(error_1);
                // ToastAndroid.show('No response', ToastAndroid.SHORT);
                return [2 /*return*/, {
                        title: "",
                        synopsis: "",
                        image: "",
                        imdbId: "",
                        type: "",
                        linkList: [],
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMeta = getMeta;
