import React, { useState } from 'react';
import {
  Gamepad2,
  Heart,
  Settings,
  Search,
  Plus,
  Dices,
} from 'lucide-react';
import { sounds } from '../../utils/sound';
import { SpotifyIcon } from '../player/SpotifyIcon';

export const WindowsDesktop = ({
  games = [],
  favoriteGames = [],
  shortcuts = [],
  onOpenWindow,
  onPlayGame,
  onOpenSearch,
  onOpenAddGame,
  onOpenSettingsTab,
  settings = {},
  activeWindowId,
  isAnyWindowOpen,
  wallpaperStyle = {},
}) => {
  const [selectedIconId, setSelectedIconId] = useState(null);

  // Core system desktop shortcuts with NO COLOR ICONS (pure monochrome Windows 11 Fluent style)
  const systemShortcuts = [
    {
      id: 'win-player',
      title: 'Spotify',
      type: 'window',
      windowId: 'player',
      icon: SpotifyIcon,
    },
    {
      id: 'win-games',
      title: 'Games',
      type: 'window',
      windowId: 'games',
      icon: Gamepad2,
    },
    {
      id: 'win-favorites',
      title: 'Favorites',
      type: 'window',
      windowId: 'favorites',
      icon: Heart,
    },
    {
      id: 'win-search',
      title: 'Search',
      type: 'action',
      action: 'search',
      icon: Search,
    },
    {
      id: 'win-settings',
      title: 'Settings',
      type: 'window',
      windowId: 'settings',
      icon: Settings,
    },
    {
      id: 'win-add-game',
      title: 'Add Game',
      type: 'action',
      action: 'add-game',
      icon: Plus,
    },
    {
      id: 'win-random',
      title: 'Random',
      type: 'action',
      action: 'random',
      icon: Dices,
    },
  ];

  const handleIconClick = (e, item) => {
    e.stopPropagation();
    sounds.playClick(settings.soundEffectsEnabled);
    setSelectedIconId(item.id);
  };

  const handleIconDoubleClick = (e, item) => {
    e.stopPropagation();
    sounds.playLaunch(settings.soundEffectsEnabled);
    launchItem(item);
  };

  const launchItem = (item) => {
    if (item.type === 'window') {
      onOpenWindow(item.windowId);
    } else if (item.type === 'action') {
      if (item.action === 'search') onOpenSearch();
      if (item.action === 'add-game') onOpenAddGame();
      if (item.action === 'random') {
        if (games.length > 0) {
          const rand = games[Math.floor(Math.random() * games.length)];
          onPlayGame(rand);
        }
      }
    }
  };

  return (
    <div
      id="windows-desktop-canvas"
      onClick={() => setSelectedIconId(null)}
      style={wallpaperStyle}
      className="absolute inset-0 bottom-12 overflow-hidden select-none bg-[#0a0a0e]"
    >
      {/* Subtle Windows 11 Dark Ambient Light */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(255,255,255,0.03)_0%,transparent_80%)]" />

      {/* Clean Single Column of Desktop Shortcuts on Left Side */}
      <div className="relative z-10 h-full p-3 sm:p-4 flex flex-col items-start gap-1.5 max-w-full overflow-y-auto">
        {systemShortcuts.map((item) => {
          const IconComponent = item.icon;
          const isSelected = selectedIconId === item.id;
          return (
            <div
              key={item.id}
              onClick={(e) => handleIconClick(e, item)}
              onDoubleClick={(e) => handleIconDoubleClick(e, item)}
              onTouchEnd={(e) => {
                if (selectedIconId === item.id) {
                  handleIconDoubleClick(e, item);
                } else {
                  handleIconClick(e, item);
                }
              }}
              className={`w-[74px] p-2 flex flex-col items-center gap-1.5 rounded-[6px] transition-all duration-100 cursor-pointer group select-none ${
                isSelected
                  ? 'bg-white/[0.14] border border-white/25 shadow-sm'
                  : 'hover:bg-white/[0.08] hover:border hover:border-white/10 border border-transparent'
              }`}
            >
              {/* Windows 11 Monochrome Desktop Tile */}
              <div className="relative w-10 h-10 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center transition-transform duration-100 group-active:scale-95 shadow-sm">
                <IconComponent className="w-5 h-5 text-zinc-100 stroke-[1.8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />

                {/* Windows 11 Shortcut Arrow Overlay */}
                <div className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 bg-white/90 rounded-[2px] shadow flex items-center justify-center pointer-events-none">
                  <svg className="w-1.5 h-1.5 text-black" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M2 2h4v1H3.7l3.65 3.65-.7.7L3 3.7V6H2V2z" />
                  </svg>
                </div>
              </div>

              {/* Shortcut Label (Segoe UI style, no wrap clutter, subtle shadow) */}
              <span className="text-[11px] font-normal text-white text-center leading-tight line-clamp-2 px-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                {item.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
