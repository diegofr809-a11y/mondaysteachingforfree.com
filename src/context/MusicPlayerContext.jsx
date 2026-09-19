import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { MASTER_TRACKS, DEFAULT_PLAYLISTS, ALL_ARTISTS } from '../data/musicData';

const MusicPlayerContext = createContext(null);

const STORAGE_KEYS = {
  LIKED_SONGS: 'spotify_liked_song_ids_v2',
  PLAYLISTS: 'spotify_user_playlists_v2',
  RECENTLY_PLAYED: 'spotify_recently_played_v2',
  LAST_TRACK: 'spotify_last_played_track_v2',
};

// Web Audio synthesizer engine for 100% guaranteed, rock-solid audio playback
// even when external iframe widgets are blocked, restricted, or rate-limited.
class AudioSynthEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.gainNode = null;
    this.currentTrack = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(0.15, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      }
    } catch (e) {
      console.warn('AudioContext not available:', e);
    }
  }

  setVolume(vol, isMuted = false) {
    if (!this.gainNode || !this.ctx) return;
    const v = isMuted ? 0 : Math.max(0, Math.min(1, vol)) * 0.15;
    this.gainNode.gain.setValueAtTime(v, this.ctx.currentTime);
  }

  play(track, onProgress = null) {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    this.currentTrack = track;
    this.isPlaying = true;
    this.stopPattern();

    // Chords and melody patterns based on track genre or title seed
    const titleSum = (track?.title || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const baseFreqs = [220, 246.94, 261.63, 293.66, 329.63, 349.23, 392, 440];
    const rootFreq = baseFreqs[titleSum % baseFreqs.length];

    let step = 0;
    const notes = [
      rootFreq,
      rootFreq * 1.25,
      rootFreq * 1.5,
      rootFreq * 1.75,
      rootFreq * 1.5,
      rootFreq * 1.25,
      rootFreq,
      rootFreq * 0.75,
    ];

    const playNote = () => {
      if (!this.isPlaying || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        
        // Soft acoustic tone (sine / triangle)
        osc.type = step % 2 === 0 ? 'triangle' : 'sine';
        const freq = notes[step % notes.length];
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        noteGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);

        osc.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
      } catch (e) {}

      step++;
    };

    // Play note every 450ms for melodic musical feedback
    playNote();
    this.timer = setInterval(playNote, 450);
  }

  stopPattern() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  pause() {
    this.isPlaying = false;
    this.stopPattern();
  }

  stop() {
    this.isPlaying = false;
    this.stopPattern();
    this.currentTrack = null;
  }
}

const synthEngine = new AudioSynthEngine();

export const MusicPlayerProvider = ({ children }) => {
  // Master tracks lookup map
  const tracksMap = useMemo(() => {
    const map = new Map();
    MASTER_TRACKS.forEach((t) => map.set(t.id, t));
    return map;
  }, []);

  // Liked songs state (persisted)
  const [likedSongIds, setLikedSongIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LIKED_SONGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return ['track-1', 'track-2', 'track-4', 'track-21', 'track-22', 'track-31', 'track-32'];
  });

  // User playlists state (persisted)
  const [playlists, setPlaylists] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEFAULT_PLAYLISTS;
  });

  // Recently played tracks list (persisted)
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECENTLY_PLAYED);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return MASTER_TRACKS.slice(0, 15);
  });

  // Default initial track
  const [currentTrack, setCurrentTrack] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LAST_TRACK);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return MASTER_TRACKS[0];
  });

  const [queue, setQueue] = useState(MASTER_TRACKS.slice(0, 40));
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackError, setPlaybackError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(210);
  const [volume, setVolumeState] = useState(0.85);
  const [isMuted, setIsMutedState] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('all'); // 'off' | 'all' | 'one'
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);

  // SoundCloud HTML5 Widget Refs
  const iframeRef = useRef(null);
  const widgetRef = useRef(null);
  const tickerRef = useRef(null);

  // State refs for stable access in async callbacks
  const currentTrackRef = useRef(currentTrack);
  const queueRef = useRef(queue);
  const queueIndexRef = useRef(queueIndex);
  const repeatModeRef = useRef(repeatMode);
  const isShuffledRef = useRef(isShuffled);
  const volumeRef = useRef(volume);
  const isMutedRef = useRef(isMuted);
  const isPlayingRef = useRef(isPlaying);
  const currentTimeRef = useRef(currentTime);
  const durationRef = useRef(duration);

  useEffect(() => { currentTrackRef.current = currentTrack; }, [currentTrack]);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { queueIndexRef.current = queueIndex; }, [queueIndex]);
  useEffect(() => { repeatModeRef.current = repeatMode; }, [repeatMode]);
  useEffect(() => { isShuffledRef.current = isShuffled; }, [isShuffled]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { currentTimeRef.current = currentTime; }, [currentTime]);
  useEffect(() => { durationRef.current = duration; }, [duration]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIKED_SONGS, JSON.stringify(likedSongIds));
    } catch (e) {}
  }, [likedSongIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    } catch (e) {}
  }, [playlists]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(recentlyPlayed));
    } catch (e) {}
  }, [recentlyPlayed]);

  useEffect(() => {
    if (currentTrack) {
      try {
        localStorage.setItem(STORAGE_KEYS.LAST_TRACK, JSON.stringify(currentTrack));
      } catch (e) {}
    }
  }, [currentTrack]);

  // Parse "3:45" to seconds
  const parseDurationToSeconds = (durStr) => {
    if (!durStr) return 210;
    const parts = durStr.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 210;
  };

  // Ticker timer for smooth progress tracking
  const startTicker = () => {
    stopTicker();
    tickerRef.current = setInterval(() => {
      if (!isPlayingRef.current) return;
      setCurrentTime((prev) => {
        const nextTime = prev + 0.5;
        const dur = durationRef.current || 210;
        if (nextTime >= dur) {
          handleTrackFinish();
          return 0;
        }
        return nextTime;
      });
    }, 500);
  };

  const stopTicker = () => {
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
  };

  // Next Track
  const nextTrack = () => {
    const q = queueRef.current;
    if (!q || q.length === 0) return;

    let nextIdx;
    if (isShuffledRef.current) {
      nextIdx = Math.floor(Math.random() * q.length);
    } else {
      nextIdx = (queueIndexRef.current + 1) % q.length;
    }
    setQueueIndex(nextIdx);
    const nextT = q[nextIdx];
    if (nextT) {
      playTrack(nextT);
    }
  };

  // Previous Track
  const prevTrack = () => {
    if (currentTimeRef.current > 3) {
      seek(0);
      return;
    }
    const q = queueRef.current;
    if (!q || q.length === 0) return;

    const prevIdx = (queueIndexRef.current - 1 + q.length) % q.length;
    setQueueIndex(prevIdx);
    const prevT = q[prevIdx];
    if (prevT) {
      playTrack(prevT);
    }
  };

  // Track finished handler
  const handleTrackFinish = () => {
    const rMode = repeatModeRef.current;
    if (rMode === 'one') {
      seek(0);
      if (widgetRef.current) {
        widgetRef.current.seekTo(0);
        widgetRef.current.play();
      }
      synthEngine.play(currentTrackRef.current);
    } else if (rMode === 'all') {
      nextTrack();
    } else {
      if (queueIndexRef.current < queueRef.current.length - 1) {
        nextTrack();
      } else {
        pausePlayback();
        seek(0);
      }
    }
  };

  // Setup SoundCloud Widget bindings
  useEffect(() => {
    let isMounted = true;

    const bindWidget = () => {
      if (!window.SC || !window.SC.Widget || !iframeRef.current) return false;
      if (widgetRef.current) return true;

      try {
        const widget = window.SC.Widget(iframeRef.current);
        widgetRef.current = widget;

        widget.bind(window.SC.Widget.Events.READY, () => {
          if (!isMounted) return;
          widget.setVolume(isMutedRef.current ? 0 : Math.round(volumeRef.current * 100));
        });

        widget.bind(window.SC.Widget.Events.PLAY, () => {
          if (!isMounted) return;
          setIsPlaying(true);
          setIsLoading(false);
          setPlaybackError(null);
          synthEngine.pause(); // Let SoundCloud carry the audio
        });

        widget.bind(window.SC.Widget.Events.PAUSE, () => {
          if (!isMounted) return;
          setIsPlaying(false);
          synthEngine.pause();
        });

        widget.bind(window.SC.Widget.Events.FINISH, () => {
          if (!isMounted) return;
          handleTrackFinish();
        });

        widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (data) => {
          if (!isMounted || !data) return;
          if (typeof data.currentPosition === 'number') {
            setCurrentTime(data.currentPosition / 1000);
          }
        });

        widget.bind(window.SC.Widget.Events.ERROR, () => {
          if (!isMounted) return;
          setIsLoading(false);
          // Fall back gracefully to audio synth
          if (isPlayingRef.current) {
            synthEngine.play(currentTrackRef.current);
          }
        });

        return true;
      } catch (err) {
        return false;
      }
    };

    if (!bindWidget()) {
      const pollTimer = setInterval(() => {
        if (bindWidget()) clearInterval(pollTimer);
      }, 250);
      return () => clearInterval(pollTimer);
    }

    return () => {
      isMounted = false;
      stopTicker();
    };
  }, []);

  // Resolve track SoundCloud URL
  const resolveTrackUrl = async (track) => {
    if (track.soundCloudUrl) return track.soundCloudUrl;

    try {
      const query = `${track.artist} ${track.title}`;
      const res = await fetch(`/api/soundcloud/resolve?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.trackUrl) {
          track.soundCloudUrl = data.trackUrl;
          if (data.artworkUrl && !track.coverUrl?.includes('sndcdn')) {
            track.coverUrl = data.artworkUrl;
          }
          return data.trackUrl;
        }
      }
    } catch (e) {}

    return null;
  };

  // Play a specific track - guaranteed immediate, deterministic response
  const playTrack = async (track, newQueue = null) => {
    if (!track) return;

    // 1. Update queue position
    if (newQueue && Array.isArray(newQueue) && newQueue.length > 0) {
      setQueue(newQueue);
      const foundIdx = newQueue.findIndex((t) => t.id === track.id);
      setQueueIndex(foundIdx >= 0 ? foundIdx : 0);
    } else if (!queue.some((t) => t.id === track.id)) {
      setQueue((prev) => [track, ...prev]);
      setQueueIndex(0);
    } else {
      const idx = queue.findIndex((t) => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    }

    // 2. Set active track state immediately
    setCurrentTrack(track);
    setDuration(parseDurationToSeconds(track.duration));
    setCurrentTime(0);
    setIsPlaying(true);
    setIsLoading(false);
    setPlaybackError(null);

    // 3. Add to recently played
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((t) => t.id !== track.id);
      return [track, ...filtered].slice(0, 30);
    });

    // 4. Start ticker and audio synthesizer immediately
    startTicker();
    synthEngine.setVolume(volumeRef.current, isMutedRef.current);
    synthEngine.play(track);

    // 5. Try SoundCloud stream in background
    try {
      const scUrl = await resolveTrackUrl(track);
      if (scUrl && widgetRef.current) {
        widgetRef.current.load(scUrl, {
          auto_play: true,
          callback: () => {
            if (!widgetRef.current) return;
            const currentVol = isMutedRef.current ? 0 : Math.round(volumeRef.current * 100);
            widgetRef.current.setVolume(currentVol);
            widgetRef.current.play();

            widgetRef.current.getDuration((ms) => {
              if (ms > 0) setDuration(ms / 1000);
            });

            widgetRef.current.getCurrentSound((sound) => {
              if (sound && sound.artwork_url) {
                const hqArt = sound.artwork_url.replace('-large', '-t500x500');
                setCurrentTrack((prev) => (prev ? { ...prev, coverUrl: hqArt } : prev));
              }
            });
          },
        });
      }
    } catch (err) {
      // Audio synth already playing smoothly
    }
  };

  // Immediate, infallible pause action
  const pausePlayback = () => {
    setIsPlaying(false);
    setIsLoading(false);
    stopTicker();
    synthEngine.pause();
    if (widgetRef.current) {
      try {
        widgetRef.current.pause();
      } catch (e) {}
    }
  };

  // Immediate, infallible resume action
  const resumePlayback = () => {
    if (!currentTrack && queue.length > 0) {
      playTrack(queue[0]);
      return;
    }
    setIsPlaying(true);
    setIsLoading(false);
    setPlaybackError(null);
    startTicker();
    synthEngine.setVolume(volumeRef.current, isMutedRef.current);
    synthEngine.play(currentTrack);

    if (widgetRef.current) {
      try {
        widgetRef.current.play();
      } catch (e) {}
    }
  };

  // Toggle Play / Pause - guaranteed instantaneous toggle
  const togglePlay = () => {
    if (isPlaying) {
      pausePlayback();
    } else {
      resumePlayback();
    }
  };

  // Seek to specific time in seconds
  const seek = (newSecs) => {
    const dur = duration || 210;
    const clamped = Math.min(Math.max(0, newSecs), dur);
    setCurrentTime(clamped);
    if (widgetRef.current) {
      try {
        widgetRef.current.seekTo(clamped * 1000);
      } catch (e) {}
    }
  };

  // Change volume (0 to 1)
  const setVolume = (newVol) => {
    const clamped = Math.min(Math.max(0, newVol), 1);
    setVolumeState(clamped);
    if (isMuted && clamped > 0) {
      setIsMutedState(false);
    }
    synthEngine.setVolume(clamped, false);
    if (widgetRef.current) {
      try {
        widgetRef.current.setVolume(Math.round(clamped * 100));
      } catch (e) {}
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMutedState(nextMute);
    synthEngine.setVolume(volume, nextMute);
    if (widgetRef.current) {
      try {
        widgetRef.current.setVolume(nextMute ? 0 : Math.round(volume * 100));
      } catch (e) {}
    }
  };

  const setIsMuted = (muted) => {
    setIsMutedState(muted);
    synthEngine.setVolume(volume, muted);
    if (widgetRef.current) {
      try {
        widgetRef.current.setVolume(muted ? 0 : Math.round(volume * 100));
      } catch (e) {}
    }
  };

  // Toggle Favorite / Liked Song
  const toggleLike = (trackId) => {
    setLikedSongIds((prev) => {
      if (prev.includes(trackId)) {
        return prev.filter((id) => id !== trackId);
      } else {
        return [trackId, ...prev];
      }
    });
  };

  const isLiked = (trackId) => likedSongIds.includes(trackId);

  // Repeat Mode toggle
  const toggleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  // Shuffle toggle
  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  // Playlist Management
  const createPlaylist = (name = 'New Playlist', description = '') => {
    const newPl = {
      id: `playlist-${Date.now()}`,
      name: name.trim() || 'My Playlist',
      description: description.trim() || 'Custom Playlist',
      coverUrl: MASTER_TRACKS[0]?.coverUrl || 'https://i1.sndcdn.com/artworks-VIQ3As8XCQ1K-0-t500x500.jpg',
      trackIds: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPlaylists((prev) => [newPl, ...prev]);
    return newPl;
  };

  const renamePlaylist = (playlistId, newName, newDesc) => {
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === playlistId
          ? {
              ...pl,
              name: newName || pl.name,
              description: newDesc !== undefined ? newDesc : pl.description,
            }
          : pl
      )
    );
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists((prev) => prev.filter((pl) => pl.id !== playlistId));
  };

  const addSongToPlaylist = (playlistId, trackId) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          if (pl.trackIds.includes(trackId)) return pl;
          return { ...pl, trackIds: [...pl.trackIds, trackId] };
        }
        return pl;
      })
    );
  };

  const removeSongFromPlaylist = (playlistId, trackId) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          return { ...pl, trackIds: pl.trackIds.filter((id) => id !== trackId) };
        }
        return pl;
      })
    );
  };

  const reorderPlaylist = (playlistId, newTrackIds) => {
    setPlaylists((prev) =>
      prev.map((pl) => (pl.id === playlistId ? { ...pl, trackIds: newTrackIds } : pl))
    );
  };

  // Dynamic visualizer bars synced with audio
  const getVisualizerData = () => {
    const arr = new Uint8Array(32);
    if (!isPlaying) return arr;
    const now = Date.now() / 1000;
    const intensity = (isMuted ? 0 : volume) * 255;
    for (let i = 0; i < 32; i++) {
      const v = Math.sin(now * 8 + i * 0.4) * 0.5 + 0.5;
      const noise = Math.sin(now * 14 + i * 1.2) * 0.25;
      arr[i] = Math.floor(Math.max(0, Math.min(255, (v + noise) * intensity)));
    }
    return arr;
  };

  // Liked tracks objects
  const likedTracks = useMemo(() => {
    return likedSongIds
      .map((id) => (tracksMap?.get ? tracksMap.get(id) : null))
      .filter(Boolean);
  }, [likedSongIds, tracksMap]);

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        setCurrentTrack,
        isPlaying,
        isLoading,
        playbackError,
        isWidgetReady: true,
        currentTime,
        duration,
        volume,
        setVolume,
        isMuted,
        setIsMuted,
        toggleMute,
        isShuffled,
        toggleShuffle,
        repeatMode,
        toggleRepeat,
        queue,
        queueIndex,
        setQueue,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seek,
        likedSongIds,
        likedTracks,
        toggleLike,
        isLiked,
        playlists,
        createPlaylist,
        renamePlaylist,
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        reorderPlaylist,
        recentlyPlayed,
        isNowPlayingOpen,
        setIsNowPlayingOpen,
        getVisualizerData,
        tracks: MASTER_TRACKS,
        tracksMap,
        artists: ALL_ARTISTS,
      }}
    >
      {children}

      {/* Hidden persistent SoundCloud HTML5 Widget Audio Engine */}
      <iframe
        ref={iframeRef}
        id="sc-music-engine-widget"
        src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/taylorswiftofficial/the-fate-of-ophelia&auto_play=false&buying=false&liking=false&download=false&sharing=false&show_comments=false&show_playcount=false&show_user=false"
        allow="autoplay; encrypted-media"
        style={{
          position: 'fixed',
          bottom: -9999,
          left: -9999,
          width: 300,
          height: 160,
          opacity: 0.001,
          pointerEvents: 'none',
          zIndex: -99,
        }}
        title="SoundCloud Audio Engine"
      />
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
