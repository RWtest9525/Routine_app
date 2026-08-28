'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, GraduationCap, Code2, FolderGit2, BookOpen, CheckSquare, X, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { state } = useAppStore();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const results: Array<{
      id: string;
      title: string;
      category: string;
      subtitle: string;
      icon: any;
      action: () => void;
    }> = [];

    // Search Subjects & Topics
    state.subjects.forEach((sub) => {
      if (sub.name.toLowerCase().includes(q) || sub.code.toLowerCase().includes(q)) {
        results.push({
          id: sub.id,
          title: `${sub.code} — ${sub.name}`,
          category: 'University Subject',
          subtitle: `${sub.units.length} Units • ${sub.category}`,
          icon: GraduationCap,
          action: () => router.push(`/subjects/${sub.id}`),
        });
      }
      sub.units.forEach((u) => {
        u.topics.forEach((t) => {
          if (t.title.toLowerCase().includes(q)) {
            results.push({
              id: t.id,
              title: t.title,
              category: `${sub.code} Topic`,
              subtitle: `Unit ${u.unitNumber}: ${u.title}`,
              icon: BookOpen,
              action: () => router.push(`/subjects/${sub.id}`),
            });
          }
        });
      });
    });

    // Search Daily Tasks
    state.dailyTasks.forEach((task) => {
      if (task.title.toLowerCase().includes(q)) {
        results.push({
          id: task.id,
          title: task.title,
          category: 'Daily Task',
          subtitle: `${task.timeBlock} • ${task.category}`,
          icon: CheckSquare,
          action: () => router.push('/planner'),
        });
      }
    });

    // Search DSA Problems
    state.dsaProblems.forEach((prob) => {
      if (prob.title.toLowerCase().includes(q) || prob.category.toLowerCase().includes(q)) {
        results.push({
          id: prob.id,
          title: prob.title,
          category: `DSA (${prob.category})`,
          subtitle: `Difficulty: ${prob.difficulty} • Status: ${prob.status}`,
          icon: Code2,
          action: () => router.push('/dsa'),
        });
      }
    });

    // Search Projects
    state.projects.forEach((proj) => {
      if (proj.title.toLowerCase().includes(q) || proj.description.toLowerCase().includes(q)) {
        results.push({
          id: proj.id,
          title: proj.title,
          category: 'Project',
          subtitle: `${proj.status} • Stack: ${proj.techStack.join(', ')}`,
          icon: FolderGit2,
          action: () => router.push('/projects'),
        });
      }
    });

    // Search Notes
    state.notes.forEach((note) => {
      if (note.title.toLowerCase().includes(q) || note.contentMarkdown.toLowerCase().includes(q)) {
        results.push({
          id: note.id,
          title: note.title,
          category: `Note (${note.subjectCode})`,
          subtitle: `Tags: ${note.tags.join(', ')}`,
          icon: BookOpen,
          action: () => router.push('/notes'),
        });
      }
    });

    return results.slice(0, 15);
  }, [query, state, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            type="text"
            placeholder="Search subjects, topics (e.g. Loops, K-map), tasks, projects, notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {searchResults.length > 0 ? (
            searchResults.map((res) => {
              const Icon = res.icon;
              return (
                <div
                  key={res.id}
                  onClick={() => {
                    res.action();
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-600/15 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-indigo-200">
                        {res.title}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-indigo-400 font-medium">{res.category}</span>
                        <span>•</span>
                        <span className="truncate">{res.subtitle}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
              );
            })
          ) : query.trim() ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching items found for <span className="text-indigo-300">"{query}"</span>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Type to instantly search across all 7 BCA subjects, topics, daily missions, notes, and DSA problems.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tip: Press ESC to close</span>
          <span>Yash BCA Learning OS</span>
        </div>
      </div>
    </div>
  );
};
