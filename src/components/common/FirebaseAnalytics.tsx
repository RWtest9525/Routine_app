'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/firebase';

export const FirebaseAnalytics: React.FC = () => {
  useEffect(() => {
    initAnalytics().catch((err) => {
      console.warn('Firebase Analytics not supported or failed to initialize:', err);
    });
  }, []);

  return null;
};
