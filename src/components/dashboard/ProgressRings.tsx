'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { calculateProgressSummary, calculateDailyCompletionRate } from '@/lib/progressCalculator';
import { GraduationCap, Sparkles, FolderGit2, CheckCircle2 } from 'lucide-react';
import { ProgressBar } from '@/components/common/ProgressBar';

export const ProgressRings: React.FC = () => {
  const { state } = useAppStore();
  const summary = calculateProgressSummary(state.subjects, state.projects);
  const todayTasks = state.dailyTasks.filter((t) => t.date === new Date().toISOString().split('T')[0]);
  const todayCompletion = calculateDailyCompletionRate(todayTasks);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Overall Progress */}
      <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 relative overflow-hidden group glass-card-hover">
        <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Progress</span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
            Weighted
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold text-white">{summary.overallProgress}%</span>
          <span className="text-xs text-slate-400">Total Learning OS</span>
        </div>
        <ProgressBar percentage={summary.overallProgress} color="#6366f1" height="md" />
        <div className="mt-3 flex justify-between items-center text-[11px] text-slate-400">
          <span>50% Academics + 30% Industry + 20% Projects</span>
        </div>
      </div>

      {/* 2. University Academic Progress */}
      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 relative overflow-hidden group glass-card-hover">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            University Syllabus
          </span>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {summary.completedUniversityTopics}/{summary.totalUniversityTopics}
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold text-white">{summary.academicProgress}%</span>
          <span className="text-xs text-slate-400">7 Ganpat Univ Subjects</span>
        </div>
        <ProgressBar percentage={summary.academicProgress} color="#06b6d4" height="md" />
        <div className="mt-3 flex justify-between items-center text-[11px] text-slate-400">
          <span>ADP1, DADM, IWD1, ITS, CS1, IDE, ES</span>
        </div>
      </div>

      {/* 3. Industry / Career Skills */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 relative overflow-hidden group glass-card-hover">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Industry Skills
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {summary.completedIndustryTopics}/{summary.totalIndustryTopics}
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold text-white">{summary.industryProgress}%</span>
          <span className="text-xs text-slate-400">Real Developer Skills</span>
        </div>
        <ProgressBar percentage={summary.industryProgress} color="#10b981" height="md" />
        <div className="mt-3 flex justify-between items-center text-[11px] text-slate-400">
          <span>C Mastery, Web Dev, Git, Linux, DSA</span>
        </div>
      </div>

      {/* 4. Today's Mission Completion */}
      <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 relative overflow-hidden group glass-card-hover">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            Today's Mission
          </span>
          <span className="text-xs font-mono font-bold text-amber-400">
            {todayTasks.filter((t) => t.status === 'completed').length}/{todayTasks.length} Tasks
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-extrabold text-white">{todayCompletion}%</span>
          <span className="text-xs text-slate-400">Min 70% for streak 🔥</span>
        </div>
        <ProgressBar percentage={todayCompletion} color="#f59e0b" height="md" />
        <div className="mt-3 flex justify-between items-center text-[11px] text-slate-400">
          <span>{todayCompletion >= 70 ? 'Streak Safe & Locked! 🔥' : 'Complete 70%+ to keep streak'}</span>
        </div>
      </div>
    </div>
  );
};
