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
function LALLJLutmoZpvvbikjaWM(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
function getOrCreateUID() {
    var uid = "uid_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    return uid;
}
var getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        function generateMessageToken(baseUrlL) {
            var hostname = baseUrlL === null || baseUrlL === void 0 ? void 0 : baseUrlL.replace(/https?:\/\//, "").split("/")[0];
            console.log("generateMessageToken hostname", hostname);
            var NsmxUftCNibQ = "[hostname=".concat(hostname, "][agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0][tmz=India Standard Time][userTimezoneOffset=-330][{\"url\":\"https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js\",\"type\":\"script\",\"duration\":253.30000000074506},{\"url\":\"https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback\",\"type\":\"script\",\"duration\":397.19999999925494},{\"url\":\"https://adoto.net/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js\",\"type\":\"img\",\"duration\":225.90000000223517},{\"url\":\"https://code.jquery.com/jquery-3.3.1.slim.min.js\",\"type\":\"script\",\"duration\":65.30000000074506},{\"url\":\"https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015\",\"type\":\"script\",\"duration\":225.89999999850988},{\"url\":\"https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js\",\"type\":\"script\",\"duration\":253.30000000074506},{\"url\":\"https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback\",\"type\":\"script\",\"duration\":397.19999999925494},{\"url\":\"https://adoto.net/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js\",\"type\":\"img\",\"duration\":225.90000000223517},{\"url\":\"https://code.jquery.com/jquery-3.3.1.slim.min.js\",\"type\":\"script\",\"duration\":65.30000000074506},{\"url\":\"https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015\",\"type\":\"script\",\"duration\":225.89999999850988},{\"url\":\"https://challenges.cloudflare.com/cdn-cgi/challenge-platform/h/b/turnstile/if/ov2/av0/rcv/b3dhg/0x4AAAAAAAQDru7r64xT2ifD/auto/fbE/new/normal/auto/\",\"type\":\"iframe\",\"duration\":2050.300000000745},{\"url\":\"https://new19.gdtot.dad/favicon.ico\",\"type\":\"img\",\"duration\":1003.6999999992549},{\"url\":\"https://vikingfile.com/assets/favicon-64375c377b5df8304acbdad4f4430694.ico\",\"type\":\"img\",\"duration\":183.19999999925494},{\"url\":\"https://gofile.io/dist/img/favicon32.png\",\"type\":\"img\",\"duration\":19177.199999999255},{\"url\":\"https://pub.clickadu.com/assets/scripts/supported-browsers.js\",\"type\":\"fetch\",\"duration\":18.799999997019768},{\"url\":\"https://challenges.cloudflare.com/cdn-cgi/challenge-platform/h/b/turnstile/if/ov2/av0/rcv/b3dhg/0x4AAAAAAAQDru7r64xT2ifD/auto/fbE/auto_expire/normal/auto/\",\"type\":\"iframe\",\"duration\":1612.5999999977648},{\"url\":\"https://challenges.cloudflare.com/cdn-cgi/challenge-platform/h/b/turnstile/if/ov2/av0/rcv/b3dhg/0x4AAAAAAAQDru7r64xT2ifD/auto/fbE/auto_expire/normal/auto/\",\"type\":\"iframe\",\"duration\":1154.0999999977648},{\"url\":\"https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js\",\"type\":\"script\",\"duration\":253.30000000074506},{\"url\":\"https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback\",\"type\":\"script\",\"duration\":397.19999999925494},{\"url\":\"https://adoto.net/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js\",\"type\":\"img\",\"duration\":225.90000000223517},{\"url\":\"https://code.jquery.com/jquery-3.3.1.slim.min.js\",\"type\":\"script\",\"duration\":65.30000000074506},{\"url\":\"https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015\",\"type\":\"script\",\"duration\":225.89999999850988},{\"url\":\"https://challenges.cloudflare.com/cdn-cgi/challenge-platform/h/b/turnstile/if/ov2/av0/rcv/b3dhg/0x4AAAAAAAQDru7r64xT2ifD/auto/fbE/new/normal/auto/\",\"type\":\"iframe\",\"duration\":2050.300000000745},{\"url\":\"https://new19.gdtot.dad/favicon.ico\",\"type\":\"img\",\"duration\":1003.6999999992549},{\"url\":\"https://vikingfile.com/assets/favicon-64375c377b5df8304acbdad4f4430694.ico\",\"type\":\"img\",\"duration\":183.19999999925494},{\"url\":\"https://gofile.io/dist/img/favicon32.png\",\"type\":\"img\",\"duration\":19177.199999999255},{\"url\":\"https://pub.clickadu.com/assets/scripts/supported-browsers.js\",\"type\":\"fetch\",\"duration\":18.799999997019768},{\"url\":\"https://challenges.cloudflare.com/cdn-cgi/challenge-platform/h/b/turnstile/if/ov2/av0/rcv/b3dhg/0x4AAAAAAAQDru7r64xT2ifD/auto/fbE/auto_expire/normal/auto/\",\"type\":\"iframe\",\"duration\":1612.5999999977648},{\"url\":\"https://challenges.cloudflare.com/cdn-cgi/challenge-platform/h/b/turnstile/if/ov2/av0/rcv/b3dhg/0x4AAAAAAAQDru7r64xT2ifD/auto/fbE/auto_expire/normal/auto/\",\"type\":\"iframe\",\"duration\":1154.0999999977648},{\"url\":\"https://challenges.cloudflare.com/cdn-cgi/challenge-platform/h/b/turnstile/if/ov2/av0/rcv/b3dhg/0x4AAAAAAAQDru7r64xT2ifD/auto/fbE/auto_expire/normal/auto/\",\"type\":\"iframe\",\"duration\":986}][{\"elements\":{\"div\":70,\"span\":68,\"img\":4,\"iframe\":0,\"script\":28,\"link\":20,\"p\":5,\"a\":213,\"ul\":28,\"li\":208,\"button\":9,\"input\":5},\"hidden\":{\"div\":13,\"span\":60,\"img\":1,\"iframe\":0,\"script\":28,\"link\":20,\"p\":0,\"a\":186,\"ul\":22,\"li\":184,\"button\":6,\"input\":2},\"errors\":{\"network\":0,\"js\":0},\"eventListeners\":0}]");
            var jRpeP = LALLJLutmoZpvvbikjaWM(NsmxUftCNibQ);
            var jzKEwqEAcWFMNwHZnCCqJQ = new Uint8Array(jRpeP);
            var kyMXQUxoFYuZIBlKvlHa = jzKEwqEAcWFMNwHZnCCqJQ.toString();
            var kyMXQUxoFYuZIBlKvlHa = kyMXQUxoFYuZIBlKvlHa.replace(/2/g, "004");
            var kyMXQUxoFYuZIBlKvlHa = kyMXQUxoFYuZIBlKvlHa.replace(/3/g, "005");
            var kyMXQUxoFYuZIBlKvlHa = kyMXQUxoFYuZIBlKvlHa.replace(/7/g, "007");
            var kyMXQUxoFYuZIBlKvlHa = kyMXQUxoFYuZIBlKvlHa.replace(/,0,0,0/g, "");
            return kyMXQUxoFYuZIBlKvlHa;
        }
        function decodeHtml(encodedArray) {
            // Join array elements into a single string
            var joined = encodedArray.join("");
            // Replace escaped quotes
            var unescaped = joined.replace(/\\"/g, '"').replace(/\\'/g, "'");
            // Remove remaining escape characters
            var cleaned = unescaped
                .replace(/\\n/g, "\n")
                .replace(/\\t/g, "\t")
                .replace(/\\r/g, "\r");
            // Convert literal string representations back to characters
            var decoded = cleaned
                .replace(/&quot;/g, '"')
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&amp;/g, "&");
            return decoded;
        }
        var axios, cheerio, headers, extractors, gofileExtracter, streamLinks_1, res, data, $$, htmlArray, html, $, idList, id1080, id720, id480, baseUrl_1, secondIdList_1, e_1;
        var _this = this;
        var _c, _d, _e, _f, _g, _h, _j, _k;
        var link = _b.link, providerContext = _b.providerContext;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    axios = providerContext.axios, cheerio = providerContext.cheerio, headers = providerContext.commonHeaders, extractors = providerContext.extractors;
                    gofileExtracter = extractors.gofileExtracter;
                    _l.label = 1;
                case 1:
                    _l.trys.push([1, 5, , 6]);
                    streamLinks_1 = [];
                    return [4 /*yield*/, axios.get(link, { headers: headers })];
                case 2:
                    res = _l.sent();
                    data = res.data;
                    $$ = cheerio.load(data);
                    htmlArray = (_g = (_f = (_e = (_d = (_c = $$('script:contains("decodeURIComponent")')
                        .text()
                        .split(" = ")) === null || _c === void 0 ? void 0 : _c[1]) === null || _d === void 0 ? void 0 : _d.split("protomovies")) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.trim()) === null || _g === void 0 ? void 0 : _g.slice(0, -1);
                    html = decodeHtml(JSON.parse(htmlArray));
                    $ = cheerio.load(html);
                    idList = [];
                    id1080 = (_h = $('tr:contains("1080p")')
                        .find('button:contains("Info")')
                        .attr("id")) === null || _h === void 0 ? void 0 : _h.split("-")[1];
                    if (id1080) {
                        idList.push({
                            id: id1080,
                            quality: "1080p",
                        });
                    }
                    id720 = (_j = $('tr:contains("720p")')
                        .find('button:contains("Info")')
                        .attr("id")) === null || _j === void 0 ? void 0 : _j.split("-")[1];
                    if (id720) {
                        idList.push({
                            id: id720,
                            quality: "720p",
                        });
                    }
                    id480 = (_k = $('tr:contains("480p")')
                        .find('button:contains("Info")')
                        .attr("id")) === null || _k === void 0 ? void 0 : _k.split("-")[1];
                    if (id480) {
                        idList.push({
                            id: id480,
                            quality: "480p",
                        });
                    }
                    baseUrl_1 = link.split("/").slice(0, 3).join("/");
                    secondIdList_1 = [];
                    return [4 /*yield*/, Promise.all(idList.slice(0, 2).map(function (id) { return __awaiter(_this, void 0, void 0, function () {
                            var formData, messageToken, uid, idRes, idData;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        formData = new URLSearchParams();
                                        formData.append("downloadid", id.id);
                                        formData.append("token", "ok");
                                        messageToken = generateMessageToken(baseUrl_1);
                                        uid = getOrCreateUID();
                                        return [4 /*yield*/, fetch("".concat(baseUrl_1, "/ppd.php"), {
                                                headers: {
                                                    accept: "*/*",
                                                    "accept-language": "en-US,en;q=0.9,en-IN;q=0.8",
                                                    "cache-control": "no-cache",
                                                    "content-type": "application/x-www-form-urlencoded",
                                                    pragma: "no-cache",
                                                    priority: "u=1, i",
                                                    "sec-ch-ua": '"Chromium";v="136", "Microsoft Edge";v="136", "Not.A/Brand";v="99"',
                                                    "sec-ch-ua-mobile": "?0",
                                                    "sec-ch-ua-platform": '"Windows"',
                                                    "sec-fetch-dest": "empty",
                                                    "sec-fetch-mode": "cors",
                                                    "sec-fetch-site": "same-origin",
                                                    cookie: "ext_name=ojplmecpdpgccookcobabopnaifgidhf; tgInvite222=true; cf_clearance=3ynJv2B6lHMj3FCOqtfQaL7lTN4KC3xmPRMgcNtddAc-1748787867-1.2.1.1-SEIhLbWR3ehfib5Y3P5pjzj1Qu9wipc52Icv4AmNkztXn2pTXhjKgxXnvTuA2bNscgHuc1juXujAHteqY_vaMmy2C3djMWnJGzjje_XvXZXKht8rwHZt6sviq7KAYvrYZPTrATqENuopzmqmK6dDFS.CAnWHt0VDn8q06iLm5rYj1AXUo3qkV5p1Idx_25elWHYGG8yengBrQV1MYVM9LMdQqv44PXu69FZvNkgv.d6blCKyneJnoLkw4LHAccu.QRPbFwWqqTDyO9YTLRQW9w29bKghD3_JVxkz.qxpg5FbocJ3i6tJJy74SvROpYdpVUOn0fW1YgQ7RxYwhNoHpdTKy8pvmQJGRuSVW1GjO_k",
                                                    Referer: "https://m3.protonmovies.top/download/",
                                                    "Referrer-Policy": "strict-origin-when-cross-origin",
                                                },
                                                body: "downloadid=".concat(id.id, "&msg=").concat(messageToken, "&uid=").concat(uid, "&token=ok"),
                                                method: "POST",
                                            })];
                                    case 1:
                                        idRes = _a.sent();
                                        return [4 /*yield*/, idRes.text()];
                                    case 2:
                                        idData = _a.sent();
                                        secondIdList_1.push({
                                            quality: id.quality,
                                            id: idData,
                                        });
                                        console.log("idData", idData);
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 3:
                    _l.sent();
                    return [4 /*yield*/, Promise.all(secondIdList_1.map(function (id) { return __awaiter(_this, void 0, void 0, function () {
                            var idRes, ppd, gofileLink, gofileId, goRes, vikingLink, gdtotLink, error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 6, , 7]);
                                        return [4 /*yield*/, axios.post("".concat(baseUrl_1, "/tmp/").concat(id.id))];
                                    case 1:
                                        idRes = _a.sent();
                                        console.log("idRes.data structure:", JSON.stringify(idRes.data, null, 2));
                                        if (!(idRes.data && idRes.data.ppd)) return [3 /*break*/, 4];
                                        ppd = idRes.data.ppd;
                                        console.log("Available file hosts:", Object.keys(ppd));
                                        if (!ppd["gofile.io"]) return [3 /*break*/, 3];
                                        gofileLink = ppd["gofile.io"].link;
                                        console.log("gofile link found:", gofileLink);
                                        if (!gofileLink) return [3 /*break*/, 3];
                                        gofileId = gofileLink.split("/").pop();
                                        console.log("gofile ID:", gofileId);
                                        if (!gofileId) return [3 /*break*/, 3];
                                        return [4 /*yield*/, gofileExtracter(gofileId)];
                                    case 2:
                                        goRes = _a.sent();
                                        console.log("gofile extracter result:", goRes);
                                        if (goRes && goRes.link) {
                                            streamLinks_1.push({
                                                link: goRes.link,
                                                server: "gofile " + id.quality,
                                                type: "mkv",
                                                headers: {
                                                    referer: "https://gofile.io",
                                                    connection: "keep-alive",
                                                    contentType: "video/x-matroska",
                                                    cookie: "accountToken=" + goRes.token,
                                                },
                                            });
                                            return [2 /*return*/]; // Success, no need to try other hosts
                                        }
                                        _a.label = 3;
                                    case 3:
                                        // Fallback to VikingFile if GoFile fails
                                        if (ppd["vikingfile"]) {
                                            vikingLink = ppd["vikingfile"].link;
                                            console.log("vikingfile link found:", vikingLink);
                                            if (vikingLink) {
                                                streamLinks_1.push({
                                                    link: vikingLink,
                                                    server: "vikingfile " + id.quality,
                                                    type: "mkv",
                                                    headers: {
                                                        referer: "https://vikingfile.com",
                                                        connection: "keep-alive",
                                                        contentType: "video/x-matroska",
                                                    },
                                                });
                                                return [2 /*return*/]; // Success with VikingFile
                                            }
                                        }
                                        // Fallback to GDTot if others fail
                                        if (ppd["gdtot"]) {
                                            gdtotLink = ppd["gdtot"].link;
                                            console.log("gdtot link found:", gdtotLink);
                                            if (gdtotLink) {
                                                streamLinks_1.push({
                                                    link: gdtotLink,
                                                    server: "gdtot " + id.quality,
                                                    type: "mkv",
                                                    headers: {
                                                        referer: "https://gdtot.dad",
                                                        connection: "keep-alive",
                                                        contentType: "video/x-matroska",
                                                    },
                                                });
                                                return [2 /*return*/]; // Success with GDTot
                                            }
                                        }
                                        console.log("No working file hosts found in ppd structure");
                                        return [3 /*break*/, 5];
                                    case 4:
                                        console.log("No ppd structure found");
                                        _a.label = 5;
                                    case 5: return [3 /*break*/, 7];
                                    case 6:
                                        error_1 = _a.sent();
                                        console.log("Error processing gofile link:", error_1);
                                        return [3 /*break*/, 7];
                                    case 7: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 4:
                    _l.sent();
                    return [2 /*return*/, streamLinks_1];
                case 5:
                    e_1 = _l.sent();
                    console.log("proton get stream err", e_1);
                    return [2 /*return*/, []];
                case 6: return [2 /*return*/];
            }
        });
    });
};
exports.getStream = getStream;
