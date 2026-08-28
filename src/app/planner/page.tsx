'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { DailyTask, TaskCategory, TaskPriority } from '@/lib/types';
import { CalendarCheck2, Plus, Trash2, Clock, CheckCircle2, Circle, ArrowRight, RotateCcw, Calendar, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { format, addDays, subDays } from 'date-fns';

export default function PlannerPage() {
  const { state, toggleTask, addTask, deleteTask, rescheduleTask, generateTasksForDate } = useAppStore();

  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTimeBlock, setNewTimeBlock] = useState('2:00 PM – 3:30 PM');
  const [newCategory, setNewCategory] = useState<TaskCategory>('university');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');

  const tasksForSelectedDate = state.dailyTasks.filter((t) => t.date === selectedDate);
  const backlogTasks = state.dailyTasks.filter((t) => t.status === 'pending' && t.date < selectedDate);

  const handlePrevDay = () => {
    const prev = subDays(new Date(selectedDate), 1);
    const dateStr = format(prev, 'yyyy-MM-dd');
    setSelectedDate(dateStr);
    generateTasksForDate(dateStr);
  };

  const handleNextDay = () => {
    const next = addDays(new Date(selectedDate), 1);
    const dateStr = format(next, 'yyyy-MM-dd');
    setSelectedDate(dateStr);
    generateTasksForDate(dateStr);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      date: selectedDate,
      timeBlock: newTimeBlock,
      category: newCategory,
      title: newTitle,
      priority: newPriority,
      status: 'pending',
      xpAwarded: newPriority === 'high' ? 25 : 15,
    });

    setNewTitle('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              SMART DAILY ENGINE
            </span>
            <span className="text-xs font-semibold text-slate-400">Timetable & Backlog Aligned</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <CalendarCheck2 className="w-8 h-8 text-indigo-400" />
            <span>Daily Mission Planner</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Plan, execute, reschedule, and redistribute study tasks. Completing tasks updates your streak and university progress in real time.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Date Navigation Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
        <button
          onClick={handlePrevDay}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors"
        >
          ← Previous Day
        </button>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-extrabold text-white font-mono">{selectedDate}</span>
          <span className="text-xs text-slate-400">({format(new Date(selectedDate), 'EEEE')})</span>
        </div>

        <button
          onClick={handleNextDay}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors"
        >
          Next Day →
        </button>
      </div>

      {/* Backlog Manager (if any) */}
      {backlogTasks.length > 0 && (
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Pending Backlog ({backlogTasks.length} Tasks)
              </h4>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Auto-redistributed smoothly</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {backlogTasks.slice(0, 4).map((bt) => (
              <div
                key={bt.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">{bt.title}</div>
                  <div className="text-[10px] text-amber-400 font-mono mt-0.5">Original: {bt.date}</div>
                </div>
                <button
                  onClick={() => rescheduleTask(bt.id, selectedDate)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold transition-colors flex-shrink-0"
                >
                  Move to Today
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks For Selected Date */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Tasks for {selectedDate}</span>
            <span className="text-xs font-mono font-normal text-indigo-400">
              ({tasksForSelectedDate.filter((t) => t.status === 'completed').length}/{tasksForSelectedDate.length} Completed)
            </span>
          </h3>
        </div>

        <div className="space-y-3">
          {tasksForSelectedDate.length > 0 ? (
            tasksForSelectedDate.map((task) => {
              const isDone = task.status === 'completed';

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400 opacity-75'
                      : 'bg-slate-900/60 border-slate-800/80 text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex-shrink-0 text-slate-500 hover:text-indigo-400 transition-colors"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase bg-slate-950 border border-slate-800 text-indigo-300">
                          {task.category}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {task.timeBlock}
                        </span>
                        {task.priority === 'high' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold">
                            HIGH
                          </span>
                        )}
                      </div>
                      <div className={`text-xs font-semibold mt-1 truncate ${isDone ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                        {task.title}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No tasks scheduled for this day. Click 'Add Custom Task' above to schedule items.
            </div>
          )}
        </div>
      </div>

      {/* Add Custom Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Custom Daily Task"
        subtitle={`Scheduled for ${selectedDate}`}
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g. ADP1 — Practice 10 Array manipulation programs"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Time Block</label>
              <input
                type="text"
                placeholder="2:00 PM – 3:30 PM"
                value={newTimeBlock}
                onChange={(e) => setNewTimeBlock(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="university">University</option>
                <option value="coding">Coding</option>
                <option value="industry">Industry</option>
                <option value="project">Project</option>
                <option value="revision">Revision</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Priority</label>
            <div className="flex gap-2">
              {(['high', 'medium', 'low'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNewPriority(p)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    newPriority === p
                      ? p === 'high'
                        ? 'bg-rose-600 text-white'
                        : p === 'medium'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              Schedule Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
