'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { DsaProblem } from '@/lib/types';
import { Code2, Plus, Search, ExternalLink, CheckCircle2, Circle, Star, AlertCircle, Sparkles } from 'lucide-react';
import { Modal } from '@/components/common/Modal';

export default function DsaPage() {
  const { state, updateDsaProblem, addDsaProblem } = useAppStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New problem form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Arrays');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [newSource, setNewSource] = useState('LeetCode');
  const [newUrl, setNewUrl] = useState('');

  const categories = [
    'All',
    'Arrays',
    'Strings',
    'Searching',
    'Sorting',
    'Linked Lists',
    'Stack',
    'Queue',
    'Hashing',
    'Recursion',
    'Complexity',
  ];

  const filteredProblems = state.dsaProblems.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesDiff && matchesSearch;
  });

  const solvedCount = state.dsaProblems.filter((p) => p.status === 'SOLVED').length;
  const successRate =
    state.dsaProblems.length > 0 ? Math.round((solvedCount / state.dsaProblems.length) * 100) : 0;

  const handleToggleSolved = (problem: DsaProblem) => {
    const nextStatus = problem.status === 'SOLVED' ? 'ATTEMPTED' : 'SOLVED';
    updateDsaProblem(problem.id, {
      status: nextStatus,
      attempts: problem.attempts + (nextStatus === 'SOLVED' ? 1 : 0),
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addDsaProblem({
      title: newTitle,
      category: newCategory,
      difficulty: newDifficulty,
      source: newSource,
      status: 'NOT_ATTEMPTED',
      attempts: 0,
      confidence: 3,
      url: newUrl || undefined,
    });

    setNewTitle('');
    setNewUrl('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              ALGORITHMIC EXCELLENCE
            </span>
            <span className="text-xs font-semibold text-slate-400">10 Core Categories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <Code2 className="w-8 h-8 text-indigo-400" />
            <span>DSA & Problem Solving Tracker</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Track coding problems across LeetCode, GeeksForGeeks, CodeChef, and Ganpat University Lab practicals.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Problem</span>
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 rounded-2xl border border-indigo-500/20">
          <span className="text-xs text-slate-400 block font-medium">Total Problems</span>
          <span className="text-2xl font-bold text-white mt-1 block">{state.dsaProblems.length}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20">
          <span className="text-xs text-slate-400 block font-medium">Solved</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block">{solvedCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20">
          <span className="text-xs text-slate-400 block font-medium">Success Rate</span>
          <span className="text-2xl font-bold text-cyan-400 mt-1 block">{successRate}%</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/20">
          <span className="text-xs text-slate-400 block font-medium">Needs Revision</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 block">
            {state.dsaProblems.filter((p) => p.status === 'NEEDS_REVISION').length}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search problem title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Table / List */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/60">
        {filteredProblems.length > 0 ? (
          filteredProblems.map((prob) => {
            const isSolved = prob.status === 'SOLVED';

            return (
              <div
                key={prob.id}
                className="p-4 hover:bg-slate-900/60 transition-colors flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => handleToggleSolved(prob)}
                    className="flex-shrink-0 text-slate-500 hover:text-indigo-400 transition-colors"
                  >
                    {isSolved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    ) : prob.status === 'NEEDS_REVISION' ? (
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isSolved ? 'line-through text-slate-400' : 'text-white'}`}>
                        {prob.title}
                      </span>
                      {prob.url && (
                        <a
                          href={prob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-cyan-400"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5 text-[11px] text-slate-400 mt-1 font-mono">
                      <span className="text-indigo-400">{prob.category}</span>
                      <span>•</span>
                      <span>Source: {prob.source}</span>
                      <span>•</span>
                      <span>{prob.attempts} Attempts</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold ${
                      prob.difficulty === 'Easy'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : prob.difficulty === 'Medium'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {prob.difficulty}
                  </span>

                  <div className="hidden sm:flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        onClick={() => updateDsaProblem(prob.id, { confidence: s })}
                        className={`w-3.5 h-3.5 cursor-pointer ${
                          s <= (prob.confidence || 3) ? 'fill-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-xs text-slate-400">
            No problems found matching the selected filters.
          </div>
        )}
      </div>

      {/* Add Problem Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add DSA / Coding Problem"
        subtitle="Log a new coding problem into your master practice list"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Problem Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Reverse Linked List (Iterative)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {categories.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Difficulty</label>
              <select
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Source</label>
              <input
                type="text"
                placeholder="e.g. LeetCode, CodeChef, Lab"
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Problem URL (Optional)</label>
              <input
                type="url"
                placeholder="https://leetcode.com/problems/..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              Add Problem
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
