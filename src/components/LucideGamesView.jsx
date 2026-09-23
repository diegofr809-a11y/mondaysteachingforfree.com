import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Star,
  Play,
  ExternalLink,
  Trash2,
  Gamepad2,
  Dices,
  Flame,
} from 'lucide-react';
import { openAboutBlankCloaked } from '../utils/cloak';
import { handleGameImageError, getPlaceholderGameThumbnail } from '../utils/imageFallback';

const POPULAR_KEYWORDS = [
  'retro bowl', 'slope', '1v1.lol', 'cookie clicker', 'subway surfers', 'bitlife',
  'drive mad', 'paper.io', 'crossy road', 'moto x3m', 'basketball stars', 'run 3',
  'geometry dash', 'tunnel rush', 'flappy bird', 'smash karts', 'vex', 'snow rider',
  'roblox', 'fortnite', 'minecraft', 'eaglercraft', 'cluster rush', 'ovo', 'drift hunters',
  'fireboy', 'watergirl', 'random', 'duck life', 'tiny fishing', 'getaway shootout',
  'rooftop snipers', 'happy wheels', 'mario', 'temple run', 'stickman hook', 'monkey mart',
  'idle breakout', 'blumgi', 'pac-man', 'tetris', 'chess', '2048', 'fnaf', 'five nights',
  'baldi', 'friday night funkin', 'fnf', 'krunker', 'shell shockers', 'agar.io', 'slither.io',
  'diep.io', 'zombs royale', 'cut the rope', 'doodle jump', 'tag', 'space waves',
  'drift boss', 'basketbros', 'stickman', 'poly track', 'yohoho', 'paper minecraft',
  'funny shooter', 'time shooter', 'red ball', 'gunspin', 'madalin stunt cars'
];

const isGamePopular = (game) => {
  if (game.isPopular) return true;
  if ((game.plays || 0) >= 150) return true;
  if ((game.rating || 0) >= 4.3) return true;
  const t = (game.title || '').toLowerCase();
  return POPULAR_KEYWORDS.some((kw) => t.includes(kw));
};

export const LucideGamesView = ({
  games = [],
  onPlayGame,
  onOpenAddGame,
  onToggleFavorite,
  onDeleteGame,
  initialFilter = 'all',
}) => {
  const [activeTab, setActiveTab] = useState(initialFilter); // 'all' | 'popular' | 'favorites'
  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState(72);
  const [failedImages, setFailedImages] = useState({});

  // Filter games based on active tab and search
  const filteredGames = useMemo(() => {
    let list = games.filter((game) => {
      const matchesTab =
        activeTab === 'all'
          ? true
          : activeTab === 'popular'
          ? isGamePopular(game)
          : activeTab === 'favorites'
          ? game.isFavorite
          : true;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        game.title?.toLowerCase().includes(q) ||
        (game.category && game.category.toLowerCase().includes(q));

      return matchesTab && matchesSearch;
    });

    if (activeTab === 'popular') {
      list = [...list].sort((a, b) => (b.plays || 0) - (a.plays || 0));
    }

    return list;
  }, [games, activeTab, searchQuery]);

  const visibleGames = filteredGames.slice(0, displayLimit);

  const handleRandomPlay = () => {
    if (filteredGames.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredGames.length);
      onPlayGame(filteredGames[randomIndex]);
    }
  };

  const handleGameClick = (game) => {
    onPlayGame(game);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto px-4 sm:px-6 py-6 lucide-bg select-none">
      <div className="max-w-7xl mx-auto space-y-4 pb-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-color)] shadow-md">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">
                  Games
                </h2>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] text-[11px] font-semibold">
                  <span>{filteredGames.length}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomPlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] transition-all cursor-pointer"
              title="Pick a random game"
            >
              <Dices className="w-4 h-4 text-[var(--accent-color)]" />
              <span>Random</span>
            </button>

            <button
              onClick={onOpenAddGame}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-color)] hover:opacity-90 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Game</span>
            </button>
          </div>
        </div>

        {/* Search & Tabs Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { id: 'all', label: 'All Games', icon: Gamepad2 },
              { id: 'popular', label: 'Most Popular', icon: Flame },
              { id: 'favorites', label: 'Favorites', icon: Star },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setDisplayLimit(72);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--accent-color)] text-white shadow-xs'
                      : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <IconComp
                    className={`w-3.5 h-3.5 ${
                      tab.id === 'popular' && isSelected ? 'text-amber-300' : ''
                    } ${tab.id === 'favorites' && isSelected ? 'fill-white text-white' : ''}`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="w-full h-9 pl-9 pr-3 bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] focus:bg-[var(--bg-hover)] border border-[var(--border-color)] focus:border-[var(--accent-color)] rounded-lg text-xs text-[var(--text-main)] placeholder-[var(--text-dim)] outline-none transition-all"
            />
          </div>
        </div>

        {/* Games Grid */}
        <div className="pt-2">
          {visibleGames.length === 0 ? (
            <div className="text-center py-16 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2">
              <Gamepad2 className="w-10 h-10 text-[var(--text-dim)] mx-auto" />
              <h3 className="text-sm font-semibold text-[var(--text-main)]">
                No games found
              </h3>
              <p className="text-xs text-[var(--text-dim)]">
                Try searching for another title or switch tabs.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {visibleGames.map((game) => (
                <div
                  key={game.id}
                  className="group bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-white/20 rounded-xl p-2 flex flex-col transition-all duration-200 shadow-sm relative overflow-hidden"
                >
                  {/* Thumbnail area */}
                  <div
                    onClick={() => handleGameClick(game)}
                    className="w-full aspect-video rounded-lg bg-[#14141a] border border-[var(--border-color)] relative flex items-center justify-center cursor-pointer overflow-hidden"
                  >
                    <img
                      src={(game.thumbnailUrl || game.thumbnail) || getPlaceholderGameThumbnail(game.title, game.category)}
                      alt={game.title}
                      className="w-full h-full object-cover filter brightness-[0.92] contrast-[0.98] group-hover:brightness-100 transition-all duration-200"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleGameImageError(e, game.title, game.category)}
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center shadow-md">
                        <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Info & Actions */}
                  <div className="mt-2 flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-1">
                      <h4
                        className="text-xs font-medium truncate text-[var(--text-main)] group-hover:text-white transition-colors cursor-pointer"
                        onClick={() => handleGameClick(game)}
                        title={game.title}
                      >
                        {game.title}
                      </h4>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(game.id);
                        }}
                        className="text-[var(--text-dim)] hover:text-amber-400 p-0.5 cursor-pointer"
                        title="Favorite"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            game.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Bottom status/actions bar */}
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-dim)] mt-1.5 pt-1.5 border-t border-[var(--border-color)]">
                      <span className="capitalize">{game.category || 'Game'}</span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAboutBlankCloaked(game.url, game.title);
                          }}
                          className="text-[var(--text-dim)] hover:text-[var(--text-main)] p-0.5 cursor-pointer"
                          title="Fullscreen in a new tab"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        {game.isCustom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteGame(game.id);
                            }}
                            className="text-[var(--text-dim)] hover:text-red-400 p-0.5 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredGames.length > displayLimit && (
            <div className="flex justify-center py-6">
              <button
                onClick={() => setDisplayLimit((prev) => prev + 72)}
                className="px-5 py-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] shadow-sm transition-all cursor-pointer"
              >
                Load More ({displayLimit} of {filteredGames.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
