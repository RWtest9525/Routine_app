import { DailyTask, Subject, TaskPriority } from './types';
import { weeklyTimetable } from '@/data/initialTimetable';
import { format } from 'date-fns';

export function generateDailyTasksForDate(
  dateStr: string,
  subjects: Subject[],
  backlogTasks: DailyTask[] = []
): DailyTask[] {
  const dateObj = new Date(dateStr);
  const dayName = format(dateObj, 'EEEE');
  const timetableInfo = weeklyTimetable[dayName] || {
    dayName: 'Monday',
    isCollegeDay: true,
    collegeSubjects: ['ADP1', 'CS1', 'ES'],
  };

  const tasks: DailyTask[] = [];
  const uniSubjects = subjects.filter((s) => s.category === 'university');
  const indSubjects = subjects.filter((s) => s.category === 'industry');

  // University Study Block 1 (2:00 PM – 3:30 PM)
  const uniCode1 = timetableInfo.collegeSubjects[0] || 'ADP1';
  const subObj1 = uniSubjects.find((s) => s.code === uniCode1) || uniSubjects[0];
  const firstPendingTopic1 = subObj1?.units.flatMap((u) => u.topics).find((t) => t.status !== 'COMPLETED');
  
  tasks.push({
    id: `task-${dateStr}-uni-1`,
    date: dateStr,
    timeBlock: '2:00 PM – 3:30 PM',
    category: 'university',
    subjectCode: uniCode1,
    topicId: firstPendingTopic1?.id,
    title: `${uniCode1} — ${firstPendingTopic1?.title || 'Algorithmic Problem Solving'}`,
    status: 'pending',
    priority: 'high',
    xpAwarded: 20,
  });

  // Coding / Practice Block (3:45 PM – 5:15 PM)
  tasks.push({
    id: `task-${dateStr}-coding-1`,
    date: dateStr,
    timeBlock: '3:45 PM – 5:15 PM',
    category: 'coding',
    title: 'Solve 3 C Programming / Logic Problems & Practice GCC compilation',
    status: 'pending',
    priority: 'high',
    xpAwarded: 25,
  });

  // University Study Block 2 (5:15 PM – 6:15 PM)
  const uniCode2 = timetableInfo.collegeSubjects[1] || 'IDE';
  const subObj2 = uniSubjects.find((s) => s.code === uniCode2) || uniSubjects[1] || uniSubjects[0];
  const firstPendingTopic2 = subObj2?.units.flatMap((u) => u.topics).find((t) => t.status !== 'COMPLETED');

  tasks.push({
    id: `task-${dateStr}-uni-2`,
    date: dateStr,
    timeBlock: '5:15 PM – 6:15 PM',
    category: 'university',
    subjectCode: uniCode2,
    topicId: firstPendingTopic2?.id,
    title: `${uniCode2} — ${firstPendingTopic2?.title || 'Digital Electronics & Logic Gates'}`,
    status: 'pending',
    priority: 'medium',
    xpAwarded: 20,
  });

  // Industry Skill / Project (8:00 PM – 9:30 PM)
  const indSub = indSubjects[0];
  tasks.push({
    id: `task-${dateStr}-industry-1`,
    date: dateStr,
    timeBlock: '8:00 PM – 9:30 PM',
    category: 'project',
    title: 'Industry Dev: Build CLI Calculator in C & Setup GitHub Repo',
    status: 'pending',
    priority: 'medium',
    xpAwarded: 25,
  });

  // College Revision / Assignment (9:45 PM – 10:45 PM)
  const revSubjects = timetableInfo.collegeSubjects.join(', ');
  tasks.push({
    id: `task-${dateStr}-rev-1`,
    date: dateStr,
    timeBlock: '9:45 PM – 10:45 PM',
    category: 'revision',
    title: `Revise today's college lectures (${revSubjects || 'All Units'}) & complete lab notes`,
    status: 'pending',
    priority: 'medium',
    xpAwarded: 15,
  });

  // Recall + Daily Review (10:45 PM – 11:15 PM)
  tasks.push({
    id: `task-${dateStr}-recall-1`,
    date: dateStr,
    timeBlock: '10:45 PM – 11:15 PM',
    category: 'revision',
    title: 'Active Recall Check & End-of-day Progress Logging',
    status: 'pending',
    priority: 'high',
    xpAwarded: 15,
  });

  // If there are high priority backlog tasks from previous days, distribute 1 or 2 at most
  if (backlogTasks && backlogTasks.length > 0) {
    const topBacklog = backlogTasks.slice(0, 2);
    topBacklog.forEach((bt, idx) => {
      tasks.push({
        ...bt,
        id: `task-${dateStr}-backlog-${idx}`,
        date: dateStr,
        timeBlock: 'Backlog Clearance',
        priority: (bt.priority || 'medium') as TaskPriority,
        title: `[BACKLOG] ${bt.title}`,
        status: 'pending',
      });
    });
  }

  return tasks;
}
