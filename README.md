# 🚀 Yash BCA Learning OS

A personal 3-year BCA Learning & Productivity Operating System architected for **Yash Vishal**, a student at **Ganpat University, Gujarat**.

---

## 🌟 Key Features

1. **Dual Track Architecture**:
   - 🎓 **Ganpat University Academic Syllabus**: Exact Semester-I curriculum across all 7 subjects (`ADP1`, `DADM`, `IWD1`, `ITS`, `CS1`, `IDE`, `ES`) with complete unit/topic hierarchy.
   - 🚀 **Industry / Career Skills**: 12 practical tracks (C, Modern Web, DSA, SQL, Git/GitHub, Linux) tracked independently to prevent double-counting.
2. **4-Stage Mastery Verification**:
   - Every topic requires 4 distinct proof points before completion:
     - `[✓] Learned Concept Deeply`
     - `[✓] Practiced / Coded Hands-on`
     - `[✓] Active Recall / Can Explain`
     - `[✓] Tested / Problem Solved`
3. **Smart Daily Scheduler & Backlog Engine**:
   - Tailored around your Ganpat University lecture hours (`8:30 AM – 12:30 PM`) and main self-study period (`2:00 PM – 12:00 AM`) excluding meal times (`Breakfast: 7–8 AM`, `Lunch: 1–2 PM`, `Dinner: 7–8 PM`).
   - Missing tasks distributes the backlog across future days based on priority (🔴 High, 🟡 Medium, 🟢 Low) without overloading tomorrow.
4. **Deep Productivity & Practice Tools**:
   - **Pomodoro Study Timer**: Auto-logs focused minutes directly into subject analytics.
   - **DSA & Problem Solving Tracker**: 10 algorithmic categories with difficulty, source, attempts, and confidence rating.
   - **Project Portfolio**: 9 pre-seeded Semester-1 projects with milestone task checklists.
   - **Interactive Calendar**: Month, week, and day views with color-coded consistency heatmaps.
   - **Notes & Knowledge Vault**: Subject-tagged Markdown notes with instant search.
   - **Weekly Reflections**: Sunday review prompts to lock in wins and set the next week's top 3 priorities.
5. **AI Study Coach**:
   - Context-aware intelligence providing tailored guidance on what to study, identifying weak areas, and running Feynman active recall quizzes.
6. **Multi-Semester Scalability & Syllabus Manager**:
   - Scalable across Semesters I through VI. Reference original PDF documents, dynamically create subjects/units/topics, and update curricula safely without deleting past progress.
7. **PWA & Real Browser Notifications**:
   - Installable on desktop and mobile with Web App Manifest and Service Worker.
   - Scheduled browser notifications (1:55 PM University, 3:40 PM Coding, 7:55 PM Project, 9:40 PM Revision, 10:45 PM Daily Review).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript + React 18
- **Styling**: Tailwind CSS + Custom Design System + Glassmorphism
- **Charts**: Recharts
- **Icons**: Lucide React
- **Persistence**: Reactive Store + LocalStorage + Supabase PostgreSQL Client Layer
- **PWA**: Service Worker (`sw.js`) + Web App Manifest (`manifest.json`)

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run the development server
npm run dev

# 3. Open http://localhost:3000 in your browser
```

---

## 🗄️ Database Setup (Optional Cloud Sync)

The application runs **100% locally and offline** out of the box.

To connect your Supabase cloud PostgreSQL database:
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the SQL Editor in Supabase and run `supabase_schema.sql`.
3. Copy your project URL and anon public key to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

---

## 📱 Installing as a PWA

1. Open the app in Chrome/Brave/Edge or Safari on iOS.
2. Click the **Install App** icon in the URL bar (or "Add to Home Screen" on mobile).
3. The app will install as a native standalone window.
