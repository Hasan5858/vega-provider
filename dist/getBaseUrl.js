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
exports.getBaseUrl = void 0;
const modflixData = require('./modflixData.js');
// 1 hour cache time
const expireTime = 60 * 60 * 1000;
// In-memory cache for base URLs
const urlCache = new Map();
const getBaseUrl = (providerValue) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        console.error(`Error getting baseUrl for provider: ${providerValue}`, error);
        return "";
    }
});
exports.getBaseUrl = getBaseUrl;
