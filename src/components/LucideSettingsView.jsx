import React, { useState, useEffect, useRef } from 'react';
import { THEMES, ACCENT_PRESETS, CURSOR_PRESETS, getCursorSvg, applyCursor } from '../utils/theme';
import { CLOAK_PRESETS } from '../data/initialData';
import { clearAllData, getStoredRecentlyOpened, getStoredUserProfile, getStoredNotifications } from '../utils/storage';
import { triggerPanic, openAboutBlankCloaked } from '../utils/cloak';
import { AccountSettingsTab } from './AccountSettingsTab';
import { CreditsSettingsTab } from './CreditsSettingsTab';
import { WallpapersSettingsTab } from './WallpapersSettingsTab';
import { ChangelogView } from './ChangelogView';
import { sounds } from '../utils/sound';
import {
  Palette,
  Shield,
  Database,
  Check,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  Globe,
  AlertTriangle,
  Gamepad2,
  Maximize2,
  ExternalLink,
  Zap,
  Layers,
  Image,
  User,
  Heart,
  Clock,
  Volume2,
  MousePointer,
  History,
  Sliders,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Layout,
} from 'lucide-react';

export const LucideSettingsView = ({
  settings = {},
  onUpdateSettings,
  games = [],
  onImportGames,
  onClearGames,
  onResetLibraryDefaults,
  initialTab = 'appearance',
}) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'appearance');
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [customAccentInput, setCustomAccentInput] = useState(settings.customAccentColor || '');

  // Tabs scroll & drag controls
  const tabsContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isTabsDragging, setIsTabsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);
  const [hasDraggedTabs, setHasDraggedTabs] = useState(false);

  const checkTabsScroll = () => {
    const el = tabsContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 6);
  };

  useEffect(() => {
    checkTabsScroll();
    const handleResize = () => checkTabsScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When activeTab changes, auto scroll it into view and update buttons
  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeEl = tabsContainerRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
      setTimeout(checkTabsScroll, 250);
    }
  }, [activeTab]);

  const handleScrollTabs = (direction) => {
    sounds.playClick(settings.soundEffectsEnabled);
    if (!tabsContainerRef.current) return;
    const amount = direction === 'left' ? -260 : 260;
    tabsContainerRef.current.scrollBy({
      left: amount,
      behavior: 'smooth',
    });
    setTimeout(checkTabsScroll, 200);
  };

  const handleTabsWheel = (e) => {
    if (!tabsContainerRef.current) return;
    if (e.deltaY !== 0) {
      e.preventDefault();
      tabsContainerRef.current.scrollLeft += e.deltaY;
      checkTabsScroll();
    }
  };

  const handleTabsMouseDown = (e) => {
    if (!tabsContainerRef.current) return;
    setIsTabsDragging(true);
    setHasDraggedTabs(false);
    setDragStartX(e.pageX - tabsContainerRef.current.offsetLeft);
    setDragScrollLeft(tabsContainerRef.current.scrollLeft);
  };

  const handleTabsMouseMove = (e) => {
    if (!isTabsDragging || !tabsContainerRef.current) return;
    const x = e.pageX - tabsContainerRef.current.offsetLeft;
    const walk = (x - dragStartX) * 1.3;
    if (Math.abs(walk) > 4) {
      setHasDraggedTabs(true);
    }
    tabsContainerRef.current.scrollLeft = dragScrollLeft - walk;
    checkTabsScroll();
  };

  const handleTabsMouseUp = () => {
    setIsTabsDragging(false);
    setTimeout(() => setHasDraggedTabs(false), 50);
  };

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    setCustomAccentInput(settings.customAccentColor || '');
  }, [settings.customAccentColor]);

  const notifySaved = () => {
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 1800);
  };

  const handleUpdate = (key, val) => {
    sounds.playClick(settings.soundEffectsEnabled);
    const updated = { ...settings, [key]: val };
    onUpdateSettings(updated);
    notifySaved();
  };

  const updateSetting = handleUpdate;

  const handleThemeSelect = (themeId) => {
    sounds.playLaunch(settings.soundEffectsEnabled);
    const updated = { ...settings, theme: themeId };
    onUpdateSettings(updated);
    notifySaved();
  };

  const handleAccentSelect = (accentHex) => {
    sounds.playClick(settings.soundEffectsEnabled);
    setCustomAccentInput(accentHex);
    handleUpdate('customAccentColor', accentHex);
  };

  const handleCursorSelect = (cursorId) => {
    sounds.playClick(settings.soundEffectsEnabled);
    applyCursor(cursorId, settings.customAccentColor || '#9333ea');
    handleUpdate('customCursor', cursorId);
  };

  const handleTestPanic = () => {
    sounds.playClick(settings.soundEffectsEnabled);
    triggerPanic(settings.panicUrl || 'https://classroom.google.com');
  };

  const handleOpenAboutBlank = () => {
    sounds.playClick(settings.soundEffectsEnabled);
    openAboutBlankCloaked(settings.activeCloak, {
      title: settings.customCloakTitle,
      favicon: settings.customCloakFavicon,
    });
  };

  // Full system export
  const handleExportFullBackup = () => {
    sounds.playClick(settings.soundEffectsEnabled);
    const backup = {
      version: '4.0',
      exportedAt: new Date().toISOString(),
      settings,
      profile: getStoredUserProfile(),
      gamesCount: games.length,
      games,
      recentlyOpened: getStoredRecentlyOpened(),
      notifications: getStoredNotifications(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grrmondays_full_backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result);
        if (Array.isArray(parsed)) {
          onImportGames(parsed);
          setImportStatus(`Imported ${parsed.length} games`);
        } else if (parsed.games && Array.isArray(parsed.games)) {
          onImportGames(parsed.games);
          if (parsed.settings) {
            onUpdateSettings({ ...settings, ...parsed.settings });
          }
          setImportStatus(`Imported full backup (${parsed.games.length} games & settings)`);
        } else if (parsed.settings) {
          onUpdateSettings({ ...settings, ...parsed.settings });
          setImportStatus('Settings restored successfully.');
        } else {
          setImportStatus('Invalid JSON file format.');
        }
        sounds.playLaunch(settings.soundEffectsEnabled);
      } catch (err) {
        setImportStatus('Error reading backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearCacheAndReset = () => {
    if (window.confirm('Reset all settings, cache, and clear local storage? This cannot be undone.')) {
      clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto px-4 sm:px-8 py-8 select-none bg-transparent text-[var(--text-main)]">
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)] flex items-center gap-2">
              <Sliders className="w-6 h-6 text-[var(--accent-color)]" />
              <span>Settings & Preferences</span>
            </h1>
            <p className="text-xs text-[var(--text-dim)] mt-0.5">
              Personalize colors, clock widgets, cursor, sound effects, stealth mode, and storage.
            </p>
          </div>

          {showSavedNotification && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold animate-fade-in shadow-md">
              <Check className="w-3.5 h-3.5" />
              <span>Saved</span>
            </div>
          )}
        </div>

        {/* Tab Navigation Buttons with Smooth Horizontal Scrolling Controls */}
        <div className="relative flex items-center group/tabbar">
          {/* Left Scroll Button */}
          <button
            type="button"
            onClick={() => handleScrollTabs('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll tabs left"
            title="Scroll left"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] transition-all cursor-pointer ${
              canScrollLeft ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable tabs container */}
          <div
            ref={tabsContainerRef}
            onWheel={handleTabsWheel}
            onScroll={checkTabsScroll}
            onMouseDown={handleTabsMouseDown}
            onMouseMove={handleTabsMouseMove}
            onMouseUp={handleTabsMouseUp}
            onMouseLeave={handleTabsMouseUp}
            className={`flex items-center gap-1.5 overflow-x-auto pb-2.5 pt-1 px-1 tabs-scrollbar border-b border-[var(--border-color)] w-full select-none ${
              isTabsDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {[
              { id: 'appearance', label: 'Theme', icon: Palette },
              { id: 'wallpapers', label: 'Wallpaper', icon: Image },
              { id: 'stealth', label: 'Stealth & Cloak', icon: Shield },
              { id: 'gameplay', label: 'Controls', icon: Gamepad2 },
              { id: 'data', label: 'Data & Storage', icon: Database },
              { id: 'changelog', label: 'Updates', icon: History },
              { id: 'credits', label: 'Credits', icon: Heart },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  data-tab-id={tab.id}
                  onClick={() => {
                    if (hasDraggedTabs) return;
                    sounds.playClick(settings.soundEffectsEnabled);
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--accent-color)] text-white shadow-md'
                      : 'text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Scroll Button */}
          <button
            type="button"
            onClick={() => handleScrollTabs('right')}
            disabled={!canScrollRight}
            aria-label="Scroll tabs right"
            title="Scroll right"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] transition-all cursor-pointer ${
              canScrollRight ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* TAB 1: APPEARANCE (Themes + Custom Accent Color Picker) */}
        {activeTab === 'appearance' && (
          <div className="space-y-6 animate-fade-in">
            {/* Custom Accent Color Picker Section */}
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--accent-color)]" />
                    <span>Accent Color</span>
                  </h3>
                </div>
                {settings.customAccentColor && (
                  <button
                    onClick={() => handleAccentSelect('')}
                    className="text-[11px] text-[var(--text-dim)] hover:text-[var(--accent-color)] transition-colors cursor-pointer"
                  >
                    Reset Default
                  </button>
                )}
              </div>

              {/* Preset Accent Swatches */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-1">
                {ACCENT_PRESETS.map((acc) => {
                  const isSelected =
                    settings.customAccentColor?.toLowerCase() === acc.hex.toLowerCase();
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleAccentSelect(acc.hex)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-white bg-[var(--bg-hover)] shadow-md ring-2 ring-[var(--accent-color)]'
                          : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-black/30 shrink-0 shadow-sm"
                        style={{ backgroundColor: acc.hex }}
                      />
                      <span className="text-xs font-semibold text-[var(--text-main)] truncate">
                        {acc.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Color Input */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                <input
                  type="color"
                  value={customAccentInput || '#9333ea'}
                  onChange={(e) => handleAccentSelect(e.target.value)}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                  title="Choose custom color"
                />
                <div className="flex-1">
                  <span className="text-[11px] text-[var(--text-dim)] block">Custom HEX Code:</span>
                  <input
                    type="text"
                    value={customAccentInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomAccentInput(val);
                      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                        handleAccentSelect(val);
                      }
                    }}
                    placeholder="#9333ea"
                    maxLength={7}
                    className="bg-transparent border-none text-xs font-mono font-bold text-[var(--text-main)] outline-none"
                  />
                </div>
                <div
                  className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: settings.customAccentColor || 'var(--accent-color)' }}
                >
                  Active Preview
                </div>
              </div>
            </div>

            {/* Theme Selector */}
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)]">
                    Preconfigured Color Themes
                  </h3>
                  <p className="text-xs text-[var(--text-dim)]">
                    Complete base themes with matched dark cards and backgrounds.
                  </p>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--accent-color)] border border-[var(--border-color)]">
                  {THEMES[settings.theme]?.name || settings.theme}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.keys(THEMES).map((themeKey) => {
                  const t = THEMES[themeKey];
                  const isSelected = settings.theme === themeKey;
                  return (
                    <button
                      key={themeKey}
                      onClick={() => handleThemeSelect(themeKey)}
                      className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--accent-color)] bg-[var(--bg-hover)] shadow-md ring-1 ring-[var(--accent-color)]'
                          : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[var(--text-main)]">
                          {t.name}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] text-[var(--text-dim)] mb-3 line-clamp-1">
                        {t.description}
                      </p>

                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-5 h-5 rounded-full border border-black/30"
                          style={{ backgroundColor: t.previewColors[0] }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-black/30"
                          style={{ backgroundColor: t.previewColors[1] }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-black/30"
                          style={{ backgroundColor: t.previewColors[2] }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB: WALLPAPERS */}
        {activeTab === 'wallpapers' && (
          <WallpapersSettingsTab
            currentWallpaper={settings.wallpaper || 'none'}
            customWallpaperUrl={settings.customWallpaperUrl || ''}
            onWallpaperChange={(wp) => handleUpdate('wallpaper', wp)}
            onCustomWallpaperChange={(url) => handleUpdate('customWallpaperUrl', url)}
            soundEffectsEnabled={settings.soundEffectsEnabled}
          />
        )}

        {/* TAB 3: CLOCK & DISPLAY LAYOUT (User request: add clock toggle to center grrmondays text) */}
        {activeTab === 'clock' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)]/15 text-[var(--accent-color)] flex items-center justify-center shrink-0 border border-[var(--accent-color)]/30">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-main)]">
                    Main View Clock & Screen Alignment
                  </h3>
                  <p className="text-xs text-[var(--text-dim)]">
                    Configure the digital clock and toggle text positioning on the #grrmondays screen.
                  </p>
                </div>
              </div>

              {/* The Core Setting: Clock Toggle & Screen Alignment */}
              <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-main)]">
                      Show Clock & Align #grrmondays to Top
                    </h4>
                    <p className="text-[11px] text-[var(--text-dim)] max-w-md mt-0.5">
                      When enabled, the clock & weather widget are displayed, and the #grrmondays title is moved to the top.
                      When turned off, the clock is hidden and #grrmondays is moved back to the center of the screen.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdate('showMainClock', settings.showMainClock === false ? true : false)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settings.showMainClock !== false
                        ? 'bg-[var(--accent-color)]'
                        : 'bg-zinc-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                        settings.showMainClock !== false ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Secondary Clock Formats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* 12h vs 24h format */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-2">
                  <label className="text-xs font-bold text-[var(--text-main)] block">
                    Time Format
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdate('clockFormat', '12h')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        settings.clockFormat !== '24h'
                          ? 'bg-[var(--accent-color)] text-white border-transparent'
                          : 'bg-[var(--bg-card)] text-[var(--text-dim)] border-[var(--border-color)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      12-Hour (AM/PM)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdate('clockFormat', '24h')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        settings.clockFormat === '24h'
                          ? 'bg-[var(--accent-color)] text-white border-transparent'
                          : 'bg-[var(--bg-card)] text-[var(--text-dim)] border-[var(--border-color)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      24-Hour Military
                    </button>
                  </div>
                </div>

                {/* Show Seconds */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[var(--text-main)] block">
                      Live Seconds
                    </span>
                    <span className="text-[10px] text-[var(--text-dim)]">
                      Show ticking seconds counter
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdate('showSeconds', !settings.showSeconds)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      settings.showSeconds !== false
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {settings.showSeconds !== false ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Weather Widget Toggle */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[var(--text-main)] block">
                      Weather Forecast Pill
                    </span>
                    <span className="text-[10px] text-[var(--text-dim)]">
                      Display temperature & conditions
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdate('showWeather', settings.showWeather === false ? true : false)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                      settings.showWeather !== false
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {settings.showWeather !== false ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Temperature Unit */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[var(--text-main)] block">
                      Temperature Unit
                    </span>
                    <span className="text-[10px] text-[var(--text-dim)]">
                      Choose °F or °C
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleUpdate('tempUnit', 'F')}
                      className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                        settings.tempUnit !== 'C'
                          ? 'bg-[var(--accent-color)] text-white'
                          : 'bg-[var(--bg-card)] text-[var(--text-dim)]'
                      }`}
                    >
                      °F
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdate('tempUnit', 'C')}
                      className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                        settings.tempUnit === 'C'
                          ? 'bg-[var(--accent-color)] text-white'
                          : 'bg-[var(--bg-card)] text-[var(--text-dim)]'
                      }`}
                    >
                      °C
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AUDIO & CURSORS */}
        {activeTab === 'audio' && (
          <div className="space-y-6 animate-fade-in">
            {/* Audio Toggle */}
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/15 text-pink-400 flex items-center justify-center border border-pink-500/30">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-main)]">
                      UI Sound Effects
                    </h3>
                    <p className="text-xs text-[var(--text-dim)]">
                      Synthesized Web Audio clicks, launch pops, and feedback tones.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpdate('soundEffectsEnabled', settings.soundEffectsEnabled === false ? true : false)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.soundEffectsEnabled !== false
                      ? 'bg-[var(--accent-color)]'
                      : 'bg-zinc-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      settings.soundEffectsEnabled !== false ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between text-xs">
                <span className="text-[var(--text-dim)]">Test audio feedback:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => sounds.playClick(true)}
                    className="px-2.5 py-1 rounded bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] font-semibold cursor-pointer"
                  >
                    Click
                  </button>
                  <button
                    onClick={() => sounds.playPop(true)}
                    className="px-2.5 py-1 rounded bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] font-semibold cursor-pointer"
                  >
                    Pop
                  </button>
                  <button
                    onClick={() => sounds.playLaunch(true)}
                    className="px-2.5 py-1 rounded bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] font-semibold cursor-pointer"
                  >
                    Launch
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Cursors */}
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <MousePointer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)]">
                    Custom Gaming Cursors
                  </h3>
                  <p className="text-xs text-[var(--text-dim)]">
                    Choose a gaming reticle or pixel pointer for the application.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {CURSOR_PRESETS.map((cur) => {
                  const isSelected = (settings.customCursor || 'default') === cur.id;
                  const cursorInfo = cur.id !== 'default' ? getCursorSvg(cur.id, settings.customAccentColor || '#9333ea') : null;
                  return (
                    <button
                      key={cur.id}
                      type="button"
                      onClick={() => handleCursorSelect(cur.id)}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--accent-color)] bg-[var(--bg-hover)] ring-1 ring-[var(--accent-color)] shadow-md'
                          : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center shrink-0 shadow-inner">
                          {cursorInfo?.svg ? (
                            <div
                              className="w-6 h-6 flex items-center justify-center pointer-events-none select-none"
                              dangerouslySetInnerHTML={{ __html: cursorInfo.svg }}
                            />
                          ) : (
                            <MousePointer className="w-4 h-4 text-[var(--text-dim)]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-[var(--text-main)] truncate">
                              {cur.name}
                            </span>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-[var(--text-dim)] block truncate">
                            {cur.id === 'default' ? 'System Standard' : 'Reticle Pointer'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[var(--text-dim)] line-clamp-2">
                        {cur.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB: STEALTH */}
        {activeTab === 'stealth' && (
          <div className="space-y-5 animate-fade-in">
            {/* Quick Actions */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
              <h4 className="text-xs font-bold text-[var(--text-main)]">
                Stealth & Panic Actions
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleOpenAboutBlank}
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] hover:border-[var(--accent-color)] transition-all cursor-pointer text-left"
                >
                  <ExternalLink className="w-5 h-5 text-[var(--accent-color)] shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[var(--text-main)]">
                      Open in Safe Window (about:blank)
                    </div>
                    <div className="text-[11px] text-[var(--text-dim)]">
                      Hides site from browser history
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleTestPanic}
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-red-500/30 hover:border-red-500 transition-all cursor-pointer text-left"
                >
                  <Shield className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-red-300">
                      Test Panic Button Now
                    </div>
                    <div className="text-[11px] text-[var(--text-dim)]">
                      Leaves immediately to {settings.panicUrl || 'Google Classroom'}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Cloaks */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
              <div>
                <h4 className="text-xs font-bold text-[var(--text-main)]">
                  Tab Disguise Presets
                </h4>
                <p className="text-[11px] text-[var(--text-dim)]">
                  Changes your tab&apos;s title and icon so it looks like schoolwork
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {CLOAK_PRESETS.map((preset) => {
                  const isSelected = settings.activeCloak === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleUpdate('activeCloak', preset.id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--accent-color)] bg-[var(--bg-hover)] ring-1 ring-[var(--accent-color)]'
                          : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      <img
                        src={preset.favicon}
                        alt=""
                        className="w-4 h-4 rounded-xs shrink-0"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <span className="text-xs font-semibold text-[var(--text-main)] truncate flex-1">
                        {preset.name}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
                      )}
                    </button>
                  );
                })}

                <button
                  onClick={() => handleUpdate('activeCloak', 'custom')}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    settings.activeCloak === 'custom'
                      ? 'border-[var(--accent-color)] bg-[var(--bg-hover)] ring-1 ring-[var(--accent-color)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <Globe className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-xs font-semibold text-[var(--text-main)] truncate flex-1">
                    Custom Disguise
                  </span>
                  {settings.activeCloak === 'custom' && (
                    <Check className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
                  )}
                </button>
              </div>

              {settings.activeCloak === 'custom' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[var(--border-color)]">
                  <div>
                    <label className="text-[10px] font-semibold text-[var(--text-dim)] mb-1 block">
                      Tab Title:
                    </label>
                    <input
                      type="text"
                      value={settings.customCloakTitle || ''}
                      onChange={(e) => handleUpdate('customCloakTitle', e.target.value)}
                      placeholder="e.g. Google Docs"
                      className="w-full h-8 px-2.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none focus:border-[var(--accent-color)]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-[var(--text-dim)] mb-1 block">
                      Favicon URL:
                    </label>
                    <input
                      type="text"
                      value={settings.customCloakFavicon || ''}
                      onChange={(e) => handleUpdate('customCloakFavicon', e.target.value)}
                      placeholder="https://.../favicon.ico"
                      className="w-full h-8 px-2.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none focus:border-[var(--accent-color)]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Panic Key */}
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-3">
              <div>
                <h4 className="text-xs font-bold text-[var(--text-main)]">
                  Panic Key Setup
                </h4>
                <p className="text-[11px] text-[var(--text-dim)]">
                  Pressing this key instantly redirects to a safe educational site
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-dim)] mb-1 block">
                    Panic Key:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={settings.panicKey}
                      onChange={(e) => handleUpdate('panicKey', e.target.value.slice(-1))}
                      maxLength={1}
                      className="w-16 h-8 text-center rounded bg-[var(--bg-surface)] border border-[var(--border-color)] font-mono text-sm font-bold text-[var(--text-main)] outline-none focus:border-[var(--accent-color)]"
                    />
                    <span className="text-[11px] text-[var(--text-dim)]">
                      Press this key anytime to escape
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-[var(--text-dim)] mb-1 block">
                    Safe Website:
                  </label>
                  <input
                    type="text"
                    value={settings.panicUrl}
                    onChange={(e) => handleUpdate('panicUrl', e.target.value)}
                    placeholder="https://classroom.google.com"
                    className="w-full h-8 px-2.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none focus:border-[var(--accent-color)]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CONTROLS & PERFORMANCE */}
        {activeTab === 'gameplay' && (
          <div className="space-y-5 animate-fade-in">
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-main)]">
                Game Window Controls
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleUpdate('autoFullscreen', !settings.autoFullscreen)}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    settings.autoFullscreen
                      ? 'border-[var(--accent-color)] bg-[var(--bg-hover)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <Maximize2 className="w-5 h-5 text-[var(--accent-color)] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)]">
                        Auto-Fullscreen
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${settings.autoFullscreen ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700/40 text-zinc-400'}`}>
                        {settings.autoFullscreen ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-dim)] mt-1">
                      Opens games in full screen automatically
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate('openInNewTab', !settings.openInNewTab)}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    settings.openInNewTab
                      ? 'border-[var(--accent-color)] bg-[var(--bg-hover)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <ExternalLink className="w-5 h-5 text-[var(--accent-color)] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)]">
                        New Tab Mode
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${settings.openInNewTab ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700/40 text-zinc-400'}`}>
                        {settings.openInNewTab ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-dim)] mt-1">
                      Launches games into their own new window
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate('confirmBeforeLeave', !settings.confirmBeforeLeave)}
                  className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    settings.confirmBeforeLeave
                      ? 'border-[var(--accent-color)] bg-[var(--bg-hover)]'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <Shield className="w-5 h-5 text-[var(--accent-color)] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)]">
                        Leave Warning
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${settings.confirmBeforeLeave ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700/40 text-zinc-400'}`}>
                        {settings.confirmBeforeLeave ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-dim)] mt-1">
                      Asks before closing tab to prevent losing game progress
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: DATA & STORAGE (Export / Import full backup) */}
        {activeTab === 'data' && (
          <div className="space-y-5 animate-fade-in">
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-main)]">
                    System Backup & Restore
                  </h4>
                  <p className="text-xs text-[var(--text-dim)]">
                    Export your custom settings, favorites, recents, and games catalog as a JSON backup file.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-[var(--accent-color)]">
                    {games.length}
                  </span>
                  <span className="text-xs text-[var(--text-dim)] ml-1">games</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[var(--border-color)]">
                <button
                  onClick={handleExportFullBackup}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-main)] transition-all cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>Export Full Backup JSON</span>
                </button>

                <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-main)] cursor-pointer transition-all shadow-sm">
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  <span>Import Backup JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => {
                    if (window.confirm('Reset games library to original collection?')) {
                      onResetLibraryDefaults();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-medium text-amber-300 transition-all ml-auto cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Catalog</span>
                </button>
              </div>

              {importStatus && (
                <div className="mt-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/30">
                  {importStatus}
                </div>
              )}
            </div>

            {/* Clear Storage */}
            <div className="p-5 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h4 className="text-xs font-bold text-red-200">
                  Wipe Browser Storage & Reset App
                </h4>
              </div>
              <p className="text-[11px] text-red-300/80">
                Wipes all saved settings, favorites, recents, and customizations from this browser.
              </p>

              <button
                onClick={handleClearCacheAndReset}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Storage</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB: CHANGELOG */}
        {activeTab === 'changelog' && (
          <div className="space-y-4 animate-fade-in">
            <ChangelogView />
          </div>
        )}

        {/* TAB: CREDITS */}
        {activeTab === 'credits' && (
          <CreditsSettingsTab />
        )}
      </div>
    </div>
  );
};
