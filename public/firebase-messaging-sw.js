// Firebase Messaging Service Worker for RW Routine App (com.rw.routineapp)
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAamqgeN3SyJAm-N1eqaybdUhEF6ryJ9yM",
  authDomain: "routine-app-85d9f.firebaseapp.com",
  projectId: "routine-app-85d9f",
  storageBucket: "routine-app-85d9f.firebasestorage.app",
  messagingSenderId: "355630555126",
  appId: "1:355630555126:web:bd363735eddd29e5aeb1d7",
  measurementId: "G-JWXLBCL49E"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message: ', payload);
  const notificationTitle = payload.notification?.title || 'RW Routine App Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a scheduled study or revision session.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
