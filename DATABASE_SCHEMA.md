# Database Schema Documentation — Yash BCA Learning OS

The system utilizes a dual-tier persistence engine:
1. **Client-Side Reactive Persistent Engine** (IndexedDB / LocalStorage) with zero cold-start delay, active state reactivity, full JSON backup export/import, and automatic cross-session synchronization.
2. **Cloud PostgreSQL Database** via Supabase client layer with Row Level Security (RLS) policies.

---

## 📊 Relational Schema Overview

### 1. `profiles`
User metadata, college affiliation, academic timings, meal hours, and notification preferences.
- `id` (UUID, Primary Key, Foreign Key -> `auth.users.id`)
- `name` (TEXT, e.g. "Yash Vishal")
- `college` (TEXT, e.g. "Ganpat University")
- `degree` (TEXT, e.g. "BCA")
- `current_semester` (TEXT, e.g. "Semester I")
- `plan_start_date` (DATE, `2026-08-28`)
- `plan_end_date` (DATE, `2027-02-28`)
- `study_start_time` (TEXT, `14:00`)
- `study_end_time` (TEXT, `00:00`)
- `breakfast_time` (TEXT, `07:00 - 08:00`)
- `lunch_time` (TEXT, `13:00 - 14:00`)
- `dinner_time` (TEXT, `19:00 - 20:00`)
- `is_exam_mode` (BOOLEAN, default `false`)
- `gamification_enabled` (BOOLEAN, default `true`)
- `min_daily_success_percent` (INT, default `70`)

---

### 2. `semesters`
Multi-semester tracking table scaling from Semester I through VI.
- `id` (UUID, PK)
- `number` (INT, 1 to 6)
- `title` (TEXT, e.g. "Semester I")
- `academic_year` (TEXT, e.g. "2026–2027")
- `start_date` (DATE)
- `end_date` (DATE)
- `is_active` (BOOLEAN)
- `syllabus_pdf_url` (TEXT)
- `syllabus_version` (TEXT)

---

### 3. `subjects`
- `id` (UUID, PK)
- `semester_id` (UUID, FK -> `semesters.id`)
- `code` (TEXT, e.g. "ADP1", "DADM", "IWD1", "ITS", "CS1", "IDE", "ES")
- `name` (TEXT)
- `category` (TEXT, 'university' | 'industry')
- `credits` (INT)
- `color` (TEXT, hex)
- `icon_name` (TEXT)
- `description` (TEXT)

---

### 4. `units`
- `id` (UUID, PK)
- `subject_id` (UUID, FK -> `subjects.id`)
- `unit_number` (INT)
- `title` (TEXT)
- `description` (TEXT)

---

### 5. `topics`
Core mastery entity with 4-stage validation rules:
- `id` (UUID, PK)
- `unit_id` (UUID, FK -> `units.id`)
- `title` (TEXT)
- `estimated_hours` (NUMERIC)
- `status` (TEXT: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'NEEDS_REVISION')
- `confidence` (INT, 1 to 5)
- `order_index` (INT)
- `learned_done` (BOOLEAN)
- `practice_done` (BOOLEAN)
- `recall_done` (BOOLEAN)
- `test_done` (BOOLEAN)
- `notes_markdown` (TEXT)
- `completed_at` (TIMESTAMPTZ)
- `last_studied_at` (TIMESTAMPTZ)

---

### 6. `daily_tasks`
- `id` (UUID, PK)
- `user_id` (UUID, FK -> `auth.users.id`)
- `date` (DATE)
- `time_block` (TEXT, e.g. '2:00 PM – 3:30 PM')
- `category` (TEXT: 'university' | 'coding' | 'industry' | 'project' | 'revision')
- `title` (TEXT)
- `subject_code` (TEXT)
- `topic_id` (UUID, FK -> `topics.id`)
- `status` (TEXT: 'pending' | 'completed' | 'skipped')
- `priority` (TEXT: 'high' | 'medium' | 'low')
- `xp_awarded` (INT)
- `completed_at` (TIMESTAMPTZ)

---

### 7. `study_sessions` (Focus Timer Sessions)
- `id` (UUID, PK)
- `user_id` (UUID, FK -> `auth.users.id`)
- `subject_id` (UUID, FK -> `subjects.id`)
- `subject_code` (TEXT)
- `topic_id` (UUID, FK -> `topics.id`)
- `duration_minutes` (INT)
- `category` (TEXT)
- `date` (DATE)
- `notes` (TEXT)

---

### 8. `dsa_problems` & `coding_sessions`
- `id` (UUID, PK)
- `title` (TEXT)
- `category` (TEXT: 'Arrays', 'Strings', 'Searching', 'Sorting', 'Linked Lists', 'Stack', 'Queue', 'Hashing', 'Recursion', 'Complexity')
- `difficulty` (TEXT: 'Easy' | 'Medium' | 'Hard')
- `source` (TEXT: 'LeetCode', 'CodeChef', 'GeeksForGeeks', 'College Lab')
- `status` (TEXT: 'NOT_ATTEMPTED' | 'ATTEMPTED' | 'SOLVED' | 'NEEDS_REVISION')
- `attempts` (INT)
- `confidence` (INT)
- `solved_date` (TIMESTAMPTZ)
- `url` (TEXT)

---

### 9. `projects` & `project_tasks`
- `id` (UUID, PK)
- `title` (TEXT)
- `description` (TEXT)
- `tech_stack` (TEXT[])
- `status` (TEXT: 'Idea' | 'Planning' | 'Development' | 'Testing' | 'Deployed' | 'Completed')
- `github_url` (TEXT)
- `live_url` (TEXT)
- `progress_percent` (INT)
