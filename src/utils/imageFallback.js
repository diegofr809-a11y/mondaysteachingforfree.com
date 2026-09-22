// Universal high-quality SVG image placeholder generator for album art and artist avatars
// Ensures no broken image icons or blank boxes ever appear

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

// Fallback helper for React img onError events
export const handleImageError = (e, fallbackUrl = null, title = 'Music', artist = 'Spotify') => {
  if (!e || !e.currentTarget) return;
  e.currentTarget.onerror = null; // Prevent loop
  if (fallbackUrl && fallbackUrl !== e.currentTarget.src) {
    e.currentTarget.src = fallbackUrl;
  } else {
    e.currentTarget.src = getPlaceholderCover(title, artist);
  }
};
