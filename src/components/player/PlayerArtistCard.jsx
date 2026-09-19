import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

export const PlayerArtistCard = ({ artist, onSelectArtist }) => {
  const { playTrack, togglePlay, currentTrack, isPlaying } = useMusicPlayer();

  const isCurrentArtist = currentTrack?.artist.toLowerCase() === artist.name.toLowerCase();
  const isCurrentPlaying = isCurrentArtist && isPlaying;

  const handlePlayArtist = (e) => {
    e.stopPropagation();
    if (isCurrentArtist) {
      togglePlay();
      return;
    }
    if (artist.songs && artist.songs.length > 0) {
      playTrack(artist.songs[0], artist.songs);
    }
  };

  return (
    <div
      onClick={() => onSelectArtist(artist.name)}
      className="group p-4 rounded-md bg-[#181818] hover:bg-[#282828] transition-colors duration-200 cursor-pointer flex flex-col select-none relative"
    >
      {/* Circular Avatar */}
      <div className="relative w-full aspect-square rounded-full overflow-hidden bg-[#282828] shadow-md">
        <img
          src={artist.avatarUrl}
          alt={artist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Floating Green Play/Pause Button */}
        <button
          type="button"
          onClick={handlePlayArtist}
          className={`absolute bottom-2 right-2 w-11 h-11 rounded-full bg-[#1db954] text-black flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
            isCurrentPlaying
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
          }`}
          title={isCurrentPlaying ? 'Pause' : `Play ${artist.name}`}
        >
          {isCurrentPlaying ? (
            <Pause className="w-5 h-5 fill-black" />
          ) : (
            <Play className="w-5 h-5 fill-black ml-0.5" />
          )}
        </button>
      </div>

      {/* Artist Name & Tag */}
      <div className="mt-3.5 min-w-0">
        <h4 className="text-sm font-bold text-white truncate group-hover:underline">
          {artist.name}
        </h4>
        <p className="text-xs text-[#a7a7a7] mt-1 capitalize">
          {artist.genre || 'Artist'}
        </p>
      </div>
    </div>
  );
};
