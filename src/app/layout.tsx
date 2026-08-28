import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import '@/styles/globals.css';
import { AppStoreProvider } from '@/lib/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { NotificationPrompt } from '@/components/layout/NotificationPrompt';
import { ExamModeBanner } from '@/components/layout/ExamModeBanner';
import { FirebaseAnalytics } from '@/components/common/FirebaseAnalytics';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Yash BCA Learning OS — Ganpat University',
  description: 'Personal 3-Year BCA Learning & Operating System for Yash Vishal (Semester I - VI)',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${firaCode.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-[#090d16] text-slate-100 min-h-screen flex flex-col antialiased">
        <AppStoreProvider>
          <FirebaseAnalytics />
          <div className="flex min-h-screen">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:pl-64 min-w-0 pb-20 lg:pb-8">
              <Header />
              <NotificationPrompt />
              <ExamModeBanner />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
            </div>
          </div>

          {/* Mobile Bottom Navigation */}
          <MobileNav />
        </AppStoreProvider>
      </body>
    </html>
  );
}
