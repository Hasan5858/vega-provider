"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEpisodes = void 0;
var getEpisodes = function (_a) {
    var url = _a.url, providerContext = _a.providerContext;
    var axios = providerContext.axios, cheerio = providerContext.cheerio, headers = providerContext.commonHeaders;
    console.log("getEpisodeLinks", url);
    return axios
        .get(url, { headers: headers })
        .then(function (res) {
        var $ = cheerio.load(res.data);
        // Target the container that holds the episode links (based on the provided sample)
        var container = $("ul:has(p.font-bold:contains('Episode'))").first();
        var episodes = [];
        // Find all bold episode link headings (e.g., 'Episode 38 Links 480p')
        container.find("p.font-bold").each(function (_, element) {
            var el = $(element);
            var title = el.text().trim(); // e.g., "Episode 38 Links 480p"
            if (!title)
                return;
            // Use a selector for the direct links that follow this title (in the next siblings)
            // The episode links are in <li> elements directly following the <p class="font-bold">
            var currentElement = el.parent(); // Get the parent <li> of the <p>
            // Loop through the siblings until the next <p class="font-bold"> (the start of the next episode)
            while (currentElement.next().length && !currentElement.next().find("p.font-bold").length) {
                currentElement = currentElement.next();
                // Find all anchor tags (links) in the current <li> sibling
                currentElement.find("a[href]").each(function (_, a) {
                    var _a;
                    var anchor = $(a);
                    var href = (_a = anchor.attr("href")) === null || _a === void 0 ? void 0 : _a.trim();
                    // Only include links for hubcloud and gdflix as requested
                    // Fixed: support hubcloud.fit, hubcloud.one, and all gdflix domains
                    if (href && (href.includes("hubcloud") || href.includes("gdflix"))) {
                        // Clean up the title to be just "Episode X 480p"
                        episodes.push({
                            title: title.replace(/ Links$/i, ''),
                            link: href
                        });
                    }
                });
            }
        });
        return episodes;
    })
        .catch(function (err) {
        console.log("getEpisodeLinks error:", err);
        return [];
    });
};
exports.getEpisodes = getEpisodes;
