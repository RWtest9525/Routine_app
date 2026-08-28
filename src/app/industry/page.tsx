'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { SubjectCard } from '@/components/subjects/SubjectCard';
import { UnitAccordion } from '@/components/subjects/UnitAccordion';
import { TopicModal } from '@/components/subjects/TopicModal';
import { Topic } from '@/lib/types';
import { Sparkles, Terminal, Globe, GitBranch, TerminalSquare, ShieldCheck, Plus } from 'lucide-react';

export default function IndustryPage() {
  const { state } = useAppStore();
  const industrySubjects = state.subjects.filter((s) => s.category === 'industry');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [activeSubjectId, setActiveSubjectId] = useState<string>(industrySubjects[0]?.id || '');

  const activeSubject = industrySubjects.find((s) => s.id === activeSubjectId) || industrySubjects[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              CAREER & DEVELOPER ROADMAP
            </span>
            <span className="text-xs font-semibold text-slate-400">Isolated from academic credits</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <Sparkles className="w-8 h-8 text-emerald-400" />
            <span>Industry & Practical Engineering Skills</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Real-world developer competencies: Advanced C Systems, Modern ES6+ Web Architecture, Professional Git/GitHub workflows, Linux CLI, and Database indexing.
          </p>
        </div>
      </div>

      {/* Track Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {industrySubjects.map((sub) => {
          const isActive = activeSubject?.id === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSubjectId(sub.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-500/50'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{sub.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Track Detail & Units */}
      {activeSubject && (
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30">
            <h3 className="text-base font-extrabold text-white">{activeSubject.name}</h3>
            <p className="text-xs text-slate-300 mt-1">{activeSubject.description}</p>
          </div>

          <div className="space-y-4">
            {activeSubject.units.map((unit) => (
              <UnitAccordion
                key={unit.id}
                unit={unit}
                subjectCode={activeSubject.code}
                subjectColor={activeSubject.color}
                onSelectTopic={(topic) => setSelectedTopic(topic)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Topic Mastery Modal */}
      <TopicModal
        topic={selectedTopic}
        subjectCode={activeSubject?.code || 'IND'}
        isOpen={Boolean(selectedTopic)}
        onClose={() => setSelectedTopic(null)}
      />
    </div>
  );
}
