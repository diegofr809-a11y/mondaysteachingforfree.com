import React, { useEffect, useRef } from 'react';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  VolumeX,
  Volume1,
  ListMusic,
  Disc3,
  Sparkles,
  Music,
  Loader2,
} from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { PlayerSongRow } from './PlayerSongRow';

export const PlayerNowPlayingModal = ({ isOpen, onClose, onSelectArtist }) => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    playbackError,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    queue,
    queueIndex,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    setIsMuted,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
    getVisualizerData,
  } = useMusicPlayer();

  const [showQueue, setShowQueue] = React.useState(false);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Real-time audio visualizer drawing
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const renderWave = () => {
      const dataArray = getVisualizerData();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 28;
      const barWidth = canvas.width / barCount - 3;
      let x = 0;

      for (let i = 0; i < barCount; i++) {
        const rawVal = dataArray[i % dataArray.length] || 0;
        // If not playing, give subtle ambient idle movement
        const baseHeight = isPlaying ? (rawVal / 255) * canvas.height * 0.85 : Math.sin(Date.now() / 400 + i) * 8 + 12;
        const barHeight = Math.max(4, baseHeight);

        // Vibrant Fluent gradient
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, '#0078D4');
        gradient.addColorStop(1, '#60CDFF');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, canvas.height - barHeight, barWidth, barHeight, [4, 4, 0, 0]);
        ctx.fill();

        x += barWidth + 3;
      }

      animFrameRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, isPlaying, getVisualizerData]);

  if (!isOpen || !currentTrack) return null;

  const liked = isLiked(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex flex-col bg-[#0b0c12]/95 backdrop-blur-3xl select-none animate-fade-in text-white overflow-hidden"
    >
      {/* Dynamic Ambient Background Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 blur-[100px] scale-125 transition-all duration-700"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 40%, rgba(0, 120, 212, 0.45), rgba(15, 23, 42, 0.8) 70%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-25 blur-3xl scale-110"
        style={{
          backgroundImage: `url(${currentTrack.coverUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Top Bar / Minimize Header */}
      <header className="relative z-10 h-16 px-6 flex items-center justify-between border-b border-white/10">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-zinc-200 hover:text-white transition-all cursor-pointer"
        >
          <ChevronDown className="w-4 h-4" />
          <span>Collapse</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
          <Disc3 className={`w-4 h-4 text-[#0078D4] ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
          <span className="uppercase tracking-widest text-[10px] font-bold">Now Playing</span>
        </div>

        <button
          onClick={() => setShowQueue(!showQueue)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            showQueue ? 'bg-[#0078D4] text-white' : 'bg-white/10 hover:bg-white/20 text-zinc-300'
          }`}
        >
          <ListMusic className="w-4 h-4" />
          <span>Queue ({queue.length})</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center p-6 md:p-12 gap-8 md:gap-16 max-w-6xl mx-auto w-full min-h-0 overflow-y-auto custom-scrollbar">
        {/* LEFT / CENTER: Huge Artwork + Waveform */}
        <div className="flex flex-col items-center max-w-md w-full shrink-0">
          {/* Large Vinyl/Cover Card */}
          <div className="relative aspect-square w-64 sm:w-80 md:w-96 rounded-3xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.8)] border border-white/20 group">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-105' : 'scale-100'
              }`}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          </div>

          {/* Visualizer Waveform Canvas */}
          <div className="w-full mt-6 flex justify-center">
            <canvas
              ref={canvasRef}
              width={340}
              height={44}
              className="opacity-90 drop-shadow-[0_0_12px_rgba(0,120,212,0.4)]"
            />
          </div>
        </div>

        {/* RIGHT / DETAILS & CONTROLS */}
        <div className="flex-1 flex flex-col justify-center max-w-lg w-full">
          {/* Track Meta & Like */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight line-clamp-2">
                {currentTrack.title}
              </h2>
              <button
                onClick={() => {
                  onClose();
                  if (onSelectArtist) onSelectArtist(currentTrack.artist);
                }}
                className="text-base sm:text-lg text-zinc-300 hover:text-[#60CDFF] hover:underline mt-1 font-medium block text-left"
              >
                {currentTrack.artist}
              </button>
              <p className="text-xs text-zinc-500 mt-1">{currentTrack.album || 'Single'}</p>
            </div>

            <button
              onClick={() => toggleLike(currentTrack.id)}
              className={`p-3 rounded-2xl transition-all cursor-pointer ${
                liked
                  ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-400/40'
                  : 'bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white'
              }`}
              title={liked ? 'Remove from Liked' : 'Save to Liked Songs'}
            >
              <Heart className={`w-6 h-6 ${liked ? 'fill-rose-400 text-rose-400' : ''}`} />
            </button>
          </div>

          {/* Scrub Timeline */}
          <div className="space-y-1.5 mb-8">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="1"
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#1db954] focus:outline-none"
              style={{
                background: `linear-gradient(to right, #1db954 ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)`,
              }}
            />
            <div className="flex justify-between text-xs font-mono text-zinc-400 px-0.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Big Playback Controls */}
          <div className="flex items-center justify-between mb-8 px-4">
            <button
              onClick={toggleShuffle}
              className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                isShuffled ? 'text-[#1db954] bg-[#1db954]/20' : 'text-zinc-400 hover:text-white'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={prevTrack}
              className="p-3 rounded-full text-zinc-200 hover:text-white hover:bg-white/10 transition-transform active:scale-95 cursor-pointer"
              title="Previous"
            >
              <SkipBack className="w-7 h-7 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-[#1db954] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-2xl transition-all cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-black" />
              ) : (
                <Play className="w-8 h-8 fill-black ml-1" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-3 rounded-full text-zinc-200 hover:text-white hover:bg-white/10 transition-transform active:scale-95 cursor-pointer"
              title="Next"
            >
              <SkipForward className="w-7 h-7 fill-current" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                repeatMode !== 'off'
                  ? 'text-[#60CDFF] bg-[#0078D4]/20 ring-1 ring-[#0078D4]/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 px-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-zinc-400 hover:text-white cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 text-zinc-500" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#0078D4]"
              style={{
                background: `linear-gradient(to right, #0078D4 ${
                  (isMuted ? 0 : volume) * 100
                }%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%)`,
              }}
            />
            <span className="text-xs font-mono text-zinc-400 w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>
      </main>

      {/* Slide-out Queue Drawer */}
      {showQueue && (
        <div className="absolute right-0 top-16 bottom-0 w-full sm:w-96 bg-[#161822]/98 border-l border-white/15 z-20 flex flex-col p-4 shadow-2xl backdrop-blur-2xl animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white">Up Next in Queue</h3>
              <p className="text-xs text-zinc-400">{queue.length} tracks</p>
            </div>
            <button
              onClick={() => setShowQueue(false)}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1 bg-white/10 rounded-lg"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mt-2 space-y-1 custom-scrollbar">
            {queue.map((track, idx) => (
              <PlayerSongRow
                key={`${track.id}-${idx}`}
                track={track}
                index={idx}
                queueList={queue}
                onSelectArtist={(name) => {
                  onClose();
                  if (onSelectArtist) onSelectArtist(name);
                }}
                showAlbum={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
