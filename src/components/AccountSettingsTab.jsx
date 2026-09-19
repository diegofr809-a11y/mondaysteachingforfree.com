import React, { useState, useEffect } from 'react';
import {
  User,
  Gamepad2,
  Crown,
  Flame,
  Sparkles,
  Zap,
  Sword,
  Bot,
  Skull,
  Star,
  Check,
  ShieldCheck,
  Edit3,
} from 'lucide-react';
import { getStoredUserProfile, saveStoredUserProfile } from '../utils/storage';
import { sounds } from '../utils/sound';

const AVATAR_ICONS = [
  { id: 'gamepad', label: 'Gamepad', icon: Gamepad2 },
  { id: 'crown', label: 'Crown', icon: Crown },
  { id: 'flame', label: 'Flame', icon: Flame },
  { id: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { id: 'zap', label: 'Lightning', icon: Zap },
  { id: 'sword', label: 'Blade', icon: Sword },
  { id: 'bot', label: 'Cyberbot', icon: Bot },
  { id: 'skull', label: 'Skull', icon: Skull },
  { id: 'star', label: 'Star', icon: Star },
];

const AVATAR_COLORS = [
  '#9333ea', // Purple
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
  '#eab308', // Yellow
];

const GAMER_TITLES = [
  'Retro Gamer',
  'Speedrunner',
  'Stealth Master',
  'Arcade Champion',
  'Night Owl',
  'High Scorer',
  'Unblocked Pioneer',
];

export const AccountSettingsTab = ({ onAccountChange }) => {
  const [profile, setProfile] = useState(getStoredUserProfile);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setProfile(getStoredUserProfile());
  }, []);

  const handleUpdate = (key, value) => {
    const updated = { ...profile, [key]: value };
    setProfile(updated);
    saveStoredUserProfile(updated);
    onAccountChange?.(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1500);
  };

  const SelectedIcon =
    AVATAR_ICONS.find((a) => a.id === profile.avatar)?.icon || Gamepad2;

  return (
    <div className="space-y-6 animate-fade-in select-none">
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 transition-colors"
              style={{ backgroundColor: profile.avatarColor || '#9333ea' }}
            >
              <SelectedIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <span>{profile.username || 'GrrPlayer'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-color)]/20 text-[var(--accent-color)] font-semibold border border-[var(--accent-color)]/30">
                  {profile.title || 'Retro Gamer'}
                </span>
              </h3>
              <p className="text-xs text-[var(--text-dim)] mt-0.5">
                {profile.bio || 'Enjoying unblocked games on grrmondays.'}
              </p>
            </div>
          </div>

          {isSaved && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Saved</span>
            </div>
          )}
        </div>

        {/* Username & Gamer Title Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
              Player Nickname / Gamer Tag
            </label>
            <input
              type="text"
              maxLength={20}
              value={profile.username || ''}
              onChange={(e) => handleUpdate('username', e.target.value)}
              placeholder="e.g. GrrPlayer"
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:border-[var(--accent-color)] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
              Gamer Title / Badge
            </label>
            <select
              value={profile.title || GAMER_TITLES[0]}
              onChange={(e) => handleUpdate('title', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:border-[var(--accent-color)] outline-none cursor-pointer"
            >
              {GAMER_TITLES.map((t) => (
                <option key={t} value={t} className="bg-[var(--bg-card)]">
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
            Status Quote / Bio
          </label>
          <input
            type="text"
            maxLength={60}
            value={profile.bio || ''}
            onChange={(e) => handleUpdate('bio', e.target.value)}
            placeholder="e.g. Unblocked games enthusiast"
            className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:border-[var(--accent-color)] outline-none"
          />
        </div>

        {/* Avatar Icon Picker */}
        <div className="space-y-2 pt-2 border-t border-[var(--border-color)]/70">
          <label className="block text-xs font-bold text-[var(--text-main)]">
            Choose Avatar Icon
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
            {AVATAR_ICONS.map((item) => {
              const IconComp = item.icon;
              const isSelected = profile.avatar === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleUpdate('avatar', item.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--accent-color)]/20 border-[var(--accent-color)] text-[var(--accent-color)] shadow-md'
                      : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-dim)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                  <span className="text-[10px] font-medium truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Avatar Color Swatches */}
        <div className="space-y-2 pt-2 border-t border-[var(--border-color)]/70">
          <label className="block text-xs font-bold text-[var(--text-main)]">
            Avatar Accent Color
          </label>
          <div className="flex items-center gap-2.5 flex-wrap">
            {AVATAR_COLORS.map((c) => {
              const isSelected = profile.avatarColor === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleUpdate('avatarColor', c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                    isSelected ? 'scale-110 border-white shadow-lg' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
