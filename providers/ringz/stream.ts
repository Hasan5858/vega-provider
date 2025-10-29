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
  // Apply headers to all R2 URLs to ensure authentication
  const isR2Url = url && typeof url === 'string' && (
    url.includes(".r2.dev") || 
    url.match(/https?:\/\/pub-[a-z0-9]+\.dev/i) ||
    url.match(/https?:\/\/pub-[a-z0-9-]+\.r2\.dev/i)
  );
  
  const streamHeaders = isR2Url ? {...headers} : undefined;
  console.log("🔐 [Ringz Stream] URL:", url);
  console.log("🔐 [Ringz Stream] Is R2 URL:", isR2Url);
  console.log("🔐 [Ringz Stream] Headers:", streamHeaders ? Object.keys(streamHeaders).join(", ") : "none");
  
  streamLinks.push({
    link: url,
    server: dataJson.server,
    type: "mkv",
    // Add Cloudflare Access headers for R2 bucket URLs to prevent 401 errors
    // These headers authenticate with Cloudflare Access to allow access to protected R2 buckets
    headers: streamHeaders,
  });
  return streamLinks;
};
