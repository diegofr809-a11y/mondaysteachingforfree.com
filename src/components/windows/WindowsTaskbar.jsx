import React, { useState, useEffect } from 'react';
import {
  Search,
  Gamepad2,
  Home,
  Heart,
  Settings,
  Bell,
  Volume2,
  VolumeX,
  Wifi,
  BatteryMedium,
  ChevronUp,
  Shield,
  Clock,
} from 'lucide-react';
import { sounds } from '../../utils/sound';
import { WindowsCalendarFlyout } from './WindowsCalendarFlyout';
import { SpotifyIcon } from '../player/SpotifyIcon';

const formatClockTime = (format = '12h') => {
  const now = new Date();
  return now.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: format !== '24h',
  });
};

const formatClockDate = () => {
  const now = new Date();
  return now.toLocaleDateString([], {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
};

export const WindowsTaskbar = ({
  isStartMenuOpen,
  onToggleStartMenu,
  windows = {},
  activeWindowId,
  onToggleWindow,
  onOpenSearch,
  onOpenNotifications,
  unreadNotifsCount = 0,
  activeGameToPlay,
  onFocusGamePlayer,
  settings = {},
  onUpdateSettings,
  onShowDesktop,
}) => {
  const [currentTime, setCurrentTime] = useState(() => formatClockTime(settings.clockFormat));
  const [currentDate, setCurrentDate] = useState(() => formatClockDate());
  const [showTrayFlyout, setShowTrayFlyout] = useState(false);
  const [showCalendarFlyout, setShowCalendarFlyout] = useState(false);

  // Live system clock and date formatted to Windows standard
  useEffect(() => {
    const updateDateTime = () => {
      setCurrentTime(formatClockTime(settings.clockFormat));
      setCurrentDate(formatClockDate());
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, [settings.clockFormat]);

  // Centered pinned taskbar applications
  const taskbarApps = [
    {
      id: 'home',
      name: 'Home',
      icon: Home,
    },
    {
      id: 'player',
      name: 'Spotify',
      icon: SpotifyIcon,
    },
    {
      id: 'games',
      name: 'Games',
      icon: Gamepad2,
    },
    {
      id: 'favorites',
      name: 'Favorites',
      icon: Heart,
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Settings,
    },
  ];

  const toggleSound = (e) => {
    e.stopPropagation();
    const nextState = !settings.soundEffectsEnabled;
    onUpdateSettings({ ...settings, soundEffectsEnabled: nextState });
    if (nextState) sounds.playClick(true);
  };

  return (
    <footer
      id="windows-taskbar"
      className="fixed bottom-0 left-0 right-0 h-12 bg-[#12141a]/90 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-4px_24px_rgba(0,0,0,0.5)] z-50 flex items-center justify-between px-2.5 select-none"
    >
      {/* LEFT: Start Button & Search Box */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Windows 11 Start Button */}
        <button
          id="win-start-btn"
          onClick={() => {
            sounds.playClick(settings.soundEffectsEnabled);
            onToggleStartMenu();
          }}
          title="Start"
          aria-label="Start"
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 group cursor-pointer ${
            isStartMenuOpen
              ? 'bg-white/15 scale-95 shadow-inner'
              : 'hover:bg-white/[0.08] active:scale-95'
          }`}
        >
          <svg
            className="w-5 h-5 transition-transform duration-150 group-hover:scale-105"
            viewBox="0 0 24 24"
            fill="none"
          >
            {/* Authentic Windows 11 4-tile Fluent Logo */}
            <rect x="2" y="2" width="9.2" height="9.2" rx="1.2" fill="#0078D4" />
            <rect x="12.8" y="2" width="9.2" height="9.2" rx="1.2" fill="#2B88D8" />
            <rect x="2" y="12.8" width="9.2" height="9.2" rx="1.2" fill="#005A9E" />
            <rect x="12.8" y="12.8" width="9.2" height="9.2" rx="1.2" fill="#0078D4" />
          </svg>
        </button>

        {/* Windows 11 Search Box */}
        <button
          onClick={() => {
            sounds.playClick(settings.soundEffectsEnabled);
            onOpenSearch();
          }}
          title="Search"
          aria-label="Search"
          className="h-8 px-3 rounded-md bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] flex items-center gap-2 text-xs text-zinc-300 transition-all cursor-pointer group"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-sky-300 transition-colors" />
          <span className="hidden sm:inline text-zinc-400 group-hover:text-zinc-200 font-normal">
            Search
          </span>
        </button>
      </div>

      {/* CENTER: Centered Pinned App Icons */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
        {taskbarApps.map((app) => {
          const winState = windows[app.id];
          const isOpen = winState?.isOpen;
          const isFocused = isOpen && !winState?.isMinimized && activeWindowId === app.id;
          const isMinimized = winState?.isMinimized;
          const IconComp = app.icon;

          return (
            <button
              key={app.id}
              onClick={() => {
                sounds.playClick(settings.soundEffectsEnabled);
                onToggleWindow(app.id);
              }}
              title={app.name}
              aria-label={app.name}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 group cursor-pointer ${
                isFocused
                  ? 'bg-white/[0.14] border border-white/10'
                  : isOpen
                  ? 'bg-white/[0.06] hover:bg-white/[0.1]'
                  : 'hover:bg-white/[0.08]'
              }`}
            >
              <div className="text-zinc-300 group-hover:text-white transition-transform duration-150 group-hover:scale-105 group-active:scale-95">
                <IconComp className="w-5 h-5 stroke-[1.8]" />
              </div>

              {/* Windows 11 Running Indicator Pill */}
              {isOpen && (
                <div
                  className={`absolute bottom-0.5 rounded-full transition-all duration-200 ${
                    isFocused
                      ? 'w-4 h-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                      : isMinimized
                      ? 'w-1.5 h-1.5 bg-zinc-400'
                      : 'w-2.5 h-1 bg-white/70'
                  }`}
                />
              )}
            </button>
          );
        })}

        {/* If a game is active/playing */}
        {activeGameToPlay && (
          <button
            onClick={() => {
              sounds.playClick(settings.soundEffectsEnabled);
              onFocusGamePlayer();
            }}
            title={`Playing: ${activeGameToPlay.title}`}
            className="relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 bg-white/[0.12] border border-white/15 hover:bg-white/[0.18] group cursor-pointer"
          >
            {activeGameToPlay.thumbnail ? (
              <img
                src={activeGameToPlay.thumbnail}
                alt={activeGameToPlay.title}
                className="w-5 h-5 rounded object-cover shadow"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Gamepad2 className="w-5 h-5 text-white" />
            )}

            {/* Active game running dot & pill */}
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <div className="absolute bottom-0.5 w-4 h-1 rounded-full bg-emerald-400" />
          </button>
        )}
      </div>

      {/* RIGHT: System Tray */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Tray Overflow Arrow */}
        <div className="relative">
          <button
            onClick={() => setShowTrayFlyout(!showTrayFlyout)}
            title="System tray icons"
            className="w-7 h-8 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          {/* Quick Tray Flyout */}
          {showTrayFlyout && (
            <div className="absolute right-0 bottom-10 w-44 rounded-xl bg-[#202026] border border-white/15 shadow-2xl p-2 z-50 text-xs text-white animate-scale-up">
              <div className="font-semibold text-zinc-400 text-[10px] uppercase tracking-wider mb-1 px-2">
                System Status
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 text-zinc-300">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Panic: <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[10px]">{settings.panicKey || ']'}</kbd></span>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 text-zinc-300">
                <Wifi className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Wi-Fi Connected</span>
              </div>
            </div>
          )}
        </div>

        {/* Windows Quick Settings Cluster: WiFi + Volume + Battery */}
        <div
          onClick={toggleSound}
          title={settings.soundEffectsEnabled ? 'Sound: On' : 'Sound: Muted'}
          className="flex items-center gap-1.5 px-2 py-1 h-8 rounded-md hover:bg-white/[0.08] transition-colors text-zinc-300 hover:text-white cursor-pointer"
        >
          {/* WiFi icon */}
          <Wifi className="w-3.5 h-3.5" />

          {/* Volume icon */}
          {settings.soundEffectsEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-zinc-200" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
          )}

          {/* Battery icon */}
          <BatteryMedium className="w-4 h-4 text-zinc-300" />
        </div>

        {/* Notifications Bell Icon */}
        <button
          onClick={() => {
            sounds.playClick(settings.soundEffectsEnabled);
            onOpenNotifications();
          }}
          title="Notification Center"
          aria-label="Notification Center"
          className="relative w-8 h-8 rounded-md flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#12141a]" />
          )}
        </button>

        {/* Digital Clock with Current Time & Date Underneath (Windows 11 Clock) */}
        <div className="relative">
          <button
            id="win-taskbar-clock-btn"
            onClick={() => {
              sounds.playClick(settings.soundEffectsEnabled);
              setShowCalendarFlyout(!showCalendarFlyout);
            }}
            title="Date & Time (Click to open Calendar & Clock)"
            aria-label="Date & Time"
            className={`px-2 py-1 h-9 rounded-md transition-colors text-right flex flex-col justify-center leading-tight cursor-pointer ${
              showCalendarFlyout
                ? 'bg-white/[0.14] text-white'
                : 'hover:bg-white/[0.08] text-white/95'
            }`}
          >
            <span className="text-[12px] sm:text-xs font-medium text-white tracking-tight">
              {currentTime}
            </span>
            <span className="text-[10px] text-zinc-300 font-normal">
              {currentDate}
            </span>
          </button>

          {/* Windows 11 Calendar & Time Flyout */}
          <WindowsCalendarFlyout
            isOpen={showCalendarFlyout}
            onClose={() => setShowCalendarFlyout(false)}
            clockFormat={settings.clockFormat}
          />
        </div>

        {/* Windows 11 Far Right "Show Desktop" line & trigger */}
        <div className="flex items-center pl-0.5 h-8">
          <div className="w-[1px] h-4 bg-white/10" />
          <button
            onClick={() => {
              sounds.playClick(settings.soundEffectsEnabled);
              onShowDesktop();
            }}
            title="Show Desktop"
            aria-label="Show Desktop"
            className="w-2 sm:w-2.5 h-full hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer ml-1 rounded-sm"
          />
        </div>
      </div>
    </footer>
  );
};
