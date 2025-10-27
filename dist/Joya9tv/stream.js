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
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en;q=0.9,en-IN;q=0.8",
    "cache-control": "no-cache",
    pragma: "no-cache",
    priority: "u=0, i",
    "sec-ch-ua": '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
};
function getStream(_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, type, signal, providerContext, }) {
        var _b, _c, _d, _e, _f, _g, _h;
        const { axios, cheerio, extractors } = providerContext;
        const { hubcloudExtracter, gdFlixExtracter } = extractors;
        try {
            const streamLinks = [];
            console.log("Joya9tv getStream - processing link:", link === null || link === void 0 ? void 0 : link.substring(0, 80));
            if (type === "movie") {
                // vlink
                const dotlinkRes = yield fetch(`${link}`, { headers });
                const dotlinkText = yield dotlinkRes.text();
                // console.log('dotlinkText', dotlinkText);
                const vlink = dotlinkText.match(/<a\s+href="([^"]*cloud\.[^"]*)"/i) || [];
                // console.log('vLink', vlink[1]);
                link = vlink[1];
                console.log("Joya9tv getStream - extracted vlink:", link === null || link === void 0 ? void 0 : link.substring(0, 80));
                // filepress link
                try {
                    const $ = cheerio.load(dotlinkText);
                    const filepressLink = $('.btn.btn-sm.btn-outline[style="background:linear-gradient(135deg,rgb(252,185,0) 0%,rgb(0,0,0)); color: #fdf8f2;"]')
                        .parent()
                        .attr("href");
                    // console.log('filepressLink', filepressLink);
                    const filepressID = filepressLink === null || filepressLink === void 0 ? void 0 : filepressLink.split("/").pop();
                    const filepressBaseUrl = filepressLink === null || filepressLink === void 0 ? void 0 : filepressLink.split("/").slice(0, -2).join("/");
                    console.log("Joya9tv getStream - found filepress link");
                    // console.log('filepressID', filepressID);
                    // console.log('filepressBaseUrl', filepressBaseUrl);
                    if (filepressBaseUrl && filepressID) {
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
                            if ((_e = (_d = filepressStreamLink.data) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e[0]) {
                                streamLinks.push({
                                    server: "filepress",
                                    link: (_g = (_f = filepressStreamLink.data) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g[0],
                                    type: "mkv",
                                });
                                console.log("Joya9tv getStream - filepress link added");
                            }
                        }
                    }
                }
                catch (error) {
                    console.log("Joya9tv getStream - filepress extraction failed:", error instanceof Error ? error.message : String(error));
                    // Continue to hubcloud extraction
                }
            }
            // Extract hubcloud/gdflix links
            if (link) {
                console.log("Joya9tv getStream - extracting from:", link === null || link === void 0 ? void 0 : link.substring(0, 80));
                let extractedLinks = [];
                // Try hubcloud first
                if (link.includes("hubcloud")) {
                    extractedLinks = yield hubcloudExtracter(link, signal);
                    console.log("Joya9tv getStream - extracted", extractedLinks.length, "links from hubcloud");
                }
                // Try gdflix if link contains gdflix or if hubcloud failed
                else if (link.includes("gdflix") || extractedLinks.length === 0) {
                    console.log("Joya9tv getStream - trying gdflix extractor");
                    extractedLinks = yield gdFlixExtracter(link, signal);
                    console.log("Joya9tv getStream - extracted", extractedLinks.length, "links from gdflix");
                }
                if (extractedLinks.length > 0) {
                    streamLinks.push(...extractedLinks);
                }
                else {
                    console.log("Joya9tv getStream - extraction failed, returning intermediate link as fallback");
                    // Fallback: return the intermediate link as-is
                    streamLinks.push({
                        server: "hubcloud/gdflix",
                        link: link,
                        type: "mkv",
                    });
                }
            }
            console.log("Joya9tv getStream - returning", streamLinks.length, "total stream links");
            return streamLinks;
        }
        catch (error) {
            console.log("Joya9tv getStream - error:", (error === null || error === void 0 ? void 0 : error.message) || String(error));
            if ((_h = error.message) === null || _h === void 0 ? void 0 : _h.includes("Aborted")) {
                console.log("Joya9tv getStream - request was aborted");
            }
            return [];
        }
    });
}
