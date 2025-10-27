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
exports.getSearchPosts = exports.getPosts = void 0;
const getPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ filter, page, signal, providerContext, }) {
        var _b, _c;
        const { getBaseUrl } = providerContext;
        const baseUrl = yield getBaseUrl("filmyfly");
        // Update to use new domain
        const newBaseUrl = baseUrl.replace('filmyfly.deals', 'filmyfly.observer');
        let url;
        if (filter === '') {
            // Homepage
            url = page === 1 ? newBaseUrl : `${newBaseUrl}?to-page=${page}`;
        }
        else {
            // Category pages - use the correct pagination format
            const categoryId = (_b = filter.match(/\/page-cat\/(\d+)\//)) === null || _b === void 0 ? void 0 : _b[1];
            const categoryName = (_c = filter.match(/\/page-cat\/\d+\/([^\/]+)\.html/)) === null || _c === void 0 ? void 0 : _c[1];
            if (categoryId && categoryName) {
                // Always use the paginated format for categories
                url = `${newBaseUrl}/page-3/${categoryId}/${categoryName}/${page}`;
            }
            else {
                url = `${newBaseUrl}${filter}`;
            }
        }
        return posts({ url, signal, baseUrl: newBaseUrl, providerContext });
    });
};
exports.getPosts = getPosts;
const getSearchPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ searchQuery, page, signal, providerContext, }) {
        const { getBaseUrl } = providerContext;
        const baseUrl = yield getBaseUrl("filmyfly");
        // Update to use new domain
        const newBaseUrl = baseUrl.replace('filmyfly.deals', 'filmyfly.observer');
        const url = `${newBaseUrl}/site-1.html?to-search=${searchQuery}`;
        if (page > 1) {
            return [];
        }
        return posts({ url, signal, baseUrl: newBaseUrl, providerContext });
    });
};
exports.getSearchPosts = getSearchPosts;
function posts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ url, signal, baseUrl, providerContext, }) {
        try {
            console.log('Fetching URL:', url);
            const { cheerio, commonHeaders: headers } = providerContext;
            const res = yield fetch(url, { headers, signal });
            const data = yield res.text();
            const $ = cheerio.load(data);
            const catalog = [];
            console.log('Page loaded, checking for content...');
            // Handle homepage structure (.A10 divs)
            $(".A10").each((i, element) => {
                const $el = $(element);
                const linkEl = $el.find("a").first();
                const titleEl = $el.find("div[style*='font-weight:bold']").first();
                const title = titleEl.text().trim();
                const link = linkEl.attr("href");
                const image = $el.find("img").attr("src");
                if (title && link && image) {
                    catalog.push({
                        title: title,
                        link: baseUrl + link,
                        image: image,
                    });
                }
            });
            // Handle category pages structure (.fl divs)
            $(".fl").each((i, element) => {
                const $el = $(element);
                const linkEl = $el.find("a").first();
                // Try different selectors for title
                let title = linkEl.find("b").text().trim();
                if (!title) {
                    title = linkEl.text().trim();
                }
                if (!title) {
                    title = $el.find("b").text().trim();
                }
                const link = linkEl.attr("href");
                const image = $el.find("img").attr("src");
                // Only add if we have all three components and title is not empty
                if (title && link && image && title.length > 0) {
                    catalog.push({
                        title: title,
                        link: baseUrl + link,
                        image: image,
                    });
                }
            });
            return catalog;
        }
        catch (err) {
            console.error("ff error ", err);
            return [];
        }
    });
}
