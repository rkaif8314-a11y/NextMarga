import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, BriefcaseBusiness, CheckCircle2, Compass, GraduationCap, Moon, Search, Sparkles, Sun, Target, Users, Zap } from 'lucide-react';
import { Logo } from './Logo';
import { AppScreen } from '../types';

interface LandingScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onStartOnboarding: () => void;
}

type ThemeMode = 'dark' | 'light';

const milestones = [
  { title: 'School', text: 'Olympiads, scholarships and academic programs', icon: BookOpen },
  { title: 'Higher Secondary', text: 'Entrance exams, fellowships and admissions', icon: GraduationCap },
  { title: 'Undergraduate', text: 'Internships, hackathons and research', icon: BriefcaseBusiness },
  { title: 'Career', text: 'Fellowships, grants and early-career roles', icon: Target },
];

const featureCards = [
  { title: 'Personalized discovery', text: 'Opportunities are ranked around your class, interests, board and location.', icon: Sparkles },
  { title: 'Verified sources', text: 'Keep official links and verification status visible before you apply.', icon: CheckCircle2 },
  { title: 'One opportunity hub', text: 'Search, filter, save and compare opportunities without jumping between tabs.', icon: Search },
  { title: 'A path, not a list', text: 'Turn individual opportunities into a roadmap with deadlines and next actions.', icon: Compass },
];

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate, onStartOnboarding }) => {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nextmarga_preferences');
      const prefs = raw ? JSON.parse(raw) : {};
      const initial = prefs.theme === 'light' ? 'light' : 'dark';
      setTheme(initial);
      document.documentElement.dataset.theme = initial;
    } catch {}
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

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F2ED] overflow-x-hidden">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-5">
          <Logo size="md" />
          <nav className="hidden md:flex items-center gap-7 text-[11px] uppercase tracking-[0.16em] text-white/45">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#path" className="hover:text-white transition-colors">Your path</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="h-9 w-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => onNavigate('auth')} className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-white/10 hover:border-white/30 transition-all">
              Sign in <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onNavigate('auth')} className="sm:hidden h-9 w-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center" aria-label="Sign in"><ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative border-b border-white/10">
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 sm:pb-24">
            <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-12 lg:gap-20 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/50"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Personalized opportunity intelligence</div>
                <h1 className="mt-7 max-w-4xl text-5xl sm:text-6xl lg:text-7xl font-light tracking-[-0.04em] leading-[0.98] font-serif-luxury">Find the opportunities that <span className="italic">move you forward.</span></h1>
                <p className="mt-7 max-w-2xl text-base sm:text-lg leading-8 text-white/55">NextMarga brings scholarships, competitions, exams, internships, research, fellowships and career opportunities into one calm, personalized workspace.</p>
                <div className="mt-9 flex flex-col sm:flex-row gap-3"><button onClick={onStartOnboarding} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5F2ED] px-6 py-3.5 text-xs uppercase tracking-[0.16em] font-semibold text-black shadow-[0_12px_40px_rgba(255,255,255,0.10)] hover:bg-white transition-all active:scale-[0.99]">Create my opportunity profile <ArrowRight className="w-4 h-4" /></button><button onClick={() => onNavigate('auth')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-xs uppercase tracking-[0.16em] text-white/80 hover:bg-white/[0.08] hover:text-white transition-all">Sign in to continue</button></div>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.16em] text-white/35"><span className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> Verified opportunity records</span><span className="flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> Fast filters</span><span className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Built for students</span></div>
              </div>

              <div className="relative lg:pl-8"><div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4 sm:p-5 shadow-2xl"><div className="rounded-2xl border border-white/10 bg-[#111111] overflow-hidden"><div className="flex items-center justify-between border-b border-white/10 px-4 py-3"><div><div className="text-[9px] uppercase tracking-[0.2em] text-white/35">Opportunity Hub</div><div className="text-sm mt-1">Your shortlist</div></div><div className="rounded-full border border-emerald-300/15 bg-emerald-300/5 px-2.5 py-1 text-[9px] uppercase tracking-wider text-emerald-200/70">Live</div></div><div className="p-3 space-y-2.5">{['National scholarship program', 'Research internship', 'Global student challenge'].map((item, index) => <div key={item} className="rounded-xl border border-white/10 bg-white/[0.025] p-3"><div className="flex items-start justify-between gap-3"><div><div className="text-xs text-white/85">{item}</div><div className="mt-1 text-[10px] text-white/35">{index === 0 ? 'Scholarship' : index === 1 ? 'Research' : 'Competition'} · Verified source</div></div><span className="text-[10px] text-white/50">{96 - index * 7}% match</span></div><div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden"><div className="h-full rounded-full bg-[#F5F2ED]" style={{ width: `${96 - index * 7}%` }} /></div></div>)}</div><div className="border-t border-white/10 px-4 py-3 flex items-center justify-between"><span className="text-[10px] text-white/35">Personalized for your profile</span><ArrowRight className="w-3.5 h-3.5 text-white/40" /></div></div></div><div className="hidden sm:flex absolute -bottom-5 -left-2 items-center gap-3 rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 shadow-xl"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"><Sparkles className="w-4 h-4" /></div><div><div className="text-[9px] uppercase tracking-[0.18em] text-white/35">AI matching</div><div className="text-xs mt-0.5">Less searching. More doing.</div></div></div></div>
            </div>
          </div>
        </section>

        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"><div className="max-w-2xl"><div className="text-[10px] uppercase tracking-[0.28em] text-white/35">Everything in one place</div><h2 className="mt-3 text-3xl sm:text-4xl font-light font-serif-luxury">A workspace designed around your next move.</h2></div><div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{featureCards.map(({ title, text, icon: Icon }) => <div key={title} className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 hover:bg-white/[0.05] hover:border-white/20 transition-all"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5"><Icon className="w-4 h-4 text-white/65" /></div><h3 className="mt-5 text-sm font-medium">{title}</h3><p className="mt-2 text-xs leading-6 text-white/45">{text}</p></div>)}</div></section>

        <section id="path" className="border-y border-white/10 bg-white/[0.018]"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"><div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5"><div><div className="text-[10px] uppercase tracking-[0.28em] text-white/35">Your opportunity path</div><h2 className="mt-3 text-3xl sm:text-4xl font-light font-serif-luxury">From discovery to destination.</h2></div><button onClick={onStartOnboarding} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-white/60 hover:text-white">Build my path <ArrowRight className="w-3.5 h-3.5" /></button></div><div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{milestones.map(({ title, text, icon: Icon }, index) => <div key={title} className="relative rounded-2xl border border-white/10 bg-[#111111] p-5"><div className="flex items-center justify-between"><div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5"><Icon className="w-4 h-4 text-white/60" /></div><span className="text-[9px] uppercase tracking-[0.2em] text-white/25">0{index + 1}</span></div><h3 className="mt-5 text-sm">{title}</h3><p className="mt-2 text-xs leading-6 text-white/40">{text}</p></div>)}</div></div></section>

        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"><div className="grid lg:grid-cols-3 gap-4">{[['01', 'Tell us about you', 'Create a profile once. Your class, interests, board and location shape the discovery experience.'], ['02', 'Explore with less friction', 'Search the global directory, use quick filters, save strong matches and open verified source links.'], ['03', 'Act on the right ones', 'Track applications, deadlines and your roadmap so opportunities turn into progress.']].map(([number, title, text]) => <div key={number} className="rounded-2xl border border-white/10 p-6"><div className="text-[10px] font-mono text-white/25">{number}</div><h3 className="mt-8 text-lg font-serif-luxury">{title}</h3><p className="mt-3 text-sm leading-7 text-white/45">{text}</p></div>)}</div></section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"><div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] px-6 sm:px-10 py-10 sm:py-12"><div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/5 blur-3xl" /><div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-7"><div><div className="text-[10px] uppercase tracking-[0.25em] text-white/35">Ready when you are</div><h2 className="mt-2 text-2xl sm:text-3xl font-light font-serif-luxury">Stop hunting. Start moving.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-white/45">Create your profile and let NextMarga turn a large opportunity universe into a clearer personal path.</p></div><button onClick={onStartOnboarding} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F5F2ED] px-6 py-3.5 text-xs uppercase tracking-[0.16em] font-semibold text-black hover:bg-white transition-all">Get started <ArrowRight className="w-4 h-4" /></button></div></div></section>
      </main>

      <footer className="border-t border-white/10"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 flex flex-col sm:flex-row gap-3 items-center justify-between"><div className="text-[10px] uppercase tracking-[0.2em] text-white/25">NextMarga · Opportunity intelligence for students</div><button onClick={() => onNavigate('auth')} className="text-[10px] uppercase tracking-[0.18em] text-white/45 hover:text-white">Sign in to your workspace</button></div></footer>
    </div>
  );
};
