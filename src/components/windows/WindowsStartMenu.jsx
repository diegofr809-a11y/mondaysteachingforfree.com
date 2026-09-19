import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  Gamepad2,
  Home,
  Heart,
  Settings,
  Plus,
  MessageSquare,
  Shield,
  Dices,
  Power,
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles,
  Disc3,
} from 'lucide-react';
import { sounds } from '../../utils/sound';
import { triggerPanic } from '../../utils/cloak';

export const WindowsStartMenu = ({
  isOpen,
  onClose,
  games = [],
  favoriteGames = [],
  onOpenWindow,
  onPlayGame,
  onOpenSearch,
  onOpenAddGame,
  settings = {},
  userProfile = {},
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPowerMenu, setShowPowerMenu] = useState(false);
  const startMenuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (startMenuRef.current && !startMenuRef.current.contains(e.target)) {
        // If clicked outside the start menu and not on the taskbar start button
        const startBtn = document.getElementById('win-start-btn');
        if (startBtn && startBtn.contains(e.target)) return;
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset search when opening
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setShowPowerMenu(false);
    }
  }, [isOpen]);

  // Search filtered results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return games
      .filter((g) => g.title.toLowerCase().includes(q) || (g.category && g.category.toLowerCase().includes(q)))
      .slice(0, 8);
  }, [games, searchQuery]);

  // Pinned items (clean Windows 11 Fluent aesthetic)
  const pinnedItems = [
    {
      id: 'player',
      name: 'Spotify',
      desc: 'Music for everyone',
      icon: Disc3,
      action: () => onOpenWindow('player'),
    },
    {
      id: 'games',
      name: 'Games Library',
      desc: '1,930+ Games',
      icon: Gamepad2,
      action: () => onOpenWindow('games'),
    },
    {
      id: 'favorites',
      name: 'Favorites',
      desc: `${favoriteGames.length} Saved Games`,
      icon: Heart,
      action: () => onOpenWindow('favorites'),
    },
    {
      id: 'search',
      name: 'Search Games',
      desc: 'Press Ctrl+K',
      icon: Search,
      action: () => {
        onClose();
        onOpenSearch();
      },
    },
    {
      id: 'settings',
      name: 'Settings',
      desc: 'Preferences & UI',
      icon: Settings,
      action: () => onOpenWindow('settings'),
    },
    {
      id: 'add-game',
      name: 'Add Game',
      desc: 'Add Custom Link',
      icon: Plus,
      action: () => {
        onClose();
        onOpenAddGame();
      },
    },
    {
      id: 'random',
      name: 'Random Game',
      desc: 'Play Surprise Title',
      icon: Dices,
      action: () => {
        if (games.length > 0) {
          const rand = games[Math.floor(Math.random() * games.length)];
          onPlayGame(rand);
          onClose();
        }
      },
    },
  ];

  // Recommended list (popular/recent games)
  const recommendedGames = useMemo(() => {
    const popularTitles = ['1v1.lol', 'slope', 'retro bowl', 'bitlife', 'cookie clicker'];
    return popularTitles
      .map((t) => games.find((g) => g.title.toLowerCase().includes(t)))
      .filter(Boolean);
  }, [games]);

  if (!isOpen) return null;

  return (
    <div
      ref={startMenuRef}
      id="windows-start-menu"
      className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[94vw] sm:w-[540px] max-h-[620px] rounded-2xl bg-[#1e1e24]/95 backdrop-blur-2xl border border-white/15 shadow-2xl z-50 flex flex-col overflow-hidden text-white select-none animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Search Input Bar */}
      <div className="p-5 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games, apps, settings..."
            autoFocus
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-sky-400/60 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* Start Menu Body */}
      <div className="flex-1 overflow-y-auto px-5 py-2 space-y-5">
        {/* If user is actively searching */}
        {searchQuery.trim() ? (
          <div>
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5 px-1">
              Search Results ({searchResults.length})
            </div>
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-zinc-400 text-sm">
                No games found matching "{searchQuery}"
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-1">
                {searchResults.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => {
                      sounds.playLaunch(settings.soundEffectsEnabled);
                      onPlayGame(game);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-black/40 border border-white/10 shrink-0 flex items-center justify-center">
                      {game.thumbnail ? (
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Gamepad2 className="w-4 h-4 text-sky-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white group-hover:text-sky-300 truncate">
                        {game.title}
                      </div>
                      <div className="text-xs text-zinc-400 truncate">
                        {game.category || 'Game'}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* PINNED SECTION */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Pinned
                </span>
                <button
                  onClick={() => {
                    onOpenWindow('games');
                    onClose();
                  }}
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium cursor-pointer"
                >
                  All ({games.length})
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Grid of Pinned Apps */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {pinnedItems.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        sounds.playClick(settings.soundEffectsEnabled);
                        item.action();
                      }}
                      className="p-2 rounded-xl hover:bg-white/[0.08] transition-all flex flex-col items-center text-center gap-1.5 group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 shadow-sm flex items-center justify-center transition-all duration-150 group-hover:scale-105 group-active:scale-95">
                        <IconComp className="w-5 h-5 text-zinc-100 stroke-[1.8]" />
                      </div>
                      <span className="text-[11px] font-medium text-zinc-300 group-hover:text-white line-clamp-1">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RECOMMENDED SECTION */}
            <div className="pt-2.5 border-t border-white/10">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Popular
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {recommendedGames.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => {
                      sounds.playLaunch(settings.soundEffectsEnabled);
                      onPlayGame(game);
                      onClose();
                    }}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/[0.07] transition-colors text-left group cursor-pointer border border-transparent hover:border-white/5"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#1a1b22] border border-white/10 shrink-0 flex items-center justify-center">
                      {game.thumbnail ? (
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-full h-full object-cover filter brightness-[0.92] contrast-[0.98] group-hover:brightness-100 transition-all"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Gamepad2 className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-zinc-200 group-hover:text-white truncate">
                        {game.title}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Profile & Power Footer */}
      <div className="p-3 px-5 bg-black/30 border-t border-white/10 flex items-center justify-between relative">
        {/* User profile */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow">
            {userProfile?.gamerTag ? userProfile.gamerTag.charAt(0).toUpperCase() : 'G'}
          </div>
          <div>
            <div className="text-xs font-semibold text-white">
              {userProfile?.gamerTag || 'Gamer'}
            </div>
            <div className="text-[10px] text-zinc-400">
              Panic: <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono">{settings.panicKey || ']'}</kbd>
            </div>
          </div>
        </div>

        {/* Power Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowPowerMenu(!showPowerMenu)}
            title="Options"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Power className="w-4 h-4 text-rose-400" />
          </button>

          {/* Power flyout menu */}
          {showPowerMenu && (
            <div className="absolute right-0 bottom-10 w-48 rounded-xl bg-[#25252b] border border-white/15 shadow-2xl p-1 z-50 text-xs text-white">
              <button
                onClick={() => {
                  triggerPanic(settings.panicUrl || 'https://classroom.google.com');
                  onClose();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-500/20 hover:text-rose-300 transition-colors text-left text-rose-400 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                Panic Cloak
              </button>
              <button
                onClick={() => {
                  onOpenWindow('settings');
                  onClose();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left text-zinc-300 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
