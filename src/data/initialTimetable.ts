export interface TimetableDay {
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isCollegeDay: boolean;
  collegeSubjects: string[];
  notes?: string;
}

export const weeklyTimetable: Record<string, TimetableDay> = {
  Monday: {
    dayName: 'Monday',
    isCollegeDay: true,
    collegeSubjects: ['ADP1', 'CS1', 'ES', 'IDE'],
    notes: '8:30 AM – 12:30 PM College Lectures',
  },
  Tuesday: {
    dayName: 'Tuesday',
    isCollegeDay: true,
    collegeSubjects: ['DADM', 'IWD1', 'ITS'],
    notes: '8:30 AM – 12:30 PM College Lectures',
  },
  Wednesday: {
    dayName: 'Wednesday',
    isCollegeDay: true,
    collegeSubjects: ['DADM', 'ADP1', 'IDE', 'IWD1'],
    notes: '8:30 AM – 12:30 PM College Lectures',
  },
  Thursday: {
    dayName: 'Thursday',
    isCollegeDay: true,
    collegeSubjects: ['ADP1', 'ITS', 'CS1', 'IWD1'],
    notes: '8:30 AM – 12:30 PM College Lectures',
  },
  Friday: {
    dayName: 'Friday',
    isCollegeDay: true,
    collegeSubjects: ['ADP1', 'IDE', 'DADM'],
    notes: '8:30 AM – 12:30 PM College Lectures',
  },
  Saturday: {
    dayName: 'Saturday',
    isCollegeDay: false, // 3rd & 4th Saturday sessions, 1st, 2nd, 5th holidays
    collegeSubjects: ['ADP1', 'IWD1'],
    notes: '3rd & 4th Saturday: College Sessions. 1st, 2nd, 5th Saturday: Self-Study / Deep Project Day',
  },
  Sunday: {
    dayName: 'Sunday',
    isCollegeDay: false,
    collegeSubjects: [],
    notes: 'Weekly Review, Backlog Clearance, Mock Tests & Project Sprint',
  },
};

export const defaultDailyScheduleBlocks = [
  { time: '07:00 – 08:00', title: 'Breakfast & Morning Routine', type: 'meal' },
  { time: '08:30 – 12:30', title: 'Ganpat University College Lectures / Labs', type: 'college' },
  { time: '13:00 – 14:00', title: 'Lunch & Relaxation Break', type: 'meal' },
  { time: '14:00 – 15:30', title: 'University Deep Study (Block 1)', type: 'study', category: 'university' },
  { time: '15:30 – 15:45', title: 'Short Break / Hydration ☕', type: 'break' },
  { time: '15:45 – 17:15', title: 'Coding Practice & DSA Problem Solving', type: 'study', category: 'coding' },
  { time: '17:15 – 18:15', title: 'Second University Study (Block 2)', type: 'study', category: 'university' },
  { time: '18:15 – 19:00', title: 'Break / Exercise / Personal Recharge 🏃', type: 'break' },
  { time: '19:00 – 20:00', title: 'Dinner & Family Time 🍽️', type: 'meal' },
  { time: '20:00 – 21:30', title: 'Industry Skill / Real-World Project Development 🚀', type: 'study', category: 'project' },
  { time: '21:30 – 21:45', title: 'Short Break 🧘', type: 'break' },
  { time: '21:45 – 22:45', title: 'College Lecture Revision & Assignment Work 📚', type: 'study', category: 'revision' },
  { time: '22:45 – 23:15', title: 'Active Recall & End-of-Day Review Checklist 🎯', type: 'study', category: 'revision' },
  { time: '23:15 – 00:00', title: 'Light Tech Reading / Day Planning / Wind Down 🌙', type: 'free' },
];
