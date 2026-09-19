import React, { useState, useMemo } from 'react';
import {
  Play,
  Pause,
  Shuffle,
  Trash2,
  Edit2,
  Plus,
  ChevronLeft,
  Search,
  Check,
  X,
} from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { PlayerSongRow } from './PlayerSongRow';

export const PlayerPlaylistView = ({
  playlistId,
  onBack,
  onSelectArtist,
}) => {
  const {
    playlists,
    tracks,
    tracksMap,
    playTrack,
    togglePlay,
    isPlaying,
    currentTrack,
    renamePlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    toggleShuffle,
    isShuffled,
  } = useMusicPlayer();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [isAddSongOpen, setIsAddSongOpen] = useState(false);
  const [songSearchQuery, setSongSearchQuery] = useState('');

  const playlist = useMemo(() => {
    return playlists.find((p) => p.id === playlistId);
  }, [playlists, playlistId]);

  // Playlist track objects
  const playlistTracks = useMemo(() => {
    if (!playlist || !playlist.trackIds) return [];
    return playlist.trackIds
      .map((id) => (tracksMap?.get ? tracksMap.get(id) : tracks?.find((t) => t.id === id)))
      .filter(Boolean);
  }, [playlist, tracksMap, tracks]);

  const isCurrentPlaylistPlaying =
    playlistTracks.some((t) => t.id === currentTrack?.id) && isPlaying;

  if (!playlist) {
    return (
      <div className="p-8 text-center text-white space-y-4">
        <p className="text-[#a7a7a7]">Playlist not found.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-full bg-white/10 text-xs font-semibold text-white"
        >
          Return to Library
        </button>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (isCurrentPlaylistPlaying) {
      togglePlay();
      return;
    }
    if (playlistTracks.length > 0) {
      playTrack(playlistTracks[0], playlistTracks);
    }
  };

  const handleShuffle = () => {
    if (playlistTracks.length > 0) {
      if (!isShuffled) toggleShuffle();
      const randIdx = Math.floor(Math.random() * playlistTracks.length);
      playTrack(playlistTracks[randIdx], playlistTracks);
    }
  };

  const handleSaveEdit = () => {
    if (editName.trim()) {
      renamePlaylist(playlist.id, editName.trim(), editDesc.trim());
      setIsEditing(false);
    }
  };

  // Filter songs for adding
  const searchCandidates = useMemo(() => {
    if (!songSearchQuery.trim()) return [];
    const q = songSearchQuery.toLowerCase();
    return tracks
      .filter(
        (t) =>
          !playlist.trackIds.includes(t.id) &&
          (t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [tracks, playlist.trackIds, songSearchQuery]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar text-white select-none pb-16">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-[#a7a7a7] hover:text-white transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Library
      </button>

      {/* Playlist Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 bg-gradient-to-b from-white/10 to-transparent p-6 rounded-lg">
        {/* Cover Art */}
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-md bg-[#282828] overflow-hidden shadow-2xl shrink-0">
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Metadata or Edit Mode */}
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xs uppercase font-bold tracking-wider text-white">
            Playlist
          </p>

          {isEditing ? (
            <div className="space-y-2 max-w-md">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Playlist name"
                className="w-full bg-[#282828] border border-white/20 rounded px-3 py-1.5 text-sm text-white font-bold focus:outline-none focus:border-[#1db954]"
              />
              <input
                type="text"
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Add an optional description"
                className="w-full bg-[#282828] border border-white/20 rounded px-3 py-1 text-xs text-zinc-300 focus:outline-none focus:border-[#1db954]"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 rounded bg-[#1db954] text-black text-xs font-bold"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 rounded bg-white/10 text-white text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {playlist.name}
              </h1>
              {playlist.description && (
                <p className="text-xs text-[#b3b3b3]">{playlist.description}</p>
              )}
              <p className="text-xs text-[#a7a7a7]">
                {playlistTracks.length} songs
              </p>
            </>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between py-2 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handlePlayAll}
            disabled={playlistTracks.length === 0}
            className="w-13 h-13 rounded-full bg-[#1db954] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-lg transition-transform cursor-pointer disabled:opacity-40"
            title={isCurrentPlaylistPlaying ? 'Pause' : 'Play Playlist'}
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
            disabled={playlistTracks.length === 0}
            className={`p-2 transition-colors cursor-pointer ${
              isShuffled ? 'text-[#1db954]' : 'text-[#a7a7a7] hover:text-white'
            }`}
            title="Shuffle Playlist"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsAddSongOpen(!isAddSongOpen)}
            className={`p-2 transition-colors cursor-pointer ${
              isAddSongOpen ? 'text-[#1db954]' : 'text-[#a7a7a7] hover:text-white'
            }`}
            title="Add Songs"
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setEditName(playlist.name);
              setEditDesc(playlist.description || '');
              setIsEditing(true);
            }}
            className="p-2 text-[#a7a7a7] hover:text-white transition-colors cursor-pointer"
            title="Edit Details"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {playlist.id.startsWith('playlist-') && !['playlist-mexican-pride', 'playlist-junior-h', 'playlist-corridos-belicos', 'playlist-tiktok-2026', 'playlist-today-top-hits', 'playlist-chill-late-night'].includes(playlist.id) && (
          <button
            type="button"
            onClick={() => {
              deletePlaylist(playlist.id);
              onBack();
            }}
            className="p-2 text-[#a7a7a7] hover:text-rose-400 transition-colors cursor-pointer"
            title="Delete Playlist"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Inline Song Adder */}
      {isAddSongOpen && (
        <div className="p-4 rounded-md bg-[#181818] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Let's find something for your playlist</h4>
            <button
              onClick={() => setIsAddSongOpen(false)}
              className="text-[#a7a7a7] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-[#a7a7a7] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={songSearchQuery}
              onChange={(e) => setSongSearchQuery(e.target.value)}
              placeholder="Search for songs or artists..."
              className="w-full h-9 pl-9 pr-4 rounded-full bg-[#282828] text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white"
            />
          </div>

          {searchCandidates.length > 0 && (
            <div className="space-y-1 pt-2">
              {searchCandidates.map((cand) => (
                <div
                  key={`cand-${cand.id}`}
                  className="flex items-center justify-between p-2 rounded hover:bg-white/5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={cand.coverUrl}
                      alt={cand.title}
                      className="w-8 h-8 rounded object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{cand.title}</p>
                      <p className="text-[11px] text-[#a7a7a7] truncate">{cand.artist}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => addSongToPlaylist(playlist.id, cand.id)}
                    className="px-3 py-1 rounded-full border border-white/30 text-xs text-white hover:border-white font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Playlist Songs Table */}
      <div className="space-y-0.5">
        {playlistTracks.length === 0 ? (
          <div className="text-center py-16 text-[#a7a7a7]">
            <p className="text-base font-semibold text-white">This playlist is empty</p>
            <p className="text-xs mt-1">Click the '+' button above to add tracks to your playlist.</p>
          </div>
        ) : (
          playlistTracks.map((track, idx) => (
            <div key={`pl-track-${track.id}`} className="group relative">
              <PlayerSongRow
                track={track}
                index={idx}
                queueList={playlistTracks}
                onSelectArtist={onSelectArtist}
                showAlbum={true}
              />
              <button
                type="button"
                onClick={() => removeSongFromPlaylist(playlist.id, track.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove from this playlist"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
