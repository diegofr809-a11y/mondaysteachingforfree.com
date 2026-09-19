import React from 'react';
import { Sparkles, CheckCircle2, Shield, Flame, History, ArrowLeft, Tag } from 'lucide-react';

export const CHANGELOG_DATA = [
  {
    version: 'v4.0.0',
    date: 'September 2026',
    isLatest: true,
    title: 'Dashboard, Universal Search & Customization Suite',
    changes: [
      {
        tag: 'Feature',
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        text: 'Live Clock & Weather widget with 12h/24h toggle, date, and temperature unit switcher.',
      },
      {
        tag: 'Feature',
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        text: 'Home Dashboard featuring Recently Opened games/apps shelf and quick category filters.',
      },
      {
        tag: 'Search',
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        text: 'Universal Search across 1,930+ games, web apps, wallpapers, and settings.',
      },
      {
        tag: 'Customization',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        text: 'Custom Accent Color Picker with HEX inputs and curated presets (Purple, Cyan, Emerald, Sunset, etc.).',
      },
      {
        tag: 'Customization',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        text: 'Wallpaper Browser with categories (Minimal, Cyberpunk, Space, Retro, Nature) & custom URL support.',
      },
      {
        tag: 'Gaming',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        text: 'Custom Gaming Cursors: Tactical Crosshair, Dot, Neon Glow, Retro Pixel, and Knight Sword.',
      },
      {
        tag: 'Audio',
        color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
        text: 'Built-in Web Audio UI synthesizer with click, pop, and game launch sound effects.',
      },
      {
        tag: 'Fix',
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        text: 'Purged 541 broken domain links. 1,930+ games tested and running at high speed.',
      },
      {
        tag: 'Account',
        color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
        text: 'Player Profile customization: gamer avatars, titles, bio, and instant local storage.',
      },
    ],
  },
  {
    version: 'v3.2.0',
    date: 'August 2026',
    title: 'Stealth Tab Cloak & Panic Engine',
    changes: [
      {
        tag: 'Stealth',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        text: 'Tab Cloak disguises: Google Classroom, Canvas LMS, Google Docs, Drive, and Clever.',
      },
      {
        tag: 'Security',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        text: 'Panic hotkey (default: ]) immediately redirects to educational learning platform.',
      },
      {
        tag: 'Display',
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        text: '12 dark and minimalist theme color palettes.',
      },
    ],
  },
  {
    version: 'v3.0.0',
    date: 'July 2026',
    title: 'Full Library Catalog & Web Proxy Integration',
    changes: [
      {
        tag: 'Core',
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        text: 'Expanded catalog with 2,400+ HTML5, WebGL, and retro arcade titles.',
      },
      {
        tag: 'Proxy',
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        text: 'Web proxy sandbox integration with DuckDuckGo, Wikipedia, Desmos, and Scratch.',
      },
    ],
  },
];

export const ChangelogView = ({ onBack }) => {
  return (
    <div className="flex-1 h-screen overflow-y-auto px-4 sm:px-8 py-8 select-none bg-[var(--bg-base)] text-[var(--text-main)]">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-[var(--text-main)] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)] flex items-center gap-2">
                <History className="w-6 h-6 text-[var(--accent-color)]" />
                <span>Changelog & Updates</span>
              </h1>
              <p className="text-xs text-[var(--text-dim)] mt-0.5">
                Full release notes and system improvements for grrmondays
              </p>
            </div>
          </div>
        </div>

        {/* Versions Timeline */}
        <div className="space-y-6">
          {CHANGELOG_DATA.map((release) => (
            <div
              key={release.version}
              className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl relative overflow-hidden space-y-4"
            >
              {release.isLatest && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-[var(--accent-color)] text-white text-[10px] font-extrabold uppercase tracking-wider rounded-bl-xl shadow-md">
                  Current Version
                </div>
              )}

              <div className="flex items-center gap-2.5">
                <span className="text-lg font-black font-mono text-[var(--accent-color)]">
                  {release.version}
                </span>
                <span className="text-xs text-[var(--text-dim)]">• {release.date}</span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
                {release.title}
              </h3>

              <div className="space-y-2.5 pt-1">
                {release.changes.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[var(--text-muted)]">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border shrink-0 mt-0.5 ${item.color}`}
                    >
                      {item.tag}
                    </span>
                    <span className="leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
