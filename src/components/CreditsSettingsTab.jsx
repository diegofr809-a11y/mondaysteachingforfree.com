import React from 'react';
import { Heart, Sparkles, Code2, Users, Flame, Star, ShieldCheck } from 'lucide-react';

export const CreditsSettingsTab = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Primary Hero Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-surface)] to-[var(--bg-card)] border border-[var(--border-color)] shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[var(--accent-color)]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)]/15 text-[var(--accent-color)] flex items-center justify-center shrink-0 border border-[var(--accent-color)]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[var(--text-main)] tracking-tight">
                Credits & Acknowledgments
              </h2>
              <p className="text-xs text-[var(--text-dim)]">
                The minds behind #grrmondays
              </p>
            </div>
          </div>

          {/* Creators Spotlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Lead Creator: Diego */}
            <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/60 transition-all shadow-md group">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0">
                  D
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-[var(--text-main)]">
                      by diego
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      Lead Creator
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                    Designed, crafted, and directed with clean unblocked access for everyone.
                  </p>
                </div>
              </div>
            </div>

            {/* Taro: Goated HB */}
            <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-amber-500/60 transition-all shadow-md group">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white font-black text-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0">
                  <Flame className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-amber-400">
                      taro is my goated hb
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                      GOAT Status
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                    Certified legend, forever recognized on the official #grrmondays hall of fame.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details Banner */}
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-[var(--text-main)] font-semibold">
              <Code2 className="w-4 h-4 text-[var(--accent-color)]" />
              <span>#grrmondays Hub &bull; 2,468 Unblocked Games Collection</span>
            </div>
            <div className="flex items-center gap-1 text-[var(--text-dim)]">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 mx-0.5 inline" />
              <span>for the boys</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
