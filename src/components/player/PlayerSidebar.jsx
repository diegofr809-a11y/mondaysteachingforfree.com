import React, { useState } from 'react';
import {
  Home,
  Search,
  Library,
  Heart,
  Plus,
  Music2,
  Trash2,
} from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { SpotifyIcon } from './SpotifyIcon';

export const PlayerSidebar = ({
  activeView,
  onSelectView,
  activePlaylistId,
  onSelectPlaylist,
}) => {
  const { playlists, createPlaylist, likedSongIds, deletePlaylist } = useMusicPlayer();
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      const pl = createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsCreatingPlaylist(false);
      onSelectPlaylist(pl.id);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Your Library', icon: Library },
    {
      id: 'liked',
      label: 'Liked Songs',
      icon: Heart,
      badge: likedSongIds.length > 0 ? likedSongIds.length : null,
    },
  ];

  return (
    <aside className="w-56 sm:w-60 bg-[#121212] border-r border-white/5 flex flex-col shrink-0 select-none h-full">
      {/* Spotify Brand Header */}
      <div className="h-16 px-5 flex items-center gap-2.5">
        <SpotifyIcon className="w-7 h-7" colored={true} />
        <span className="text-base font-bold tracking-tight text-white">
          Spotify
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id && !activePlaylistId;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-[#b3b3b3] hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#1db954]' : 'text-current'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[11px] text-zinc-400 font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Playlists Section */}
      <div className="flex-1 flex flex-col min-h-0 mt-4 pt-3 border-t border-white/5">
        <div className="px-4 pb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#a7a7a7] uppercase tracking-wider">
            Playlists
          </span>
          <button
            onClick={() => setIsCreatingPlaylist(true)}
            className="p-1 rounded-md text-[#a7a7a7] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Create Playlist"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Inline Create Input */}
        {isCreatingPlaylist && (
          <form onSubmit={handleCreateSubmit} className="px-3 mb-2">
            <div className="flex items-center gap-1.5 bg-[#242424] border border-[#1db954]/50 rounded-md p-1.5">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name..."
                autoFocus
                className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none px-1"
              />
              <button
                type="submit"
                className="text-[10px] px-2 py-0.5 rounded bg-[#1db954] text-black font-bold cursor-pointer"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingPlaylist(false)}
                className="text-[10px] text-zinc-400 hover:text-white px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </form>
        )}

        {/* Playlists list */}
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5 custom-scrollbar">
          {playlists.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <p className="text-[11px] text-zinc-500">No playlists yet</p>
              <button
                onClick={() => setIsCreatingPlaylist(true)}
                className="mt-2 text-xs font-semibold text-[#1db954] hover:underline cursor-pointer"
              >
                Create playlist
              </button>
            </div>
          ) : (
            playlists.map((pl) => {
              const isSelected = activePlaylistId === pl.id;
              return (
                <div
                  key={pl.id}
                  onClick={() => onSelectPlaylist(pl.id)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-white/10 text-[#1db954]'
                      : 'text-[#b3b3b3] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <Music2 className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
                    <span className="truncate">{pl.name}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylist(pl.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-400 rounded transition-opacity"
                    title="Delete Playlist"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
};
