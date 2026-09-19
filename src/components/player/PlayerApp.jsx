import React, { useState, useEffect } from 'react';
import { PlayerSidebar } from './PlayerSidebar';
import { PlayerBottomBar } from './PlayerBottomBar';
import { PlayerHomeView } from './PlayerHomeView';
import { PlayerArtistView } from './PlayerArtistView';
import { PlayerSearchView } from './PlayerSearchView';
import { PlayerLibraryView } from './PlayerLibraryView';
import { PlayerPlaylistView } from './PlayerPlaylistView';
import { PlayerLikedSongsView } from './PlayerLikedSongsView';
import { PlayerNowPlayingModal } from './PlayerNowPlayingModal';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { PlayerSongRow } from './PlayerSongRow';
import { ChevronLeft, ChevronRight, X, ListMusic } from 'lucide-react';

export const PlayerApp = () => {
  const { isNowPlayingOpen, setIsNowPlayingOpen, queue, togglePlay } = useMusicPlayer();

  // Active view routing: 'home' | 'search' | 'library' | 'liked' | 'artist' | 'playlist'
  const [activeView, setActiveView] = useState('home');
  const [selectedArtistName, setSelectedArtistName] = useState(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [history, setHistory] = useState([{ view: 'home', artist: null, playlist: null }]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  // Global keyboard shortcuts (e.g. Space to play/pause)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  // Navigate to view with history tracking
  const navigateTo = (viewId, artistName = null, playlistId = null) => {
    const nextItem = { view: viewId, artist: artistName, playlist: playlistId };
    const nextHist = history.slice(0, historyIdx + 1);
    nextHist.push(nextItem);
    setHistory(nextHist);
    setHistoryIdx(nextHist.length - 1);

    setActiveView(viewId);
    setSelectedArtistName(artistName);
    setSelectedPlaylistId(playlistId);
  };

  const handleBack = () => {
    if (historyIdx > 0) {
      const prevIdx = historyIdx - 1;
      const target = history[prevIdx];
      setHistoryIdx(prevIdx);
      setActiveView(target.view);
      setSelectedArtistName(target.artist);
      setSelectedPlaylistId(target.playlist);
    }
  };

  const handleForward = () => {
    if (historyIdx < history.length - 1) {
      const nextIdx = historyIdx + 1;
      const target = history[nextIdx];
      setHistoryIdx(nextIdx);
      setActiveView(target.view);
      setSelectedArtistName(target.artist);
      setSelectedPlaylistId(target.playlist);
    }
  };

  const handleSelectArtist = (name) => {
    if (!name) return;
    navigateTo('artist', name, null);
  };

  const handleSelectPlaylist = (plId) => {
    if (!plId) return;
    navigateTo('playlist', null, plId);
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#121212] text-white font-sans overflow-hidden select-none relative">
      {/* Top Main Workspace (Sidebar + Main View + Optional Queue) */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Left Sidebar */}
        <PlayerSidebar
          activeView={activeView}
          onSelectView={(v) => navigateTo(v)}
          activePlaylistId={selectedPlaylistId}
          onSelectPlaylist={handleSelectPlaylist}
        />

        {/* Center Main Dynamic Content View */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#121212] overflow-hidden relative">
          {/* Top Navigation Bar: Back & Forward buttons */}
          <div className="h-14 px-6 flex items-center justify-between bg-[#121212]/80 backdrop-blur-md sticky top-0 z-20 border-b border-white/5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBack}
                disabled={historyIdx === 0}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 disabled:opacity-30 disabled:hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Go back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleForward}
                disabled={historyIdx >= history.length - 1}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 disabled:opacity-30 disabled:hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Go forward"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Subtle App Badge / Status */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#b3b3b3]">
                Spotify for Windows
              </span>
            </div>
          </div>

          {/* Active View Container */}
          <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
            {activeView === 'home' && (
              <PlayerHomeView
                onSelectArtist={handleSelectArtist}
                onSelectPlaylist={handleSelectPlaylist}
                onOpenSearch={() => navigateTo('search')}
              />
            )}

            {activeView === 'search' && (
              <PlayerSearchView
                onSelectArtist={handleSelectArtist}
                onSelectPlaylist={handleSelectPlaylist}
              />
            )}

            {activeView === 'library' && (
              <PlayerLibraryView
                onSelectView={navigateTo}
                onSelectArtist={handleSelectArtist}
                onSelectPlaylist={handleSelectPlaylist}
              />
            )}

            {activeView === 'liked' && (
              <PlayerLikedSongsView
                onBack={() => navigateTo('home')}
                onSelectArtist={handleSelectArtist}
              />
            )}

            {activeView === 'artist' && selectedArtistName && (
              <PlayerArtistView
                artistName={selectedArtistName}
                onBack={handleBack}
                onSelectArtist={handleSelectArtist}
              />
            )}

            {activeView === 'playlist' && selectedPlaylistId && (
              <PlayerPlaylistView
                playlistId={selectedPlaylistId}
                onBack={() => navigateTo('library')}
                onSelectArtist={handleSelectArtist}
              />
            )}
          </main>
        </div>

        {/* Slide-out Queue Panel (if toggled) */}
        {isQueueOpen && (
          <aside className="w-72 sm:w-80 bg-[#181818] border-l border-white/10 flex flex-col p-4 z-30 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <ListMusic className="w-4 h-4 text-[#1db954]" />
                <h3 className="text-sm font-bold text-white">Queue</h3>
              </div>
              <button
                onClick={() => setIsQueueOpen(false)}
                className="p-1 rounded-md text-[#a7a7a7] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-2 space-y-0.5 custom-scrollbar">
              {queue.map((track, idx) => (
                <PlayerSongRow
                  key={`queue-track-${track.id}-${idx}`}
                  track={track}
                  index={idx}
                  queueList={queue}
                  onSelectArtist={handleSelectArtist}
                  showAlbum={false}
                />
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Playback Bar */}
      <PlayerBottomBar
        onToggleQueue={() => setIsQueueOpen(!isQueueOpen)}
        isQueueOpen={isQueueOpen}
        onOpenArtist={handleSelectArtist}
      />

      {/* Fullscreen Now Playing Modal */}
      {isNowPlayingOpen && (
        <PlayerNowPlayingModal
          isOpen={isNowPlayingOpen}
          onClose={() => setIsNowPlayingOpen(false)}
          onSelectArtist={handleSelectArtist}
        />
      )}
    </div>
  );
};
