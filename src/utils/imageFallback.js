// Universal high-quality SVG image placeholder generator for album art, artist avatars, and games
// Ensures no broken image icons or blank boxes ever appear

export const getPlaceholderGameThumbnail = (title = 'Game', category = 'action') => {
  const cleanTitle = (title || 'Game').slice(0, 26);
  const cleanCat = (category || 'Game').toUpperCase();
  const initials = cleanTitle
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '🎮';

  // Category specific color palettes
  const catColors = {
    action: { c1: '#881337', c2: '#1f1315', accent: '#f43f5e', icon: '⚡' },
    racing: { c1: '#78350f', c2: '#1a140f', accent: '#f59e0b', icon: '🏎️' },
    puzzle: { c1: '#064e3b', c2: '#0b1612', accent: '#10b981', icon: '🧩' },
    sports: { c1: '#0c4a6e', c2: '#08151f', accent: '#38bdf8', icon: '🏆' },
    casual: { c1: '#4c1d95', c2: '#140c1e', accent: '#a855f7', icon: '🎲' },
    retro: { c1: '#831843', c2: '#1a0d14', accent: '#ec4899', icon: '🕹️' },
    multiplayer: { c1: '#1e3a8a', c2: '#0d1322', accent: '#60a5fa', icon: '👥' },
  };

  const palette = catColors[category?.toLowerCase()] || catColors.action;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" width="400" height="225">
    <defs>
      <linearGradient id="gamegrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${palette.c1}" />
        <stop offset="100%" stop-color="${palette.c2}" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="35%" r="60%">
        <stop offset="0%" stop-color="${palette.accent}" stop-opacity="0.25" />
        <stop offset="100%" stop-color="${palette.accent}" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="400" height="225" fill="url(#gamegrad)" />
    <rect width="400" height="225" fill="url(#glow)" />
    <!-- Grid decorative lines -->
    <path d="M0 45 h400 M0 90 h400 M0 135 h400 M0 180 h400" stroke="white" stroke-opacity="0.04" stroke-width="1" />
    <path d="M80 0 v225 M160 0 v225 M240 0 v225 M320 0 v225" stroke="white" stroke-opacity="0.04" stroke-width="1" />
    <!-- Center badge -->
    <circle cx="200" cy="95" r="42" fill="#000000" fill-opacity="0.45" stroke="${palette.accent}" stroke-width="1.5" stroke-opacity="0.6" />
    <text x="200" y="103" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="900" fill="${palette.accent}" text-anchor="middle" dominant-baseline="middle">${initials}</text>
    <!-- Title & Category pill -->
    <text x="200" y="165" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">${escapeXml(cleanTitle)}</text>
    <rect x="140" y="180" width="120" height="20" rx="10" fill="${palette.accent}" fill-opacity="0.2" stroke="${palette.accent}" stroke-opacity="0.4" stroke-width="1" />
    <text x="200" y="194" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="800" fill="${palette.accent}" text-anchor="middle" letter-spacing="1">${escapeXml(cleanCat)}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const getPlaceholderCover = (title = 'Music', artist = 'Artist') => {
  const cleanTitle = (title || 'Music').slice(0, 24);
  const cleanArtist = (artist || 'Spotify').slice(0, 24);
  const initials = (cleanArtist.charAt(0) + (cleanArtist.split(' ')[1]?.charAt(0) || '')).toUpperCase() || '♪';

  // Deterministic color gradient based on title + artist string
  const str = `${cleanArtist}-${cleanTitle}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue1 = Math.abs(hash % 360);
  const hue2 = Math.abs((hash * 3) % 360);
  const color1 = `hsl(${hue1}, 70%, 18%)`;
  const color2 = `hsl(${hue2}, 80%, 10%)`;
  const accent = `hsl(${hue1}, 85%, 65%)`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}" />
        <stop offset="100%" stop-color="${color2}" />
      </linearGradient>
    </defs>
    <rect width="500" height="500" rx="24" fill="url(#grad)" />
    <circle cx="250" cy="210" r="90" fill="white" fill-opacity="0.08" />
    <text x="250" y="240" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="76" font-weight="900" fill="${accent}" text-anchor="middle" dominant-baseline="middle">${initials}</text>
    <text x="250" y="360" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="700" fill="#ffffff" fill-opacity="0.95" text-anchor="middle">${escapeXml(cleanTitle)}</text>
    <text x="250" y="405" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="500" fill="#b3b3b3" text-anchor="middle">${escapeXml(cleanArtist)}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const getPlaceholderAvatar = (artist = 'Artist') => {
  const cleanArtist = (artist || 'Artist').slice(0, 24);
  const initials = (cleanArtist.charAt(0) + (cleanArtist.split(' ')[1]?.charAt(0) || '')).toUpperCase() || '♪';

  let hash = 0;
  for (let i = 0; i < cleanArtist.length; i++) {
    hash = cleanArtist.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  const color1 = `hsl(${hue}, 65%, 22%)`;
  const color2 = `hsl(${(hue + 45) % 360}, 75%, 12%)`;
  const accent = `hsl(${hue}, 80%, 65%)`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
    <defs>
      <linearGradient id="avgrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}" />
        <stop offset="100%" stop-color="${color2}" />
      </linearGradient>
    </defs>
    <circle cx="250" cy="250" r="250" fill="url(#avgrad)" />
    <circle cx="250" cy="250" r="180" fill="white" fill-opacity="0.06" />
    <text x="250" y="275" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="110" font-weight="800" fill="${accent}" text-anchor="middle" dominant-baseline="middle">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

function escapeXml(unsafe) {
  return (unsafe || '').replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Fallback helper for React img onError events (music covers)
export const handleImageError = (e, fallbackUrl = null, title = 'Music', artist = 'Spotify') => {
  if (!e || !e.currentTarget) return;
  e.currentTarget.onerror = null; // Prevent loop
  if (fallbackUrl && fallbackUrl !== e.currentTarget.src) {
    e.currentTarget.src = fallbackUrl;
  } else {
    e.currentTarget.src = getPlaceholderCover(title, artist);
  }
};

// Fallback helper for React img onError events (game thumbnails)
export const handleGameImageError = (e, title = 'Game', category = 'action') => {
  if (!e || !e.currentTarget) return;
  e.currentTarget.onerror = null; // Prevent infinite fallback loops
  e.currentTarget.style.display = ''; // Ensure visible
  e.currentTarget.src = getPlaceholderGameThumbnail(title, category);
};

// Fallback helper for React img onError events (artist avatars)
export const handleArtistAvatarError = (e, artist = 'Artist') => {
  if (!e || !e.currentTarget) return;
  e.currentTarget.onerror = null;
  e.currentTarget.style.display = '';
  e.currentTarget.src = getPlaceholderAvatar(artist);
};
