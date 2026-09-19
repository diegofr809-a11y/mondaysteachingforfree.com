import React from 'react';
import { Play, Pause, Heart, Sparkles } from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { PlayerMediaCard } from './PlayerMediaCard';
import { PlayerArtistCard } from './PlayerArtistCard';

export const PlayerHomeView = ({
  onSelectArtist,
  onSelectPlaylist,
  onOpenSearch,
}) => {
  const {
    tracks,
    artists,
    playlists,
    recentlyPlayed,
    playTrack,
    togglePlay,
    currentTrack,
    isPlaying,
    likedSongIds,
  } = useMusicPlayer();

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Categorized content
  const mexicanTracks = tracks.filter((t) => t.isMexican).slice(0, 8);
  const popularTracks = tracks.filter((t) => t.isPopular).slice(0, 8);
  const featuredArtists = artists.slice(0, 6);

  // Quick access cards (Top 6)
  const quickCards = [
    {
      id: 'quick-liked',
      title: 'Liked Songs',
      imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80',
      action: () => {
        const likedTracks = tracks.filter((t) => likedSongIds.includes(t.id));
        if (likedTracks.length > 0) playTrack(likedTracks[0], likedTracks);
      },
      isLikedTile: true,
    },
    {
      id: 'quick-junior-h',
      title: 'Junior H',
      imageUrl: 'https://i1.sndcdn.com/artworks-r8iTqG2N3sY9-0-t500x500.jpg',
      action: () => onSelectArtist('Junior H'),
      artistName: 'Junior H',
    },
    {
      id: 'quick-peso-pluma',
      title: 'Peso Pluma',
      imageUrl: 'https://i1.sndcdn.com/artworks-9VlA5eTq5Nn8-0-t500x500.jpg',
      action: () => onSelectArtist('Peso Pluma'),
      artistName: 'Peso Pluma',
    },
    {
      id: 'quick-mexican',
      title: 'Música Mexicana',
      imageUrl: 'https://i1.sndcdn.com/artworks-eB1b2x7W3VwD-0-t500x500.jpg',
      action: () => {
        if (mexicanTracks.length > 0) playTrack(mexicanTracks[0], mexicanTracks);
      },
    },
    {
      id: 'quick-natanael-cano',
      title: 'Natanael Cano',
      imageUrl: 'https://i1.sndcdn.com/artworks-WzE2NnL0l1q0-0-t500x500.jpg',
      action: () => onSelectArtist('Natanael Cano'),
      artistName: 'Natanael Cano',
    },
    {
      id: 'quick-top-hits',
      title: "Today's Top Hits",
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80',
      action: () => {
        if (popularTracks.length > 0) playTrack(popularTracks[0], popularTracks);
      },
    },
  ];

  const handleTrackCardPlay = (track, list) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, list);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar text-white select-none">
      {/* 1. Greeting & Quick Access Grid */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-4">
          {getGreeting()}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickCards.map((card) => {
            const isPlayingThis =
              card.artistName &&
              currentTrack?.artist.toLowerCase() === card.artistName.toLowerCase() &&
              isPlaying;

            return (
              <div
                key={card.id}
                onClick={card.action}
                className="group flex items-center bg-white/5 hover:bg-white/10 rounded-md overflow-hidden transition-colors cursor-pointer relative pr-4 shadow-sm"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 bg-[#282828] shrink-0 relative">
                  {card.isLikedTile ? (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-rose-500 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white fill-current" />
                    </div>
                  ) : (
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>

                {/* Title */}
                <span className="text-sm font-bold text-white px-4 truncate flex-1">
                  {card.title}
                </span>

                {/* Hover Play Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    card.action();
                  }}
                  className={`w-9 h-9 rounded-full bg-[#1db954] text-black flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 shrink-0 ${
                    isPlayingThis
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  }`}
                  title={`Play ${card.title}`}
                >
                  {isPlayingThis ? (
                    <Pause className="w-4 h-4 fill-black" />
                  ) : (
                    <Play className="w-4 h-4 fill-black ml-0.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Popular Artists */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold tracking-tight text-white">
            Popular Artists
          </h3>
          <button
            onClick={onOpenSearch}
            className="text-xs font-bold text-[#b3b3b3] hover:underline"
          >
            Show all
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {featuredArtists.map((artist) => (
            <PlayerArtistCard
              key={artist.id}
              artist={artist}
              onSelectArtist={onSelectArtist}
            />
          ))}
        </div>
      </section>

      {/* 3. Música Mexicana Hits */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">
              Música Mexicana Hits
            </h3>
            <p className="text-xs text-[#a7a7a7] mt-0.5">
              Corridos tumbados, bélicos, and Regional Mexican powerhouses
            </p>
          </div>
          <button
            onClick={() => onSelectPlaylist('playlist-mexican-pride')}
            className="text-xs font-bold text-[#b3b3b3] hover:underline"
          >
            Show all
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mexicanTracks.slice(0, 6).map((track) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            return (
              <PlayerMediaCard
                key={track.id}
                title={track.title}
                subtitle={track.artist}
                imageUrl={track.coverUrl}
                isCurrentlyPlaying={isThisPlaying}
                onPlay={() => handleTrackCardPlay(track, mexicanTracks)}
                onClick={() => handleTrackCardPlay(track, mexicanTracks)}
              />
            );
          })}
        </div>
      </section>

      {/* 4. Today's Top Hits */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">
              Today's Top Hits
            </h3>
            <p className="text-xs text-[#a7a7a7] mt-0.5">
              The hottest tracks right now
            </p>
          </div>
          <button
            onClick={() => onSelectPlaylist('playlist-today-top-hits')}
            className="text-xs font-bold text-[#b3b3b3] hover:underline"
          >
            Show all
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {popularTracks.slice(0, 6).map((track) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            return (
              <PlayerMediaCard
                key={track.id}
                title={track.title}
                subtitle={track.artist}
                imageUrl={track.coverUrl}
                isCurrentlyPlaying={isThisPlaying}
                onPlay={() => handleTrackCardPlay(track, popularTracks)}
                onClick={() => handleTrackCardPlay(track, popularTracks)}
              />
            );
          })}
        </div>
      </section>

      {/* 5. Featured Playlists */}
      <section className="pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold tracking-tight text-white">
            Featured Playlists
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {playlists.slice(0, 6).map((pl) => (
            <PlayerMediaCard
              key={pl.id}
              title={pl.name}
              subtitle={pl.description || 'Playlist'}
              imageUrl={pl.coverUrl}
              onPlay={() => onSelectPlaylist(pl.id)}
              onClick={() => onSelectPlaylist(pl.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
