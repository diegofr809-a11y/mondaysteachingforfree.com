import fs from 'fs';
import path from 'path';

// Read existing soundcloudCache.json
const scCache = JSON.parse(fs.readFileSync('src/data/soundcloudCache.json', 'utf8'));

// Helper to look up cache entry
function getCached(title, artist) {
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

const generatorScript = `// Comprehensive catalog of songs, artists, albums, and curated playlists for the Player music app
import scCache from './soundcloudCache.json';

export const POPULAR_ARTISTS_LIST = [
  'Morgan Wallen',
  'Taylor Swift',
  'The Weeknd',
  'Drake',
  'Billie Eilish',
  'Sabrina Carpenter',
  'Bruno Mars',
  'Bad Bunny',
  'Olivia Rodrigo',
  'Kendrick Lamar',
  'Ariana Grande',
  'Tate McRae',
  'Benson Boone',
  'Doja Cat',
  'Playboi Carti',
  'Hozier',
  'Lana Del Rey',
  'Zach Bryan',
  'Tyler, The Creator',
  'Ed Sheeran',
  'Dua Lipa',
  'Post Malone',
  'Chappell Roan',
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
  'Junior H & Peso Pluma',
  'Fuerza Regida & Peso Pluma',
  'Grupo Marca Registrada',
  'Fuerza Regida & Junior H',
  'Grupo Firme',
  'Banda MS',
  'Santa Fe Klan'
];

export const TIKTOK_TRENDING_LIST = [
  { title: 'The Fate of Ophelia', artist: 'Taylor Swift', duration: '3:48', plays: '482,190,400' },
  { title: 'Taste', artist: 'Sabrina Carpenter', duration: '2:37', plays: '562,310,900' },
  { title: 'APT.', artist: 'ROSÉ & Bruno Mars', duration: '2:50', plays: '890,450,000' },
  { title: 'BIRDS OF A FEATHER', artist: 'Billie Eilish', duration: '3:30', plays: '1,240,500,000' },
  { title: 'Espresso', artist: 'Sabrina Carpenter', duration: '2:55', plays: '1,420,900,000' },
  { title: 'Die With A Smile', artist: 'Lady Gaga & Bruno Mars', duration: '4:11', plays: '980,100,000' },
  { title: 'Not Like Us', artist: 'Kendrick Lamar', duration: '4:34', plays: '890,300,000' },
  { title: 'Good Luck, Babe!', artist: 'Chappell Roan', duration: '3:38', plays: '720,400,000' },
  { title: 'A Bar Song (Tipsy)', artist: 'Shaboozey', duration: '2:51', plays: '940,800,000' },
  { title: 'Y LLORO', artist: 'Junior H', duration: '2:58', plays: '412,800,000' },
  { title: 'Ella Baila Sola', artist: 'Peso Pluma', duration: '2:45', plays: '1,320,400,000' },
  { title: 'La Diabla', artist: 'Xavi', duration: '2:52', plays: '810,300,000' },
  { title: 'HARLEY QUINN', artist: 'Fuerza Regida', duration: '2:23', plays: '590,400,000' },
  { title: 'un x100to', artist: 'Grupo Frontera', duration: '3:14', plays: '1,050,000,000' },
  { title: 'Primera Cita', artist: 'Carín León', duration: '3:04', plays: '620,800,000' },
  { title: 'Madonna', artist: 'Natanael Cano', duration: '3:02', plays: '490,200,000' }
];

// Resolves authentic track URL and official cover art from SoundCloud cache
export const resolveCachedTrack = (title, artist) => {
  if (!title) return null;
  const cleanTitle = title.toLowerCase().trim();
  const cleanArtist = (artist || '').toLowerCase().trim();

  // Try exact or contains match
  for (const [k, v] of Object.entries(scCache)) {
    if (k.startsWith('_')) continue;
    const lowerKey = k.toLowerCase();
    if (lowerKey.includes(cleanTitle) && (cleanArtist ? lowerKey.includes(cleanArtist) : true)) {
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
};

const artistAvatarsMap = scCache._artistAvatars || {};

export const getArtistAvatar = (name) => {
  if (!name) return 'https://i1.sndcdn.com/artworks-HiqENlLH65c8-0-t500x500.jpg';
  if (artistAvatarsMap[name]) return artistAvatarsMap[name];
  const found = Object.keys(artistAvatarsMap).find((k) => k.toLowerCase() === name.toLowerCase());
  if (found) return artistAvatarsMap[found];
  return 'https://i1.sndcdn.com/artworks-HiqENlLH65c8-0-t500x500.jpg';
};

export const getTrackCover = (title, artist) => {
  const cached = resolveCachedTrack(title, artist);
  if (cached && cached.artworkUrl) {
    return cached.artworkUrl;
  }
  const artistAvatar = getArtistAvatar(artist);
  if (artistAvatar) return artistAvatar;
  return 'https://i1.sndcdn.com/artworks-HiqENlLH65c8-0-t500x500.jpg';
};

export const COVERS = [
  'https://i1.sndcdn.com/artworks-HiqENlLH65c8-0-t500x500.jpg',
  'https://i1.sndcdn.com/artworks-G3tAA094TcRd-0-t500x500.jpg',
  'https://i1.sndcdn.com/artworks-9SETmQdpdzQb-0-t500x500.jpg',
  'https://i1.sndcdn.com/artworks-IzAqtZGswYwF-0-t500x500.jpg'
];
`;

fs.writeFileSync('scripts/base-music-part.js', generatorScript, 'utf8');
console.log('Saved base part.');
