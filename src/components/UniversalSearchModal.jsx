import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  Gamepad2,
  Image as ImageIcon,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { WALLPAPERS } from '../utils/theme';
import { sounds } from '../utils/sound';

export const UniversalSearchModal = ({
  isOpen,
  onClose,
  games = [],
  onSelectGame,
  onSelectWallpaper,
  onOpenSettingsTab,
  soundEffectsEnabled = true,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'games' | 'wallpapers' | 'settings'
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const settingsItems = useMemo(
    () => [
      { id: 'set-appearance', title: 'Themes', category: 'Settings', tab: 'appearance' },
      { id: 'set-wallpapers', title: 'Wallpapers', category: 'Settings', tab: 'wallpapers' },
      { id: 'set-stealth', title: 'Stealth Cloak', category: 'Settings', tab: 'stealth' },
      { id: 'set-gameplay', title: 'Controls', category: 'Settings', tab: 'gameplay' },
      { id: 'set-account', title: 'Profile', category: 'Settings', tab: 'account' },
      { id: 'set-data', title: 'Storage & Backup', category: 'Settings', tab: 'data' },
      { id: 'set-haters', title: 'Haters (Luna & Juana)', category: 'Settings', tab: 'haters' },
      { id: 'set-credits', title: 'Credits', category: 'Settings', tab: 'credits' },
    ],
    []
  );

  // Filtered and aggregated search results (Games, Wallpapers, Settings)
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      const topGames = games.slice(0, 10).map((g) => ({ ...g, itemType: 'game' }));
      const topSettings = settingsItems.slice(0, 4).map((s) => ({ ...s, itemType: 'settings' }));
      return [...topGames, ...topSettings];
    }

    const matched = [];

    // 1. Games match
    if (filterType === 'all' || filterType === 'games') {
      const gMatches = games
        .filter(
          (g) =>
            g.title?.toLowerCase().includes(q) ||
            g.category?.toLowerCase().includes(q)
        )
        .slice(0, 30)
        .map((g) => ({ ...g, itemType: 'game' }));
      matched.push(...gMatches);
    }

    // 2. Wallpapers match
    if (filterType === 'all' || filterType === 'wallpapers') {
      const wMatches = WALLPAPERS.filter(
        (w) =>
          w.name?.toLowerCase().includes(q) ||
          w.category?.toLowerCase().includes(q)
      ).map((w) => ({ ...w, itemType: 'wallpaper' }));
      matched.push(...wMatches);
    }

    // 3. Settings match
    if (filterType === 'all' || filterType === 'settings') {
      const sMatches = settingsItems
        .filter(
          (s) =>
            s.title?.toLowerCase().includes(q) ||
            s.category?.toLowerCase().includes(q)
        )
        .map((s) => ({ ...s, itemType: 'settings' }));
      matched.push(...sMatches);
    }

    return matched;
  }, [query, filterType, games, settingsItems]);

  const handleSelect = (item) => {
    sounds.playLaunch(soundEffectsEnabled);
    if (item.itemType === 'game') {
      onSelectGame(item);
    } else if (item.itemType === 'wallpaper') {
      onSelectWallpaper(item.id);
    } else if (item.itemType === 'settings') {
      onOpenSettingsTab(item.tab);
    }
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col text-[var(--text-main)] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[var(--border-color)] gap-3 bg-[var(--bg-surface)]">
          <Search className="w-5 h-5 text-[var(--accent-color)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search games..."
            className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-[var(--text-main)] placeholder-[var(--text-dim)]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md hover:bg-[var(--bg-hover)] text-[var(--text-dim)] hover:text-[var(--text-main)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono rounded bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-dim)]">
            ESC
          </kbd>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[var(--border-color)]/60 bg-[var(--bg-surface)]/50 overflow-x-auto scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'games', label: 'Games' },
            { id: 'wallpapers', label: 'Wallpapers' },
            { id: 'settings', label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilterType(tab.id);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[var(--accent-color)] text-white shadow-sm'
                  : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[55vh] overflow-y-auto p-2 divide-y divide-[var(--border-color)]/30">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text-dim)]">
              No results found
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id || item.title || idx}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-[var(--bg-hover)] border-l-4 border-l-[var(--accent-color)]'
                      : 'hover:bg-[var(--bg-hover)]/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center shrink-0 group-hover:border-[var(--accent-color)]/50">
                      {item.itemType === 'game' && (
                        <Gamepad2 className="w-4 h-4 text-purple-400" />
                      )}
                      {item.itemType === 'wallpaper' && (
                        <ImageIcon className="w-4 h-4 text-emerald-400" />
                      )}
                      {item.itemType === 'settings' && (
                        <Settings className="w-4 h-4 text-amber-400" />
                      )}
                    </div>

                    <div className="truncate">
                      <div className="text-xs sm:text-sm font-semibold text-[var(--text-main)] truncate flex items-center gap-2">
                        <span>{item.title || item.name}</span>
                        {item.category && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--badge-bg)] text-[var(--accent-color)] font-normal">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)] shrink-0 pl-3">
                    <ChevronRight className="w-4 h-4 text-[var(--text-dim)] group-hover:text-[var(--accent-color)]" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
