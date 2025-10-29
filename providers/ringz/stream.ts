import { Stream, ProviderContext } from "../types";

// Cloudflare Access headers required for R2 bucket authentication
const headers = {
  "cf-access-client-id": "833049b087acf6e787cedfd85d1ccdb8.access",
  "cf-access-client-secret":
    "02db296a961d7513c3102d7785df4113eff036b2d57d060ffcc2ba3ba820c6aa",
};

export const getStream = async function ({
  link: data,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Stream[]> {
  const streamLinks: Stream[] = [];
  const dataJson = JSON.parse(data);
  
  // Check if URL is a Cloudflare R2 URL (requires authentication headers)
  const url = dataJson.url;
  // R2 buckets typically use .r2.dev domain or pub-*.r2.dev subdomain
  const isR2Url = url && (
    url.includes(".r2.dev") || 
    (url.includes("pub-") && url.includes(".dev")) ||
    url.startsWith("https://pub-")
  );
  
  streamLinks.push({
    link: url,
    server: dataJson.server,
    type: "mkv",
    // Add Cloudflare Access headers for R2 bucket URLs to prevent 401 errors
    // These headers authenticate with Cloudflare Access to allow access to protected R2 buckets
    headers: isR2Url ? headers : undefined,
  });
  return streamLinks;
};
