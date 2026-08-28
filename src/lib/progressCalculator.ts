import { Subject, Topic, Project, DailyTask } from './types';

export interface ProgressSummary {
  academicProgress: number;     // 0 - 100
  industryProgress: number;     // 0 - 100
  projectProgress: number;      // 0 - 100
  overallProgress: number;      // 0 - 100
  totalUniversityTopics: number;
  completedUniversityTopics: number;
  totalIndustryTopics: number;
  completedIndustryTopics: number;
  totalProjects: number;
  completedProjects: number;
}

export function isTopicCompleted(topic: Topic): boolean {
  if (topic.status === 'COMPLETED') return true;
  // If all 4 mastery stages are checked
  if (topic.learnedDone && topic.practiceDone && topic.recallDone && topic.testDone) {
    return true;
  }
  return false;
}

export function calculateTopicMasteryPercentage(topic: Topic): number {
  if (topic.status === 'COMPLETED') return 100;
  let count = 0;
  if (topic.learnedDone) count += 25;
  if (topic.practiceDone) count += 25;
  if (topic.recallDone) count += 25;
  if (topic.testDone) count += 25;
  return count;
}

export function calculateSubjectProgress(subject: Subject): {
  percentage: number;
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  needsRevisionTopics: number;
  currentUnitTitle: string;
  currentTopicTitle: string;
  nextTopicTitle: string;
} {
  let totalTopics = 0;
  let completedTopics = 0;
  let inProgressTopics = 0;
  let needsRevisionTopics = 0;
  
  let currentUnitTitle = '';
  let currentTopicTitle = '';
  let nextTopicTitle = '';
  let foundCurrent = false;

  for (const unit of subject.units) {
    for (const topic of unit.topics) {
      totalTopics++;
      const isComplete = isTopicCompleted(topic);
      if (isComplete) {
        completedTopics++;
      } else if (topic.status === 'IN_PROGRESS') {
        inProgressTopics++;
        if (!foundCurrent) {
          currentUnitTitle = `Unit ${unit.unitNumber}: ${unit.title}`;
          currentTopicTitle = topic.title;
          foundCurrent = true;
        }
      } else if (topic.status === 'NEEDS_REVISION') {
        needsRevisionTopics++;
        if (!foundCurrent) {
          currentUnitTitle = `Unit ${unit.unitNumber}: ${unit.title}`;
          currentTopicTitle = topic.title;
          foundCurrent = true;
        }
      } else {
        // NOT_STARTED
        if (!foundCurrent) {
          currentUnitTitle = `Unit ${unit.unitNumber}: ${unit.title}`;
          currentTopicTitle = topic.title;
          foundCurrent = true;
        } else if (!nextTopicTitle) {
          nextTopicTitle = topic.title;
        }
      }
    }
  }

  if (!currentTopicTitle && totalTopics > 0) {
    currentUnitTitle = `Unit 1: ${subject.units[0]?.title || ''}`;
    currentTopicTitle = subject.units[0]?.topics[0]?.title || 'All Topics Completed';
    nextTopicTitle = 'Semester syllabus mastered! 🎉';
  }

  const percentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return {
    percentage,
    totalTopics,
    completedTopics,
    inProgressTopics,
    needsRevisionTopics,
    currentUnitTitle,
    currentTopicTitle,
    nextTopicTitle: nextTopicTitle || 'Next unit upcoming',
  };
}

export function calculateProgressSummary(
  subjects: Subject[],
  projects: Project[]
): ProgressSummary {
  const universitySubjects = subjects.filter((s) => s.category === 'university');
  const industrySubjects = subjects.filter((s) => s.category === 'industry');

  // Academic Progress
  let totalUniTopics = 0;
  let completedUniTopics = 0;
  for (const sub of universitySubjects) {
    for (const unit of sub.units) {
      for (const topic of unit.topics) {
        totalUniTopics++;
        if (isTopicCompleted(topic)) {
          completedUniTopics++;
        }
      }
    }
  }
  const academicProgress = totalUniTopics > 0 ? Math.round((completedUniTopics / totalUniTopics) * 100) : 0;

  // Industry Progress
  let totalIndTopics = 0;
  let completedIndTopics = 0;
  for (const sub of industrySubjects) {
    for (const unit of sub.units) {
      for (const topic of unit.topics) {
        totalIndTopics++;
        if (isTopicCompleted(topic)) {
          completedIndTopics++;
        }
      }
    }
  }
  const industryProgress = totalIndTopics > 0 ? Math.round((completedIndTopics / totalIndTopics) * 100) : 0;

  // Project Progress
  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === 'Completed' || p.progressPercent === 100).length;
  let sumProjectPercent = 0;
  for (const p of projects) {
    sumProjectPercent += p.progressPercent || 0;
  }
  const projectProgress = totalProjects > 0 ? Math.round(sumProjectPercent / totalProjects) : 0;

  // Overall Weighted Progress: 50% University Academic + 30% Industry Skills + 20% Projects
  const overallProgress = Math.round(academicProgress * 0.5 + industryProgress * 0.3 + projectProgress * 0.2);

  return {
    academicProgress,
    industryProgress,
    projectProgress,
    overallProgress,
    totalUniversityTopics: totalUniTopics,
    completedUniversityTopics: completedUniTopics,
    totalIndustryTopics: totalIndTopics,
    completedIndustryTopics: completedIndTopics,
    totalProjects,
    completedProjects,
  };
}

export function calculateDailyCompletionRate(tasks: DailyTask[]): number {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  return Math.round((completed / tasks.length) * 100);
}
