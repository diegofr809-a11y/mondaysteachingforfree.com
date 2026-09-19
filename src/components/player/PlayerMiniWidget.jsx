import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Maximize2 } from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

export const PlayerMiniWidget = ({ onOpenPlayer, isPlayerWindowOpen }) => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
  } = useMusicPlayer();

  if (!currentTrack || isPlayerWindowOpen) return null;

  return (
    <div
      onClick={onOpenPlayer}
      className="fixed bottom-14 right-4 z-40 w-72 sm:w-80 rounded-xl bg-[#181818]/95 backdrop-blur-xl border border-white/10 p-2.5 shadow-2xl flex items-center justify-between gap-3 text-white select-none hover:border-white/20 transition-all cursor-pointer group"
    >
      {/* Left Artwork */}
      <div className="relative w-11 h-11 rounded-md overflow-hidden bg-[#282828] shrink-0 shadow-md">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Center Metadata */}
      <div className="min-w-0 flex-1">
        <h4 className="text-xs font-bold text-white truncate group-hover:underline">
          {currentTrack.title}
        </h4>
        <p className="text-[11px] text-[#a7a7a7] truncate mt-0.5">
          {currentTrack.artist}
        </p>
      </div>

      {/* Right Controls */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1 shrink-0"
      >
        <button
          type="button"
          onClick={prevTrack}
          className="p-1 text-[#b3b3b3] hover:text-white transition-colors"
          title="Previous"
        >
          <SkipBack className="w-3.5 h-3.5 fill-current" />
        </button>

        <button
          type="button"
          onClick={togglePlay}
          className="w-7 h-7 rounded-full bg-[#1db954] text-black flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-black" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={nextTrack}
          className="p-1 text-[#b3b3b3] hover:text-white transition-colors"
          title="Next"
        >
          <SkipForward className="w-3.5 h-3.5 fill-current" />
        </button>

        <button
          type="button"
          onClick={onOpenPlayer}
          className="p-1 text-[#b3b3b3] hover:text-white transition-colors ml-0.5"
          title="Open Spotify"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
