-- Starter verified opportunity catalog for NextMarga.
-- These are official portals/schemes, not scraped third-party listings.
-- Run after schema.sql in Supabase SQL Editor.

insert into public.opportunities
  (title, organization, category, is_verified, is_govt, deadline, fee, mode, eligibility, description, why_consider, required_docs, official_url, minimum_class, maximum_class, minimum_age, maximum_age, states, boards, interests)
values
(
  'INSPIRE Awards – MANAK',
  'Department of Science & Technology / National Innovation Foundation',
  'competition', true, true, null, 'Free', 'School nomination',
  'Students in the school-age range covered by the scheme; nominations are submitted by participating schools.',
  'A national innovation programme that encourages school students to submit original science and technology ideas addressing societal needs.',
  'Strong early-stage innovation opportunity with a pathway from school-level selection to exhibitions and national recognition.',
  array['Student profile details','School nomination','Original idea description'],
  'https://inspireawards-dst.gov.in/',
  '6', '12', 10, 15, '{}', '{}', array['science','innovation','technology','entrepreneurship']
),
(
  'National Scholarship Portal',
  'Government of India',
  'scholarship', true, true, null, 'Varies by scheme', 'Online',
  'Eligibility varies by scholarship; students should check the individual scheme rules on the official portal.',
  'Central platform for discovering and applying for multiple government scholarship schemes.',
  'Useful as a single starting point for students looking for government scholarships and scheme-specific eligibility.',
  array['Student identity details','Bank details where required','Scheme-specific certificates'],
  'https://scholarships.gov.in/',
  '6', null, null, null, '{}', '{}', array['scholarship','education','financial aid']
),
(
  'AICTE Internship Portal',
  'All India Council for Technical Education',
  'internship', true, true, null, 'Free', 'Online / As listed',
  'Eligibility depends on the individual internship listing and student profile.',
  'Official AICTE platform listing internships and work-based learning opportunities for students and fresh engineers.',
  'A direct government-backed source for internship discovery without relying on unofficial aggregators.',
  array['Student registration','Institute/student details','Internship-specific documents'],
  'https://internship.aicte-india.org/',
  null, null, null, null, '{}', '{}', array['internship','engineering','technology','data science','ai','web development']
),
(
  'National Career Service',
  'Ministry of Labour & Employment, Government of India',
  'job', true, true, null, 'Free', 'Online',
  'Job eligibility varies by vacancy; users must verify qualification, age and employer details on the official listing.',
  'Government career platform providing job search and career-related services across India.',
  'Useful for older students and graduates moving from education into employment and career discovery.',
  array['Profile information','Education details','Job-specific documents'],
  'https://www.ncs.gov.in/',
  '12', null, 18, null, '{}', '{}', array['jobs','career','employment','skills']
),
(
  'INSPIRE Scholarship for Higher Education',
  'Department of Science & Technology, Government of India',
  'scholarship', true, true, null, 'Free', 'Online',
  'Eligibility and application windows are scheme-specific; applicants should verify the current cycle on the official INSPIRE portal.',
  'A government scholarship pathway for students pursuing higher education in science-related fields.',
  'Helps students connect school achievement and science-focused higher education with a government scholarship pathway.',
  array['Academic records','Identity documents','Institution/course details','Scheme-specific certificates'],
  'https://online-inspire.gov.in/',
  '12', null, null, null, '{}', '{}', array['science','higher education','scholarship','research']
)
on conflict do nothing;
