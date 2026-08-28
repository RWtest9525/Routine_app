'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { CalendarDays, ChevronLeft, ChevronRight, CheckCircle2, Clock, Calendar as CalIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export default function CalendarPage() {
  const { state } = useAppStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const selectedDateTasks = state.dailyTasks.filter((t) => t.date === selectedDateStr);
  const selectedDateSessions = state.studySessions.filter((s) => s.date === selectedDateStr);

  const getDayStatus = (date: Date) => {
    const dStr = format(date, 'yyyy-MM-dd');
    const tasks = state.dailyTasks.filter((t) => t.date === dStr);
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    if (tasks.length === 0) {
      return dStr > todayStr ? 'future' : 'empty';
    }

    const completed = tasks.filter((t) => t.status === 'completed').length;
    const rate = completed / tasks.length;

    if (rate >= 0.7) return 'green';
    if (rate > 0) return 'yellow';
    if (dStr < todayStr) return 'red';
    return 'future';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-8 h-8 text-indigo-400" />
            <span>Master Academic & Practice Calendar</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Track daily task completion, focus study hours, and academic consistency over your 6-month semester.
          </p>
        </div>
      </div>

      {/* Main Grid: Calendar Month View + Day Activity Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month View (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white font-mono">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-bold text-slate-400 pb-2 border-b border-slate-800">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((day) => {
              const status = getDayStatus(day);
              const isSelected = isSameDay(day, selectedDate);
              const dayStr = format(day, 'd');

              const statusColor = {
                green: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300',
                yellow: 'border-amber-500/50 bg-amber-950/30 text-amber-300',
                red: 'border-rose-500/50 bg-rose-950/30 text-rose-300',
                future: 'border-slate-800 bg-slate-900/40 text-slate-400',
                empty: 'border-slate-800/40 bg-slate-950/20 text-slate-600',
              }[status];

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`h-20 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${statusColor} ${
                    isSelected ? 'ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold">{dayStr}</span>
                    {status === 'green' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>

                  <div className="text-[10px] font-mono opacity-80 truncate">
                    {status === 'green' && '70%+ Done 🔥'}
                    {status === 'yellow' && 'In Progress'}
                    {status === 'red' && 'Missed'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500" />
              <span>Completed (70%+)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500/40 border border-amber-500" />
              <span>Partially Done</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/40 border border-rose-500" />
              <span>Missed Day</span>
            </span>
          </div>
        </div>

        {/* Selected Day Activity Panel (1 col) */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[11px] font-mono text-indigo-400 font-bold block uppercase">
              Selected Day Overview
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {format(selectedDate, 'EEEE, MMMM do yyyy')}
            </h3>
          </div>

          {/* Tasks for the Day */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Scheduled Tasks ({selectedDateTasks.length})</span>
              <span className="font-mono text-indigo-400">
                {selectedDateTasks.filter((t) => t.status === 'completed').length} Done
              </span>
            </h4>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {selectedDateTasks.length > 0 ? (
                selectedDateTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-2"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 flex-shrink-0 ${
                        t.status === 'completed' ? 'text-emerald-400' : 'text-slate-600'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className={`truncate font-semibold ${t.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {t.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{t.timeBlock}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 p-4 text-center">No tasks recorded for this date.</p>
              )}
            </div>
          </div>

          {/* Study Sessions on this date */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Study Focus Logs ({selectedDateSessions.length})
            </h4>
            {selectedDateSessions.map((s) => (
              <div
                key={s.id}
                className="p-2 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs flex justify-between items-center"
              >
                <span className="font-semibold text-indigo-300">{s.subjectCode}</span>
                <span className="font-mono text-slate-400">{s.durationMinutes} mins</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
