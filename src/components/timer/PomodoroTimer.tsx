'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { Play, Pause, RotateCcw, CheckCircle2, Clock, Flame, BookOpen } from 'lucide-react';
import { sendBrowserNotification } from '@/lib/notificationEngine';
import confetti from 'canvas-confetti';

export const PomodoroTimer: React.FC = () => {
  const { state, addStudySession, awardXp } = useAppStore();

  const [mode, setMode] = useState<'25' | '50' | 'custom'>('25');
  const [customMinutes, setCustomMinutes] = useState(30);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(state.subjects[0]?.id || '');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initialDurationRef = useRef(25 * 60);

  const selectedSubject = state.subjects.find((s) => s.id === selectedSubjectId) || state.subjects[0];
  const subjectTopics = selectedSubject?.units.flatMap((u) => u.topics) || [];

  const handleModeSwitch = (newMode: '25' | '50' | 'custom') => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setMode(newMode);
    let seconds = 25 * 60;
    if (newMode === '50') seconds = 50 * 60;
    if (newMode === 'custom') seconds = customMinutes * 60;
    setTimeLeft(seconds);
    initialDurationRef.current = seconds;
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleSessionComplete = () => {
    const durationMins = Math.round(initialDurationRef.current / 60);
    addStudySession({
      subjectId: selectedSubject.id,
      subjectCode: selectedSubject.code,
      topicId: selectedTopicId || undefined,
      durationMinutes: durationMins,
      category: selectedSubject.category === 'university' ? 'university' : 'industry',
      date: new Date().toISOString().split('T')[0],
      notes: sessionNotes,
    });

    awardXp(durationMins, 'Study Session Completed');
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });

    sendBrowserNotification({
      title: '🎯 Focus Session Completed!',
      body: `Awesome job Yash! You completed ${durationMins} mins on ${selectedSubject.code}. Take a well-earned break!`,
    });
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialDurationRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercentage = Math.round(
    ((initialDurationRef.current - timeLeft) / initialDurationRef.current) * 100
  );

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 max-w-xl mx-auto shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Mode Selector */}
      <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 mb-8 max-w-sm mx-auto">
        {[
          { id: '25', label: '25m Pomodoro' },
          { id: '50', label: '50m Deep Work' },
          { id: 'custom', label: 'Custom' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => handleModeSwitch(m.id as any)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === m.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer Circular Display */}
      <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
        {/* SVG Progress Ring */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="110"
            stroke="rgba(30, 41, 59, 0.8)"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="128"
            cy="128"
            r="110"
            stroke="url(#timerGradient)"
            strokeWidth="10"
            strokeDasharray={2 * Math.PI * 110}
            strokeDashoffset={2 * Math.PI * 110 * (1 - progressPercentage / 100)}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500 ease-out"
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-5xl font-extrabold text-white tracking-tighter">
            {formatTime(timeLeft)}
          </span>
          <span className="text-xs font-semibold text-slate-400 mt-2 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            {isRunning ? 'Deep Work in Progress...' : 'Ready to Focus'}
          </span>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center justify-center gap-4 my-8">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-8 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2.5 transition-all shadow-xl ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
              : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-indigo-600/40'
          }`}
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
          <span>{isRunning ? 'Pause Session' : 'Start Focus'}</span>
        </button>

        <button
          onClick={handleReset}
          className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Target Subject & Topic Association */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Log Session To
          </span>
          <span className="text-[10px] font-mono text-indigo-300">Auto-synced</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            {state.subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} — {s.name}
              </option>
            ))}
          </select>

          <select
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">General Subject Study</option>
            {subjectTopics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Session notes (e.g. solved 5 flowchart problems, read K-map unit)"
          value={sessionNotes}
          onChange={(e) => setSessionNotes(e.target.value)}
          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
        />
      </div>
    </div>
  );
};
