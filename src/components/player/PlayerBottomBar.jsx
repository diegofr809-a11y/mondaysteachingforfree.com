import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  Maximize2,
  ListMusic,
} from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

export const PlayerBottomBar = ({ onToggleQueue, isQueueOpen, onOpenArtist }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
    setIsNowPlayingOpen,
  } = useMusicPlayer();

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubValue, setScrubValue] = useState(0);

  // Sync scrub value with currentTime when not dragging
  useEffect(() => {
    if (!isScrubbing) {
      setScrubValue(currentTime);
    }
  }, [currentTime, isScrubbing]);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleScrubChange = (e) => {
    setScrubValue(parseFloat(e.target.value));
  };

  const handleScrubStart = () => {
    setIsScrubbing(true);
  };

  const handleScrubEnd = (e) => {
    setIsScrubbing(false);
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  if (!currentTrack) return null;

  const liked = isLiked(currentTrack.id);
  const currentProgressPercent = duration > 0 ? (scrubValue / duration) * 100 : 0;
  const currentVolPercent = isMuted ? 0 : volume * 100;

  return (
    <footer className="h-20 bg-[#181818] border-t border-white/5 px-4 sm:px-6 flex items-center justify-between select-none z-30 shrink-0">
      {/* LEFT: Currently Playing Track Info */}
      <div className="flex items-center gap-3.5 min-w-0 w-[240px] sm:w-[280px]">
        <div className="relative w-12 h-12 rounded bg-[#282828] overflow-hidden shrink-0 shadow-sm">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h4
            className="text-sm font-medium text-white truncate hover:underline cursor-pointer"
            title={currentTrack.title}
          >
            {currentTrack.title}
          </h4>
          <p
            onClick={() => onOpenArtist && onOpenArtist(currentTrack.artist)}
            className="text-xs text-[#b3b3b3] truncate hover:text-white hover:underline cursor-pointer mt-0.5"
            title={currentTrack.artist}
          >
            {currentTrack.artist}
          </p>
        </div>

        <button
          type="button"
          onClick={() => toggleLike(currentTrack.id)}
          className={`p-1.5 rounded-full transition-colors cursor-pointer shrink-0 ${
            liked
              ? 'text-[#1db954]'
              : 'text-[#b3b3b3] hover:text-white'
          }`}
          title={liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* CENTER: Playback Controls & Progress Timeline */}
      <div className="flex flex-col items-center gap-1.5 flex-1 max-w-xl px-2">
        {/* Control Buttons */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Shuffle */}
          <button
            type="button"
            onClick={toggleShuffle}
            className={`p-1 transition-colors cursor-pointer relative ${
              isShuffled
                ? 'text-[#1db954]'
                : 'text-[#b3b3b3] hover:text-white'
            }`}
            title={isShuffled ? 'Disable Shuffle' : 'Enable Shuffle'}
          >
            <Shuffle className="w-4 h-4" />
            {isShuffled && (
              <span className="w-1 h-1 rounded-full bg-[#1db954] absolute -bottom-1 left-1/2 -translate-x-1/2" />
            )}
          </button>

          {/* Previous */}
          <button
            type="button"
            onClick={prevTrack}
            className="p-1 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer active:scale-95"
            title="Previous (Ctrl+Left)"
          >
            <SkipBack className="w-4.5 h-4.5 fill-current" />
          </button>

          {/* Main Play / Pause Button - Instant response, NEVER disabled */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-transform flex items-center justify-center cursor-pointer shadow"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={nextTrack}
            className="p-1 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer active:scale-95"
            title="Next (Ctrl+Right)"
          >
            <SkipForward className="w-4.5 h-4.5 fill-current" />
          </button>

          {/* Repeat */}
          <button
            type="button"
            onClick={toggleRepeat}
            className={`p-1 transition-colors cursor-pointer relative ${
              repeatMode !== 'off'
                ? 'text-[#1db954]'
                : 'text-[#b3b3b3] hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
            {repeatMode !== 'off' && (
              <span className="w-1 h-1 rounded-full bg-[#1db954] absolute -bottom-1 left-1/2 -translate-x-1/2" />
            )}
          </button>
        </div>

        {/* Progress Bar with Timestamps */}
        <div className="w-full flex items-center gap-2 text-xs font-mono text-[#a7a7a7]">
          <span className="w-9 text-right shrink-0">
            {formatTime(scrubValue)}
          </span>

          <div className="relative flex-1 flex items-center group py-1 cursor-pointer">
            <input
              type="range"
              min="0"
              max={duration || 210}
              step="0.5"
              value={scrubValue}
              onChange={handleScrubChange}
              onMouseDown={handleScrubStart}
              onMouseUp={handleScrubEnd}
              onTouchStart={handleScrubStart}
              onTouchEnd={handleScrubEnd}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {/* Background Track */}
            <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden relative group-hover:h-1.5 transition-all">
              <div
                className="h-full bg-white group-hover:bg-[#1db954] transition-colors rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, currentProgressPercent))}%` }}
              />
            </div>
          </div>

          <span className="w-9 text-left shrink-0">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* RIGHT: Volume & View Options */}
      <div className="flex items-center justify-end gap-3 min-w-0 w-[240px] sm:w-[280px]">
        {/* Queue button */}
        <button
          type="button"
          onClick={onToggleQueue}
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            isQueueOpen
              ? 'text-[#1db954]'
              : 'text-[#b3b3b3] hover:text-white'
          }`}
          title="Play Queue"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Now Playing Fullscreen Modal */}
        <button
          type="button"
          onClick={() => setIsNowPlayingOpen(true)}
          className="p-1.5 rounded-md text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
          title="Open Now Playing View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Volume controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="p-1 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-zinc-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <div className="relative w-20 sm:w-24 flex items-center group py-1 cursor-pointer">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden relative group-hover:h-1.5 transition-all">
              <div
                className="h-full bg-white group-hover:bg-[#1db954] transition-colors rounded-full"
                style={{ width: `${currentVolPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
