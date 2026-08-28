'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck2,
  GraduationCap,
  Sparkles,
  Code2,
  FolderGit2,
  CalendarDays,
  Timer,
  BarChart3,
  BookOpen,
  HelpCircle,
  FileText,
  Settings,
  Bot,
  Layers,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { calculateLevelFromXp } from '@/lib/gamificationEngine';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { state } = useAppStore();
  const { level, title } = calculateLevelFromXp(state.totalXp);

  const mainNavItems = [
    { href: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
    { href: '/planner', label: "Today's Mission", icon: CalendarCheck2 },
    { href: '/subjects', label: 'University Subjects', icon: GraduationCap },
    { href: '/industry', label: 'Industry Skills', icon: Sparkles },
    { href: '/dsa', label: 'DSA & Coding Tracker', icon: Code2 },
    { href: '/projects', label: 'Project Portfolio', icon: FolderGit2 },
    { href: '/timer', label: 'Study Focus Timer', icon: Timer },
    { href: '/calendar', label: 'Master Calendar', icon: CalendarDays },
    { href: '/analytics', label: 'Learning Analytics', icon: BarChart3 },
    { href: '/notes', label: 'Notes & Knowledge', icon: BookOpen },
    { href: '/tests', label: 'Tests & Mock Exams', icon: HelpCircle },
    { href: '/reviews', label: 'Weekly Reviews', icon: FileText },
    { href: '/coach', label: 'AI Study Coach', icon: Bot },
    { href: '/syllabus-manager', label: 'Syllabus Manager', icon: Layers },
    { href: '/settings', label: 'OS Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-slate-950/90 backdrop-blur-xl border-r border-slate-800/80 z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300 text-lg">
                Y
              </span>
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
              YASH BCA <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">OS</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-400">Ganpat Univ • Sem I</p>
          </div>
        </Link>
      </div>

      {/* Gamification Level Status */}
      {state.profile.gamificationEnabled && (
        <div className="mx-4 my-3 p-3 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900/60 border border-indigo-500/20">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-indigo-300 flex items-center gap-1">
              <span className="text-amber-400">Lv. {level}</span> • {title}
            </span>
            <span className="font-mono text-[10px] text-slate-400">{state.totalXp} XP</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${(state.totalXp % 500) / 5}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
              {state.currentStreak} Day Streak
            </span>
            <span className="text-slate-400 text-[10px]">
              {state.profile.isExamMode ? '🎓 Exam Mode' : '⚡ Normal'}
            </span>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/30 to-indigo-600/10 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-950/50 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="truncate">Yash Vishal (BCA-1)</span>
        <span className="font-mono text-[10px] text-indigo-400">2026–27</span>
      </div>
    </aside>
  );
};
