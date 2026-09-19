const fs = require('fs');
const path = require('path');

const TRACKS_TO_RESOLVE = [
  // TikTok & Viral
  { query: 'Taylor Swift The Fate of Ophelia', id: 'track-1' },
  { query: 'Olivia Dean Man I Need', id: 'track-2' },
  { query: 'SOMBR back to friends', id: 'track-3' },
  { query: 'Sabrina Carpenter Taste', id: 'track-4' },
  { query: 'Tame Impala JENNIE Dracula', id: 'track-5' },
  { query: 'PinkPantheress Zara Larsson Stateside', id: 'track-6' },
  { query: 'RAYE WHERE IS MY HUSBAND', id: 'track-7' },
  { query: 'HUNTR/X Golden', id: 'track-8' },
  { query: 'Shakira Burna Boy Dai Dai', id: 'track-9' },
  { query: 'Gigi Perez Sailor Song', id: 'track-10' },
  { query: 'Harry Styles American Girls', id: 'track-11' },
  { query: 'Lola Young Messy', id: 'track-12' },
  { query: 'Bad Bunny DtMF', id: 'track-13' },
  { query: 'Alex Warren Ordinary', id: 'track-14' },
  { query: 'Bounce i just wanna dance frozy', id: 'track-15' },
  { query: 'The Kid LAROI GIRLS', id: 'track-16' },
  { query: 'Don Toliver E85', id: 'track-17' },
  { query: 'Housecall Mistery Girl', id: 'track-18' },
  { query: 'Disco Lines Tinashe No Broke Boys', id: 'track-19' },
  { query: 'Sam Fender Olivia Dean Rein Me In', id: 'track-20' },
  { query: 'ROSE Bruno Mars APT', id: 'track-21' },
  { query: 'Billie Eilish BIRDS OF A FEATHER', id: 'track-22' },
  { query: 'Sabrina Carpenter Espresso', id: 'track-23' },
  { query: 'Lady Gaga Bruno Mars Die With A Smile', id: 'track-24' },
  { query: 'Kendrick Lamar Not Like Us', id: 'track-25' },
  { query: 'Chappell Roan Good Luck Babe', id: 'track-26' },
  { query: 'Djo End of Beginning', id: 'track-27' },
  { query: 'Shaboozey A Bar Song Tipsy', id: 'track-28' },
  { query: 'Gracie Abrams Thats So True', id: 'track-29' },
  { query: 'FloyyMenor Cris Mj Gata Only', id: 'track-30' },

  // Peso Pluma
  { query: 'Peso Pluma LADY GAGA', id: 'peso-1' },
  { query: 'Eslabon Armado Peso Pluma Ella Baila Sola', id: 'peso-2' },
  { query: 'Peso Pluma HOLLYWOOD', id: 'peso-3' },
  { query: 'Peso Pluma Natanael Cano PRC', id: 'peso-4' },
  { query: 'Peso Pluma Anitta BELLAKEO', id: 'peso-5' },

  // Fuerza Regida
  { query: 'Fuerza Regida TQM', id: 'fuerza-1' },
  { query: 'Fuerza Regida Marshmello HARLEY QUINN', id: 'fuerza-2' },
  { query: 'Fuerza Regida NEL', id: 'fuerza-3' },
  { query: 'Fuerza Regida SABOR FRESA', id: 'fuerza-4' },
  { query: 'Fuerza Regida QUE ONDA', id: 'fuerza-5' },

  // Carín León
  { query: 'Carin Leon Primera Cita', id: 'carin-1' },
  { query: 'Carin Leon Grupo Frontera Segun Quien', id: 'carin-2' },
  { query: 'Carin Leon No Es Por Aca', id: 'carin-3' },
  { query: 'Carin Leon Una Vida Pasada', id: 'carin-4' },

  // Junior H
  { query: 'Junior H Y LLORO', id: 'junior-1' },
  { query: 'Junior H Oscar Maydon Fin De Semana', id: 'junior-2' },
  { query: 'Junior H Peso Pluma El Azul', id: 'junior-3' },
  { query: 'Junior H Mientele', id: 'junior-4' },

  // Natanael Cano
  { query: 'Natanael Cano Oscar Maydon Madonna', id: 'nata-1' },
  { query: 'Natanael Cano Mi Bello Angel', id: 'nata-2' },
  { query: 'Natanael Cano Peso Pluma Gabito Ballesteros AMG', id: 'nata-3' },
  { query: 'Natanael Cano Fuerza Regida Ch y la Pizza', id: 'nata-4' },

  // Christian Nodal
  { query: 'Christian Nodal Adios Amor', id: 'nodal-1' },
  { query: 'Christian Nodal Gera MX Botella Tras Botella', id: 'nodal-2' },
  { query: 'Christian Nodal De Los Besos Que Te Di', id: 'nodal-3' },
  { query: 'Christian Nodal Ya No Somos Ni Seremos', id: 'nodal-4' },

  // Xavi
  { query: 'Xavi La Diabla', id: 'xavi-1' },
  { query: 'Xavi La Victima', id: 'xavi-2' },
  { query: 'Xavi Poco A Poco', id: 'xavi-3' },
  { query: 'Xavi Corazon De Piedra', id: 'xavi-4' },

  // Global Stars
  { query: 'Taylor Swift Cruel Summer', id: 'taylor-1' },
  { query: 'Taylor Swift Fortnight Post Malone', id: 'taylor-2' },
  { query: 'Taylor Swift Anti-Hero', id: 'taylor-3' },
  { query: 'The Weeknd Blinding Lights', id: 'weeknd-1' },
  { query: 'The Weeknd Starboy Daft Punk', id: 'weeknd-2' },
  { query: 'The Weeknd Save Your Tears', id: 'weeknd-3' },
  { query: 'Billie Eilish LUNCH', id: 'billie-2' },
  { query: 'Billie Eilish bad guy', id: 'billie-3' },
  { query: 'Billie Eilish CHIHIRO', id: 'billie-4' },
  { query: 'Sabrina Carpenter Please Please Please', id: 'sabrina-2' },
  { query: 'Bruno Mars Locked Out of Heaven', id: 'bruno-3' },
  { query: 'Bad Bunny Titi Me Pregunto', id: 'badbunny-2' },
  { query: 'Bad Bunny Me Porto Bonito', id: 'badbunny-3' },
  { query: 'Kendrick Lamar HUMBLE', id: 'kendrick-3' },
  { query: 'Kendrick Lamar Money Trees', id: 'kendrick-4' },
  { query: 'Morgan Wallen Last Night', id: 'morgan-1' },
  { query: 'Post Malone Morgan Wallen I Had Some Help', id: 'post-morgan' },
  { query: 'Drake Gods Plan', id: 'drake-1' },
  { query: 'Drake One Dance', id: 'drake-2' },
  { query: 'Olivia Rodrigo vampire', id: 'olivia-1' },
  { query: 'Olivia Rodrigo good 4 u', id: 'olivia-2' },
  { query: 'Zach Bryan Something in the Orange', id: 'zach-1' },
  { query: 'Zach Bryan I Remember Everything', id: 'zach-2' },
  { query: 'Post Malone Sunflower Swae Lee', id: 'post-1' },
  { query: 'Post Malone Circles', id: 'post-2' },
  { query: 'Dua Lipa Levitating', id: 'dua-1' },
  { query: 'Dua Lipa Houdini', id: 'dua-3' },
  { query: 'SZA Kill Bill', id: 'sza-1' },
  { query: 'SZA Snooze', id: 'sza-2' },
  { query: 'Harry Styles As It Was', id: 'harry-1' },
  { query: 'Harry Styles Watermelon Sugar', id: 'harry-2' },
];

const ARTISTS_USERS = {
  'Peso Pluma': 'pesopluma',
  'Fuerza Regida': 'fuerzaregida',
  'Carín León': 'carinleon',
  'Junior H': 'juniorh-music',
  'Natanael Cano': 'natanaelcano',
  'Christian Nodal': 'christiannodal',
  'Xavi': 'xavi50414',
  'Grupo Frontera': 'grupofrontera',
  'Kenia OS': 'keniaos',
  'Santa Fe Klan': 'santafeklan',
  'Taylor Swift': 'taylorswiftofficial',
  'Billie Eilish': 'billieeilish',
  'Sabrina Carpenter': 'sabrinacarpenter',
  'Bruno Mars': 'brunomars',
  'Bad Bunny': 'badbunny15',
  'Kendrick Lamar': 'kendrick-lamar-music',
  'Chappell Roan': 'chappellroan',
  'Morgan Wallen': 'morganwallen',
  'Drake': 'octobersveryown',
  'Olivia Rodrigo': 'oliviarodrigo',
  'Zach Bryan': 'zachbryan',
  'Post Malone': 'postmalone',
  'Dua Lipa': 'dualipa',
  'SZA': 'szababy2',
  'Harry Styles': 'harrystyles',
  'The Weeknd': 'theweeknd',
  'Lady Gaga': 'ladygaga',
  'Shaboozey': 'shaboozey',
};

async function fetchSoundCloudTrack(query) {
  try {
    const searchUrl = `https://soundcloud.com/search/sounds?q=${encodeURIComponent(query)}`;
    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      }
    });
    const html = await res.text();
    const systemPaths = new Set(['search', 'popular', 'pages', 'terms', 'settings', 'signin', 'upload', 'mobile', 'you', 'charts', 'stream', 'discover', 'notifications', 'messages', 'stations', 'imprint']);
    const matches = [...html.matchAll(/href="\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+)"/g)]
      .map(m => m[1])
      .filter(p => !systemPaths.has(p.split('/')[0]));

    if (!matches.length) return null;

    const trackSlug = matches[0];
    const trackUrl = `https://soundcloud.com/${trackSlug}`;

    const oembedRes = await fetch(`https://soundcloud.com/oembed?url=${encodeURIComponent(trackUrl)}&format=json`);
    if (oembedRes.ok) {
      const odata = await oembedRes.json();
      return {
        trackUrl,
        title: odata.title,
        author: odata.author_name,
        artworkUrl: odata.thumbnail_url ? odata.thumbnail_url.replace('-large', '-t500x500') : null
      };
    }
    return { trackUrl, title: query, author: '', artworkUrl: null };
  } catch (err) {
    return null;
  }
}

async function fetchArtistAvatar(username) {
  try {
    const res = await fetch(`https://soundcloud.com/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      }
    });
    const html = await res.text();
    const match = html.match(/content="(https:\/\/i1\.sndcdn\.com\/avatars-[^"]+)"/);
    if (match) {
      return match[1].replace('-large', '-t500x500');
    }
  } catch (e) {}
  return null;
}

async function main() {
  console.log('Resolving tracks from SoundCloud...');
  const cache = {};

  // Check if cache already exists
  const cachePath = path.join(__dirname, '../src/data/soundcloudCache.json');
  if (fs.existsSync(cachePath)) {
    try {
      Object.assign(cache, JSON.parse(fs.readFileSync(cachePath, 'utf8')));
    } catch (e) {}
  }

  // 1. Resolve tracks
  for (const item of TRACKS_TO_RESOLVE) {
    if (cache[item.query] && cache[item.query].trackUrl) {
      continue;
    }
    console.log(`Resolving: ${item.query}`);
    const result = await fetchSoundCloudTrack(item.query);
    if (result) {
      cache[item.query] = result;
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
      console.log(`  -> ${result.trackUrl} (${result.artworkUrl})`);
    } else {
      console.log(`  -> FAILED: ${item.query}`);
    }
    await new Promise(r => setTimeout(r, 100));
  }

  // 2. Resolve artist avatars
  const artistAvatars = cache._artistAvatars || {};
  for (const [artistName, userSlug] of Object.entries(ARTISTS_USERS)) {
    if (artistAvatars[artistName]) continue;
    console.log(`Resolving artist avatar: ${artistName} (${userSlug})`);
    const avatar = await fetchArtistAvatar(userSlug);
    if (avatar) {
      artistAvatars[artistName] = avatar;
      cache._artistAvatars = artistAvatars;
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
      console.log(`  -> Avatar: ${avatar}`);
    }
    await new Promise(r => setTimeout(r, 100));
  }
  console.log('Done! Saved to soundcloudCache.json');
}

main();
