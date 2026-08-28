export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
}

export async function requestBrowserNotificationPermission(): Promise<'granted' | 'denied' | 'default' | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

export function sendBrowserNotification(opts: NotificationOptions): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    try {
      new Notification(opts.title, {
        body: opts.body,
        icon: opts.icon || '/favicon.ico',
        tag: opts.tag || 'yash-bca-os',
      });
      return true;
    } catch (e) {
      console.warn('Notification constructor failed, attempting service worker:', e);
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(opts.title, {
            body: opts.body,
            icon: opts.icon || '/favicon.ico',
            tag: opts.tag,
          });
        });
        return true;
      }
    }
  }

  return false;
}

export function checkAndTriggerScheduledReminders(notificationTimes: {
  universityReminder: string;
  codingReminder: string;
  projectReminder: string;
  revisionReminder: string;
  dailyReviewReminder: string;
}) {
  if (typeof window === 'undefined' || Notification.permission !== 'granted') {
    return;
  }

  const now = new Date();
  const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const reminders = [
    {
      time: notificationTimes.universityReminder || '13:55',
      title: '🎓 University Study Block Starting',
      body: 'Yash, your university study session starts in 5 minutes. Ready your notes and IDE!',
      tag: 'uni-reminder',
    },
    {
      time: notificationTimes.codingReminder || '15:40',
      title: '🔥 Coding & DSA Time',
      body: 'Coding time! Today’s C & DSA problem-solving session is waiting.',
      tag: 'coding-reminder',
    },
    {
      time: notificationTimes.projectReminder || '19:55',
      title: '🚀 Project Building Session',
      body: 'Project session starts in 5 minutes. Build real-world portfolio assets!',
      tag: 'project-reminder',
    },
    {
      time: notificationTimes.revisionReminder || '21:40',
      title: '📚 College Lecture Revision',
      body: 'Time to solidify today’s Ganpat University lectures and review key formulas.',
      tag: 'rev-reminder',
    },
    {
      time: notificationTimes.dailyReviewReminder || '22:45',
      title: '🎯 Daily Review & Streak Lock',
      body: 'Daily review: Mark completed tasks and review active recall before closing the day.',
      tag: 'review-reminder',
    },
  ];

  for (const r of reminders) {
    if (r.time === currentHHMM) {
      sendBrowserNotification(r);
    }
  }
}
