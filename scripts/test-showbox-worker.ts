#!/usr/bin/env node
/**
 * Test script for Showbox provider with Cloudflare Worker
 * Tests all endpoints: catalog, posts, search, meta, episodes, stream
 */

const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const WORKER_URL = 'https://showbox.steep-bread-3c84.workers.dev';

// Mock provider context
const providerContext = {
  axios: axios,
  cheerio: cheerio,
  getBaseUrl: async (provider: string) => WORKER_URL,
};

// Import provider functions (will need to compile first or use dist)
async function testCatalog() {
  console.log('\n=== Testing Catalog ===');
  try {
    // catalog.ts is static, just check it exists
    const catalog = require(path.join(process.cwd(), 'dist', 'showbox', 'catalog.js'));
    console.log('Catalog:', catalog.catalog);
    console.log('✅ Catalog loaded successfully');
    return true;
  } catch (error: any) {
    console.error('❌ Catalog test failed:', error?.message || error);
    return false;
  }
}

async function testPosts() {
  console.log('\n=== Testing Posts (Catalog Items) ===');
  try {
    const posts = require(path.join(process.cwd(), 'dist', 'showbox', 'posts.js'));
    
    // Test movies catalog
    console.log('\n--- Testing Movies Catalog (page 1) ---');
    const movies = await posts.getPosts({
      filter: '/movie',
      page: 1,
      providerValue: 'showbox',
      signal: new AbortController().signal,
      providerContext,
    });
    
    console.log(`Found ${movies.length} movies`);
    if (movies.length > 0) {
      console.log('Sample movie:', {
        title: movies[0].title,
        link: movies[0].link,
        image: movies[0].image?.substring(0, 50) + '...',
      });
      console.log('✅ Movies catalog working');
    } else {
      console.log('⚠️  No movies found - might be worker issue or empty page');
    }
    
    // Test TV shows catalog
    console.log('\n--- Testing TV Shows Catalog (page 1) ---');
    const shows = await posts.getPosts({
      filter: '/tv',
      page: 1,
      providerValue: 'showbox',
      signal: new AbortController().signal,
      providerContext,
    });
    
    console.log(`Found ${shows.length} TV shows`);
    if (shows.length > 0) {
      console.log('Sample show:', {
        title: shows[0].title,
        link: shows[0].link,
        image: shows[0].image?.substring(0, 50) + '...',
      });
      console.log('✅ TV Shows catalog working');
    } else {
      console.log('⚠️  No TV shows found - might be worker issue or empty page');
    }
    
    return movies.length > 0 || shows.length > 0;
  } catch (error: any) {
    console.error('❌ Posts test failed:', error?.message || error);
    console.error(error?.stack);
    return false;
  }
}

async function testSearch() {
  console.log('\n=== Testing Search ===');
  try {
    const posts = require(path.join(process.cwd(), 'dist', 'showbox', 'posts.js'));
    
    console.log('\n--- Testing Search for "avengers" ---');
    const results = await posts.getSearchPosts({
      searchQuery: 'avengers',
      page: 1,
      providerValue: 'showbox',
      signal: new AbortController().signal,
      providerContext,
    });
    
    console.log(`Found ${results.length} search results`);
    if (results.length > 0) {
      console.log('Sample result:', {
        title: results[0].title,
        link: results[0].link,
        image: results[0].image?.substring(0, 50) + '...',
      });
      console.log('✅ Search working');
      return true;
    } else {
      console.log('⚠️  No search results found');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Search test failed:', error?.message || error);
    console.error(error?.stack);
    return false;
  }
}

async function testMeta() {
  console.log('\n=== Testing Meta (Movie/Show Details) ===');
  try {
    const posts = require(path.join(process.cwd(), 'dist', 'showbox', 'posts.js'));
    const meta = require(path.join(process.cwd(), 'dist', 'showbox', 'meta.js'));
    
    // First get a movie link
    console.log('\n--- Getting a movie link first ---');
    const movies = await posts.getPosts({
      filter: '/movie',
      page: 1,
      providerValue: 'showbox',
      signal: new AbortController().signal,
      providerContext,
    });
    
    if (movies.length === 0) {
      console.log('⚠️  No movies found, cannot test meta');
      return false;
    }
    
    const testLink = movies[0].link;
    console.log(`Testing meta for: ${testLink}`);
    
    const metaData = await meta.getMeta({
      link: testLink,
      providerContext,
    });
    
    console.log('Meta result:', {
      title: metaData.title,
      type: metaData.type,
      rating: metaData.rating,
      hasImage: !!metaData.image,
      hasSynopsis: !!metaData.synopsis,
      linkListCount: metaData.linkList?.length || 0,
    });
    
    if (metaData.linkList && metaData.linkList.length > 0) {
      console.log('Sample link:', {
        title: metaData.linkList[0].title,
        hasEpisodesLink: !!metaData.linkList[0].episodesLink,
      });
    }
    
    if (metaData.title) {
      console.log('✅ Meta working');
      return true;
    } else {
      console.log('⚠️  Meta returned empty title');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Meta test failed:', error?.message || error);
    console.error(error?.stack);
    return false;
  }
}

async function testEpisodes() {
  console.log('\n=== Testing Episodes ===');
  try {
    const posts = require(path.join(process.cwd(), 'dist', 'showbox', 'posts.js'));
    const meta = require(path.join(process.cwd(), 'dist', 'showbox', 'meta.js'));
    const episodes = require(path.join(process.cwd(), 'dist', 'showbox', 'episodes.js'));
    
    // Get a TV show
    console.log('\n--- Getting a TV show link first ---');
    const shows = await posts.getPosts({
      filter: '/tv',
      page: 1,
      providerValue: 'showbox',
      signal: new AbortController().signal,
      providerContext,
    });
    
    if (shows.length === 0) {
      console.log('⚠️  No TV shows found, cannot test episodes');
      return false;
    }
    
    const testLink = shows[0].link;
    console.log(`Getting meta for TV show: ${testLink}`);
    
    const metaData = await meta.getMeta({
      link: testLink,
      providerContext,
    });
    
    if (!metaData.linkList || metaData.linkList.length === 0) {
      console.log('⚠️  No linkList found in meta, cannot test episodes');
      return false;
    }
    
    // Find a folder (season) with episodesLink
    const seasonLink = metaData.linkList.find((link: any) => link.episodesLink && link.episodesLink.includes('&'));
    
    if (!seasonLink) {
      console.log('⚠️  No season folder found with episodesLink');
      return false;
    }
    
    console.log(`Testing episodes for: ${seasonLink.episodesLink}`);
    
    const episodeList = await episodes.getEpisodes({
      url: seasonLink.episodesLink,
      providerContext,
    });
    
    console.log(`Found ${episodeList.length} episodes`);
    if (episodeList.length > 0) {
      console.log('Sample episodes:', episodeList.slice(0, 3).map((ep: any) => ({
        title: ep.title,
        link: ep.link?.substring(0, 50) + '...',
      })));
      console.log('✅ Episodes working');
      return true;
    } else {
      console.log('⚠️  No episodes found');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Episodes test failed:', error?.message || error);
    console.error(error?.stack);
    return false;
  }
}

async function testStream() {
  console.log('\n=== Testing Stream ===');
  try {
    const posts = require(path.join(process.cwd(), 'dist', 'showbox', 'posts.js'));
    const meta = require(path.join(process.cwd(), 'dist', 'showbox', 'meta.js'));
    const episodes = require(path.join(process.cwd(), 'dist', 'showbox', 'episodes.js'));
    const stream = require(path.join(process.cwd(), 'dist', 'showbox', 'stream.js'));
    
    // Try to get a stream link from a series first
    console.log('\n--- Getting an episode link first ---');
    const shows = await posts.getPosts({
      filter: '/tv',
      page: 1,
      providerValue: 'showbox',
      signal: new AbortController().signal,
      providerContext,
    });
    
    if (shows.length === 0) {
      console.log('⚠️  No TV shows found, trying movie instead...');
      // Try movie as fallback
      const movies = await posts.getPosts({
        filter: '/movie',
        page: 1,
        providerValue: 'showbox',
        signal: new AbortController().signal,
        providerContext,
      });
      
      if (movies.length === 0) {
        console.log('⚠️  No content found, cannot test stream');
        return false;
      }
      
      // For movies, check if meta has direct links
      const movieMeta = await meta.getMeta({
        link: movies[0].link,
        providerContext,
      });
      
      if (!movieMeta.linkList || movieMeta.linkList.length === 0) {
        console.log('⚠️  No linkList found, cannot test stream');
        return false;
      }
      
      // Movies might have files directly, but we need episode format
      console.log('⚠️  Stream test requires episode link, skipping for movies');
      return false;
    }
    
    const showMeta = await meta.getMeta({
      link: shows[0].link,
      providerContext,
    });
    
    if (!showMeta.linkList || showMeta.linkList.length === 0) {
      console.log('⚠️  No linkList found, cannot test stream');
      return false;
    }
    
    const seasonLink = showMeta.linkList.find((link: any) => link.episodesLink && link.episodesLink.includes('&'));
    
    if (!seasonLink) {
      console.log('⚠️  No season folder found');
      return false;
    }
    
    const episodeList = await episodes.getEpisodes({
      url: seasonLink.episodesLink,
      providerContext,
    });
    
    if (episodeList.length === 0) {
      console.log('⚠️  No episodes found');
      return false;
    }
    
    const testEpisodeLink = episodeList[0].link;
    console.log(`Testing stream for episode: ${testEpisodeLink}`);
    
    const streams = await stream.getStream({
      link: testEpisodeLink,
      type: 'series',
      signal: new AbortController().signal,
      providerContext,
    });
    
    console.log(`Found ${streams.length} stream options`);
    if (streams.length > 0) {
      console.log('Sample streams:', streams.slice(0, 2).map((s: any) => ({
        server: s.server,
        type: s.type,
        link: s.link?.substring(0, 60) + '...',
      })));
      console.log('✅ Stream working');
      return true;
    } else {
      console.log('⚠️  No streams found');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Stream test failed:', error?.message || error);
    console.error(error?.stack);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing Showbox Provider with Cloudflare Worker');
  console.log(`Worker URL: ${WORKER_URL}`);
  
  // Ensure dist is built
  try {
    require(path.join(process.cwd(), 'dist', 'showbox', 'catalog.js'));
  } catch {
    console.error('❌ Dist files not found. Please run: npm run build');
    process.exit(1);
  }
  
  const results = {
    catalog: await testCatalog(),
    posts: await testPosts(),
    search: await testSearch(),
    meta: await testMeta(),
    episodes: await testEpisodes(),
    stream: await testStream(),
  };
  
  console.log('\n=== Test Summary ===');
  console.log(`Catalog: ${results.catalog ? '✅' : '❌'}`);
  console.log(`Posts: ${results.posts ? '✅' : '❌'}`);
  console.log(`Search: ${results.search ? '✅' : '❌'}`);
  console.log(`Meta: ${results.meta ? '✅' : '❌'}`);
  console.log(`Episodes: ${results.episodes ? '✅' : '❌'}`);
  console.log(`Stream: ${results.stream ? '✅' : '❌'}`);
  
  const allPassed = Object.values(results).every(r => r);
  if (allPassed) {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed or returned no data');
    process.exit(1);
  }
}

main().catch(console.error);

