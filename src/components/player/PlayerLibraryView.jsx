import React, { useState } from 'react';
import { Heart, Plus } from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { PlayerMediaCard } from './PlayerMediaCard';
import { PlayerArtistCard } from './PlayerArtistCard';

export const PlayerLibraryView = ({
  onSelectView,
  onSelectArtist,
  onSelectPlaylist,
}) => {
  const {
    likedTracks,
    playlists,
    artists,
    createPlaylist,
    playTrack,
  } = useMusicPlayer();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'playlists' | 'artists'

  const handlePlayLiked = () => {
    if (likedTracks.length > 0) {
      playTrack(likedTracks[0], likedTracks);
    }
  };

  const handleCreateNew = () => {
    const pl = createPlaylist('My Playlist #' + (playlists.length + 1));
    onSelectPlaylist(pl.id);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar text-white select-none">
      {/* Header & Filter Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Your Library
        </h2>

        <div className="flex items-center gap-2">
          {['all', 'playlists', 'artists'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors cursor-pointer ${
                activeFilter === f
                  ? 'bg-white text-black'
                  : 'bg-[#242424] text-white hover:bg-[#2e2e2e]'
              }`}
            >
              {f}
            </button>
          ))}

          <button
            onClick={handleCreateNew}
            className="p-1.5 rounded-full bg-[#242424] hover:bg-[#2e2e2e] text-white transition-colors cursor-pointer ml-1"
            title="Create Playlist"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Liked Songs Tile (Shown in all or playlists) */}
        {activeFilter !== 'artists' && (
          <div
            onClick={() => onSelectView('liked')}
            className="group p-4 rounded-md bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition-transform shadow-md col-span-2 relative select-none"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-white/80">Playlist</p>
              <h3 className="text-2xl font-black text-white">Liked Songs</h3>
            </div>

            <div className="flex items-center justify-between mt-8">
              <span className="text-xs font-semibold text-white/90">
                {likedTracks.length} liked songs
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayLiked();
                }}
                className="w-11 h-11 rounded-full bg-[#1db954] text-black flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                title="Play Liked Songs"
              >
                <Heart className="w-5 h-5 fill-black" />
              </button>
            </div>
          </div>
        )}

        {/* User Playlists */}
        {activeFilter !== 'artists' &&
          playlists.map((pl) => (
            <PlayerMediaCard
              key={pl.id}
              title={pl.name}
              subtitle="Playlist"
              imageUrl={pl.coverUrl}
              onPlay={() => onSelectPlaylist(pl.id)}
              onClick={() => onSelectPlaylist(pl.id)}
            />
          ))}

        {/* Followed Artists */}
        {activeFilter !== 'playlists' &&
          artists.slice(0, 12).map((artist) => (
            <PlayerArtistCard
              key={`library-artist-${artist.id}`}
              artist={artist}
              onSelectArtist={onSelectArtist}
            />
          ))}
      </div>
    </div>
  );
};
