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
        var container = $(".entry-content, .entry-inner");
        // Remove unnecessary elements
        $(".unili-content, .code-block-1").remove();
        var episodes = [];
        container.find("h4, h3").each(function (_, element) {
            var el = $(element);
            var title = el.text().replace(/[-:]/g, "").trim();
            if (!title)
                return;
            // Saare V-Cloud links fetch
            el.next("p")
                .find("a[href*='vcloud.lol']")
                .each(function (_, a) {
                var _a;
                var anchor = $(a);
                var href = (_a = anchor.attr("href")) === null || _a === void 0 ? void 0 : _a.trim();
                if (href) {
                    episodes.push({ title: title, link: href });
                }
            });
        });
        return episodes;
    })
        .catch(function (err) {
        console.log("getEpisodeLinks error:", err);
        return [];
    });
};
exports.getEpisodes = getEpisodes;
