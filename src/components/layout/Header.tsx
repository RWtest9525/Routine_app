'use client';

import React, { useState, useEffect } from 'react';
import { Search, Flame, Bell, Sparkles, GraduationCap, ShieldAlert } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { CommandPalette } from './CommandPalette';
import { requestBrowserNotificationPermission, sendBrowserNotification } from '@/lib/notificationEngine';

export const Header: React.FC = () => {
  const { state, toggleExamMode } = useAppStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTestNotification = async () => {
    const perm = await requestBrowserNotificationPermission();
    if (perm === 'granted') {
      sendBrowserNotification({
        title: '🚀 Yash BCA Learning OS Active',
        body: 'Browser notifications are synchronized and working perfectly!',
      });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 w-full h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between">
        {/* Left: Quick Search Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs transition-all shadow-inner"
          >
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Search subjects, topics, tasks, notes...</span>
            <span className="sm:hidden">Search...</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-slate-950 rounded border border-slate-700 text-slate-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Real-time clock, Streak, Exam Mode Toggle, Notifications */}
        <div className="flex items-center gap-3">
          {/* Live Digital Clock */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-mono text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            {currentTime || '08:15 AM'}
          </div>

          {/* Streak Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold shadow-sm">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-bounce" />
            <span>{state.currentStreak}d</span>
          </div>

          {/* Exam Mode Toggle */}
          <button
            onClick={toggleExamMode}
            title={state.profile.isExamMode ? 'Disable Exam Mode' : 'Enable Exam Mode'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              state.profile.isExamMode
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg shadow-rose-950/50'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <GraduationCap className={`w-4 h-4 ${state.profile.isExamMode ? 'text-rose-400' : ''}`} />
            <span className="hidden md:inline">{state.profile.isExamMode ? 'Exam Mode ON' : 'Exam Mode'}</span>
          </button>

          {/* Notification Button */}
          <button
            onClick={handleTestNotification}
            title="Test Browser Notification"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-indigo-300 border border-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Profile Mini Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-indigo-500/20">
              YV
            </div>
          </div>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
