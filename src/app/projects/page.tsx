'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Project, ProjectStatus } from '@/lib/types';
import { FolderGit2, Plus, Github, ExternalLink, CheckCircle2, Circle, CheckSquare, Clock, ArrowRight } from 'lucide-react';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Modal } from '@/components/common/Modal';

export default function ProjectsPage() {
  const { state, updateProject, addProject, toggleProjectTask, addProjectTask } = useAppStore();

  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // New Project Form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newStatus, setNewStatus] = useState<ProjectStatus>('Idea');
  const [newGithub, setNewGithub] = useState('');
  const [newLive, setNewLive] = useState('');

  const statuses = ['All', 'Idea', 'Planning', 'Development', 'Testing', 'Deployed', 'Completed'];

  const filteredProjects = state.projects.filter((p) => {
    if (selectedStatus === 'All') return true;
    return p.status === selectedStatus;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addProject({
      title: newTitle,
      description: newDesc,
      techStack: newTech.split(',').map((t) => t.trim()).filter(Boolean),
      status: newStatus,
      startDate: new Date().toISOString().split('T')[0],
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      githubUrl: newGithub || undefined,
      liveUrl: newLive || undefined,
      progressPercent: newStatus === 'Completed' ? 100 : 0,
      features: [],
      tasks: [],
    });

    setNewTitle('');
    setNewDesc('');
    setNewTech('');
    setNewGithub('');
    setNewLive('');
    setIsAddModalOpen(false);
  };

  const handleAddTaskToActive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !newTaskTitle.trim()) return;
    addProjectTask(selectedProject.id, newTaskTitle);
    setNewTaskTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              BUILD IN PUBLIC • PORTFOLIO
            </span>
            <span className="text-xs font-semibold text-slate-400">9 Semester-1 Targets</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <FolderGit2 className="w-8 h-8 text-rose-400" />
            <span>Practical Project Portfolio Hub</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Build real software: CLI tools in C, Modern Web Apps, and GitHub deployments to stand out from average BCA graduates.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/30 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedStatus === st
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-rose-500/40 cursor-pointer transition-all duration-200 flex flex-col justify-between group glass-card-hover"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                    project.status === 'Completed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : project.status === 'Development'
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {project.status}
                </span>

                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-500 hover:text-white"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-500 hover:text-cyan-400"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors line-clamp-1">
                {project.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {project.description}
              </p>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1 mt-3">
                {project.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80">
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-slate-400">
                  {project.tasks.filter((t) => t.isCompleted).length}/{project.tasks.length} Milestones
                </span>
                <span className="font-bold text-white">{project.progressPercent}%</span>
              </div>
              <ProgressBar percentage={project.progressPercent} color="#f43f5e" height="sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail / Task Checklist Modal */}
      {selectedProject && (
        <Modal
          isOpen={Boolean(selectedProject)}
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
          subtitle={`Status: ${selectedProject.status} • Stack: ${selectedProject.techStack.join(', ')}`}
          maxWidth="xl"
        >
          <div className="space-y-5">
            <p className="text-xs text-slate-300 leading-relaxed">{selectedProject.description}</p>

            {/* Status Selector */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Project Lifecycle Status
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(['Idea', 'Planning', 'Development', 'Testing', 'Deployed', 'Completed'] as ProjectStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateProject(selectedProject.id, {
                        status: st,
                        progressPercent: st === 'Completed' ? 100 : selectedProject.progressPercent,
                      });
                      setSelectedProject((prev) => (prev ? { ...prev, status: st } : null));
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedProject.status === st
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Milestones & Tasks Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span>Milestone Tasks & Features</span>
                <span className="font-mono text-[11px] text-slate-400">
                  {selectedProject.tasks.filter((t) => t.isCompleted).length} / {selectedProject.tasks.length} Done
                </span>
              </h4>

              <div className="space-y-2">
                {selectedProject.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => {
                      toggleProjectTask(selectedProject.id, task.id);
                      setSelectedProject((prev) => {
                        if (!prev) return null;
                        return {
                          ...prev,
                          tasks: prev.tasks.map((t) => (t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t)),
                        };
                      });
                    }}
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                      task.isCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                        : 'bg-slate-900/60 border-slate-800 text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {task.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      )}
                      <span className={task.isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}>
                        {task.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Task Input */}
              <form onSubmit={handleAddTaskToActive} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add next feature / task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-colors"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {/* New Project Creation Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Project"
        subtitle="Add a new project to your 3-year BCA software showcase"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Project Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Real-Time Chat App with Socket.IO"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Describe core architecture and user features..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Tech Stack (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, Express, MongoDB"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">GitHub Repo URL</label>
              <input
                type="url"
                placeholder="https://github.com/yashvishal/..."
                value={newGithub}
                onChange={(e) => setNewGithub(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Live Demo URL</label>
              <input
                type="url"
                placeholder="https://yash-app.vercel.app"
                value={newLive}
                onChange={(e) => setNewLive(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
              />
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
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
            >
              Create Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
