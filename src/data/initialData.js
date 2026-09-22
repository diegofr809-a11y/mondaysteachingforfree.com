import gamesData from './games.json';

export const CATEGORIES = [
  { id: 'all', name: 'All Games', icon: 'Gamepad2' },
  { id: 'favorites', name: 'Favorites', icon: 'Heart' },
  { id: 'action', name: 'Action', icon: 'Zap' },
  { id: 'arcade', name: 'Arcade', icon: 'Flame' },
  { id: 'classic', name: 'Classic / Retro', icon: 'Crown' },
  { id: 'puzzle', name: 'Puzzle & Logic', icon: 'Puzzle' },
  { id: 'multiplayer', name: 'Multiplayer', icon: 'Users' },
  { id: 'racing', name: 'Racing', icon: 'Car' },
  { id: 'sports', name: 'Sports', icon: 'Trophy' },
  { id: 'casual', name: 'Casual', icon: 'Boxes' },
];

export const CLOAK_PRESETS = [
  {
    id: 'none',
    name: 'Default (grrmondays)',
    title: 'grrmondays',
    favicon:
      'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%239333ea%22 stroke-width=%222%22><polygon points=%226 3 20 12 6 21 6 3%22/></svg>',
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes',
    favicon: 'https://ssl.gstatic.com/classroom/favicon.png',
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard',
    favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Google Docs',
    favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    favicon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png',
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'Wikipedia, the free encyclopedia',
    favicon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
  },
  {
    id: 'clever',
    name: 'Clever Portal',
    title: 'Clever | Portal',
    favicon: 'https://assets.clever.com/launchpad/1.7.0/favicon.ico',
  },
];

export const DEFAULT_SETTINGS = {
  theme: 'windows11',
  uiMode: 'windows11', // 'windows11' or 'classic'
  wallpaper: 'none',
  customWallpaperUrl: '',
  customAccentColor: '',
  customCursor: 'default',
  // Main view & clock widget
  showMainClock: true,
  clockFormat: '12h',
  showSeconds: true,
  showWeather: true,
  tempUnit: 'F',
  weatherLocation: 'Local City',
  // Disguise & Cloak
  activeCloak: 'none',
  customCloakTitle: '',
  customCloakFavicon: '',
  panicKey: ']',
  panicUrl: 'https://classroom.google.com',
  defaultSearchEngine: 'brave',
  proxyEngineMode: 'direct',
  // Audio & Sound Effects
  tedSoundEnabled: true,
  audioVolume: 80,
  soundEffectsEnabled: true,
  // Gameplay & Performance
  autoFullscreen: false,
  openInNewTab: false,
  compactCardGrid: false,
  disableAnimations: false,
  confirmBeforeLeave: false,
  highPerformanceMode: false,
  // Haters List
  haters: [
    {
      id: 'luna',
      name: 'Luna',
      role: 'Certified Day 1 Hater',
      bio: 'Never believed in the vision, but watches every single move from the sidelines.',
      saltLevel: 99,
      status: 'Active Doubter',
      isDefault: true,
    },
    {
      id: 'juana',
      name: 'Juana',
      role: 'Executive Critic',
      bio: 'Professional side-eye specialist with unlimited unsolicited feedback and doubts.',
      saltLevel: 96,
      status: 'Constant Skeptic',
      isDefault: true,
    },
  ],
  haterShieldActive: true,
  muteHaterVibes: true,
};

export const INITIAL_GAMES = gamesData;

export const DEFAULT_SHORTCUTS = [
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://www.tiktok.com',
    iconType: 'tiktok',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com',
    iconType: 'youtube',
  },
  {
    id: 'discord',
    name: 'Discord',
    url: 'https://discord.com',
    iconType: 'discord',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    url: 'https://open.spotify.com',
    iconType: 'spotify',
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    url: 'https://classroom.google.com',
    iconType: 'classroom',
  },
  {
    id: 'roblox',
    name: 'Roblox',
    url: 'https://nowgg.fun/apps/a/19900/b.html',
    iconType: 'roblox',
  },
  {
    id: 'twitch',
    name: 'Twitch',
    url: 'https://www.twitch.tv',
    iconType: 'twitch',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    url: 'https://www.reddit.com',
    iconType: 'reddit',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    url: 'https://x.com',
    iconType: 'twitter',
  },
];
