"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gdFlixExtracter = gdFlixExtracter;
var axios_1 = __importDefault(require("axios"));
var cheerio = __importStar(require("cheerio"));
var headers_1 = require("./headers");
function gdFlixExtracter(link, signal) {
    return __awaiter(this, void 0, void 0, function () {
        var streamLinks, res, data, $drive, newLink, newRes, baseUrl, resumeDrive, resumeBotRes, resumeBotToken, resumeBotBody, resumeBotPath, resumeBotBaseUrl, resumeBotDownload, resumeBotDownloadData, url, resumeDriveRes, resumeDriveHtml, $resumeDrive, resumeLink, err_1, seed, newLinkRes, newLink, instantToken, InstantFromData, videoSeedUrl, instantLinkRes, instantLinkData, instantLink, err_2, error_1;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    _j.trys.push([0, 19, , 20]);
                    streamLinks = [];
                    return [4 /*yield*/, (0, axios_1.default)("".concat(link), { headers: headers_1.headers, signal: signal })];
                case 1:
                    res = _j.sent();
                    console.log('gdFlixExtracter', link);
                    data = res.data;
                    $drive = cheerio.load(data);
                    if (!((_a = $drive('body').attr('onload')) === null || _a === void 0 ? void 0 : _a.includes('location.replace'))) return [3 /*break*/, 3];
                    newLink = (_d = (_c = (_b = $drive('body')
                        .attr('onload')) === null || _b === void 0 ? void 0 : _b.split("location.replace('")) === null || _c === void 0 ? void 0 : _c[1].split("'")) === null || _d === void 0 ? void 0 : _d[0];
                    console.log('newLink', newLink);
                    if (!newLink) return [3 /*break*/, 3];
                    return [4 /*yield*/, axios_1.default.get(newLink, { headers: headers_1.headers, signal: signal })];
                case 2:
                    newRes = _j.sent();
                    $drive = cheerio.load(newRes.data);
                    _j.label = 3;
                case 3:
                    _j.trys.push([3, 10, , 11]);
                    baseUrl = link.split('/').slice(0, 3).join('/');
                    resumeDrive = $drive('.btn-secondary').attr('href') || '';
                    console.log('resumeDrive', resumeDrive);
                    if (!resumeDrive.includes('indexbot')) return [3 /*break*/, 7];
                    return [4 /*yield*/, axios_1.default.get(resumeDrive, { headers: headers_1.headers })];
                case 4:
                    resumeBotRes = _j.sent();
                    resumeBotToken = resumeBotRes.data.match(/formData\.append\('token', '([a-f0-9]+)'\)/)[1];
                    resumeBotBody = new FormData();
                    resumeBotBody.append('token', resumeBotToken);
                    resumeBotPath = resumeBotRes.data.match(/fetch\('\/download\?id=([a-zA-Z0-9\/+]+)'/)[1];
                    resumeBotBaseUrl = resumeDrive.split('/download')[0];
                    return [4 /*yield*/, fetch(resumeBotBaseUrl + '/download?id=' + resumeBotPath, {
                            method: 'POST',
                            body: resumeBotBody,
                            headers: {
                                Referer: resumeDrive,
                                Cookie: 'PHPSESSID=7e9658ce7c805dab5bbcea9046f7f308',
                            },
                        })];
                case 5:
                    resumeBotDownload = _j.sent();
                    return [4 /*yield*/, resumeBotDownload.json()];
                case 6:
                    resumeBotDownloadData = _j.sent();
                    console.log('resumeBotDownloadData', resumeBotDownloadData.url);
                    streamLinks.push({
                        server: 'ResumeBot',
                        link: resumeBotDownloadData.url,
                        type: 'mkv',
                    });
                    return [3 /*break*/, 9];
                case 7:
                    url = baseUrl + resumeDrive;
                    return [4 /*yield*/, axios_1.default.get(url, { headers: headers_1.headers })];
                case 8:
                    resumeDriveRes = _j.sent();
                    resumeDriveHtml = resumeDriveRes.data;
                    $resumeDrive = cheerio.load(resumeDriveHtml);
                    resumeLink = $resumeDrive('.btn-success').attr('href');
                    //   console.log('resumeLink', resumeLink);
                    if (resumeLink) {
                        streamLinks.push({
                            server: 'ResumeCloud',
                            link: resumeLink,
                            type: 'mkv',
                        });
                    }
                    _j.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    err_1 = _j.sent();
                    console.log('Resume link not found');
                    return [3 /*break*/, 11];
                case 11:
                    _j.trys.push([11, 17, , 18]);
                    seed = $drive('.btn-danger').attr('href') || '';
                    console.log('seed', seed);
                    if (!!seed.includes('?url=')) return [3 /*break*/, 13];
                    return [4 /*yield*/, axios_1.default.head(seed, { headers: headers_1.headers, signal: signal })];
                case 12:
                    newLinkRes = _j.sent();
                    console.log('newLinkRes', (_e = newLinkRes.request) === null || _e === void 0 ? void 0 : _e.responseURL);
                    newLink = ((_h = (_g = (_f = newLinkRes.request) === null || _f === void 0 ? void 0 : _f.responseURL) === null || _g === void 0 ? void 0 : _g.split('?url=')) === null || _h === void 0 ? void 0 : _h[1]) || seed;
                    streamLinks.push({ server: 'G-Drive', link: newLink, type: 'mkv' });
                    return [3 /*break*/, 16];
                case 13:
                    instantToken = seed.split('=')[1];
                    InstantFromData = new FormData();
                    InstantFromData.append('keys', instantToken);
                    videoSeedUrl = seed.split('/').slice(0, 3).join('/') + '/api';
                    return [4 /*yield*/, fetch(videoSeedUrl, {
                            method: 'POST',
                            body: InstantFromData,
                            headers: {
                                'x-token': videoSeedUrl,
                            },
                        })];
                case 14:
                    instantLinkRes = _j.sent();
                    return [4 /*yield*/, instantLinkRes.json()];
                case 15:
                    instantLinkData = _j.sent();
                    //   console.log('instantLinkData', instantLinkData);
                    if (instantLinkData.error === false) {
                        instantLink = instantLinkData.url;
                        streamLinks.push({
                            server: 'Gdrive-Instant',
                            link: instantLink,
                            type: 'mkv',
                        });
                    }
                    else {
                        console.log('Instant link not found', instantLinkData);
                    }
                    _j.label = 16;
                case 16: return [3 /*break*/, 18];
                case 17:
                    err_2 = _j.sent();
                    console.log('Instant link not found', err_2);
                    return [3 /*break*/, 18];
                case 18: return [2 /*return*/, streamLinks];
                case 19:
                    error_1 = _j.sent();
                    console.log('gdflix error: ', error_1);
                    return [2 /*return*/, []];
                case 20: return [2 /*return*/];
            }
        });
    });
}
