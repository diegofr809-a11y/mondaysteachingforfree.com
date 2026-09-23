import React, { useState, useEffect } from 'react';
import {
  Search,
  AlertCircle,
  Clock,
  Heart,
  Gamepad2,
  Globe,
  Sparkles,
  ArrowRight,
  Flame,
  Play,
  RotateCcw,
  Sliders,
  Bell,
  Layers,
} from 'lucide-react';
import { ClockWeatherWidget } from './ClockWeatherWidget';
import { DEFAULT_SHORTCUTS } from '../data/initialData';
import { getStoredRecentlyOpened, clearStoredRecentlyOpened } from '../utils/storage';
import { sounds } from '../utils/sound';
import { handleGameImageError, getPlaceholderGameThumbnail } from '../utils/imageFallback';

export const LucideHomeView = ({
  games = [],
  settings = {},
  onSearchOrNavigate,
  onPlayGame,
  onLaunchApp,
  onOpenSearchModal,
  onOpenNotifications,
  unreadNotifsCount = 0,
  onSelectView,
}) => {
  const [query, setQuery] = useState('');
  const [recents, setRecents] = useState([]);

  useEffect(() => {
    setRecents(getStoredRecentlyOpened());
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      onOpenSearchModal?.();
      return;
    }
    // If it looks like a query, search or navigate
    onSearchOrNavigate(query.trim());
  };

  const favoriteGames = games.filter((g) => g.isFavorite);

  // Trending fallback items when recents is empty
  const trendingGames = games
    .filter((g) => ['Slope', '1v1.LOL', 'Retro Bowl', 'Subway Surfers', 'BitLife', 'Cookie Clicker'].includes(g.title))
    .slice(0, 6);

  const displayRecents = recents.length > 0 ? recents.slice(0, 8) : trendingGames;
  const isFallback = recents.length === 0;

  const handleClearRecents = () => {
    sounds.playClick(settings.soundEffectsEnabled);
    clearStoredRecentlyOpened();
    setRecents([]);
  };

  return (
    <div className="relative flex-1 h-full flex flex-col items-center px-4 sm:px-8 py-6 select-none bg-transparent overflow-y-auto">
      {/* Aurora nebula ambient background */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 40% 15%, var(--accent-glow) 0%, rgba(56, 12, 115, 0.12) 40%, rgba(6, 5, 11, 0) 75%)',
        }}
      />

      <div className="relative z-10 w-full max-w-4xl flex flex-col space-y-8 pb-16">
        {/* Top Header Row with Clock Pill & Notification Bell */}
        <div className="flex items-center justify-between gap-4 pt-2">
          {/* Compact Clock & Weather Pill */}
          <ClockWeatherWidget
            clockFormat={settings.clockFormat || '12h'}
            showSeconds={false}
            showWeather={settings.showWeather !== false}
            tempUnit={settings.tempUnit || 'F'}
            weatherLocation={settings.weatherLocation || 'Local City'}
            compact={true}
          />

          {/* Top Actions: Search Trigger & Notifications Bell */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick(settings.soundEffectsEnabled);
                onOpenSearchModal?.();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs text-[var(--text-dim)] hover:text-[var(--text-main)] shadow-sm transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span className="hidden sm:inline">Universal Search</span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-dim)]">
                /
              </kbd>
            </button>

            <button
              onClick={() => {
                sounds.playClick(settings.soundEffectsEnabled);
                onOpenNotifications?.();
              }}
              className="relative p-2 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-[var(--text-main)] shadow-sm transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-[var(--accent-color)]" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--accent-color)] text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Hero Title & Omnibar Search */}
        <div className="flex flex-col items-center text-center space-y-4 pt-4 sm:pt-6">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-[var(--text-main)] select-none">
              grrmondays
            </h1>
            <div
              className="h-1 w-28 mt-2 rounded-full"
              style={{ backgroundColor: 'var(--accent-color)' }}
            />
          </div>

          {/* Omnibar Search Box */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-xl">
            <div
              onClick={() => onOpenSearchModal?.()}
              className="relative w-full group cursor-pointer"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--accent-color)] pointer-events-none" />
              <input
                type="text"
                readOnly
                placeholder="Search games..."
                className="w-full h-12 pl-11 pr-24 bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/70 rounded-2xl text-xs sm:text-sm text-[var(--text-main)] placeholder-[var(--text-dim)] outline-none transition-all shadow-xl shadow-black/30 cursor-pointer"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-[var(--accent-color)] text-white shadow-sm">
                  Search
                </span>
              </div>
            </div>
          </form>

          {/* Quick Category Chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs pt-1">
            <button
              onClick={() => onSelectView('chatbot')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/30 text-indigo-300 hover:text-white transition-all cursor-pointer font-medium shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Gemini AI Chat</span>
            </button>

            <button
              onClick={() => onSelectView('games')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-[var(--text-main)] transition-colors cursor-pointer"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
              <span>All Games ({games.length})</span>
            </button>

            <button
              onClick={() => onSelectView('favorites')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-[var(--text-main)] transition-colors cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Favorites ({favoriteGames.length})</span>
            </button>
          </div>
        </div>

        {/* SECTION 1: Recently Opened Games */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/[0.06] text-[var(--accent-color)] flex items-center justify-center">
                {isFallback ? (
                  <Flame className="w-3.5 h-3.5 text-zinc-400" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                )}
              </div>
              <h2 className="text-sm font-bold text-[var(--text-main)]">
                {isFallback ? 'Popular & Trending Games' : 'Recently Played'}
              </h2>
            </div>

            {!isFallback && recents.length > 0 && (
              <button
                onClick={handleClearRecents}
                className="text-[11px] text-[var(--text-dim)] hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {displayRecents.map((item) => (
              <div
                key={item.id || item.title}
                onClick={() => {
                  sounds.playLaunch(settings.soundEffectsEnabled);
                  onPlayGame(item);
                }}
                className="p-3 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] hover:border-white/20 transition-all cursor-pointer group flex flex-col justify-between space-y-3 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={(item.thumbnailUrl || item.thumbnail) || getPlaceholderGameThumbnail(item.title || item.name, item.category)}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover filter brightness-[0.92] contrast-[0.98] group-hover:brightness-100 transition-all"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleGameImageError(e, item.title || item.name, item.category)}
                    />
                  </div>
                  <div className="truncate flex-1">
                    <h3 className="text-xs font-semibold text-[var(--text-main)] truncate group-hover:text-white transition-colors">
                      {item.title || item.name}
                    </h3>
                    <span className="text-[10px] text-[var(--text-dim)] truncate block">
                      {item.category || 'Game'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-[var(--text-dim)] border-t border-[var(--border-color)]/50">
                  <span className="text-[10px] opacity-75">Play Now</span>
                  <div className="w-6 h-6 rounded-full bg-white/[0.08] text-zinc-300 flex items-center justify-center group-hover:bg-[var(--accent-color)] group-hover:text-white transition-colors">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Favorites Shelf (if user has favorited items) */}
        {favoriteGames.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </div>
                <h2 className="text-sm font-bold text-[var(--text-main)]">
                  Your Favorites ({favoriteGames.length})
                </h2>
              </div>
              <button
                onClick={() => onSelectView('favorites')}
                className="text-xs text-[var(--accent-color)] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {favoriteGames.slice(0, 4).map((g) => (
                <div
                  key={g.id}
                  onClick={() => {
                    sounds.playLaunch(settings.soundEffectsEnabled);
                    onPlayGame(g);
                  }}
                  className="p-3 rounded-2xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] hover:border-white/20 transition-all cursor-pointer group flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={(g.thumbnailUrl || g.thumbnail) || getPlaceholderGameThumbnail(g.title, g.category)}
                        alt={g.title}
                        className="w-full h-full object-cover filter brightness-[0.92] contrast-[0.98] group-hover:brightness-100 transition-all"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => handleGameImageError(e, g.title, g.category)}
                      />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-[var(--text-main)] truncate group-hover:text-white">
                        {g.title}
                      </div>
                      <span className="text-[10px] text-[var(--text-dim)]">{g.category}</span>
                    </div>
                  </div>
                  <Heart className="w-4 h-4 text-rose-500 fill-current shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
