import {
  DEFAULT_SETTINGS,
  DEFAULT_SHORTCUTS,
  INITIAL_GAMES,
} from '../data/initialData';

const STORAGE_KEYS = {
  GAMES: 'grrmondays_games_library_v4',
  SETTINGS: 'grrmondays_app_settings_v2',
  SHORTCUTS: 'grrmondays_shortcuts_v2',
  FAVORITES: 'grrmondays_favorite_ids_v2',
  APP_FAVORITES: 'grrmondays_app_favorite_ids_v1',
  RECENTLY_OPENED: 'grrmondays_recently_opened_v2',
  PROFILE: 'grrmondays_user_profile_v2',
  NOTIFICATIONS: 'grrmondays_notifications_v2',
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Welcome to grrmondays v4 Update',
    message: 'Added live clock, home dashboard, universal search, custom accent picker, and wallpaper browser.',
    timestamp: 'Just now',
    type: 'feature',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Cleaned & Rescued Games Catalog',
    message: 'Removed 541 broken domain links. 1,930+ games are verified and running at high speed.',
    timestamp: '1 hour ago',
    type: 'system',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Custom Cursor & Audio FX',
    message: 'Head over to Settings > Audio & Cursors to enable Web Audio UI sounds and retro gaming reticles.',
    timestamp: 'Today',
    type: 'tip',
    read: true,
  },
];

export const getStoredNotifications = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) return INITIAL_NOTIFICATIONS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

export const saveStoredNotifications = (notifs) => {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  } catch (err) {
    console.error('Failed to save notifications', err);
  }
};

export const getStoredRecentlyOpened = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENTLY_OPENED);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const addStoredRecentlyOpened = (item) => {
  if (!item || !item.id) return [];
  try {
    const current = getStoredRecentlyOpened();
    const filtered = current.filter((x) => x.id !== item.id);
    const updated = [
      {
        ...item,
        openedAt: Date.now(),
      },
      ...filtered,
    ].slice(0, 24); // Keep top 24 recently opened
    localStorage.setItem(STORAGE_KEYS.RECENTLY_OPENED, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const clearStoredRecentlyOpened = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.RECENTLY_OPENED);
  } catch (err) {
    console.error(err);
  }
};

export const getStoredUserProfile = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      return {
        username: 'GrrPlayer',
        title: 'Retro Gamer',
        bio: 'Enjoying unblocked games on grrmondays.',
        avatar: 'gamepad',
        avatarColor: '#9333ea',
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      username: 'GrrPlayer',
      title: 'Retro Gamer',
      bio: 'Enjoying unblocked games on grrmondays.',
      avatar: 'gamepad',
      avatarColor: '#9333ea',
    };
  }
};

export const saveStoredUserProfile = (profile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile', err);
  }
};

export const getStoredShortcuts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHORTCUTS);
    if (!raw) return DEFAULT_SHORTCUTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SHORTCUTS;
  } catch (err) {
    return DEFAULT_SHORTCUTS;
  }
};

export const saveStoredShortcuts = (shortcuts) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SHORTCUTS, JSON.stringify(shortcuts));
  } catch (err) {
    console.error('Failed to save shortcuts', err);
  }
};

export const getStoredGames = () => {
  try {
    const favsRaw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    const favSet = new Set(favsRaw ? JSON.parse(favsRaw) : []);

    // Check v4, or fall back to previous v3/v2 storage to migrate user data
    const rawV4 = localStorage.getItem(STORAGE_KEYS.GAMES);
    const rawV3 = localStorage.getItem('grrmondays_games_library_v3');
    const rawV2 = localStorage.getItem('grrmondays_games_library_v2');
    const raw = rawV4 || rawV3 || rawV2;

    const savedGames = raw ? JSON.parse(raw) : [];
    const savedMap = new Map();
    if (Array.isArray(savedGames)) {
      for (const g of savedGames) {
        if (g && g.id) {
          // Exclude any games from blocked domain
          if (g.url && g.url.includes('theavancehotel.com')) continue;
          savedMap.set(g.id, g);
          if (g.isFavorite) favSet.add(g.id);
        }
      }
    }

    // Always ensure all INITIAL_GAMES are present
    const initialIdSet = new Set(INITIAL_GAMES.map((g) => g.id));

    // 1. Seed/update all built-in games, merging any user favorites or custom play stats
    const mergedInitial = INITIAL_GAMES.map((g) => {
      const userSaved = savedMap.get(g.id);
      return {
        ...g,
        plays: userSaved && typeof userSaved.plays === 'number' ? userSaved.plays : g.plays,
        isFavorite: favSet.has(g.id) || (userSaved?.isFavorite ?? false),
      };
    });

    // 2. Preserve any custom games the user manually added that are not part of INITIAL_GAMES
    const customUserGames = [];
    for (const [id, g] of savedMap.entries()) {
      if (!initialIdSet.has(id)) {
        if (g.url && g.url.includes('theavancehotel.com')) continue;
        customUserGames.push({
          ...g,
          isFavorite: favSet.has(g.id) || g.isFavorite,
        });
      }
    }

    const finalLibrary = [...mergedInitial, ...customUserGames];

    // Save back to v4 and clear old legacy keys
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(finalLibrary));
    try {
      localStorage.removeItem('grrmondays_games_library_v3');
      localStorage.removeItem('grrmondays_games_library_v2');
    } catch (e) {}

    return finalLibrary;
  } catch (err) {
    console.error('Failed to load games from localStorage', err);
    return INITIAL_GAMES;
  }
};

export const saveStoredGames = (games) => {
  try {
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
  } catch (err) {
    console.error('Failed to save games to localStorage', err);
  }
};

export const saveFavoriteIds = (ids) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to save favorites', err);
  }
};

export const getStoredAppFavorites = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APP_FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveStoredAppFavorites = (ids) => {
  try {
    localStorage.setItem(STORAGE_KEYS.APP_FAVORITES, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to save app favorites', err);
  }
};

export const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    const customKey = parsed.aiCustomApiKey?.trim() || '';
    // If the saved key is the disabled free tier key, clear it to prevent 403 latency
    const sanitizedKey =
      customKey === 'sk-navy-lZ4HVhr_FVvz9cmg1S4M5VjqxhknLWHPwezTNYssxlg'
        ? ''
        : customKey;

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      aiCustomApiKey: sanitizedKey,
    };
  } catch (err) {
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
};

export const clearAllData = () => {
  try {
    localStorage.clear();
  } catch (err) {
    console.error('Failed to clear localStorage', err);
  }
};
