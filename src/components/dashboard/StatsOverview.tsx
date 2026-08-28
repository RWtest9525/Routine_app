'use client';

import React from 'react';
import { Calendar, Clock, Code, Trophy, Flame, Zap } from 'lucide-react';
import { StatCard } from '@/components/common/StatCard';
import { useAppStore } from '@/lib/store';
import { differenceInDays, parseISO } from 'date-fns';

export const StatsOverview: React.FC = () => {
  const { state } = useAppStore();

  const startDate = parseISO(state.profile.planStartDate || '2026-08-28');
  const endDate = parseISO(state.profile.planEndDate || '2027-02-28');
  const totalDays = Math.max(1, differenceInDays(endDate, startDate));
  
  // Calculate current day index
  const today = new Date();
  const currentDayIndex = Math.min(totalDays, Math.max(1, differenceInDays(today, startDate) + 1));

  // Compute today's study & coding minutes
  const todayStr = today.toISOString().split('T')[0];
  const todayStudyMinutes = state.studySessions
    .filter((s) => s.date === todayStr)
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  const todayCodingMinutes = state.codingSessions
    .filter((s) => s.date === todayStr)
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  const completedProjects = state.projects.filter((p) => p.status === 'Completed' || p.progressPercent === 100).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      <StatCard
        title="Day Progress"
        value={`Day ${currentDayIndex} / ${totalDays}`}
        subtitle="Semester I (28 Aug - 28 Feb)"
        icon={Calendar}
        color="indigo"
      />
      <StatCard
        title="Current Streak"
        value={`${state.currentStreak} Days`}
        subtitle={`Best: ${state.longestStreak} Days 🔥`}
        icon={Flame}
        color="amber"
      />
      <StatCard
        title="Study Time Today"
        value={`${(todayStudyMinutes / 60).toFixed(1)} hrs`}
        subtitle={`${todayStudyMinutes} mins logged`}
        icon={Clock}
        color="cyan"
      />
      <StatCard
        title="Coding Today"
        value={`${(todayCodingMinutes / 60).toFixed(1)} hrs`}
        subtitle={`${todayCodingMinutes} mins practice`}
        icon={Code}
        color="emerald"
      />
      <StatCard
        title="Projects Done"
        value={`${completedProjects} / ${state.projects.length}`}
        subtitle={`${state.projects.filter((p) => p.status === 'Development').length} in active dev`}
        icon={Trophy}
        color="rose"
      />
      <StatCard
        title="Experience (XP)"
        value={`${state.totalXp} XP`}
        subtitle={`Level ${state.level} Scholar`}
        icon={Zap}
        color="indigo"
      />
    </div>
  );
};
