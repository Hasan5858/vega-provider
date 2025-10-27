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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = getStream;
const headers = {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Cache-Control": "no-store",
    "Accept-Language": "en-US,en;q=0.9",
    DNT: "1",
    "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    Cookie: "ext_name=ojplmecpdpgccookcobabopnaifgidhf; cf_clearance=nJQQ9ncb6m2Nc7HoxzuphPhnQgLzI6nBmzl2D.9oY4E-1759137994-1.2.1.1-pe7DiQHVsfZjnbHWTnaNbMiTYEuk.VvpPGaMeTtHOh7p9TKG5auBIDGDDW93devKuNcOlkhe6mk4v5OcsM0H_q3Te02eCPoTNgZsW8terjwvnQUebbbe8QKjMaVsVKgnbiAxS2ESM9aB3fbiQ9diuNT6ziY.2U4mPaJ0Y4vCu3404o5qBEw5c2psIuabKUTZviA2NJvN.lx5jAFQnB.HXeXJnUuCcbQac7G1BYBfdso",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
};
function getStream(_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, type, signal, providerContext, }) {
        var _b, _c, _d, _e;
        const { axios, cheerio, extractors } = providerContext;
        const { hubcloudExtracter } = extractors;
        try {
            const streamLinks = [];
            console.log("dotlink", link);
            if (type === "movie") {
                // vlink
                const dotlinkRes = yield axios(`${link}`, { headers });
                const dotlinkText = dotlinkRes.data;
                console.log("dotlinkText", dotlinkText);
                const vlink = dotlinkText.match(/<a\s+href="([^"]*cloud\.[^"]*)"/i) || [];
                console.log("vLink", vlink[1]);
                link = vlink[1];
                // filepress link
                try {
                    const $ = cheerio.load(dotlinkText);
                    const filepressLink = $('.btn.btn-sm.btn-outline[style="background:linear-gradient(135deg,rgb(252,185,0) 0%,rgb(0,0,0)); color: #fdf8f2;"]')
                        .parent()
                        .attr("href");
                    // console.log('filepressLink', filepressLink);
                    const filepressID = filepressLink === null || filepressLink === void 0 ? void 0 : filepressLink.split("/").pop();
                    const filepressBaseUrl = filepressLink === null || filepressLink === void 0 ? void 0 : filepressLink.split("/").slice(0, -2).join("/");
                    // console.log('filepressID', filepressID);
                    // console.log('filepressBaseUrl', filepressBaseUrl);
                    const filepressTokenRes = yield axios.post(filepressBaseUrl + "/api/file/downlaod/", {
                        id: filepressID,
                        method: "indexDownlaod",
                        captchaValue: null,
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            Referer: filepressBaseUrl,
                        },
                    });
                    // console.log('filepressTokenRes', filepressTokenRes.data);
                    if ((_b = filepressTokenRes.data) === null || _b === void 0 ? void 0 : _b.status) {
                        const filepressToken = (_c = filepressTokenRes.data) === null || _c === void 0 ? void 0 : _c.data;
                        const filepressStreamLink = yield axios.post(filepressBaseUrl + "/api/file/downlaod2/", {
                            id: filepressToken,
                            method: "indexDownlaod",
                            captchaValue: null,
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                Referer: filepressBaseUrl,
                            },
                        });
                        // console.log('filepressStreamLink', filepressStreamLink.data);
                        streamLinks.push({
                            server: "filepress",
                            link: (_e = (_d = filepressStreamLink.data) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e[0],
                            type: "mkv",
                        });
                    }
                }
                catch (error) {
                    console.log("filepress error: ");
                    // console.error(error);
                }
            }
            return yield hubcloudExtracter(link, signal);
        }
        catch (error) {
            console.log("getStream error: ", error);
            if (error.message.includes("Aborted")) {
            }
            else {
            }
            return [];
        }
    });
}
