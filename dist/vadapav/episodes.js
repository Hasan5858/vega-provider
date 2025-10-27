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
var getEpisodes = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var axios, cheerio, baseUrl_1, res, html, $_1, episodeLinks_1, err_1;
        var url = _b.url, providerContext = _b.providerContext;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    baseUrl_1 = url === null || url === void 0 ? void 0 : url.split("/").slice(0, 3).join("/");
                    return [4 /*yield*/, axios.get(url)];
                case 2:
                    res = _c.sent();
                    html = res.data;
                    $_1 = cheerio.load(html);
                    episodeLinks_1 = [];
                    $_1('.file-entry:not(:contains("Parent Directory"))').map(function (i, element) {
                        var _a, _b, _c, _d, _e, _f;
                        var link = $_1(element).attr("href");
                        if (link &&
                            (((_a = $_1(element).text()) === null || _a === void 0 ? void 0 : _a.includes(".mp4")) ||
                                ((_b = $_1(element).text()) === null || _b === void 0 ? void 0 : _b.includes(".mkv")))) {
                            episodeLinks_1.push({
                                title: ((_e = (_d = (_c = $_1(element).text()) === null || _c === void 0 ? void 0 : _c.match(/E\d+/)) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.replace("E", "Episode ")) ||
                                    i + 1 + ". " + ((_f = $_1(element).text()) === null || _f === void 0 ? void 0 : _f.replace(".mkv", "")),
                                link: baseUrl_1 + link,
                            });
                        }
                    });
                    return [2 /*return*/, episodeLinks_1];
                case 3:
                    err_1 = _c.sent();
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.getEpisodes = getEpisodes;
