# 📁 BookSphere — File-by-File Documentation

> **Project:** BookSphere — College Library Management System  
> **College:** Vidyavardhaka College of Engineering, Mysuru  
> **Stack:** Next.js 16 · Supabase · Tailwind CSS 4 · TypeScript

---

## Root Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Defines project dependencies (Next.js, Supabase, Zustand, Framer Motion, shadcn/ui, Lucide icons) and npm scripts (`dev`, `build`, `start`, `lint`). |
| `package-lock.json` | Auto-generated lockfile ensuring exact dependency versions across installs. |
| `tsconfig.json` | TypeScript compiler configuration. Sets up path aliases (`@/` → project root) and strict type checking. |
| `next.config.ts` | Next.js framework configuration. Minimal — uses defaults with Turbopack for fast dev builds. |
| `postcss.config.mjs` | PostCSS configuration for processing Tailwind CSS. |
| `eslint.config.mjs` | ESLint configuration extending `next/core-web-vitals` for code quality checks. |
| `components.json` | shadcn/ui configuration — defines component paths, Tailwind CSS version, and style conventions. |
| `next-env.d.ts` | Auto-generated TypeScript declarations for Next.js types. Do not edit manually. |
| `.env.local` | **Secret** — Contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Not committed to git. |
| `.env.local.example` | Template showing which environment variables are required. |
| `.gitignore` | Specifies files/folders excluded from version control (node_modules, .next, .env.local, etc.). |
| `AGENTS.md` | Instructions for AI coding agents about Next.js 16 breaking changes. |

---

## SQL Scripts

| File | Purpose |
|------|---------|
| `supabase_schema.sql` | **Full database schema.** Creates all 3 tables (`users`, `books`, `borrow_requests`), enables Row Level Security (RLS), defines all RLS policies, and sets up two database triggers: `handle_new_user()` (auto-creates user profile on signup) and `check_book_availability()` (manages inventory on borrow/return). |
| `run_this_first.sql` | **Combined initialization script.** Fixes the RLS infinite recursion bug by creating an `is_admin()` SECURITY DEFINER function, drops and recreates problematic policies, then seeds 60 academic textbooks across 9 genres into the `books` table. Run this in Supabase SQL Editor after `supabase_schema.sql`. |

---

## Middleware

| File | Purpose |
|------|---------|
| `middleware.ts` | **Next.js middleware entry point.** Imports and delegates to `lib/supabase/middleware.ts`. Runs on every request to refresh Supabase auth cookies. |
| `lib/supabase/middleware.ts` | **Route protection logic.** Refreshes the Supabase session on every request. Redirects unauthenticated users away from `/student/*` and `/admin/*` routes to `/login`. Explicitly excludes `/admin-login` from protection so admins can reach the login page. |

---

## Supabase Client Libraries

| File | Purpose |
|------|---------|
| `lib/supabase/client.ts` | **Browser-side Supabase client.** Uses `createBrowserClient()` from `@supabase/ssr`. Used in all `"use client"` components for querying data, submitting borrow requests, and managing auth state. |
| `lib/supabase/server.ts` | **Server-side Supabase client.** Uses `createServerClient()` with cookie-based auth. Used in Server Components (RSC) like the home page, catalog, and new arrivals to fetch data during server rendering. |

---

## State Management

| File | Purpose |
|------|---------|
| `lib/store.ts` | **Zustand auth store.** Manages client-side authentication state (`user`, `isAuthenticated`). Stores user info (name, email, role) after login. Provides `login()` and `logout()` actions. Used by `Navbar`, `Sidebar`, and dashboard pages to determine UI state. |

---

## Utilities

| File | Purpose |
|------|---------|
| `lib/utils.ts` | **Tailwind merge utility.** Exports a `cn()` function that merges Tailwind CSS class names using `clsx` and `tailwind-merge` to prevent class conflicts. Used throughout all components. |

---

## Root Layout & Styles

| File | Purpose |
|------|---------|
| `app/layout.tsx` | **Root layout.** Wraps the entire app with `<html>` and `<body>` tags. Loads 3 Google Fonts: Inter (body text), Archivo Black (headings), and JetBrains Mono (code). Sets page metadata (title: "BookSphere \| College Library System"). |
| `app/globals.css` | **Design system.** Defines the complete neo-brutalist theme: color palette (Wero Wallet inspired — salmon, yellow, green, purple, blue), CSS custom properties for light/dark mode, brutal shadow utilities (`brutal-shadow`, `brutal-hover`, `brutal-active`), font-family assignments, and the gradient utility `.bg-gradient-wero`. |
| `app/favicon.ico` | **Browser tab icon.** Custom-generated BookSphere favicon — an open book on a salmon background. |
| `app/icon.png` | **App icon.** Higher resolution (180×180) version of the favicon for PWA/mobile bookmarks. |

---

## Public Pages (No Auth Required)

### `app/page.tsx` — Home Page
The landing page. Fetches real books from Supabase and displays:
- Hero section with animated gradient background
- Working search bar that navigates to `/search?q=...`
- Category cards linking to filtered catalog views
- Featured books grid (first 8 books from database)
- Library statistics (total books, active students, etc.)
- Shared `Navbar` and `Footer` components

### `app/search/page.tsx` — Public Catalog
Server-rendered catalog page. Accepts `?q=` and `?genre=` URL parameters.
- Fetches books from Supabase with server-side filtering
- Genre filter buttons (All, Mathematics, Data Structures, etc.)
- Responsive grid of `BookCard` components
- Uses `await searchParams` (Next.js 16 async API)
- No login required to browse

### `app/about/page.tsx` — About Page
Static page with real VVCE library information:
- Library history (est. 1997, 1,023 sq. meters)
- Stats cards (39,690 books, 8,082 titles, 81 journals, 210 seats)
- Infrastructure section (25 PCs, Wi-Fi, DELNET membership)
- Library services list (Lending, Reference, OPAC, etc.)
- Open access resource links (NPTEL, NDL, DOAJ, Project Gutenberg)

### `app/new-arrivals/page.tsx` — New Arrivals
Server-rendered page showing the 20 most recently added books:
- Fetches from `books` table ordered by `created_at DESC`
- Displays as a grid of `BookCard` components
- Hero section with "Fresh Off the Shelves" banner

### `app/top-borrowed/page.tsx` — Top Borrowed
Server-rendered leaderboard of most popular books:
- Aggregates borrow counts from `borrow_requests` table (approved + returned)
- Ranks books by borrow frequency
- Trophy icon for #1, numbered ranks for the rest
- Shows borrow count and book details per entry
- Empty state message when no borrows exist yet

### `app/library-rules/page.tsx` — Library Rules
Static page with 6 rule cards based on VVCE library policies:
- Borrowing Policy, Due Dates & Returns, Book Care
- Library Conduct, Digital Services, Library Services
- Penalty notice section (red destructive styling)
- "Library at a Glance" stats bar at the bottom

---

## Authentication Pages

### `app/(auth)/layout.tsx` — Auth Layout
Shared layout for login/signup pages:
- Centered card layout with decorative background blobs
- No `Navbar` or `Footer` — clean, focused auth experience

### `app/(auth)/login/page.tsx` — Student Login
Login form for students:
- Email + password fields
- Calls `supabase.auth.signInWithPassword()`
- On success, fetches user profile from `public.users` table
- Stores user in Zustand and redirects to `/student`
- Link to signup and admin login

### `app/(auth)/signup/page.tsx` — Student Registration
Registration form for new students:
- First name, last name, student ID, email, password fields
- Calls `supabase.auth.signUp()` with user metadata
- Trigger `handle_new_user()` auto-creates the `public.users` row
- Redirects to `/student` on success

### `app/(auth)/admin-login/page.tsx` — Admin Login
Login form specifically for administrators:
- Dark-themed UI to differentiate from student login
- Same auth flow as student login but redirects to `/admin`
- User must have `role = 'admin'` in the `users` table

---

## Dashboard Pages (Auth Required)

### `app/(dashboard)/layout.tsx` — Dashboard Layout
Shared layout for all authenticated pages:
- Verifies session directly with `supabase.auth.getUser()` (not Zustand)
- Fetches user profile from `public.users` table
- Redirects to `/login` if no valid session
- Renders `Navbar` + `Sidebar` + page content side by side

### `app/(dashboard)/student/page.tsx` — Student Dashboard
Main student overview page:
- Fetches borrow requests for the logged-in user from Supabase
- Displays stats: borrowed books, pending requests, returned books
- Lists recent borrow requests with status badges (pending/approved/rejected/returned)

### `app/(dashboard)/student/search/page.tsx` — Student Catalog Search
Student-facing catalog with borrow functionality:
- Fetches all books from Supabase
- Client-side search and genre filtering
- "Borrow" button creates a `borrow_requests` row with status `'pending'`
- Disabled button if book is unavailable (`available_count <= 0`)
- Shows availability badge and rack number

### `app/(dashboard)/admin/page.tsx` — Admin Dashboard
Admin overview with live statistics:
- Fetches book count, student count, and pending requests from Supabase
- Stats cards: Total Inventory, Active Students, Pending Requests, Overdue Books
- Recent borrow requests list with Approve/Reject buttons
- Approve/Reject updates the `borrow_requests.status` column

### `app/(dashboard)/admin/books/page.tsx` — Manage Books (Admin)
Full CRUD interface for managing the book inventory:
- **Add Book** form: title, author, genre (dropdown), rack number, copies, cover URL
- **Edit Book**: pre-fills the form with existing book data
- **Delete Book**: confirmation dialog before deletion
- **Search**: client-side filtering by title, author, or genre
- **Inventory Table**: shows title, author, genre, stock count, available count
- All operations write directly to the `books` table in Supabase
- Newly added books appear instantly in the public catalog

### `app/(dashboard)/admin/requests/page.tsx` — Borrow Requests (Admin)
Manage all student borrow requests:
- **Filter tabs**: All, Pending, Approved, Rejected, Returned (with counts)
- **Search**: by book title, student name, or student ID
- **Approve**: changes status to `'approved'` → triggers `check_book_availability()` which decrements `available_count` and sets `due_date` to 14 days
- **Reject**: changes status to `'rejected'`
- **Mark Returned**: changes status to `'returned'` → trigger increments `available_count`
- Each request card shows: book title, author, student name, student ID, date, due date

---

## Shared Components

### `components/shared/Navbar.tsx` — Top Navigation Bar
Global navigation present on all public pages and inside dashboards:
- Logo link to home
- Navigation links: Home, Catalog, About
- Auth-aware: shows Login/Register when logged out, Dashboard/Logout when logged in
- Search icon button
- Responsive design with mobile considerations

### `components/shared/Footer.tsx` — Site Footer
Global footer present on all public pages:
- BookSphere brand with logo and description
- Quick Links: Catalog Search, New Arrivals, Top Borrowed, Library Rules (all functional)
- Contact Us: VVCE address, phone (+91 821 4276201), email (principal@vvce.ac.in), library website link
- Social media icon buttons (Mail, Globe, Book)
- Copyright notice and Privacy/Terms links

### `components/shared/Sidebar.tsx` — Dashboard Sidebar
Left sidebar visible only inside the dashboard layout:
- Shows user avatar, name, and role (Student Portal / Admin Portal)
- **Student links**: Dashboard, Search Books
- **Admin links**: Dashboard, Manage Books, Borrow Requests
- Active link highlighting (green for students, salmon for admins)
- Logout button that calls `supabase.auth.signOut()` and clears Zustand state

### `components/shared/BookCard.tsx` — Reusable Book Card
Card component used across catalog, search, and new arrivals pages:
- Book cover image (or placeholder icon if no cover URL)
- Availability badge (green "Available" or red "Borrowed")
- Genre badge and rack number
- Book title and author
- "Borrow Book" button (or "Notify When Available" if unavailable)
- Hover animation with brutal shadow shift

---

## UI Components (`components/ui/`)

These are **shadcn/ui** base components, customized for the neo-brutalist theme:

| Component | Purpose |
|-----------|---------|
| `avatar.tsx` | User avatar with fallback initials |
| `badge.tsx` | Status/genre labels (Available, Pending, Mathematics, etc.) |
| `button.tsx` | Styled button with variants (default, outline, destructive, ghost) |
| `card.tsx` | Card container with header, content, footer |
| `dialog.tsx` | Modal dialog overlay |
| `dropdown-menu.tsx` | Dropdown menu with items |
| `input.tsx` | Text input field with border styling |
| `label.tsx` | Form label element |
| `select.tsx` | Dropdown select element |
| `separator.tsx` | Horizontal/vertical divider line |
| `sheet.tsx` | Slide-out panel (mobile menu) |
| `table.tsx` | Data table with header, body, rows |
| `tabs.tsx` | Tabbed interface component |

---

## Public Assets (`public/`)

| File | Purpose |
|------|---------|
| `file.svg` | Default Next.js icon (unused) |
| `globe.svg` | Default Next.js icon (unused) |
| `next.svg` | Next.js logo (unused) |
| `vercel.svg` | Vercel logo (unused) |
| `window.svg` | Default Next.js icon (unused) |

> These are leftover from `create-next-app` scaffolding. Can be safely deleted if not referenced anywhere.

---

## Data Flow Summary

```
Student Signs Up → Supabase Auth → Trigger creates public.users row
                                     ↓
Student Logs In → Supabase Auth → Fetch public.users profile → Zustand Store
                                     ↓
Student Browses → Server fetches books from Supabase → Renders BookCards
                                     ↓
Student Borrows → INSERT into borrow_requests (status: 'pending')
                                     ↓
Admin Approves → UPDATE borrow_requests (status: 'approved')
              → Trigger: available_count -= 1, sets due_date
                                     ↓
Admin Marks Returned → UPDATE borrow_requests (status: 'returned')
                    → Trigger: available_count += 1
```
