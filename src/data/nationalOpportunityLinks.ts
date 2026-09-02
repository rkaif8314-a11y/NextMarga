export type NationalOpportunityLink = {
  title: string;
  category: 'scholarship' | 'internship' | 'fellowship' | 'competition' | 'job' | 'other';
  organization: string;
  url: string;
  scope: 'All India';
  verifiedOn: string;
};

/**
 * Official national opportunity sources used by NextMarga.
 * Deadlines are intentionally kept in the database because they change frequently.
 * Always open the official source before applying.
 */
export const NATIONAL_OPPORTUNITY_LINKS: NationalOpportunityLink[] = [
  { title: 'National Scholarship Portal — 2026-27', category: 'scholarship', organization: 'Government of India', url: 'https://scholarships.gov.in/All-Scholarships', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'UGC Student Corner — Scholarships & Fellowships', category: 'fellowship', organization: 'UGC', url: 'https://www.ugc.gov.in/Home/student_Corner', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'DST INSPIRE Scheme', category: 'scholarship', organization: 'Department of Science & Technology', url: 'https://dst.gov.in/inspire-scheme-innovation-science-pursuit-inspired-research', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'DST WISE-PhD Fellowship', category: 'fellowship', organization: 'Department of Science & Technology', url: 'https://dst.gov.in/wise-fellowship-phd-wise-phd', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'AICTE National Internship Portal', category: 'internship', organization: 'AICTE', url: 'https://internship.aicte-india.org/', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'ISRO Internship & Student Projects', category: 'internship', organization: 'ISRO', url: 'https://www.isro.gov.in/InternshipAndProjects.html', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'ISRO Do A Project', category: 'internship', organization: 'ISRO', url: 'https://www.isro.gov.in/DoAProject.html', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'DRDO Student Opportunities & Internships', category: 'internship', organization: 'DRDO', url: 'https://drdo.gov.in/drdo/en/media', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'National Career Service — All India Jobs', category: 'job', organization: 'Ministry of Labour & Employment', url: 'https://www.ncs.gov.in/jobs-in-all-india', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'National Career Service — Government Vacancies', category: 'job', organization: 'Ministry of Labour & Employment', url: 'https://www.ncs.gov.in/Pages/Govt-Job-Vacancies.aspx/1000', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'MyGov Do/Tasks & Competitions', category: 'competition', organization: 'MyGov', url: 'https://www.mygov.in/home/do', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'Smart India Hackathon', category: 'competition', organization: 'Ministry of Education / AICTE', url: 'https://www.sih.gov.in/', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'Smart India Hackathon Junior Edition', category: 'competition', organization: 'AICTE / Ministry of Education', url: 'https://junior.sih.gov.in/', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'Startup India Programs & Challenges', category: 'competition', organization: 'Startup India / DPIIT', url: 'https://www.startupindia.gov.in/content/sih/en/ams-application/application-listing.html', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'Bharat Startup Grand Challenge', category: 'competition', organization: 'Startup India / DPIIT', url: 'https://www.startupindia.gov.in/content/sih/en/bharat-startup-grand-challenge.html', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'Khelo India Competitions & Leagues', category: 'competition', organization: 'Ministry of Youth Affairs & Sports', url: 'https://www.kheloindia.gov.in/', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'ICMR Fellowships', category: 'fellowship', organization: 'ICMR', url: 'https://www.icmr.gov.in/fellowships', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'ICMR International Fellowship Programme', category: 'fellowship', organization: 'ICMR / DHR', url: 'https://www.icmr.gov.in/icmr-international-fellowship-programme-for-indian-biomedical-scientists', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'CSIR Fellowship & Research Announcements', category: 'fellowship', organization: 'CSIR', url: 'https://www.csir.res.in/en/News/Call-for-proposals/Announcements', scope: 'All India', verifiedOn: '2026-09-02' },
  { title: 'Education Ministry Scholarship & Fellowship Updates', category: 'scholarship', organization: 'Ministry of Education', url: 'https://www.education.gov.in/scholarship-and-fellowships-students', scope: 'All India', verifiedOn: '2026-09-02' },
];
