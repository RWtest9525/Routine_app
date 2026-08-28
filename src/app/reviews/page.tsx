'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { calculateProgressSummary } from '@/lib/progressCalculator';
import { FileText, Save, CheckCircle2, Trophy, Clock, ArrowRight, History } from 'lucide-react';
import { format, startOfWeek } from 'date-fns';

export default function ReviewsPage() {
  const { state, saveWeeklyReview } = useAppStore();
  const summary = calculateProgressSummary(state.subjects, state.projects);

  const [wins, setWins] = useState('');
  const [struggles, setStruggles] = useState('');
  const [improvements, setImprovements] = useState('');
  const [priority1, setPriority1] = useState('');
  const [priority2, setPriority2] = useState('');
  const [priority3, setPriority3] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    const currentWeekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');

    saveWeeklyReview({
      weekStartDate: currentWeekStart,
      studyHours: 32,
      codingHours: 14,
      topicsCompleted: summary.completedUniversityTopics,
      problemsSolved: state.dsaProblems.filter((p) => p.status === 'SOLVED').length,
      projectsProgress: `${summary.projectProgress}% overall`,
      universityProgress: summary.academicProgress,
      industryProgress: summary.industryProgress,
      whatWentWell: wins,
      whatWasDifficult: struggles,
      whatShouldImprove: improvements,
      weakTopics: [],
      nextWeekPriorities: [priority1, priority2, priority3].filter(Boolean),
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <FileText className="w-8 h-8 text-indigo-400" />
          <span>Sunday Weekly Reflection & Strategy Review</span>
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Review weekly metrics, document wins and roadblocks, and set top 3 academic priorities for the upcoming week.
        </p>
      </div>

      {/* Snapshot of Weekly Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 rounded-2xl border border-indigo-500/20 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Academic Progress</span>
          <span className="text-2xl font-bold text-white mt-1 block">{summary.academicProgress}%</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Industry Progress</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block">{summary.industryProgress}%</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Active Streak</span>
          <span className="text-2xl font-bold text-cyan-400 mt-1 block">{state.currentStreak} Days 🔥</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-amber-500/20 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Experience (XP)</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 block">{state.totalXp} XP</span>
        </div>
      </div>

      {/* Reflection Form */}
      <form onSubmit={handleSaveReview} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-200 block mb-1.5">
              1. What went exceptionally well this week? (Wins & Breakthroughs)
            </label>
            <textarea
              rows={3}
              value={wins}
              onChange={(e) => setWins(e.target.value)}
              placeholder="e.g. Mastered C nested loops, completed Unit 1 of Digital Electronics, solved 5 array problems."
              className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-200 block mb-1.5">
              2. What was difficult or caused hesitation? (Friction points)
            </label>
            <textarea
              rows={3}
              value={struggles}
              onChange={(e) => setStruggles(e.target.value)}
              placeholder="e.g. Struggled with Don't Care conditions in 4-variable K-maps; missed Thursday coding sprint due to fatigue."
              className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-200 block mb-1.5">
              3. What single adjustment will make next week more productive?
            </label>
            <textarea
              rows={2}
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              placeholder="e.g. Start 2:00 PM deep study block on time without phone in room."
              className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Next Week's Top 3 Priorities */}
          <div>
            <label className="text-xs font-bold text-indigo-300 block mb-2">
              Next Week's 3 Non-Negotiable Priorities
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={priority1}
                onChange={(e) => setPriority1(e.target.value)}
                placeholder="1. e.g. Finish ADP1 Unit 3 Pattern Printing problems"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                value={priority2}
                onChange={(e) => setPriority2(e.target.value)}
                placeholder="2. e.g. Build interactive CLI Calculator milestone in C"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                value={priority3}
                onChange={(e) => setPriority3(e.target.value)}
                placeholder="3. e.g. Complete DADM ER Diagram & Relational normalization practice"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-xs text-emerald-400 font-semibold font-mono">
            {isSaved && '✓ Weekly review saved permanently! (+50 XP)'}
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Weekly Review</span>
          </button>
        </div>
      </form>

      {/* Review History */}
      {state.weeklyReviews.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            <span>Saved Review Logs</span>
          </h3>

          <div className="space-y-3">
            {state.weeklyReviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-400 font-mono">
                  <span className="text-indigo-400 font-bold">Week of {rev.weekStartDate}</span>
                  <span>{format(new Date(rev.createdAt), 'PPpp')}</span>
                </div>
                {rev.whatWentWell && (
                  <p className="text-slate-200">
                    <span className="text-emerald-400 font-bold">Wins:</span> {rev.whatWentWell}
                  </p>
                )}
                {rev.whatWasDifficult && (
                  <p className="text-slate-300">
                    <span className="text-amber-400 font-bold">Difficulties:</span> {rev.whatWasDifficult}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
