'use client';

import React from 'react';
import { Subject } from '@/lib/types';
import { calculateSubjectProgress } from '@/lib/progressCalculator';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Code, Database, Globe, HardDrive, MessageSquare, Cpu, Leaf, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

interface SubjectCardProps {
  subject: Subject;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  const {
    percentage,
    totalTopics,
    completedTopics,
    currentUnitTitle,
    currentTopicTitle,
    nextTopicTitle,
  } = calculateSubjectProgress(subject);

  const iconMap: Record<string, any> = {
    Code,
    Database,
    Globe,
    HardDrive,
    MessageSquare,
    Cpu,
    Leaf,
  };

  const IconComponent = iconMap[subject.iconName] || Code;

  return (
    <Link
      href={`/subjects/${subject.id}`}
      className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 group flex flex-col justify-between glass-card-hover relative overflow-hidden"
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none transition-all group-hover:opacity-25"
        style={{ backgroundColor: subject.color }}
      />

      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0"
              style={{ backgroundColor: `${subject.color}25`, border: `1px solid ${subject.color}50` }}
            >
              <IconComponent className="w-5 h-5" style={{ color: subject.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-white">
                  {subject.code}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{subject.credits} Credits</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors line-clamp-1">
                {subject.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Progress Bar & Ratio */}
        <div className="my-4">
          <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
            <span className="text-slate-400">
              {completedTopics} / {totalTopics} Topics
            </span>
            <span className="font-bold text-white">{percentage}%</span>
          </div>
          <ProgressBar percentage={percentage} color={subject.color} height="md" />
        </div>

        {/* Current & Next Topic Insights */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Current Focus
            </span>
            <p className="text-slate-200 font-medium truncate mt-0.5">{currentTopicTitle}</p>
          </div>
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
              <ChevronRight className="w-3 h-3" /> Next Up
            </span>
            <p className="text-slate-400 text-[11px] truncate mt-0.5">{nextTopicTitle}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-indigo-300 transition-colors">
        <span className="text-[11px]">{subject.units.length} Units hierarchy</span>
        <div className="flex items-center gap-1 font-semibold text-indigo-400">
          <span>Open Subject</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
