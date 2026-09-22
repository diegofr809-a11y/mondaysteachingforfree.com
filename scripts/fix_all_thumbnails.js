import fs from 'fs';
import path from 'path';

const dummyTokens = [
  'HiqENlLH65c8',
  'dzr0iQ25h94R',
  'u3o9n6zY4T8w',
  'sIe6wPjD3n5M',
  'dVQGeww2LeSX',
  'i6j5XoFgIa9o',
  'T4yzIIA2Hulk',
  'gmTcWmRc6zIZgzSm',
  'VIQ3As8XCQ1K',
  'gWigktVCPjMq',
  'UMCMlAzFBWD7',
  'IzAqtZGswYwF',
  'zqdoKr3yOMYJ',
  'r2QezpLYTmM9',
  '79yNOZwPoZpp'
];

function isDummyUrl(url) {
  if (!url || typeof url !== 'string') return true;
  if (url.includes('images.unsplash.com')) return true;
  return dummyTokens.some((t) => url.includes(t));
}

// Deezer artist resolver
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

// Album artwork resolver
async function resolveAlbumArt(artist, album) {
  if (!album || album.toLowerCase() === 'single' || album.toLowerCase().includes('feat.')) {
    return null;
  }

  // 1. Deezer album search
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

  // 2. iTunes album search
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

// Track artwork resolver
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

// Batch helper with concurrency limit
async function batchProcess(items, fn, concurrency = 10) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency);
    const chunkResults = await Promise.all(chunk.map((item) => fn(item)));
    results.push(...chunkResults);
  }
  return results;
}

async function fixFile(relPath, exportName) {
  const fullPath = path.resolve(process.cwd(), relPath);
  console.log(`\n=== Processing ${relPath} ===`);
  const mod = await import(fullPath);
  const artists = mod[exportName];

  // 1. Identify artists with dummy avatars
  const artistsNeedingAvatars = artists.filter((a) => isDummyUrl(a.avatarUrl));
  console.log(`Artists needing avatars: ${artistsNeedingAvatars.length}`);

  await batchProcess(
    artistsNeedingAvatars,
    async (a) => {
      const art = await resolveArtistArt(a.name);
      if (art) {
        a.avatarUrl = art;
        if (isDummyUrl(a.bannerUrl)) a.bannerUrl = art;
      }
    },
    10
  );

  // 2. Identify unique albums needing covers
  const albumKeyMap = new Map(); // key -> { artist, album }
  for (const a of artists) {
    if (Array.isArray(a.albums)) {
      for (const alb of a.albums) {
        if (typeof alb === 'object' && alb.title && isDummyUrl(alb.coverUrl)) {
          const key = `${a.name.toLowerCase()}:::${alb.title.toLowerCase().trim()}`;
          if (!albumKeyMap.has(key)) {
            albumKeyMap.set(key, { artist: a.name, album: alb.title, key });
          }
        }
      }
    }
  }

  console.log(`Unique albums needing covers: ${albumKeyMap.size}`);
  const resolvedAlbums = new Map();

  await batchProcess(
    Array.from(albumKeyMap.values()),
    async ({ artist, album, key }) => {
      const cover = await resolveAlbumArt(artist, album);
      if (cover) {
        resolvedAlbums.set(key, cover);
      }
    },
    12
  );

  // 3. Identify unique singles needing covers
  const singleKeyMap = new Map();
  for (const a of artists) {
    if (Array.isArray(a.singles)) {
      for (const s of a.singles) {
        if (typeof s === 'object' && s.title && isDummyUrl(s.coverUrl)) {
          const key = `${a.name.toLowerCase()}:::${s.title.toLowerCase().trim()}`;
          if (!singleKeyMap.has(key)) {
            singleKeyMap.set(key, { artist: a.name, title: s.title, key });
          }
        }
      }
    }
  }

  console.log(`Unique singles needing covers: ${singleKeyMap.size}`);
  const resolvedSingles = new Map();

  await batchProcess(
    Array.from(singleKeyMap.values()),
    async ({ artist, title, key }) => {
      const cover = await resolveTrackArt(artist, title);
      if (cover) {
        resolvedSingles.set(key, cover);
      }
    },
    12
  );

  // 4. Update data in memory
  for (const a of artists) {
    const artistKey = a.name.toLowerCase();
    const artistAlbumCovers = new Map();

    if (Array.isArray(a.albums)) {
      for (const alb of a.albums) {
        if (typeof alb === 'object' && alb.title) {
          const key = `${artistKey}:::${alb.title.toLowerCase().trim()}`;
          if (resolvedAlbums.has(key)) {
            alb.coverUrl = resolvedAlbums.get(key);
          } else if (isDummyUrl(alb.coverUrl) && a.avatarUrl && !isDummyUrl(a.avatarUrl)) {
            alb.coverUrl = a.avatarUrl;
          }
          artistAlbumCovers.set(alb.title.toLowerCase().trim(), alb.coverUrl);
        }
      }
    }

    if (Array.isArray(a.singles)) {
      for (const s of a.singles) {
        if (typeof s === 'object' && s.title) {
          const key = `${artistKey}:::${s.title.toLowerCase().trim()}`;
          if (resolvedSingles.has(key)) {
            s.coverUrl = resolvedSingles.get(key);
          } else if (isDummyUrl(s.coverUrl) && a.avatarUrl && !isDummyUrl(a.avatarUrl)) {
            s.coverUrl = a.avatarUrl;
          }
        }
      }
    }

    if (Array.isArray(a.collaborations)) {
      for (const c of a.collaborations) {
        if (typeof c === 'object' && c.title && isDummyUrl(c.coverUrl)) {
          c.coverUrl = a.avatarUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80';
        }
      }
    }

    // Update songs
    const songLists = [a.songs, a.topSongs, a.topTracks].filter(Boolean);
    for (const list of songLists) {
      if (Array.isArray(list)) {
        for (const song of list) {
          if (typeof song === 'object') {
            if (isDummyUrl(song.coverUrl)) {
              const albTitle = (song.album || '').toLowerCase().trim();
              if (albTitle && artistAlbumCovers.has(albTitle)) {
                song.coverUrl = artistAlbumCovers.get(albTitle);
              } else {
                const sKey = `${artistKey}:::${(song.title || '').toLowerCase().trim()}`;
                if (resolvedSingles.has(sKey)) {
                  song.coverUrl = resolvedSingles.get(sKey);
                } else if (a.avatarUrl && !isDummyUrl(a.avatarUrl)) {
                  song.coverUrl = a.avatarUrl;
                }
              }
            }
          }
        }
      }
    }
  }

  // 5. Write back file
  const outCode = `export const ${exportName} = ${JSON.stringify(artists, null, 2)};\n`;
  fs.writeFileSync(fullPath, outCode, 'utf8');
  console.log(`Successfully updated and saved ${relPath}!`);
}

async function main() {
  await fixFile('src/data/popularArtistsData.js', 'POPULAR_ARTISTS_DATA');
  await fixFile('src/data/latinUrbanArtistsData.js', 'LATIN_URBAN_ARTISTS_DATA');
  await fixFile('src/data/mexicanArtistsData.js', 'MEXICAN_ARTISTS_DATA');
  console.log('\nAll 3 artist databases completely repaired with genuine artwork!');
}

main().catch((err) => {
  console.error('Fatal error in repair script:', err);
  process.exit(1);
});
