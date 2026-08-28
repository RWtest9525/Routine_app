'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { calculateSubjectProgress } from '@/lib/progressCalculator';
import { UnitAccordion } from '@/components/subjects/UnitAccordion';
import { TopicModal } from '@/components/subjects/TopicModal';
import { Topic } from '@/lib/types';
import { ProgressBar } from '@/components/common/ProgressBar';
import { ArrowLeft, BookOpen, Clock, Award, Sparkles, HelpCircle, Code, Database, Globe, HardDrive, MessageSquare, Cpu, Leaf } from 'lucide-react';
import Link from 'next/link';

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state } = useAppStore();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const subjectId = params.id as string;
  const subject = state.subjects.find((s) => s.id === subjectId);

  if (!subject) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Subject Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">The requested subject does not exist in your curriculum.</p>
        <Link
          href="/subjects"
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
        >
          Back to Subjects
        </Link>
      </div>
    );
  }

  const { percentage, totalTopics, completedTopics, inProgressTopics, needsRevisionTopics } =
    calculateSubjectProgress(subject);

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {subject.code}
            </span>
            <span className="text-xs text-slate-400 font-medium">{subject.credits} Academic Credits</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            {subject.name}
          </h2>
        </div>
      </div>

      {/* Hero Stats Card */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: subject.color }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed">{subject.description}</p>
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                <span className="text-slate-400">
                  {completedTopics} of {totalTopics} Topics Completed
                </span>
                <span className="font-bold text-white text-sm">{percentage}%</span>
              </div>
              <ProgressBar percentage={percentage} color={subject.color} height="lg" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-center">
            <div className="p-2">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Done</span>
              <span className="text-lg font-bold text-emerald-400">{completedTopics}</span>
            </div>
            <div className="p-2 border-x border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Active</span>
              <span className="text-lg font-bold text-cyan-400">{inProgressTopics}</span>
            </div>
            <div className="p-2">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Revise</span>
              <span className="text-lg font-bold text-amber-400">{needsRevisionTopics}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Units & Topics Accordion */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Units & Topic Hierarchy</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">{subject.units.length} Units</span>
        </div>

        <div className="space-y-4">
          {subject.units.map((unit) => (
            <UnitAccordion
              key={unit.id}
              unit={unit}
              subjectCode={subject.code}
              subjectColor={subject.color}
              onSelectTopic={(topic) => setSelectedTopic(topic)}
            />
          ))}
        </div>
      </div>

      {/* Topic Detail Modal */}
      <TopicModal
        topic={selectedTopic}
        subjectCode={subject.code}
        isOpen={Boolean(selectedTopic)}
        onClose={() => setSelectedTopic(null)}
      />
    </div>
  );
}
