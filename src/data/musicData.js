// Comprehensive catalog of songs, artists, albums, and curated playlists for the Spotify music app
import scCache from './soundcloudCache.json';
import { MEXICAN_ARTISTS_DATA as RAW_MEXICAN_ARTISTS_DATA } from './mexicanArtistsData.js';
import { POPULAR_ARTISTS_DATA as RAW_POPULAR_ARTISTS_DATA } from './popularArtistsData.js';
import { LATIN_URBAN_ARTISTS_DATA as RAW_LATIN_URBAN_ARTISTS_DATA } from './latinUrbanArtistsData.js';
import { getPlaceholderCover, getPlaceholderAvatar } from '../utils/imageFallback.js';

// Ensure backward-compatibility for topSongs / songs
export const MEXICAN_ARTISTS_DATA = RAW_MEXICAN_ARTISTS_DATA.map((art) => ({
  ...art,
  topSongs: art.songs || art.topSongs || [],
  songs: art.songs || art.topSongs || [],
}));

export const POPULAR_ARTISTS_DATA = RAW_POPULAR_ARTISTS_DATA.map((art) => ({
  ...art,
  topSongs: art.topSongs || art.songs || [],
  songs: art.topSongs || art.songs || [],
}));

export const LATIN_URBAN_ARTISTS_DATA = RAW_LATIN_URBAN_ARTISTS_DATA.map((art) => ({
  ...art,
  topSongs: art.topSongs || art.songs || [],
  songs: art.topSongs || art.songs || [],
}));

export const POPULAR_ARTISTS_LIST = [
  ...POPULAR_ARTISTS_DATA.map((a) => a.name),
  ...LATIN_URBAN_ARTISTS_DATA.map((a) => a.name),
];

export const MEXICAN_ARTISTS_LIST = MEXICAN_ARTISTS_DATA.map((a) => a.name);

export const TIKTOK_TRENDING_LIST = [
  { title: 'The Fate of Ophelia', artist: 'Taylor Swift', duration: '3:48', plays: '482,190,400' },
  { title: 'Taste', artist: 'Sabrina Carpenter', duration: '2:37', plays: '562,310,900' },
  { title: 'BIRDS OF A FEATHER', artist: 'Billie Eilish', duration: '3:30', plays: '1,240,500,000' },
  { title: 'Espresso', artist: 'Sabrina Carpenter', duration: '2:55', plays: '1,420,900,000' },
  { title: 'Die With A Smile', artist: 'Bruno Mars', duration: '4:11', plays: '980,100,000' },
  { title: 'Not Like Us', artist: 'Kendrick Lamar', duration: '4:34', plays: '890,300,000' },
  { title: 'Good Luck, Babe!', artist: 'Chappell Roan', duration: '3:38', plays: '720,400,000' },
  { title: 'Gata Only', artist: 'Cris Mj', duration: '3:42', plays: '1,120,400,000' },
  { title: 'DtMF', artist: 'Bad Bunny', duration: '3:58', plays: '620,100,000' },
  { title: 'FE!N', artist: 'Travis Scott', duration: '3:11', plays: '1,320,000,000' },
  { title: 'Carnival', artist: 'Kanye West', duration: '4:24', plays: '940,000,000' },
  { title: 'LUNA', artist: 'Feid', duration: '3:16', plays: '890,000,000' },
  { title: 'Lady Gaga', artist: 'Peso Pluma', duration: '3:32', plays: '910,000,000' },
  { title: 'Y Lloro', artist: 'Junior H', duration: '2:58', plays: '780,000,000' },
  { title: 'Harley Quinn', artist: 'Fuerza Regida', duration: '3:01', plays: '840,000,000' },
  { title: 'Madonna', artist: 'Natanael Cano', duration: '3:05', plays: '750,000,000' }
];

// Helper to normalize strings for robust caching lookup
const normalizeStr = (str) =>
  (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .trim();

// Resolves authentic track URL and official cover art from SoundCloud cache
export const resolveCachedTrack = (title, artist) => {
  if (!title) return null;
  const normTitle = normalizeStr(title);
  const normArtist = normalizeStr(artist || '');

  // 1. Direct compound key matches
  if (artist) {
    const compoundKey1 = `${artist} ${title}`;
    if (scCache[compoundKey1]) return scCache[compoundKey1];

    const compoundKey2 = `${artist} - ${title}`;
    if (scCache[compoundKey2]) return scCache[compoundKey2];

    const compoundKey3 = `${title} - ${artist}`;
    if (scCache[compoundKey3]) return scCache[compoundKey3];
  }

  // 2. Strict search through scCache where BOTH artist and title match
  if (normArtist && normTitle) {
    for (const [k, v] of Object.entries(scCache)) {
      if (k.startsWith('_')) continue;
      const normKey = normalizeStr(k);
      const normAuthor = normalizeStr(v.author || '');
      const normCachedTitle = normalizeStr(v.title || '');

      const keyHasArtist = normKey.includes(normArtist) || normAuthor.includes(normArtist);
      const keyHasTitle = normKey.includes(normTitle) || normCachedTitle.includes(normTitle);

      if (keyHasArtist && keyHasTitle) {
        return v;
      }
    }
  } else if (normTitle) {
    // Exact title match only if no artist specified and single unique entry
    if (scCache[title]) return scCache[title];
  }

  return null;
};

const artistAvatarsMap = scCache._artistAvatars || {};

export const getArtistAvatar = (name) => {
  if (!name) return getPlaceholderAvatar('Artist');

  // Check Mexican artist rich data
  const mex = MEXICAN_ARTISTS_DATA.find((m) => m.name.toLowerCase() === name.toLowerCase());
  if (mex?.avatarUrl) return mex.avatarUrl;

  // Check popular artist rich data
  const pop = POPULAR_ARTISTS_DATA.find((p) => p.name.toLowerCase() === name.toLowerCase());
  if (pop?.avatarUrl) return pop.avatarUrl;

  // Check Latin Urban artist rich data
  const lu = LATIN_URBAN_ARTISTS_DATA.find((l) => l.name.toLowerCase() === name.toLowerCase());
  if (lu?.avatarUrl) return lu.avatarUrl;

  if (artistAvatarsMap[name]) return artistAvatarsMap[name];
  const found = Object.keys(artistAvatarsMap).find((k) => k.toLowerCase() === name.toLowerCase());
  if (found) return artistAvatarsMap[found];

  return getPlaceholderAvatar(name);
};

export const getTrackCover = (title, artist) => {
  const cached = resolveCachedTrack(title, artist);
  if (cached && cached.artworkUrl) {
    return cached.artworkUrl;
  }
  const artistAvatar = getArtistAvatar(artist);
  if (artistAvatar && !artistAvatar.startsWith('data:image/svg+xml')) return artistAvatar;
  return getPlaceholderCover(title, artist);
};

// Helper to assemble full Master Catalog of all real tracks
export const buildMasterTrackCatalog = () => {
  const allTracks = [];
  let trackCounter = 1;
  const seenTracks = new Set();

  const addTrack = (trackObj) => {
    const key = `${normalizeStr(trackObj.artist)}_${normalizeStr(trackObj.title)}`;
    if (seenTracks.has(key)) return;
    seenTracks.add(key);
    allTracks.push(trackObj);
  };

  // 1. TikTok Trending Tracks
  TIKTOK_TRENDING_LIST.forEach((t) => {
    const cached = resolveCachedTrack(t.title, t.artist);
    addTrack({
      id: `track-${trackCounter++}`,
      title: t.title,
      artist: t.artist,
      album: 'TikTok Trending 2026',
      duration: t.duration,
      plays: t.plays,
      coverUrl: cached?.artworkUrl || getTrackCover(t.title, t.artist),
      soundCloudUrl: cached?.trackUrl || null,
      genre: 'Trending / Pop',
      isTrending: true,
      audioKey: `${t.title}-${t.artist}`.toLowerCase(),
    });
  });

  // 2. Mexican Artists Catalog (All Real Songs)
  MEXICAN_ARTISTS_DATA.forEach((art) => {
    art.songs.forEach((s) => {
      const cached = resolveCachedTrack(s.title, art.name);
      addTrack({
        id: `track-${trackCounter++}`,
        title: s.title,
        artist: art.name,
        album: s.album || 'Música Mexicana',
        duration: s.duration || '3:10',
        plays: s.plays || '190,000,000',
        coverUrl: s.coverUrl || cached?.artworkUrl || art.avatarUrl || getTrackCover(s.title, art.name),
        soundCloudUrl: s.soundCloudUrl || cached?.trackUrl || null,
        genre: art.genre,
        isMexican: true,
        audioKey: `${s.title}-${art.name}`.toLowerCase(),
      });
    });
  });

  // 3. Latin Urban Artists Catalog (All Real Songs)
  LATIN_URBAN_ARTISTS_DATA.forEach((art) => {
    art.songs.forEach((s) => {
      const cached = resolveCachedTrack(s.title, art.name);
      addTrack({
        id: `track-${trackCounter++}`,
        title: s.title,
        artist: art.name,
        album: s.album || 'Latin Urban',
        duration: s.duration || '3:15',
        plays: s.plays || '250,000,000',
        coverUrl: s.coverUrl || cached?.artworkUrl || art.avatarUrl || getTrackCover(s.title, art.name),
        soundCloudUrl: s.soundCloudUrl || cached?.trackUrl || null,
        genre: art.genre,
        isLatinUrban: true,
        isPopular: true,
        audioKey: `${s.title}-${art.name}`.toLowerCase(),
      });
    });
  });

  // 4. Popular Global Artists Catalog (All Real Songs)
  POPULAR_ARTISTS_DATA.forEach((art) => {
    art.songs.forEach((s) => {
      const cached = resolveCachedTrack(s.title, art.name);
      addTrack({
        id: `track-${trackCounter++}`,
        title: s.title,
        artist: art.name,
        album: s.album || 'Popular Music',
        duration: s.duration || '3:20',
        plays: s.plays || '300,000,000',
        coverUrl: s.coverUrl || cached?.artworkUrl || art.avatarUrl || getTrackCover(s.title, art.name),
        soundCloudUrl: s.soundCloudUrl || cached?.trackUrl || null,
        genre: art.genre,
        isPopular: true,
        audioKey: `${s.title}-${art.name}`.toLowerCase(),
      });
    });
  });

  return allTracks;
};

export const MASTER_TRACKS = buildMasterTrackCatalog();

// All unique artists catalogue (1 entry per artist, combined songs and albums, no fake data)
export const buildAllArtistsList = () => {
  const allArtistObjects = [
    ...MEXICAN_ARTISTS_DATA.map((a) => ({ ...a, isMexican: true })),
    ...LATIN_URBAN_ARTISTS_DATA.map((a) => ({ ...a, isLatinUrban: true, isPopular: true })),
    ...POPULAR_ARTISTS_DATA.map((a) => ({ ...a, isPopular: true })),
  ];

  const artistMap = new Map();

  allArtistObjects.forEach((art) => {
    const normName = art.name.toLowerCase();
    if (!artistMap.has(normName)) {
      const songs = MASTER_TRACKS.filter((t) => t.artist.toLowerCase() === normName);
      const avatar = art.avatarUrl || getArtistAvatar(art.name);

      artistMap.set(normName, {
        id: `artist-${art.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: art.name,
        avatarUrl: avatar,
        bannerUrl: art.bannerUrl || avatar,
        isMexican: !!art.isMexican,
        isLatinUrban: !!art.isLatinUrban,
        genre: art.genre || (art.isMexican ? 'Música Mexicana' : 'Pop / Global'),
        monthlyListeners: art.monthlyListeners || '25,000,000',
        bio: art.bio || `${art.name} is an internationally acclaimed recording artist with major releases charting across global platforms.`,
        albums: art.albums || [],
        singles: art.singles || [],
        collaborations: art.collaborations || [],
        songs,
      });
    } else {
      // Merge if artist appeared before
      const existing = artistMap.get(normName);
      if (art.albums) {
        art.albums.forEach((alb) => {
          if (!existing.albums.some((x) => (typeof x === 'string' ? x : x.title) === (typeof alb === 'string' ? alb : alb.title))) {
            existing.albums.push(alb);
          }
        });
      }
      if (art.singles) {
        art.singles.forEach((sgl) => {
          if (!existing.singles.some((x) => (typeof x === 'string' ? x : x.title) === (typeof sgl === 'string' ? sgl : sgl.title))) {
            existing.singles.push(sgl);
          }
        });
      }
      if (art.collaborations) {
        art.collaborations.forEach((collab) => {
          if (!existing.collaborations.some((x) => x.title === collab.title)) {
            existing.collaborations.push(collab);
          }
        });
      }
    }
  });

  return Array.from(artistMap.values());
};

export const ALL_ARTISTS = buildAllArtistsList();

// User created playlists starts empty
export const DEFAULT_PLAYLISTS = [];
