'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  AppState,
  UserProfile,
  Subject,
  DailyTask,
  StudySession,
  DsaProblem,
  CodingSession,
  Project,
  TestAttempt,
  Note,
  WeeklyReview,
  Topic,
  TopicStatus,
  TaskStatus,
  Semester,
} from './types';
import { initialSemesters, semester1Subjects } from '@/data/semester1Syllabus';
import { industryRoadmapSubjects } from '@/data/industryRoadmap';
import { initialDsaProblems } from '@/data/dsaQuestionsSeed';
import { initialProjects } from '@/data/initialProjects';
import { initialBadges, calculateLevelFromXp } from './gamificationEngine';
import { generateDailyTasksForDate } from './taskGenerator';
import { updateStreakRecord } from './streakEngine';
import { format } from 'date-fns';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'yash_bca_learning_os_state_v1';

const defaultProfile: UserProfile = {
  name: 'Yash Vishal',
  college: 'Ganpat University',
  degree: 'BCA (Bachelor of Computer Applications)',
  currentSemester: 'Semester I',
  planStartDate: '2026-08-28',
  planEndDate: '2027-02-28',
  timezone: 'Asia/Kolkata',
  studyStartTime: '14:00',
  studyEndTime: '00:00',
  breakfastTime: '07:00 - 08:00',
  lunchTime: '13:00 - 14:00',
  dinnerTime: '19:00 - 20:00',
  isExamMode: false,
  gamificationEnabled: true,
  notificationsEnabled: true,
  minDailySuccessPercent: 70,
  notificationTimes: {
    universityReminder: '13:55',
    codingReminder: '15:40',
    projectReminder: '19:55',
    revisionReminder: '21:40',
    dailyReviewReminder: '22:45',
  },
};

const initialAllSubjects: Subject[] = [...semester1Subjects, ...industryRoadmapSubjects];

export function getInitialAppState(): AppState {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const initialDaily = generateDailyTasksForDate(todayStr, initialAllSubjects, []);

  return {
    profile: defaultProfile,
    semesters: initialSemesters,
    activeSemesterId: 'sem-1',
    subjects: initialAllSubjects,
    dailyTasks: initialDaily,
    studySessions: [],
    dsaProblems: initialDsaProblems,
    codingSessions: [],
    projects: initialProjects,
    testAttempts: [],
    notes: [
      {
        id: 'note-welcome',
        subjectCode: 'ADP1',
        title: 'BCA Semester-1 Mastery Strategy & Principles',
        contentMarkdown: `# Yash BCA Learning OS — Strategic Blueprint 🚀\n\n### Core Objective\nOutwork and outcode the average BCA graduate by sustaining rigorous consistency in C programming, Database foundations, Web Engineering, and Digital Logic.\n\n### Daily Rules\n1. **Deep Work**: Minimum 2.5 hours of intense university syllabus mastery daily.\n2. **Hands-on Coding**: Every concept in C/HTML/SQL must be written, compiled, and debugged.\n3. **Active Recall**: Explain concepts out loud before marking them complete.\n4. **Never Skip Twice**: If a day is missed, redistribute backlog intelligently without burnout.`,
        tags: ['Orientation', 'Mindset', 'Rules'],
        updatedAt: new Date().toISOString(),
      },
    ],
    weeklyReviews: [],
    currentStreak: 1,
    longestStreak: 1,
    totalXp: 150,
    level: 1,
    badges: initialBadges,
    lastActiveDate: todayStr,
  };
}

interface AppStoreContextType {
  state: AppState;
  isLoaded: boolean;
  
  // Tasks
  toggleTask: (taskId: string) => void;
  addTask: (task: Partial<DailyTask>) => void;
  deleteTask: (taskId: string) => void;
  rescheduleTask: (taskId: string, newDate: string) => void;
  generateTasksForDate: (dateStr: string) => void;
  
  // Topic Mastery
  updateTopicMastery: (
    topicId: string,
    updates: {
      learnedDone?: boolean;
      practiceDone?: boolean;
      recallDone?: boolean;
      testDone?: boolean;
      status?: TopicStatus;
      confidence?: number;
      notesMarkdown?: string;
    }
  ) => void;
  togglePracticeProblem: (topicId: string, problemId: string) => void;
  
  // Timer & Study Sessions
  addStudySession: (session: Omit<StudySession, 'id' | 'timestamp'>) => void;
  
  // DSA & Coding
  updateDsaProblem: (problemId: string, updates: Partial<DsaProblem>) => void;
  addDsaProblem: (problem: Omit<DsaProblem, 'id'>) => void;
  addCodingSession: (session: Omit<CodingSession, 'id'>) => void;
  
  // Projects
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  toggleProjectTask: (projectId: string, taskId: string) => void;
  addProjectTask: (projectId: string, title: string) => void;
  
  // Notes
  saveNote: (note: { id?: string; subjectCode: string; topicId?: string; title: string; contentMarkdown: string; tags?: string[] }) => void;
  deleteNote: (noteId: string) => void;
  
  // Tests & Reviews
  addTestAttempt: (attempt: Omit<TestAttempt, 'id' | 'attemptDate'>) => void;
  saveWeeklyReview: (review: Omit<WeeklyReview, 'id' | 'createdAt'>) => void;
  
  // Settings & Profile
  updateProfile: (updates: Partial<UserProfile>) => void;
  toggleExamMode: () => void;
  
  // Syllabus & Multi-Semester Admin
  addSemester: (semester: Omit<Semester, 'id'>) => void;
  setActiveSemester: (semesterId: string) => void;
  updateSubject: (subjectId: string, updates: Partial<Subject>) => void;
  addTopic: (unitId: string, topic: Partial<Topic>) => void;
  updateTopic: (topicId: string, updates: Partial<Topic>) => void;
  
  // Gamification & Portability
  awardXp: (amount: number, reason?: string) => void;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
  resetToDefaults: () => void;
}

const AppStoreContext = createContext<AppStoreContextType | null>(null);

export const AppStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(getInitialAppState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState((prev) => ({
          ...prev,
          ...parsed,
          profile: { ...prev.profile, ...(parsed.profile || {}) },
          subjects: parsed.subjects?.length ? parsed.subjects : prev.subjects,
        }));
      }
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('Failed to save state to localStorage:', e);
      }
    }
  }, [state, isLoaded]);

  // Trigger celebration effects
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#10b981', '#06b6d4', '#f59e0b'],
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  // XP Awarding Engine
  const awardXp = useCallback(
    (amount: number, reason?: string) => {
      setState((prev) => {
        if (!prev.profile.gamificationEnabled) return prev;
        const newXp = prev.totalXp + amount;
        const { level } = calculateLevelFromXp(newXp);
        
        // Check for newly unlocked badges
        const updatedBadges = prev.badges.map((b) => {
          if (b.id === 'first-topic' && !b.isUnlocked && prev.subjects.some((s) => s.units.some((u) => u.topics.some((t) => t.status === 'COMPLETED')))) {
            return { ...b, isUnlocked: true, unlockedAt: new Date().toISOString() };
          }
          if (b.id === 'bca-architect' && !b.isUnlocked && level >= 10) {
            return { ...b, isUnlocked: true, unlockedAt: new Date().toISOString() };
          }
          return b;
        });

        return {
          ...prev,
          totalXp: newXp,
          level,
          badges: updatedBadges,
        };
      });
    },
    []
  );

  // Daily Tasks
  const toggleTask = useCallback(
    (taskId: string) => {
      setState((prev) => {
        let taskCompleted = false;
        let xpGained = 0;

        const updatedTasks: DailyTask[] = prev.dailyTasks.map((t) => {
          if (t.id === taskId) {
            const nextStatus: TaskStatus = t.status === 'completed' ? 'pending' : 'completed';
            if (nextStatus === 'completed') {
              taskCompleted = true;
              xpGained = t.xpAwarded || 20;
            }
            return {
              ...t,
              status: nextStatus,
              completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
            };
          }
          return t;
        });

        // Recalculate streak
        const streakInfo = updateStreakRecord(
          updatedTasks,
          prev.currentStreak,
          prev.longestStreak,
          prev.profile.minDailySuccessPercent
        );

        if (taskCompleted) {
          triggerCelebration();
        }

        const newXp = prev.totalXp + xpGained;
        const { level } = calculateLevelFromXp(newXp);

        return {
          ...prev,
          dailyTasks: updatedTasks,
          currentStreak: streakInfo.currentStreak,
          longestStreak: streakInfo.longestStreak,
          totalXp: newXp,
          level,
        };
      });
    },
    [triggerCelebration]
  );

  const addTask = useCallback((task: Partial<DailyTask>) => {
    setState((prev) => {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const newTask: DailyTask = {
        id: `custom-task-${Date.now()}`,
        date: task.date || todayStr,
        timeBlock: task.timeBlock || 'Custom Block',
        category: task.category || 'university',
        title: task.title || 'Untitled Task',
        priority: task.priority || 'medium',
        status: 'pending',
        xpAwarded: task.xpAwarded || 15,
        ...task,
      };
      return {
        ...prev,
        dailyTasks: [newTask, ...prev.dailyTasks],
      };
    });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setState((prev) => ({
      ...prev,
      dailyTasks: prev.dailyTasks.filter((t) => t.id !== taskId),
    }));
  }, []);

  const rescheduleTask = useCallback((taskId: string, newDate: string) => {
    setState((prev) => ({
      ...prev,
      dailyTasks: prev.dailyTasks.map((t) => (t.id === taskId ? { ...t, date: newDate } : t)),
    }));
  }, []);

  const generateTasksForDate = useCallback((dateStr: string) => {
    setState((prev) => {
      // Check if tasks already exist for this date
      const existing = prev.dailyTasks.filter((t) => t.date === dateStr);
      if (existing.length > 0) return prev;

      // Filter previous unfinished tasks as backlog
      const backlog = prev.dailyTasks.filter((t) => t.status === 'pending' && t.date < dateStr);
      const generated = generateDailyTasksForDate(dateStr, prev.subjects, backlog);

      return {
        ...prev,
        dailyTasks: [...generated, ...prev.dailyTasks],
      };
    });
  }, []);

  // Topic Mastery
  const updateTopicMastery = useCallback(
    (
      topicId: string,
      updates: {
        learnedDone?: boolean;
        practiceDone?: boolean;
        recallDone?: boolean;
        testDone?: boolean;
        status?: TopicStatus;
        confidence?: number;
        notesMarkdown?: string;
      }
    ) => {
      setState((prev) => {
        let justCompleted = false;

        const updatedSubjects = prev.subjects.map((sub) => ({
          ...sub,
          units: sub.units.map((u) => ({
            ...u,
            topics: u.topics.map((t) => {
              if (t.id === topicId) {
                const merged = { ...t, ...updates };
                // Determine completion
                const allChecked = merged.learnedDone && merged.practiceDone && merged.recallDone && merged.testDone;
                if (updates.status) {
                  merged.status = updates.status;
                } else if (allChecked) {
                  merged.status = 'COMPLETED';
                }

                if (merged.status === 'COMPLETED' && t.status !== 'COMPLETED') {
                  justCompleted = true;
                  merged.completedAt = new Date().toISOString();
                }
                merged.lastStudiedAt = new Date().toISOString();
                return merged;
              }
              return t;
            }),
          })),
        }));

        if (justCompleted) {
          triggerCelebration();
        }

        const newXp = prev.totalXp + (justCompleted ? 30 : 5);
        const { level } = calculateLevelFromXp(newXp);

        return {
          ...prev,
          subjects: updatedSubjects,
          totalXp: newXp,
          level,
        };
      });
    },
    [triggerCelebration]
  );

  const togglePracticeProblem = useCallback((topicId: string, problemId: string) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => ({
        ...s,
        units: s.units.map((u) => ({
          ...u,
          topics: u.topics.map((t) => {
            if (t.id === topicId) {
              const updatedProblems = t.practiceProblems.map((p) =>
                p.id === problemId ? { ...p, isCompleted: !p.isCompleted } : p
              );
              const allDone = updatedProblems.every((p) => p.isCompleted);
              return {
                ...t,
                practiceProblems: updatedProblems,
                practiceDone: allDone ? true : t.practiceDone,
              };
            }
            return t;
          }),
        })),
      })),
    }));
  }, []);

  // Study Sessions
  const addStudySession = useCallback((session: Omit<StudySession, 'id' | 'timestamp'>) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const newSession: StudySession = {
      ...session,
      id: `session-${Date.now()}`,
      timestamp: new Date().toISOString(),
      date: session.date || todayStr,
    };

    setState((prev) => {
      const xpGained = Math.round(session.durationMinutes * 0.5); // 0.5 XP per minute
      const newXp = prev.totalXp + xpGained;
      const { level } = calculateLevelFromXp(newXp);

      return {
        ...prev,
        studySessions: [newSession, ...prev.studySessions],
        totalXp: newXp,
        level,
      };
    });
  }, []);

  // DSA & Coding
  const updateDsaProblem = useCallback((problemId: string, updates: Partial<DsaProblem>) => {
    setState((prev) => {
      let isFirstSolve = false;
      const updated = prev.dsaProblems.map((p) => {
        if (p.id === problemId) {
          if (updates.status === 'SOLVED' && p.status !== 'SOLVED') {
            isFirstSolve = true;
          }
          return {
            ...p,
            ...updates,
            solvedDate: updates.status === 'SOLVED' ? new Date().toISOString() : p.solvedDate,
          };
        }
        return p;
      });

      const xpGained = isFirstSolve ? 25 : 5;
      const newXp = prev.totalXp + xpGained;
      const { level } = calculateLevelFromXp(newXp);

      return {
        ...prev,
        dsaProblems: updated,
        totalXp: newXp,
        level,
      };
    });
  }, []);

  const addDsaProblem = useCallback((problem: Omit<DsaProblem, 'id'>) => {
    setState((prev) => ({
      ...prev,
      dsaProblems: [{ ...problem, id: `dsa-${Date.now()}` }, ...prev.dsaProblems],
    }));
  }, []);

  const addCodingSession = useCallback((session: Omit<CodingSession, 'id'>) => {
    setState((prev) => {
      const newSession: CodingSession = { ...session, id: `code-session-${Date.now()}` };
      const xpGained = session.problemsCount * 10 + Math.round(session.durationMinutes * 0.3);
      const newXp = prev.totalXp + xpGained;
      const { level } = calculateLevelFromXp(newXp);

      return {
        ...prev,
        codingSessions: [newSession, ...prev.codingSessions],
        totalXp: newXp,
        level,
      };
    });
  }, []);

  // Projects
  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === projectId ? { ...p, ...updates } : p)),
    }));
  }, []);

  const addProject = useCallback((project: Omit<Project, 'id'>) => {
    setState((prev) => ({
      ...prev,
      projects: [{ ...project, id: `proj-${Date.now()}` }, ...prev.projects],
    }));
  }, []);

  const toggleProjectTask = useCallback((projectId: string, taskId: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id === projectId) {
          const updatedTasks = p.tasks.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
          const completedCount = updatedTasks.filter((t) => t.isCompleted).length;
          const progressPercent = updatedTasks.length > 0 ? Math.round((completedCount / updatedTasks.length) * 100) : p.progressPercent;
          return {
            ...p,
            tasks: updatedTasks,
            progressPercent,
            status: progressPercent === 100 ? 'Completed' : p.status === 'Idea' ? 'Development' : p.status,
          };
        }
        return p;
      }),
    }));
  }, []);

  const addProjectTask = useCallback((projectId: string, title: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id === projectId) {
          const newTask = { id: `pt-${Date.now()}`, title, isCompleted: false };
          return { ...p, tasks: [...p.tasks, newTask] };
        }
        return p;
      }),
    }));
  }, []);

  // Notes
  const saveNote = useCallback(
    (note: { id?: string; subjectCode: string; topicId?: string; title: string; contentMarkdown: string; tags?: string[] }) => {
      setState((prev) => {
        const now = new Date().toISOString();
        if (note.id) {
          return {
            ...prev,
            notes: prev.notes.map((n) =>
              n.id === note.id ? { ...n, ...note, updatedAt: now, tags: note.tags || n.tags } : n
            ),
          };
        }
        const newNote: Note = {
          id: `note-${Date.now()}`,
          subjectCode: note.subjectCode,
          topicId: note.topicId,
          title: note.title,
          contentMarkdown: note.contentMarkdown,
          tags: note.tags || [],
          updatedAt: now,
        };
        return {
          ...prev,
          notes: [newNote, ...prev.notes],
        };
      });
    },
    []
  );

  const deleteNote = useCallback((noteId: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== noteId),
    }));
  }, []);

  // Tests & Reviews
  const addTestAttempt = useCallback((attempt: Omit<TestAttempt, 'id' | 'attemptDate'>) => {
    setState((prev) => {
      const newAttempt: TestAttempt = {
        ...attempt,
        id: `test-att-${Date.now()}`,
        attemptDate: new Date().toISOString(),
      };
      const xpGained = Math.round(attempt.score * 1.5);
      const newXp = prev.totalXp + xpGained;
      const { level } = calculateLevelFromXp(newXp);

      return {
        ...prev,
        testAttempts: [newAttempt, ...prev.testAttempts],
        totalXp: newXp,
        level,
      };
    });
  }, []);

  const saveWeeklyReview = useCallback((review: Omit<WeeklyReview, 'id' | 'createdAt'>) => {
    setState((prev) => {
      const newRev: WeeklyReview = {
        ...review,
        id: `rev-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      return {
        ...prev,
        weeklyReviews: [newRev, ...prev.weeklyReviews],
        totalXp: prev.totalXp + 50,
      };
    });
  }, []);

  // Profile & Settings
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
  }, []);

  const toggleExamMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        isExamMode: !prev.profile.isExamMode,
      },
    }));
  }, []);

  // Syllabus & Multi-Semester Admin
  const addSemester = useCallback((semester: Omit<Semester, 'id'>) => {
    setState((prev) => {
      const newSem: Semester = { ...semester, id: `sem-${Date.now()}` };
      return { ...prev, semesters: [...prev.semesters, newSem] };
    });
  }, []);

  const setActiveSemester = useCallback((semesterId: string) => {
    setState((prev) => ({
      ...prev,
      activeSemesterId: semesterId,
      semesters: prev.semesters.map((s) => ({ ...s, isActive: s.id === semesterId })),
    }));
  }, []);

  const updateSubject = useCallback((subjectId: string, updates: Partial<Subject>) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => (s.id === subjectId ? { ...s, ...updates } : s)),
    }));
  }, []);

  const addTopic = useCallback((unitId: string, topic: Partial<Topic>) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => ({
        ...s,
        units: s.units.map((u) => {
          if (u.id === unitId) {
            const newT: Topic = {
              id: `topic-${Date.now()}`,
              unitId,
              title: topic.title || 'New Topic',
              estimatedHours: topic.estimatedHours || 2,
              status: 'NOT_STARTED',
              confidence: 3,
              orderIndex: u.topics.length + 1,
              learnedDone: false,
              practiceDone: false,
              recallDone: false,
              testDone: false,
              resources: topic.resources || [],
              practiceProblems: topic.practiceProblems || [],
              recallQuestions: topic.recallQuestions || [],
              ...topic,
            };
            return { ...u, topics: [...u.topics, newT] };
          }
          return u;
        }),
      })),
    }));
  }, []);

  const updateTopic = useCallback((topicId: string, updates: Partial<Topic>) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => ({
        ...s,
        units: s.units.map((u) => ({
          ...u,
          topics: u.topics.map((t) => (t.id === topicId ? { ...t, ...updates } : t)),
        })),
      })),
    }));
  }, []);

  // Portability
  const exportData = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importData = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        setState((prev) => ({
          ...prev,
          ...parsed,
        }));
        return true;
      }
    } catch (e) {
      console.error('Import failed:', e);
    }
    return false;
  }, []);

  const resetToDefaults = useCallback(() => {
    const defaults = getInitialAppState();
    setState(defaults);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      state,
      isLoaded,
      toggleTask,
      addTask,
      deleteTask,
      rescheduleTask,
      generateTasksForDate,
      updateTopicMastery,
      togglePracticeProblem,
      addStudySession,
      updateDsaProblem,
      addDsaProblem,
      addCodingSession,
      updateProject,
      addProject,
      toggleProjectTask,
      addProjectTask,
      saveNote,
      deleteNote,
      addTestAttempt,
      saveWeeklyReview,
      updateProfile,
      toggleExamMode,
      addSemester,
      setActiveSemester,
      updateSubject,
      addTopic,
      updateTopic,
      awardXp,
      exportData,
      importData,
      resetToDefaults,
    }),
    [
      state,
      isLoaded,
      toggleTask,
      addTask,
      deleteTask,
      rescheduleTask,
      generateTasksForDate,
      updateTopicMastery,
      togglePracticeProblem,
      addStudySession,
      updateDsaProblem,
      addDsaProblem,
      addCodingSession,
      updateProject,
      addProject,
      toggleProjectTask,
      addProjectTask,
      saveNote,
      deleteNote,
      addTestAttempt,
      saveWeeklyReview,
      updateProfile,
      toggleExamMode,
      addSemester,
      setActiveSemester,
      updateSubject,
      addTopic,
      updateTopic,
      awardXp,
      exportData,
      importData,
      resetToDefaults,
    ]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
};

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
}
