import React, { useState } from 'react';
import { Image as ImageIcon, Check, Sparkles, Link, Plus, Trash2 } from 'lucide-react';
import { WALLPAPERS, WALLPAPER_CATEGORIES } from '../utils/theme';
import { sounds } from '../utils/sound';

export const WallpapersSettingsTab = ({
  currentWallpaper,
  customWallpaperUrl = '',
  onWallpaperChange,
  onCustomWallpaperChange,
  soundEffectsEnabled = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customInput, setCustomInput] = useState(customWallpaperUrl || '');
  const [customError, setCustomError] = useState('');

  const filteredWallpapers = WALLPAPERS.filter((wp) => {
    if (selectedCategory === 'all') return true;
    return wp.category === selectedCategory;
  });

  const handleApplyCustom = (e) => {
    e.preventDefault();
    setCustomError('');
    const val = customInput.trim();
    if (!val) {
      setCustomError('Please enter a valid image URL');
      return;
    }
    sounds.playLaunch(soundEffectsEnabled);
    onCustomWallpaperChange(val);
    onWallpaperChange('custom');
  };

  const handleClearCustom = () => {
    sounds.playClick(soundEffectsEnabled);
    setCustomInput('');
    onCustomWallpaperChange('');
    onWallpaperChange('none');
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)]/15 text-[var(--accent-color)] flex items-center justify-center shrink-0 border border-[var(--accent-color)]/30">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-main)]">
              Wallpaper Browser & Backgrounds
            </h3>
            <p className="text-xs text-[var(--text-dim)]">
              Choose from high-definition patterns, scenic photography, or enter a custom image URL.
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {WALLPAPER_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sounds.playClick(soundEffectsEnabled);
                setSelectedCategory(cat.id);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[var(--accent-color)] text-white shadow-sm'
                  : 'bg-[var(--bg-surface)] text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Custom Image URL Section */}
        {(selectedCategory === 'all' || selectedCategory === 'custom') && (
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <span>Custom Image Wallpaper URL</span>
              </span>
              {currentWallpaper === 'custom' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--accent-color)]/20 text-[var(--accent-color)]">
                  Active
                </span>
              )}
            </div>

            <form onSubmit={handleApplyCustom} className="flex gap-2">
              <input
                type="url"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="https://example.com/wallpaper.jpg"
                className="flex-1 px-3.5 py-2 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)] text-xs text-[var(--text-main)] placeholder-[var(--text-dim)] outline-none focus:border-[var(--accent-color)]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[var(--accent-color)] hover:opacity-90 text-white font-bold text-xs shadow-md cursor-pointer transition-opacity"
              >
                Apply
              </button>
              {customWallpaperUrl && (
                <button
                  type="button"
                  onClick={handleClearCustom}
                  className="p-2 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-800/40 cursor-pointer"
                  title="Remove custom wallpaper"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </form>
            {customError && <p className="text-red-400 text-[11px]">{customError}</p>}
          </div>
        )}

        {/* Wallpaper Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {filteredWallpapers.map((wp) => {
            const isSelected = currentWallpaper === wp.id;
            return (
              <button
                key={wp.id}
                type="button"
                onClick={() => {
                  sounds.playLaunch(soundEffectsEnabled);
                  onWallpaperChange(wp.id);
                }}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer group relative overflow-hidden ${
                  isSelected
                    ? 'border-[var(--accent-color)] bg-[var(--bg-hover)] shadow-lg ring-1 ring-[var(--accent-color)]'
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)]'
                }`}
              >
                {/* Visual Preview Box */}
                <div
                  className="w-full h-28 rounded-lg border border-[var(--border-color)] relative overflow-hidden flex items-center justify-center bg-cover bg-center"
                  style={{
                    backgroundColor: 'var(--bg-base)',
                    backgroundImage: wp.imageUrl
                      ? `url(${wp.imageUrl})`
                      : wp.css !== 'none'
                      ? wp.css
                      : undefined,
                    backgroundSize: wp.size || (wp.imageUrl ? 'cover' : 'auto'),
                  }}
                >
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-3 py-1 rounded-full bg-[var(--accent-color)] text-white text-[10px] font-bold shadow-md">
                      Set Wallpaper
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5 truncate">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
                      <span className="truncate">{wp.name}</span>
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--accent-color)]/20 text-[var(--accent-color)] shrink-0">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-dim)] leading-relaxed line-clamp-2">
                    {wp.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
