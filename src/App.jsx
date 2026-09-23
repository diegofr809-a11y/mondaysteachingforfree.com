import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  getStoredGames,
  saveStoredGames,
  getStoredSettings,
  saveStoredSettings,
  saveFavoriteIds,
  addStoredRecentlyOpened,
  getStoredNotifications,
  saveStoredNotifications,
  getStoredUserProfile,
} from './utils/storage';
import { applyTabCloak, triggerPanic } from './utils/cloak';
import { applyTheme, applyCursor, WALLPAPERS } from './utils/theme';
import { INITIAL_GAMES, DEFAULT_SHORTCUTS } from './data/initialData';
import { WindowsDesktop } from './components/windows/WindowsDesktop';
import { WindowsWindow } from './components/windows/WindowsWindow';
import { WindowsTaskbar } from './components/windows/WindowsTaskbar';
import { WindowsStartMenu } from './components/windows/WindowsStartMenu';
import { LucideHomeView } from './components/LucideHomeView';
import { LucideGamesView } from './components/LucideGamesView';
import { LucideSettingsView } from './components/LucideSettingsView';
import { GamePlayerModal } from './components/GamePlayerModal';
import { AddGameModal } from './components/AddGameModal';
import { UniversalSearchModal } from './components/UniversalSearchModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { PlayerApp } from './components/player/PlayerApp';
import { PlayerMiniWidget } from './components/player/PlayerMiniWidget';
import { SpotifyIcon } from './components/player/SpotifyIcon';
import { GeminiChatbotView } from './components/GeminiChatbotView';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import { Gamepad2, Home, Heart, Settings, CheckCircle2, X, Sparkles } from 'lucide-react';
import { sounds } from './utils/sound';

export default function App() {
  return (
    <MusicPlayerProvider>
      <AppContent />
    </MusicPlayerProvider>
  );
}

function AppContent() {
  // Persistent storage state
  const [games, setGames] = useState(getStoredGames);
  const [settings, setSettings] = useState(getStoredSettings);
  const [notifications, setNotifications] = useState(getStoredNotifications);
  const [userProfile, setUserProfile] = useState(getStoredUserProfile);

  // Windows 11 Window Manager State (Desktop starts clean with taskbar and shortcuts ready)
  const [windows, setWindows] = useState({
    player: { isOpen: false, isMinimized: false, isMaximized: false },
    chatbot: { isOpen: false, isMinimized: false, isMaximized: false },
    games: { isOpen: false, isMinimized: false, isMaximized: false },
    home: { isOpen: false, isMinimized: false, isMaximized: false },
    favorites: { isOpen: false, isMinimized: false, isMaximized: false },
    settings: { isOpen: false, isMinimized: false, isMaximized: false },
  });
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [windowZIndices, setWindowZIndices] = useState({
    player: 25,
    chatbot: 20,
    games: 20,
    home: 20,
    favorites: 20,
    settings: 20,
  });

  const [settingsInitialTab, setSettingsInitialTab] = useState('appearance');
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  // Modals state
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const [activeGameToPlay, setActiveGameToPlay] = useState(null);
  const [isGameMinimized, setIsGameMinimized] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Bring a window to front
  const bringWindowToFront = (winId) => {
    setActiveWindowId(winId);
    setWindowZIndices((prev) => {
      const maxZ = Math.max(...Object.values(prev), 20);
      return { ...prev, [winId]: maxZ + 1 };
    });
  };

  // Open / Restore a specific window
  const openWindow = (winId, initialTab = 'appearance') => {
    sounds.playClick(settings.soundEffectsEnabled);
    if (winId === 'settings') {
      setSettingsInitialTab(initialTab);
    }
    setWindows((prev) => ({
      ...prev,
      [winId]: {
        isOpen: true,
        isMinimized: false,
        isMaximized: prev[winId]?.isMaximized || false,
      },
    }));
    bringWindowToFront(winId);
    setIsStartMenuOpen(false);
  };

  // Taskbar Click: toggle between focus / minimize
  const toggleWindow = (winId) => {
    const current = windows[winId];
    if (!current?.isOpen) {
      openWindow(winId);
    } else if (current.isMinimized) {
      // Restore from minimize
      setWindows((prev) => ({
        ...prev,
        [winId]: { ...prev[winId], isMinimized: false },
      }));
      bringWindowToFront(winId);
    } else if (activeWindowId === winId) {
      // Currently active and clicked again -> minimize
      setWindows((prev) => ({
        ...prev,
        [winId]: { ...prev[winId], isMinimized: true },
      }));
      setActiveWindowId(null);
    } else {
      // Open but background -> bring to focus
      bringWindowToFront(winId);
    }
  };

  const closeWindow = (winId) => {
    sounds.playClick(settings.soundEffectsEnabled);
    setWindows((prev) => ({
      ...prev,
      [winId]: { ...prev[winId], isOpen: false },
    }));
    if (activeWindowId === winId) {
      // Focus next open window or null
      const otherOpen = Object.keys(windows).find(
        (id) => id !== winId && windows[id].isOpen && !windows[id].isMinimized
      );
      setActiveWindowId(otherOpen || null);
    }
  };

  const minimizeWindow = (winId) => {
    sounds.playClick(settings.soundEffectsEnabled);
    setWindows((prev) => ({
      ...prev,
      [winId]: { ...prev[winId], isMinimized: true },
    }));
    if (activeWindowId === winId) {
      setActiveWindowId(null);
    }
  };

  const maximizeWindow = (winId) => {
    sounds.playClick(settings.soundEffectsEnabled);
    setWindows((prev) => ({
      ...prev,
      [winId]: { ...prev[winId], isMaximized: !prev[winId].isMaximized },
    }));
    bringWindowToFront(winId);
  };

  // Windows 11 "Show Desktop" action
  const handleShowDesktop = () => {
    const hasUnminimized = Object.values(windows).some(
      (w) => w.isOpen && !w.isMinimized
    );
    if (hasUnminimized || (activeGameToPlay && !isGameMinimized)) {
      // Minimize all
      setWindows((prev) => {
        const next = {};
        for (const k in prev) {
          next[k] = { ...prev[k], isMinimized: true };
        }
        return next;
      });
      if (activeGameToPlay) setIsGameMinimized(true);
      setActiveWindowId(null);
    } else {
      // Restore last window
      openWindow('games');
    }
  };

  // Apply theme dynamically to CSS variables whenever setting changes
  useEffect(() => {
    applyTheme(settings.theme, settings.customAccentColor, settings.customCursor);
  }, [settings.theme, settings.customAccentColor, settings.customCursor]);

  // Apply tab disguise whenever activeCloak or custom settings change
  useEffect(() => {
    applyTabCloak(
      settings.activeCloak,
      settings.customCloakTitle,
      settings.customCloakFavicon
    );
  }, [settings.activeCloak, settings.customCloakTitle, settings.customCloakFavicon]);

  // Ensure games library catalog is updated with the full dataset
  useEffect(() => {
    if (games.length < INITIAL_GAMES.length) {
      const fullLibrary = getStoredGames();
      setGames(fullLibrary);
    }
  }, [games.length]);

  // Global keydown listener for Panic hotkey and Search hotkey
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Panic Key Trigger
      if (e.key === settings.panicKey && !isInput) {
        e.preventDefault();
        triggerPanic(settings.panicUrl);
        return;
      }

      // Universal Search Shortcuts: "/" or "Ctrl+K" / "Cmd+K"
      if (!isInput && (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key === 'k'))) {
        e.preventDefault();
        sounds.playClick(settings.soundEffectsEnabled);
        setIsSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.panicKey, settings.panicUrl, settings.soundEffectsEnabled]);

  // Anti-close safety confirmation listener
  useEffect(() => {
    if (!settings.confirmBeforeLeave) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [settings.confirmBeforeLeave]);

  // Handle Search or URL navigation from Omnibar
  const handleHomeSearchOrNavigate = (queryOrUrl) => {
    sounds.playLaunch(settings.soundEffectsEnabled);
    if (queryOrUrl && /^https?:\/\//i.test(queryOrUrl)) {
      window.open(queryOrUrl, '_blank');
    } else {
      setIsSearchModalOpen(true);
    }
  };

  // Launch game handler
  const handlePlayGame = (game) => {
    sounds.playLaunch(settings.soundEffectsEnabled);
    addStoredRecentlyOpened(game);
    setActiveGameToPlay(game);
    setIsGameMinimized(false);
  };

  // Game management actions
  const handleAddGame = (newGame) => {
    const updated = [{ ...newGame, isCustom: true }, ...games];
    setGames(updated);
    saveStoredGames(updated);
    showToast(`Added "${newGame.title}" to library`);
  };

  const handleDeleteGame = (gameId) => {
    const target = games.find((g) => g.id === gameId);
    const updated = games.filter((g) => g.id !== gameId);
    setGames(updated);
    saveStoredGames(updated);
    showToast(`Removed "${target?.title || 'game'}"`);
  };

  const handleToggleFavorite = (gameId) => {
    sounds.playPop(settings.soundEffectsEnabled);
    const updated = games.map((g) =>
      g.id === gameId ? { ...g, isFavorite: !g.isFavorite } : g
    );
    setGames(updated);
    saveStoredGames(updated);
    const favIds = updated.filter((g) => g.isFavorite).map((g) => g.id);
    saveFavoriteIds(favIds);
  };

  const handleRecordPlay = (gameId) => {
    const updated = games.map((g) =>
      g.id === gameId ? { ...g, plays: (g.plays || 0) + 1 } : g
    );
    setGames(updated);
    saveStoredGames(updated);
  };

  const handleImportGames = (imported) => {
    const combined = [...imported, ...games];
    const unique = Array.from(new Map(combined.map((g) => [g.id, g])).values());
    setGames(unique);
    saveStoredGames(unique);
    showToast(`Imported ${imported.length} games`);
  };

  const handleClearGames = () => {
    setGames([]);
    saveStoredGames([]);
    showToast('Library cleared');
  };

  const handleResetLibraryDefaults = () => {
    setGames(INITIAL_GAMES);
    saveStoredGames(INITIAL_GAMES);
    showToast(`Reset library to ${INITIAL_GAMES.length} games`);
  };

  // Settings update
  const handleUpdateSettings = (newSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
    showToast('Settings saved');
  };

  // Notifications management
  const handleMarkAllNotifsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    saveStoredNotifications([]);
  };

  const handleNotificationAction = (action) => {
    if (action === 'changelog') {
      openWindow('settings', 'changelog');
    }
  };

  // Compute wallpaper style
  const activeWallpaper = useMemo(() => {
    if (settings.wallpaper === 'custom' && settings.customWallpaperUrl) {
      return {
        id: 'custom',
        css: `url("${settings.customWallpaperUrl}")`,
        size: 'cover',
        repeat: 'no-repeat',
        position: 'center center',
      };
    }
    const found = WALLPAPERS.find((w) => w.id === (settings.wallpaper || 'none')) || WALLPAPERS[0];
    if (!found || found.id === 'none') {
      return { id: 'none', css: 'none' };
    }
    if (found.imageUrl) {
      return {
        ...found,
        css: `url("${found.imageUrl}")`,
        size: found.size || 'cover',
        repeat: 'no-repeat',
        position: 'center center',
      };
    }
    return {
      ...found,
      css: found.css || 'none',
      size: found.size || 'auto',
      repeat: 'repeat',
      position: 'center center',
    };
  }, [settings.wallpaper, settings.customWallpaperUrl]);

  const favoriteGames = games.filter((g) => g.isFavorite);
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-black text-white font-sans selection:bg-[#0078d4]/30 selection:text-white relative">
      {/* Background Wallpaper Layer */}
      {activeWallpaper.id !== 'none' && (
        <>
          <div
            id="grrmondays-wallpaper-bg"
            className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
            style={{
              backgroundImage: activeWallpaper.css,
              backgroundSize: activeWallpaper.size || 'cover',
              backgroundPosition: activeWallpaper.position || 'center center',
              backgroundRepeat: activeWallpaper.repeat || 'no-repeat',
              backgroundAttachment: 'fixed',
            }}
          />
          <div
            id="grrmondays-wallpaper-overlay"
            className="fixed inset-0 pointer-events-none z-0 bg-black/40 backdrop-blur-[0.5px]"
          />
        </>
      )}

      {/* WINDOWS 11 DESKTOP CANVAS */}
      <WindowsDesktop
        games={games}
        favoriteGames={favoriteGames}
        shortcuts={DEFAULT_SHORTCUTS}
        onOpenWindow={openWindow}
        onPlayGame={handlePlayGame}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenAddGame={() => setIsAddGameModalOpen(true)}
        onOpenSettingsTab={(tab) => openWindow('settings', tab)}
        settings={settings}
        activeWindowId={activeWindowId}
        isAnyWindowOpen={Object.values(windows).some((w) => w.isOpen && !w.isMinimized)}
      />

      {/* WINDOW 1: Games Library */}
      <WindowsWindow
        id="games"
        title="Games"
        subtitle={`${games.length} Games`}
        icon={Gamepad2}
        isOpen={windows.games.isOpen}
        isMinimized={windows.games.isMinimized}
        isMaximized={windows.games.isMaximized}
        onMinimize={() => minimizeWindow('games')}
        onMaximize={() => maximizeWindow('games')}
        onClose={() => closeWindow('games')}
        zIndex={windowZIndices.games}
        onFocus={() => bringWindowToFront('games')}
        soundEffectsEnabled={settings.soundEffectsEnabled}
      >
        <LucideGamesView
          games={games}
          onPlayGame={handlePlayGame}
          onOpenAddGame={() => setIsAddGameModalOpen(true)}
          onToggleFavorite={handleToggleFavorite}
          onDeleteGame={handleDeleteGame}
        />
      </WindowsWindow>

      {/* WINDOW 2: Home Dashboard */}
      <WindowsWindow
        id="home"
        title="Home"
        subtitle=""
        icon={Home}
        isOpen={windows.home.isOpen}
        isMinimized={windows.home.isMinimized}
        isMaximized={windows.home.isMaximized}
        onMinimize={() => minimizeWindow('home')}
        onMaximize={() => maximizeWindow('home')}
        onClose={() => closeWindow('home')}
        zIndex={windowZIndices.home}
        onFocus={() => bringWindowToFront('home')}
        soundEffectsEnabled={settings.soundEffectsEnabled}
      >
        <LucideHomeView
          games={games}
          settings={settings}
          onSearchOrNavigate={handleHomeSearchOrNavigate}
          onPlayGame={handlePlayGame}
          onLaunchApp={(url) => {
            const shortcut = DEFAULT_SHORTCUTS.find((s) => s.url === url);
            if (shortcut) {
              addStoredRecentlyOpened({
                id: shortcut.id,
                title: shortcut.name,
                url: shortcut.url,
                category: 'Web App',
              });
            }
            if (url) window.open(url, '_blank');
          }}
          onOpenSearchModal={() => setIsSearchModalOpen(true)}
          onOpenNotifications={() => setIsNotifModalOpen(true)}
          unreadNotifsCount={unreadNotifsCount}
          onSelectView={openWindow}
        />
      </WindowsWindow>

      {/* WINDOW 3: Favorites */}
      <WindowsWindow
        id="favorites"
        title="Favorites"
        subtitle={`${favoriteGames.length} Starred`}
        icon={Heart}
        isOpen={windows.favorites.isOpen}
        isMinimized={windows.favorites.isMinimized}
        isMaximized={windows.favorites.isMaximized}
        onMinimize={() => minimizeWindow('favorites')}
        onMaximize={() => maximizeWindow('favorites')}
        onClose={() => closeWindow('favorites')}
        zIndex={windowZIndices.favorites}
        onFocus={() => bringWindowToFront('favorites')}
        soundEffectsEnabled={settings.soundEffectsEnabled}
      >
        <LucideGamesView
          games={favoriteGames}
          onPlayGame={handlePlayGame}
          onOpenAddGame={() => setIsAddGameModalOpen(true)}
          onToggleFavorite={handleToggleFavorite}
          onDeleteGame={handleDeleteGame}
          initialFilter="favorites"
        />
      </WindowsWindow>

      {/* WINDOW 4: Settings */}
      <WindowsWindow
        id="settings"
        title="Settings"
        subtitle=""
        icon={Settings}
        isOpen={windows.settings.isOpen}
        isMinimized={windows.settings.isMinimized}
        isMaximized={windows.settings.isMaximized}
        onMinimize={() => minimizeWindow('settings')}
        onMaximize={() => maximizeWindow('settings')}
        onClose={() => closeWindow('settings')}
        zIndex={windowZIndices.settings}
        onFocus={() => bringWindowToFront('settings')}
        soundEffectsEnabled={settings.soundEffectsEnabled}
      >
        <LucideSettingsView
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          games={games}
          onImportGames={handleImportGames}
          onClearGames={handleClearGames}
          onResetLibraryDefaults={handleResetLibraryDefaults}
          initialTab={settingsInitialTab}
        />
      </WindowsWindow>

      {/* WINDOW 5: Spotify (Windows 11 Music Player) */}
      <WindowsWindow
        id="player"
        title="Spotify"
        subtitle="Music for everyone"
        icon={SpotifyIcon}
        isOpen={windows.player.isOpen}
        isMinimized={windows.player.isMinimized}
        isMaximized={windows.player.isMaximized}
        onMinimize={() => minimizeWindow('player')}
        onMaximize={() => maximizeWindow('player')}
        onClose={() => closeWindow('player')}
        zIndex={windowZIndices.player}
        onFocus={() => bringWindowToFront('player')}
        soundEffectsEnabled={settings.soundEffectsEnabled}
      >
        <PlayerApp />
      </WindowsWindow>

      {/* WINDOW 6: Gemini AI Chatbot */}
      <WindowsWindow
        id="chatbot"
        title="Gemini AI"
        subtitle="Multi-turn Assistant"
        icon={Sparkles}
        isOpen={windows.chatbot.isOpen}
        isMinimized={windows.chatbot.isMinimized}
        isMaximized={windows.chatbot.isMaximized}
        onMinimize={() => minimizeWindow('chatbot')}
        onMaximize={() => maximizeWindow('chatbot')}
        onClose={() => closeWindow('chatbot')}
        zIndex={windowZIndices.chatbot}
        onFocus={() => bringWindowToFront('chatbot')}
        soundEffectsEnabled={settings.soundEffectsEnabled}
      >
        <GeminiChatbotView soundEffectsEnabled={settings.soundEffectsEnabled} />
      </WindowsWindow>

      {/* DESKTOP MINI PLAYER WIDGET (When Player is minimized or closed but audio is playing) */}
      <PlayerMiniWidget
        onOpenPlayer={() => openWindow('player')}
        isPlayerWindowOpen={windows.player?.isOpen && !windows.player?.isMinimized}
      />

          {/* WINDOWS 11 START MENU */}
          <WindowsStartMenu
            isOpen={isStartMenuOpen}
            onClose={() => setIsStartMenuOpen(false)}
            games={games}
            favoriteGames={favoriteGames}
            onOpenWindow={openWindow}
            onPlayGame={handlePlayGame}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onOpenAddGame={() => setIsAddGameModalOpen(true)}
            settings={settings}
            userProfile={userProfile}
          />

          {/* WINDOWS 11 TASKBAR (Bottom Dock) */}
          <WindowsTaskbar
            isStartMenuOpen={isStartMenuOpen}
            onToggleStartMenu={() => setIsStartMenuOpen(!isStartMenuOpen)}
            windows={windows}
            activeWindowId={activeWindowId}
            onToggleWindow={toggleWindow}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onOpenNotifications={() => setIsNotifModalOpen(true)}
            unreadNotifsCount={unreadNotifsCount}
            activeGameToPlay={activeGameToPlay}
            onFocusGamePlayer={() => setIsGameMinimized(false)}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onShowDesktop={handleShowDesktop}
          />

      {/* ACTIVE GAME PLAYER MODAL (with Windows 11 minimize to taskbar support) */}
      {activeGameToPlay && (
        <GamePlayerModal
          game={activeGameToPlay}
          onClose={() => setActiveGameToPlay(null)}
          onToggleFavorite={handleToggleFavorite}
          onRecordPlay={handleRecordPlay}
          isMinimized={isGameMinimized}
          onMinimize={() => setIsGameMinimized(true)}
        />
      )}

      {/* Universal Search Modal (Ctrl+K / Taskbar Search) */}
      <UniversalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        games={games}
        onSelectGame={handlePlayGame}
        onSelectApp={handleHomeSearchOrNavigate}
        onSelectWallpaper={(wpId) => {
          handleUpdateSettings({ ...settings, wallpaper: wpId });
          showToast('Wallpaper applied');
        }}
        onOpenSettingsTab={(tab) => openWindow('settings', tab)}
        soundEffectsEnabled={settings.soundEffectsEnabled}
      />

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotifsRead}
        onClearNotifications={handleClearNotifications}
        onOpenAction={handleNotificationAction}
        soundEffectsEnabled={settings.soundEffectsEnabled}
      />

      {/* Add Custom Game Modal */}
      <AddGameModal
        isOpen={isAddGameModalOpen}
        onClose={() => setIsAddGameModalOpen(false)}
        onAddGame={handleAddGame}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-14 right-5 z-50 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1e1e24] border border-white/15 text-xs font-semibold text-white shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-zinc-400 hover:text-white p-0.5 ml-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
