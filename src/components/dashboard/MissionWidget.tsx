'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { CheckCircle2, Circle, GraduationCap, Code2, Sparkles, FolderGit2, BookOpen, Clock, Plus } from 'lucide-react';
import Link from 'next/link';

export const MissionWidget: React.FC = () => {
  const { state, toggleTask } = useAppStore();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = state.dailyTasks.filter((t) => t.date === todayStr);

  const categoryIcons: Record<string, any> = {
    university: GraduationCap,
    coding: Code2,
    industry: Sparkles,
    project: FolderGit2,
    revision: BookOpen,
  };

  const categoryColors: Record<string, { badge: string; text: string }> = {
    university: { badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30', text: 'text-cyan-400' },
    coding: { badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', text: 'text-emerald-400' },
    industry: { badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30', text: 'text-indigo-400' },
    project: { badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30', text: 'text-rose-400' },
    revision: { badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30', text: 'text-amber-400' },
  };

  // Group today's tasks by category
  const categories = ['university', 'coding', 'project', 'revision'] as const;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>🎯 TODAY'S MISSION</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-normal">
              {todayTasks.filter((t) => t.status === 'completed').length} / {todayTasks.length} Done
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click tasks to complete. Each completion permanently updates progress, streaks, subject percentages, and awards XP.
          </p>
        </div>
        <Link
          href="/planner"
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-indigo-300 border border-slate-800 transition-colors flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Edit Planner</span>
        </Link>
      </div>

      <div className="space-y-4">
        {todayTasks.length > 0 ? (
          todayTasks.map((task) => {
            const Icon = categoryIcons[task.category] || CheckCircle2;
            const style = categoryColors[task.category] || categoryColors.university;
            const isDone = task.status === 'completed';

            return (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                  isDone
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400 opacity-80'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-800/60 text-white'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    type="button"
                    className={`p-1 rounded-lg transition-transform group-hover:scale-110 flex-shrink-0 ${
                      isDone ? 'text-emerald-400' : 'text-slate-500 group-hover:text-indigo-400'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5 fill-emerald-400/20" /> : <Circle className="w-5 h-5" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-mono font-bold ${style.badge}`}>
                        {task.category}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {task.timeBlock}
                      </span>
                    </div>
                    <div className={`text-xs font-semibold mt-1 truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {task.title}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/20">
                    +{task.xpAwarded} XP
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            No tasks found for today. Open Daily Planner to generate or add tasks.
          </div>
        )}
      </div>
    </div>
  );
};
