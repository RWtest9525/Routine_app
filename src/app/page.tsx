'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, GraduationCap, Flame, ArrowRight, BookOpen, Code2, ShieldCheck, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { calculateProgressSummary } from '@/lib/progressCalculator';

export default function WelcomePage() {
  const { state } = useAppStore();
  const summary = calculateProgressSummary(state.subjects, state.projects);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-indigo-500/30 max-w-3xl w-full shadow-2xl relative overflow-hidden text-center">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ganpat University • BCA 1st Semester</span>
        </div>

        {/* Main Greeting */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
          Welcome Yash <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
          Your personal 3-year BCA Learning Operating System is configured, persistent, and synchronized with your Ganpat University Semester-I Master Plan.
        </p>

        {/* Snapshot Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8 text-left">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Semester</span>
            <span className="text-sm font-extrabold text-white mt-0.5 block">Semester I</span>
            <span className="text-[10px] text-indigo-400 font-mono">Active</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">6-Month Roadmap</span>
            <span className="text-sm font-extrabold text-white mt-0.5 block">184 Days</span>
            <span className="text-[10px] text-cyan-400 font-mono">28 Aug – 28 Feb</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">University Subjects</span>
            <span className="text-sm font-extrabold text-white mt-0.5 block">7 Subjects</span>
            <span className="text-[10px] text-emerald-400 font-mono">ADP1, DADM, IWD1...</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Industry Skills</span>
            <span className="text-sm font-extrabold text-white mt-0.5 block">12+ Tracks</span>
            <span className="text-[10px] text-amber-400 font-mono">C, Web, DSA, SQL...</span>
          </div>
        </div>

        {/* Core Principles */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-left text-xs text-slate-300 space-y-2 mb-8">
          <div className="flex items-center gap-2 text-indigo-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Operating System Rules</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            • Strict separation between 🎓 University Academic Syllabus and 🚀 Industry Skills.
            <br />
            • 4-Stage True Mastery: Topics complete only when Learned, Practiced, Recalled, and Tested.
            <br />
            • All progress, notes, streak records, and study sessions are automatically saved and persistent.
          </p>
        </div>

        {/* CTA Launch */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-sm transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group"
          >
            <span>START DAY 1 MISSION</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/subjects"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-sm font-semibold transition-colors"
          >
            Explore 7 Subjects
          </Link>
        </div>
      </div>
    </div>
  );
}
