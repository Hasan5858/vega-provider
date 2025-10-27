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
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
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
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
};
function getStream(_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, type, signal, providerContext, }) {
        const { axios, cheerio } = providerContext;
        try {
            const streamLinks = [];
            // Fetch the page HTML
            const res = yield axios.get(link, { headers, signal });
            const $ = cheerio.load(res.data);
            const ALLOWED_SERVERS = ["ONE CLICK", "ZIP-ZAP", "ULTRA FAST", "SKYDROP"];
            // --- Scrape all <a class="download-button"> links and return them directly
            $("a.download-button").each((_, el) => {
                var _a;
                const btn = $(el);
                const href = (_a = btn.attr("href")) === null || _a === void 0 ? void 0 : _a.trim();
                const serverName = btn.text().trim() || "Unknown Server";
                // Check for partial matches in server names
                const isAllowed = ALLOWED_SERVERS.some((allowed) => serverName.toUpperCase().includes(allowed) ||
                    allowed.includes(serverName.toUpperCase()));
                if (href && isAllowed) {
                    console.log(`Found download link for ${serverName}:`, href);
                    streamLinks.push({
                        server: serverName,
                        link: href,
                        type: "mkv",
                    });
                }
            });
            console.log("Total download links found:", streamLinks.length);
            return streamLinks;
        }
        catch (error) {
            console.log("getStream error: ", error.message);
            return [];
        }
    });
}
