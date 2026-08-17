-- NextMarga verified opportunity catalog
-- IMPORTANT: Run only the SQL below in Supabase SQL Editor.
-- This script is safe to run repeatedly.

DELETE FROM public.opportunities
WHERE title IN (
  'INSPIRE Awards – MANAK',
  'National Scholarship Portal',
  'AICTE Internship Portal',
  'National Career Service',
  'INSPIRE Scholarship for Higher Education',
  'myScheme – Government Scheme & Scholarship Finder',
  'Deen Dayal SPARSH Yojana',
  'MY Bharat Experiential Learning Opportunities',
  'Competition Commission of India Internship Programme',
  'My Income Tax – My Pride Poster & Painting Competition',
  'Short Video/Reel Competition on Responsible Taxation and Nation Building',
  'Census Connect – Selfie Contest',
  'Census Pulse – Reel Challenge',
  'National Quiz Competition on CA Day',
  'No Shortcuts to Parenthood – Legal Adoption Awareness Quiz'
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
),
(
  'myScheme – Government Scheme & Scholarship Finder',
  'Government of India, Digital India',
  'scholarship', true, true,
  NULL, 'Free', 'Online',
  'Eligibility is determined by the individual government scheme; users can search using demographic and eligibility details.',
  'National government platform for discovering central and state/UT schemes, including scholarships, using eligibility information.',
  'Makes the core NextMarga problem concrete: one place to discover government schemes relevant to the student.',
  ARRAY['Basic profile details', 'Scheme-specific documents where required'],
  'https://www.myscheme.gov.in/find-scheme',
  '6', NULL, NULL, NULL, ARRAY[]::text[], ARRAY[]::text[], ARRAY['Scholarship','Government Schemes','Education']
),
(
  'Deen Dayal SPARSH Yojana',
  'Department of Posts, Ministry of Communications, Government of India',
  'scholarship', true, true,
  NULL, 'Free', 'Through participating schools / official process',
  'For eligible students in Classes 6–9 with good academic performance and an interest in philately; scheme conditions apply.',
  'A national scholarship scheme that promotes philately as an educational hobby among school students.',
  'A strong example of a lesser-known school opportunity that personalized discovery can surface.',
  ARRAY['Academic record', 'School participation details', 'Scheme-specific documents'],
  'https://www.myscheme.gov.in/hi/schemes/ddsy',
  '6', '9', NULL, NULL, ARRAY[]::text[], ARRAY[]::text[], ARRAY['Scholarship','Philately','General Knowledge']
),
(
  'MY Bharat Experiential Learning Opportunities',
  'Ministry of Youth Affairs & Sports, Government of India',
  'internship', true, true,
  NULL, 'Varies', 'Online / In-person',
  'Youth eligibility and requirements vary by listed experiential learning opportunity.',
  'Official MY Bharat platform listing experiential learning opportunities across government organizations, institutions and businesses.',
  'Useful for discovering practical learning beyond classroom study and for building career exposure.',
  ARRAY['Profile details', 'Opportunity-specific documents where required'],
  'https://mybharat.gov.in/elp/listing',
  'College', NULL, NULL, NULL, ARRAY[]::text[], ARRAY[]::text[], ARRAY['Career','Skills','Internship','Experiential Learning']
),
(
  'Competition Commission of India Internship Programme',
  'Competition Commission of India, Government of India',
  'internship', true, true,
  NULL, 'See official guidelines', 'Online application / internship',
  'For eligible students in Economics, Law, Management, Finance and related disciplines; official guidelines control eligibility.',
  'Official CCI internship programme offering practical exposure to competition law and economic regulation.',
  'A credible government internship route for students considering law, economics, finance or management careers.',
  ARRAY['Application form', 'Academic details', 'SOP and other documents as specified'],
  'https://www.cci.gov.in/internship',
  'College', NULL, NULL, NULL, ARRAY[]::text[], ARRAY[]::text[], ARRAY['Law','Economics','Finance','Management','Internship']
),
(
  'My Income Tax – My Pride Poster & Painting Competition',
  'Income Tax Department, Ministry of Finance, Government of India + MyGov',
  'competition', true, true,
  '2026-08-24', 'Free', 'Online submission',
  'Open competition for school students, college students and youth subject to the official contest rules.',
  'MyGov competition organized with the Income Tax Department around awareness of taxation and nation building.',
  'A currently listed MyGov competition that gives students a practical creative participation opportunity.',
  ARRAY['Participant details', 'Competition submission'],
  'https://secure.mygov.in/home/do/',
  '6', NULL, NULL, NULL, ARRAY[]::text[], ARRAY[]::text[], ARRAY['Art','Civics','Competition','Creative']
),
(
  'Short Video/Reel Competition on Responsible Taxation and Nation Building',
  'Income Tax Department, Ministry of Finance, Government of India + MyGov',
  'competition', true, true,
  '2026-08-24', 'Free', 'Online submission',
  'Open to eligible citizens subject to the official MyGov contest rules.',
  'MyGov video/reel competition focused on responsible taxation and nation building.',
  'Good fit for students interested in communication, media, civics and creative digital work.',
  ARRAY['Participant details', 'Video/reel submission'],
  'https://secure.mygov.in/home/do/',
  '6', NULL, NULL, NULL, ARRAY[]::text[], ARRAY[]::text[], ARRAY['Media','Civics','Competition','Content Creation']
),
(
  'Census Connect – Selfie Contest',
  'Office of the Registrar General & Census Commissioner, India + MyGov',
  'competition', true, true,
  '2026-09-30', 'Free', 'Online submission',
  'Open to eligible citizens subject to the official MyGov contest rules.',
  'MyGov citizen-engagement contest connected with the Census Connect initiative.',
  'A current national participation opportunity that can be surfaced to students interested in civic engagement.',
  ARRAY['Participant details', 'Contest submission'],
  'https://secure.mygov.in/home/do/',
  '6', NULL, NULL, NULL, ARRAY[]::text[], ARRAY[]::text[], ARRAY['Civics','Competition','Photography']
),
(
  'Census Pulse – Reel Challenge',
  'Office of the Registrar General & Census Commissioner, India + MyGov',
  'competition', true, true,
  '2026-09-30', 'Free', 'Online submission',
  'Open to eligible citizens subject to the official MyGov contest rules.',
  'MyGov reel challenge connected with Census Pulse and public awareness.',
  'Useful for students interested in communication, civic awareness and digital storytelling.',
  ARRAY['Participant details', 'Reel submission'],
  'https://secure.mygov.in/home/do/',
  '6', NULL, NULL, NULL, ARRAY[]::text[], ARRAY[]::text[], ARRAY['Civics','Competition','Content Creation']
),
(
  'National Quiz Competition on CA Day',
  'Institute of Chartered Accountants of India + MyGov',
  'competition', true, true,
  '2026-09-30', 'Free', 'Online quiz',
  'Open to eligible participants subject to the official MyGov quiz rules.',
  'National online quiz hosted through MyGov in collaboration with ICAI.',
  'A useful competitive-learning opportunity for students interested in commerce, finance and general awareness.',
  ARRAY['Participant details'],
  'https://quiz.mygov.in/',
  '6', NULL, NULL, NULL, ARRAY[]::text[], ARRAY[]::text[], ARRAY['Commerce','Finance','Quiz','General Knowledge']
),
(
  'No Shortcuts to Parenthood – Legal Adoption Awareness Quiz',
  'Central Adoption Resource Authority + MyGov',
  'competition', true, true,
  '2026-10-31', 'Free', 'Online quiz',
  'Open to eligible participants subject to the official MyGov quiz rules.',
  'MyGov awareness quiz organized with the Central Adoption Resource Authority.',
  'Adds a civic and legal-awareness learning opportunity to the NextMarga catalog.',
  ARRAY['Participant details'],
  'https://quiz.mygov.in/',
  '6', NULL, NULL, NULL, ARRAY[]::text[], ARRAY[]::text[], ARRAY['Civics','Quiz','General Knowledge']
);
