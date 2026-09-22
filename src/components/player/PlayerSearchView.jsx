import React, { useState, useMemo } from 'react';
import { Search, X, Music, Disc, User, Sparkles } from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { PlayerSongRow } from './PlayerSongRow';
import { PlayerArtistCard } from './PlayerArtistCard';
import { PlayerMediaCard } from './PlayerMediaCard';
import { handleImageError } from '../../utils/imageFallback';

export const PlayerSearchView = ({ onSelectArtist, onSelectPlaylist }) => {
  const { tracks, artists, playTrack, togglePlay, currentTrack, isPlaying } = useMusicPlayer();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'songs' | 'artists'

  // Search filtering
  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { songs: [], artists: [], topMatch: null };

    const matchingSongs = tracks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        (t.album && t.album.toLowerCase().includes(q))
    );

    const matchingArtists = artists.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.genre && a.genre.toLowerCase().includes(q))
    );

    // Pick top result
    let topMatch = null;
    if (matchingArtists.length > 0 && matchingArtists[0].name.toLowerCase().startsWith(q)) {
      topMatch = { type: 'artist', data: matchingArtists[0] };
    } else if (matchingSongs.length > 0) {
      topMatch = { type: 'song', data: matchingSongs[0] };
    } else if (matchingArtists.length > 0) {
      topMatch = { type: 'artist', data: matchingArtists[0] };
    }

    return {
      songs: matchingSongs,
      artists: matchingArtists,
      topMatch,
    };
  }, [query, tracks, artists]);

  // Genre categories for initial Browse view
  const browseCategories = [
    { title: 'Música Mexicana', color: 'bg-emerald-700', query: 'Junior H' },
    { title: 'Corridos Tumbados', color: 'bg-amber-700', query: 'Peso Pluma' },
    { title: 'Pop', color: 'bg-blue-600', query: 'Taylor Swift' },
    { title: 'Hip-Hop', color: 'bg-purple-700', query: 'Drake' },
    { title: 'Bélicos', color: 'bg-red-700', query: 'Fuerza Regida' },
    { title: 'Sierreño', color: 'bg-teal-700', query: 'Natanael Cano' },
    { title: 'Dance / Electronic', color: 'bg-indigo-700', query: 'Billie Eilish' },
    { title: 'Indie & Alternative', color: 'bg-stone-700', query: 'Sabrina Carpenter' },
  ];

  const popularSearches = [
    'Junior H',
    'Peso Pluma',
    'Natanael Cano',
    'Fuerza Regida',
    'Oscar Maydon',
    'Gabito Ballesteros',
    'Tito Double P',
    'Xavi',
    'Eslabon Armado',
    'Carín León',
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar text-white select-none">
      {/* 1. Prominent Search Bar & Filter Chips */}
      <div className="space-y-3 sticky top-0 bg-[#121212]/95 backdrop-blur-md pb-4 pt-1 z-20">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 text-[#a7a7a7] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to play?"
            autoFocus
            className="w-full h-11 pl-11 pr-10 rounded-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] focus:ring-2 focus:ring-white text-sm text-white placeholder-[#757575] focus:outline-none transition-colors shadow-inner"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a7a7a7] hover:text-white p-0.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        {query && (
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'songs', label: 'Songs' },
              { id: 'artists', label: 'Artists' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-white text-black'
                    : 'bg-[#242424] text-white hover:bg-[#2a2a2a]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Search Results View */}
      {query.trim() ? (
        <div className="space-y-8">
          {filteredResults.songs.length === 0 && filteredResults.artists.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg font-semibold text-white">No results found for "{query}"</p>
              <p className="text-xs text-[#a7a7a7] mt-1">
                Please make sure your words are spelled correctly, or use fewer or different keywords.
              </p>
            </div>
          ) : (
            <>
              {/* Top Result & Songs Row (when 'all' or 'songs') */}
              {activeFilter !== 'artists' && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Top Result Card */}
                  {filteredResults.topMatch && activeFilter === 'all' && (
                    <div className="lg:col-span-2">
                      <h3 className="text-xl font-bold mb-3">Top result</h3>
                      {filteredResults.topMatch.type === 'artist' ? (
                        <div
                          onClick={() => onSelectArtist(filteredResults.topMatch.data.name)}
                          className="p-5 rounded-lg bg-[#181818] hover:bg-[#282828] transition-colors cursor-pointer group flex flex-col justify-between h-[230px]"
                        >
                          <div className="w-24 h-24 rounded-full overflow-hidden bg-[#242424] shadow-md">
                            <img
                              src={filteredResults.topMatch.data.avatarUrl}
                              alt={filteredResults.topMatch.data.name}
                              onError={(e) => handleImageError(e, null, filteredResults.topMatch.data.name, 'Artist')}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <h4 className="text-2xl font-bold text-white truncate">
                              {filteredResults.topMatch.data.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-black/40 text-white font-semibold uppercase tracking-wider text-[10px]">
                                Artist
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            const song = filteredResults.topMatch.data;
                            if (currentTrack?.id === song.id) togglePlay();
                            else playTrack(song, filteredResults.songs);
                          }}
                          className="p-5 rounded-lg bg-[#181818] hover:bg-[#282828] transition-colors cursor-pointer group flex flex-col justify-between h-[230px]"
                        >
                          <div className="w-24 h-24 rounded-md overflow-hidden bg-[#242424] shadow-md">
                            <img
                              src={filteredResults.topMatch.data.coverUrl}
                              alt={filteredResults.topMatch.data.title}
                              onError={(e) => handleImageError(e, null, filteredResults.topMatch.data.title, filteredResults.topMatch.data.artist)}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <h4 className="text-2xl font-bold text-white truncate">
                              {filteredResults.topMatch.data.title}
                            </h4>
                            <p className="text-xs text-[#a7a7a7] mt-1">
                              {filteredResults.topMatch.data.artist} • Song
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Songs List */}
                  <div
                    className={
                      filteredResults.topMatch && activeFilter === 'all'
                        ? 'lg:col-span-3'
                        : 'lg:col-span-5'
                    }
                  >
                    <h3 className="text-xl font-bold mb-3">Songs</h3>
                    <div className="space-y-1">
                      {filteredResults.songs
                        .slice(0, activeFilter === 'songs' ? 30 : 4)
                        .map((track, idx) => (
                          <PlayerSongRow
                            key={`search-song-${track.id}`}
                            track={track}
                            index={idx}
                            queueList={filteredResults.songs}
                            onSelectArtist={onSelectArtist}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Matching Artists */}
              {activeFilter !== 'songs' && filteredResults.artists.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-3">Artists</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredResults.artists.slice(0, 12).map((artist) => (
                      <PlayerArtistCard
                        key={`search-artist-${artist.id}`}
                        artist={artist}
                        onSelectArtist={onSelectArtist}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* 3. Empty State: Browse Categories */
        <div className="space-y-8">
          {/* Quick Artist Searches */}
          <div>
            <h3 className="text-sm font-semibold text-[#a7a7a7] mb-2.5">
              Popular searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((item) => (
                <button
                  key={item}
                  onClick={() => setQuery(item)}
                  className="px-3.5 py-1.5 rounded-full bg-[#242424] hover:bg-[#2e2e2e] text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Browse all grid */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Browse all</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {browseCategories.map((cat) => (
                <div
                  key={cat.title}
                  onClick={() => setQuery(cat.query)}
                  className={`relative h-28 rounded-lg p-4 font-bold text-lg text-white overflow-hidden cursor-pointer shadow hover:scale-[1.02] transition-transform ${cat.color}`}
                >
                  <span className="relative z-10">{cat.title}</span>
                  <div className="absolute -bottom-2 -right-3 w-16 h-16 rounded bg-black/20 rotate-25 shadow-inner" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
