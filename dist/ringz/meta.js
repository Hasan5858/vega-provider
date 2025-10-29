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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
// Helper function to check if URL is a Cloudflare R2 URL
var isR2Url = function (url) {
    if (!url || typeof url !== 'string')
        return false;
    return (url.includes(".r2.dev") ||
        !!url.match(/https?:\/\/pub-[a-z0-9-]+\.dev/i) ||
        !!url.match(/https?:\/\/pub-[a-z0-9-]+\.r2\.dev/i));
};
// Helper to check if URL is pixeldrain (prioritize - it works!)
var isPixeldrainUrl = function (url) {
    if (!url || typeof url !== 'string')
        return false;
    return url.includes("pixeldrain.dev");
};
// Sort directLinks to prioritize working servers
// Priority: pixeldrain > non-R2 URLs > R2 URLs
var sortLinksByPriority = function (links) {
    if (!links || !Array.isArray(links))
        return links;
    return __spreadArray([], __read(links), false).sort(function (a, b) {
        try {
            var aData = JSON.parse(a.link);
            var bData = JSON.parse(b.link);
            var aUrl = (aData === null || aData === void 0 ? void 0 : aData.url) || '';
            var bUrl = (bData === null || bData === void 0 ? void 0 : bData.url) || '';
            var aIsPixeldrain = isPixeldrainUrl(aUrl);
            var bIsPixeldrain = isPixeldrainUrl(bUrl);
            var aIsR2 = isR2Url(aUrl);
            var bIsR2 = isR2Url(bUrl);
            // Pixeldrain URLs get highest priority
            if (aIsPixeldrain && !bIsPixeldrain)
                return -1;
            if (!aIsPixeldrain && bIsPixeldrain)
                return 1;
            // Non-R2 URLs come before R2 URLs
            if (aIsR2 === bIsR2)
                return 0;
            return aIsR2 ? 1 : -1;
        }
        catch (_a) {
            return 0;
        }
    });
};
var getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var dataJson_1, title, image, tags, type, linkList_1, directLinks_1;
        var _c, _d;
        var data = _b.link;
        return __generator(this, function (_e) {
            try {
                dataJson_1 = JSON.parse(data);
                title = (dataJson_1 === null || dataJson_1 === void 0 ? void 0 : dataJson_1.kn) || (dataJson_1 === null || dataJson_1 === void 0 ? void 0 : dataJson_1.mn);
                image = (dataJson_1 === null || dataJson_1 === void 0 ? void 0 : dataJson_1.IH) || (dataJson_1 === null || dataJson_1 === void 0 ? void 0 : dataJson_1.IV);
                tags = dataJson_1 === null || dataJson_1 === void 0 ? void 0 : dataJson_1.gn.split(",").slice(0, 3).map(function (tag) { return tag.trim(); });
                type = (dataJson_1 === null || dataJson_1 === void 0 ? void 0 : dataJson_1.cg) === "webSeries" ? "series" : "movie";
                linkList_1 = [];
                if ((dataJson_1 === null || dataJson_1 === void 0 ? void 0 : dataJson_1.cg) === "webSeries") {
                    (_c = ["1", "2", "3", "4"]) === null || _c === void 0 ? void 0 : _c.forEach(function (item) {
                        var _a;
                        var directLinks = [];
                        if (typeof (dataJson_1 === null || dataJson_1 === void 0 ? void 0 : dataJson_1["eServer" + item]) === "object" &&
                            ((_a = Object === null || Object === void 0 ? void 0 : Object.keys(dataJson_1 === null || dataJson_1 === void 0 ? void 0 : dataJson_1["eServer" + item])) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                            Object.keys(dataJson_1 === null || dataJson_1 === void 0 ? void 0 : dataJson_1["eServer" + item]).forEach(function (key) {
                                directLinks.push({
                                    title: "Episode " + key,
                                    link: JSON.stringify({
                                        url: dataJson_1 === null || dataJson_1 === void 0 ? void 0 : dataJson_1["eServer" + item][key],
                                        server: "Server " + item,
                                    }),
                                });
                            });
                            linkList_1.push({
                                title: (dataJson_1 === null || dataJson_1 === void 0 ? void 0 : dataJson_1.pn) + " (Server " + item + ")",
                                directLinks: sortLinksByPriority(directLinks),
                            });
                        }
                    });
                }
                else {
                    directLinks_1 = [];
                    (_d = ["1", "2", "3", "4"]) === null || _d === void 0 ? void 0 : _d.forEach(function (item) {
                        // Fix: Use correct server URL for each item (was using s1 for all)
                        if (dataJson_1 === null || dataJson_1 === void 0 ? void 0 : dataJson_1["s" + item]) {
                            directLinks_1.push({
                                title: "Server " + item + " (HD)",
                                link: JSON.stringify({
                                    url: dataJson_1 === null || dataJson_1 === void 0 ? void 0 : dataJson_1["s" + item],
                                    server: "Server " + item,
                                }),
                            });
                        }
                        if (dataJson_1 === null || dataJson_1 === void 0 ? void 0 : dataJson_1["4s" + item]) {
                            directLinks_1.push({
                                title: "Server " + item + " (480p)",
                                link: JSON.stringify({
                                    url: dataJson_1 === null || dataJson_1 === void 0 ? void 0 : dataJson_1["4s" + item],
                                    server: "Server " + item,
                                }),
                            });
                        }
                    });
                    linkList_1.push({
                        title: dataJson_1 === null || dataJson_1 === void 0 ? void 0 : dataJson_1.pn,
                        directLinks: sortLinksByPriority(directLinks_1),
                    });
                }
                return [2 /*return*/, {
                        title: title,
                        image: image,
                        imdbId: "",
                        synopsis: "",
                        type: type,
                        linkList: linkList_1,
                        tags: tags,
                    }];
            }
            catch (err) {
                return [2 /*return*/, {
                        title: "",
                        image: "",
                        imdbId: "",
                        synopsis: "",
                        type: "movie",
                        linkList: [],
                        tags: [],
                    }];
            }
            return [2 /*return*/];
        });
    });
};
exports.getMeta = getMeta;
