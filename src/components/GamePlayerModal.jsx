import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  RotateCw,
  ExternalLink,
  Star,
  Gamepad2,
  Clock,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { openAboutBlankCloaked, resolvePlayableUrl } from '../utils/cloak';

export const GamePlayerModal = ({
  game,
  onClose,
  onToggleFavorite,
  onRecordPlay,
  isMinimized = false,
  onMinimize,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playSeconds, setPlaySeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [popoutSuccess, setPopoutSuccess] = useState(false);
  const [loadWarning, setLoadWarning] = useState(false);
  const frameRef = useRef(null);
  const containerRef = useRef(null);

  const playableUrl = game ? resolvePlayableUrl(game.url) : '';

  useEffect(() => {
    if (game) {
      onRecordPlay(game.id);
      setPlaySeconds(0);
      setIsLoading(true);
      setHasError(false);
      setLoadWarning(false);
      setPopoutSuccess(false);

      // If game takes > 7s, show friendly assist banner
      const timer = setTimeout(() => {
        setLoadWarning(true);
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [game?.id, game?.url]);

  useEffect(() => {
    let interval;
    if (game) {
      interval = setInterval(() => {
        setPlaySeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [game]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isFullscreen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onClose]);

  if (!game) return null;

  const handleReload = () => {
    setIsLoading(true);
    setHasError(false);
    setLoadWarning(false);
    if (frameRef.current) {
      frameRef.current.src = playableUrl;
    }
  };

  const handleCloakedPopout = () => {
    const ok = openAboutBlankCloaked(game.url, game.title);
    setPopoutSuccess(true);
    setTimeout(() => setPopoutSuccess(false), 2500);
  };

  const handleOpenDirect = () => {
    window.open(playableUrl, '_blank', 'noopener,noreferrer');
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm select-none transition-all duration-200 ${
        isMinimized ? 'opacity-0 pointer-events-none scale-90 translate-y-12' : 'opacity-100 scale-100'
      }`}
    >
      <div
        ref={containerRef}
        className={`bg-[#18181e]/95 backdrop-blur-2xl border border-white/15 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all duration-200 ${
          isFullscreen
            ? 'fixed inset-0 z-50 rounded-none border-none h-screen'
            : 'w-full max-w-5xl h-[86vh] max-h-[840px]'
        }`}
      >
        {/* Windows 11 Titlebar & Controls */}
        <div className="flex items-center justify-between px-3 sm:px-4 h-10 bg-[#1e1e24]/90 border-b border-white/10 text-xs shrink-0 select-none">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-md bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/30 flex items-center justify-center text-[var(--accent-color)] shrink-0">
              <Gamepad2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex items-center gap-2">
              <h3 className="font-semibold text-white text-xs truncate max-w-[140px] sm:max-w-[260px]">
                {game.title}
              </h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-medium hidden sm:inline-block">
                {game.category}
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-400 hidden md:flex">
                <Clock className="w-3 h-3 text-sky-400" />
                {formatTime(playSeconds)}
              </span>
            </div>
          </div>

          {/* Action buttons & Windows 11 Window Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`p-1.5 rounded-md transition-colors ${
                game.isFavorite
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
              title="Favorite game"
            >
              <Star className={`w-3.5 h-3.5 ${game.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            <button
              onClick={handleReload}
              className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Reload frame"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
            </button>

            <button
              onClick={handleOpenDirect}
              className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors hidden sm:flex items-center gap-1"
              title="Open direct URL in new tab"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCloakedPopout}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold text-xs shadow-md transition-all cursor-pointer ${
                popoutSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-sky-600 hover:bg-sky-500 text-white'
              }`}
              title="Open fullscreen inside a new tab"
            >
              <ExternalLink className="w-3 h-3" />
              <span>
                {popoutSuccess ? 'Opened in New Tab!' : 'Fullscreen in a new tab'}
              </span>
            </button>

            <div className="w-[1px] h-4 bg-white/15 mx-1 hidden sm:block" />

            {/* Windows 11 Window Controls */}
            {onMinimize && (
              <button
                onClick={onMinimize}
                title="Minimize"
                className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                <span className="text-sm leading-none font-bold">−</span>
              </button>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Maximize'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#e81123] rounded transition-colors"
              title="Close game"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embedded Game Iframe & Status Layer */}
        <div className="flex-1 w-full bg-black relative overflow-hidden">
          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0815]/90 backdrop-blur-xs text-center p-4">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-3" />
              <p className="text-white font-medium text-sm">Loading {game.title}...</p>
              <p className="text-xs text-[#8c85a6] mt-1 max-w-xs">
                Preparing game engine and assets
              </p>
            </div>
          )}

          {/* Long Load / Error Helper Bar */}
          {loadWarning && isLoading && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-[#161226]/95 border border-[#3b2d66] rounded-lg px-4 py-2 flex items-center gap-3 text-xs text-[#d1cde0] shadow-xl backdrop-blur-md">
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Game taking a moment?
              </span>
              <button
                onClick={handleCloakedPopout}
                className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded text-[11px] transition-colors cursor-pointer"
              >
                Fullscreen in a new tab
              </button>
              <button
                onClick={handleOpenDirect}
                className="px-2 py-1 bg-[#251e3d] hover:bg-[#342b55] text-white font-medium rounded text-[11px] transition-colors cursor-pointer"
              >
                Open Direct Tab
              </button>
            </div>
          )}

          {/* Fallback Error View */}
          {hasError && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0e0b1c] text-center p-6">
              <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
              <h4 className="text-base font-bold text-white mb-1">Game Frame Restricted</h4>
              <p className="text-xs text-[#8c85a6] max-w-md mb-4">
                This game could not be rendered inside an embedded frame. Launch it via fullscreen in a new tab to play without restrictions.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCloakedPopout}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg text-xs transition-colors"
                >
                  Fullscreen in a new tab
                </button>
                <button
                  onClick={handleReload}
                  className="px-3.5 py-1.5 bg-[#1e1738] hover:bg-[#2c2250] text-[#a79fc2] font-semibold rounded-lg text-xs transition-colors"
                >
                  Retry Loading
                </button>
              </div>
            </div>
          )}

          <iframe
            ref={frameRef}
            src={playableUrl}
            title={game.title}
            className="w-full h-full border-none"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-modals allow-downloads allow-popups-to-escape-sandbox allow-presentation"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen; gamepad; focus-without-user-activation *; pointer-lock *"
            allowFullScreen={true}
          />
        </div>
      </div>
    </div>
  );
};
