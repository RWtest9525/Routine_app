'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { ProgressRings } from '@/components/dashboard/ProgressRings';
import { MissionWidget } from '@/components/dashboard/MissionWidget';
import { DailyScheduleWidget } from '@/components/dashboard/DailyScheduleWidget';
import { BacklogWidget } from '@/components/dashboard/BacklogWidget';
import { Flame, Sparkles, GraduationCap, Timer, Bot, ArrowRight, Send, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { state } = useAppStore();
  const router = useRouter();
  const [quickInput, setQuickInput] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    router.push(`/coach?q=${encodeURIComponent(quickInput)}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900/80 to-slate-950/70 border border-indigo-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              GANPAT UNIVERSITY • BCA SEM-1
            </span>
            {state.profile.isExamMode && (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                EXAM FOCUS
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            GOOD MORNING, YASH <span className="inline-block animate-wave">👋</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            6-Month Master Plan: 28 Aug 2026 → 28 Feb 2027 • Outcode and outwork the competition every single day.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/timer"
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <Timer className="w-4 h-4" />
            <span>Launch Focus Timer</span>
          </Link>
          <Link
            href="/coach"
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>Gemini AI Coach</span>
          </Link>
        </div>
      </div>

      {/* WhatsApp-style Natural Language AI Command Bar */}
      <div className="glass-panel p-3.5 rounded-2xl border border-indigo-500/30 shadow-lg">
        <form onSubmit={handleQuickSubmit} className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-cyan-300 flex-shrink-0">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <input
            type="text"
            placeholder="Ask Gemini AI: 'Aaj ka plan bana', 'ADP1 kitna complete hai?', 'K-map padha do', 'Aaj ka test lo'..."
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!quickInput.trim()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* 1. Quick Stats Counters */}
      <StatsOverview />

      {/* 2. Multi-Tier Progress Rings */}
      <ProgressRings />

      {/* 3. Backlog Alert Banner */}
      <BacklogWidget />

      {/* 4. Core Grid: Today's Mission & Optimal Routine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MissionWidget />
        </div>
        <div>
          <DailyScheduleWidget />
        </div>
      </div>
    </div>
  );
}
