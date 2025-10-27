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
exports.getEpisodes = void 0;
exports.extractKmhdLink = extractKmhdLink;
var getEpisodes = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio, episodesLink, urlParts, baseUrl_1, res_1, data, $_1, links_1, epIds, res, episodeData, $_2, links, err_1;
        var url = _b.url, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    episodesLink = [];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, , 8]);
                    if (!url.includes("gdflix")) return [3 /*break*/, 3];
                    urlParts = url.split("/pack");
                    if (!urlParts || urlParts.length === 0) {
                        console.error("Invalid gdflix URL structure:", url);
                        return [2 /*return*/, []];
                    }
                    baseUrl_1 = urlParts[0];
                    return [4 /*yield*/, axios.get(url)];
                case 2:
                    res_1 = _c.sent();
                    data = res_1.data;
                    $_1 = cheerio.load(data);
                    links_1 = $_1(".list-group-item");
                    links_1 === null || links_1 === void 0 ? void 0 : links_1.map(function (i, link) {
                        episodesLink.push({
                            title: $_1(link).text() || "",
                            link: baseUrl_1 + $_1(link).find("a").attr("href") || "",
                        });
                    });
                    if (episodesLink.length > 0) {
                        return [2 /*return*/, episodesLink];
                    }
                    _c.label = 3;
                case 3:
                    if (!url.includes("/pack")) return [3 /*break*/, 5];
                    return [4 /*yield*/, extractKmhdEpisodes(url, providerContext)];
                case 4:
                    epIds = _c.sent();
                    epIds === null || epIds === void 0 ? void 0 : epIds.forEach(function (id, index) {
                        episodesLink.push({
                            title: "Episode ".concat(index + 1),
                            link: url.split("/pack")[0] + "/file/" + id,
                        });
                    });
                    _c.label = 5;
                case 5: return [4 /*yield*/, axios.get(url, {
                        headers: {
                            Cookie: "_ga_GNR438JY8N=GS1.1.1729446000.1.1729446000.0.0.0; _ga=GA1.1.372196696.1722150754; unlocked=true",
                        },
                    })];
                case 6:
                    res = _c.sent();
                    episodeData = res.data;
                    $_2 = cheerio.load(episodeData);
                    links = $_2(".autohyperlink");
                    links === null || links === void 0 ? void 0 : links.map(function (i, link) {
                        episodesLink.push({
                            title: $_2(link).parent().children().remove().end().text() || "",
                            link: $_2(link).attr("href") || "",
                        });
                    });
                    return [2 /*return*/, episodesLink];
                case 7:
                    err_1 = _c.sent();
                    console.error(err_1);
                    return [2 /*return*/, []];
                case 8: return [2 /*return*/];
            }
        });
    });
};
exports.getEpisodes = getEpisodes;
function extractKmhdLink(katlink, providerContext) {
    return __awaiter(this, void 0, void 0, function () {
        var axios, res, data, uploadLinksMatch, hubdriveId, linksMatch, hubdriveBaseUrl, finalLink, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    axios = providerContext.axios;
                    return [4 /*yield*/, axios.get(katlink)];
                case 1:
                    res = _a.sent();
                    data = res.data;
                    uploadLinksMatch = data.match(/upload_links:\s*{[^}]*?hubdrive_res:"([^"]+)"/);
                    if (!uploadLinksMatch || !uploadLinksMatch[1]) {
                        console.error("Failed to extract hubdrive_res ID from upload_links");
                        return [2 /*return*/, null];
                    }
                    hubdriveId = uploadLinksMatch[1];
                    linksMatch = data.match(/hubdrive_res:\s*{[^}]*?link:\s*"([^"]+)"/);
                    if (!linksMatch || !linksMatch[1]) {
                        console.error("Failed to extract hubdrive base URL from links");
                        return [2 /*return*/, null];
                    }
                    hubdriveBaseUrl = linksMatch[1];
                    finalLink = hubdriveBaseUrl + hubdriveId;
                    console.log("Extracted hubdrive link:", finalLink);
                    return [2 /*return*/, finalLink];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error in extractKmhdLink:", error_1.message);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function extractKmhdEpisodes(katlink, providerContext) {
    return __awaiter(this, void 0, void 0, function () {
        var axios, res, data, ids, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    axios = providerContext.axios;
                    return [4 /*yield*/, axios.get(katlink)];
                case 1:
                    res = _a.sent();
                    data = res.data;
                    ids = data.match(/[\w]+_[a-f0-9]{8}/g);
                    if (!ids || ids.length === 0) {
                        console.warn("No episodes found for katlink:", katlink);
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, ids];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error in extractKmhdEpisodes:", error_2.message);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
