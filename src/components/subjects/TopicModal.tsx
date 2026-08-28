'use client';

import React, { useState } from 'react';
import { Topic, TopicStatus } from '@/lib/types';
import { Modal } from '@/components/common/Modal';
import { useAppStore } from '@/lib/store';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Star,
  CheckSquare,
  Clock,
  Youtube,
  FileText,
  Save,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface TopicModalProps {
  topic: Topic | null;
  subjectCode: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TopicModal: React.FC<TopicModalProps> = ({ topic, subjectCode, isOpen, onClose }) => {
  const { updateTopicMastery, togglePracticeProblem, saveNote } = useAppStore();

  const [notesText, setNotesText] = useState(topic?.notesMarkdown || '');
  const [activeTab, setActiveTab] = useState<'mastery' | 'practice' | 'recall' | 'notes'>('mastery');

  if (!topic) return null;

  const handleStageToggle = (stage: 'learned' | 'practice' | 'recall' | 'test') => {
    const keyMap = {
      learned: 'learnedDone',
      practice: 'practiceDone',
      recall: 'recallDone',
      test: 'testDone',
    } as const;

    const currentVal = topic[keyMap[stage]];
    updateTopicMastery(topic.id, {
      [keyMap[stage]]: !currentVal,
    });
  };

  const handleStatusChange = (status: TopicStatus) => {
    updateTopicMastery(topic.id, { status });
  };

  const handleConfidenceChange = (rating: number) => {
    updateTopicMastery(topic.id, { confidence: rating });
  };

  const handleSaveNotes = () => {
    updateTopicMastery(topic.id, { notesMarkdown: notesText });
    saveNote({
      subjectCode,
      topicId: topic.id,
      title: `${subjectCode} — ${topic.title} Notes`,
      contentMarkdown: notesText,
      tags: [subjectCode, 'Topic Notes'],
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={topic.title}
      subtitle={`${subjectCode} • Estimated Time: ${topic.estimatedHours} hrs`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Status & Confidence Controls */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Topic Status
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'NEEDS_REVISION'] as TopicStatus[]).map((st) => {
                const isCurrent = topic.status === st;
                return (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isCurrent
                        ? st === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-950/50'
                          : st === 'NEEDS_REVISION'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                          : st === 'IN_PROGRESS'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Self Confidence
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleConfidenceChange(star)}
                  className="p-1 rounded hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= topic.confidence ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4-Stage Mastery Verification */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-950/60 border border-indigo-500/20">
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            4-Stage True Mastery Checklist
          </h4>
          <p className="text-[11px] text-slate-400 mb-3">
            Do not mark a topic completed merely from watching a video. Verify that you have learned, coded/practiced, recalled, and tested it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'learned', label: '1. Learned Concept Deeply', done: topic.learnedDone },
              { id: 'practice', label: '2. Practiced / Coded Hands-on', done: topic.practiceDone },
              { id: 'recall', label: '3. Can Explain & Active Recall', done: topic.recallDone },
              { id: 'test', label: '4. Tested / Problem Solved', done: topic.testDone },
            ].map((stage) => (
              <button
                key={stage.id}
                onClick={() => handleStageToggle(stage.id as any)}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                  stage.done
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{stage.label}</span>
                {stage.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-2">
          {[
            { id: 'mastery', label: 'Resources & Docs', icon: BookOpen },
            { id: 'practice', label: `Practice (${topic.practiceProblems.length})`, icon: CheckSquare },
            { id: 'recall', label: `Recall Check (${topic.recallQuestions.length})`, icon: HelpCircle },
            { id: 'notes', label: 'Topic Notes', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'mastery' && (
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-300">Curated Learning Resources</h5>
            {topic.resources.length > 0 ? (
              topic.resources.map((res) => (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 flex items-center justify-between text-xs font-medium text-white transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    {res.type === 'youtube' ? (
                      <Youtube className="w-4 h-4 text-red-400" />
                    ) : (
                      <ExternalLink className="w-4 h-4 text-cyan-400" />
                    )}
                    <span>{res.title}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </a>
              ))
            ) : (
              <p className="text-xs text-slate-500">No resources linked for this topic yet.</p>
            )}
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-slate-300">Targeted Practice Problems</h5>
            {topic.practiceProblems.map((prob) => (
              <div
                key={prob.id}
                onClick={() => togglePracticeProblem(topic.id, prob.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between gap-3 transition-all ${
                  prob.isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                    : 'bg-slate-900/60 border-slate-800 text-white hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {prob.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                  <span className={prob.isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}>
                    {prob.title}
                  </span>
                </div>
                {prob.difficulty && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold flex-shrink-0 ${
                      prob.difficulty === 'Easy'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : prob.difficulty === 'Medium'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {prob.difficulty}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recall' && (
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-300">Active Recall Questions (Feynman Technique)</h5>
            {topic.recallQuestions.map((rq, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="text-xs font-bold text-indigo-300 flex items-start gap-2">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-500/30">
                    Q{idx + 1}
                  </span>
                  <span>{rq.question}</span>
                </div>
                {rq.hint && (
                  <div className="text-[11px] text-slate-400 pl-7">
                    <span className="text-slate-500">Key Hint:</span> {rq.hint}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-slate-300">Personal Notes (Markdown Supported)</h5>
              <button
                onClick={handleSaveNotes}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
            <textarea
              rows={6}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Write your key takeaways, syntax snippets, formulas, or tricky edge cases..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 font-mono"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
