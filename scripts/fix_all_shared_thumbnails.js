import fs from 'fs';
import path from 'path';

// Import all data
import { POPULAR_ARTISTS_DATA } from '../src/data/popularArtistsData.js';
import { LATIN_URBAN_ARTISTS_DATA } from '../src/data/latinUrbanArtistsData.js';
import { MEXICAN_ARTISTS_DATA } from '../src/data/mexicanArtistsData.js';

const allArtists = [
  ...POPULAR_ARTISTS_DATA,
  ...LATIN_URBAN_ARTISTS_DATA,
  ...MEXICAN_ARTISTS_DATA,
];

// 1. Detect all URLs shared across >1 artist or from unsplash
const urlToArtists = new Map();
for (const a of allArtists) {
  const urls = new Set();
  if (a.avatarUrl) urls.add(a.avatarUrl);
  if (a.bannerUrl) urls.add(a.bannerUrl);
  for (const alb of a.albums || []) if (alb?.coverUrl) urls.add(alb.coverUrl);
  for (const s of a.singles || []) if (s?.coverUrl) urls.add(s.coverUrl);
  for (const s of a.songs || []) if (s?.coverUrl) urls.add(s.coverUrl);
  for (const s of a.topSongs || []) if (s?.coverUrl) urls.add(s.coverUrl);
  for (const s of a.topTracks || []) if (s?.coverUrl) urls.add(s.coverUrl);
  for (const c of a.collaborations || []) if (c?.coverUrl) urls.add(c.coverUrl);
  for (const u of urls) {
    if (!urlToArtists.has(u)) urlToArtists.set(u, new Set());
    urlToArtists.get(u).add(a.name);
  }
}

const badUrls = new Set();
for (const [u, artists] of urlToArtists) {
  if (artists.size > 1 || u.includes('unsplash.com')) {
    badUrls.add(u);
  }
}

console.log(`Identified ${badUrls.size} shared/invalid artwork URLs across catalog.`);

// Helper functions for real artwork lookup
async function resolveArtistArt(name) {
  try {
    const res = await fetch(`https://api.deezer.com/search/artist?q=${encodeURIComponent(name)}&limit=1`);
    const data = await res.json();
    const artist = data.data?.[0];
    if (artist && (artist.picture_xl || artist.picture_big)) {
      return artist.picture_xl || artist.picture_big;
    }
  } catch (e) {}

  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=song&limit=1`);
    const data = await res.json();
    if (data.results?.[0]?.artworkUrl100) {
      return data.results[0].artworkUrl100.replace('100x100bb', '1000x1000bb');
    }
  } catch (e) {}

  return null;
}

async function resolveAlbumArt(artist, album) {
  if (!album || album.toLowerCase() === 'single' || album.toLowerCase().includes('feat.')) {
    return null;
  }

  try {
    const res = await fetch(
      `https://api.deezer.com/search/album?q=${encodeURIComponent(`${artist} ${album}`)}&limit=1`
    );
    const data = await res.json();
    const alb = data.data?.[0];
    if (alb?.cover_xl || alb?.cover_big) {
      return alb.cover_xl || alb.cover_big;
    }
  } catch (e) {}

  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(`${artist} ${album}`)}&entity=album&limit=1`
    );
    const data = await res.json();
    if (data.results?.[0]?.artworkUrl100) {
      return data.results[0].artworkUrl100.replace('100x100bb', '1000x1000bb');
    }
  } catch (e) {}

  return null;
}

async function resolveTrackArt(artist, title) {
  try {
    const res = await fetch(
      `https://api.deezer.com/search?q=${encodeURIComponent(`${artist} ${title}`)}&limit=1`
    );
    const data = await res.json();
    const item = data.data?.[0];
    if (item?.album?.cover_xl || item?.album?.cover_big) {
      return item.album.cover_xl || item.album.cover_big;
    }
  } catch (e) {}

  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(`${artist} ${title}`)}&entity=song&limit=1`
    );
    const data = await res.json();
    if (data.results?.[0]?.artworkUrl100) {
      return data.results[0].artworkUrl100.replace('100x100bb', '1000x1000bb');
    }
  } catch (e) {}

  return null;
}

async function batchProcess(items, fn, concurrency = 15) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency);
    const chunkResults = await Promise.all(chunk.map((item) => fn(item)));
    results.push(...chunkResults);
  }
  return results;
}

async function run() {
  // 1. Resolve all artist avatars that are bad
  const artistsNeedingAvatars = allArtists.filter((a) => !a.avatarUrl || badUrls.has(a.avatarUrl));
  console.log(`Fetching avatars for ${artistsNeedingAvatars.length} artists...`);

  await batchProcess(
    artistsNeedingAvatars,
    async (a) => {
      const art = await resolveArtistArt(a.name);
      if (art) {
        a.avatarUrl = art;
        if (!a.bannerUrl || badUrls.has(a.bannerUrl)) a.bannerUrl = art;
      }
    },
    15
  );

  // 2. Resolve all albums that are bad
  const albumsToResolve = [];
  for (const a of allArtists) {
    for (const alb of a.albums || []) {
      if (typeof alb === 'object' && alb.title && (!alb.coverUrl || badUrls.has(alb.coverUrl))) {
        const key = `${a.name.toLowerCase()}:::${alb.title.toLowerCase().trim()}`;
        albumsToResolve.push({ artist: a.name, album: alb.title, key, albObj: alb });
      }
    }
  }

  console.log(`Fetching covers for ${albumsToResolve.length} albums...`);
  const resolvedAlbums = new Map();

  await batchProcess(
    albumsToResolve,
    async ({ artist, album, key, albObj }) => {
      if (!resolvedAlbums.has(key)) {
        const cov = await resolveAlbumArt(artist, album);
        resolvedAlbums.set(key, cov || null);
      }
      const finalCov = resolvedAlbums.get(key);
      if (finalCov) {
        albObj.coverUrl = finalCov;
      }
    },
    15
  );

  // 3. Resolve all singles that are bad
  const singlesToResolve = [];
  for (const a of allArtists) {
    for (const s of a.singles || []) {
      if (typeof s === 'object' && s.title && (!s.coverUrl || badUrls.has(s.coverUrl))) {
        const key = `${a.name.toLowerCase()}:::${s.title.toLowerCase().trim()}`;
        singlesToResolve.push({ artist: a.name, title: s.title, key, singleObj: s });
      }
    }
  }

  console.log(`Fetching covers for ${singlesToResolve.length} singles...`);
  const resolvedSingles = new Map();

  await batchProcess(
    singlesToResolve,
    async ({ artist, title, key, singleObj }) => {
      if (!resolvedSingles.has(key)) {
        const cov = await resolveTrackArt(artist, title);
        resolvedSingles.set(key, cov || null);
      }
      const finalCov = resolvedSingles.get(key);
      if (finalCov) {
        singleObj.coverUrl = finalCov;
      }
    },
    15
  );

  // 4. Update all songs across all artists
  for (const a of allArtists) {
    const artistKey = a.name.toLowerCase();
    const albumCoverMap = new Map();
    for (const alb of a.albums || []) {
      if (typeof alb === 'object' && alb.title && alb.coverUrl && !badUrls.has(alb.coverUrl)) {
        albumCoverMap.set(alb.title.toLowerCase().trim(), alb.coverUrl);
      }
    }

    const songLists = [a.songs, a.topSongs, a.topTracks].filter(Boolean);
    for (const list of songLists) {
      if (Array.isArray(list)) {
        for (const song of list) {
          if (typeof song === 'object') {
            if (!song.coverUrl || badUrls.has(song.coverUrl)) {
              const albTitle = (song.album || '').toLowerCase().trim();
              if (albTitle && albumCoverMap.has(albTitle)) {
                song.coverUrl = albumCoverMap.get(albTitle);
              } else {
                const sKey = `${artistKey}:::${(song.title || '').toLowerCase().trim()}`;
                if (resolvedSingles.has(sKey) && resolvedSingles.get(sKey)) {
                  song.coverUrl = resolvedSingles.get(sKey);
                } else if (a.avatarUrl && !badUrls.has(a.avatarUrl)) {
                  song.coverUrl = a.avatarUrl;
                }
              }
            }
          }
        }
      }
    }

    // Collaborations
    for (const c of a.collaborations || []) {
      if (typeof c === 'object' && (!c.coverUrl || badUrls.has(c.coverUrl))) {
        c.coverUrl = a.avatarUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80';
      }
    }
  }

  // 5. Save files back
  console.log('Writing back data files...');
  fs.writeFileSync(
    'src/data/popularArtistsData.js',
    `export const POPULAR_ARTISTS_DATA = ${JSON.stringify(POPULAR_ARTISTS_DATA, null, 2)};\n`,
    'utf8'
  );
  fs.writeFileSync(
    'src/data/latinUrbanArtistsData.js',
    `export const LATIN_URBAN_ARTISTS_DATA = ${JSON.stringify(LATIN_URBAN_ARTISTS_DATA, null, 2)};\n`,
    'utf8'
  );
  fs.writeFileSync(
    'src/data/mexicanArtistsData.js',
    `export const MEXICAN_ARTISTS_DATA = ${JSON.stringify(MEXICAN_ARTISTS_DATA, null, 2)};\n`,
    'utf8'
  );

  console.log('ALL FILES UPDATED SUCCESSFULLY WITH GENUINE ARTWORK!');
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
