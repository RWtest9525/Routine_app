'use client';

import React from 'react';
import { PomodoroTimer } from '@/components/timer/PomodoroTimer';
import { Timer, Zap, ShieldCheck, Flame, BookOpen } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function TimerPage() {
  const { state } = useAppStore();

  const totalFocusMinutes = state.studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Deep Work Engine</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Deep Focus Study Timer
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Eliminate distractions. Log every 25m Pomodoro or 50m Deep Work block directly into your subject analytics.
        </p>
      </div>

      {/* Main Timer */}
      <PomodoroTimer />

      {/* Focus Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-medium block">Total Focus Time</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">
            {(totalFocusMinutes / 60).toFixed(1)} hrs
          </span>
          <span className="text-[11px] text-slate-500 font-mono">{totalFocusMinutes} mins recorded</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-medium block">Total Sessions</span>
          <span className="text-2xl font-extrabold text-cyan-400 mt-1 block">
            {state.studySessions.length} Blocks
          </span>
          <span className="text-[11px] text-slate-500 font-mono">100% focused time</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-medium block">XP Earned from Timer</span>
          <span className="text-2xl font-extrabold text-amber-400 mt-1 block">
            {Math.round(totalFocusMinutes * 0.5)} XP
          </span>
          <span className="text-[11px] text-slate-500 font-mono">+0.5 XP / min study</span>
        </div>
      </div>
    </div>
  );
}
