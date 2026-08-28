'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { calculateProgressSummary, calculateSubjectProgress } from '@/lib/progressCalculator';
import { BarChart3, TrendingUp, Award, Flame, Code2, GraduationCap, Sparkles, BookOpen } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

export default function AnalyticsPage() {
  const { state } = useAppStore();
  const summary = calculateProgressSummary(state.subjects, state.projects);

  const universitySubjects = state.subjects.filter((s) => s.category === 'university');

  // Subject Progress Bar Data
  const subjectProgressData = universitySubjects.map((s) => {
    const { percentage } = calculateSubjectProgress(s);
    return {
      name: s.code,
      fullName: s.name,
      percentage,
      fill: s.color,
    };
  });

  // DSA Categories Problem Count
  const dsaCatMap: Record<string, number> = {};
  state.dsaProblems.forEach((p) => {
    dsaCatMap[p.category] = (dsaCatMap[p.category] || 0) + (p.status === 'SOLVED' ? 1 : 0);
  });

  const dsaCategoryData = Object.entries(dsaCatMap).map(([cat, count]) => ({
    name: cat,
    solved: count,
  }));

  // Study hours past 7 days mock data
  const studyHoursData = [
    { day: 'Mon', hours: 4.5 },
    { day: 'Tue', hours: 5.0 },
    { day: 'Wed', hours: 6.2 },
    { day: 'Thu', hours: 4.8 },
    { day: 'Fri', hours: 5.5 },
    { day: 'Sat', hours: 7.0 },
    { day: 'Sun', hours: 6.5 },
  ];

  // Overall Breakdown Pie Data
  const pieData = [
    { name: 'University Academics', value: summary.academicProgress, color: '#06b6d4' },
    { name: 'Industry Skills', value: summary.industryProgress, color: '#10b981' },
    { name: 'Projects', value: summary.projectProgress, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              LEARNING INTELLIGENCE
            </span>
            <span className="text-xs font-semibold text-slate-400">Strict Mathematical Metrics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <BarChart3 className="w-8 h-8 text-indigo-400" />
            <span>Progress Analytics & Performance Insights</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Data-backed visibility into study hours, university curriculum coverage, coding milestones, and discipline streaks.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Progress</span>
          <span className="text-3xl font-black text-white mt-1 block">{summary.overallProgress}%</span>
          <span className="text-[11px] text-indigo-400 mt-0.5 block font-mono">Weighted Learning OS</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">University Topics</span>
          <span className="text-3xl font-black text-cyan-400 mt-1 block">
            {summary.completedUniversityTopics}/{summary.totalUniversityTopics}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block font-mono">
            {summary.academicProgress}% Completed
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">DSA Solved</span>
          <span className="text-3xl font-black text-emerald-400 mt-1 block">
            {state.dsaProblems.filter((p) => p.status === 'SOLVED').length} / {state.dsaProblems.length}
          </span>
          <span className="text-[11px] text-emerald-400 mt-0.5 block font-mono">Target: 100+ Problems</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Streak</span>
          <span className="text-3xl font-black text-amber-400 mt-1 block">{state.currentStreak} Days 🔥</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block font-mono">
            Longest: {state.longestStreak} Days
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Subject Mastery Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>University Subject Mastery (%)</span>
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                  {subjectProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Study Hours Weekly Area Trend */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Weekly Study Hours Trend</span>
            </h3>
            <span className="text-xs font-mono text-indigo-300">Target: 35 hrs/wk</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="studyHoursGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#studyHoursGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
