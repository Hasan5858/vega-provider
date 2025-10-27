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
exports.getMeta = void 0;
const getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext, }) {
        try {
            const { axios, cheerio, commonHeaders: headers } = providerContext;
            // Update URL to use new domain
            const url = link.replace('filmyfly.deals', 'filmyfly.observer');
            const res = yield axios.get(url, { headers });
            const data = res.data;
            const $ = cheerio.load(data);
            // Determine type based on content
            const type = url.includes("tvshows") || url.includes("series") || $('h2').text().includes('Series') ? "series" : "movie";
            const imdbId = "";
            // Extract title from page title or h2
            const title = $('h2').first().text().trim() ||
                $('title').text().replace('FilmyFly', '').trim() ||
                $('.fname').filter((i, el) => $(el).text().includes('Name:')).find(".colora").text().trim();
            // Extract image from movie thumbnail
            const image = $('.movie-thumb img').attr('src') ||
                $(".ss img").attr("src") ||
                "";
            // Extract synopsis from description
            const synopsis = $('.fname').filter((i, el) => $(el).text().includes('Description:')).find(".colorg").text().trim();
            // Extract tags from genre
            const tags = $('.fname').filter((i, el) => $(el).text().includes('Genre:')).find(".colorb").text().split(",").map(tag => tag.trim()) || [];
            const rating = "";
            const links = [];
            // Extract download link from dlbtn (the main download button)
            const downloadLink = $(".dlbtn a").attr("href");
            const downloadText = $(".dlbtn a").text().trim();
            if (downloadLink && downloadText) {
                // Parse the download text to extract quality options
                // Text format: "Download 480p 720p 1080p 2160p(4k) [HD]"
                const qualityMatch = downloadText.match(/(\d+p|4k|2160p)/gi);
                if (qualityMatch && qualityMatch.length > 0) {
                    // Create separate Link objects for each quality
                    qualityMatch.forEach(quality => {
                        const normalizedQuality = quality.toLowerCase();
                        links.push({
                            title: `${normalizedQuality.toUpperCase()} Quality`,
                            quality: normalizedQuality,
                            episodesLink: downloadLink,
                            directLinks: [{
                                    title: `Download ${normalizedQuality.toUpperCase()}`,
                                    link: downloadLink,
                                    type: type
                                }]
                        });
                    });
                }
                else {
                    // Fallback: create a single download link
                    links.push({
                        title: "Download",
                        episodesLink: downloadLink,
                        directLinks: [{
                                title: "Download Movie",
                                link: downloadLink,
                                type: type
                            }]
                    });
                }
            }
            // Fallback: if no dlbtn found, try other selectors
            if (links.length === 0) {
                $(".dwd-button").each((i, el) => {
                    const btnEl = $(el);
                    const parentLink = btnEl.parent("a").attr("href");
                    const text = btnEl.text().trim();
                    if (parentLink && !parentLink.includes("javascript:") && !parentLink.includes("mailto:")) {
                        links.push({
                            title: "Download",
                            episodesLink: parentLink,
                            directLinks: [{
                                    title: text || "Download",
                                    link: parentLink.startsWith("http") ? parentLink : `https://filmyfly.observer${parentLink}`,
                                    type: type
                                }]
                        });
                    }
                });
            }
            return {
                title,
                tags,
                rating,
                synopsis,
                image,
                imdbId,
                type,
                linkList: links,
            };
        }
        catch (err) {
            console.error(err);
            return {
                title: "",
                synopsis: "",
                image: "",
                imdbId: "",
                type: "movie",
                linkList: [],
            };
        }
    });
};
exports.getMeta = getMeta;
