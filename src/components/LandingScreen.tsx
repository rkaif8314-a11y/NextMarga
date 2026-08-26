import React from 'react';
import { ArrowRight, Bookmark, BriefcaseBusiness, CalendarDays, GraduationCap, Search, Settings, ShieldCheck, Sparkles } from 'lucide-react';
import { AppScreen, Opportunity } from '../types';
import { OpportunityHub } from './OpportunityHub';

interface LandingScreenProps {
  opportunities: Opportunity[];
  savedOpportunityIds: string[];
  opportunitiesLoading?: boolean;
  onNavigate: (screen: AppScreen) => void;
  onStartOnboarding: () => void;
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onToggleSave: (opportunityId: string) => void;
}

const navItems: { label: string; screen: AppScreen }[] = [
  { label: 'Opportunities', screen: 'explore' },
  { label: 'Roadmap', screen: 'roadmap' },
  { label: 'Applications', screen: 'applications' },
  { label: 'CareerAI', screen: 'assessment' },
  { label: 'About', screen: 'support' },
];

const goals = [
  { label: 'Scholarships', value: 'Free and funded aid', icon: GraduationCap },
  { label: 'Internships', value: 'Career starters', icon: BriefcaseBusiness },
  { label: 'Closing Soon', value: 'Deadlines first', icon: CalendarDays },
  { label: 'Verified', value: 'Official sources', icon: ShieldCheck },
];

export const LandingScreen: React.FC<LandingScreenProps> = ({
  opportunities,
  savedOpportunityIds,
  opportunitiesLoading = false,
  onNavigate,
  onStartOnboarding,
  onSelectOpportunity,
  onToggleSave,
}) => (
  <div className="min-h-screen bg-[#F8F7F3] text-[#111827] selection:bg-sky-200 selection:text-slate-950">
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button onClick={() => onNavigate('landing')} className="flex items-center gap-3 text-left" aria-label="NextMarga home">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-sky-700 text-white shadow-sm"><Sparkles className="h-5 w-5" /></span>
          <span className="font-display text-xl font-semibold tracking-normal text-slate-950">NextMarga</span>
        </button>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button key={item.label} onClick={() => onNavigate(item.screen)} className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${item.screen === 'explore' ? 'bg-sky-50 text-sky-800' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'}`}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('explore')} className="hidden h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm hover:bg-slate-50 sm:inline-flex"><Search className="h-4 w-4" /> Search</button>
          <button onClick={() => onNavigate('settings')} className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50" aria-label="Open appearance and settings" title="Theme and settings"><Settings className="h-4 w-4" /></button>
          <button onClick={onStartOnboarding} className="inline-flex h-10 items-center gap-2 rounded-md bg-sky-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-sky-800">Sign in</button>
        </div>
      </div>
    </header>

    <main>
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-8 sm:px-6 lg:pt-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            <h1 className="max-w-4xl font-display text-4xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-5xl">Find opportunities that are right for you.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">Search scholarships, internships, exams, fellowships, research programs and competitions from trusted sources. Explore first, then sign in only when you want to save, apply or track progress.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {goals.map(({ label, value, icon: Icon }) => (
                <button key={label} onClick={() => onNavigate('explore')} className="flex min-h-20 items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-sky-50 text-sky-700"><Icon className="h-5 w-5" /></span>
                  <span><span className="block text-sm font-semibold text-slate-950">{label}</span><span className="mt-1 block text-xs text-slate-500">{value}</span></span>
                </button>
              ))}
            </div>
          </div>
          <aside className="rounded-lg border border-sky-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-sky-50 text-sky-700"><Bookmark className="h-5 w-5" /></span>
              <div>
                <h2 className="text-base font-semibold text-slate-950">Sign in to save and track</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">Save opportunities, personalize your roadmap and continue applications from the same place.</p>
              </div>
            </div>
            <button onClick={onStartOnboarding} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">Start free <ArrowRight className="h-4 w-4" /></button>
          </aside>
        </div>
      </section>

      <OpportunityHub opportunities={opportunities} savedOpportunityIds={savedOpportunityIds} opportunitiesLoading={opportunitiesLoading} onSelectOpportunity={onSelectOpportunity} onToggleSave={onToggleSave} compactIntro />

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-slate-600 sm:grid-cols-[1.3fr_2fr] sm:px-6">
          <div><div className="font-display text-lg font-semibold text-slate-950">NextMarga</div><p className="mt-2 max-w-md leading-6">A calmer way to discover verified education and career opportunities.</p></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {['Scholarships', 'Exams', 'Internships', 'Fellowships', 'Roadmap', 'CareerAI', 'Help', 'Verification'].map((item) => (
              <button key={item} onClick={() => onNavigate(item === 'Roadmap' ? 'roadmap' : item === 'CareerAI' ? 'assessment' : item === 'Verification' ? 'legal-verification' : item === 'Help' ? 'support' : 'explore')} className="text-left hover:text-sky-700">{item}</button>
            ))}
          </div>
        </div>
      </footer>
    </main>
  </div>
);
