# HSN Platform — Changelog

## Session 1 — 2026-06-18

### 🚀 Dev Server Setup
- Diagnosed missing `@supabase/ssr` package causing startup failure
- Installed dependency and got dev server running at `http://localhost:3000`
- Created `.claude/launch.json` for preview tooling

---

### 🔐 Google & LinkedIn SSO
- Added `signInWithOAuth` server action in `src/app/auth/actions.ts`
- Added branded OAuth buttons (Google + LinkedIn) to both login and signup pages
- Buttons sit above the email form with an "or sign in with email" divider
- Requires Google and LinkedIn providers to be enabled in Supabase dashboard

---

### 🧭 Session-Aware Navbar
- Navbar was a static client component — always showed Log in / Join HSN
- Moved user fetch to `RootLayout` (server component), passing user as prop to Navbar
- Logged-in state shows: avatar initial, Dashboard link, Sign out button
- Admin accounts additionally see an **Admin** badge linking to `/admin`

---

### 💼 Opportunities Fix
- Posts were inserting with `status: 'pending'` but the listing page filtered for `status: 'verified'`
- Changed insert to `status: 'active'` and updated query filter to match
- Updated `opportunities.status` CHECK constraint to support: `pending`, `active`, `verified`, `rejected`, `closed`, `flagged`, `expired`
- Fixed RLS policy to use `status = 'active'` for public reads

---

### 🗄️ Database Changes
```sql
-- Status constraint update
ALTER TABLE opportunities DROP CONSTRAINT opportunities_status_check;
ALTER TABLE opportunities ADD CONSTRAINT opportunities_status_check
  CHECK (status IN ('pending','active','verified','rejected','closed','flagged','expired'));

-- Admin flag
ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
UPDATE profiles SET is_admin = true WHERE email = 'shoebwm@gmail.com';

-- Guidance articles
CREATE TABLE guidance_articles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  category text CHECK (category IN ('islamic_finance','career','business','community','general')) DEFAULT 'general',
  published boolean DEFAULT false,
  author_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Announcements
CREATE TABLE announcements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message text NOT NULL,
  active boolean DEFAULT true,
  location_target text CHECK (location_target IN ('all','hyderabad','chicago')) DEFAULT 'all',
  created_at timestamptz DEFAULT now()
);

-- Admin notes on opportunities
ALTER TABLE opportunities ADD COLUMN admin_notes text;
```

---

### 🛠️ Admin CMS (`/admin`)
Protected by `is_admin = true` on the user's profile. Non-admins are redirected.

| Route | Purpose |
|---|---|
| `/admin` | Dashboard — stats: members, opportunities, pending, articles, announcements |
| `/admin/opportunities` | Table of all posts with Approve / Reject / Flag buttons |
| `/admin/opportunities/[id]` | Full detail view — description, provider info, moderation actions, admin notes |
| `/admin/guidance` | Create / edit / publish guidance articles |
| `/admin/users` | View all members, roles, admin status |
| `/admin/announcements` | Post and manage site-wide announcements by location |

**Key technical decisions:**
- Admin actions use Supabase **service role key** (bypasses RLS) via `src/lib/supabase/admin.ts`
- Moderation buttons are a client component (`OppActions.tsx`) — required because Next.js 16 inline server action closures don't pass FormData correctly
- `SUPABASE_SERVICE_ROLE_KEY` stored in `.env.local`

---

### 📚 Guidance Section (`/guidance`)
- Public page listing all published articles grouped by category
- Article detail page at `/guidance/[id]`
- Added **Guidance** to the main navbar

---

### 🗃️ Git & GitHub
- Initialised git repo, set branch to `main`
- Pushed to: https://github.com/shoebsmk/hsn-platform

**Commits:**
1. `fb87049` — Initial commit: HSN platform with auth, opportunities, and Google/LinkedIn SSO
2. `cb08233` — Add admin CMS and Guidance section
3. `557b2ec` — Fix admin opportunity moderation
4. `1853aa0` — Add opportunity detail view in admin with moderation and notes

---

---

## Session 2 — 2026-06-18

### 🎨 UI/UX Overhaul
- Installed `lucide-react` — replaced all emoji icons with proper SVG icons throughout
- **Navbar** — sticky with glass blur, Lucide icons in nav links, pill-style user avatar, icon-only sign-out button (turns red on hover), working mobile hamburger menu
- **Homepage** — dark gradient hero with decorative circles, gold accent headline, `MapPin` location badge, glass-style outline CTA; category cards now have color-coded icon tiles with per-category `Browse →` links; trust bar uses `CheckCircle`/`Users`/`Star` icons
- **Opportunities page** — search bar with inline `Search` icon, filter sidebar with `SlidersHorizontal` header, listing cards with color-coded icon tiles, `MapPin` for location, `CheckCircle` verified badge
- **Dashboard** — avatar with gradient initials, role/location badges, quick-action cards with icon tiles and `ChevronRight` links, account section with icon rows
- **Footer** — `MapPin` icons for locations, `Heart` in tagline, uppercase section headers, CSS hover effects

### 🛡️ Admin UI Overhaul
- **Sidebar** — dark `#0F172A` panel, Shield icon logo, user avatar pill, Lucide icons on all nav items (`LayoutDashboard`, `Briefcase`, `BookOpen`, `Users`, `Megaphone`), `ArrowLeft` back-to-site link
- **Dashboard** — stat cards with color-coded icon tiles, clickable (link to each section), "Needs attention" on pending; recent panels have "View all →" links and avatar initials
- **Opportunities table** — category column shows mini icon tile, `ClickableRow` client component makes entire row clickable with hover highlight (`#F8FAFC`), navigates to detail on click
- **Users table** — Member column combines avatar + name + email; `CheckCircle`/`Minus` icons for admin status
- **Guidance** — `BookOpen` icon tiles, `Pencil`/`Trash2` icon buttons, icon empty state
- **Announcements** — `Megaphone` on submit, `MapPin` for location, `ToggleLeft`/`ToggleRight` on activate/deactivate, `Trash2` on delete

### 🔒 Post Review Flow Fixed
- New opportunity submissions were defaulting to `status: 'active'`, bypassing admin review
- Changed insert to `status: 'pending'` — all posts now queue in admin for approval before going live

### 🏠 Homepage Auth-Awareness
- "Join the Network" CTA in hero now swaps to "Post an Opportunity" when user is already logged in

---

### ✅ Halal Check (`/halal-check`)
Community members can submit a job URL or description to get a halal ruling from HSN scholars.

**Public page (`/halal-check`)**
- Two-column layout: published verdicts feed (left) + sticky submission form (right)
- Each verdict card is color-coded: green `CheckCircle` (Permissible), red `XCircle` (Not Permissible), amber `AlertCircle` (Needs Context)
- Scholar's Note block displayed per ruling; Source link opens original URL in new tab
- Success state after submission with JazakAllahu Khayran message
- Anyone can submit (logged in or anonymous); new submissions default to `pending`

**Admin panel (`/admin/halal-checks`)**
- Split into "Awaiting Review" and "Published Rulings" sections
- Pending badge count in page header
- Each pending card shows full description, URL, submitter name, and date
- `VerdictPicker` client component — interactive radio buttons (Permissible / Not Permissible / Needs Context) with selected-state highlight
- Scholar's Note textarea; "Publish Ruling" button writes verdict + notes to DB and instantly reflects on public page
- Delete button on both pending and reviewed items

**DB table**
```sql
CREATE TABLE halal_checks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  url text,
  description text NOT NULL,
  status text CHECK (status IN ('pending', 'reviewed')) DEFAULT 'pending',
  verdict text CHECK (verdict IN ('permissible', 'not_permissible', 'needs_context')),
  scholar_notes text,
  submitter_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz DEFAULT now()
);
```

**Navigation**
- "Halal Check" added to main navbar (between Opportunities and Guidance) with `ShieldCheck` icon
- "Halal Check" added to admin sidebar as last nav item

### 🔜 Planned (not yet built)
- Announcements displayed on the homepage
- Rich text editor for guidance articles
- Mentorship management in admin
- User suspension / banning in admin
- Email notifications on opportunity approval
