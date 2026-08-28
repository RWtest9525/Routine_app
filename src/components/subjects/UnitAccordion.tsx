'use client';

import React, { useState } from 'react';
import { Unit, Topic } from '@/lib/types';
import { isTopicCompleted, calculateTopicMasteryPercentage } from '@/lib/progressCalculator';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Clock, Star, BookOpen, AlertCircle } from 'lucide-react';
import { ProgressBar } from '@/components/common/ProgressBar';

interface UnitAccordionProps {
  unit: Unit;
  subjectCode: string;
  subjectColor: string;
  onSelectTopic: (topic: Topic) => void;
}

export const UnitAccordion: React.FC<UnitAccordionProps> = ({
  unit,
  subjectCode,
  subjectColor,
  onSelectTopic,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const totalTopics = unit.topics.length;
  const completedTopics = unit.topics.filter(isTopicCompleted).length;
  const unitPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden transition-all mb-4">
      {/* Unit Header Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-slate-900/60 hover:bg-slate-900 cursor-pointer flex items-center justify-between gap-4 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl font-mono font-bold text-xs flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${subjectColor}20`, color: subjectColor, border: `1px solid ${subjectColor}40` }}
          >
            U{unit.unitNumber}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              Unit {unit.unitNumber}: {unit.title}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{unit.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="hidden sm:flex flex-col items-end w-28">
            <div className="flex items-center gap-2 text-xs font-mono mb-1">
              <span className="text-slate-400">
                {completedTopics}/{totalTopics}
              </span>
              <span className="font-bold text-white">{unitPercentage}%</span>
            </div>
            <ProgressBar percentage={unitPercentage} color={subjectColor} height="sm" />
          </div>

          <div className="p-1 rounded-lg text-slate-400 hover:text-white">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Topics List */}
      {isOpen && (
        <div className="p-3 bg-slate-950/40 divide-y divide-slate-800/60">
          {unit.topics.map((topic) => {
            const isDone = isTopicCompleted(topic);
            const masteryScore = calculateTopicMasteryPercentage(topic);

            return (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className="p-3 rounded-xl hover:bg-slate-900/80 cursor-pointer flex items-center justify-between gap-3 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    className="flex-shrink-0 text-slate-500 group-hover:text-indigo-400 transition-colors"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    ) : topic.status === 'NEEDS_REVISION' ? (
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${isDone ? 'text-slate-300 line-through' : 'text-white'}`}>
                        {topic.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {topic.estimatedHours}h est.
                      </span>
                      <span>•</span>
                      <span>{topic.practiceProblems.length} Problems</span>
                      <span>•</span>
                      <span>{topic.recallQuestions.length} Recalls</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* 4-Stage Mastery Mini Badges */}
                  <div className="hidden md:flex items-center gap-1">
                    {[
                      { label: 'L', done: topic.learnedDone, title: 'Learned' },
                      { label: 'P', done: topic.practiceDone, title: 'Practiced' },
                      { label: 'R', done: topic.recallDone, title: 'Recall' },
                      { label: 'T', done: topic.testDone, title: 'Tested' },
                    ].map((st, i) => (
                      <span
                        key={i}
                        title={st.title}
                        className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold ${
                          st.done
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-900 text-slate-600 border border-slate-800'
                        }`}
                      >
                        {st.label}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(topic.confidence || 3)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
