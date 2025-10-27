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
var getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var cheerio, url, res, data, $_1, meta, episodesList_1, err_1;
        var link = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    cheerio = providerContext.cheerio;
                    url = link;
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    res = _c.sent();
                    return [4 /*yield*/, res.text()];
                case 2:
                    data = _c.sent();
                    $_1 = cheerio.load(data);
                    meta = {
                        title: $_1('.c_h2:contains("Title(s):")')
                            .text()
                            .replace("Title(s):", "")
                            .trim()
                            .split("\n")[0],
                        synopsis: $_1('.c_h2b:contains("Summary:"),.c_h2:contains("Summary:")')
                            .text()
                            .replace("Summary:", "")
                            .trim(),
                        image: $_1(".a_img").attr("src") || "",
                        imdbId: "",
                        type: "series",
                    };
                    episodesList_1 = [];
                    $_1(".episode").map(function (i, element) {
                        var link = "https://www.tokyoinsider.com" + $_1(element).find("a").attr("href") ||
                            $_1(".download-link").attr("href");
                        var title = $_1(element).find("a").find("em").text() +
                            " " +
                            $_1(element).find("a").find("strong").text();
                        if (!title.trim()) {
                            title = $_1(".download-link").text();
                        }
                        if (link && title.trim()) {
                            episodesList_1.push({ title: title, link: link });
                        }
                    });
                    return [2 /*return*/, __assign(__assign({}, meta), { linkList: [
                                {
                                    title: meta.title,
                                    directLinks: episodesList_1,
                                },
                            ] })];
                case 3:
                    err_1 = _c.sent();
                    return [2 /*return*/, {
                            title: "",
                            synopsis: "",
                            image: "",
                            imdbId: "",
                            type: "series",
                            linkList: [],
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.getMeta = getMeta;
