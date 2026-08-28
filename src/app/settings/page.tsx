'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Settings, Save, Download, Upload, RotateCcw, Bell, Moon, Award, User, Clock, Utensils, ShieldAlert } from 'lucide-react';

export default function SettingsPage() {
  const { state, updateProfile, exportData, importData, resetToDefaults } = useAppStore();

  const [name, setName] = useState(state.profile.name);
  const [college, setCollege] = useState(state.profile.college);
  const [degree, setDegree] = useState(state.profile.degree);
  const [studyStart, setStudyStart] = useState(state.profile.studyStartTime);
  const [studyEnd, setStudyEnd] = useState(state.profile.studyEndTime);
  const [breakfast, setBreakfast] = useState(state.profile.breakfastTime);
  const [lunch, setLunch] = useState(state.profile.lunchTime);
  const [dinner, setDinner] = useState(state.profile.dinnerTime);
  const [gamification, setGamification] = useState(state.profile.gamificationEnabled);
  const [notifications, setNotifications] = useState(state.profile.notificationsEnabled);
  const [minSuccess, setMinSuccess] = useState(state.profile.minDailySuccessPercent);

  const [importJsonText, setImportJsonText] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      college,
      degree,
      studyStartTime: studyStart,
      studyEndTime: studyEnd,
      breakfastTime: breakfast,
      lunchTime: lunch,
      dinnerTime: dinner,
      gamificationEnabled: gamification,
      notificationsEnabled: notifications,
      minDailySuccessPercent: Number(minSuccess),
    });

    setStatusMsg('Profile and OS settings updated successfully! ✓');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleDownloadBackup = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `yash-bca-os-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = () => {
    if (!importJsonText.trim()) return;
    const success = importData(importJsonText);
    if (success) {
      setStatusMsg('Backup data imported successfully! ✓');
      setImportJsonText('');
    } else {
      setStatusMsg('Error: Invalid backup JSON format.');
    }
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset Yash BCA Learning OS to factory default settings?')) {
      resetToDefaults();
      setStatusMsg('OS state reset to defaults.');
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-8 h-8 text-indigo-400" />
          <span>System Settings & Preferences</span>
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Customize your study blocks, meal timings, notification reminders, and manage state backups.
        </p>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
          {statusMsg}
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            <span>Academic Profile Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">College / University</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Degree Program</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Timetable & Meal Breaks */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Study Windows & Fixed Meal Periods</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Study Start Time</label>
              <input
                type="text"
                value={studyStart}
                onChange={(e) => setStudyStart(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Study End Time</label>
              <input
                type="text"
                value={studyEnd}
                onChange={(e) => setStudyEnd(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Breakfast Break</label>
              <input
                type="text"
                value={breakfast}
                onChange={(e) => setBreakfast(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Lunch Break</label>
              <input
                type="text"
                value={lunch}
                onChange={(e) => setLunch(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Dinner Break</label>
              <input
                type="text"
                value={dinner}
                onChange={(e) => setDinner(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Streak Success % Threshold</label>
              <input
                type="number"
                min={50}
                max={100}
                value={minSuccess}
                onChange={(e) => setMinSuccess(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Gamification & XP Rewards</div>
              <div className="text-[11px] text-slate-400">Award XP for topic completion, coding problems, and streaks.</div>
            </div>
            <input
              type="checkbox"
              checked={gamification}
              onChange={(e) => setGamification(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div>
              <div className="text-xs font-bold text-white">Browser Notifications</div>
              <div className="text-[11px] text-slate-400">Receive timely study and revision reminders.</div>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>

      {/* Data Backup & Portability Engine */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Data Portability & Backup Engine</span>
        </h3>
        <p className="text-xs text-slate-300">
          Export your complete progress, study sessions, notes, and streak history as a JSON backup file. Import it anytime on any browser or device.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadBackup}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Backup (JSON)</span>
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Factory Defaults</span>
          </button>
        </div>

        <div className="space-y-2 pt-3 border-t border-slate-800">
          <label className="text-xs font-bold text-slate-300 block">Restore from Backup JSON</label>
          <textarea
            rows={3}
            placeholder="Paste your JSON backup payload here..."
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleImportBackup}
            disabled={!importJsonText.trim()}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Restore State</span>
          </button>
        </div>
      </div>
    </div>
  );
}
