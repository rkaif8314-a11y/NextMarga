-- NextMarga database foundation
-- Run this in a new Supabase project's SQL Editor.
-- Authentication is handled by Supabase Auth; public.profiles stores app-specific student data.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '', dob date, gender text, phone text, father_name text, mother_name text, guardian_phone text,
  school_id uuid, school_name text, current_class text, educational_board text, state text, city text,
  interests text[] not null default '{}', target_path text, avatar_url text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(), name text not null, city text, state text, board text, website text,
  verified boolean not null default false, created_at timestamptz not null default now()
);
create index if not exists schools_name_idx on public.schools using gin (to_tsvector('simple', name));
create index if not exists schools_state_idx on public.schools(state);
alter table public.profiles drop constraint if exists profiles_school_id_fkey;
alter table public.profiles add constraint profiles_school_id_fkey foreign key (school_id) references public.schools(id) on delete set null;

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(), title text not null, organization text not null default '',
  category text not null check (category in ('competition','scholarship','exam','internship','fellowship','job','research','hackathon','program','other')),
  is_verified boolean not null default false, is_govt boolean not null default false, deadline timestamptz,
  fee text, mode text, eligibility text, description text, why_consider text, required_docs text[] not null default '{}', official_url text,
  minimum_class text, maximum_class text, minimum_age integer, maximum_age integer, states text[] not null default '{}', boards text[] not null default '{}', interests text[] not null default '{}',
  source_name text, source_url text, country_scope text[] not null default '{}',
  status text not null default 'active' check (status in ('active','closed','upcoming','archived')),
  verified_at timestamptz, last_checked_at timestamptz, last_changed_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists opportunities_category_idx on public.opportunities(category);
create index if not exists opportunities_deadline_idx on public.opportunities(deadline);
create index if not exists opportunities_verified_idx on public.opportunities(is_verified);
create index if not exists opportunities_status_idx on public.opportunities(status);
create index if not exists opportunities_source_idx on public.opportunities(source_name);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id) on delete cascade,
  status text not null default 'Saved' check (status in ('Under Review','Interview Scheduled','Applied','Saved','Accepted','Rejected')),
  applied_date timestamptz, notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(user_id, opportunity_id)
);
alter table public.applications drop constraint if exists applications_status_check;
alter table public.applications add constraint applications_status_check check (status in ('Under Review','Interview Scheduled','Applied','Saved','Accepted','Rejected'));
create index if not exists applications_user_idx on public.applications(user_id);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('urgent','match','update','milestone')), title text not null, message text not null,
  action_screen text, action_id uuid, unread boolean not null default true, created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);

create table if not exists public.roadmap_phases (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  phase text not null check (phase in ('NOW','NEXT','LATER')), phase_tag text, timeframe text, title text not null, description text, cta_text text, cta_action text,
  sort_order integer not null default 0, created_at timestamptz not null default now()
);
create table if not exists public.roadmap_goals (
  id uuid primary key default gen_random_uuid(), phase_id uuid not null references public.roadmap_phases(id) on delete cascade,
  text text not null, completed boolean not null default false, sort_order integer not null default 0
);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone) values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), coalesce(new.phone, new.raw_user_meta_data ->> 'phone', '')) on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.schools enable row level security;
alter table public.opportunities enable row level security;
alter table public.applications enable row level security;
alter table public.notifications enable row level security;
alter table public.roadmap_phases enable row level security;
alter table public.roadmap_goals enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "Anyone can read schools" on public.schools;
create policy "Anyone can read schools" on public.schools for select using (true);
drop policy if exists "Anyone can read verified opportunities" on public.opportunities;
create policy "Anyone can read verified opportunities" on public.opportunities for select using (is_verified = true);
drop policy if exists "Users manage own applications" on public.applications;
create policy "Users manage own applications" on public.applications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users read own notifications" on public.notifications;
create policy "Users read own notifications" on public.notifications for select using (auth.uid() = user_id);
drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications" on public.notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users manage own roadmap phases" on public.roadmap_phases;
create policy "Users manage own roadmap phases" on public.roadmap_phases for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Users manage own roadmap goals" on public.roadmap_goals;
create policy "Users manage own roadmap goals" on public.roadmap_goals for all using (auth.uid() = (select user_id from public.roadmap_phases where id = phase_id)) with check (auth.uid() = (select user_id from public.roadmap_phases where id = phase_id));
