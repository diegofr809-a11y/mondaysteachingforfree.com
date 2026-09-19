import React from 'react';
import {
  Play,
  Plus,
  Star,
  Gamepad2,
  Trash2,
  Search,
  X,
  MessageSquarePlus,
} from 'lucide-react';

export const GameGrid = ({
  games,
  selectedCategory,
  searchQuery,
  onClearSearch,
  onPlayGame,
  onOpenAddGame,
  onOpenRequestsWithTitle,
  onToggleFavorite,
  onDeleteGame,
}) => {
  // Filter games based on selected category and search query
  const filteredGames = games.filter((game) => {
    if (selectedCategory !== 'all' && game.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = game.title.toLowerCase().includes(q);
      const matchCat = game.category.toLowerCase().includes(q);
      const matchTags = game.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCat && !matchTags) return false;
    }
    return true;
  });

  const categoryName =
    selectedCategory === 'all'
      ? 'All Games'
      : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);

  const PLACEHOLDER_SLOTS = Array.from({ length: 16 }, (_, i) => ({
    id: `placeholder-slot-${i + 1}`,
    slotNumber: i + 1,
  }));

  return (
    <div className="w-full select-none" id="game-grid-container">
      {/* Search Filtering Notification Bar */}
      {searchQuery && (
        <div className="flex items-center justify-between p-2 mb-2 bg-[#141720] border border-[#222733] rounded-xs text-xs">
          <div className="flex items-center gap-1.5 text-[#8592a8]">
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Search results for <strong className="text-white">"{searchQuery}"</strong> ({filteredGames.length} found)
            </span>
          </div>
          <button
            onClick={onClearSearch}
            className="text-xs text-[#556075] hover:text-white flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      )}

      {/* When search returned 0 results */}
      {searchQuery && filteredGames.length === 0 ? (
        <div className="p-6 bg-[#111319] border border-[#222733] rounded-xs text-center my-2">
          <div className="w-8 h-8 mx-auto rounded-xs bg-[#161a22] border border-[#262c3a] flex items-center justify-center text-[#556075] mb-2">
            <Search className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white mb-1">
            No games found matching "{searchQuery}"
          </h3>
          <p className="text-[11px] text-[#6b7994] max-w-sm mx-auto mb-3">
            This title is not in the library yet. You can request it or link a custom web game.
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onOpenRequestsWithTitle(searchQuery)}
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xs transition-colors"
            >
              <MessageSquarePlus className="w-3 h-3" />
              <span>Request "{searchQuery}"</span>
            </button>
            <button
              onClick={onOpenAddGame}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#161a22] hover:bg-[#1f2430] text-white border border-[#262c3a] text-xs font-bold rounded-xs transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add Custom Game</span>
            </button>
            <button
              onClick={onClearSearch}
              className="px-2 py-1 text-xs text-[#6b7994] hover:text-white"
            >
              Clear
            </button>
          </div>
        </div>
      ) : games.length === 0 ? (
        /* Empty state placeholders */
        <div className="space-y-2.5">
          <div className="p-2.5 bg-[#111319] border border-[#222733] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-xs bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Gamepad2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  {categoryName} — Library Clean Slate
                </span>
                <span className="text-[11px] text-[#6b7994] ml-2 hidden md:inline">
                  Click any slot below or the "Add Game" button to link web games.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={onOpenAddGame}
                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xs transition-colors flex items-center gap-1"
                id="empty-state-add-game-btn"
              >
                <Plus className="w-3 h-3" />
                <span>Add Game URL</span>
              </button>
              <button
                onClick={() => onOpenRequestsWithTitle('')}
                className="px-2.5 py-1 bg-[#161a22] hover:bg-[#1f2430] text-[#8592a8] hover:text-white text-xs font-semibold rounded-xs border border-[#262c3a] transition-colors flex items-center gap-1"
              >
                <MessageSquarePlus className="w-3 h-3" />
                <span>Request Title</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
            {PLACEHOLDER_SLOTS.map((slot) => (
              <div
                key={slot.id}
                onClick={onOpenAddGame}
                className="group bg-[#111319] hover:bg-[#151922] border border-[#202533] hover:border-emerald-500/50 rounded-xs p-1.5 cursor-pointer transition-colors flex flex-col justify-between"
                id={`game-placeholder-${slot.slotNumber}`}
                title="Empty slot - Click to add custom game URL"
              >
                <div className="w-full aspect-video bg-[#0d0f15] border border-[#1a1f2c] group-hover:border-emerald-500/30 rounded-xs flex flex-col items-center justify-center text-center p-1 relative overflow-hidden transition-colors">
                  <div className="w-5 h-5 rounded-xs bg-[#161a24] flex items-center justify-center text-[#4a5568] group-hover:text-emerald-400 transition-colors mb-0.5">
                    <Plus className="w-3 h-3" />
                  </div>
                  <span className="text-[9px] font-mono font-bold text-[#4a5568] group-hover:text-emerald-300">
                    SLOT #{slot.slotNumber < 10 ? `0${slot.slotNumber}` : slot.slotNumber}
                  </span>
                </div>

                <div className="mt-1.5">
                  <div className="flex items-center justify-between text-[9px] text-[#4a5568]">
                    <span className="uppercase font-bold">Unassigned</span>
                    <span className="font-mono">Open</span>
                  </div>
                  <h4 className="text-xs font-semibold text-[#718096] group-hover:text-white truncate mt-0.5 transition-colors">
                    Empty Slot
                  </h4>
                </div>

                <div className="mt-1.5 pt-1 border-t border-[#1a1f2c] flex items-center justify-between">
                  <span className="text-[10px] text-[#424d60]">+ Add</span>
                  <div className="w-4 h-4 rounded-xs bg-[#161a24] text-[#4a5568] group-hover:bg-emerald-500 group-hover:text-black flex items-center justify-center transition-colors">
                    <Play className="w-2 h-2 fill-current ml-0.2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Populated games cards grid */
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6b7994] px-0.5">
            <span className="font-bold text-white uppercase">{categoryName} ({filteredGames.length})</span>
            <span>Click card to play in browser</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                onClick={() => onPlayGame(game)}
                className="group bg-[#111319] hover:bg-[#151922] border border-[#202533] hover:border-emerald-500/60 rounded-xs p-1.5 cursor-pointer transition-colors flex flex-col justify-between"
                id={`game-card-${game.id}`}
              >
                <div className="w-full aspect-video bg-[#0d0f15] border border-[#1a1f2c] rounded-xs flex items-center justify-center relative overflow-hidden">
                  {game.thumbnailUrl ? (
                    <img
                      src={game.thumbnailUrl}
                      alt={game.title}
                      className="w-full h-full object-cover filter brightness-[0.92] contrast-[0.98] group-hover:brightness-100 transition-all"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-[#556075] group-hover:text-emerald-400 transition-colors">
                      <Gamepad2 className="w-5 h-5" />
                    </div>
                  )}

                  <span className="absolute top-1 left-1 text-[8px] font-black uppercase px-1 rounded-xs bg-black/80 text-emerald-400 border border-white/10">
                    {game.category}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(game.id);
                    }}
                    className="absolute top-1 right-1 p-0.5 rounded-xs bg-black/60 hover:bg-black text-[#556075] hover:text-amber-400 transition-colors"
                    title="Favorite"
                  >
                    <Star
                      className={`w-2.5 h-2.5 ${game.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`}
                    />
                  </button>
                </div>

                <div className="mt-1.5">
                  <div className="flex items-center justify-between text-[9px] text-emerald-400 font-bold uppercase">
                    <span>{game.category}</span>
                    <span className="font-mono text-[#556075]">{game.plays} plays</span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 truncate mt-0.5 transition-colors">
                    {game.title}
                  </h4>
                </div>

                <div className="mt-1.5 pt-1 border-t border-[#1a1f2c] flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteGame(game.id);
                    }}
                    className="text-[#4a5568] hover:text-red-400 text-[10px] transition-colors"
                    title="Delete game"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>

                  <div className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-400 group-hover:text-emerald-300">
                    <span>PLAY</span>
                    <div className="w-3.5 h-3.5 rounded-xs bg-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black flex items-center justify-center transition-colors">
                      <Play className="w-2 h-2 fill-current ml-0.2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
