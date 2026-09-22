import React, { useState } from 'react';
import { Play, Pause, Heart, MoreHorizontal, Plus, Music } from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { handleImageError } from '../../utils/imageFallback';

export const PlayerSongRow = ({
  track,
  index,
  queueList = null,
  onSelectArtist,
  showAlbum = true,
}) => {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    toggleLike,
    isLiked,
    playlists,
    addSongToPlaylist,
  } = useMusicPlayer();

  const [showMenu, setShowMenu] = useState(false);

  const isCurrent = currentTrack?.id === track.id;
  const liked = isLiked(track.id);

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, queueList);
    }
  };

  const handlePlayBtnClick = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, queueList);
    }
  };

  return (
    <div
      onClick={handleRowClick}
      className={`group flex items-center justify-between px-4 py-2 rounded-md transition-colors cursor-pointer select-none text-xs ${
        isCurrent
          ? 'bg-white/10 text-white'
          : 'hover:bg-white/5 text-[#b3b3b3]'
      }`}
    >
      {/* Left: Number / Play button + Cover + Title + Artist */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-4">
        {/* Index / Play Button */}
        <div className="w-5 flex items-center justify-center shrink-0">
          {/* If current and playing, show active equalizer or pause icon on hover */}
          {isCurrent && isPlaying ? (
            <button
              type="button"
              onClick={handlePlayBtnClick}
              className="text-[#1db954] hover:scale-110 transition-transform"
              title="Pause"
            >
              <Pause className="w-3.5 h-3.5 fill-current hidden group-hover:block" />
              <div className="flex items-end gap-0.5 h-3.5 w-3.5 justify-center group-hover:hidden">
                <span className="w-0.5 bg-[#1db954] animate-[bounce_0.8s_infinite] h-full rounded-full" />
                <span className="w-0.5 bg-[#1db954] animate-[bounce_0.6s_infinite] h-2/3 rounded-full" />
                <span className="w-0.5 bg-[#1db954] animate-[bounce_1s_infinite] h-4/5 rounded-full" />
              </div>
            </button>
          ) : (
            <>
              <span
                className={`font-mono text-xs group-hover:hidden ${
                  isCurrent ? 'text-[#1db954] font-semibold' : 'text-[#a7a7a7]'
                }`}
              >
                {index !== undefined ? index + 1 : ''}
              </span>
              <button
                type="button"
                onClick={handlePlayBtnClick}
                className="hidden group-hover:flex items-center justify-center text-white hover:scale-110 transition-transform"
                title="Play"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Image */}
        <div className="w-10 h-10 rounded bg-[#282828] overflow-hidden shrink-0 shadow-sm">
          <img
            src={track.coverUrl}
            alt={track.title}
            onError={(e) => handleImageError(e, null, track.title, track.artist)}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>

        {/* Title and Artist */}
        <div className="min-w-0 flex-1">
          <div
            className={`text-sm truncate font-medium ${
              isCurrent ? 'text-[#1db954] font-semibold' : 'text-white'
            }`}
          >
            {track.title}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectArtist) onSelectArtist(track.artist);
            }}
            className="text-xs text-[#a7a7a7] hover:text-white hover:underline truncate block text-left mt-0.5"
          >
            {track.artist}
          </button>
        </div>
      </div>

      {/* Center: Album (Optional) */}
      {showAlbum && (
        <div className="hidden md:block w-48 lg:w-64 truncate text-[#a7a7a7] hover:text-white text-xs pr-4">
          {track.album || 'Single'}
        </div>
      )}

      {/* Right: Like button + Duration + Menu */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Like Heart */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track.id);
          }}
          className={`p-1 transition-colors cursor-pointer ${
            liked
              ? 'text-[#1db954] opacity-100'
              : 'text-[#a7a7a7] hover:text-white opacity-0 group-hover:opacity-100'
          }`}
          title={liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
        </button>

        {/* Duration */}
        <span className="font-mono text-xs text-[#a7a7a7] w-10 text-right">
          {track.duration || '3:30'}
        </span>

        {/* Context Menu Button */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 text-[#a7a7a7] hover:text-white rounded transition-colors opacity-0 group-hover:opacity-100"
            title="More Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* Context Popover */}
          {showMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-full mt-1 w-48 bg-[#282828] border border-white/10 rounded-md shadow-xl py-1.5 z-50 text-xs text-white animate-fadeIn"
            >
              <div className="px-3 py-1 font-semibold text-[#a7a7a7] uppercase text-[10px] tracking-wider border-b border-white/5 mb-1">
                Add to playlist
              </div>
              {playlists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => {
                    addSongToPlaylist(pl.id, track.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/10 flex items-center justify-between text-xs"
                >
                  <span className="truncate">{pl.name}</span>
                  <Plus className="w-3 h-3 text-[#a7a7a7]" />
                </button>
              ))}
              <div className="border-t border-white/5 mt-1 pt-1">
                <button
                  onClick={() => {
                    toggleLike(track.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-xs flex items-center gap-2"
                >
                  <Heart className={`w-3.5 h-3.5 ${liked ? 'text-[#1db954] fill-current' : ''}`} />
                  <span>{liked ? 'Remove from Your Library' : 'Save to Your Library'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
