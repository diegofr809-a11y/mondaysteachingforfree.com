import React, { useState } from 'react';
import {
  Flame,
  UserX,
  ShieldAlert,
  ShieldCheck,
  HeartCrack,
  ThumbsDown,
  VolumeX,
  Volume2,
  Sparkles,
  Plus,
  Trash2,
  RotateCcw,
  Zap,
  Smile,
  Frown,
  CheckCircle2,
  AlertCircle,
  Eye,
  Award
} from 'lucide-react';
import { sounds } from '../utils/sound';

export const HatersSettingsTab = ({ settings = {}, onUpdateSettings }) => {
  const [newHaterName, setNewHaterName] = useState('');
  const [newHaterRole, setNewHaterRole] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [deflectCounts, setDeflectCounts] = useState({ luna: 0, juana: 0 });
  const [toastMessage, setToastMessage] = useState(null);

  const defaultHaters = [
    {
      id: 'luna',
      name: 'Luna',
      role: 'Certified Day 1 Hater',
      bio: 'Never believed in the vision, but watches every single move from the sidelines.',
      saltLevel: 99,
      status: 'Active Doubter',
      isDefault: true,
      avatarGradient: 'from-rose-500 via-pink-600 to-red-600',
      badge: 'Day 1 Hater',
    },
    {
      id: 'juana',
      name: 'Juana',
      role: 'Executive Critic',
      bio: 'Professional side-eye specialist with unlimited unsolicited feedback and doubts.',
      saltLevel: 96,
      status: 'Constant Skeptic',
      isDefault: true,
      avatarGradient: 'from-purple-500 via-indigo-600 to-fuchsia-600',
      badge: 'Executive Critic',
    },
  ];

  // Merge default haters with any saved haters
  const currentHaters = Array.isArray(settings.haters) && settings.haters.length > 0
    ? settings.haters
    : defaultHaters;

  // Make sure Luna and Juana are always present in the list
  const hasLuna = currentHaters.some(h => (h.name || '').toLowerCase() === 'luna');
  const hasJuana = currentHaters.some(h => (h.name || '').toLowerCase() === 'juana');

  const displayHaters = [...currentHaters];
  if (!hasLuna) {
    displayHaters.unshift(defaultHaters[0]);
  }
  if (!hasJuana) {
    displayHaters.splice(1, 0, defaultHaters[1]);
  }

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  const handleSendL = (hater) => {
    sounds.playPop(settings.soundEffectsEnabled);
    setDeflectCounts((prev) => ({
      ...prev,
      [hater.id]: (prev[hater.id] || 0) + 1,
    }));
    showToast(`Huge L dispatched to ${hater.name}! 📉 Negative energy neutralized.`);
  };

  const handleDeflect = (hater) => {
    sounds.playLaunch(settings.soundEffectsEnabled);
    showToast(`Shield activated against ${hater.name}! +100 Aura gained. 🛡️`);
  };

  const handleToggleSetting = (key) => {
    sounds.playClick(settings.soundEffectsEnabled);
    const updated = { ...settings, [key]: !settings[key] };
    onUpdateSettings(updated);
  };

  const handleAddHater = (e) => {
    e.preventDefault();
    if (!newHaterName.trim()) return;

    sounds.playLaunch(settings.soundEffectsEnabled);
    const newEntry = {
      id: `hater-${Date.now()}`,
      name: newHaterName.trim(),
      role: newHaterRole.trim() || 'Rookie Hater',
      bio: 'Added to the official watchlist of certified doubters.',
      saltLevel: Math.floor(Math.random() * 25) + 75,
      status: 'On Notice',
      isDefault: false,
      avatarGradient: 'from-amber-500 to-orange-600',
      badge: 'On Notice',
    };

    const updatedList = [...displayHaters, newEntry];
    onUpdateSettings({ ...settings, haters: updatedList });
    setNewHaterName('');
    setNewHaterRole('');
    setShowAddForm(false);
    showToast(`${newEntry.name} added to the Haters registry!`);
  };

  const handleRemoveHater = (id, name) => {
    sounds.playClick(settings.soundEffectsEnabled);
    if (id === 'luna' || id === 'juana') {
      showToast(`${name} is in the permanent Hall of Fame and cannot be removed! 😉`);
      return;
    }
    const updatedList = displayHaters.filter((h) => h.id !== id);
    onUpdateSettings({ ...settings, haters: updatedList });
    showToast(`${name} dismissed from the Haters list.`);
  };

  const handleResetDefaults = () => {
    sounds.playLaunch(settings.soundEffectsEnabled);
    onUpdateSettings({ ...settings, haters: defaultHaters });
    showToast('Reset haters list back to Luna and Juana!');
  };

  return (
    <div className="space-y-6 animate-fade-in text-[var(--text-main)] select-none">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--accent-color)] text-xs font-bold text-[var(--text-main)] shadow-2xl animate-bounce backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-[var(--accent-color)]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-rose-950/30 via-[var(--bg-card)] to-purple-950/30 border border-rose-500/30 shadow-xl relative overflow-hidden">
        {/* Glow accents */}
        <div className="absolute -top-14 -right-14 w-44 h-44 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-14 -left-14 w-44 h-44 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shrink-0 shadow-lg">
                <HeartCrack className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-[var(--text-main)] tracking-tight">
                    Official Haters Registry
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-extrabold border border-rose-500/30 uppercase tracking-wider">
                    Luna & Juana
                  </span>
                </div>
                <p className="text-xs text-[var(--text-dim)]">
                  Recognizing the chief doubters who doubted the vision from day one.
                </p>
              </div>
            </div>

            {/* Anti-Hate Shield Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Anti-Hate Shield: ACTIVE</span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <span className="text-[10px] font-semibold text-[var(--text-dim)] uppercase block">
                Primary Haters
              </span>
              <span className="text-base font-black text-rose-400">Luna & Juana</span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <span className="text-[10px] font-semibold text-[var(--text-dim)] uppercase block">
                Salt Index
              </span>
              <span className="text-base font-black text-amber-400">99.8% (Maximum)</span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <span className="text-[10px] font-semibold text-[var(--text-dim)] uppercase block">
                Spite Fuel Gained
              </span>
              <span className="text-base font-black text-purple-400">+1000% Boost</span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <span className="text-[10px] font-semibold text-[var(--text-dim)] uppercase block">
                Vibe Deflection
              </span>
              <span className="text-base font-black text-emerald-400">100% Impenetrable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Primary Haters (Luna & Juana) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>The Hall of Fame Doubters</span>
          </h3>
          <span className="text-xs text-[var(--text-dim)]">
            Permanent Members
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayHaters.map((hater) => {
            const isFeatured = hater.id === 'luna' || hater.id === 'juana';
            const countL = deflectCounts[hater.id] || 0;

            return (
              <div
                key={hater.id}
                className={`p-5 rounded-2xl border transition-all shadow-md group relative overflow-hidden ${
                  isFeatured
                    ? 'bg-[var(--bg-card)] border-rose-500/30 hover:border-rose-500/60'
                    : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--accent-color)]/50'
                }`}
              >
                {/* Subtle gradient shimmer */}
                <div
                  className={`absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-10 blur-2xl pointer-events-none bg-gradient-to-tr ${
                    hater.avatarGradient || 'from-rose-500 to-amber-500'
                  }`}
                />

                <div className="relative z-10 space-y-4">
                  {/* Top info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      {/* Avatar with initial */}
                      <div
                        className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${
                          hater.avatarGradient || 'from-rose-500 to-pink-600'
                        } text-white font-black text-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0 border border-white/20`}
                      >
                        {hater.name ? hater.name[0].toUpperCase() : 'H'}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-lg font-black text-[var(--text-main)] tracking-tight">
                            {hater.name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              isFeatured
                                ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                : 'bg-[var(--bg-surface)] text-[var(--text-dim)] border-[var(--border-color)]'
                            }`}
                          >
                            {hater.badge || 'Hater'}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-rose-400">
                          {hater.role}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[10px] font-bold text-[var(--text-dim)] shrink-0">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span>{hater.status || 'Active'}</span>
                    </div>
                  </div>

                  {/* Bio / Description */}
                  <p className="text-xs text-[var(--text-dim)] leading-relaxed italic">
                    "{hater.bio}"
                  </p>

                  {/* Salt Level Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-[var(--text-dim)] flex items-center gap-1">
                        <Frown className="w-3 h-3 text-amber-400" />
                        <span>Salt Level</span>
                      </span>
                      <span className="text-rose-400 font-bold font-mono">
                        {hater.saltLevel || 99}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--bg-surface)] overflow-hidden border border-[var(--border-color)]">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 rounded-full transition-all duration-500"
                        style={{ width: `${hater.saltLevel || 99}%` }}
                      />
                    </div>
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-color)]">
                    <button
                      type="button"
                      onClick={() => handleSendL(hater)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                      title={`Send an L to ${hater.name}`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Send L ({countL})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeflect(hater)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                      title={`Deflect energy from ${hater.name}`}
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Deflect</span>
                    </button>

                    {!isFeatured && (
                      <button
                        type="button"
                        onClick={() => handleRemoveHater(hater.id, hater.name)}
                        className="p-2 rounded-xl bg-[var(--bg-surface)] hover:bg-red-500/20 text-[var(--text-dim)] hover:text-red-400 border border-[var(--border-color)] hover:border-red-500/30 transition-all cursor-pointer"
                        title="Remove from list"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Hater or Manage Options */}
      <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-[var(--text-main)]">
              Hater Protection & Custom Controls
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {!showAddForm && (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent-color)] hover:opacity-90 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Hater</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-dim)] hover:text-[var(--text-main)] transition-all cursor-pointer"
              title="Reset list to Luna and Juana"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Luna & Juana</span>
            </button>
          </div>
        </div>

        {/* Add Form Drawer */}
        {showAddForm && (
          <form
            onSubmit={handleAddHater}
            className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-3 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-main)]">
                Register New Hater
              </span>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-[var(--text-dim)] hover:text-[var(--text-main)]"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-[var(--text-dim)] block mb-1">
                  Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Someone skeptical"
                  value={newHaterName}
                  onChange={(e) => setNewHaterName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none focus:border-[var(--accent-color)]"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] text-[var(--text-dim)] block mb-1">
                  Role / Title:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Couch Critic, Sideline Watcher"
                  value={newHaterRole}
                  onChange={(e) => setNewHaterRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none focus:border-[var(--accent-color)]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--text-dim)] hover:text-[var(--text-main)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newHaterName.trim()}
                className="px-4 py-1.5 rounded-xl bg-[var(--accent-color)] hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                Register Hater
              </button>
            </div>
          </form>
        )}

        {/* Protection Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div
            onClick={() => handleToggleSetting('haterShieldActive')}
            className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between gap-3 cursor-pointer hover:border-[var(--accent-color)]/50 transition-all"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Anti-Hate Field</span>
              </span>
              <p className="text-[11px] text-[var(--text-dim)]">
                Deflects doubts from Luna and Juana into productivity.
              </p>
            </div>
            <div
              className={`w-10 h-6 rounded-full transition-colors p-1 flex items-center shrink-0 ${
                settings.haterShieldActive !== false
                  ? 'bg-emerald-500 justify-end'
                  : 'bg-[var(--border-color)] justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </div>
          </div>

          <div
            onClick={() => handleToggleSetting('muteHaterVibes')}
            className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between gap-3 cursor-pointer hover:border-[var(--accent-color)]/50 transition-all"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                <VolumeX className="w-3.5 h-3.5 text-purple-400" />
                <span>Mute Bad Vibes</span>
              </span>
              <p className="text-[11px] text-[var(--text-dim)]">
                Filter out unsolicited commentary and keep winning.
              </p>
            </div>
            <div
              className={`w-10 h-6 rounded-full transition-colors p-1 flex items-center shrink-0 ${
                settings.muteHaterVibes !== false
                  ? 'bg-purple-600 justify-end'
                  : 'bg-[var(--border-color)] justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Quote Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-amber-500/10 border border-rose-500/20 text-center">
        <p className="text-xs font-semibold text-[var(--text-main)] italic">
          "Behind every successful breakthrough is a Luna and a Juana wondering how we got here. Big shoutout to the doubters!"
        </p>
        <span className="text-[10px] text-[var(--text-dim)] font-mono mt-1 block">
          #grrmondays • Still Unstoppable
        </span>
      </div>
    </div>
  );
};
