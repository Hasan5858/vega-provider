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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerContext = void 0;
var axios_1 = __importDefault(require("axios"));
var getBaseUrl_1 = require("./getBaseUrl");
var headers_1 = require("./headers");
var cheerio = __importStar(require("cheerio"));
var hubcloudExtractor_1 = require("./hubcloudExtractor");
var gofileExtracter_1 = require("./gofileExtracter");
var superVideoExtractor_1 = require("./superVideoExtractor");
var gdflixExtractor_1 = require("./gdflixExtractor");
var nexdriveExtractor_1 = require("./nexdriveExtractor");
var fastdlExtractor_1 = require("./fastdlExtractor");
var vcloudExtractor_1 = require("./vcloudExtractor");
var filepresExtractor_1 = require("./filepresExtractor");
var streamtapeExtractor_1 = require("./streamtapeExtractor");
var doodExtractor_1 = require("./doodExtractor");
var mixdropExtractor_1 = require("./mixdropExtractor");
var voeExtractor_1 = require("./voeExtractor");
var filelionsExtractor_1 = require("./filelionsExtractor");
var filemoonExtractor_1 = require("./filemoonExtractor");
var react_native_aes_crypto_1 = __importDefault(require("react-native-aes-crypto"));
/**
 * Context for provider functions.
 * This context is used to pass common dependencies to provider functions.
 */
var extractors = {
    hubcloudExtracter: hubcloudExtractor_1.hubcloudExtracter,
    gofileExtracter: gofileExtracter_1.gofileExtracter,
    superVideoExtractor: superVideoExtractor_1.superVideoExtractor,
    gdFlixExtracter: gdflixExtractor_1.gdFlixExtracter,
    nexdriveExtractor: nexdriveExtractor_1.nexdriveExtractor,
    fastdlExtractor: fastdlExtractor_1.fastdlExtractor,
    vcloudExtractor: vcloudExtractor_1.vcloudExtractor,
    filepresExtractor: filepresExtractor_1.filepresExtractor,
    streamtapeExtractor: streamtapeExtractor_1.streamtapeExtractor,
    doodExtractor: doodExtractor_1.doodExtractor,
    mixdropExtractor: mixdropExtractor_1.mixdropExtractor,
    filelionsExtractor: filelionsExtractor_1.filelionsExtractor,
    filemoonExtractor: filemoonExtractor_1.filemoonExtractor,
    voeExtractor: voeExtractor_1.voeExtractor,
};
exports.providerContext = {
    axios: axios_1.default,
    getBaseUrl: getBaseUrl_1.getBaseUrl,
    commonHeaders: headers_1.headers,
    Aes: react_native_aes_crypto_1.default,
    cheerio: cheerio,
    extractors: extractors,
};
