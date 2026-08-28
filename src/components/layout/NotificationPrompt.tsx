'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, X } from 'lucide-react';
import { requestBrowserNotificationPermission, sendBrowserNotification } from '@/lib/notificationEngine';
import { requestFirebasePushToken, onForegroundMessage } from '@/lib/firebase';

export const NotificationPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        const dismissed = localStorage.getItem('yash_notification_prompt_dismissed');
        if (!dismissed) {
          setShowPrompt(true);
        }
      }

      // Listen for foreground Firebase push notifications
      onForegroundMessage((payload) => {
        const title = payload.notification?.title || 'RW Routine App';
        const body = payload.notification?.body || 'New study update received.';
        sendBrowserNotification({ title, body });
      });
    }
  }, []);

  const handleEnable = async () => {
    const perm = await requestBrowserNotificationPermission();
    if (perm === 'granted') {
      // Also register Firebase Cloud Messaging Push Token
      await requestFirebasePushToken();

      sendBrowserNotification({
        title: '🔔 Notifications & Firebase Push Enabled!',
        body: 'You will receive study, coding, and revision reminders throughout your BCA journey.',
      });
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('yash_notification_prompt_dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="mx-4 lg:mx-8 mt-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900/80 to-cyan-950/60 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex-shrink-0">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            Enable Study & Revision Reminders (RW Routine App)
          </h4>
          <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
            Get real-time browser & Firebase Cloud Messaging (FCM) notifications prior to your University deep study blocks (1:55 PM), Coding sprints (3:40 PM), Projects (7:55 PM), and daily review (10:45 PM).
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
        <button
          onClick={handleEnable}
          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          Enable Notifications
        </button>
        <button
          onClick={handleDismiss}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          aria-label="Dismiss notification banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
