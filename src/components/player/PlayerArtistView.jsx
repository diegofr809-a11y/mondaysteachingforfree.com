import React, { useMemo, useState } from 'react';
import {
  Play,
  Pause,
  Shuffle,
  CheckCircle2,
  ChevronLeft,
  Heart,
} from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { PlayerSongRow } from './PlayerSongRow';
import { PlayerMediaCard } from './PlayerMediaCard';
import { PlayerArtistCard } from './PlayerArtistCard';
import { handleImageError } from '../../utils/imageFallback';

export const PlayerArtistView = ({
  artistName,
  onBack,
  onSelectArtist,
}) => {
  const {
    artists,
    tracks,
    playTrack,
    togglePlay,
    isPlaying,
    currentTrack,
    toggleShuffle,
    isShuffled,
  } = useMusicPlayer();

  const [showAllPopular, setShowAllPopular] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const artist = useMemo(() => {
    return (
      artists.find((a) => a.name.toLowerCase() === artistName.toLowerCase()) || {
        name: artistName,
        genre: 'Música Mexicana',
        monthlyListeners: '28,400,000',
        bio: `${artistName} is an iconic recording artist with top charting hits.`,
        albums: ['Greatest Hits', 'Studio Collection'],
        singles: ['Viral Single', 'Top Track'],
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
        bannerUrl:
          'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&q=80',
      }
    );
  }, [artists, artistName]);

  // Songs by this artist
  const artistSongs = useMemo(() => {
    return tracks.filter(
      (t) => t.artist.toLowerCase() === artistName.toLowerCase()
    );
  }, [tracks, artistName]);

  const isCurrentArtistPlaying =
    currentTrack?.artist.toLowerCase() === artistName.toLowerCase() && isPlaying;

  const handlePlayArtist = () => {
    if (currentTrack?.artist.toLowerCase() === artistName.toLowerCase()) {
      togglePlay();
      return;
    }
    if (artistSongs.length > 0) {
      playTrack(artistSongs[0], artistSongs);
    }
  };

  const handleShuffleArtist = () => {
    if (artistSongs.length > 0) {
      if (!isShuffled) toggleShuffle();
      const randIdx = Math.floor(Math.random() * artistSongs.length);
      playTrack(artistSongs[randIdx], artistSongs);
    }
  };

  // Related artists
  const relatedArtists = useMemo(() => {
    return artists
      .filter((a) => a.name.toLowerCase() !== artistName.toLowerCase())
      .slice(0, 6);
  }, [artists, artistName]);

  const displayedSongs = showAllPopular ? artistSongs : artistSongs.slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar select-none text-white pb-12">
      {/* 1. Artist Header with Photo & Name */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#181818]">
        <img
          src={artist.bannerUrl || artist.avatarUrl}
          alt={artist.name}
          onError={(e) => handleImageError(e, artist.avatarUrl, artist.name, 'Artist')}
          className="w-full h-full object-cover opacity-60 filter brightness-90"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent" />

        {/* Back Navigation Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-6 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors cursor-pointer z-10"
          title="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Artist Header Info */}
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#3d91f4] fill-current" />
            <span>Verified Artist</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2 truncate">
            {artist.name}
          </h1>
          <p className="text-xs text-[#b3b3b3]">
            {artist.monthlyListeners || '25,000,000'} monthly listeners
          </p>
        </div>
      </div>

      {/* 2. Action Bar: Play Button, Follow, Shuffle */}
      <div className="px-6 py-5 flex items-center gap-5">
        {/* Big Green Play Button */}
        <button
          type="button"
          onClick={handlePlayArtist}
          className="w-13 h-13 rounded-full bg-[#1db954] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-lg transition-transform cursor-pointer"
          title={isCurrentArtistPlaying ? 'Pause' : 'Play'}
        >
          {isCurrentArtistPlaying ? (
            <Pause className="w-6 h-6 fill-black" />
          ) : (
            <Play className="w-6 h-6 fill-black ml-0.5" />
          )}
        </button>

        {/* Follow Button */}
        <button
          type="button"
          onClick={() => setIsFollowing(!isFollowing)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
            isFollowing
              ? 'border-[#1db954] text-[#1db954]'
              : 'border-white/30 text-white hover:border-white'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>

        {/* Shuffle Button */}
        <button
          type="button"
          onClick={handleShuffleArtist}
          className={`p-2 transition-colors cursor-pointer ${
            isShuffled ? 'text-[#1db954]' : 'text-[#a7a7a7] hover:text-white'
          }`}
          title="Shuffle Artist Tracks"
        >
          <Shuffle className="w-5 h-5" />
        </button>
      </div>

      {/* 3. Popular Songs Table */}
      <div className="px-6 space-y-3 mb-8">
        <h3 className="text-xl font-bold tracking-tight text-white mb-3">
          Popular
        </h3>

        {artistSongs.length === 0 ? (
          <p className="text-xs text-[#a7a7a7]">No tracks available for this artist.</p>
        ) : (
          <div className="space-y-0.5">
            {displayedSongs.map((track, idx) => (
              <PlayerSongRow
                key={`artist-track-${track.id}`}
                track={track}
                index={idx}
                queueList={artistSongs}
                onSelectArtist={onSelectArtist}
                showAlbum={true}
              />
            ))}

            {artistSongs.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllPopular(!showAllPopular)}
                className="text-xs font-bold text-[#b3b3b3] hover:text-white px-4 py-2 mt-2 cursor-pointer"
              >
                {showAllPopular ? 'Show less' : 'See more'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 4. Discography / Albums Grid */}
      {artist.albums && artist.albums.length > 0 && (
        <div className="px-6 mb-8">
          <h3 className="text-xl font-bold tracking-tight text-white mb-4">
            Albums
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {artist.albums.map((alb, idx) => {
              const albumTitle = typeof alb === 'string' ? alb : alb.title || `Album ${idx + 1}`;
              const albumYear = typeof alb === 'object' && alb.year ? ` • ${alb.year}` : '';
              const albumCover = (typeof alb === 'object' && alb.coverUrl) || artist.avatarUrl;

              const albumSongs = artistSongs.filter(
                (t) => t.album && t.album.toLowerCase() === albumTitle.toLowerCase()
              );

              return (
                <PlayerMediaCard
                  key={`album-${idx}-${albumTitle}`}
                  title={albumTitle}
                  subtitle={`Album${albumYear}`}
                  imageUrl={albumCover}
                  onPlay={() => {
                    if (albumSongs.length > 0) playTrack(albumSongs[0], albumSongs);
                    else if (artistSongs.length > 0) playTrack(artistSongs[0], artistSongs);
                  }}
                  onClick={() => {
                    if (albumSongs.length > 0) playTrack(albumSongs[0], albumSongs);
                    else if (artistSongs.length > 0) playTrack(artistSongs[0], artistSongs);
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Singles & EPs Grid */}
      {artist.singles && artist.singles.length > 0 && (
        <div className="px-6 mb-8">
          <h3 className="text-xl font-bold tracking-tight text-white mb-4">
            Singles & EPs
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {artist.singles.map((sgl, idx) => {
              const singleTitle = typeof sgl === 'string' ? sgl : sgl.title || `Single ${idx + 1}`;
              const singleYear = typeof sgl === 'object' && sgl.year ? ` • ${sgl.year}` : '';
              const singleCover = (typeof sgl === 'object' && sgl.coverUrl) || artist.avatarUrl;

              const singleTrack = artistSongs.find(
                (t) => t.title.toLowerCase() === singleTitle.toLowerCase()
              );

              return (
                <PlayerMediaCard
                  key={`single-${idx}-${singleTitle}`}
                  title={singleTitle}
                  subtitle={`Single${singleYear}`}
                  imageUrl={singleCover}
                  onPlay={() => {
                    if (singleTrack) playTrack(singleTrack, artistSongs);
                    else if (artistSongs.length > 0) playTrack(artistSongs[0], artistSongs);
                  }}
                  onClick={() => {
                    if (singleTrack) playTrack(singleTrack, artistSongs);
                    else if (artistSongs.length > 0) playTrack(artistSongs[0], artistSongs);
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Featuring / Collaborations */}
      {artist.collaborations && artist.collaborations.length > 0 && (
        <div className="px-6 mb-8">
          <h3 className="text-xl font-bold tracking-tight text-white mb-4">
            Featured In & Collaborations
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {artist.collaborations.map((col, idx) => {
              const colTitle = typeof col === 'string' ? col : col.title;
              const colWith = typeof col === 'object' && col.withArtist ? `with ${col.withArtist}` : 'Collaboration';
              const colCover = (typeof col === 'object' && col.coverUrl) || artist.avatarUrl;

              const colTrack = artistSongs.find(
                (t) => t.title.toLowerCase() === colTitle.toLowerCase()
              );

              return (
                <PlayerMediaCard
                  key={`collab-${idx}-${colTitle}`}
                  title={colTitle}
                  subtitle={colWith}
                  imageUrl={colCover}
                  onPlay={() => {
                    if (colTrack) playTrack(colTrack, artistSongs);
                    else if (artistSongs.length > 0) playTrack(artistSongs[0], artistSongs);
                  }}
                  onClick={() => {
                    if (colTrack) playTrack(colTrack, artistSongs);
                    else if (artistSongs.length > 0) playTrack(artistSongs[0], artistSongs);
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 7. About / Biography Card */}
      {artist.bio && (
        <div className="px-6 mb-8">
          <h3 className="text-xl font-bold tracking-tight text-white mb-4">
            About
          </h3>
          <div className="relative rounded-2xl overflow-hidden bg-[#181818] border border-white/5 p-6 hover:bg-[#202020] transition-colors">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <img
                src={artist.avatarUrl}
                alt={artist.name}
                onError={(e) => handleImageError(e, null, artist.name, 'Artist')}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1db954]">{artist.genre}</span>
                  <span className="text-xs text-[#b3b3b3]">• {artist.monthlyListeners} monthly listeners</span>
                </div>
                <p className="text-sm text-[#b3b3b3] leading-relaxed max-w-3xl">
                  {artist.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Fans Also Like (Related Artists) */}
      <div className="px-6">
        <h3 className="text-xl font-bold tracking-tight text-white mb-4">
          Fans Also Like
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {relatedArtists.map((rel) => (
            <PlayerArtistCard
              key={rel.id}
              artist={rel}
              onSelectArtist={onSelectArtist}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
