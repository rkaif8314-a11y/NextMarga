-- NextMarga starter opportunity catalog
-- IMPORTANT: Run only the SQL below in Supabase SQL Editor.
-- This script is safe to run repeatedly.

DELETE FROM public.opportunities
WHERE title IN (
  'INSPIRE Awards – MANAK',
  'National Scholarship Portal',
  'AICTE Internship Portal',
  'National Career Service',
  'INSPIRE Scholarship for Higher Education'
);

INSERT INTO public.opportunities (
  title, organization, category, is_verified, is_govt,
  deadline, fee, mode, eligibility, description, why_consider,
  required_docs, official_url, minimum_class, maximum_class,
  minimum_age, maximum_age, states, boards, interests
) VALUES
(
  'INSPIRE Awards – MANAK',
  'Department of Science & Technology, Government of India',
  'competition', true, true,
  NULL, 'Free', 'Online through school',
  'Students in Classes 6–12; school nomination is required.',
  'A national innovation programme encouraging original science and socially useful ideas from school students.',
  'Excellent early-stage opportunity for students interested in science, innovation and problem solving.',
  ARRAY['Student details', 'Original idea/innovation details'],
  'https://www.inspireawards-dst.gov.in/',
  '6', '12', NULL, NULL, ARRAY[]::text[], ARRAY[]::text[], ARRAY['Science','Innovation','Technology']
),
(
  'National Scholarship Portal',
  'Government of India',
  'scholarship', true, true,
  NULL, 'Free', 'Online',
  'Eligibility varies by scholarship, class/course, income, category and other scheme conditions.',
  'Government scholarship discovery and application portal covering multiple central and other scholarship schemes.',
  'Useful single starting point for finding scholarships relevant to a student profile.',
  ARRAY['Academic records', 'Identity documents', 'Bank details where required'],
  'https://scholarships.gov.in/',
  '6', NULL, NULL, NULL, ARRAY[]::text[], ARRAY[]::text[], ARRAY['Scholarship','Education']
),
(
  'AICTE Internship Portal',
  'All India Council for Technical Education',
  'internship', true, true,
  NULL, 'Varies', 'Online',
  'Primarily for eligible higher-education students; individual internship requirements apply.',
  'Official internship platform providing internship opportunities and application information for students.',
  'A direct government-supported route to discover internships and build practical experience.',
  ARRAY['Student profile', 'Resume where required'],
  'https://internship.aicte-india.org/',
  'College', NULL, NULL, NULL, ARRAY[]::text[], ARRAY[]::text[], ARRAY['Technology','Engineering','Internship']
),
(
  'National Career Service',
  'Ministry of Labour & Employment, Government of India',
  'job', true, true,
  NULL, 'Free', 'Online',
  'Eligibility varies by job, employer and qualification.',
  'Government career and employment service providing job search, career information and related services.',
  'Useful for career exploration and eligible job opportunities from an official government platform.',
  ARRAY['Profile information', 'Qualification details'],
  'https://www.ncs.gov.in/',
  '12', NULL, NULL, NULL, ARRAY[]::text[], ARRAY[]::text[], ARRAY['Career','Jobs','Skills']
),
(
  'INSPIRE Scholarship for Higher Education',
  'Department of Science & Technology, Government of India',
  'scholarship', true, true,
  NULL, 'Free', 'Online',
  'For eligible students pursuing higher education in basic and natural sciences; scheme-specific conditions apply.',
  'Scholarship support under the INSPIRE programme for students pursuing eligible science education.',
  'Can provide financial support for students continuing a science-focused higher-education pathway.',
  ARRAY['Academic records', 'Admission/enrolment proof', 'Identity documents where required'],
  'https://online-inspire.gov.in/',
  'College', NULL, NULL, NULL, ARRAY[]::text[], ARRAY[]::text[], ARRAY['Science','Scholarship','Research']
);
