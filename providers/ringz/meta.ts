import { Info, Link, ProviderContext } from "../types";

// Helper function to check if URL is a Cloudflare R2 URL
const isR2Url = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  return (
    url.includes(".r2.dev") || 
    !!url.match(/https?:\/\/pub-[a-z0-9-]+\.dev/i) ||
    !!url.match(/https?:\/\/pub-[a-z0-9-]+\.r2\.dev/i)
  );
};

// Sort directLinks to prioritize non-R2 URLs (working servers first)
const sortLinksByPriority = (links: Link["directLinks"]): Link["directLinks"] => {
  if (!links || !Array.isArray(links)) return links;
  return [...links].sort((a, b) => {
    try {
      const aData = JSON.parse(a.link);
      const bData = JSON.parse(b.link);
      const aIsR2 = isR2Url(aData?.url);
      const bIsR2 = isR2Url(bData?.url);
      // Non-R2 URLs (false) come before R2 URLs (true)
      if (aIsR2 === bIsR2) return 0;
      return aIsR2 ? 1 : -1;
    } catch {
      return 0;
    }
  });
};

export const getMeta = async function ({
  link: data,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  try {
    const dataJson = JSON.parse(data);
    const title = dataJson?.kn || dataJson?.mn;
    const image = dataJson?.IH || dataJson?.IV;
    const tags = dataJson?.gn
      .split(",")
      .slice(0, 3)
      .map((tag: string) => tag.trim());
    const type = dataJson?.cg === "webSeries" ? "series" : "movie";
    const linkList: Link[] = [];
    if (dataJson?.cg === "webSeries") {
      ["1", "2", "3", "4"]?.forEach((item) => {
        const directLinks: Link["directLinks"] = [];
        if (
          typeof dataJson?.["eServer" + item] === "object" &&
          Object?.keys(dataJson?.["eServer" + item])?.length > 0
        ) {
          Object.keys(dataJson?.["eServer" + item]).forEach((key) => {
            directLinks.push({
              title: "Episode " + key,
              link: JSON.stringify({
                url: dataJson?.["eServer" + item][key],
                server: "Server " + item,
              }),
            });
          });
          linkList.push({
            title: dataJson?.pn + " (Server " + item + ")",
            directLinks: sortLinksByPriority(directLinks),
          });
        }
      });
    } else {
      const directLinks: Link["directLinks"] = [];
      ["1", "2", "3", "4"]?.forEach((item) => {
        if (dataJson?.["s" + item]) {
          directLinks.push({
            title: "Server " + item + " (HD)",
            link: JSON.stringify({
              url: dataJson?.s1,
              server: "Server " + item,
            }),
          });
        }
        if (dataJson?.["4s" + item]) {
          directLinks.push({
            title: "Server " + item + " (480p)",
            link: JSON.stringify({
              url: dataJson?.["4s" + item],
              server: "Server " + item,
            }),
          });
        }
      });
      linkList.push({
        title: dataJson?.pn,
        directLinks: sortLinksByPriority(directLinks),
      });
    }
    return {
      title,
      image,
      imdbId: "",
      synopsis: "",
      type,
      linkList,
      tags,
    };
  } catch (err) {
    return {
      title: "",
      image: "",
      imdbId: "",
      synopsis: "",
      type: "movie",
      linkList: [],
      tags: [],
    };
  }
};
