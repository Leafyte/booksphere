# 🎨 BookSphere — Complete Frontend Design Specification

> **Use this file as a standalone prompt** for any AI to recreate the BookSphere frontend pixel-perfectly.  
> It covers: design philosophy, full color palette, typography, spacing, component library, layout patterns, animations, and every page specification.

---

## 1. Project Overview

**BookSphere** is a **College Library Management System** for **Vidyavardhaka College of Engineering (VVCE), Mysuru**.

- **Purpose**: Students browse/borrow physical books; admins manage inventory and approve requests.
- **Design Style**: **Neo-Brutalism** — bold borders, flat vivid colors, hard shadows, uppercase headings, raw geometric shapes, zero border-radius on interactive elements, thick outlines.
- **Mood**: Energetic, academic, playful-yet-professional. Like a modern art poster meets a library catalog.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (App Router, Server Components + Client Components) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS 4** + custom CSS utilities |
| UI Library | **shadcn/ui** (customized for neo-brutalist theme, uses `@base-ui/react` primitives) |
| Icons | **Lucide React** |
| Animations | **Framer Motion** (page transitions, mobile menu) |
| Fonts | **Google Fonts** — Inter, Archivo Black, JetBrains Mono |
| State | **Zustand** (client-side auth state) |
| Backend | **Supabase** (Auth, PostgreSQL, RLS) |
| Utilities | `clsx` + `tailwind-merge` via a `cn()` helper |

---

## 3. Color System

### 3.1 Wero Wallet–Inspired Palette (Primary Palette)

These five vivid colors form the core identity. They are used as section accents, button fills, badge backgrounds, and decorative blobs.

| Token | Hex | Usage |
|-------|-----|-------|
| `wero-salmon` | `#FF8A7A` | **Primary brand color.** Hero gradients, primary buttons, CTA, navbar logo accent, admin login border, footer border-top, availability badge destructive contrast. Warm coral-salmon. |
| `wero-yellow` | `#F9FF73` | **Secondary color.** Active nav link highlight, hero gradient end, secondary badges, category service cards, "Returned" status badge, CTA section background. Electric lime-yellow. |
| `wero-green` | `#64E78E` | **Accent / success color.** "Available" badge, dashboard CTA buttons, approve action, student sidebar active link. Fresh mint-green. |
| `wero-purple` | `#F778FF` | **Dark mode primary.** Library rules "Conduct" card header, decorative blobs. Vibrant magenta-pink. |
| `wero-blue` | `#70A1FF` | **Tertiary accent.** Stats card background, about page journal stat, semesters stat. Soft cornflower blue. |

### 3.2 Semantic Color Tokens — Light Mode

| Token | Value | Description |
|-------|-------|-------------|
| `--background` | `#FAFAFA` | Page background — near-white warm gray |
| `--foreground` | `#0A0A0A` | Primary text — near-black |
| `--card` | `#FFFFFF` | Card surface — pure white |
| `--card-foreground` | `#0A0A0A` | Card text |
| `--popover` | `#FFFFFF` | Popover/dropdown bg |
| `--popover-foreground` | `#0A0A0A` | Popover text |
| `--primary` | `#FF8A7A` | = wero-salmon |
| `--primary-foreground` | `#000000` | Text on primary (always black — brutalist) |
| `--secondary` | `#F9FF73` | = wero-yellow |
| `--secondary-foreground` | `#000000` | Text on secondary |
| `--muted` | `#E5E5E5` | Muted backgrounds — light gray |
| `--muted-foreground` | `#52525B` | Muted/secondary text — zinc-600 |
| `--accent` | `#64E78E` | = wero-green |
| `--accent-foreground` | `#000000` | Text on accent |
| `--destructive` | `#EF4444` | Error/danger — standard red-500 |
| `--border` | `#000000` | **All borders are pure black** (core of neo-brutalism) |
| `--input` | `#000000` | Input borders — black |
| `--ring` | `#000000` | Focus rings — black |
| `--radius` | `0.5rem` | Base border radius (but overridden to `rounded-none` on buttons/inputs/badges) |

### 3.3 Semantic Color Tokens — Dark Mode

| Token | Value | Notes |
|-------|-------|-------|
| `--background` | `#121212` | Deep charcoal |
| `--foreground` | `#F5F5F5` | Off-white text |
| `--card` | `#1E1E1E` | Dark card surface |
| `--primary` | `#F778FF` | Switches to purple in dark mode |
| `--secondary` | `#70A1FF` | Switches to blue in dark mode |
| `--accent` | `#F9FF73` | Yellow stays as accent |
| `--muted` | `#27272A` | Dark zinc |
| `--muted-foreground` | `#A1A1AA` | Zinc-400 |
| `--border` | `#F5F5F5` | Borders flip to white |
| `--input` | `#F5F5F5` | White input borders |
| `--ring` | `#F5F5F5` | White focus rings |

### 3.4 Additional Named Colors Used

| Color | Hex/Class | Where Used |
|-------|-----------|------------|
| Pure Black | `#000000` / `bg-black` | Category section bg, footer bg, admin dashboard header, library-rules hero, dark sections |
| Pure White | `#FFFFFF` / `bg-white` | Cards, navbar, sidebar, form containers |
| Yellow-400 | Tailwind `yellow-400` | "Pending" status badge |
| Blue-300 | Tailwind `blue-300` | "Semesters" stat card, "Notifications" stat card |
| Gray-300 | Tailwind `gray-300` | Footer link text, placeholder icons |
| Gray-400 | Tailwind `gray-400` | Footer copyright, search icon placeholder, admin login label, admin subtext |
| Gray-600 | Tailwind `gray-600` | Inactive sidebar text |
| Gray-800 | Tailwind `gray-800` | Footer bottom border |
| Gray-900 | Tailwind `gray-900` | Admin login input background |

### 3.5 Gradient

```css
.bg-gradient-wero {
  background: linear-gradient(135deg, #FF8A7A 0%, #F9FF73 100%);
}
```
Used on: **Home page hero section** — salmon-to-yellow diagonal gradient with a subtle cube texture overlay at 20% opacity.

---

## 4. Typography

### 4.1 Font Families

| Font | CSS Variable | Usage |
|------|-------------|-------|
| **Inter** | `--font-sans` | Body text, paragraphs, labels, descriptions. Clean sans-serif. |
| **Archivo Black** | `--font-heading` | **All headings, buttons, badges, navigation links, stats.** Ultra-bold condensed display font. Always paired with `uppercase` and `tracking-tighter` or `tracking-tight`. |
| **JetBrains Mono** | `--font-geist-mono` | Monospace / code (minimal usage). |

### 4.2 Heading Rules

**ALL headings** (`h1`–`h6`) receive:
```css
font-family: var(--font-heading); /* Archivo Black */
text-transform: uppercase;
letter-spacing: -0.05em; /* tracking-tight */
```

### 4.3 Text Scale (Tailwind Classes)

| Element | Size | Weight | Additional |
|---------|------|--------|-----------|
| Hero `h1` | `text-6xl md:text-8xl` | `font-black` | `tracking-tighter leading-[0.9]` |
| Section `h2` | `text-5xl` | `font-black` | `tracking-tighter` |
| Sub-section `h3` | `text-2xl` | `font-black` | `tracking-tighter` |
| Card title | `text-xl` | `font-black` | `leading-tight line-clamp-2` |
| Stat value | `text-4xl` | `font-black` | — |
| Stat label | `text-xs` or `text-sm` | `font-bold` | `text-muted-foreground` |
| Navbar links | `text-sm` | font-heading | `tracking-wide` |
| Button text | `text-lg` or `text-xl` | font-heading | `tracking-wider` |
| Badge text | `text-[10px]` or `text-xs` | font-heading | `uppercase` |
| Body paragraphs | `text-lg` or `text-xl` | `font-medium` | `text-muted-foreground` |
| Footer heading | `text-2xl` | font-heading | `text-secondary` or `text-accent` |
| Copyright | `text-sm` | font-heading | `tracking-widest text-gray-400` |

---

## 5. Neo-Brutalism Design System

### 5.1 Core Principles

1. **Thick Black Borders** — Every card, button, input, badge, and section divider uses `border-2`, `border-4`, or `border-8` with `border-black`.
2. **Hard Drop Shadows** — No blur, no spread. Pure offset black rectangles.
3. **Zero Border Radius** on interactive elements — buttons, inputs, badges all use `rounded-none`.
4. **Uppercase Everything** — All headings, buttons, nav links, badges, labels.
5. **Flat Vivid Colors** — No gradients on components (gradient only on hero). Solid bright fills.
6. **Bold Font Weight** — `font-black` (900) on headings, `font-bold` (700) on labels, `font-medium` (500) on body.
7. **Chunky Hover States** — Elements physically shift position on hover (translate up-left) and grow their shadow.
8. **Press/Active States** — Elements shift down-right and shadow disappears (pressed in).
9. **Slight Rotation** — Decorative labels/badges use `rotate-[-2deg]` or `rotate-[2deg]` for a hand-placed sticker feel.
10. **Section Dividers** — Thick `border-b-8 border-black` between major sections.

### 5.2 Shadow Utilities

```css
--shadow-brutal:    4px 4px 0px 0px rgba(0, 0, 0, 1);    /* Standard */
--shadow-brutal-sm: 2px 2px 0px 0px rgba(0, 0, 0, 1);    /* Small */
--shadow-brutal-lg: 8px 8px 0px 0px rgba(0, 0, 0, 1);    /* Large */
```

CSS classes:
- `.brutal-shadow` → 4px offset
- `.brutal-shadow-sm` → 2px offset
- `.brutal-shadow-lg` → 8px offset

### 5.3 Interaction Utilities

```css
.brutal-transition {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.brutal-hover:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px 0px var(--color-border);
}

.brutal-active:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px 0px var(--color-border);
}
```

### 5.4 Decorative Patterns

- **Hero sections** use a transparent texture overlay: `bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20`
- **Auth pages** use: `bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-30`
- **Auth pages** also have 3 large blurred circles (blobs) in salmon, yellow, and green using `mix-blend-multiply filter blur-3xl opacity-50`

### 5.5 Section Underline Accent

After section headings, a small colored bar is placed:
```html
<div class="h-2 w-24 bg-primary border-2 border-black brutal-shadow-sm"></div>
```
This appears after "New Arrivals", "Our Library", "Infrastructure", "Library Services", etc. The color alternates between `bg-primary` (salmon), `bg-accent` (green), etc.

---

## 6. Component Specifications

### 6.1 Button

- **Base**: `rounded-none`, `font-heading`, `uppercase`, `border-2 border-black`
- **Primary**: `bg-primary text-black hover:bg-primary/90 brutal-shadow-sm brutal-hover`
- **Outline**: `bg-white text-black border-4 border-black brutal-shadow-sm brutal-hover`
- **Accent (CTA)**: `bg-accent text-black hover:bg-accent/90 brutal-shadow-sm brutal-hover`
- **Destructive**: `bg-destructive/10 text-destructive`
- **Ghost**: `hover:bg-muted`
- **Large Button**: `h-14` or `h-16`, `text-lg` or `text-xl`, `px-8` or `px-10`
- **Standard Button**: `h-8` default, `h-12` for form submissions
- **Icon Button**: `size-8`, `border-2 border-black brutal-shadow-sm brutal-hover rounded-none`

### 6.2 Badge

- **Shape**: `rounded-none` (override default rounded-full)
- **Border**: `border-2 border-black`
- **Shadow**: `brutal-shadow-sm`
- **Text**: `font-heading uppercase text-[10px]` or `text-xs`
- **Status variants**:
  - Available: `bg-accent text-black`
  - Borrowed/Unavailable: `bg-destructive text-white`
  - Pending: `bg-yellow-400 text-black`
  - Approved: `bg-accent text-black`
  - Rejected: `bg-destructive text-white`
  - Returned: `bg-secondary text-black`
- **Genre badge**: `variant="outline"`, `border-2 border-black rounded-none`

### 6.3 Card (Book Card)

Structure:
```
┌──────────────────────────┐  ← border-4 border-black brutal-shadow
│  ┌────────────────────┐  │
│  │   COVER IMAGE      │  │  ← aspect-[2/3], border-b-4 border-black
│  │   (or placeholder) │  │     Placeholder: bg-secondary with BookOpen icon
│  │        [BADGE]─────│──│  ← Availability badge, top-right, absolute
│  └────────────────────┘  │
│                          │
│  [GENRE]     Rack: A-01  │  ← Badge + rack number
│  BOOK TITLE              │  ← font-heading text-xl font-black uppercase
│  Author Name             │  ← text-muted-foreground font-medium
│                          │
│  ┌────────────────────┐  │
│  │   BORROW BOOK      │  │  ← Primary button, full width
│  └────────────────────┘  │
└──────────────────────────┘
```

- Hover: `brutal-hover` (shifts -2px,-2px, shadow grows to 6px)
- Cover hover: `group-hover:scale-105 transition-transform duration-300`
- Card: `bg-white border-4 border-black brutal-shadow brutal-transition brutal-hover rounded-lg overflow-hidden h-full`
- Disabled state: Button shows "Notify When Available" when `available_count <= 0`

### 6.4 Input

- **Shape**: `rounded-none`
- **Height**: `h-12` (forms) or `h-16` (hero search)
- **Border**: `border-2 border-black`
- **Focus**: `focus-visible:ring-0 focus-visible:border-primary` (border turns salmon on focus, no ring)
- **Font size**: `text-lg`
- **Admin variant**: `bg-gray-900 border-2 border-white text-white placeholder:text-gray-600` (dark inputs)

### 6.5 Navbar

- **Container**: `sticky top-0 z-50 w-full border-b-4 border-black bg-white brutal-shadow-sm`
- **Height**: `h-20`
- **Logo**: Library icon in `bg-primary p-2 border-2 border-black rounded-sm brutal-shadow-sm` + "Book" in black + "Sphere" in `text-primary`
- **Nav links**: `font-heading uppercase text-sm tracking-wide px-3 py-1 border-2`
  - Active: `border-black bg-secondary brutal-shadow-sm`
  - Inactive: `border-transparent hover:border-black hover:bg-muted`
- **Mobile menu**: Animated with Framer Motion (`AnimatePresence`), slides open vertically, `border-t-4 border-black bg-white`

### 6.6 Footer

- **Background**: `bg-black text-white border-t-8 border-primary`
- **Layout**: 4-column grid (Brand spans 2 cols, Quick Links, Contact Us)
- **Brand logo**: Same as navbar but larger (`text-4xl`)
- **Social icons**: White bg circles with hover effect: `hover:border-primary hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#FF8A7A]`
- **Quick Links heading**: `text-secondary` (yellow)
- **Contact heading**: `text-accent` (green)
- **Link hover**: `hover:text-primary hover:underline underline-offset-4 decoration-2`
- **Bottom bar**: `border-t-4 border-gray-800`, copyright + Privacy/Terms links

### 6.7 Sidebar (Dashboard)

- **Width**: `w-64`, `flex-shrink-0`
- **Position**: `sticky top-20` (below navbar), `h-[calc(100vh-5rem)]`
- **Border**: `border-r-4 border-black`
- **User avatar**: Square (`rounded-none`), `w-12 h-12`, `border-2 border-black brutal-shadow-sm`
  - Student: `bg-primary` background
  - Admin: `bg-secondary` background
- **Nav links**:
  - Active (student): `border-black bg-accent brutal-shadow-sm`
  - Active (admin): `border-black bg-primary brutal-shadow-sm`
  - Inactive: `border-transparent hover:border-black hover:bg-muted`
- **Logout**: `text-destructive`, hover `bg-destructive/10`
- **Dividers**: `border-b-4 border-black` (user section) and `border-t-4 border-black` (logout section)

### 6.8 Stat Cards

Pattern used on Home, Student Dashboard, Admin Dashboard:
```
┌─────────────────────────────┐
│  ┌──────┐                   │  ← bg-white border-4 border-black
│  │ ICON │  STAT LABEL       │     brutal-shadow brutal-hover
│  │ (bg) │  BIG NUMBER       │
│  └──────┘                   │     Icon box: p-3/p-4, border-4 border-black,
└─────────────────────────────┘     colored bg (salmon/yellow/green/blue)
```
- Always `font-heading text-4xl font-black uppercase` for the value
- Always `font-heading uppercase text-xs text-muted-foreground` for the label
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6/gap-8`

### 6.9 Tilted Label / Sticker

Decorative labels used on hero sections and auth pages:
```html
<div class="inline-block bg-white border-4 border-black px-6 py-2 brutal-shadow mb-4 rotate-[-2deg]">
  <span class="font-heading uppercase text-xl font-black">University Library 2.0</span>
</div>
```
Variations:
- `bg-accent text-black border-2 border-black rotate-[-2deg]` — student login "Student Access"
- `bg-primary text-black border-2 border-white rotate-[2deg]` — admin login "Staff Only"
- `bg-white border-4 border-black rotate-[2deg]` — about page "About Us"

---

## 7. Layout Patterns

### 7.1 Page Shell (Public Pages)

```
┌─────────────────────────────────────┐
│ NAVBAR (sticky top, border-b-4)     │
├─────────────────────────────────────┤
│                                     │
│ HERO SECTION                        │  ← Full-width, colored bg, border-b-8
│                                     │
├─────────────────────────────────────┤
│                                     │
│ CONTENT SECTIONS                    │  ← Alternating bg: white, muted, black
│ (py-24 each, container mx-auto)    │
│                                     │
├─────────────────────────────────────┤
│ FOOTER (bg-black, border-t-8)       │
└─────────────────────────────────────┘
```

### 7.2 Page Shell (Dashboard Pages)

```
┌──────────────────────────────────────┐
│ NAVBAR (sticky top)                  │
├──────────┬───────────────────────────┤
│          │                           │
│ SIDEBAR  │  MAIN CONTENT             │
│ (w-64)   │  (p-4 md:p-8)            │
│ (sticky) │                           │
│          │  max-w-6xl or 7xl         │
│          │                           │
├──────────┴───────────────────────────┤
```
- Outer wrapper: `bg-muted/30`
- Max content width: `max-w-[1600px] mx-auto`
- Sidebar hidden on mobile: `hidden lg:block`

### 7.3 Page Shell (Auth Pages)

```
┌─────────────────────────────────────┐
│                                     │
│    [decorative salmon blob]         │
│                                     │
│         LOGO (centered)             │
│                                     │
│    ┌──────────────────────┐         │
│    │   AUTH CARD           │         │  ← max-w-md, centered
│    │   (white bg, border-4)│         │     brutal-shadow
│    │                      │         │
│    │   form fields...     │         │
│    │                      │         │
│    └──────────────────────┘         │
│                                     │
│    [decorative yellow blob]         │
│    [decorative green blob]          │
│                                     │
└─────────────────────────────────────┘
```
- Background: `bg-muted` with diamond pattern overlay
- Three floating blobs (salmon, yellow, green): `w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-50`
- No Navbar or Footer

### 7.4 Section Rhythm

Public pages alternate section backgrounds:
1. Hero — vivid color (`bg-gradient-wero`, `bg-accent`, `bg-black`)
2. Stats — `bg-muted border-b-8 border-black`
3. Content — `bg-white` or `bg-background`
4. Dark section — `bg-black text-white border-y-8 border-primary`
5. CTA — `bg-secondary border-b-8 border-black` with decorative blurred circles

Every section uses `py-24` padding (or `py-16` / `py-32` for variation).

### 7.5 Container

All content is wrapped in:
```html
<div class="container mx-auto px-4">
```
For narrower content (about, library rules): `max-w-5xl`

### 7.6 Grid System

| Layout | Classes |
|--------|---------|
| Book cards | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8` |
| Stat cards | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6` |
| Category grid | `grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6` |
| Rules cards | `grid grid-cols-1 md:grid-cols-2 gap-8` |
| Footer | `grid grid-cols-1 md:grid-cols-4 gap-12` |
| About stats | `grid grid-cols-2 gap-4` |
| Infrastructure | `grid grid-cols-1 md:grid-cols-3 gap-6` |

---

## 8. Page-by-Page Specifications

### 8.1 Home Page (`/`)

**Sections (top to bottom):**

1. **Hero** — `bg-gradient-wero` (salmon→yellow, 135deg), `border-b-8 border-black`, cubes texture overlay at 20% opacity
   - Tilted "University Library 2.0" sticker label
   - Giant heading: "Find your next **big idea.**" (second line in white with `drop-shadow-[4px_4px_0_rgba(0,0,0,1)]`)
   - Description in white card with `brutal-shadow-sm`
   - Search form: white container, `border-4 border-black brutal-shadow`, contains Input + green "Search" button
   - Padding: `py-24 md:py-32`

2. **Statistics** — `bg-muted border-b-8 border-black`, `py-20`
   - 4 stat cards in a row: Total Books (salmon icon bg), Genres (yellow), Available Now (green), Semesters (blue-300)
   - Each: white bg, `border-4 border-black brutal-shadow brutal-hover`

3. **Featured / New Arrivals** — white bg, `py-24`
   - Heading "NEW ARRIVALS" + salmon underline bar
   - "View All Catalog →" outline button (desktop only)
   - 4 BookCards in a grid
   - Empty state: white card with message

4. **Browse by Category** — `bg-black text-white border-y-8 border-primary`, `py-24`
   - 9 category tiles in grid: `border-4 border-white p-6 h-32`, hover → `bg-white text-black`
   - Categories: Mathematics, Data Structures, Operating Systems, Computer Organization, Algorithms, Software Engineering, Database Management, Biology, Humanities / Ethics

5. **CTA** — `bg-secondary border-b-8 border-black`, `py-32`
   - 2 decorative blurred circles (salmon + green)
   - Heading: "Ready to start reading?"
   - 2 buttons: "Student Login" (salmon) + "Create Account" (white outline)

### 8.2 Public Catalog / Search (`/search`)

- **Background**: `bg-muted`
- **Header**: Page title (`text-5xl`) with salmon underline bar. Title dynamically shows category or search query.
- **Error state**: `bg-destructive text-white font-bold border-4 border-black brutal-shadow`
- **Empty state**: White card, `border-4 border-black brutal-shadow`, centered text
- **Book grid**: 4 columns of BookCards
- Accepts `?q=` (search) and `?category=` (genre filter) URL params

### 8.3 About Page (`/about`)

1. **Hero** — `bg-accent` (green), `border-b-8 border-black`
   - Tilted "About Us" sticker (rotated +2deg)
   - Heading: "VVCE Library & **Information Center**" (second part white with drop shadow)
   - Est. 1997 description card

2. **Our Library** — white bg, 2-column layout
   - Left: text description
   - Right: 2×2 grid of colored stat cards (salmon, yellow, green, blue)
   - Stats: 39,690+ Books, 210 Seats, 8,082 Titles, 81+ Journals

3. **Infrastructure** — `bg-muted border-y-8 border-black`
   - 3 cards: Digital Lab, Wi-Fi, DELNET
   - Each: white bg, `border-4 border-black brutal-shadow brutal-hover`, centered icon in yellow box

4. **Library Services** — white bg
   - 2×4 grid of yellow service tags: Lending, Reference, etc.
   - Each: `border-4 border-black bg-secondary brutal-shadow-sm brutal-hover`

5. **Open Access Resources** — `bg-black text-white border-y-8 border-primary`
   - 2×4 grid of resource links (NPTEL, NDL, DOAJ, etc.)
   - Each: `border-4 border-white bg-white/10`, hover → `bg-primary text-black`

### 8.4 New Arrivals (`/new-arrivals`)

- Hero with "Fresh Off the Shelves" banner
- Grid of 20 most recent BookCards (server-rendered)

### 8.5 Top Borrowed (`/top-borrowed`)

- Leaderboard layout
- #1 gets a trophy icon
- Each entry shows rank, book details, and borrow count
- Empty state when no borrows exist

### 8.6 Library Rules (`/library-rules`)

1. **Hero** — `bg-black text-white border-b-8 border-secondary`
   - Tilted "VVCE Library Guidelines" sticker (green bg)
   - Heading: "Library **Rules**" (second word in `text-secondary`)

2. **Rules Grid** — 2-column, 6 rule cards:
   - Each card: white bg, `border-4 border-black brutal-shadow`
   - Colored header strip: `border-b-4 border-black` + colored bg (salmon, yellow, green, purple, blue, salmon)
   - Checklist items with green checkmark icons
   - Rules: Borrowing Policy, Due Dates, Book Care, Library Conduct, Digital Services, Library Services

3. **Penalty Notice** — `bg-destructive/10 border-4 border-destructive brutal-shadow-sm`
   - Red XCircle icon + bold warning text

4. **Library at a Glance** — `bg-black text-white border-4 border-primary brutal-shadow-sm`
   - 4 stats in a row, values in `text-primary`

### 8.7 Student Login (`/login`)

- White card: `bg-white border-4 border-black brutal-shadow p-8`
- Green tilted "Student Access" sticker
- Heading: "WELCOME BACK"
- Fields: Student ID + Password (with show/hide toggle)
- Submit button: salmon, full-width, `h-14`
- Links: "Create One" → signup, "Are you an administrator?" → admin-login
- Form sections separated by `border-b-4 border-black` and `border-t-2 border-black`

### 8.8 Student Signup (`/signup`)

- Same white card style as login
- Fields: First Name, Last Name, Student ID, Email, Password
- Submit button: salmon
- Link to login

### 8.9 Admin Login (`/admin-login`)

- **Dark card**: `bg-black text-white border-4 border-primary brutal-shadow p-8`
- ShieldCheck icon badge (top-right, `bg-primary border-2 border-white rounded-full`)
- Salmon tilted "Staff Only" sticker (rotated +2deg)
- Heading: "SYSTEM ADMIN"
- Dark inputs: `bg-gray-900 border-2 border-white text-white`
- Submit button: salmon with white border
- Link: "Return to Student Portal"
- **Key difference**: Dark theme to distinguish from student login

### 8.10 Student Dashboard (`/student`)

- **Welcome banner**: white card, `border-4 border-black brutal-shadow-sm`
  - "Welcome, {name}!" + "Explore Catalog" salmon button
- **4 stat cards**: Currently Borrowed (green), Pending Requests (yellow), Due Soon (salmon), Unread Notifications (blue)
- **Currently Reading**: Grid of borrowed BookCards
- **Empty state**: White card with BookOpen icon + "Browse Catalog" button

### 8.11 Admin Dashboard (`/admin`)

- **Header**: `bg-black text-white border-4 border-primary brutal-shadow-sm`
  - Salmon tilted "System Status: Online" label
  - "ADMIN OVERVIEW"
  - 2 action buttons: "Manage Books" (salmon) + "Borrow Requests" (green)
- **4 stat cards**: Total Inventory (white/green icon), Active Students (white/salmon icon), Pending Requests (yellow bg), Overdue Books (red bg with white text)
- **Borrow Requests list**: White card, `border-4 border-black brutal-shadow`
  - Header strip: `bg-secondary border-b-4 border-black` with pending count badge
  - Each request row: `divide-y-4 divide-black`, status badge + date + book title + student name
  - Pending requests show Approve (green) + Reject (outline/red) buttons

### 8.12 Manage Books — Admin (`/admin/books`)

- Add/Edit Book form with fields: title, author, genre dropdown, rack number, copies, cover URL
- Book inventory table: `border-4 border-black`
- Search bar for filtering
- Delete confirmation dialog

### 8.13 Borrow Requests — Admin (`/admin/requests`)

- Filter tabs: All, Pending, Approved, Rejected, Returned (with count badges)
- Search bar
- Request cards with status badges and action buttons
- Mark Returned action for approved books

---

## 9. Animations & Micro-Interactions

| Element | Animation |
|---------|-----------|
| **Brutal hover** | `transform: translate(-2px, -2px)` + shadow grows to 6px. Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (bouncy overshoot) |
| **Brutal active** | `transform: translate(2px, 2px)` + shadow becomes 0 (pressed in) |
| **Book cover hover** | `scale-105` with `duration-300` |
| **Mobile menu** | Framer Motion `AnimatePresence` — height 0→auto, opacity 0→1 |
| **Footer social icons** | `hover:-translate-y-1` + pink shadow appears |
| **Category tiles** | Text scales `group-hover:scale-110 transition-transform` |
| **Loading spinner** | Lucide `Loader2` with `animate-spin` |
| **Auth blobs** | CSS `animate-blob` (if defined) with staggered delays |
| **Text selection** | `selection:bg-primary selection:text-primary-foreground` — salmon highlight |

---

## 10. Responsive Design

| Breakpoint | Behavior |
|-----------|----------|
| **Mobile (< 768px)** | Single column grids, mobile hamburger menu (animated), sidebar hidden, full-width buttons, smaller headings (`text-5xl` → hero shrinks) |
| **Tablet (768px–1024px)** | 2-column grids, some nav items visible |
| **Desktop (> 1024px)** | Full 4-column grids, sidebar visible, full navbar |

Key responsive patterns:
- `hidden md:flex` — desktop nav links
- `md:hidden` — mobile menu button
- `hidden lg:block` — sidebar
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` — responsive grids
- `text-6xl md:text-8xl` — responsive heading sizes
- `py-24 md:py-32` — responsive section padding
- `flex-col sm:flex-row` — stack to row on mobile
- `hidden sm:block` — brand name hidden on very small screens

---

## 11. Icon Usage (Lucide React)

| Icon | Where Used |
|------|-----------|
| `Library` | Logo, navbar, footer, stats, manage books |
| `BookOpen` | Book placeholder, stats, empty states |
| `Search` | Navbar search button, hero search input |
| `ArrowRight` | "View All" buttons, stat card |
| `Users` | Stats (Genres, Active Students) |
| `Menu` / `X` | Mobile menu toggle |
| `Eye` / `EyeOff` | Password visibility toggle |
| `Loader2` | Loading spinner (with `animate-spin`) |
| `LayoutDashboard` | Sidebar dashboard link |
| `BookmarkCheck` | Sidebar borrow requests link |
| `LogOut` | Sidebar logout button |
| `Shield` / `ShieldCheck` | Library rules, admin login |
| `Clock` | Due dates rule card |
| `AlertTriangle` | Library conduct, overdue books |
| `CheckCircle` / `XCircle` | Rule list items, penalty notice |
| `CalendarClock` | Due soon stat |
| `Bell` | Notifications stat |
| `Monitor` | Digital lab infrastructure |
| `Wifi` | Wi-Fi infrastructure |
| `Globe` | DELNET, footer social |
| `Newspaper` | Journals stat |
| `Mail` | Footer social |
| `Book` | Footer social |
| `History` | Pending requests stat |

---

## 12. Status Badge Color Map

| Status | Background | Text | Border |
|--------|-----------|------|--------|
| Available | `bg-accent` (#64E78E) | `text-black` | `border-2 border-black` |
| Borrowed | `bg-destructive` (#EF4444) | `text-white` | `border-2 border-black` |
| Pending | `bg-yellow-400` | `text-black` | `border-2 border-black` |
| Approved | `bg-accent` (#64E78E) | `text-black` | `border-2 border-black` |
| Rejected | `bg-destructive` (#EF4444) | `text-white` | `border-2 border-black` |
| Returned | `bg-secondary` (#F9FF73) | `text-black` | `border-2 border-black` |

---

## 13. Key Design Rules — Quick Reference

1. ✅ **Always** use `border-black` (light mode) or `border-white` (dark mode) — never gray borders
2. ✅ **Always** use `rounded-none` on buttons, inputs, badges
3. ✅ **Always** use `font-heading uppercase` on headings, buttons, nav links, labels
4. ✅ **Always** add `brutal-shadow` or `brutal-shadow-sm` to cards and interactive elements
5. ✅ **Always** use `brutal-hover` on clickable cards and buttons
6. ✅ **Always** separate major sections with `border-b-8 border-black`
7. ✅ **Always** use `font-medium` or `font-bold` on body text (never regular weight)
8. ✅ **Always** use vivid palette colors, never raw CSS colors
9. ❌ **Never** use soft/rounded shadows (blur, spread)
10. ❌ **Never** use lowercase for headings or buttons
11. ❌ **Never** use thin (1px) borders on structural elements
12. ❌ **Never** use generic sans-serif — always Inter for body, Archivo Black for display
13. ❌ **Never** use border-radius on interactive elements

---

## 14. File Structure Reference

```
app/
├── layout.tsx              # Root layout — fonts, metadata
├── globals.css             # Complete design system (colors, shadows, utilities)
├── page.tsx                # Home page
├── search/page.tsx         # Public catalog
├── about/page.tsx          # About VVCE Library
├── new-arrivals/page.tsx   # New arrivals
├── top-borrowed/page.tsx   # Leaderboard
├── library-rules/page.tsx  # Library rules & guidelines
├── (auth)/
│   ├── layout.tsx          # Auth layout (centered, blobs, no nav)
│   ├── login/page.tsx      # Student login
│   ├── signup/page.tsx     # Student registration
│   └── admin-login/page.tsx # Admin login (dark theme)
├── (dashboard)/
│   ├── layout.tsx          # Dashboard layout (navbar + sidebar + main)
│   ├── student/
│   │   ├── page.tsx        # Student dashboard
│   │   └── search/page.tsx # Student catalog (with borrow)
│   └── admin/
│       ├── page.tsx        # Admin dashboard
│       ├── books/page.tsx  # Manage books (CRUD)
│       └── requests/page.tsx # Manage borrow requests
components/
├── shared/
│   ├── Navbar.tsx          # Global navigation
│   ├── Footer.tsx          # Global footer
│   ├── Sidebar.tsx         # Dashboard sidebar
│   └── BookCard.tsx        # Reusable book card
└── ui/                     # shadcn/ui base components (customized)
    ├── avatar.tsx
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── dropdown-menu.tsx
    ├── input.tsx
    ├── label.tsx
    ├── select.tsx
    ├── separator.tsx
    ├── sheet.tsx
    ├── table.tsx
    └── tabs.tsx
lib/
├── store.ts                # Zustand auth store
├── utils.ts                # cn() helper
└── supabase/
    ├── client.ts           # Browser Supabase client
    ├── server.ts           # Server Supabase client
    └── middleware.ts        # Route protection
```

---

## 15. SEO & Metadata

| Page | Title | Description |
|------|-------|-------------|
| Home | "BookSphere \| College Library System" | "A modern, neo-brutalist college library management system" |
| About | "About \| BookSphere — VVCE Library" | "About the Department of Library & Information Center at VVCE, Mysuru" |
| Library Rules | "Library Rules \| BookSphere — VVCE" | "Rules and guidelines for using the VVCE Library & Information Center" |

All pages use semantic HTML, single `<h1>` per page, proper heading hierarchy, and descriptive link text.

---

> **TL;DR**: Neo-brutalism + college library. Thick black borders, hard shadows, flat vivid colors (salmon, yellow, green, purple, blue), Archivo Black uppercase headings, Inter body text, bouncy hover animations, zero border-radius on UI elements, alternating section backgrounds (white → gray → black), chunky 8px section dividers.
