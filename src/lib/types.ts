export type SubjectCategory = 'university' | 'industry';

export type TopicStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'NEEDS_REVISION';

export interface TopicResource {
  id: string;
  title: string;
  url: string;
  type: 'youtube' | 'docs' | 'notes' | 'practice';
}

export interface PracticeProblem {
  id: string;
  title: string;
  isCompleted: boolean;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface TopicRecall {
  question: string;
  hint?: string;
}

export interface Topic {
  id: string;
  unitId: string;
  title: string;
  estimatedHours: number;
  status: TopicStatus;
  confidence: number; // 1 to 5 stars
  orderIndex: number;
  
  // 4-Stage Mastery Checklist
  learnedDone: boolean;
  practiceDone: boolean;
  recallDone: boolean;
  testDone: boolean;
  
  resources: TopicResource[];
  practiceProblems: PracticeProblem[];
  recallQuestions: TopicRecall[];
  notesMarkdown?: string;
  completedAt?: string;
  lastStudiedAt?: string;
}

export interface Unit {
  id: string;
  subjectId: string;
  unitNumber: number;
  title: string;
  description: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  semesterId: string;
  code: string;
  name: string;
  category: SubjectCategory;
  credits: number;
  color: string;
  iconName: string;
  description: string;
  units: Unit[];
}

export interface Semester {
  id: string;
  number: number;
  title: string;
  academicYear: string;
  startDate: string; // '2026-08-28'
  endDate: string;   // '2027-02-28'
  isActive: boolean;
  syllabusPdfUrl?: string;
  syllabusVersion?: string;
}

export type TaskCategory = 'university' | 'coding' | 'industry' | 'project' | 'revision';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'completed' | 'skipped';

export interface DailyTask {
  id: string;
  date: string; // 'YYYY-MM-DD'
  timeBlock: string; // e.g., '2:00 PM – 3:30 PM'
  category: TaskCategory;
  title: string;
  subjectCode?: string;
  topicId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  xpAwarded: number;
  completedAt?: string;
  notes?: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  subjectCode: string;
  topicId?: string;
  topicTitle?: string;
  durationMinutes: number;
  category: TaskCategory;
  date: string; // 'YYYY-MM-DD'
  timestamp: string;
  notes?: string;
}

export interface DsaProblem {
  id: string;
  title: string;
  category: string; // 'Arrays', 'Strings', 'Searching', 'Sorting', 'Linked Lists', 'Stack', 'Queue', 'Hashing', 'Recursion', 'Complexity'
  difficulty: 'Easy' | 'Medium' | 'Hard';
  source: string; // 'LeetCode', 'CodeChef', 'GeeksForGeeks', 'College Lab', 'HackerRank'
  status: 'NOT_ATTEMPTED' | 'ATTEMPTED' | 'SOLVED' | 'NEEDS_REVISION';
  attempts: number;
  solvedDate?: string;
  notes?: string;
  confidence: number; // 1-5
  url?: string;
}

export interface CodingSession {
  id: string;
  date: string;
  language: string; // 'C', 'JavaScript', 'SQL', 'Python', etc.
  durationMinutes: number;
  problemsCount: number;
  learnings: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  notes?: string;
}

export type ProjectStatus = 'Idea' | 'Planning' | 'Development' | 'Testing' | 'Deployed' | 'Completed';

export interface ProjectTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  status: ProjectStatus;
  startDate: string;
  targetDate: string;
  githubUrl?: string;
  liveUrl?: string;
  progressPercent: number;
  features: string[];
  tasks: ProjectTask[];
  notes?: string;
  screenshots?: string[];
}

export interface TestQuestion {
  id: string;
  question: string;
  options?: string[];
  correctOptionIndex?: number;
  explanation?: string;
  type: 'mcq' | 'short_answer' | 'coding';
}

export interface Test {
  id: string;
  subjectCode: string;
  unitNumber: number;
  title: string;
  questions: TestQuestion[];
  durationMinutes: number;
}

export interface TestAttempt {
  id: string;
  testId: string;
  subjectCode: string;
  unitTitle: string;
  score: number;
  totalMarks: number;
  percentage: number;
  weakTopics: string[];
  attemptDate: string;
  recommendations: string[];
}

export interface Note {
  id: string;
  subjectCode: string;
  topicId?: string;
  title: string;
  contentMarkdown: string;
  tags: string[];
  updatedAt: string;
}

export interface WeeklyReview {
  id: string;
  weekStartDate: string;
  studyHours: number;
  codingHours: number;
  topicsCompleted: number;
  problemsSolved: number;
  projectsProgress: string;
  universityProgress: number;
  industryProgress: number;
  whatWentWell: string;
  whatWasDifficult: string;
  whatShouldImprove: string;
  weakTopics: string[];
  nextWeekPriorities: string[];
  createdAt: string;
}

export interface UserProfile {
  name: string;
  college: string;
  degree: string;
  currentSemester: string;
  planStartDate: string;
  planEndDate: string;
  timezone: string;
  studyStartTime: string;
  studyEndTime: string;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  isExamMode: boolean;
  examModeTargetDate?: string;
  gamificationEnabled: boolean;
  notificationsEnabled: boolean;
  minDailySuccessPercent: number; // default 70
  notificationTimes: {
    universityReminder: string; // '13:55'
    codingReminder: string;     // '15:40'
    projectReminder: string;    // '19:55'
    revisionReminder: string;   // '21:40'
    dailyReviewReminder: string;// '22:45'
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  xpValue: number;
}

export interface AppState {
  profile: UserProfile;
  semesters: Semester[];
  activeSemesterId: string;
  subjects: Subject[];
  dailyTasks: DailyTask[];
  studySessions: StudySession[];
  dsaProblems: DsaProblem[];
  codingSessions: CodingSession[];
  projects: Project[];
  testAttempts: TestAttempt[];
  notes: Note[];
  weeklyReviews: WeeklyReview[];
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  level: number;
  badges: Badge[];
  lastActiveDate: string;
}
