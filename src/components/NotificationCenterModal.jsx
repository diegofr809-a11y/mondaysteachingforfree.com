import React from 'react';
import { Bell, CheckCheck, Trash2, X, Sparkles, Shield, Info, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/sound';

export const NotificationCenterModal = ({
  isOpen,
  onClose,
  notifications = [],
  onMarkAllAsRead,
  onClearNotifications,
  onOpenAction,
  soundEffectsEnabled = true,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/50 backdrop-blur-xs select-none animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl overflow-hidden flex flex-col mt-12 sm:mr-4 text-[var(--text-main)] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-color)]/20 text-[var(--accent-color)] flex items-center justify-center">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[var(--text-main)] flex items-center gap-1.5">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[var(--accent-color)] text-white text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={() => {
                  sounds.playClick(soundEffectsEnabled);
                  onMarkAllAsRead();
                }}
                className="p-1 rounded text-[11px] text-[var(--text-dim)] hover:text-[var(--accent-color)] flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-[var(--bg-hover)] text-[var(--text-dim)] hover:text-[var(--text-main)]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[var(--border-color)]/50 p-2">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text-dim)]">
              No notifications yet. You&apos;re all caught up!
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl transition-colors ${
                  !n.read
                    ? 'bg-[var(--bg-surface)] border-l-3 border-l-[var(--accent-color)]'
                    : 'hover:bg-[var(--bg-hover)]/60 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {n.type === 'feature' && (
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    )}
                    {n.type === 'system' && (
                      <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                    {n.type === 'tip' && (
                      <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    )}
                    <h4 className="text-xs font-bold text-[var(--text-main)]">
                      {n.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-[var(--text-dim)] shrink-0 font-medium">
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-1 leading-relaxed">
                  {n.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-surface)] text-[11px]">
          <button
            onClick={() => {
              sounds.playClick(soundEffectsEnabled);
              onClearNotifications();
            }}
            className="flex items-center gap-1 text-[var(--text-dim)] hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear All</span>
          </button>
          <button
            onClick={() => {
              sounds.playClick(soundEffectsEnabled);
              onOpenAction('changelog');
              onClose();
            }}
            className="flex items-center gap-1 text-[var(--accent-color)] hover:underline font-semibold"
          >
            <span>View Changelog</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
