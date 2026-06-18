-- HSN Platform Schema
-- Run this in your Supabase SQL editor

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text check (role in ('seeker', 'provider', 'mentor')) not null default 'seeker',
  location text check (location in ('hyderabad', 'chicago', 'remote')),
  bio text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Opportunities
create table public.opportunities (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  category text check (category in (
    'hidden_jobs', 'community', 'gig_services',
    'business', 'income', 'career_guidance', 'mentorship'
  )) not null,
  location text check (location in ('hyderabad', 'chicago', 'remote')) not null,
  status text check (status in ('pending', 'verified', 'rejected')) default 'pending',
  provider_id uuid references public.profiles(id) on delete cascade not null,
  contact_info text,
  external_url text,
  is_remote boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Halal Business Directory
create table public.businesses (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  category text check (category in (
    'restaurant', 'grocery', 'catering', 'services',
    'finance', 'education', 'health', 'other'
  )) not null,
  location text check (location in ('hyderabad', 'chicago', 'remote')) not null,
  address text,
  phone text,
  website text,
  is_verified boolean default false,
  status text check (status in ('pending', 'active', 'rejected')) default 'active',
  submitted_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.businesses enable row level security;
create policy "Active businesses are public" on public.businesses for select using (status = 'active');
create policy "Users can submit businesses" on public.businesses for insert with check (auth.uid() = submitted_by);

-- Mentor profiles
create table public.mentor_profiles (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade unique not null,
  expertise text[] default '{}',
  industries text[] default '{}',
  availability text,
  bio text,
  is_verified boolean default false,
  created_at timestamptz default now()
);

-- Mentor connection requests
create table public.mentor_requests (
  id uuid default gen_random_uuid() primary key,
  mentor_id uuid references public.profiles(id) on delete cascade not null,
  seeker_id uuid references public.profiles(id) on delete cascade not null,
  message text,
  status text check (status in ('pending', 'accepted', 'declined')) default 'pending',
  created_at timestamptz default now(),
  unique(mentor_id, seeker_id)
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.opportunities enable row level security;
alter table public.mentor_profiles enable row level security;
alter table public.mentor_requests enable row level security;

-- Profiles: users can read all, only update their own
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Opportunities: verified ones are public; provider can manage own
create policy "Verified opportunities are public" on public.opportunities for select using (status = 'verified' or provider_id = auth.uid());
create policy "Providers can insert opportunities" on public.opportunities for insert with check (auth.uid() = provider_id);
create policy "Providers can update own opportunities" on public.opportunities for update using (auth.uid() = provider_id);

-- Mentor profiles: public read, owner write
create policy "Mentor profiles are public" on public.mentor_profiles for select using (true);
create policy "Mentors manage own profile" on public.mentor_profiles for all using (auth.uid() = profile_id);

-- Mentor requests: only involved parties can see
create policy "Involved parties can view requests" on public.mentor_requests for select using (auth.uid() = mentor_id or auth.uid() = seeker_id);
create policy "Seekers can create requests" on public.mentor_requests for insert with check (auth.uid() = seeker_id);
create policy "Mentors can update request status" on public.mentor_requests for update using (auth.uid() = mentor_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at trigger for opportunities
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger opportunities_updated_at
  before update on public.opportunities
  for each row execute procedure public.set_updated_at();
