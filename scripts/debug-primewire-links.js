#!/usr/bin/env node

/**
 * Debug script to dump Primewire embed link data for a movie detail page.
 *
 * Usage: node scripts/debug-primewire-links.js <movie-url> <output-json>
 */

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

const { decodeLinkKeys } = require("../dist/primewire/blowfish.js");
const { getStream } = require("../dist/primewire/stream.js");

const MOVIE_URL =
  process.argv[2] || "https://www.primewire.mov/movie/1521964-a-house-of-dynamite";
const OUTPUT_PATH =
  process.argv[3] ||
  path.resolve(process.cwd(), "primewire-debug-links.json");

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

const QUALITY_MAP = {
  quality_cam: "360",
  quality_ts: "480",
  quality_dvd: "720",
  quality_hd: "1080",
};

const createAxiosInstance = () =>
  axios.create({
    headers: {
      "User-Agent": USER_AGENT,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

const mapQuality = (className) => {
  if (!className) return undefined;
  for (const token of className.split(" ")) {
    if (QUALITY_MAP[token]) {
      return QUALITY_MAP[token];
    }
  }
  return undefined;
};

(async () => {
  const client = createAxiosInstance();
  const output = {
    movieUrl: MOVIE_URL,
    generatedAt: new Date().toISOString(),
    entries: [],
    streams: [],
  };

  try {
    const pageRes = await client.get(MOVIE_URL);
    const $ = cheerio.load(pageRes.data);

    const linkKeys = decodeLinkKeys($("#user-data").attr("v")) || [];
    const baseUrl = new URL(MOVIE_URL).origin;

    const entries = [];

    $("a.go-link").each((_, el) => {
      const versionAttr = $(el).attr("link_version");
      if (!versionAttr) return;

      const index = Number(versionAttr);
      if (Number.isNaN(index)) return;

      const row = $(el).closest("tr");
      entries.push({
        index,
        fallbackKey: $(el).attr("key") || null,
        host: row.find(".version-host").text().trim(),
        quality: mapQuality(row.find(".link_version_quality span").attr("class")),
      });
    });

    for (const entry of entries) {
      const key = linkKeys[entry.index] || entry.fallbackKey;
      if (!key) continue;

      const goUrl = `${baseUrl}/links/go/${encodeURIComponent(key)}?embed=true`;
      let goResponse = null;

      try {
        const res = await client.get(goUrl, {
          headers: { Referer: MOVIE_URL },
        });
        goResponse = res.data;
      } catch (error) {
        goResponse = { error: error.message };
      }

      output.entries.push({
        index: entry.index,
        host: entry.host,
        quality: entry.quality || null,
        keySource: linkKeys[entry.index] ? "decoded" : entry.fallbackKey ? "fallback" : "unknown",
        key,
        goUrl,
        goResponse,
      });
    }

    try {
      const streams = await getStream({
        link: MOVIE_URL,
        type: "movie",
        providerContext: {
          axios,
          cheerio,
          Aes: null,
          commonHeaders: {},
          getBaseUrl: async () => baseUrl,
          extractors: {
            hubcloudExtracter: async () => [],
            gofileExtracter: async () => ({ link: "", token: "" }),
            superVideoExtractor: async () => "",
            gdFlixExtracter: async () => [],
            nexdriveExtractor: async () => [],
            fastdlExtractor: async () => [],
            vcloudExtractor: async () => [],
            filepresExtractor: async () => [],
          },
        },
      });

      output.streams = streams;
    } catch (err) {
      output.streams = [{ error: err.message || String(err) }];
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
    console.log(`Debug data written to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error("Failed to collect debug data:", error.message);
    process.exit(1);
  }
})();
