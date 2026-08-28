import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getMessaging, getToken, onMessage, isSupported as isMessagingSupported } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAamqgeN3SyJAm-N1eqaybdUhEF6ryJ9yM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "routine-app-85d9f.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "routine-app-85d9f",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "routine-app-85d9f.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "355630555126",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:355630555126:web:bd363735eddd29e5aeb1d7",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-JWXLBCL49E"
};

// Initialize Firebase safely for SSR
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Analytics safely (only on client side)
export const initAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(firebaseApp);
    }
  }
  return null;
};

// Request Firebase Cloud Messaging (FCM) Push Token
export const requestFirebasePushToken = async (): Promise<string | null> => {
  try {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const supported = await isMessagingSupported();
      if (!supported) {
        console.warn('Firebase Messaging is not supported in this browser.');
        return null;
      }

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const messaging = getMessaging(firebaseApp);
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        
        const currentToken = await getToken(messaging, {
          serviceWorkerRegistration: registration,
        });

        if (currentToken) {
          console.log('Firebase Cloud Messaging (FCM) Token generated:', currentToken);
          localStorage.setItem('rw_routine_fcm_token', currentToken);
          return currentToken;
        }
      }
    }
  } catch (error) {
    console.error('Error getting Firebase FCM push token:', error);
  }
  return null;
};

// Foreground notification listener
export const onForegroundMessage = (callback: (payload: any) => void) => {
  if (typeof window !== 'undefined') {
    isMessagingSupported().then((supported) => {
      if (supported) {
        const messaging = getMessaging(firebaseApp);
        onMessage(messaging, (payload) => {
          console.log('Foreground FCM notification received:', payload);
          callback(payload);
        });
      }
    });
  }
};
