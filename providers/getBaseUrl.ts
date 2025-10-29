const modflixData = require('./modflixData.js');

// 1 hour cache time
const expireTime = 60 * 60 * 1000;

// In-memory cache for base URLs
const urlCache = new Map<string, { url: string; timestamp: number }>();

export const getBaseUrl = async (providerValue: string): Promise<string> => {
  try {
    const cacheKey = providerValue;
    const now = Date.now();
    
    // Check cache first
    const cached = urlCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < expireTime) {
      return cached.url;
    }

    // Get URL from local modflix data
    const providerData = modflixData[providerValue];
    if (!providerData) {
      console.warn(`Provider '${providerValue}' not found in modflix data`);
      return "";
    }

    const baseUrl = providerData.url;
    
    // Cache the result
    urlCache.set(cacheKey, { url: baseUrl, timestamp: now });
    
    return baseUrl;
  } catch (error) {
    console.error(`Error getting baseUrl for provider: ${providerValue}`, error);
    return "";
  }
};
