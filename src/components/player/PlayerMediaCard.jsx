import React from 'react';
import { Play, Pause } from 'lucide-react';

export const PlayerMediaCard = ({
  title,
  subtitle,
  imageUrl,
  isRound = false,
  isCurrentlyPlaying = false,
  onPlay,
  onClick,
}) => {
  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (onPlay) onPlay();
  };

  return (
    <div
      onClick={onClick}
      className="group p-3.5 sm:p-4 rounded-md bg-[#181818] hover:bg-[#282828] transition-colors duration-200 cursor-pointer flex flex-col select-none relative"
    >
      {/* Artwork Container */}
      <div
        className={`relative w-full aspect-square overflow-hidden bg-[#242424] shadow-md ${
          isRound ? 'rounded-full' : 'rounded-md'
        }`}
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Hover Green Play / Pause Button */}
        <button
          type="button"
          onClick={handlePlayClick}
          className={`absolute bottom-2 right-2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1db954] text-black flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer z-10 ${
            isCurrentlyPlaying
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
          }`}
          title={isCurrentlyPlaying ? 'Pause' : `Play ${title}`}
        >
          {isCurrentlyPlaying ? (
            <Pause className="w-5 h-5 fill-black" />
          ) : (
            <Play className="w-5 h-5 fill-black ml-0.5" />
          )}
        </button>
      </div>

      {/* Metadata */}
      <div className="mt-3 min-w-0">
        <h4 className="text-sm font-bold text-white truncate group-hover:underline">
          {title}
        </h4>
        <p className="text-xs text-[#a7a7a7] truncate mt-1">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
