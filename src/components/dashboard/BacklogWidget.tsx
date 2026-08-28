'use client';

import React from 'react';
import { AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

export const BacklogWidget: React.FC = () => {
  const { state } = useAppStore();
  const todayStr = new Date().toISOString().split('T')[0];

  // Backlog = pending tasks from previous days
  const backlogTasks = state.dailyTasks.filter((t) => t.status === 'pending' && t.date < todayStr);

  if (backlogTasks.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/25 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-300">Zero Academic Backlog! 🎉</div>
            <div className="text-[11px] text-slate-400">You are 100% on track with Ganpat University & Industry goals.</div>
          </div>
        </div>
      </div>
    );
  }

  const highPriority = backlogTasks.filter((t) => t.priority === 'high');
  const mediumPriority = backlogTasks.filter((t) => t.priority === 'medium');

  return (
    <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-amber-200">
              {backlogTasks.length} Pending Tasks in Backlog
            </h4>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 font-mono">
              Smart Redistribution
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            🔴 {highPriority.length} High Priority • 🟡 {mediumPriority.length} Medium Priority. Backlog is gently spread across upcoming days to avoid overload.
          </p>
        </div>
      </div>

      <Link
        href="/planner"
        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0"
      >
        <span>Manage Backlog</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
