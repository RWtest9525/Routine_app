'use client';

import React from 'react';
import { defaultDailyScheduleBlocks } from '@/data/initialTimetable';
import { Clock, Utensils, GraduationCap, Code2, BookOpen, Coffee, Sun } from 'lucide-react';

export const DailyScheduleWidget: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'meal':
        return <Utensils className="w-3.5 h-3.5 text-amber-400" />;
      case 'college':
        return <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />;
      case 'break':
        return <Coffee className="w-3.5 h-3.5 text-rose-400" />;
      case 'study':
        return <Code2 className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <Sun className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const getStyle = (type: string) => {
    switch (type) {
      case 'meal':
        return 'border-amber-500/20 bg-amber-950/10 text-amber-300';
      case 'college':
        return 'border-cyan-500/20 bg-cyan-950/20 text-cyan-300';
      case 'break':
        return 'border-rose-500/20 bg-rose-950/10 text-rose-300';
      case 'study':
        return 'border-indigo-500/25 bg-indigo-950/20 text-indigo-200 font-semibold';
      default:
        return 'border-slate-800 bg-slate-900/40 text-slate-400';
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>Optimal Daily Routine (8:30 AM – 12:00 AM)</span>
        </h3>
        <span className="text-[11px] text-slate-500 font-mono">College 8:30–12:30</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
        {defaultDailyScheduleBlocks.map((block, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition-colors ${getStyle(
              block.type
            )}`}
          >
            <div className="p-1.5 rounded-lg bg-slate-900/80 flex-shrink-0">{getIcon(block.type)}</div>
            <div className="min-w-0">
              <div className="font-mono text-[10px] opacity-75">{block.time}</div>
              <div className="text-[11px] truncate font-medium">{block.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
