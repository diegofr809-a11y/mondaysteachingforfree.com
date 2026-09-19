import React from 'react';
import { CATEGORIES } from '../data/initialData';
import { CategoryIcon } from './CategoryIcon';
import { Star, Plus, MessageSquarePlus } from 'lucide-react';

export const CategoryBar = ({
  selectedCategory,
  onSelectCategory,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  favoritesCount,
  gamesCountByCategory,
  onOpenAddGame,
  onOpenRequests,
}) => {
  return (
    <div className="bg-[#111319] border border-[#222733] rounded-xs p-1.5 mb-3 select-none text-xs">
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        {/* Category Buttons List */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          {CATEGORIES.map((cat) => {
            const isActive = !showFavoritesOnly && selectedCategory === cat.id;
            const count = gamesCountByCategory[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (showFavoritesOnly) onToggleFavoritesOnly();
                  onSelectCategory(cat.id);
                }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#1d222e] text-emerald-400 border border-emerald-500/30'
                    : 'text-[#8592a8] hover:text-white hover:bg-[#161a22] border border-transparent'
                }`}
                id={`cat-filter-${cat.id}`}
              >
                <CategoryIcon
                  name={cat.icon}
                  className={`w-3 h-3 ${isActive ? 'text-emerald-400' : 'text-[#58647a]'}`}
                />
                <span>{cat.name}</span>
                {count > 0 && (
                  <span className="text-[10px] font-mono px-1 py-0.2 rounded-xs bg-[#242b3a] text-[#8592a8]">
                    {count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Favorites filter toggle */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-xs font-semibold whitespace-nowrap transition-colors ${
              showFavoritesOnly
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-[#8592a8] hover:text-white hover:bg-[#161a22] border border-transparent'
            }`}
            title="Show favorite games"
          >
            <Star
              className={`w-3 h-3 ${showFavoritesOnly ? 'text-amber-400 fill-amber-400' : 'text-[#58647a]'}`}
            />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="text-[10px] font-mono px-1 py-0.2 rounded-xs bg-[#242b3a] text-[#8592a8]">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>

        {/* Right side quick actions */}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          <button
            onClick={onOpenAddGame}
            className="flex items-center gap-1 px-2 py-1 rounded-xs bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add Game</span>
          </button>
          <button
            onClick={onOpenRequests}
            className="flex items-center gap-1 px-2 py-1 rounded-xs bg-[#161a22] hover:bg-[#1d222e] text-[#8592a8] hover:text-white border border-[#262c3a] font-semibold text-xs transition-colors"
          >
            <MessageSquarePlus className="w-3 h-3" />
            <span>Request</span>
          </button>
        </div>
      </div>
    </div>
  );
};
