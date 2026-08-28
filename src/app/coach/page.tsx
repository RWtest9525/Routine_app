'use client';

import React, { Suspense } from 'react';
import { AiCoachChat } from '@/components/coach/AiCoachChat';
import { Bot } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function CoachContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || undefined;

  return <AiCoachChat initialQuery={initialQuery} />;
}

export default function CoachPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            INTELLIGENT ADVISOR
          </span>
          <span className="text-xs font-semibold text-slate-400">Context-Aware AI Model</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2.5">
          <Bot className="w-8 h-8 text-cyan-400" />
          <span>Personal AI Study & Strategy Coach</span>
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Your 24/7 personal tutor and mentor. Analyzes curriculum progress, identifies weak topics, redistributes backlog, and tests your active recall.
        </p>
      </div>

      {/* AI Coach Chat Window */}
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading AI Coach...</div>}>
        <CoachContent />
      </Suspense>
    </div>
  );
}
