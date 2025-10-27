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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hubcloudExtracter = hubcloudExtracter;
var axios_1 = __importDefault(require("axios"));
var cheerio = __importStar(require("cheerio"));
var headers_1 = require("./headers");
var decode = function (value) {
    if (value === undefined) {
        return '';
    }
    return atob(value.toString());
};
function hubcloudExtracter(link, signal) {
    return __awaiter(this, void 0, void 0, function () {
        var baseUrl, streamLinks, vLinkRes, vLinkText, $vLink, vLinkRedirect, vcloudLink, vcloudRes, $, _a, _b, linkClass, linkClass_1, linkClass_1_1, element, itm, link_1, token, baseUrl_1, newLinkRes, newLink, error_1, e_1_1, error_2;
        var e_1, _c;
        var _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    _j.trys.push([0, 15, , 16]);
                    console.log('hubcloudExtracter', link);
                    baseUrl = link.split('/').slice(0, 3).join('/');
                    streamLinks = [];
                    return [4 /*yield*/, (0, axios_1.default)("".concat(link), { headers: headers_1.headers, signal: signal })];
                case 1:
                    vLinkRes = _j.sent();
                    vLinkText = vLinkRes.data;
                    $vLink = cheerio.load(vLinkText);
                    vLinkRedirect = vLinkText.match(/var\s+url\s*=\s*'([^']+)';/) || [];
                    vcloudLink = decode((_e = (_d = vLinkRedirect[1]) === null || _d === void 0 ? void 0 : _d.split('r=')) === null || _e === void 0 ? void 0 : _e[1]) ||
                        vLinkRedirect[1] ||
                        $vLink('.fa-file-download.fa-lg').parent().attr('href') ||
                        link;
                    console.log('vcloudLink', vcloudLink);
                    console.log('vLinkText length:', vLinkText.length);
                    if (vcloudLink === null || vcloudLink === void 0 ? void 0 : vcloudLink.startsWith('/')) {
                        vcloudLink = "".concat(baseUrl).concat(vcloudLink);
                        console.log('New vcloudLink', vcloudLink);
                    }
                    return [4 /*yield*/, fetch(vcloudLink, {
                            headers: headers_1.headers,
                            signal: signal,
                            redirect: 'follow',
                        })];
                case 2:
                    vcloudRes = _j.sent();
                    _b = (_a = cheerio).load;
                    return [4 /*yield*/, vcloudRes.text()];
                case 3:
                    $ = _b.apply(_a, [_j.sent()]);
                    linkClass = $('.btn-success.btn-lg.h6,.btn-danger,.btn-secondary');
                    console.log('Found download buttons:', linkClass.length);
                    _j.label = 4;
                case 4:
                    _j.trys.push([4, 12, 13, 14]);
                    linkClass_1 = __values(linkClass), linkClass_1_1 = linkClass_1.next();
                    _j.label = 5;
                case 5:
                    if (!!linkClass_1_1.done) return [3 /*break*/, 11];
                    element = linkClass_1_1.value;
                    itm = $(element);
                    link_1 = itm.attr('href') || '';
                    console.log('Processing link:', (link_1 === null || link_1 === void 0 ? void 0 : link_1.substring(0, 60)) + '...');
                    if ((link_1 === null || link_1 === void 0 ? void 0 : link_1.includes('.dev')) && !(link_1 === null || link_1 === void 0 ? void 0 : link_1.includes('/?id='))) {
                        streamLinks.push({ server: 'Cf Worker', link: link_1, type: 'mkv' });
                    }
                    if (link_1 === null || link_1 === void 0 ? void 0 : link_1.includes('pixeld')) {
                        if (!(link_1 === null || link_1 === void 0 ? void 0 : link_1.includes('api'))) {
                            token = link_1.split('/').pop();
                            baseUrl_1 = link_1.split('/').slice(0, -2).join('/');
                            link_1 = "".concat(baseUrl_1, "/api/file/").concat(token, "?download");
                        }
                        streamLinks.push({ server: 'Pixeldrain', link: link_1, type: 'mkv' });
                    }
                    if (!((link_1 === null || link_1 === void 0 ? void 0 : link_1.includes('hubcloud')) || (link_1 === null || link_1 === void 0 ? void 0 : link_1.includes('/?id=')))) return [3 /*break*/, 9];
                    _j.label = 6;
                case 6:
                    _j.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, axios_1.default.head(link_1, { headers: headers_1.headers, signal: signal })];
                case 7:
                    newLinkRes = _j.sent();
                    newLink = ((_h = (_g = (_f = newLinkRes.request) === null || _f === void 0 ? void 0 : _f.responseURL) === null || _g === void 0 ? void 0 : _g.split('link=')) === null || _h === void 0 ? void 0 : _h[1]) || link_1;
                    streamLinks.push({ server: 'hubcloud', link: newLink, type: 'mkv' });
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _j.sent();
                    console.log('hubcloudExtracter error in hubcloud link: ', error_1);
                    return [3 /*break*/, 9];
                case 9:
                    if (link_1 === null || link_1 === void 0 ? void 0 : link_1.includes('cloudflarestorage')) {
                        streamLinks.push({ server: 'CfStorage', link: link_1, type: 'mkv' });
                    }
                    if (link_1 === null || link_1 === void 0 ? void 0 : link_1.includes('fastdl')) {
                        streamLinks.push({ server: 'FastDl', link: link_1, type: 'mkv' });
                    }
                    if (link_1.includes('hubcdn')) {
                        streamLinks.push({
                            server: 'HubCdn',
                            link: link_1,
                            type: 'mkv',
                        });
                    }
                    _j.label = 10;
                case 10:
                    linkClass_1_1 = linkClass_1.next();
                    return [3 /*break*/, 5];
                case 11: return [3 /*break*/, 14];
                case 12:
                    e_1_1 = _j.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 13:
                    try {
                        if (linkClass_1_1 && !linkClass_1_1.done && (_c = linkClass_1.return)) _c.call(linkClass_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 14:
                    console.log('streamLinks extracted:', streamLinks.length);
                    console.log('streamLinks', streamLinks);
                    return [2 /*return*/, streamLinks];
                case 15:
                    error_2 = _j.sent();
                    console.log('hubcloudExtracter error: ', error_2);
                    return [2 /*return*/, []];
                case 16: return [2 /*return*/];
            }
        });
    });
}
