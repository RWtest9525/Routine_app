'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { BookOpen, Plus, Search, Trash2, Save, Tag, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function NotesPage() {
  const { state, saveNote, deleteNote } = useAppStore();

  const [selectedNoteId, setSelectedNoteId] = useState<string>(state.notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  const activeNote = state.notes.find((n) => n.id === selectedNoteId) || state.notes[0];

  const [title, setTitle] = useState(activeNote?.title || '');
  const [content, setContent] = useState(activeNote?.contentMarkdown || '');
  const [subjectCode, setSubjectCode] = useState(activeNote?.subjectCode || 'ADP1');
  const [tagsInput, setTagsInput] = useState(activeNote?.tags.join(', ') || '');

  const filteredNotes = state.notes.filter((n) => {
    const matchesSub = selectedSubject === 'All' || n.subjectCode === selectedSubject;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.contentMarkdown.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSub && matchesSearch;
  });

  const handleSelectNote = (noteId: string) => {
    const n = state.notes.find((item) => item.id === noteId);
    if (n) {
      setSelectedNoteId(n.id);
      setTitle(n.title);
      setContent(n.contentMarkdown);
      setSubjectCode(n.subjectCode);
      setTagsInput(n.tags.join(', '));
    }
  };

  const handleCreateNewNote = () => {
    const newNote = {
      subjectCode: 'ADP1',
      title: 'Untitled Note',
      contentMarkdown: '# New Note\n\nWrite your thoughts, algorithms, or summary here...',
      tags: ['General'],
    };
    saveNote(newNote);
  };

  const handleSave = () => {
    if (!activeNote) return;
    saveNote({
      id: activeNote.id,
      subjectCode,
      title,
      contentMarkdown: content,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-8 h-8 text-indigo-400" />
            <span>Notes & Knowledge Vault</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Subject-tagged markdown notes, quick formulas, code snippets, and active recall summaries.
          </p>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Main Split View: Notes List (Left) + Markdown Editor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Notes Sidebar */}
        <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-3 h-[600px] flex flex-col">
          {/* Search & Subject Filter */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
              />
            </div>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
            >
              <option value="All">All Subjects</option>
              {state.subjects.map((s) => (
                <option key={s.id} value={s.code}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-800/40">
            {filteredNotes.map((note) => {
              const isSelected = note.id === selectedNoteId;
              return (
                <div
                  key={note.id}
                  onClick={() => handleSelectNote(note.id)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-white shadow-md'
                      : 'hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-indigo-300">
                      {note.subjectCode}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {format(new Date(note.updatedAt), 'MMM dd')}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold mt-1.5 truncate">{note.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 font-sans">
                    {note.contentMarkdown.replace(/[#*`]/g, '')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Note Editor */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 h-[600px] flex flex-col">
          {activeNote ? (
            <>
              {/* Header Editor Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note Title"
                    className="w-full bg-transparent text-lg font-bold text-white focus:outline-none placeholder-slate-600"
                  />
                  <div className="flex items-center gap-2">
                    <select
                      value={subjectCode}
                      onChange={(e) => setSubjectCode(e.target.value)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-indigo-300 font-mono font-bold focus:outline-none"
                    >
                      {state.subjects.map((s) => (
                        <option key={s.id} value={s.code}>
                          {s.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="Tags (comma-separated)"
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 placeholder-slate-600 focus:outline-none flex-1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Note</span>
                  </button>
                  <button
                    onClick={() => deleteNote(activeNote.id)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write markdown notes..."
                className="flex-1 w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed resize-none"
              />
            </>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 my-auto">
              Select or create a note to begin writing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
