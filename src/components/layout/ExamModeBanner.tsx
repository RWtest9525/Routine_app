'use client';

import React from 'react';
import { GraduationCap, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

export const ExamModeBanner: React.FC = () => {
  const { state } = useAppStore();

  if (!state.profile.isExamMode) return null;

  return (
    <div className="mx-4 lg:mx-8 mt-4 p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900/90 to-amber-950/70 border border-rose-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-200">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
          <GraduationCap className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-extrabold text-white tracking-tight">
              🎓 EXAM MODE ACTIVE — University Academic Priority #1
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/30 text-rose-300 border border-rose-500/40">
              HIGH PRIORITY
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Industry development workload is reduced. Study schedule is optimized for Ganpat University syllabus revision, K-map/C/SQL mock tests, and previous year examination question practice.
          </p>
        </div>
      </div>
      <Link
        href="/tests"
        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/30 flex items-center gap-1.5 flex-shrink-0"
      >
        <span>Open Unit Tests & Practice</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
