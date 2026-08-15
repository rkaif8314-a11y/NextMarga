import { UserProfile, Opportunity, ApplicationItem, RoadmapPhase, CareerOutcome, AppNotification, ChatMessage } from '../types';

export const initialProfile: UserProfile = {
  fullName: "Arjun Kumar",
  dob: "05/15/2010",
  gender: "Male",
  phone: "+91 98765 43210",
  fatherName: "Rajesh Kumar",
  motherName: "Sunita Devi",
  guardianPhone: "+91 98765 43211",
  schoolName: "Delhi Public School",
  currentClass: "Class 8",
  educationalBoard: "CBSE",
  state: "Bihar",
  city: "Patna",
  interests: ["Mathematics", "Coding", "Science", "Robotics"],
  targetPath: "Engineering & Research",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

export const sampleSchools = [
  "Delhi Public School",
  "DAV Public School",
  "Doon School",
  "Kendriya Vidyalaya",
  "St. Xavier's High School",
  "Modern School",
  "National Public School",
  "Loyola School",
  "The Mother's International School"
];

export const sampleBoards = [
  "CBSE",
  "ICSE / ISC",
  "State Board (Bihar)",
  "State Board (Maharashtra)",
  "State Board (Karnataka)",
  "IB (International Baccalaureate)",
  "Cambridge / IGCSE"
];

export const sampleClasses = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "Undergraduate (1st/2nd Year)",
  "Undergraduate (3rd/4th Year)",
  "Postgraduate / PhD"
];

export const sampleInterestsList = [
  "Mathematics",
  "Coding",
  "Science",
  "Robotics",
  "Physics",
  "Astronomy",
  "Biology & Medicine",
  "Economics",
  "Debate & Public Speaking",
  "Design & UI/UX",
  "Artificial Intelligence",
  "Creative Writing"
];

export const sampleOpportunities: Opportunity[] = [
  {
    id: "math-olympiad-2024",
    title: "Mathematics Olympiad 2024",
    category: "competition",
    isVerified: true,
    isGovt: true,
    deadline: "2026-10-25",
    deadlineDisplay: "Oct 25",
    timeRemainingBadge: "18 days",
    fee: "₹200",
    mode: "Online",
    eligibility: "Class 6-10",
    description: "National level mathematics competition testing problem-solving skills, logic, and analytical depth.",
    whyConsider: "The Mathematics Olympiad 2024 is a premier national-level competition designed to identify and nurture young mathematical talent. Participating in this Olympiad not only sharpens problem-solving skills but also provides a significant academic credential that is recognized by top educational institutions nationwide. It's an excellent stepping stone for students aiming for advanced STEM careers.",
    aiMatchReason: "Class 8 + Math interest match",
    requiredDocs: [
      "School ID Card or Bonafide Certificate",
      "Recent Passport Size Photograph",
      "Previous Year Marksheet (Optional but recommended)"
    ],
    timeline: [
      {
        phase: "CURRENT PHASE",
        title: "Registration Opens",
        description: "Applications are currently being accepted online.",
        status: "current"
      },
      {
        phase: "UPCOMING",
        title: "Exam Date",
        description: "To be announced shortly after registration closes.",
        status: "upcoming"
      },
      {
        phase: "FINAL",
        title: "Results",
        description: "Expected within 4 weeks post-examination.",
        status: "final"
      }
    ],
    officialUrl: "https://olympiads.hbcse.tifr.res.in"
  },
  {
    id: "stem-scholarship-bihar",
    title: "STEM Scholarship",
    category: "scholarship",
    isVerified: true,
    isGovt: false,
    deadline: "2026-11-15",
    deadlineDisplay: "Nov 15",
    timeRemainingBadge: "1 month",
    fee: "Free",
    mode: "Merit-based Grant",
    eligibility: "Class 8-12 (State Residents)",
    description: "Financial support for students excelling in Science, Technology, Engineering, and Math.",
    whyConsider: "Empowering talented students from regional districts with direct financial grant support (₹25,000/year), mentorship sessions with IIT professors, and complimentary access to digital laboratory simulations.",
    aiMatchReason: "State-specific (Bihar)",
    requiredDocs: [
      "Domicile Certificate / Proof of Residence",
      "Annual Income Certificate (< ₹4 LPA)",
      "Latest Academic Marksheet with >75% STEM aggregate",
      "Bank Account details for Direct Benefit Transfer"
    ],
    timeline: [
      {
        phase: "CURRENT PHASE",
        title: "Application Window Active",
        description: "Submit personal, academic, and guardian financial records.",
        status: "current"
      },
      {
        phase: "UPCOMING",
        title: "Merit List Verification",
        description: "District level scrutiny of eligible applications.",
        status: "upcoming"
      },
      {
        phase: "FINAL",
        title: "Grant Disbursement",
        description: "Direct bank transfer to selected awardees.",
        status: "final"
      }
    ],
    officialUrl: "https://scholarships.gov.in"
  },
  {
    id: "zonal-informatics-olympiad",
    title: "Zonal Informatics Olympiad (ZIO)",
    category: "competition",
    isVerified: true,
    isGovt: true,
    deadline: "2026-11-30",
    deadlineDisplay: "Nov 30",
    timeRemainingBadge: "45 days",
    fee: "₹400",
    mode: "In-Person Center",
    eligibility: "Class 8-12",
    description: "Written algorithmic and logic exam leading to Indian National Olympiad in Informatics (INOI) and International Olympiad (IOI).",
    whyConsider: "Direct qualification route to represent India at the International Olympiad in Informatics (IOI). Qualifiers receive direct interview calls for top computer science institutes like CMI, IIIT-H, and ISI.",
    aiMatchReason: "Class 8 + Coding/Math passion",
    requiredDocs: [
      "School Enrollment Verification",
      "Valid Government Photo ID (Aadhaar or Passport)"
    ],
    timeline: [
      {
        phase: "CURRENT PHASE",
        title: "Online Center Selection",
        description: "Choose preferred examination city and download hall ticket.",
        status: "current"
      },
      {
        phase: "UPCOMING",
        title: "ZIO Examination",
        description: "3-hour pen-and-paper algorithmic problem-solving exam.",
        status: "upcoming"
      },
      {
        phase: "FINAL",
        title: "INOI Shortlist Announcement",
        description: "Top ~300 students qualified for coding round.",
        status: "final"
      }
    ],
    officialUrl: "https://www.iarcs.org.in/inoi/"
  },
  {
    id: "google-code-in-fellow",
    title: "Global Junior Open Source Challenge",
    category: "competition",
    isVerified: true,
    isGovt: false,
    deadline: "2026-12-10",
    deadlineDisplay: "Dec 10",
    timeRemainingBadge: "2 months",
    fee: "Free",
    mode: "Online (Global)",
    eligibility: "Ages 13-17",
    description: "International coding & open-source initiative introducing teenagers to software engineering, documentation, and design.",
    whyConsider: "Learn collaboration with global mentors, contribute real code to major open-source projects, and win certificates, swags, and travel grant consideration.",
    aiMatchReason: "Age match + Coding enthusiast",
    requiredDocs: [
      "Parental Consent Form",
      "GitHub Profile Link",
      "School ID Card"
    ],
    timeline: [
      {
        phase: "CURRENT PHASE",
        title: "Task Claiming Opens",
        description: "Pick small beginner tasks (Python, HTML/CSS, bugs).",
        status: "current"
      },
      {
        phase: "UPCOMING",
        title: "Sprint Submissions",
        description: "Submit Pull Requests and receive mentor feedback.",
        status: "upcoming"
      },
      {
        phase: "FINAL",
        title: "Grand Prize Winners",
        description: "Recognition and virtual showcase.",
        status: "final"
      }
    ],
    officialUrl: "https://developers.google.com/open-source"
  },
  {
    id: "ntse-national-talent",
    title: "National Talent Search Examination (NTSE)",
    category: "exam",
    isVerified: true,
    isGovt: true,
    deadline: "2026-11-20",
    deadlineDisplay: "Nov 20",
    timeRemainingBadge: "25 days",
    fee: "Free",
    mode: "Offline Center",
    eligibility: "Class 10 (Prep in Class 8-9)",
    description: "Prestigious national scholarship testing Mental Ability (MAT) and Scholastic Aptitude (SAT).",
    whyConsider: "Lifelong monthly scholarship through PhD level, special quota in premier universities, and top-tier academic prestige.",
    aiMatchReason: "Class 8 Foundation Target",
    requiredDocs: [
      "School Endorsement Form",
      "Caste / Category Certificate if applicable",
      "Previous Term Report Card"
    ],
    timeline: [
      {
        phase: "CURRENT PHASE",
        title: "State Level (Stage 1)",
        description: "Conducted by State SCERT boards.",
        status: "current"
      },
      {
        phase: "UPCOMING",
        title: "National Level (Stage 2)",
        description: "NCERT national examination.",
        status: "upcoming"
      },
      {
        phase: "FINAL",
        title: "Award List",
        description: "Top 2000 scholars honored.",
        status: "final"
      }
    ],
    officialUrl: "https://ncert.nic.in"
  }
];

export const sampleApplications: ApplicationItem[] = [
  {
    id: "app-1",
    opportunityId: "techcorp-intern",
    title: "Software Engineering Intern",
    organization: "TechCorp Inc.",
    location: "Remote",
    status: "Under Review",
    badgeColor: "text-blue-700 bg-blue-50 border-blue-200",
    letter: "T",
    appliedDate: "Applied 2w ago",
    term: "Summer 2024",
    category: "active"
  },
  {
    id: "app-2",
    opportunityId: "dataminds-fellowship",
    title: "Data Science Fellowship",
    organization: "DataMinds",
    location: "New York, NY",
    status: "Interview Scheduled",
    badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
    letter: "D",
    appliedDate: "Applied 1w ago",
    interviewTime: "Tomorrow, 2:00 PM",
    category: "active"
  },
  {
    id: "app-3",
    opportunityId: "product-coop",
    title: "Product Management Co-op",
    organization: "Global Innovations",
    location: "Boston, MA",
    status: "Applied",
    badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    letter: "G",
    appliedDate: "Applied 3d ago",
    category: "active"
  },
  {
    id: "app-4",
    opportunityId: "math-olympiad-2024",
    title: "Mathematics Olympiad 2024",
    organization: "National Math Council",
    location: "Online",
    status: "Saved",
    badgeColor: "text-slate-700 bg-slate-100 border-slate-200",
    letter: "M",
    appliedDate: "Saved 4d ago",
    category: "saved"
  },
  {
    id: "app-5",
    opportunityId: "stem-scholarship-bihar",
    title: "STEM Scholarship Bihar",
    organization: "State Science Department",
    location: "Patna, Bihar",
    status: "Saved",
    badgeColor: "text-slate-700 bg-slate-100 border-slate-200",
    letter: "S",
    appliedDate: "Saved 1w ago",
    category: "saved"
  },
  {
    id: "app-6",
    opportunityId: "junior-science-fellow",
    title: "Junior Science Fellowship",
    organization: "National Science Foundation",
    location: "Online",
    status: "Accepted",
    badgeColor: "text-green-700 bg-green-50 border-green-200",
    letter: "J",
    appliedDate: "Completed May 2024",
    category: "completed"
  }
];

export const sampleRoadmapPhases: RoadmapPhase[] = [
  {
    id: "phase-now",
    phase: "NOW",
    phaseTag: "CLASS 12 GOALS",
    timeframe: "Immediate",
    title: "NOW",
    goals: [
      { id: "g1", text: "Entrance exams prep", completed: true },
      { id: "g2", text: "NCERT revision", completed: false }
    ]
  },
  {
    id: "phase-next",
    phase: "NEXT",
    phaseTag: "ADMISSIONS & COUNSELING",
    timeframe: "6-12 Months",
    title: "NEXT",
    description: "Admission counseling & University shortlisting based on projected scores.",
    goals: [],
    ctaText: "Explore Universities",
    ctaAction: "explore_univ"
  },
  {
    id: "phase-later",
    phase: "LATER",
    phaseTag: "LONG TERM ACADEMIC",
    timeframe: "1-4 Years",
    title: "LATER",
    description: "Degree focus, Research internships, and Fellowships.",
    goals: []
  }
];

export const sampleCareerOutcomes: CareerOutcome[] = [
  {
    id: "outcome-a",
    pathLabel: "Path A",
    title: "Research / PhD",
    description: "Focus on academic excellence, publishing papers, and securing research grants.",
    tags: ["Academia", "R&D Labs"],
    accentGradient: "from-indigo-500/10 to-purple-500/10"
  },
  {
    id: "outcome-b",
    pathLabel: "Path B",
    title: "Industry Tech & Engineering",
    description: "Focus on building production software, cloud scale systems, and internships.",
    tags: ["Software", "Big Tech", "AI Systems"],
    accentGradient: "from-blue-500/10 to-cyan-500/10"
  },
  {
    id: "outcome-c",
    pathLabel: "Path C",
    title: "DeepTech Innovation & Startups",
    description: "Commercialize scientific breakthroughs and launch venture-backed ventures.",
    tags: ["Founders", "Venture", "Patents"],
    accentGradient: "from-emerald-500/10 to-teal-500/10"
  }
];

export const sampleNotifications: AppNotification[] = [
  {
    id: "notif-1",
    type: "urgent",
    title: "URGENT DEADLINE",
    message: "Mathematics Olympiad registration closes in 24 hours! Don't miss out.",
    timestamp: "2h ago",
    unread: true,
    actionScreen: "detail",
    actionId: "math-olympiad-2024"
  },
  {
    id: "notif-2",
    type: "match",
    title: "NEW MATCH",
    message: "New Scholarship Found: 'State Merit Scholarship' matches your Class 8 profile in Bihar.",
    timestamp: "5h ago",
    unread: true,
    actionScreen: "detail",
    actionId: "stem-scholarship-bihar"
  },
  {
    id: "notif-3",
    type: "update",
    title: "APPLICATION UPDATE",
    message: "Your application for 'Junior Science Fellowship' is now 'Under Review'.",
    timestamp: "1d ago",
    unread: true,
    actionScreen: "applications",
    actionId: "app-1"
  },
  {
    id: "notif-4",
    type: "milestone",
    title: "ROADMAP MILESTONE",
    message: "Time for NCERT Revision! Check your Roadmap for this week's goals.",
    timestamp: "2d ago",
    unread: false,
    actionScreen: "roadmap"
  }
];

export const sampleInitialChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "user",
    text: "I'm in Class 9 and I like coding. What should I do?",
    timestamp: "10:42 AM"
  },
  {
    id: "msg-2",
    sender: "ai",
    text: "Based on your Class 9 profile, you should start with basic Python and look into the IOI (International Olympiad in Informatics).\n\nHere are 3 coding competitions open for your age:",
    timestamp: "10:42 AM",
    cards: [
      {
        id: "zonal-informatics-olympiad",
        title: "Zonal Informatics O...",
        eligibility: "Class 8-12",
        scope: "National",
        opportunityId: "zonal-informatics-olympiad"
      },
      {
        id: "google-code-in-fellow",
        title: "Google Code-in",
        eligibility: "Ages 13-17",
        scope: "Global",
        opportunityId: "google-code-in-fellow"
      }
    ]
  }
];
