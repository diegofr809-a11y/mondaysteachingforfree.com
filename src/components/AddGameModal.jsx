import React, { useState } from 'react';
import { CATEGORIES } from '../data/initialData';
import { X, Plus, Sparkles } from 'lucide-react';

export const AddGameModal = ({ isOpen, onClose, onAddGame }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('arcade');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    const newGame = {
      id: `game-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      category,
      url: finalUrl,
      description: description.trim() || 'Custom linked web game.',
      addedAt: new Date().toISOString(),
      plays: 0,
      rating: 5.0,
      isCustom: true,
    };

    onAddGame(newGame);
    onClose();

    // Reset
    setTitle('');
    setUrl('');
    setDescription('');
    setError('');
  };

  const loadPreset = (t, c, u, d) => {
    setTitle(t);
    setCategory(c);
    setUrl(u);
    setDescription(d);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="bg-[#100d1e] border border-[#251f3b] rounded-xl max-w-md w-full p-5 space-y-3.5 text-xs shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#1c172f]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1e1738] border border-[#302559] flex items-center justify-center text-purple-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm tracking-tight">
                Add Custom Game
              </h3>
              <p className="text-[11px] text-[#716a8d]">Link any HTML5 or open-source web game</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#645d7d] hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick test presets */}
        <div className="p-2.5 rounded-lg bg-[#141026] border border-[#231d3b]">
          <div className="flex items-center gap-1 text-[#787196] font-semibold text-[10px] mb-1.5 uppercase">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Quick test examples (Open-source canvas games):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() =>
                loadPreset(
                  '2048 Puzzle',
                  'puzzle',
                  'https://play2048.co',
                  'Classic open-source sliding number puzzle'
                )
              }
              className="px-2.5 py-1 rounded-md bg-[#1d163a] hover:bg-[#251c4a] text-[#cfcbdc] border border-[#2e2358] text-[11px] transition-colors"
            >
              2048 Puzzle
            </button>
            <button
              type="button"
              onClick={() =>
                loadPreset(
                  'Hextris',
                  'arcade',
                  'https://hextris.io',
                  'Open-source fast-paced hexagonal puzzle'
                )
              }
              className="px-2.5 py-1 rounded-md bg-[#1d163a] hover:bg-[#251c4a] text-[#cfcbdc] border border-[#2e2358] text-[11px] transition-colors"
            >
              Hextris
            </button>
            <button
              type="button"
              onClick={() =>
                loadPreset(
                  'Sandspiel Sandbox',
                  'other',
                  'https://sandspiel.club',
                  'Interactive falling sand physics sandbox'
                )
              }
              className="px-2.5 py-1 rounded-md bg-[#1d163a] hover:bg-[#251c4a] text-[#cfcbdc] border border-[#2e2358] text-[11px] transition-colors"
            >
              Sandspiel
            </button>
          </div>
        </div>

        {error && (
          <div className="p-2 rounded-md bg-red-950/40 border border-red-800/40 text-red-300 text-[11px]">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-[#716a8d] uppercase tracking-wider mb-1">
              Game Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2048, Hextris..."
              className="w-full px-3 py-2 bg-[#0e0b1c] text-white rounded-md border border-[#251f3b] focus:outline-none focus:border-purple-500/70"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold text-[#716a8d] uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-2 bg-[#0e0b1c] text-white rounded-md border border-[#251f3b] focus:outline-none focus:border-purple-500/70"
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#716a8d] uppercase tracking-wider mb-1">
                Game URL *
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-[#0e0b1c] text-white font-mono rounded-md border border-[#251f3b] focus:outline-none focus:border-purple-500/70"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#716a8d] uppercase tracking-wider mb-1">
              Short Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary..."
              className="w-full px-3 py-2 bg-[#0e0b1c] text-white rounded-md border border-[#251f3b] focus:outline-none focus:border-purple-500/70"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#1c172f]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#716a8d] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-md shadow-md transition-colors"
            >
              Save Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
