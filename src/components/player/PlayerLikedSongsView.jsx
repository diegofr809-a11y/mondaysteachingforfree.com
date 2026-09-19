import React from 'react';
import { Heart, Play, Pause, Shuffle, ChevronLeft } from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { PlayerSongRow } from './PlayerSongRow';

export const PlayerLikedSongsView = ({ onBack, onSelectArtist }) => {
  const {
    likedTracks,
    playTrack,
    togglePlay,
    isPlaying,
    currentTrack,
    toggleShuffle,
    isShuffled,
  } = useMusicPlayer();

  const isCurrentPlaylistPlaying =
    likedTracks.some((t) => t.id === currentTrack?.id) && isPlaying;

  const handlePlayAll = () => {
    if (isCurrentPlaylistPlaying) {
      togglePlay();
      return;
    }
    if (likedTracks.length > 0) {
      playTrack(likedTracks[0], likedTracks);
    }
  };

  const handleShuffle = () => {
    if (likedTracks.length > 0) {
      if (!isShuffled) toggleShuffle();
      const randIdx = Math.floor(Math.random() * likedTracks.length);
      playTrack(likedTracks[randIdx], likedTracks);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar text-white select-none pb-16">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-[#a7a7a7] hover:text-white transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 bg-gradient-to-b from-[#450af5]/40 to-transparent p-6 rounded-lg">
        {/* Square Liked Songs Art */}
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-md bg-gradient-to-br from-[#450af5] to-[#8e8ee5] flex items-center justify-center shadow-2xl shrink-0">
          <Heart className="w-16 h-16 fill-white text-white drop-shadow-md" />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xs uppercase font-bold tracking-wider text-white">
            Playlist
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Liked Songs
          </h1>
          <p className="text-xs text-[#b3b3b3]">
            {likedTracks.length} songs
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4 py-2">
        <button
          type="button"
          onClick={handlePlayAll}
          disabled={likedTracks.length === 0}
          className="w-13 h-13 rounded-full bg-[#1db954] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-lg transition-transform cursor-pointer disabled:opacity-40"
          title={isCurrentPlaylistPlaying ? 'Pause' : 'Play all liked songs'}
        >
          {isCurrentPlaylistPlaying ? (
            <Pause className="w-6 h-6 fill-black" />
          ) : (
            <Play className="w-6 h-6 fill-black ml-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={handleShuffle}
          disabled={likedTracks.length === 0}
          className={`p-2 transition-colors cursor-pointer ${
            isShuffled ? 'text-[#1db954]' : 'text-[#a7a7a7] hover:text-white'
          }`}
          title="Shuffle Liked Songs"
        >
          <Shuffle className="w-5 h-5" />
        </button>
      </div>

      {/* Songs Table */}
      <div className="space-y-0.5">
        {likedTracks.length === 0 ? (
          <div className="text-center py-16 text-[#a7a7a7]">
            <p className="text-base font-semibold text-white">Songs you like will appear here</p>
            <p className="text-xs mt-1">Save songs by tapping the heart icon.</p>
          </div>
        ) : (
          likedTracks.map((track, idx) => (
            <PlayerSongRow
              key={`liked-${track.id}`}
              track={track}
              index={idx}
              queueList={likedTracks}
              onSelectArtist={onSelectArtist}
              showAlbum={true}
            />
          ))
        )}
      </div>
    </div>
  );
};
