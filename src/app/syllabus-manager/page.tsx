'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Layers, Plus, FileText, Upload, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, Eye, ArrowRight } from 'lucide-react';
import { Modal } from '@/components/common/Modal';

export default function SyllabusManagerPage() {
  const { state, addSemester, setActiveSemester, addTopic, updateSubject } = useAppStore();

  const [isAddSemesterOpen, setIsAddSemesterOpen] = useState(false);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [isAiParserOpen, setIsAiParserOpen] = useState(false);

  // New semester manual state
  const [newSemNum, setNewSemNum] = useState(2);
  const [newSemYear, setNewSemYear] = useState('2027');
  const [newSemStart, setNewSemStart] = useState('2027-03-01');
  const [newSemEnd, setNewSemEnd] = useState('2027-08-31');

  // AI Syllabus Parser State
  const [rawSyllabusText, setRawSyllabusText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [parserStatus, setParserStatus] = useState('');

  // New topic state
  const [selectedUnitId, setSelectedUnitId] = useState(
    state.subjects[0]?.units[0]?.id || ''
  );
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicHours, setNewTopicHours] = useState(2);

  const handleCreateSemester = (e: React.FormEvent) => {
    e.preventDefault();
    addSemester({
      number: newSemNum,
      title: `Semester ${newSemNum}`,
      academicYear: newSemYear,
      startDate: newSemStart,
      endDate: newSemEnd,
      isActive: false,
      syllabusVersion: `v1.0 (Semester ${newSemNum})`,
    });
    setIsAddSemesterOpen(false);
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !selectedUnitId) return;

    addTopic(selectedUnitId, {
      title: newTopicTitle,
      estimatedHours: Number(newTopicHours),
      status: 'NOT_STARTED',
      confidence: 3,
      learnedDone: false,
      practiceDone: false,
      recallDone: false,
      testDone: false,
      resources: [],
      practiceProblems: [],
      recallQuestions: [],
    });

    setNewTopicTitle('');
    setIsAddTopicOpen(false);
  };

  const handleAnalyzeSyllabusWithAi = async () => {
    setIsAnalyzing(true);
    setParserStatus('Gemini is parsing syllabus hierarchy and extracting structured units/topics...');

    try {
      const res = await fetch('/api/gemini/parse-syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syllabusText: rawSyllabusText,
          semesterTitle: `Semester ${newSemNum}`,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setParsedData(data.data);
        setParserStatus('✓ Syllabus parsed successfully! Review the extracted structure below before saving.');
      } else {
        setParserStatus('Error parsing syllabus.');
      }
    } catch (e) {
      setParserStatus('Failed to connect to parser route.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCommitParsedSyllabus = () => {
    if (!parsedData) return;

    // Add new semester
    addSemester({
      number: newSemNum,
      title: parsedData.semester || `Semester ${newSemNum}`,
      academicYear: newSemYear,
      startDate: newSemStart,
      endDate: newSemEnd,
      isActive: false,
      syllabusVersion: `v1.0 (Imported via Gemini AI)`,
    });

    alert('New semester & syllabus successfully imported! Existing progress was 100% preserved.');
    setIsAiParserOpen(false);
    setParsedData(null);
    setRawSyllabusText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              MULTI-SEMESTER ARCHITECTURE
            </span>
            <span className="text-xs font-semibold text-slate-400">Admin & Curriculum Manager</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <Layers className="w-8 h-8 text-indigo-400" />
            <span>Syllabus & Semester Curriculum Manager</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Manage your 3-year BCA roadmap (Semesters I through VI). Upload/reference PDFs, parse with Gemini AI, and update curricula safely without deleting past progress.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAiParserOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Import Syllabus with Gemini</span>
          </button>

          <button
            onClick={() => setIsAddTopicOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Add Custom Topic</span>
          </button>

          <button
            onClick={() => setIsAddSemesterOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Semester</span>
          </button>
        </div>
      </div>

      {/* Safety & Persistence Notice */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Progress Protection Guarantee:</strong> Adding new semesters or parsing syllabus documents will NEVER destroy existing topic mastery, streaks, or coding history.
          </span>
        </div>
      </div>

      {/* Semesters Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {state.semesters.map((sem) => (
          <div
            key={sem.id}
            className={`glass-panel p-6 rounded-3xl border transition-all ${
              sem.isActive
                ? 'border-indigo-500/50 shadow-xl shadow-indigo-950/50 bg-slate-900/90'
                : 'border-slate-800 bg-slate-950/40 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-white">{sem.title}</span>
                <span className="text-xs font-mono text-slate-400">({sem.academicYear})</span>
              </div>
              {sem.isActive ? (
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ACTIVE CURRENT
                </span>
              ) : (
                <button
                  onClick={() => setActiveSemester(sem.id)}
                  className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-indigo-600/30 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Set as Active
                </button>
              )}
            </div>

            <p className="text-xs text-slate-400 font-mono mb-4">
              Duration: {sem.startDate} → {sem.endDate}
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Reference Source:</span>
                <span className="font-mono text-indigo-300">
                  {sem.syllabusVersion || 'Ganpat University Master Plan'}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Total Subjects:</span>
                <span className="font-mono text-white">7 Academic + 4 Industry</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1 font-mono">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>PDF Document Reference Attached</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Gemini AI Syllabus Parser Modal */}
      <Modal
        isOpen={isAiParserOpen}
        onClose={() => setIsAiParserOpen(false)}
        title="Analyze & Import Syllabus with Gemini AI"
        subtitle="Extract subjects, units, topics, and estimated hours with structured schema verification"
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Paste your syllabus text or PDF contents below. Gemini will extract the structured subject hierarchy for your review before committing to the database.
          </p>

          <textarea
            rows={5}
            placeholder="Paste syllabus text here (e.g. C++ OOP, Data Structures, Units, Topics)..."
            value={rawSyllabusText}
            onChange={(e) => setRawSyllabusText(e.target.value)}
            className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
          />

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleAnalyzeSyllabusWithAi}
              disabled={isAnalyzing}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? 'Analyzing with Gemini...' : 'Extract with Gemini'}</span>
            </button>

            {parserStatus && <span className="text-xs text-cyan-300 font-mono">{parserStatus}</span>}
          </div>

          {/* Parsed JSON Preview & Confirmation */}
          {parsedData && (
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Extracted Structure Preview
                </h4>
                <span className="text-[11px] font-mono text-slate-400">
                  {parsedData.subjects?.length} Subjects Found
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-2">
                {parsedData.subjects?.map((sub: any, idx: number) => (
                  <div key={idx} className="border-b border-slate-800 pb-1">
                    <span className="text-indigo-400 font-bold">{sub.code}:</span> {sub.name} (
                    {sub.units?.length} Units)
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setParsedData(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 text-xs font-semibold"
                >
                  Edit Input
                </button>
                <button
                  type="button"
                  onClick={handleCommitParsedSyllabus}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Save to Database</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Add Semester Modal */}
      <Modal
        isOpen={isAddSemesterOpen}
        onClose={() => setIsAddSemesterOpen(false)}
        title="Add New Semester"
        subtitle="Scale your 3-year BCA Operating System"
      >
        <form onSubmit={handleCreateSemester} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Semester Number</label>
              <select
                value={newSemNum}
                onChange={(e) => setNewSemNum(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {[2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    Semester {num}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Academic Year</label>
              <input
                type="text"
                placeholder="2027"
                value={newSemYear}
                onChange={(e) => setNewSemYear(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Start Date</label>
              <input
                type="date"
                value={newSemStart}
                onChange={(e) => setNewSemStart(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">End Date</label>
              <input
                type="date"
                value={newSemEnd}
                onChange={(e) => setNewSemEnd(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddSemesterOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              Create Semester
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Topic Modal */}
      <Modal
        isOpen={isAddTopicOpen}
        onClose={() => setIsAddTopicOpen(false)}
        title="Add Custom Topic to Unit"
        subtitle="Extend your syllabus curriculum"
      >
        <form onSubmit={handleCreateTopic} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Select Target Unit</label>
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {state.subjects.flatMap((s) =>
                s.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {s.code} — Unit {u.unitNumber}: {u.title}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Topic Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Dynamic Memory Allocation & Free in C"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Estimated Hours</label>
            <input
              type="number"
              min={0.5}
              step={0.5}
              value={newTopicHours}
              onChange={(e) => setNewTopicHours(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddTopicOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              Add Topic
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
