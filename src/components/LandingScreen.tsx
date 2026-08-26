import React, { useEffect, useMemo, useState, useDeferredValue } from 'react';
import { ArrowRight, BookOpen, BriefcaseBusiness, CheckCircle2, ChevronRight, Compass, GraduationCap, Moon, Search, Sparkles, Sun, Target, Users, Zap } from 'lucide-react';
import { Logo } from './Logo';
import { AppScreen, Opportunity } from '../types';
import { getVerifiedOpportunities } from '../lib/opportunities';
import { sampleOpportunities } from '../data/mockData';

interface LandingScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onStartOnboarding: () => void;
}

type ThemeMode = 'dark' | 'light';
type QuickFilter = 'all' | 'scholarship' | 'internship' | 'competition' | 'exam' | 'research' | 'hackathon';

const quickFilters: { id: QuickFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'scholarship', label: 'Scholarships' },
  { id: 'internship', label: 'Internships' },
  { id: 'competition', label: 'Competitions' },
  { id: 'exam', label: 'Exams' },
  { id: 'research', label: 'Research' },
  { id: 'hackathon', label: 'Hackathons' },
];

const goalCards = [
  { title: 'Study Abroad', icon: Compass },
  { title: 'Top Exams', icon: GraduationCap },
  { title: 'Research & PhD', icon: BookOpen },
  { title: 'Summer Programs', icon: Sun },
  { title: 'Build & Compete', icon: Zap },
  { title: 'Start Your Career', icon: BriefcaseBusiness },
];

function categoryLabel(category: Opportunity['category']) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate, onStartOnboarding }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [opportunities, setOpportunities] = useState<Opportunity[]>(sampleOpportunities);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nextmarga_preferences');
      const prefs = raw ? JSON.parse(raw) : {};
      const saved = prefs.theme === 'dark' ? 'dark' : 'light';
      setTheme(saved);
      document.documentElement.dataset.theme = saved;
    } catch {}

    let active = true;
    void getVerifiedOpportunities(250).then((items) => {
      if (active && items.length) setOpportunities(items);
    }).catch(() => {}).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      const current = JSON.parse(localStorage.getItem('nextmarga_preferences') || '{}');
      localStorage.setItem('nextmarga_preferences', JSON.stringify({ ...current, theme: next }));
    } catch {}
  };

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return opportunities.filter((item) => {
      const categoryMatches = quickFilter === 'all' || item.category === quickFilter;
      if (!categoryMatches) return false;
      if (!q) return true;
      return [item.title, item.organization, item.category, item.description, item.mode, item.eligibility, ...(item.states ?? []), ...(item.interests ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(q);
    }).slice(0, 4);
  }, [opportunities, deferredQuery, quickFilter]);

  const isDark = theme === 'dark';
  const surface = isDark ? 'bg-[#111827]' : 'bg-white';
  const page = isDark ? 'bg-[#f7f8fa] text-slate-100' : 'bg-[#f7f8fa] text-slate-900';
  const border = isDark ? 'border-slate-700' : 'border-slate-200';
  const muted = isDark ? 'text-slate-400' : 'text-slate-500';
  const subtle = isDark ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className={`min-h-screen ${page} overflow-x-hidden`}>
      <header className={`sticky top-0 z-40 border-b ${border} ${isDark ? 'bg-[#f7f8fa]/95 text-slate-900' : 'bg-white/95'} backdrop-blur-xl`}>
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <button onClick={() => onNavigate('landing')} className="shrink-0" aria-label="NextMarga home"><Logo size="md" /></button>
          <nav className="hidden md:flex items-center gap-6 text-[10px] font-medium text-slate-600">
            <button onClick={() => onNavigate('explore')} className="hover:text-slate-950 transition-colors">Opportunities</button>
            <button onClick={onStartOnboarding} className="hover:text-slate-950 transition-colors">Roadmap</button>
            <button onClick={() => onNavigate('auth')} className="hover:text-slate-950 transition-colors">Applications</button>
            <button onClick={() => onNavigate('auth')} className="hover:text-slate-950 transition-colors">CareerAI</button>
            <button onClick={() => onNavigate('auth')} className="hover:text-slate-950 transition-colors">About</button>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => document.getElementById('opportunity-search')?.focus()} className="hidden sm:inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[10px] text-slate-500 hover:text-slate-900" aria-label="Focus opportunity search"><Search className="h-3 w-3" /> Search</button>
            <button onClick={toggleTheme} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:text-slate-900" aria-label="Toggle theme">{isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}</button>
            <button onClick={() => onNavigate('auth')} className="inline-flex items-center gap-1.5 rounded-md bg-sky-700 px-3 py-1.5 text-[10px] font-semibold text-white hover:bg-sky-800">Sign in <ArrowRight className="h-3 w-3" /></button>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 pb-5 pt-7 text-center sm:pt-9">
            <div className="text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-400">Personalized opportunity intelligence</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-slate-900 sm:text-4xl">Find opportunities that are right for you.</h1>
            <p className="mx-auto mt-2 max-w-2xl text-[11px] leading-5 text-slate-500">Scholarships, internships, exams, fellowships, competitions, research programs and more — from trusted sources across India and the world.</p>

            <div className="mx-auto mt-5 flex max-w-2xl gap-2">
              <label className="relative flex-1">
                <span className="sr-only">Search opportunities</span>
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input id="opportunity-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search scholarships, internships, exams, IIT, research..." className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-[10px] text-slate-800 outline-none ring-sky-100 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2" />
              </label>
              <button onClick={() => onNavigate('explore')} className="rounded-md bg-sky-700 px-4 text-[10px] font-semibold text-white hover:bg-sky-800">Search</button>
            </div>

            <div className="mt-3 flex flex-wrap justify-center gap-1.5" aria-label="Quick filters">
              <span className="mr-1 self-center text-[9px] font-medium text-slate-400">Quick Filters</span>
              {quickFilters.map((filter) => <button key={filter.id} onClick={() => setQuickFilter(filter.id)} aria-pressed={quickFilter === filter.id} className={`rounded-md border px-2.5 py-1.5 text-[9px] transition-colors ${quickFilter === filter.id ? 'border-sky-200 bg-sky-50 font-semibold text-sky-700' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800'}`}>{filter.label}</button>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div><div className="text-[10px] font-semibold text-slate-700">{loading ? 'Loading verified opportunities…' : `${filtered.length} featured opportunities`}</div><div className="mt-0.5 text-[9px] text-slate-400">Explore a preview before signing in.</div></div>
            <button onClick={() => onNavigate('explore')} className="text-[9px] font-medium text-sky-700 hover:text-sky-900">View all opportunities <ChevronRight className="inline h-3 w-3" /></button>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
            {filtered.map((item) => <article key={item.id} className={`${surface} group flex min-h-[190px] flex-col rounded-lg border ${border} p-3 shadow-sm transition-shadow hover:shadow-md`}>
              <div className="flex items-start justify-between gap-2"><div className="min-w-0"><div className="flex flex-wrap gap-1"><span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[7px] font-semibold text-emerald-700">Verified</span>{item.isGovt && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[7px] font-semibold text-slate-500">Government</span>}</div><h2 className={`mt-1.5 line-clamp-2 text-[12px] font-semibold leading-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h2><p className="mt-0.5 truncate text-[8px] text-slate-400">{item.organization || 'Verified source'}</p></div><span className="shrink-0 rounded-full bg-amber-50 px-1.5 py-1 text-[7px] font-semibold text-amber-700">{item.timeRemainingBadge || item.deadlineDisplay}</span></div>
              <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[8px] text-slate-500"><span>{categoryLabel(item.category)}</span><span>{item.mode || 'Online'}</span><span>{item.fee || 'Free'}</span><span>{item.eligibility || 'Profile based'}</span></div>
              <p className="mt-2 line-clamp-2 flex-1 text-[9px] leading-4 text-slate-500">{item.description}</p>
              <div className="mt-2 flex gap-1.5"><button onClick={() => onNavigate('auth')} className="flex-1 rounded-md border border-slate-200 py-1.5 text-[8px] font-medium text-slate-600 hover:bg-slate-50">Save</button><button onClick={() => onNavigate('auth')} className="flex-1 rounded-md bg-sky-700 py-1.5 text-[8px] font-semibold text-white hover:bg-sky-800">View details</button><a href={item.officialUrl} target="_blank" rel="noopener noreferrer" className="rounded-md border border-slate-200 px-2 py-1.5 text-[8px] font-medium text-slate-500 hover:bg-slate-50">Official</a></div>
            </article>)}
          </div>

          {filtered.length === 0 && <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center"><Search className="mx-auto h-5 w-5 text-slate-300" /><p className="mt-2 text-[10px] text-slate-500">No preview matches that search.</p><button onClick={() => { setQuery(''); setQuickFilter('all'); }} className="mt-2 text-[9px] font-semibold text-sky-700">Clear search and filters</button></div>}
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between"><div><h2 className="text-[11px] font-semibold text-slate-800">Explore by goal</h2><p className="mt-0.5 text-[9px] text-slate-400">Find opportunities based on what you want to achieve.</p></div><button onClick={() => onNavigate('explore')} className="text-[9px] text-sky-700">View all categories →</button></div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{goalCards.map(({ title, icon: Icon }) => <button key={title} onClick={() => onNavigate('explore')} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-left text-[8px] font-medium text-slate-600 hover:border-sky-200 hover:bg-sky-50"><Icon className="h-3.5 w-3.5 shrink-0 text-sky-600" />{title}</button>)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-sky-100 bg-sky-50 px-4 py-3 sm:flex-row sm:items-center"><div className="flex items-start gap-2.5"><div className="rounded-md bg-white p-2 text-sky-700 shadow-sm"><Sparkles className="h-4 w-4" /></div><div><div className="text-[10px] font-semibold text-slate-800">Sign in to save and track</div><p className="mt-0.5 text-[9px] leading-4 text-slate-500">Build a profile, save opportunities, personalize your roadmap and track applications.</p></div></div><button onClick={() => onNavigate('auth')} className="shrink-0 rounded-md bg-sky-700 px-3 py-1.5 text-[9px] font-semibold text-white hover:bg-sky-800">Sign in to save & track</button></div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 text-[8px] text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><span>NextMarga · Opportunity intelligence for students</span><div className="flex gap-4"><button onClick={() => onNavigate('auth')}>Privacy</button><button onClick={() => onNavigate('auth')}>Help</button><button onClick={() => onNavigate('auth')}>About</button></div></div></footer>
    </div>
  );
};
