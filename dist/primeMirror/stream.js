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
exports.getStream = void 0;
var getStream = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var getBaseUrl, providerValue, baseUrl_1, url, res, resJson, data, streamLinks_1, err_1;
    var id = _b.link, providerContext = _b.providerContext;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                getBaseUrl = providerContext.getBaseUrl;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 5, , 6]);
                providerValue = "primeMirror";
                return [4 /*yield*/, getBaseUrl("nfMirror")];
            case 2:
                baseUrl_1 = _c.sent();
                url = "https://netmirror.8man.dev/api/net-proxy?url=".concat(baseUrl_1).concat(providerValue === "netflixMirror"
                    ? "/mobile/playlist.php?id="
                    : "/pv/playlist.php?id=").concat(id, "&t=").concat(Math.round(new Date().getTime() / 1000));
                console.log("nfGetStream, url:", url);
                return [4 /*yield*/, fetch(url, {
                        credentials: "omit",
                    })];
            case 3:
                res = _c.sent();
                return [4 /*yield*/, res.json()];
            case 4:
                resJson = _c.sent();
                data = resJson === null || resJson === void 0 ? void 0 : resJson[0];
                streamLinks_1 = [];
                data === null || data === void 0 ? void 0 : data.sources.forEach(function (source) {
                    var _a;
                    streamLinks_1.push({
                        server: source.label,
                        link: ((_a = source.file) === null || _a === void 0 ? void 0 : _a.startsWith("http"))
                            ? source.file
                            : "".concat(baseUrl_1).concat(source.file),
                        type: "m3u8",
                        headers: {
                            Referer: baseUrl_1,
                            origin: baseUrl_1,
                            Cookie: "hd=on",
                        },
                    });
                });
                console.log(streamLinks_1);
                return [2 /*return*/, streamLinks_1];
            case 5:
                err_1 = _c.sent();
                console.error(err_1);
                return [2 /*return*/, []];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getStream = getStream;
