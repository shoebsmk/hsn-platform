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

### 🔜 Planned (not yet built)
- Announcements displayed on the homepage
- Rich text editor for guidance articles
- Mentorship management in admin
- User suspension / banning in admin
- Email notifications on opportunity approval
