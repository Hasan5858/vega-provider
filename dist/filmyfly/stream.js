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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
var getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var res, data, $_1, streams_1, elements, promises, err_1;
        var _this = this;
        var link = _b.link, signal = _b.signal, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, providerContext.axios.get(link, { signal: signal })];
                case 1:
                    res = _c.sent();
                    data = res.data;
                    $_1 = providerContext.cheerio.load(data);
                    streams_1 = [];
                    elements = $_1("a[href]:contains('Download'), .button2,.button1,.button3,.button4,.button").toArray();
                    promises = elements.map(function (element) { return __awaiter(_this, void 0, void 0, function () {
                        var title, elementLink, filesdlRes, filesdl$, downloadLinks, _loop_1, downloadLinks_1, downloadLinks_1_1, dlLink, e_1_1, filesdlErr_1, gdLinks, gofileId, gofileResult, alreadyAdded;
                        var e_1, _a;
                        var _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    title = $_1(element).text().trim();
                                    elementLink = $_1(element).attr("href");
                                    if (!title || !elementLink)
                                        return [2 /*return*/];
                                    // Skip unwanted links
                                    if (title.includes("Watch") ||
                                        title.includes("Login") ||
                                        title.includes("Signup") ||
                                        title.includes("Privacy") ||
                                        title.includes("DMCA") ||
                                        title.includes("Contact") ||
                                        title.includes("Linkmake") ||
                                        title.includes("Telegram")) {
                                        return [2 /*return*/];
                                    }
                                    if (!elementLink.includes("filesdl.site")) return [3 /*break*/, 13];
                                    _d.label = 1;
                                case 1:
                                    _d.trys.push([1, 11, , 12]);
                                    return [4 /*yield*/, providerContext.axios.get(elementLink, { signal: signal })];
                                case 2:
                                    filesdlRes = _d.sent();
                                    filesdl$ = providerContext.cheerio.load(filesdlRes.data);
                                    downloadLinks = filesdl$("a[href]").toArray();
                                    _loop_1 = function (dlLink) {
                                        var dlTitle, dlHref, gofileId, gofileResult, gdLinks, hubLinks;
                                        return __generator(this, function (_e) {
                                            switch (_e.label) {
                                                case 0:
                                                    dlTitle = filesdl$(dlLink).text().trim();
                                                    dlHref = filesdl$(dlLink).attr("href");
                                                    if (!dlHref || !dlTitle)
                                                        return [2 /*return*/, "continue"];
                                                    // Skip unwanted links
                                                    if (dlTitle.includes("Watch") ||
                                                        dlTitle.includes("Login") ||
                                                        dlTitle.includes("Signup") ||
                                                        dlTitle.includes("Telegram")) {
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    if (!dlHref.includes("gofile.io")) return [3 /*break*/, 3];
                                                    gofileId = (_b = dlHref.split("/d/")[1]) === null || _b === void 0 ? void 0 : _b.split("?")[0];
                                                    if (!gofileId) return [3 /*break*/, 2];
                                                    return [4 /*yield*/, providerContext.extractors.gofileExtracter(gofileId)];
                                                case 1:
                                                    gofileResult = _e.sent();
                                                    if (gofileResult.link) {
                                                        streams_1.push({
                                                            server: "".concat(title, " - ").concat(dlTitle),
                                                            link: gofileResult.link,
                                                            type: "mkv",
                                                        });
                                                    }
                                                    _e.label = 2;
                                                case 2: return [2 /*return*/, "continue"];
                                                case 3:
                                                    if (!dlHref.includes("gdflix")) return [3 /*break*/, 5];
                                                    return [4 /*yield*/, providerContext.extractors.gdFlixExtracter(dlHref, signal)];
                                                case 4:
                                                    gdLinks = _e.sent();
                                                    streams_1.push.apply(streams_1, __spreadArray([], __read(gdLinks.map(function (s) { return (__assign(__assign({}, s), { server: "".concat(title, " - ").concat(dlTitle) })); })), false));
                                                    return [2 /*return*/, "continue"];
                                                case 5:
                                                    if (!dlHref.includes("hubcloud")) return [3 /*break*/, 7];
                                                    return [4 /*yield*/, providerContext.extractors.hubcloudExtracter(dlHref, signal)];
                                                case 6:
                                                    hubLinks = _e.sent();
                                                    streams_1.push.apply(streams_1, __spreadArray([], __read(hubLinks.map(function (s) { return (__assign(__assign({}, s), { server: "".concat(title, " - ").concat(dlTitle) })); })), false));
                                                    return [2 /*return*/, "continue"];
                                                case 7:
                                                    // Handle direct video links (Fast Cloud and Ultra FastDL only)
                                                    // Skip Direct Download and Fast Cloud-02 (Cloudflare blocked)
                                                    if ((dlTitle.includes("Fast Cloud") && !dlTitle.includes("Fast Cloud-02")) ||
                                                        dlTitle.includes("Ultra FastDL")) {
                                                        // Check if link looks like a direct video URL
                                                        if (dlHref.includes(".mkv") ||
                                                            dlHref.includes(".mp4") ||
                                                            dlHref.includes(".m3u8") ||
                                                            dlHref.includes("awsstorage") ||
                                                            dlHref.includes("download") ||
                                                            dlHref.includes("filesd1.xyz")) {
                                                            streams_1.push({
                                                                server: "".concat(title, " - ").concat(dlTitle),
                                                                link: dlHref,
                                                                type: "mkv",
                                                            });
                                                        }
                                                    }
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _d.label = 3;
                                case 3:
                                    _d.trys.push([3, 8, 9, 10]);
                                    downloadLinks_1 = __values(downloadLinks), downloadLinks_1_1 = downloadLinks_1.next();
                                    _d.label = 4;
                                case 4:
                                    if (!!downloadLinks_1_1.done) return [3 /*break*/, 7];
                                    dlLink = downloadLinks_1_1.value;
                                    return [5 /*yield**/, _loop_1(dlLink)];
                                case 5:
                                    _d.sent();
                                    _d.label = 6;
                                case 6:
                                    downloadLinks_1_1 = downloadLinks_1.next();
                                    return [3 /*break*/, 4];
                                case 7: return [3 /*break*/, 10];
                                case 8:
                                    e_1_1 = _d.sent();
                                    e_1 = { error: e_1_1 };
                                    return [3 /*break*/, 10];
                                case 9:
                                    try {
                                        if (downloadLinks_1_1 && !downloadLinks_1_1.done && (_a = downloadLinks_1.return)) _a.call(downloadLinks_1);
                                    }
                                    finally { if (e_1) throw e_1.error; }
                                    return [7 /*endfinally*/];
                                case 10: return [3 /*break*/, 12];
                                case 11:
                                    filesdlErr_1 = _d.sent();
                                    console.error("Error extracting from filesdl:", filesdlErr_1);
                                    return [3 /*break*/, 12];
                                case 12: return [2 /*return*/];
                                case 13:
                                    if (!(title.includes("GDFLIX") && elementLink)) return [3 /*break*/, 15];
                                    return [4 /*yield*/, providerContext.extractors.gdFlixExtracter(elementLink, signal)];
                                case 14:
                                    gdLinks = _d.sent();
                                    streams_1.push.apply(streams_1, __spreadArray([], __read(gdLinks), false));
                                    return [2 /*return*/];
                                case 15:
                                    if (!elementLink.includes("gofile.io")) return [3 /*break*/, 18];
                                    gofileId = (_c = elementLink.split("/d/")[1]) === null || _c === void 0 ? void 0 : _c.split("?")[0];
                                    if (!gofileId) return [3 /*break*/, 17];
                                    return [4 /*yield*/, providerContext.extractors.gofileExtracter(gofileId)];
                                case 16:
                                    gofileResult = _d.sent();
                                    if (gofileResult.link) {
                                        streams_1.push({
                                            server: title,
                                            link: gofileResult.link,
                                            type: "mkv",
                                        });
                                    }
                                    _d.label = 17;
                                case 17: return [2 /*return*/];
                                case 18:
                                    alreadyAdded = streams_1.find(function (s) { return s.link === elementLink; });
                                    if (alreadyAdded)
                                        return [2 /*return*/];
                                    // Add the stream for other links
                                    streams_1.push({
                                        server: title,
                                        link: elementLink,
                                        type: "mkv",
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(promises)];
                case 2:
                    _c.sent();
                    return [2 /*return*/, streams_1];
                case 3:
                    err_1 = _c.sent();
                    console.error(err_1);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.getStream = getStream;
