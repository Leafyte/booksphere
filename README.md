# 📚 BookSphere — College Library Management System

A modern, full-stack college library management system built with **Next.js 16**, **Supabase**, and a bold **neo-brutalist** design aesthetic. Students can browse the catalog, search books, and submit borrow requests. Admins can manage inventory and approve/reject requests — all backed by a real PostgreSQL database with Row Level Security.

---

## 🎨 Design Philosophy

BookSphere uses a **neo-brutalist** design language inspired by the [Wero Wallet](https://wero.eu) aesthetic:

- **Thick black borders** (4px) on all interactive elements
- **Vibrant color palette** — Salmon (`#FF8A7A`), Electric Yellow (`#F9FF73`), Mint Green (`#64E78E`)
- **Uppercase typography** using [Archivo Black](https://fonts.google.com/specimen/Archivo+Black)
- **Brutal box shadows** that shift on hover/active states
- **High contrast** — no rounded corners, no soft gradients, everything is bold and intentional

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 + Custom CSS utilities |
| **UI Components** | shadcn/ui (customized for neo-brutalism) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Database** | PostgreSQL (via Supabase) |
| **Authentication** | Supabase Auth (email/password) |
| **State Management** | Zustand (client-side auth state) |
| **Fonts** | Inter (body), Archivo Black (headings), JetBrains Mono (code) |

---

## 📁 Project Structure

```
db_frontend/
├── app/
│   ├── (auth)/                    # Authentication pages (shared layout)
│   │   ├── admin-login/page.tsx   # Admin login (dark theme)
│   │   ├── login/page.tsx         # Student login
│   │   ├── signup/page.tsx        # Student registration
│   │   └── layout.tsx             # Centered auth layout with blobs
│   │
│   ├── (dashboard)/               # Protected dashboard (requires auth)
│   │   ├── admin/page.tsx         # Admin dashboard — stats, approve/reject requests
│   │   ├── student/page.tsx       # Student dashboard — borrowed books, stats
│   │   ├── student/search/page.tsx# Student catalog search with borrow button
│   │   └── layout.tsx             # Dashboard layout with sidebar
│   │
│   ├── about/page.tsx             # Public about page
│   ├── search/page.tsx            # Public catalog (server-side, no auth needed)
│   ├── page.tsx                   # Home page — hero, stats, featured books
│   ├── layout.tsx                 # Root layout (fonts, metadata)
│   └── globals.css                # Design tokens, brutal utilities, color palette
│
├── components/
│   ├── shared/
│   │   ├── BookCard.tsx           # Reusable book card with borrow button
│   │   ├── Navbar.tsx             # Top navigation (auth-aware)
│   │   ├── Footer.tsx             # Site footer
│   │   └── Sidebar.tsx            # Dashboard sidebar (role-aware)
│   └── ui/                        # shadcn/ui base components
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser-side Supabase client
│   │   ├── server.ts              # Server-side Supabase client (RSC)
│   │   └── middleware.ts          # Session refresh + route protection
│   ├── store.ts                   # Zustand auth store
│   └── utils.ts                   # Tailwind merge utility
│
├── middleware.ts                   # Next.js middleware entry point
├── run_this_first.sql              # Combined: RLS fix + book seeding script
└── supabase_schema.sql             # Full database schema (reference)
```

---

## 🗄 Database Schema

The app uses **3 core tables** in Supabase (PostgreSQL), with Row Level Security (RLS) enabled on all of them.

### `public.users`
Extends Supabase's `auth.users` via a trigger. Created automatically on signup.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | References `auth.users(id)` |
| `student_id` | TEXT | Unique student/staff ID |
| `first_name` | TEXT | User's first name |
| `last_name` | TEXT | User's last name |
| `role` | TEXT | `'student'` or `'admin'` |
| `created_at` | TIMESTAMPTZ | Auto-generated |

### `public.books`
Stores the library inventory. Readable by everyone, writable only by admins.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto-generated |
| `title` | TEXT | Book title |
| `author` | TEXT | Author name |
| `genre` | TEXT | Category (e.g., Mathematics, Algorithms) |
| `cover_url` | TEXT | Optional cover image URL |
| `rack_number` | TEXT | Physical shelf location |
| `inventory_count` | INTEGER | Total copies owned |
| `available_count` | INTEGER | Copies currently available |
| `created_at` | TIMESTAMPTZ | Auto-generated |

### `public.borrow_requests`
Tracks all borrow/return transactions. Includes automated triggers for inventory management.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto-generated |
| `book_id` | UUID (FK) | References `books(id)` |
| `user_id` | UUID (FK) | References `users(id)` |
| `status` | TEXT | `'pending'`, `'approved'`, `'rejected'`, or `'returned'` |
| `borrow_date` | TIMESTAMPTZ | Set automatically on approval |
| `due_date` | TIMESTAMPTZ | Set to 14 days after approval |
| `returned_date` | TIMESTAMPTZ | Set automatically on return |

### Database Triggers

- **`handle_new_user()`** — Automatically creates a `public.users` row when a new user signs up via Supabase Auth
- **`check_book_availability()`** — When a borrow request is approved, decrements `available_count`. When returned, increments it back. Blocks approval if no copies available.

### RLS Policies

- Books are **readable by everyone** (public catalog)
- Users can only **read their own profile**
- Admins can **read all users** and **manage books** (via `is_admin()` SECURITY DEFINER function)
- Students can **create borrow requests** for themselves
- Admins can **update request status** (approve/reject)

---

## 🔐 Authentication Flow

1. **Signup** → Supabase creates `auth.users` row → trigger creates `public.users` row with role `'student'`
2. **Login** → Supabase verifies credentials → frontend fetches user profile from `public.users` → stores in Zustand
3. **Session persistence** → Middleware refreshes Supabase session cookies on every request
4. **Route protection** → Middleware redirects unauthenticated users away from `/student/*` and `/admin/*`
5. **Admin access** → Must be manually promoted by changing `role` to `'admin'` in the `users` table

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- A **Supabase** project (free tier works)

### 1. Clone and Install

```bash
git clone <repo-url>
cd db_frontend
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> Find these in your Supabase Dashboard → Settings → API.

### 3. Set Up the Database

Run these SQL scripts **in order** in your **Supabase Dashboard → SQL Editor**:

1. **`supabase_schema.sql`** — Creates all tables, RLS policies, and triggers
2. **`run_this_first.sql`** — Fixes RLS recursion bug + seeds 60 academic textbooks

### 4. Configure Auth Settings

In your **Supabase Dashboard → Authentication → Providers → Email**:

- ✅ Enable Email provider
- ❌ **Disable "Confirm email"** (required for local development)

### 5. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 👤 User Roles

### Student
- Browse the public catalog
- Search and filter books by genre
- Submit borrow requests
- View borrow history and due dates

### Admin
- View all borrow requests
- Approve or reject pending requests
- See library-wide statistics (total books, students, pending requests)

**To create an admin:** Sign up normally as a student, then go to **Supabase → Table Editor → `users`** and change the `role` column from `student` to `admin`.

---

## 📄 Available Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home page — hero, featured books, categories, stats |
| `/search` | Public | Full catalog with search and category filtering |
| `/about` | Public | About the library system |
| `/login` | Public | Student login form |
| `/signup` | Public | Student registration form |
| `/admin-login` | Public | Admin login form (dark theme) |
| `/student` | Auth | Student dashboard — borrowed books, stats |
| `/student/search` | Auth | Student catalog with borrow functionality |
| `/admin` | Admin | Admin dashboard — requests, approvals, stats |

---

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.2.6 | React framework |
| `@supabase/ssr` | 0.10.3 | Server-side Supabase client |
| `@supabase/supabase-js` | 2.105.4 | Supabase JavaScript client |
| `zustand` | 5.0.13 | Lightweight state management |
| `framer-motion` | 12.38.0 | Animations |
| `lucide-react` | 1.16.0 | Icon library |
| `tailwindcss` | 4.x | Utility-first CSS |
| `shadcn` | 4.7.0 | UI component library |

---

## 📜 SQL Scripts

| File | Purpose |
|------|---------|
| `supabase_schema.sql` | Full database schema — tables, RLS policies, triggers |
| `run_this_first.sql` | Fixes RLS infinite recursion + seeds 60 textbooks from Semester III & IV syllabus |

---

## 🎓 Book Collection

The seeded catalog includes **60 academic textbooks** across **9 genres**:

| Genre | Books | Example Titles |
|-------|-------|---------------|
| Mathematics | 18 | Higher Engineering Mathematics, Linear Algebra, Probability |
| Data Structures | 4 | Fundamentals of Data Structures in C, Schaum's Outlines |
| Operating Systems | 4 | Operating System Concepts, Modern Operating Systems |
| Computer Organization | 2 | Computer Organization, Computer Architecture |
| Algorithms | 4 | Algorithm Design, Introduction to Algorithms |
| Software Engineering | 4 | Software Engineering, A Practitioner's Approach |
| Database Management | 4 | Database System Concepts, Fundamentals of DBMS |
| Biology | 6 | Biology for Engineers, Bioinformatics |
| Humanities / Ethics | 14 | Human Values, Story of My Experiments with Truth |

---

## 📝 License

This project was built as a **DBMS course project** for academic purposes.