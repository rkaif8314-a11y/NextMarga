-- NextMarga Global Opportunity Catalog
-- These are durable, official opportunity/program records. Deadlines are left NULL when the official source uses seasonal/rolling dates.
-- Run after supabase/migrations/20260818_global_opportunity_fields.sql.

INSERT INTO public.opportunities (
  title, organization, category, is_verified, is_govt,
  deadline, fee, mode, eligibility, description, why_consider,
  required_docs, official_url, minimum_class, maximum_class,
  minimum_age, maximum_age, states, boards, interests,
  countries, regions, opportunity_status, source_type, last_verified_at,
  application_url, provider_type
) VALUES
(
  'International Mathematical Olympiad (IMO)',
  'International Mathematical Olympiad',
  'competition', true, false, NULL, 'Varies by national selection', 'International / national selection',
  'Secondary-school students participate through their country or territory selection process; national eligibility rules apply.',
  'The world championship mathematics competition for high-school students, reached through national selection systems.',
  'A strong long-term target for students building advanced mathematics skills.',
  ARRAY['National selection requirements'], 'https://www.imo-official.org/', '8', '12', NULL, NULL,
  ARRAY[]::text[], ARRAY[]::text[], ARRAY['Mathematics','Problem Solving'],
  ARRAY[]::text[], ARRAY['Global'], 'seasonal', 'institution', now(), 'https://www.imo-official.org/', 'International Olympiad'
),
(
  'International Physics Olympiad (IPhO)',
  'International Physics Olympiad',
  'competition', true, false, NULL, 'Varies by national selection', 'International / national selection',
  'High-school students participate through national selection and delegation rules.',
  'International competition for secondary-school physics students.',
  'Useful for students pursuing physics, engineering and scientific research.',
  ARRAY['National selection requirements'], 'https://www.ipho-new.org/', '8', '12', NULL, NULL,
  ARRAY[]::text[], ARRAY[]::text[], ARRAY['Physics','Science','Engineering'],
  ARRAY[]::text[], ARRAY['Global'], 'seasonal', 'institution', now(), 'https://www.ipho-new.org/', 'International Olympiad'
),
(
  'International Chemistry Olympiad (IChO)',
  'International Chemistry Olympiad',
  'competition', true, false, NULL, 'Varies by national selection', 'International / national selection',
  'Secondary-school students participate through their national chemistry olympiad selection process.',
  'International chemistry competition for talented secondary-school students.',
  'A high-value target for students interested in chemistry and research.',
  ARRAY['National selection requirements'], 'https://icho-official.org/', '8', '12', NULL, NULL,
  ARRAY[]::text[], ARRAY[]::text[], ARRAY['Chemistry','Science','Research'],
  ARRAY[]::text[], ARRAY['Global'], 'seasonal', 'institution', now(), 'https://icho-official.org/', 'International Olympiad'
),
(
  'International Olympiad in Informatics (IOI)',
  'International Olympiad in Informatics',
  'competition', true, false, NULL, 'Varies by national selection', 'International / national selection',
  'School students participate through national selection processes; country-specific age and school rules apply.',
  'International programming competition for secondary-school students.',
  'Excellent long-term target for students developing algorithms and competitive programming.',
  ARRAY['National selection requirements'], 'https://ioinformatics.org/', '8', '12', NULL, NULL,
  ARRAY[]::text[], ARRAY[]::text[], ARRAY['Programming','Computer Science','Algorithms'],
  ARRAY[]::text[], ARRAY['Global'], 'seasonal', 'institution', now(), 'https://ioinformatics.org/', 'International Olympiad'
),
(
  'Erasmus Mundus Joint Masters',
  'European Commission',
  'scholarship', true, true, NULL, 'Programme-specific', 'International / online application',
  'Scholarship-supported joint master programmes delivered by international higher-education consortia; eligibility varies by programme.',
  'A major international route for postgraduate study across multiple countries.',
  'Useful for students planning an international master''s pathway after a bachelor''s degree.',
  ARRAY['Programme-specific academic documents'], 'https://erasmus-plus.ec.europa.eu/', 'College', NULL, NULL, NULL,
  ARRAY[]::text[], ARRAY[]::text[], ARRAY['Higher Education','Research','International Study'],
  ARRAY[]::text[], ARRAY['Europe'], 'seasonal', 'government', now(), 'https://erasmus-plus.ec.europa.eu/', 'European Commission'
),
(
  'DAAD Scholarships and Funding',
  'German Academic Exchange Service (DAAD)',
  'scholarship', true, false, NULL, 'Programme-specific', 'International / programme-specific',
  'Scholarships and funding opportunities for international students, graduates and researchers; requirements vary by programme.',
  'A major source of funding information for international study and research in Germany.',
  'Useful for students planning graduate study or research in Germany.',
  ARRAY['Programme-specific academic documents'], 'https://www.daad.de/en/studying-in-germany/scholarships/', 'College', NULL, NULL, NULL,
  ARRAY[]::text[], ARRAY[]::text[], ARRAY['Higher Education','Research','Germany','International Study'],
  ARRAY[]::text[], ARRAY['Europe'], 'seasonal', 'institution', now(), 'https://www.daad.de/en/studying-in-germany/scholarships/', 'DAAD'
),
(
  'Commonwealth Scholarships',
  'Commonwealth Scholarship Commission in the UK',
  'scholarship', true, true, NULL, 'Programme-specific', 'International / application through eligible routes',
  'Scholarship programmes supporting eligible Commonwealth citizens for postgraduate study and professional development in the UK.',
  'A high-impact postgraduate funding pathway for eligible Commonwealth applicants.',
  'Useful for long-term international postgraduate planning.',
  ARRAY['Programme-specific academic documents'], 'https://cscuk.fcdo.gov.uk/scholarships/', 'College', NULL, NULL, NULL,
  ARRAY[]::text[], ARRAY[]::text[], ARRAY['Higher Education','Research','International Study'],
  ARRAY['GB'], ARRAY['Europe','Commonwealth'], 'seasonal', 'government', now(), 'https://cscuk.fcdo.gov.uk/scholarships/', 'Commonwealth Scholarship Commission'
),
(
  'Fulbright Foreign Student Program',
  'Fulbright Foreign Scholarship Board / U.S. Department of State',
  'fellowship', true, true, NULL, 'Programme-specific', 'International / country-specific',
  'Graduate-level study and research opportunities in the United States for eligible foreign students; country rules vary.',
  'A major international postgraduate study and research pathway.',
  'Useful for students planning a future graduate or research career in the United States.',
  ARRAY['Programme-specific academic documents'], 'https://foreign.fulbrightonline.org/', 'College', NULL, NULL, NULL,
  ARRAY[]::text[], ARRAY[]::text[], ARRAY['Higher Education','Research','International Study'],
  ARRAY[]::text[], ARRAY['North America','Global'], 'seasonal', 'government', now(), 'https://foreign.fulbrightonline.org/', 'Fulbright'
),
(
  'UNESCO Youth and Education Opportunities',
  'UNESCO',
  'other', true, true, NULL, 'Varies', 'International / programme-specific',
  'UNESCO publishes youth, education, learning and participation opportunities with individual eligibility rules.',
  'A discovery source for international education and youth initiatives.',
  'Useful for broadening NextMarga beyond country-specific opportunities.',
  ARRAY['Opportunity-specific requirements'], 'https://www.unesco.org/en/youth', '10', NULL, NULL, NULL,
  ARRAY[]::text[], ARRAY[]::text[], ARRAY['Education','Youth','Social Impact','International'],
  ARRAY[]::text[], ARRAY['Global'], 'rolling', 'institution', now(), 'https://www.unesco.org/en/youth', 'UNESCO'
),
(
  'United Nations Volunteers (UNV) Opportunities',
  'United Nations Volunteers',
  'other', true, true, NULL, 'Varies', 'International / online or in-person',
  'Volunteer assignments published by UNV with individual age, education, location and experience requirements.',
  'A recognized international route for civic and development experience when the user is eligible.',
  'Useful for older students and graduates planning social-impact experience.',
  ARRAY['Profile and opportunity-specific documents'], 'https://app.unv.org/', 'College', NULL, 18, NULL,
  ARRAY[]::text[], ARRAY[]::text[], ARRAY['Social Impact','International','Development'],
  ARRAY[]::text[], ARRAY['Global'], 'rolling', 'government', now(), 'https://app.unv.org/', 'United Nations'
),
(
  'MIT OpenCourseWare',
  'Massachusetts Institute of Technology',
  'other', true, false, NULL, 'Free', 'Online',
  'Open learning resources are broadly available; individual courses may have different prerequisites.',
  'Free university-level course materials across science, engineering, computing, economics and more.',
  'Provides a global learning-resource layer even when no formal application is required.',
  ARRAY[]::text[], 'https://ocw.mit.edu/', '8', NULL, NULL, NULL,
  ARRAY[]::text[], ARRAY[]::text[], ARRAY['Science','Technology','Engineering','Mathematics','Learning'],
  ARRAY[]::text[], ARRAY['Global'], 'rolling', 'institution', now(), 'https://ocw.mit.edu/', 'MIT'
),
(
  'Khan Academy Learning Resources',
  'Khan Academy',
  'other', true, false, NULL, 'Free', 'Online',
  'Free educational resources with subject and course availability varying by learner level.',
  'Structured learning resources that can support preparation for exams and long-term academic goals.',
  'Lets NextMarga connect opportunities with preparation resources instead of showing opportunities alone.',
  ARRAY[]::text[], 'https://www.khanacademy.org/', '6', NULL, NULL, NULL,
  ARRAY[]::text[], ARRAY[]::text[], ARRAY['Mathematics','Science','Programming','Learning'],
  ARRAY[]::text[], ARRAY['Global'], 'rolling', 'institution', now(), 'https://www.khanacademy.org/', 'Khan Academy'
)
ON CONFLICT DO NOTHING;
