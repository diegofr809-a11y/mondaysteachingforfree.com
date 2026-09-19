// Comprehensive catalog of songs, artists, albums, and curated playlists for the Player music app
import scCache from './soundcloudCache.json';
import { MEXICAN_ARTISTS_DATA as RAW_MEXICAN_ARTISTS_DATA } from './mexicanArtistsData.js';
import { POPULAR_ARTISTS_DATA as RAW_POPULAR_ARTISTS_DATA } from './popularArtistsData.js';

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

export const POPULAR_ARTISTS_LIST = [
  'Taylor Swift',
  'The Weeknd',
  'Billie Eilish',
  'Sabrina Carpenter',
  'Bruno Mars',
  'Kendrick Lamar',
  'Bad Bunny',
  'Chappell Roan',
  'Morgan Wallen',
  'Drake',
  'Olivia Rodrigo',
  'Zach Bryan',
  'Ariana Grande',
  'Tate McRae',
  'Benson Boone',
  'Doja Cat',
  'Playboi Carti',
  'Hozier',
  'Lana Del Rey',
  'Tyler, The Creator',
  'Ed Sheeran',
  'Dua Lipa',
  'Post Malone',
  'SZA',
  'Harry Styles',
  'Charli xcx',
  'Justin Bieber',
  'Beyoncé',
  'Travis Scott',
  'Rihanna'
];

export const MEXICAN_ARTISTS_LIST = [
  'Junior H',
  'Peso Pluma',
  'Natanael Cano',
  'Fuerza Regida',
  'Oscar Maydon',
  'Gabito Ballesteros',
  'Tito Double P',
  'Xavi',
  'Eslabon Armado',
  'Grupo Frontera',
  'Carín León',
  'Christian Nodal',
  'Edén Muñoz',
  'Netón Vega',
  'DannyLux',
  'Ivan Cornejo',
  'Marca MP',
  'Chino Pacas',
  'Luis R Conriquez',
  'Jasiel Nuñez',
  'Herencia de Patrones',
  'Ovi',
  'El Komander',
  'Grupo Marca Registrada',
  'Junior H & Peso Pluma',
  'Fuerza Regida & Peso Pluma',
  'Fuerza Regida & Junior H',
  'La Arrolladora Banda El Limón',
  'Pepe Aguilar',
  'Belinda',
  'Ángela Aguilar',
  'Banda El Recodo',
  'Carlos Rivera',
  'Yahritza y Su Esencia',
  'Natalia Lafourcade',
  'Banda MS',
  'Luis Miguel',
  'Kenia OS',
  'Santa Fe Klan',
  'Alejandro Fernández',
  'Grupo Firme',
  'Mon Laferte',
  'Danna'
];

export const TIKTOK_TRENDING_LIST = [
  { title: 'The Fate of Ophelia', artist: 'Taylor Swift', duration: '3:48', plays: '482,190,400' },
  { title: 'Man I Need', artist: 'Olivia Dean', duration: '3:12', plays: '98,400,210' },
  { title: 'back to friends', artist: 'SOMBR', duration: '2:54', plays: '142,890,000' },
  { title: 'Taste', artist: 'Sabrina Carpenter', duration: '2:37', plays: '562,310,900' },
  { title: 'Dracula', artist: 'Tame Impala & JENNIE', duration: '3:29', plays: '210,400,800' },
  { title: 'Stateside', artist: 'PinkPantheress & Zara Larsson', duration: '2:45', plays: '175,600,000' },
  { title: 'WHERE IS MY HUSBAND!', artist: 'RAYE', duration: '3:05', plays: '128,950,000' },
  { title: 'Golden', artist: 'HUNTR/X', duration: '2:48', plays: '89,400,100' },
  { title: 'Dai Dai', artist: 'Shakira & Burna Boy', duration: '3:15', plays: '230,190,000' },
  { title: 'Sailor Song', artist: 'Gigi Perez', duration: '3:32', plays: '412,890,300' },
  { title: 'American Girls', artist: 'Harry Styles', duration: '3:40', plays: '340,900,000' },
  { title: 'Messy', artist: 'Lola Young', duration: '3:18', plays: '190,450,000' },
  { title: 'DtMF', artist: 'Bad Bunny', duration: '3:58', plays: '620,100,000' },
  { title: 'Ordinary', artist: 'Alex Warren', duration: '2:50', plays: '165,800,000' },
  { title: 'Bounce (i just wanna dance)', artist: 'фрози & joyful', duration: '2:15', plays: '280,450,000' },
  { title: 'GIRLS', artist: 'The Kid LAROI', duration: '2:33', plays: '310,200,000' },
  { title: 'E85', artist: 'Don Toliver', duration: '2:47', plays: '195,800,000' },
  { title: 'Mistery Girl', artist: 'Housecall', duration: '3:02', plays: '74,200,000' },
  { title: 'No Broke Boys', artist: 'Disco Lines & Tinashe', duration: '2:28', plays: '240,600,000' },
  { title: 'Rein Me In', artist: 'Sam Fender ft. Olivia Dean', duration: '3:44', plays: '115,300,000' },
  { title: 'APT.', artist: 'ROSÉ & Bruno Mars', duration: '2:50', plays: '890,450,000' },
  { title: 'BIRDS OF A FEATHER', artist: 'Billie Eilish', duration: '3:30', plays: '1,240,500,000' },
  { title: 'Espresso', artist: 'Sabrina Carpenter', duration: '2:55', plays: '1,420,900,000' },
  { title: 'Die With A Smile', artist: 'Lady Gaga & Bruno Mars', duration: '4:11', plays: '980,100,000' },
  { title: 'Not Like Us', artist: 'Kendrick Lamar', duration: '4:34', plays: '890,300,000' },
  { title: 'Good Luck, Babe!', artist: 'Chappell Roan', duration: '3:38', plays: '720,400,000' },
  { title: 'End of Beginning', artist: 'Djo', duration: '2:39', plays: '860,200,000' },
  { title: 'A Bar Song (Tipsy)', artist: 'Shaboozey', duration: '2:51', plays: '940,800,000' },
  { title: "That's So True", artist: 'Gracie Abrams', duration: '2:46', plays: '490,100,000' },
  { title: 'Gata Only', artist: 'FloyyMenor & Cris Mj', duration: '3:42', plays: '1,120,400,000' }
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
  const normArtist = normalizeStr(artist);

  // Exact compound match in cache
  const compoundKey1 = `${artist} - ${title}`;
  if (scCache[compoundKey1]) return scCache[compoundKey1];

  const compoundKey2 = `${title} - ${artist}`;
  if (scCache[compoundKey2]) return scCache[compoundKey2];

  if (scCache[title]) return scCache[title];

  // Search through all keys in scCache
  for (const [k, v] of Object.entries(scCache)) {
    if (k.startsWith('_')) continue;
    const normKey = normalizeStr(k);
    if (normArtist && normKey.includes(normArtist) && normKey.includes(normTitle)) {
      return v;
    }
  }

  // Next pass: title match + check artist in result
  for (const [k, v] of Object.entries(scCache)) {
    if (k.startsWith('_')) continue;
    const normKey = normalizeStr(k);
    if (normKey.includes(normTitle)) {
      return v;
    }
  }

  return null;
};

const artistAvatarsMap = scCache._artistAvatars || {};

export const getArtistAvatar = (name) => {
  if (!name) return 'https://i1.sndcdn.com/avatars-WWcJmU6vIlCCYxeh-V2Auiw-t500x500.jpg';
  
  // Check Mexican artist rich data
  const mex = MEXICAN_ARTISTS_DATA.find((m) => m.name.toLowerCase() === name.toLowerCase());
  if (mex?.avatarUrl) return mex.avatarUrl;

  // Check popular artist rich data
  const pop = POPULAR_ARTISTS_DATA.find((p) => p.name.toLowerCase() === name.toLowerCase());
  if (pop?.avatarUrl) return pop.avatarUrl;

  if (artistAvatarsMap[name]) return artistAvatarsMap[name];
  const found = Object.keys(artistAvatarsMap).find((k) => k.toLowerCase() === name.toLowerCase());
  if (found) return artistAvatarsMap[found];

  return 'https://i1.sndcdn.com/avatars-2dGCqwjMY5Apprfe-I6pVBg-t500x500.jpg';
};

export const getTrackCover = (title, artist) => {
  const cached = resolveCachedTrack(title, artist);
  if (cached && cached.artworkUrl) {
    return cached.artworkUrl;
  }
  const artistAvatar = getArtistAvatar(artist);
  if (artistAvatar) return artistAvatar;
  return 'https://i1.sndcdn.com/artworks-VIQ3As8XCQ1K-0-t500x500.jpg';
};

// Fallback covers collection
export const COVERS = [
  'https://i1.sndcdn.com/artworks-VIQ3As8XCQ1K-0-t500x500.jpg',
  'https://i1.sndcdn.com/artworks-T4yzIIA2Hulk-0-t500x500.jpg',
  'https://i1.sndcdn.com/artworks-gWigktVCPjMq-0-t500x500.jpg',
  'https://i1.sndcdn.com/artworks-UMCMlAzFBWD7-0-t500x500.jpg',
  'https://i1.sndcdn.com/artworks-oEbPJY9O4ri2-0-t500x500.jpg',
  'https://i1.sndcdn.com/artworks-i6j5XoFgIa9o-0-t500x500.jpg',
  'https://i1.sndcdn.com/artworks-r2QezpLYTmM9-0-t500x500.jpg',
  'https://i1.sndcdn.com/artworks-Rsy355puRBfa-0-t500x500.jpg',
  'https://i1.sndcdn.com/artworks-DL3QtMpAhfsC-0-t500x500.jpg',
];

export const ARTIST_AVATARS = Object.values(artistAvatarsMap);

export const getCoverBySeed = (seed) => {
  return getTrackCover(seed, '');
};

export const getAvatarBySeed = (seed) => {
  return getArtistAvatar(seed);
};

// Helper to assemble full Master Catalog of all tracks
export const buildMasterTrackCatalog = () => {
  const allTracks = [];
  let trackCounter = 1;

  // 1. TikTok Trending Tracks
  TIKTOK_TRENDING_LIST.forEach((t) => {
    const cached = resolveCachedTrack(t.title, t.artist);
    allTracks.push({
      id: `track-${trackCounter++}`,
      title: t.title,
      artist: t.artist,
      album: 'TikTok Viral Hits 2026',
      duration: t.duration,
      plays: t.plays,
      coverUrl: cached?.artworkUrl || getTrackCover(t.title, t.artist),
      soundCloudUrl: cached?.trackUrl || null,
      genre: 'Trending / Pop',
      isTrending: true,
      audioKey: `${t.title}-${t.artist}`.toLowerCase(),
    });
  });

  // 2. Mexican Artists Catalog (Real Songs)
  MEXICAN_ARTISTS_DATA.forEach((art) => {
    art.songs.forEach((s) => {
      // Avoid duplicate tracks
      if (!allTracks.some((x) => x.title.toLowerCase() === s.title.toLowerCase() && x.artist.toLowerCase() === art.name.toLowerCase())) {
        const cached = resolveCachedTrack(s.title, art.name);
        allTracks.push({
          id: `track-${trackCounter++}`,
          title: s.title,
          artist: art.name,
          album: s.album || 'Música Mexicana',
          duration: s.duration || '3:10',
          plays: s.plays || '190,000,000',
          coverUrl: cached?.artworkUrl || getTrackCover(s.title, art.name),
          soundCloudUrl: cached?.trackUrl || null,
          genre: art.genre,
          isMexican: true,
          audioKey: `${s.title}-${art.name}`.toLowerCase(),
        });
      }
    });
  });

  // 3. Other Mexican Artists without deep dataset
  MEXICAN_ARTISTS_LIST.forEach((artName) => {
    if (!MEXICAN_ARTISTS_DATA.some((d) => d.name.toLowerCase() === artName.toLowerCase())) {
      const signatureSongs = [
        { title: `El Corrido Mayor`, duration: '3:15', album: 'Grandes Éxitos' },
        { title: `Noche Inolvidable`, duration: '2:58', album: 'En Vivo Desde México' },
        { title: `Amor Prohibido`, duration: '3:24', album: 'Sentimiento Mexicano' },
      ];
      signatureSongs.forEach((s) => {
        const cached = resolveCachedTrack(s.title, artName);
        allTracks.push({
          id: `track-${trackCounter++}`,
          title: s.title,
          artist: artName,
          album: s.album,
          duration: s.duration,
          plays: '124,500,000',
          coverUrl: cached?.artworkUrl || getTrackCover(s.title, artName),
          soundCloudUrl: cached?.trackUrl || null,
          genre: 'Música Regional Mexicana',
          isMexican: true,
          audioKey: `${s.title}-${artName}`.toLowerCase(),
        });
      });
    }
  });

  // 4. Popular Global Artists Catalog
  POPULAR_ARTISTS_DATA.forEach((art) => {
    art.songs.forEach((s) => {
      if (!allTracks.some((x) => x.title.toLowerCase() === s.title.toLowerCase() && x.artist.toLowerCase() === art.name.toLowerCase())) {
        const cached = resolveCachedTrack(s.title, art.name);
        allTracks.push({
          id: `track-${trackCounter++}`,
          title: s.title,
          artist: art.name,
          album: s.album,
          duration: s.duration,
          plays: s.plays,
          coverUrl: cached?.artworkUrl || getTrackCover(s.title, art.name),
          soundCloudUrl: cached?.trackUrl || null,
          genre: art.genre,
          isPopular: true,
          audioKey: `${s.title}-${art.name}`.toLowerCase(),
        });
      }
    });
  });

  // 5. Popular Artists remaining list
  POPULAR_ARTISTS_LIST.forEach((artName) => {
    if (!POPULAR_ARTISTS_DATA.some((d) => d.name.toLowerCase() === artName.toLowerCase())) {
      const signatureSongs = [
        { title: `Midnight Skyline`, duration: '3:10', album: 'Solar Eclipse' },
        { title: `Starlight Serenade`, duration: '3:34', album: 'Neon Dreams' },
        { title: `Endless Horizon`, duration: '2:49', album: 'World Tour Live' },
      ];
      signatureSongs.forEach((s) => {
        const cached = resolveCachedTrack(s.title, artName);
        allTracks.push({
          id: `track-${trackCounter++}`,
          title: s.title,
          artist: artName,
          album: s.album,
          duration: s.duration,
          plays: '289,100,000',
          coverUrl: cached?.artworkUrl || getTrackCover(s.title, artName),
          soundCloudUrl: cached?.trackUrl || null,
          genre: 'Pop / Global',
          isPopular: true,
          audioKey: `${s.title}-${artName}`.toLowerCase(),
        });
      });
    }
  });

  return allTracks;
};

export const MASTER_TRACKS = buildMasterTrackCatalog();

// All unique artists catalogue
export const buildAllArtistsList = () => {
  const artistMap = new Map();

  // Combine unique artist names with Mexican artists highlighted
  const allNames = Array.from(new Set([...MEXICAN_ARTISTS_LIST, ...POPULAR_ARTISTS_LIST]));

  allNames.forEach((name) => {
    const isMexican = MEXICAN_ARTISTS_LIST.some((m) => m.toLowerCase() === name.toLowerCase());
    const detailed = isMexican
      ? MEXICAN_ARTISTS_DATA.find((m) => m.name.toLowerCase() === name.toLowerCase())
      : POPULAR_ARTISTS_DATA.find((p) => p.name.toLowerCase() === name.toLowerCase());

    const songs = MASTER_TRACKS.filter((t) => t.artist.toLowerCase() === name.toLowerCase());
    const avatar = getArtistAvatar(name);

    artistMap.set(name, {
      id: `artist-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name,
      avatarUrl: detailed?.avatarUrl || avatar,
      bannerUrl: detailed?.bannerUrl || detailed?.avatarUrl || avatar,
      isMexican,
      genre: detailed?.genre || (isMexican ? 'Música Mexicana' : 'Pop / Global'),
      monthlyListeners: detailed?.monthlyListeners || (isMexican ? '28,400,000' : '25,400,000'),
      bio: detailed?.bio || `${name} is an internationally recognized artist with millions of monthly listeners on global music charts.`,
      albums: detailed?.albums || ['Greatest Hits', 'Studio Collection', 'Live Acoustic'],
      singles: detailed?.singles || songs.slice(0, 4).map((s) => s.title),
      collaborations: detailed?.collaborations || [],
      songs,
    });
  });

  return Array.from(artistMap.values());
};

export const ALL_ARTISTS = buildAllArtistsList();

// Curated default playlists
export const DEFAULT_PLAYLISTS = [
  {
    id: 'playlist-mexican-pride',
    name: 'Música Mexicana 2026',
    description: 'Corridos tumbados, Sad Boyz, bélicos, cumbias y lo más escuchado.',
    coverUrl: 'https://i1.sndcdn.com/artworks-HiqENlLH65c8-0-t500x500.jpg',
    trackIds: MASTER_TRACKS.filter((t) => t.isMexican).map((t) => t.id).slice(0, 40),
    createdAt: '2026-09-19',
  },
  {
    id: 'playlist-junior-h',
    name: 'Junior H: $AD BOYZ & Corridos',
    description: 'La discografía esencial de Junior H: Y LLORO, Fin De Semana, El Azul, Se Amerita.',
    coverUrl: 'https://i1.sndcdn.com/artworks-i6j5XoFgIa9o-0-t500x500.jpg',
    trackIds: MASTER_TRACKS.filter((t) => t.artist.toLowerCase().includes('junior h')).map((t) => t.id),
    createdAt: '2026-09-19',
  },
  {
    id: 'playlist-corridos-belicos',
    name: 'Corridos Bélicos & Tumbados',
    description: 'Peso Pluma, Natanael Cano, Fuerza Regida, Tito Double P, Oscar Maydon.',
    coverUrl: 'https://i1.sndcdn.com/artworks-G3tAA094TcRd-0-t500x500.jpg',
    trackIds: MASTER_TRACKS.filter((t) => t.isMexican && !t.artist.toLowerCase().includes('junior h')).map((t) => t.id).slice(0, 35),
    createdAt: '2026-09-19',
  },
  {
    id: 'playlist-tiktok-2026',
    name: 'TikTok Trending Audios',
    description: 'The biggest viral sounds and trend-setting hits right now.',
    coverUrl: MASTER_TRACKS.find((t) => t.isTrending)?.coverUrl || 'https://i1.sndcdn.com/artworks-VIQ3As8XCQ1K-0-t500x500.jpg',
    trackIds: MASTER_TRACKS.filter((t) => t.isTrending).map((t) => t.id).slice(0, 25),
    createdAt: '2026-09-19',
  },
  {
    id: 'playlist-today-top-hits',
    name: "Today's Top Hits",
    description: 'Taylor Swift, Bruno Mars, Billie Eilish, Kendrick Lamar and more.',
    coverUrl: MASTER_TRACKS.find((t) => t.isPopular)?.coverUrl || 'https://i1.sndcdn.com/artworks-gWigktVCPjMq-0-t500x500.jpg',
    trackIds: MASTER_TRACKS.filter((t) => t.isPopular).map((t) => t.id).slice(0, 25),
    createdAt: '2026-09-19',
  },
  {
    id: 'playlist-chill-late-night',
    name: 'Late Night Chill & Lo-Fi',
    description: 'Smooth rhythms, mellow acoustic guitars, and midnight synths.',
    coverUrl: MASTER_TRACKS[15]?.coverUrl || 'https://i1.sndcdn.com/artworks-oEbPJY9O4ri2-0-t500x500.jpg',
    trackIds: MASTER_TRACKS.slice(15, 35).map((t) => t.id),
    createdAt: '2026-09-19',
  },
];
