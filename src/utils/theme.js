export const THEMES = {
  windows11: {
    id: 'windows11',
    name: 'Windows 11 Dark',
    description: 'Sleek dark acrylic with Windows 11 blue accents',
    colors: {
      bgBase: '#000000',
      bgSurface: '#0d0d11',
      bgCard: '#16161b',
      bgHover: '#202028',
      border: '#282832',
      borderHover: '#0078d4',
      accent: '#0078d4',
      accentHover: '#2b88d8',
      accentGlow: 'rgba(0, 120, 212, 0.35)',
      textMain: '#ffffff',
      textMuted: '#a1a1aa',
      textDim: '#71717a',
      badgeBg: 'rgba(0, 120, 212, 0.16)',
    },
    previewColors: ['#000000', '#0078d4', '#16161b'],
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Dark',
    description: 'Default dark background with purple accents',
    colors: {
      bgBase: '#07050d',
      bgSurface: '#0b0816',
      bgCard: '#100b21',
      bgHover: '#181131',
      border: '#231845',
      borderHover: '#3c2975',
      accent: '#9333ea',
      accentHover: '#a855f7',
      accentGlow: 'rgba(147, 51, 234, 0.35)',
      textMain: '#ffffff',
      textMuted: '#9d93be',
      textDim: '#635a82',
      badgeBg: 'rgba(147, 51, 234, 0.15)',
    },
    previewColors: ['#07050d', '#9333ea', '#100b21'],
  },
  oled: {
    id: 'oled',
    name: 'OLED Black',
    description: 'True black with sharp white contrast',
    colors: {
      bgBase: '#000000',
      bgSurface: '#080808',
      bgCard: '#111111',
      bgHover: '#1c1c1c',
      border: '#262626',
      borderHover: '#404040',
      accent: '#f4f4f5',
      accentHover: '#ffffff',
      accentGlow: 'rgba(255, 255, 255, 0.25)',
      textMain: '#ffffff',
      textMuted: '#a1a1aa',
      textDim: '#71717a',
      badgeBg: 'rgba(255, 255, 255, 0.12)',
    },
    previewColors: ['#000000', '#ffffff', '#1a1a1a'],
  },
  light: {
    id: 'light',
    name: 'Light Minimal',
    description: 'Clean light gray background with slate accents',
    colors: {
      bgBase: '#f4f5f8',
      bgSurface: '#eaecf1',
      bgCard: '#ffffff',
      bgHover: '#f1f3f7',
      border: '#dbe0ea',
      borderHover: '#cbd5e1',
      accent: '#3b82f6',
      accentHover: '#2563eb',
      accentGlow: 'rgba(59, 130, 246, 0.25)',
      textMain: '#0f172a',
      textMuted: '#475569',
      textDim: '#64748b',
      badgeBg: 'rgba(59, 130, 246, 0.12)',
    },
    previewColors: ['#f4f5f8', '#3b82f6', '#ffffff'],
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon yellow and cyan accents on dark grid',
    colors: {
      bgBase: '#080811',
      bgSurface: '#0f0e1f',
      bgCard: '#16142e',
      bgHover: '#211e45',
      border: '#322c60',
      borderHover: '#facc15',
      accent: '#facc15',
      accentHover: '#fde047',
      accentGlow: 'rgba(250, 204, 21, 0.4)',
      textMain: '#fef08a',
      textMuted: '#38bdf8',
      textDim: '#60a5fa',
      badgeBg: 'rgba(250, 204, 21, 0.18)',
    },
    previewColors: ['#080811', '#facc15', '#38bdf8'],
  },
  dracula: {
    id: 'dracula',
    name: 'Dracula',
    description: 'Dark slate with violet and pink accents',
    colors: {
      bgBase: '#191a24',
      bgSurface: '#21222e',
      bgCard: '#282a36',
      bgHover: '#343746',
      border: '#44475a',
      borderHover: '#6272a4',
      accent: '#ff79c6',
      accentHover: '#bd93f9',
      accentGlow: 'rgba(255, 121, 198, 0.35)',
      textMain: '#f8f8f2',
      textMuted: '#bd93f9',
      textDim: '#6272a4',
      badgeBg: 'rgba(255, 121, 198, 0.16)',
    },
    previewColors: ['#191a24', '#ff79c6', '#bd93f9'],
  },
  nord: {
    id: 'nord',
    name: 'Nord',
    description: 'Cool icy blue and slate grey tones',
    colors: {
      bgBase: '#1a1e26',
      bgSurface: '#222733',
      bgCard: '#2e3440',
      bgHover: '#3b4252',
      border: '#434c5e',
      borderHover: '#88c0d0',
      accent: '#88c0d0',
      accentHover: '#81a1c1',
      accentGlow: 'rgba(136, 192, 208, 0.35)',
      textMain: '#eceff4',
      textMuted: '#d8dee9',
      textDim: '#e5e9f0',
      badgeBg: 'rgba(136, 192, 208, 0.15)',
    },
    previewColors: ['#1a1e26', '#88c0d0', '#4c566a'],
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Green',
    description: 'Deep dark background with emerald accents',
    colors: {
      bgBase: '#04130c',
      bgSurface: '#071f14',
      bgCard: '#0d2d1e',
      bgHover: '#13402c',
      border: '#1b563c',
      borderHover: '#10b981',
      accent: '#10b981',
      accentHover: '#34d399',
      accentGlow: 'rgba(16, 185, 129, 0.35)',
      textMain: '#ecfdf5',
      textMuted: '#6ee7b7',
      textDim: '#34d399',
      badgeBg: 'rgba(16, 185, 129, 0.16)',
    },
    previewColors: ['#04130c', '#10b981', '#0d2d1e'],
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Orange',
    description: 'Warm gradient dark with coral/amber accents',
    colors: {
      bgBase: '#140a08',
      bgSurface: '#1f100c',
      bgCard: '#2b1611',
      bgHover: '#3d2019',
      border: '#532c22',
      borderHover: '#f97316',
      accent: '#f97316',
      accentHover: '#fb923c',
      accentGlow: 'rgba(249, 115, 22, 0.35)',
      textMain: '#fff7ed',
      textMuted: '#fdba74',
      textDim: '#fb923c',
      badgeBg: 'rgba(249, 115, 22, 0.16)',
    },
    previewColors: ['#140a08', '#f97316', '#2b1611'],
  },
  synthwave: {
    id: 'synthwave',
    name: 'Synthwave',
    description: 'Deep purple with hot pink and magenta glow',
    colors: {
      bgBase: '#12071e',
      bgSurface: '#1c0c2e',
      bgCard: '#271140',
      bgHover: '#361858',
      border: '#512282',
      borderHover: '#ec4899',
      accent: '#ec4899',
      accentHover: '#f43f5e',
      accentGlow: 'rgba(236, 72, 153, 0.4)',
      textMain: '#fdf2f8',
      textMuted: '#f472b6',
      textDim: '#fb7185',
      badgeBg: 'rgba(236, 72, 153, 0.18)',
    },
    previewColors: ['#12071e', '#ec4899', '#271140'],
  },
  oceanic: {
    id: 'oceanic',
    name: 'Oceanic',
    description: 'Deep navy blue with cyan and teal highlights',
    colors: {
      bgBase: '#040f1a',
      bgSurface: '#071828',
      bgCard: '#0d233a',
      bgHover: '#133252',
      border: '#1a446e',
      borderHover: '#06b6d4',
      accent: '#06b6d4',
      accentHover: '#22d3ee',
      accentGlow: 'rgba(6, 182, 212, 0.35)',
      textMain: '#ecfeff',
      textMuted: '#67e8f9',
      textDim: '#38bdf8',
      badgeBg: 'rgba(6, 182, 212, 0.16)',
    },
    previewColors: ['#040f1a', '#06b6d4', '#0d233a'],
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Red',
    description: 'Deep blood ruby dark with vivid red highlights',
    colors: {
      bgBase: '#120507',
      bgSurface: '#1c080b',
      bgCard: '#270c10',
      bgHover: '#381217',
      border: '#4c171e',
      borderHover: '#ef4444',
      accent: '#ef4444',
      accentHover: '#f87171',
      accentGlow: 'rgba(239, 68, 68, 0.35)',
      textMain: '#fef2f2',
      textMuted: '#fca5a5',
      textDim: '#f87171',
      badgeBg: 'rgba(239, 68, 68, 0.18)',
    },
    previewColors: ['#120507', '#ef4444', '#270c10'],
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix Terminal',
    description: 'Hacker terminal green on obsidian black',
    colors: {
      bgBase: '#040d06',
      bgSurface: '#07160a',
      bgCard: '#0c2210',
      bgHover: '#133519',
      border: '#1a4922',
      borderHover: '#22c55e',
      accent: '#22c55e',
      accentHover: '#4ade80',
      accentGlow: 'rgba(34, 197, 94, 0.4)',
      textMain: '#bbf7d0',
      textMuted: '#86efac',
      textDim: '#4ade80',
      badgeBg: 'rgba(34, 197, 94, 0.18)',
    },
    previewColors: ['#040d06', '#22c55e', '#0c2210'],
  },
  sakura: {
    id: 'sakura',
    name: 'Sakura Blossom',
    description: 'Pastel anime cherry blossom pink on velvet plum',
    colors: {
      bgBase: '#160a13',
      bgSurface: '#210f1c',
      bgCard: '#2d1427',
      bgHover: '#3d1b35',
      border: '#55264a',
      borderHover: '#f472b6',
      accent: '#f472b6',
      accentHover: '#f9a8d4',
      accentGlow: 'rgba(244, 114, 182, 0.35)',
      textMain: '#fdf2f8',
      textMuted: '#fbcfe8',
      textDim: '#f472b6',
      badgeBg: 'rgba(244, 114, 182, 0.18)',
    },
    previewColors: ['#160a13', '#f472b6', '#2d1427'],
  },
  solar: {
    id: 'solar',
    name: 'Solar Amber',
    description: 'Radiant gold and warm amber on obsidian base',
    colors: {
      bgBase: '#130c03',
      bgSurface: '#1e1406',
      bgCard: '#2a1c09',
      bgHover: '#3a270d',
      border: '#533713',
      borderHover: '#f59e0b',
      accent: '#f59e0b',
      accentHover: '#fbbf24',
      accentGlow: 'rgba(245, 158, 11, 0.35)',
      textMain: '#fffbeb',
      textMuted: '#fde68a',
      textDim: '#f59e0b',
      badgeBg: 'rgba(245, 158, 11, 0.18)',
    },
    previewColors: ['#130c03', '#f59e0b', '#2a1c09'],
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender Mist',
    description: 'Soft dreamy lavender with ethereal violet accents',
    colors: {
      bgBase: '#0e0b17',
      bgSurface: '#161124',
      bgCard: '#1f1833',
      bgHover: '#2b2146',
      border: '#3d2f62',
      borderHover: '#a78bfa',
      accent: '#a78bfa',
      accentHover: '#c4b5fd',
      accentGlow: 'rgba(167, 139, 250, 0.35)',
      textMain: '#f5f3ff',
      textMuted: '#ddd6fe',
      textDim: '#a78bfa',
      badgeBg: 'rgba(167, 139, 250, 0.18)',
    },
    previewColors: ['#0e0b17', '#a78bfa', '#1f1833'],
  },
  coffee: {
    id: 'coffee',
    name: 'Mocha Roast',
    description: 'Warm espresso tones with rich caramel accents',
    colors: {
      bgBase: '#130b08',
      bgSurface: '#1c110c',
      bgCard: '#281812',
      bgHover: '#38221a',
      border: '#4d2f24',
      borderHover: '#d97706',
      accent: '#d97706',
      accentHover: '#f59e0b',
      accentGlow: 'rgba(217, 119, 6, 0.35)',
      textMain: '#fffbeb',
      textMuted: '#fcd34d',
      textDim: '#d97706',
      badgeBg: 'rgba(217, 119, 6, 0.18)',
    },
    previewColors: ['#130b08', '#d97706', '#281812'],
  },
  arctic: {
    id: 'arctic',
    name: 'Arctic Frost',
    description: 'Glacial icy cyan on deep polar frost',
    colors: {
      bgBase: '#08121b',
      bgSurface: '#0d1d2b',
      bgCard: '#13283b',
      bgHover: '#1a3751',
      border: '#244d70',
      borderHover: '#38bdf8',
      accent: '#38bdf8',
      accentHover: '#7dd3fc',
      accentGlow: 'rgba(56, 189, 248, 0.35)',
      textMain: '#f0f9ff',
      textMuted: '#bae6fd',
      textDim: '#38bdf8',
      badgeBg: 'rgba(56, 189, 248, 0.18)',
    },
    previewColors: ['#08121b', '#38bdf8', '#13283b'],
  },
  gruvbox: {
    id: 'gruvbox',
    name: 'Retro Gruvbox',
    description: 'Warm cozy retro palette with pumpkin orange',
    colors: {
      bgBase: '#1d2021',
      bgSurface: '#282828',
      bgCard: '#32302f',
      bgHover: '#3c3836',
      border: '#504945',
      borderHover: '#fe8019',
      accent: '#fe8019',
      accentHover: '#fabd2f',
      accentGlow: 'rgba(254, 128, 25, 0.35)',
      textMain: '#fbf1c7',
      textMuted: '#ebdbb2',
      textDim: '#d5c4a1',
      badgeBg: 'rgba(254, 128, 25, 0.18)',
    },
    previewColors: ['#1d2021', '#fe8019', '#32302f'],
  },
  tokyo: {
    id: 'tokyo',
    name: 'Tokyo Night',
    description: 'Deep indigo night with neon electric blue and purple',
    colors: {
      bgBase: '#1a1b26',
      bgSurface: '#24283b',
      bgCard: '#292e42',
      bgHover: '#3b4261',
      border: '#414868',
      borderHover: '#7aa2f7',
      accent: '#7aa2f7',
      accentHover: '#bb9af7',
      accentGlow: 'rgba(122, 162, 247, 0.35)',
      textMain: '#c0caf5',
      textMuted: '#a9b1d6',
      textDim: '#7aa2f7',
      badgeBg: 'rgba(122, 162, 247, 0.18)',
    },
    previewColors: ['#1a1b26', '#7aa2f7', '#bb9af7'],
  },
  amethyst: {
    id: 'amethyst',
    name: 'Royal Amethyst',
    description: 'Deep royal purple velvet with golden highlights',
    colors: {
      bgBase: '#130a1c',
      bgSurface: '#1c102a',
      bgCard: '#27173b',
      bgHover: '#36214f',
      border: '#4c2e6f',
      borderHover: '#fbbf24',
      accent: '#c084fc',
      accentHover: '#e879f9',
      accentGlow: 'rgba(192, 132, 252, 0.35)',
      textMain: '#faf5ff',
      textMuted: '#e9d5ff',
      textDim: '#c084fc',
      badgeBg: 'rgba(192, 132, 252, 0.18)',
    },
    previewColors: ['#130a1c', '#c084fc', '#fbbf24'],
  },
};

export const ACCENT_PRESETS = [
  { id: 'purple', name: 'Electric Purple', hex: '#9333ea' },
  { id: 'cyan', name: 'Cyber Cyan', hex: '#06b6d4' },
  { id: 'emerald', name: 'Emerald Green', hex: '#10b981' },
  { id: 'blue', name: 'Vivid Blue', hex: '#3b82f6' },
  { id: 'sunset', name: 'Sunset Orange', hex: '#f97316' },
  { id: 'crimson', name: 'Crimson Red', hex: '#ef4444' },
  { id: 'pink', name: 'Neon Pink', hex: '#ec4899' },
  { id: 'yellow', name: 'Neon Yellow', hex: '#eab308' },
  { id: 'teal', name: 'Mint Teal', hex: '#14b8a6' },
];

export const CURSOR_PRESETS = [
  { id: 'default', name: 'Standard Arrow', description: 'Clean default system cursor' },
  { id: 'crosshair', name: 'Tactical Crosshair', description: 'Precision crosshair gaming reticle' },
  { id: 'dot', name: 'Minimalist Dot', description: 'Sleek modern red/accent dot' },
  { id: 'glow', name: 'Neon Glow', description: 'Smooth glowing pointer' },
  { id: 'retro', name: 'Retro Pixel', description: 'Classic 8-bit arcade style arrow' },
  { id: 'sword', name: 'Knight Sword', description: 'Fantasy game dagger / blade pointer' },
  { id: 'sniper', name: 'Precision Sniper', description: 'Mil-dot sniper rifle optics with red laser pinpoint' },
  { id: 'energy', name: 'Plasma Energy Blade', description: 'Sci-fi dual glowing plasma energy prongs' },
  { id: 'laser', name: 'Cyber Laser Pointer', description: 'Futuristic arrowhead with targeting bracket' },
  { id: 'pickaxe', name: 'Diamond Pickaxe', description: 'Voxel 8-bit mining tool for arcade block builders' },
  { id: 'wand', name: 'Magic Star Wand', description: 'Celestial wand casting glowing 4-point star sparkles' },
  { id: 'radar', name: 'Sonar Radar', description: 'Military radar HUD with scanning green sweep' },
  { id: 'scythe', name: 'Reaper Scythe', description: 'Curved obsidian soul blade with glowing edge' },
  { id: 'gauntlet', name: 'Pixel Power Glove', description: 'Retro 8-bit pointing hand with gold wristband' },
  { id: 'kunai', name: 'Shinobi Kunai', description: 'Japanese ninja throwing blade with ring grip' },
  { id: 'target', name: 'Lock-On Bracket', description: 'Fighter jet HUD acquisition lock brackets' },
];

export const WALLPAPER_CATEGORIES = [
  { id: 'all', name: 'All Wallpapers' },
  { id: 'minimal', name: 'Minimal & Grid' },
  { id: 'neon', name: 'Cyberpunk & Neon' },
  { id: 'space', name: 'Space & Nebula' },
  { id: 'retro', name: 'Retro & Pixel' },
  { id: 'nature', name: 'Nature & Landscape' },
  { id: 'abstract', name: 'Abstract & 3D' },
  { id: 'custom', name: 'Custom Image URL' },
];

export const WALLPAPERS = [
  // Minimal & Grid (Instant pure CSS)
  {
    id: 'none',
    category: 'minimal',
    name: 'Solid Theme Background',
    description: 'Clean solid theme background with no pattern',
    css: 'none',
  },
  {
    id: 'neongrid',
    category: 'minimal',
    name: 'Cyber Neon Grid',
    description: 'Futuristic glowing coordinate grid pattern',
    css: 'linear-gradient(to right, rgba(147,51,234,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(147,51,234,0.08) 1px, transparent 1px)',
    size: '40px 40px',
  },
  {
    id: 'dots',
    category: 'minimal',
    name: 'Cosmic Dot Matrix',
    description: 'Subtle stardust point matrix for a clean modern look',
    css: 'radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)',
    size: '24px 24px',
  },
  {
    id: 'diagonal',
    category: 'minimal',
    name: 'Stealth Diagonal Stripes',
    description: 'Classic gaming diagonal carbon hatch texture',
    css: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.02) 10px, transparent 0, transparent 20px)',
  },
  {
    id: 'matrix',
    category: 'minimal',
    name: 'Matrix Digital Code',
    description: 'Subtle vertical digital matrix green terminal lines',
    css: 'linear-gradient(to bottom, rgba(34,197,94,0.05) 1px, transparent 1px)',
    size: '100% 28px',
  },
  {
    id: 'hexgrid',
    category: 'minimal',
    name: 'Hexagonal Cyber Mesh',
    description: 'Honeycomb polygon carbon mesh structure',
    css: 'radial-gradient(circle at 50% 50%, rgba(147,51,234,0.06) 2px, transparent 3px), radial-gradient(circle at 0% 100%, rgba(59,130,246,0.06) 2px, transparent 3px)',
    size: '32px 32px',
  },
  {
    id: 'blueprint',
    category: 'minimal',
    name: 'Architectural Blueprint',
    description: 'Technical engineering blueprint drafting grid',
    css: 'linear-gradient(rgba(56,189,248,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.08) 1px, transparent 1px), linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)',
    size: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
  },

  // Cyberpunk & Neon
  {
    id: 'aurora',
    category: 'neon',
    name: 'Aurora Glow',
    description: 'Ethereal glowing aura orbs floating in ambient space',
    css: 'radial-gradient(circle at 20% 20%, rgba(147,51,234,0.22) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59,130,246,0.22) 0%, transparent 50%)',
  },
  {
    id: 'cyberpunk',
    category: 'neon',
    name: 'Cyberpunk Neon Beam',
    description: 'Vibrant neon gradient sweep across the screen',
    css: 'linear-gradient(135deg, rgba(250,204,21,0.09) 0%, rgba(56,189,248,0.09) 50%, rgba(236,72,153,0.09) 100%)',
  },
  {
    id: 'cybercity',
    category: 'neon',
    name: 'Neo Tokyo Night City',
    description: 'Vibrant cyberpunk metropolis skyline bathed in purple rain',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'neonstreet',
    category: 'neon',
    name: 'Shinjuku Cyber Alley',
    description: 'Atmospheric neon sign reflections along wet Tokyo streets',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'cybercar',
    category: 'neon',
    name: 'Midnight Supercar Horizon',
    description: 'Neon light trails on an empty midnight highway',
    imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1920&q=80',
  },

  // Space & Nebula
  {
    id: 'deepspace',
    category: 'space',
    name: 'Deep Space Galaxy',
    description: 'Cosmic deep nebula view with dense star clusters',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'violetnebula',
    category: 'space',
    name: 'Stellar Violet Nebula',
    description: 'Swirling luminous cosmic dust and celestial starlight',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'earthorbit',
    category: 'space',
    name: 'Earth from Orbit',
    description: 'Majestic curve of planet Earth with atmospheric glow',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'marsred',
    category: 'space',
    name: 'Martian Sunset Dunes',
    description: 'Alien red planet sands stretching under a cosmic twilight',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
  },

  // Retro & Pixel
  {
    id: 'retroarcade',
    category: 'retro',
    name: 'Synthwave Highway 80s',
    description: 'Retro 80s wireframe sunset road vanishing horizon',
    imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'arcaderoom',
    category: 'retro',
    name: 'Nostalgia Arcade Hall',
    description: 'Glowing retro arcade cabinets in a moody 90s game room',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'synthgrid',
    category: 'retro',
    name: 'Outrun Perspective Grid',
    description: 'Pure CSS 3D perspective floor grid vanishing into the horizon',
    css: 'linear-gradient(to bottom, rgba(147,51,234,0.02) 0%, rgba(236,72,153,0.12) 100%), repeating-linear-gradient(to right, rgba(56,189,248,0.1) 0, rgba(56,189,248,0.1) 1px, transparent 1px, transparent 40px)',
    size: '100% 100%',
  },

  // Nature & Landscapes
  {
    id: 'naturemountain',
    category: 'nature',
    name: 'Misty Alpine Mountains',
    description: 'Calm moody mountain peaks under twilight fog',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'japanforest',
    category: 'nature',
    name: 'Kyoto Bamboo Forest',
    description: 'Peaceful zen forest with ambient sunlight filtering through',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'auroraborealis',
    category: 'nature',
    name: 'Arctic Aurora Borealis',
    description: 'Luminous green northern lights dancing over frozen fjords',
    imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'twilightocean',
    category: 'nature',
    name: 'Deep Ocean Twilight',
    description: 'Mysterious dark ocean tide with calming reflective ripples',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'fujisakura',
    category: 'nature',
    name: 'Mount Fuji & Sakura',
    description: 'Iconic snow-capped volcano framed by twilight cherry blossoms',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1920&q=80',
  },

  // Abstract & 3D
  {
    id: 'darkwaves',
    category: 'abstract',
    name: 'Obsidian Silk Waves',
    description: 'Smooth undulating liquid ripples in obsidian dark tones',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'prisms',
    category: 'abstract',
    name: 'Prismatic Crystal Shards',
    description: 'Geometric refracted light crystals on a dark backdrop',
    imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'quantumradial',
    category: 'abstract',
    name: 'Quantum Warp Core',
    description: 'Hypnotic dark vortex radial aura radiating from the center',
    css: 'radial-gradient(circle at center, rgba(147,51,234,0.18) 0%, rgba(59,130,246,0.12) 35%, transparent 70%)',
  },
];

export function applyTheme(themeId, customAccent = '', customCursor = 'default') {
  const theme = THEMES[themeId] || THEMES.midnight;
  const root = document.documentElement;

  // Apply CSS custom properties
  root.style.setProperty('--bg-base', theme.colors.bgBase);
  root.style.setProperty('--bg-surface', theme.colors.bgSurface);
  root.style.setProperty('--bg-card', theme.colors.bgCard);
  root.style.setProperty('--bg-hover', theme.colors.bgHover);
  root.style.setProperty('--border-color', theme.colors.border);
  root.style.setProperty('--border-hover', theme.colors.borderHover);

  // Custom Accent or Theme Accent
  const activeAccent = customAccent && customAccent.trim().startsWith('#')
    ? customAccent.trim()
    : theme.colors.accent;

  root.style.setProperty('--accent-color', activeAccent);
  root.style.setProperty('--accent-hover', activeAccent);
  root.style.setProperty('--accent-glow', `${activeAccent}55`);
  root.style.setProperty('--badge-bg', `${activeAccent}22`);

  root.style.setProperty('--text-main', theme.colors.textMain);
  root.style.setProperty('--text-muted', theme.colors.textMuted);
  root.style.setProperty('--text-dim', theme.colors.textDim);

  // Set data-theme attribute
  root.setAttribute('data-theme', themeId);

  // Apply custom cursor
  applyCursor(customCursor, activeAccent);
}

export function svgToCursorDataUri(svgString) {
  try {
    const cleanSvg = svgString.trim();
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
      const b64 = window.btoa(unescape(encodeURIComponent(cleanSvg)));
      return `url('data:image/svg+xml;base64,${b64}')`;
    }
  } catch (err) {
    console.error('Error converting SVG cursor to base64:', err);
  }
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString.trim())}")`;
}

export function getCursorSvg(cursorType, accentColor = '#9333ea') {
  const accent = accentColor || '#9333ea';

  // 1. Tactical Crosshair
  if (cursorType === 'crosshair') {
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="${accent}" stroke-width="1.6" stroke-opacity="0.9"/><circle cx="12" cy="12" r="1.5" fill="#ffffff"/><line x1="12" y1="1" x2="12" y2="7" stroke="${accent}" stroke-width="1.8" stroke-linecap="round"/><line x1="12" y1="17" x2="12" y2="23" stroke="${accent}" stroke-width="1.8" stroke-linecap="round"/><line x1="1" y1="12" x2="7" y2="12" stroke="${accent}" stroke-width="1.8" stroke-linecap="round"/><line x1="17" y1="12" x2="23" y2="12" stroke="${accent}" stroke-width="1.8" stroke-linecap="round"/></svg>`,
      hotspotX: 12,
      hotspotY: 12,
      fallback: 'crosshair',
    };
  }

  // 2. Minimalist Dot
  if (cursorType === 'dot') {
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="${accent}" fill-opacity="0.35"/><circle cx="10" cy="10" r="4.5" fill="${accent}" stroke="#ffffff" stroke-width="1.5"/><circle cx="10" cy="10" r="1.5" fill="#ffffff"/></svg>`,
      hotspotX: 10,
      hotspotY: 10,
      fallback: 'crosshair',
    };
  }

  // 3. Neon Glow Arrow
  if (cursorType === 'glow') {
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path d="M4 2 L4 22 L9 17 L13 25 L16 23.5 L12 15.5 L19 15.5 Z" fill="${accent}" fill-opacity="0.45" stroke="${accent}" stroke-width="3" stroke-linejoin="round"/><path d="M4 2 L4 22 L9 17 L13 25 L16 23.5 L12 15.5 L19 15.5 Z" fill="${accent}" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round"/><circle cx="4" cy="2" r="1.5" fill="#ffffff"/></svg>`,
      hotspotX: 4,
      hotspotY: 2,
      fallback: 'default',
    };
  }

  // 4. Retro Pixel Arrow
  if (cursorType === 'retro') {
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" shape-rendering="crispEdges"><path d="M1 1v17h4v-3h2v3h2v2h2v-4h-2v-2h3v-2h-2v-2h-2v-2h-2V5h-2V3h-2V1H1z" fill="#000000"/><path d="M2 2v14h2v-3h2v-1h2v-2h2v-2h-2V6h-2V4h-2V2H2z" fill="${accent}"/><path d="M2 2v12h1V4h2V3h2V2H2z" fill="#ffffff"/></svg>`,
      hotspotX: 1,
      hotspotY: 1,
      fallback: 'default',
    };
  }

  // 5. Knight Sword
  if (cursorType === 'sword') {
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path d="M2 2 L13 9 L9 13 Z" fill="#ffffff" stroke="#000000" stroke-width="0.8"/><path d="M2 2 L9 13 L13 13 L13 9 Z" fill="${accent}" stroke="#000000" stroke-width="0.8"/><line x1="2" y1="2" x2="11" y2="11" stroke="#ffffff" stroke-width="1.2"/><rect x="8" y="14" width="9" height="3" rx="1" transform="rotate(-45 12.5 15.5)" fill="#facc15" stroke="#000000" stroke-width="0.8"/><line x1="14" y1="14" x2="20" y2="20" stroke="#92400e" stroke-width="3" stroke-linecap="round"/><line x1="15" y1="15" x2="19" y2="19" stroke="#fef08a" stroke-width="1"/><circle cx="21" cy="21" r="2.5" fill="#facc15" stroke="#000000" stroke-width="0.8"/><circle cx="2" cy="2" r="1.5" fill="#ffffff"/></svg>`,
      hotspotX: 2,
      hotspotY: 2,
      fallback: 'default',
    };
  }

  // 6. Precision Sniper
  if (cursorType === 'sniper') {
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="11" fill="none" stroke="${accent}" stroke-width="1.6" stroke-opacity="0.9"/><circle cx="13" cy="13" r="6" fill="none" stroke="${accent}" stroke-width="1" stroke-dasharray="2 2" stroke-opacity="0.8"/><line x1="13" y1="0" x2="13" y2="9" stroke="${accent}" stroke-width="1.6"/><line x1="13" y1="17" x2="13" y2="26" stroke="${accent}" stroke-width="1.6"/><line x1="0" y1="13" x2="9" y2="13" stroke="${accent}" stroke-width="1.6"/><line x1="17" y1="13" x2="26" y2="13" stroke="${accent}" stroke-width="1.6"/><circle cx="13" cy="13" r="2" fill="#ef4444" stroke="#ffffff" stroke-width="0.8"/></svg>`,
      hotspotX: 13,
      hotspotY: 13,
      fallback: 'crosshair',
    };
  }

  // 7. Plasma Energy Blade
  if (cursorType === 'energy') {
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path d="M3 3 C8 6 12 11 15 17 L12 18 C10 13 6 8 3 3 Z" fill="${accent}" stroke="#ffffff" stroke-width="0.8"/><path d="M3 3 C6 8 11 12 17 15 L18 12 C13 10 8 6 3 3 Z" fill="${accent}" stroke="#ffffff" stroke-width="0.8"/><path d="M12 18 L18 12 L24 22 L22 24 Z" fill="#1e293b" stroke="#475569" stroke-width="1"/><circle cx="3" cy="3" r="2" fill="#ffffff"/><line x1="7" y1="7" x2="14" y2="14" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"/></svg>`,
      hotspotX: 3,
      hotspotY: 3,
      fallback: 'default',
    };
  }

  // 8. Cyber Laser Pointer
  if (cursorType === 'laser') {
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><polygon points="2,2 22,10 14,14 10,22" fill="${accent}" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round"/><polyline points="2,2 14,14" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/><polyline points="7,2 2,2 2,7" fill="none" stroke="${accent}" stroke-width="1.6"/><circle cx="2" cy="2" r="1.5" fill="#ffffff"/></svg>`,
      hotspotX: 2,
      hotspotY: 2,
      fallback: 'default',
    };
  }

  // 9. Diamond Pickaxe
  if (cursorType === 'pickaxe') {
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" shape-rendering="crispEdges"><path d="M2 6 L6 2 L13 3 L9 8 L6 6 L3 10 Z" fill="#06b6d4" stroke="#083344" stroke-width="0.8"/><path d="M6 2 L15 4 L11 8 L7 5 Z" fill="#38bdf8"/><path d="M2 6 L4 15 L8 11 L5 7 Z" fill="#38bdf8"/><line x1="8" y1="8" x2="22" y2="22" stroke="#78350f" stroke-width="3.5" stroke-linecap="square"/><line x1="9" y1="9" x2="21" y2="21" stroke="#b45309" stroke-width="1.5"/><circle cx="2" cy="2" r="1.5" fill="#ffffff"/></svg>`,
      hotspotX: 2,
      hotspotY: 2,
      fallback: 'default',
    };
  }

  // 10. Magic Star Wand
  if (cursorType === 'wand') {
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"><line x1="7" y1="7" x2="23" y2="23" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round"/><line x1="16" y1="16" x2="23" y2="23" stroke="#facc15" stroke-width="3" stroke-linecap="round"/><polygon points="4,0 6,4 10,6 6,8 4,12 2,8 -2,6 2,4" transform="translate(3, 0)" fill="#facc15" stroke="${accent}" stroke-width="0.8"/><circle cx="7" cy="6" r="1.5" fill="#ffffff"/><circle cx="12" cy="2" r="1" fill="#fde047"/><circle cx="2" cy="12" r="1" fill="#fde047"/></svg>`,
      hotspotX: 7,
      hotspotY: 6,
      fallback: 'default',
    };
  }

  // 11. Sonar Radar
  if (cursorType === 'radar') {
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="${accent}" stroke-width="1.5"/><circle cx="12" cy="12" r="5" fill="none" stroke="${accent}" stroke-width="1" stroke-opacity="0.6"/><line x1="12" y1="2" x2="12" y2="22" stroke="${accent}" stroke-width="1.2"/><line x1="2" y1="12" x2="22" y2="12" stroke="${accent}" stroke-width="1.2"/><path d="M12 12 L19 5" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="#22c55e"/></svg>`,
      hotspotX: 12,
      hotspotY: 12,
      fallback: 'crosshair',
    };
  }

  // 12. Reaper Scythe
  if (cursorType === 'scythe') {
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path d="M3 3 C10 1 20 5 22 14 C19 11 13 9 7 11 Z" fill="${accent}" stroke="#ffffff" stroke-width="1"/><path d="M3 3 C7 2 15 5 18 11 Z" fill="#ffffff"/><line x1="7" y1="10" x2="24" y2="26" stroke="#475569" stroke-width="2.5" stroke-linecap="round"/><line x1="16" y1="18" x2="24" y2="26" stroke="#1e293b" stroke-width="3.2" stroke-linecap="round"/><circle cx="3" cy="3" r="1.5" fill="#ffffff"/></svg>`,
      hotspotX: 3,
      hotspotY: 3,
      fallback: 'default',
    };
  }

  // 13. Pixel Power Glove
  if (cursorType === 'gauntlet') {
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" shape-rendering="crispEdges"><path d="M7 1h3v8h-3z" fill="${accent}"/><path d="M10 5h3v7h-3z" fill="${accent}"/><path d="M13 7h3v6h-3z" fill="${accent}"/><path d="M4 9h3v6h-3z" fill="${accent}"/><path d="M4 15h12v4H4z" fill="#000000"/><path d="M5 16h10v2H5z" fill="#facc15"/><path d="M6 0h5v1H6zM6 1h1v8H6zM10 1h1v4h-1zM13 5h1v2h-1zM16 7h1v7h-1zM3 9h1v6H3zM3 15h1v5H3zM16 14h1v6h-1zM4 20h12v1H4z" fill="#ffffff"/><circle cx="8" cy="2" r="1.5" fill="#ffffff"/></svg>`,
      hotspotX: 8,
      hotspotY: 2,
      fallback: 'default',
    };
  }

  // 14. Shinobi Kunai
  if (cursorType === 'kunai') {
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"><path d="M2 2 L12 6 L6 12 Z" fill="#e2e8f0" stroke="#0f172a" stroke-width="0.8"/><path d="M2 2 L6 12 L7 11 L11 7 L12 6 Z" fill="${accent}" stroke="#0f172a" stroke-width="0.8"/><line x1="2" y1="2" x2="8" y2="8" stroke="#ffffff" stroke-width="1.2"/><line x1="8" y1="8" x2="18" y2="18" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/><circle cx="21" cy="21" r="3" fill="none" stroke="#64748b" stroke-width="2"/><circle cx="2" cy="2" r="1.5" fill="#ffffff"/></svg>`,
      hotspotX: 2,
      hotspotY: 2,
      fallback: 'default',
    };
  }

  // 15. Lock-On Bracket
  if (cursorType === 'target') {
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M2 7 V2 H7" fill="none" stroke="${accent}" stroke-width="2"/><path d="M17 2 H22 V7" fill="none" stroke="${accent}" stroke-width="2"/><path d="M22 17 V22 H17" fill="none" stroke="${accent}" stroke-width="2"/><path d="M7 22 H2 V17" fill="none" stroke="${accent}" stroke-width="2"/><line x1="12" y1="7" x2="12" y2="10" stroke="#ef4444" stroke-width="1.8"/><line x1="12" y1="14" x2="12" y2="17" stroke="#ef4444" stroke-width="1.8"/><line x1="7" y1="12" x2="10" y2="12" stroke="#ef4444" stroke-width="1.8"/><line x1="14" y1="12" x2="17" y2="12" stroke="#ef4444" stroke-width="1.8"/><circle cx="12" cy="12" r="1.5" fill="#ef4444"/></svg>`,
      hotspotX: 12,
      hotspotY: 12,
      fallback: 'crosshair',
    };
  }

  return null;
}

export function applyCursor(cursorType, accentColor = '#9333ea') {
  const styleId = 'grrmondays-custom-cursor';
  let el = document.getElementById(styleId);
  if (!el) {
    el = document.createElement('style');
    el.id = styleId;
    document.head.appendChild(el);
  }

  if (!cursorType || cursorType === 'default') {
    el.innerHTML = '';
    try {
      document.documentElement.style.removeProperty('cursor');
      document.body.style.removeProperty('cursor');
    } catch {
      // ignore
    }
    return;
  }

  const cursorData = getCursorSvg(cursorType, accentColor);
  if (!cursorData) {
    if (cursorType === 'crosshair') {
      const fallbackRule = `html, body, *, *::before, *::after, button, a, input, select, textarea, [role="button"], button:hover, a:hover, *:hover { cursor: crosshair !important; }`;
      el.innerHTML = fallbackRule;
      try {
        document.documentElement.style.cursor = 'crosshair';
        document.body.style.cursor = 'crosshair';
      } catch {
        // ignore
      }
    } else {
      el.innerHTML = '';
    }
    return;
  }

  const cursorUri = svgToCursorDataUri(cursorData.svg);
  const fallbackUri = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(cursorData.svg.trim())}")`;
  const cursorCssVal = `${cursorUri} ${cursorData.hotspotX} ${cursorData.hotspotY}, ${fallbackUri} ${cursorData.hotspotX} ${cursorData.hotspotY}, ${cursorData.fallback}`;

  // Complete selector ensuring the custom cursor applies universally across all elements, inputs, buttons and pseudo-classes
  el.innerHTML = `
    html, body, *, *::before, *::after,
    button, a, input, select, textarea, [role="button"],
    button:hover, a:hover, *:hover, *:active {
      cursor: ${cursorCssVal} !important;
    }
  `;

  try {
    document.documentElement.style.setProperty('cursor', cursorCssVal, 'important');
    document.body.style.setProperty('cursor', cursorCssVal, 'important');
  } catch {
    // ignore
  }
}

