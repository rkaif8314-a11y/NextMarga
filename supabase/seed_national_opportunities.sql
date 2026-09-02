-- NextMarga national opportunity catalog seed
-- Verified against official sources on 2026-09-02.
-- The live database also contains current deadline records for these sources.
-- Always verify eligibility and deadline on the official page before applying.

INSERT INTO public.opportunity_source_catalog
(name, source_key, base_url, category, country_scope, source_type, active, extraction_method)
VALUES
('National Scholarship Portal','nsp','https://scholarships.gov.in/All-Scholarships','scholarship',ARRAY['India'],'government',true,'manual_or_api'),
('UGC Student Corner','ugc-student-corner','https://www.ugc.gov.in/Home/student_Corner','fellowship',ARRAY['India'],'official',true,'manual_or_api'),
('DST INSPIRE','dst-inspire','https://dst.gov.in/inspire-scheme-innovation-science-pursuit-inspired-research','scholarship',ARRAY['India'],'government',true,'manual_or_api'),
('AICTE Internship Portal','aicte-internships','https://internship.aicte-india.org/','internship',ARRAY['India'],'government',true,'manual_or_api'),
('ISRO Student Internships','isro-internships','https://www.isro.gov.in/InternshipAndProjects.html','internship',ARRAY['India'],'government',true,'manual_or_api'),
('DRDO Student Opportunities','drdo-students','https://drdo.gov.in/drdo/en/media','internship',ARRAY['India'],'government',true,'manual_or_api'),
('National Career Service','ncs-jobs','https://www.ncs.gov.in/jobs-in-all-india','job',ARRAY['India'],'government',true,'manual_or_api'),
('MyGov Do Tasks','mygov-do','https://www.mygov.in/home/do','competition',ARRAY['India'],'government',true,'manual_or_api'),
('Smart India Hackathon','sih','https://www.sih.gov.in/','competition',ARRAY['India'],'government',true,'manual_or_api'),
('Smart India Hackathon Junior','sih-junior','https://junior.sih.gov.in/','competition',ARRAY['India'],'government',true,'manual_or_api'),
('Startup India Challenges','startup-india','https://www.startupindia.gov.in/content/sih/en/ams-application/application-listing.html','competition',ARRAY['India'],'government',true,'manual_or_api'),
('Khelo India','khelo-india','https://www.kheloindia.gov.in/','competition',ARRAY['India'],'government',true,'manual_or_api'),
('ICMR Fellowships','icmr-fellowships','https://www.icmr.gov.in/fellowships','fellowship',ARRAY['India'],'government',true,'manual_or_api'),
('CSIR Research Announcements','csir-research','https://www.csir.res.in/en/News/Call-for-proposals/Announcements','fellowship',ARRAY['India'],'government',true,'manual_or_api'),
('Ministry of Education Scholarships & Fellowships','education-scholarships','https://www.education.gov.in/scholarship-and-fellowships-students','scholarship',ARRAY['India'],'government',true,'manual_or_api')
ON CONFLICT (source_key) DO UPDATE SET
  base_url=EXCLUDED.base_url,
  category=EXCLUDED.category,
  active=true,
  updated_at=now();
