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
exports.getStream = void 0;
// Cloudflare Access headers required for R2 bucket authentication
var headers = {
    "cf-access-client-id": "833049b087acf6e787cedfd85d1ccdb8.access",
    "cf-access-client-secret": "02db296a961d7513c3102d7785df4113eff036b2d57d060ffcc2ba3ba820c6aa",
};
var getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var streamLinks, dataJson, url, isR2Url, streamHeaders;
        var data = _b.link;
        return __generator(this, function (_c) {
            streamLinks = [];
            dataJson = JSON.parse(data);
            url = dataJson.url;
            isR2Url = url && typeof url === 'string' && (url.includes(".r2.dev") ||
                url.match(/https?:\/\/pub-[a-z0-9]+\.dev/i) ||
                url.match(/https?:\/\/pub-[a-z0-9-]+\.r2\.dev/i));
            streamHeaders = isR2Url ? __assign({}, headers) : undefined;
            console.log("🔐 [Ringz Stream] URL:", url);
            console.log("🔐 [Ringz Stream] Is R2 URL:", isR2Url);
            console.log("🔐 [Ringz Stream] Headers:", streamHeaders ? Object.keys(streamHeaders).join(", ") : "none");
            streamLinks.push({
                link: url,
                server: dataJson.server,
                type: "mkv",
                // Add Cloudflare Access headers for R2 bucket URLs to prevent 401 errors
                // These headers authenticate with Cloudflare Access to allow access to protected R2 buckets
                headers: streamHeaders,
            });
            return [2 /*return*/, streamLinks];
        });
    });
};
exports.getStream = getStream;
