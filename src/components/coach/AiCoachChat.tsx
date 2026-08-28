'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, HelpCircle, Flame, ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { calculateProgressSummary, calculateSubjectProgress } from '@/lib/progressCalculator';
import { weeklyTimetable } from '@/data/initialTimetable';
import { format } from 'date-fns';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  source?: string;
}

interface AiCoachChatProps {
  initialQuery?: string;
}

export const AiCoachChat: React.FC<AiCoachChatProps> = ({ initialQuery }) => {
  const { state, rescheduleTask, toggleTask, addTask } = useAppStore();
  const summary = calculateProgressSummary(state.subjects, state.projects);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello Yash! 👋 I am your Gemini-Powered BCA AI Coach for Ganpat University.\n\nI monitor your real database state in real-time: your 7 university subjects (${summary.academicProgress}% completed), today's mission, coding practice, projects, and your ${state.currentStreak}-day streak 🔥.\n\nAsk me anything in normal language (e.g., *"Aaj ka plan bana"*, *"ADP1 kitna complete hai?"*, *"Mujhe K-map padha do"*, *"Aaj ka test lo"*, *"Backlog redistribute karo"*).`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialQueryTriggered = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialQuery && !initialQueryTriggered.current) {
      initialQueryTriggered.current = true;
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const dayName = format(new Date(), 'EEEE');
      const timetableInfo = weeklyTimetable[dayName] || { collegeSubjects: ['ADP1', 'CS1', 'ES'] };

      const subjectStats = state.subjects.map((s) => {
        const { percentage, totalTopics, completedTopics } = calculateSubjectProgress(s);
        return {
          code: s.code,
          name: s.name,
          percentage,
          completedTopics,
          totalTopics,
          units: s.units.map((u) => ({
            unitNumber: u.unitNumber,
            title: u.title,
            topics: u.topics.map((t) => ({
              title: t.title,
              status: t.status,
              confidence: t.confidence,
            })),
          })),
        };
      });

      const todayTasks = state.dailyTasks.filter((t) => t.date === todayStr);
      const backlogTasks = state.dailyTasks
        .filter((t) => t.status === 'pending' && t.date < todayStr)
        .map((t) => ({ id: t.id, title: t.title, date: t.date, priority: t.priority }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          context: {
            userName: state.profile.name,
            semester: state.profile.currentSemester,
            academicProgress: summary.academicProgress,
            industryProgress: summary.industryProgress,
            currentStreak: state.currentStreak,
            studyStartTime: state.profile.studyStartTime,
            studyEndTime: state.profile.studyEndTime,
            isExamMode: state.profile.isExamMode,
            todayCollegeSubjects: timetableInfo.collegeSubjects,
            subjects: subjectStats,
            todayTasks: todayTasks.map((t) => ({
              id: t.id,
              title: t.title,
              category: t.category,
              status: t.status,
              timeBlock: t.timeBlock,
            })),
            backlogTasks,
          },
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: data.reply || 'Analysis complete.',
        timestamp: 'Just now',
        source: data.source,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error fetching Gemini response:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: `You have completed ${summary.academicProgress}% of your Semester-I academic syllabus. Today's main focus is your ${state.subjects[0]?.code} unit review and C practice problems. Keep your ${state.currentStreak}-day streak strong! 🔥`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl border border-indigo-500/30 overflow-hidden shadow-2xl flex flex-col h-[680px]">
      {/* Coach Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
              Gemini BCA AI Coach & Adaptive Planner
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <p className="text-[11px] text-slate-400">
              Database-Synchronized • Ganpat University BCA Semester-I
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Gemini Agent v2.0</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-br from-indigo-500 to-cyan-500 text-white'
                  : 'bg-slate-800 border border-slate-700 text-cyan-400'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[84%] rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>
              {msg.source && (
                <div className="text-[10px] text-slate-500 mt-2 pt-1 border-t border-slate-800/80 font-mono">
                  Engine: {msg.source}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Gemini is reading your curriculum database & formulating advice...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        {[
          'Aaj ka plan bana',
          'ADP1 kitna complete hai?',
          'Mujhe K-map padha do',
          'Aaj jo padha uska test lo',
          'Mera backlog dikhao aur redistribute karo',
          'Week 1 ki summary report do',
        ].map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-300 border border-slate-800 text-[11px] whitespace-nowrap transition-colors flex-shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type in English, Hindi or Hinglish (e.g. 'Aaj ka plan bana', 'K-map ka test lo')..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
