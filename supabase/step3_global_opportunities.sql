-- NextMarga Step 3: global opportunity directory foundation
-- This migration adds source/verification/freshness fields and seeds only official-source records.
-- Run once in Supabase SQL Editor after schema.sql.

alter table public.opportunities
  add column if not exists source_name text,
  add column if not exists source_url text,
  add column if not exists country_scope text[] not null default '{}',
  add column if not exists status text not null default 'active',
  add column if not exists verified_at timestamptz,
  add column if not exists last_checked_at timestamptz,
  add column if not exists last_changed_at timestamptz;

alter table public.opportunities drop constraint if exists opportunities_status_check;
alter table public.opportunities add constraint opportunities_status_check check (status in ('active','closed','upcoming','archived'));

create index if not exists opportunities_status_idx on public.opportunities(status);
create index if not exists opportunities_source_idx on public.opportunities(source_name);
create index if not exists opportunities_last_checked_idx on public.opportunities(last_checked_at);

-- Official-source seed records. Closed historical records are retained for auditability
-- but are excluded from the active opportunity experience.
insert into public.opportunities
(title, organization, category, is_verified, is_govt, deadline, fee, mode, eligibility, description, why_consider, required_docs, official_url, minimum_class, maximum_class, minimum_age, maximum_age, states, boards, interests, source_name, source_url, country_scope, status, verified_at, last_checked_at)
values
('FIRST LEGO League BIOGLOW 2026-27', 'FIRST', 'competition', true, false, null, 'Varies by region', 'In-person / team-based', 'Ages 5-16; grades K-8, varies by region', 'Global hands-on robotics program for young students with the 2026-27 BIOGLOW season.', 'Build engineering, coding, teamwork and problem-solving skills through a structured international robotics program.', '{}', 'https://www.firstinspires.org/programs/fll/', null, 'Class 8', 5, 16, '{}', '{}', array['Robotics','Coding','Science','Engineering'], 'FIRST', 'https://www.firstinspires.org/programs/fll/', array['Worldwide'], 'active', now(), now()),
('FIRST Tech Challenge BIOBUZZ 2026-27', 'FIRST', 'competition', true, false, null, 'Varies by region', 'In-person / team-based', 'Ages 12-18; grades 7-12', 'Global student robotics program with the 2026-27 BIOBUZZ challenge beginning September 12, 2026.', 'A strong route into robotics engineering, programming, teamwork and STEM competition.', '{}', 'https://www.firstinspires.org/programs/ftc/', null, 'Class 12', 12, 18, '{}', '{}', array['Robotics','Coding','Engineering','AI'], 'FIRST', 'https://www.firstinspires.org/programs/ftc/', array['Worldwide'], 'upcoming', now(), now()),
('FIRST Robotics Competition 2026-27', 'FIRST', 'competition', true, false, null, 'Varies by region', 'In-person / team-based', 'Ages 14-18; grades 9-12', 'International large-scale robotics program for high-school teams.', 'Students design, build and program industrial-scale robots while developing engineering and collaboration skills.', '{}', 'https://www.firstinspires.org/programs/frc/', null, 'Class 12', 14, 18, '{}', '{}', array['Robotics','Coding','Engineering','Physics'], 'FIRST', 'https://www.firstinspires.org/programs/frc/', array['Worldwide'], 'active', now(), now()),
('GLOBE Student Research & Science Community', 'NASA GLOBE Program', 'research', true, true, null, 'Free', 'Online / school / local research', 'Students can use GLOBE environmental data and participate in student research activities; availability and event deadlines vary by country and year.', 'Connects student-led Earth science investigations with a worldwide scientific community and real datasets.', '{}', 'https://www.globe.gov/about/learn/who-uses-globe/students', null, 'Class 12', null, 18, '{}', '{}', array['Science','Biology & Medicine','Astronomy'], 'NASA GLOBE Program', 'https://www.globe.gov/', array['Worldwide'], 'active', now(), now()),
('GLOBE International Virtual Science Symposium', 'NASA GLOBE Program', 'competition', true, true, '2026-01-30T23:59:59Z', 'Free', 'Online', 'GLOBE participants of all ages; annual event schedule varies.', 'Annual online student research showcase with STEM-professional review and feedback.', 'A genuine international research presentation opportunity using Earth-system science data.', '{}', 'https://www.globe.gov/news-events/meetings_symposia/virtual-conferences', null, 'Class 12', null, 18, '{}', '{}', array['Science','Biology & Medicine','Environmental Science'], 'NASA GLOBE Program', 'https://www.globe.gov/news-events/meetings_symposia/virtual-conferences', array['Worldwide'], 'closed', now(), now()),
('Technovation Girls', 'Technovation', 'competition', true, false, null, 'Free program access', 'Online / team-based', 'Girls ages 8-18; Beginner 8-12, Junior 13-15, Senior 16-18', 'Global technology program where girls build solutions to community problems using AI or mobile-app prototypes.', 'Develops technology, entrepreneurship, research and presentation skills with global participation.', '{}', 'https://www.technovation.org/', null, null, 8, 18, '{}', '{}', array['Coding','Artificial Intelligence','Design & UI/UX','Entrepreneurship'], 'Technovation', 'https://www.technovation.org/', array['Worldwide'], 'active', now(), now()),
('Global Youth Action Fund 2026', 'International Baccalaureate', 'fellowship', true, false, '2026-01-30T23:59:59Z', 'Free', 'Global / project-based', 'Secondary school students ages 12-19; IB World School enrollment is not required.', 'Grant and mentorship program for youth-led projects addressing at least one UN Sustainable Development Goal.', 'Provides project funding, mentorship and international networking for youth-led social-impact work.', '{}', 'https://www.ibo.org/news/news-about-the-ib/global-youth-action-fund-2026-applications-are-now-open/', null, null, 12, 19, '{}', '{}', array['Social Impact','Science','Coding','Creative Writing'], 'International Baccalaureate', 'https://www.ibo.org/', array['Worldwide'], 'closed', now(), now()),
('Indian Computing Olympiad 2027', 'IARCS', 'competition', true, true, null, 'Fee announced by organizer', 'India / exam centres', 'School students enrolled up to Class 12; ICO-2027 registration is announced for October 2026.', 'National algorithmic programming competition leading toward India''s IOI selection pathway.', 'One of the strongest official competitive-programming pathways for school students in India.', '{}', 'https://www.iarcs.org.in/inoi/current.php', null, 'Class 12', null, 18, '{}', '{}', array['Coding','Mathematics','Algorithms'], 'IARCS', 'https://www.iarcs.org.in/inoi/current.php', array['India'], 'upcoming', now(), now())
on conflict do nothing;

-- Remove demo listings that were never backed by an official verified source.
delete from public.opportunities
where title in ('Mathematics Opportunity (Demo)', 'STEM Scholarship', 'National Talent Search Example (Demo)', 'Global Junior Open Source Challenge');

-- Public users only see verified records. Expired/closed records remain queryable by admins for audit.
