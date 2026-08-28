import { Badge } from './types';

export const initialBadges: Badge[] = [
  {
    id: 'first-topic',
    name: 'First Step',
    description: 'Mastered your first BCA syllabus topic',
    icon: '🎯',
    isUnlocked: false,
    xpValue: 50,
  },
  {
    id: 'first-problem',
    name: 'Code Novice',
    description: 'Solved your first C / DSA problem',
    icon: '⚡',
    isUnlocked: false,
    xpValue: 50,
  },
  {
    id: 'first-project-task',
    name: 'Builder Apprentice',
    description: 'Completed a milestone task on your personal project',
    icon: '🛠️',
    isUnlocked: false,
    xpValue: 75,
  },
  {
    id: 'streak-7',
    name: '7-Day Unstoppable',
    description: 'Maintained a 7-day study and coding streak',
    icon: '🔥',
    isUnlocked: false,
    xpValue: 150,
  },
  {
    id: 'streak-30',
    name: 'Iron Discipline',
    description: 'Maintained a 30-day streak of excellence',
    icon: '👑',
    isUnlocked: false,
    xpValue: 500,
  },
  {
    id: 'dsa-10',
    name: 'DSA Starter',
    description: 'Solved 10 fundamental Data Structure problems',
    icon: '🧩',
    isUnlocked: false,
    xpValue: 200,
  },
  {
    id: 'unit-master',
    name: 'Unit Master',
    description: 'Completed all topics in a full university unit',
    icon: '🏆',
    isUnlocked: false,
    xpValue: 250,
  },
  {
    id: 'first-deployment',
    name: 'Live in Production',
    description: 'Shipped and deployed your first live web project',
    icon: '🚀',
    isUnlocked: false,
    xpValue: 300,
  },
  {
    id: 'bca-architect',
    name: 'Grandmaster Architect',
    description: 'Reached Level 10 in Yash BCA Learning OS',
    icon: '🌟',
    isUnlocked: false,
    xpValue: 1000,
  },
];

export function calculateLevelFromXp(xp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
  title: string;
} {
  const levels = [
    { level: 1, minXp: 0, title: 'BCA Initiate' },
    { level: 2, minXp: 200, title: 'Algorithmic Apprentice' },
    { level: 3, minXp: 500, title: 'Code Craftsman' },
    { level: 4, minXp: 1000, title: 'Systems Explorer' },
    { level: 5, minXp: 1800, title: 'Logic Architect' },
    { level: 6, minXp: 3000, title: 'Data Engineer in Training' },
    { level: 7, minXp: 4500, title: 'Full-Stack Developer' },
    { level: 8, minXp: 6500, title: 'Senior BCA Hacker' },
    { level: 9, minXp: 9000, title: 'Tech Polymath' },
    { level: 10, minXp: 12000, title: 'Grandmaster BCA Architect' },
  ];

  let current = levels[0];
  let next = levels[1];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXp) {
      current = levels[i];
      next = levels[i + 1] || { level: current.level + 1, minXp: current.minXp + 3000, title: 'Supreme Legend' };
      break;
    }
  }

  const range = next.minXp - current.minXp;
  const currentProgress = xp - current.minXp;
  const progressPercent = Math.min(100, Math.round((currentProgress / range) * 100));

  return {
    level: current.level,
    currentLevelXp: currentProgress,
    nextLevelXp: range,
    progressPercent,
    title: current.title,
  };
}
