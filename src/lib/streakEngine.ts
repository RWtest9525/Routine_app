import { DailyTask } from './types';
import { format, subDays, differenceInCalendarDays, parseISO } from 'date-fns';

export function calculateDailySuccess(tasks: DailyTask[], minSuccessThreshold: number = 70): boolean {
  if (!tasks || tasks.length === 0) return false;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const percentage = (completedCount / tasks.length) * 100;
  return percentage >= minSuccessThreshold;
}

export function updateStreakRecord(
  allDailyTasks: DailyTask[],
  currentStreak: number,
  longestStreak: number,
  minSuccessThreshold: number = 70
): { currentStreak: number; longestStreak: number; streakActiveToday: boolean } {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  // Group tasks by date
  const dateMap: Record<string, DailyTask[]> = {};
  allDailyTasks.forEach((t) => {
    if (!dateMap[t.date]) dateMap[t.date] = [];
    dateMap[t.date].push(t);
  });

  const isTodaySuccessful = calculateDailySuccess(dateMap[todayStr] || [], minSuccessThreshold);
  const isYesterdaySuccessful = calculateDailySuccess(dateMap[yesterdayStr] || [], minSuccessThreshold);

  // If today is successful, streak is definitely active
  // If today isn't successful yet but yesterday was, current streak is preserved (pending today)
  let newCurrentStreak = currentStreak;

  // Let's compute actual consecutive days count backwards from yesterday or today
  let streakCount = 0;
  let checkDate = new Date();
  
  // If today is successful, start count from today
  if (isTodaySuccessful) {
    streakCount++;
    checkDate = subDays(checkDate, 1);
  } else {
    // If today is not yet done, check from yesterday
    checkDate = subDays(checkDate, 1);
  }

  while (true) {
    const dStr = format(checkDate, 'yyyy-MM-dd');
    const dayTasks = dateMap[dStr];
    if (dayTasks && calculateDailySuccess(dayTasks, minSuccessThreshold)) {
      streakCount++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  newCurrentStreak = Math.max(streakCount, isTodaySuccessful ? 1 : currentStreak);
  const newLongestStreak = Math.max(longestStreak, newCurrentStreak);

  return {
    currentStreak: newCurrentStreak,
    longestStreak: newLongestStreak,
    streakActiveToday: isTodaySuccessful,
  };
}
