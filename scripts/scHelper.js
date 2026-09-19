import fs from 'fs';
import path from 'path';

const scCacheFile = path.join(process.cwd(), 'src/data/soundcloudCache.json');
let cache = {};
if (fs.existsSync(scCacheFile)) {
  try {
    cache = JSON.parse(fs.readFileSync(scCacheFile, 'utf8'));
  } catch (e) {
    console.error('Failed reading cache:', e);
  }
}

if (!cache._artistAvatars) cache._artistAvatars = {};

async function resolveTrack(title, artist) {
  const query = `${artist} ${title}`.trim();
  const cacheKey = query.toLowerCase();

  for (const [k, v] of Object.entries(cache)) {
    if (!k.startsWith('_') && k.toLowerCase() === cacheKey && v.trackUrl && v.artworkUrl) {
      return v;
    }
  }

  try {
    const searchUrl = `https://soundcloud.com/search/sounds?q=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, {
      signal: AbortSignal.timeout(3500),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    if (!response.ok) return null;
    const html = await response.text();
    const systemPaths = new Set([
      'search', 'popular', 'pages', 'terms', 'settings', 'signin', 'upload',
      'mobile', 'you', 'charts', 'stream', 'discover', 'notifications', 'messages', 'stations'
    ]);

    const matches = [...html.matchAll(/href="\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+)"/g)]
      .map((m) => m[1])
      .filter((p) => !systemPaths.has(p.split('/')[0]));

    if (!matches.length) return null;

    const trackUrl = `https://soundcloud.com/${matches[0]}`;
    let artworkUrl = null;
    let trackTitle = query;
    let author = artist;

    try {
      const oembedRes = await fetch(`https://soundcloud.com/oembed?url=${encodeURIComponent(trackUrl)}&format=json`, {
        signal: AbortSignal.timeout(3000),
      });
      if (oembedRes.ok) {
        const odata = await oembedRes.json();
        trackTitle = odata.title || query;
        author = odata.author_name || artist;
        if (odata.thumbnail_url) {
          artworkUrl = odata.thumbnail_url.replace('-large', '-t500x500');
        }
      }
    } catch (e) {}

    const resObj = { trackUrl, title: trackTitle, author, artworkUrl };
    cache[query] = resObj;
    return resObj;
  } catch (err) {
    return null;
  }
}

function saveCache() {
  fs.writeFileSync(scCacheFile, JSON.stringify(cache, null, 2), 'utf8');
}

export { cache, scCacheFile, resolveTrack, saveCache };
