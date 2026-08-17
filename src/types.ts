export interface UserProfile {
  fullName: string; dob: string; gender: string; phone: string; fatherName: string; motherName: string; guardianPhone: string; schoolName: string; currentClass: string; educationalBoard: string; state: string; city: string; interests: string[]; targetPath: string; avatarUrl: string;
}
export interface Opportunity {
  id: string; title: string; organization?: string; category: 'competition' | 'scholarship' | 'exam' | 'internship' | 'fellowship' | 'job' | 'other'; isVerified: boolean; isGovt: boolean; deadline: string; deadlineDisplay: string; timeRemainingBadge: string; fee: string; mode: string; eligibility: string; description: string; whyConsider: string; aiMatchReason: string; requiredDocs: string[]; timeline: { phase: string; title: string; description: string; status: 'current' | 'upcoming' | 'final' }[]; officialUrl?: string; accentColor?: string; minimumClass?: string | null; maximumClass?: string | null; minimumAge?: number | null; maximumAge?: number | null; states?: string[]; boards?: string[]; interests?: string[]; matchScore?: number;
}
export interface ApplicationItem { id: string; opportunityId?: string; title: string; organization: string; location: string; status: 'Under Review' | 'Interview Scheduled' | 'Applied' | 'Saved' | 'Accepted'; badgeColor: string; letter: string; appliedDate: string; term?: string; interviewTime?: string; category: 'active' | 'saved' | 'completed'; }
export interface RoadmapPhase { id: string; phase: 'NOW' | 'NEXT' | 'LATER'; phaseTag: string; timeframe: string; title: string; description?: string; goals: { id: string; text: string; completed: boolean }[]; ctaText?: string; ctaAction?: string; }
export interface CareerOutcome { id: string; pathLabel: string; title: string; description: string; tags: string[]; accentGradient: string; }
export interface AppNotification { id: string; type: 'urgent' | 'match' | 'update' | 'milestone'; title: string; message: string; timestamp: string; unread: boolean; actionScreen?: string; actionId?: string; }
export interface ChatCard { id: string; title: string; eligibility: string; scope: string; opportunityId?: string; }
export interface ChatMessage { id: string; sender: 'user' | 'ai'; text: string; timestamp: string; cards?: ChatCard[]; }
export type AppScreen = 'landing' | 'auth' | 'home' | 'explore' | 'roadmap' | 'applications' | 'profile' | 'onboarding' | 'detail' | 'assessment' | 'notifications';
