import fs from 'fs';
import path from 'path';

// Load soundcloudCache.json to link exact artwork and URLs
const scCache = JSON.parse(fs.readFileSync('src/data/soundcloudCache.json', 'utf8'));

// Helper to look up cache entry
function findInCache(title, artist) {
  const cleanTitle = (title || '').toLowerCase().trim();
  const cleanArtist = (artist || '').toLowerCase().trim();

  // Try exact key or contains
  for (const [k, v] of Object.entries(scCache)) {
    if (k.startsWith('_')) continue;
    const lk = k.toLowerCase();
    if (lk.includes(cleanTitle) && (cleanArtist ? lk.includes(cleanArtist) : true)) {
      return v;
    }
  }
  for (const [k, v] of Object.entries(scCache)) {
    if (k.startsWith('_')) continue;
    if (k.toLowerCase().includes(cleanTitle)) {
      return v;
    }
  }
  return null;
}

console.log('Building comprehensive musicData.js...');
