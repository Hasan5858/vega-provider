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
exports.getStream = void 0;
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, signal, providerContext, }) {
        try {
            const res = yield providerContext.axios.get(link, { signal });
            const data = res.data;
            const $ = providerContext.cheerio.load(data);
            const streams = [];
            // For linkmake.in pages, look for download links
            // For direct movie pages, look for button classes
            const elements = $("a[href]:contains('Download'), .button2,.button1,.button3,.button4,.button").toArray();
            const promises = elements.map((element) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const title = $(element).text().trim();
                let elementLink = $(element).attr("href");
                if (!title || !elementLink)
                    return;
                // Skip unwanted links
                if (title.includes("Watch") ||
                    title.includes("Login") ||
                    title.includes("Signup") ||
                    title.includes("Privacy") ||
                    title.includes("DMCA") ||
                    title.includes("Contact") ||
                    title.includes("Linkmake") ||
                    title.includes("Telegram")) {
                    return;
                }
                // If link is to filesdl.site, extract actual download URLs
                if (elementLink.includes("filesdl.site")) {
                    try {
                        const filesdlRes = yield providerContext.axios.get(elementLink, { signal });
                        const filesdl$ = providerContext.cheerio.load(filesdlRes.data);
                        // Extract actual download links from filesdl page
                        const downloadLinks = filesdl$("a[href]").toArray();
                        for (const dlLink of downloadLinks) {
                            const dlTitle = filesdl$(dlLink).text().trim();
                            const dlHref = filesdl$(dlLink).attr("href");
                            if (!dlHref || !dlTitle)
                                continue;
                            // Skip unwanted links
                            if (dlTitle.includes("Watch") ||
                                dlTitle.includes("Login") ||
                                dlTitle.includes("Signup") ||
                                dlTitle.includes("Telegram")) {
                                continue;
                            }
                            // Handle GoFile links
                            if (dlHref.includes("gofile.io")) {
                                const gofileId = (_a = dlHref.split("/d/")[1]) === null || _a === void 0 ? void 0 : _a.split("?")[0];
                                if (gofileId) {
                                    const gofileResult = yield providerContext.extractors.gofileExtracter(gofileId);
                                    if (gofileResult.link) {
                                        streams.push({
                                            server: `${title} - ${dlTitle}`,
                                            link: gofileResult.link,
                                            type: "mkv",
                                        });
                                    }
                                }
                                continue;
                            }
                            // Handle GDFLIX links
                            if (dlHref.includes("gdflix")) {
                                const gdLinks = yield providerContext.extractors.gdFlixExtracter(dlHref, signal);
                                streams.push(...gdLinks.map(s => (Object.assign(Object.assign({}, s), { server: `${title} - ${dlTitle}` }))));
                                continue;
                            }
                            // Handle HubCloud links
                            if (dlHref.includes("hubcloud")) {
                                const hubLinks = yield providerContext.extractors.hubcloudExtracter(dlHref, signal);
                                streams.push(...hubLinks.map(s => (Object.assign(Object.assign({}, s), { server: `${title} - ${dlTitle}` }))));
                                continue;
                            }
                            // Handle direct video links (Fast Cloud and Ultra FastDL only)
                            // Skip Direct Download and Fast Cloud-02 (Cloudflare blocked)
                            if ((dlTitle.includes("Fast Cloud") && !dlTitle.includes("Fast Cloud-02")) ||
                                dlTitle.includes("Ultra FastDL")) {
                                // Check if link looks like a direct video URL
                                if (dlHref.includes(".mkv") ||
                                    dlHref.includes(".mp4") ||
                                    dlHref.includes(".m3u8") ||
                                    dlHref.includes("awsstorage") ||
                                    dlHref.includes("download") ||
                                    dlHref.includes("filesd1.xyz")) {
                                    streams.push({
                                        server: `${title} - ${dlTitle}`,
                                        link: dlHref,
                                        type: "mkv",
                                    });
                                }
                            }
                        }
                    }
                    catch (filesdlErr) {
                        console.error("Error extracting from filesdl:", filesdlErr);
                    }
                    return;
                }
                // Handle GDFLIX links directly
                if (title.includes("GDFLIX") && elementLink) {
                    const gdLinks = yield providerContext.extractors.gdFlixExtracter(elementLink, signal);
                    streams.push(...gdLinks);
                    return;
                }
                // Handle GoFile links directly
                if (elementLink.includes("gofile.io")) {
                    const gofileId = (_b = elementLink.split("/d/")[1]) === null || _b === void 0 ? void 0 : _b.split("?")[0];
                    if (gofileId) {
                        const gofileResult = yield providerContext.extractors.gofileExtracter(gofileId);
                        if (gofileResult.link) {
                            streams.push({
                                server: title,
                                link: gofileResult.link,
                                type: "mkv",
                            });
                        }
                    }
                    return;
                }
                // Check if already added
                const alreadyAdded = streams.find((s) => s.link === elementLink);
                if (alreadyAdded)
                    return;
                // Add the stream for other links
                streams.push({
                    server: title,
                    link: elementLink,
                    type: "mkv",
                });
            }));
            yield Promise.all(promises);
            return streams;
        }
        catch (err) {
            console.error(err);
            return [];
        }
    });
};
exports.getStream = getStream;
