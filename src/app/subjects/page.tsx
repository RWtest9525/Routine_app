'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { SubjectCard } from '@/components/subjects/SubjectCard';
import { GraduationCap, Sparkles, BookOpen, Layers, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function SubjectsPage() {
  const { state } = useAppStore();
  const universitySubjects = state.subjects.filter((s) => s.category === 'university');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              SEMESTER I • ACADEMIC ROADMAP
            </span>
            <span className="text-xs font-semibold text-slate-400">7 Core Subjects</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <GraduationCap className="w-8 h-8 text-indigo-400" />
            <span>Ganpat University Academic Subjects</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Exact syllabus hierarchy from your Ganpat University BCA Semester-I Master Plan. Progress is strictly computed from verified completed units and topics.
          </p>
        </div>

        <Link
          href="/syllabus-manager"
          className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Manage / Add Semesters</span>
        </Link>
      </div>

      {/* University Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {universitySubjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>

      {/* Academic Integrity Note */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>
            University academic percentages reflect true topic completion. Industry skills are tracked separately to maintain rigorous academic grading clarity.
          </span>
        </div>
      </div>
    </div>
  );
}
