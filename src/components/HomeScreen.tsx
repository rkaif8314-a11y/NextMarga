import React, { useMemo, useState } from 'react';
import { Search, Trophy, GraduationCap, Banknote, Sparkles, Bookmark, CheckCircle2, Clock, MapPin, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { UserProfile, Opportunity, AppScreen } from '../types';

interface HomeScreenProps {
  profile: UserProfile;
  opportunities: Opportunity[];
  opportunitiesLoading?: boolean;
  savedOpportunityIds: string[];
  onSelectOpportunity: (opp: Opportunity) => void;
  onToggleSave: (id: string) => void;
  onNavigate: (screen: AppScreen) => void;
}

const categoryLabels: Record<string, string> = { competition: 'Competitions', scholarship: 'Scholarships', exam: 'Exams', internship: 'Internships', fellowship: 'Fellowships', job: 'Jobs', other: 'Other' };
type StatFilter = 'matched' | 'verified' | 'government' | 'due7d';

export const HomeScreen: React.FC<HomeScreenProps> = ({ profile, opportunities, opportunitiesLoading = false, savedOpportunityIds, onSelectOpportunity, onToggleSave, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [governmentOnly, setGovernmentOnly] = useState(false);
  const [dueWithin7Days, setDueWithin7Days] = useState(false);
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'title'>('match');
  const [activeStat, setActiveStat] = useState<StatFilter | null>(null);

  const availableCategories = useMemo(() => Array.from(new Set(opportunities.map((opp) => opp.category))), [opportunities]);
  const urgentCount = useMemo(() => {
    const now = Date.now();
    const week = now + 7 * 24 * 60 * 60 * 1000;
    return opportunities.filter((opp) => {
      if (!opp.deadline) return false;
      const deadline = new Date(opp.deadline).getTime();
      return Number.isFinite(deadline) && deadline >= now && deadline <= week;
    }).length;
  }, [opportunities]);
  const verifiedCount = useMemo(() => opportunities.filter((opp) => opp.isVerified).length, [opportunities]);
  const governmentCount = useMemo(() => opportunities.filter((opp) => opp.isGovt).length, [opportunities]);

  const filteredOpps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const now = Date.now();
    const week = now + 7 * 24 * 60 * 60 * 1000;
    const result = opportunities.filter((opp) => {
      const haystack = [opp.title, opp.organization, opp.description, opp.eligibility, opp.mode, ...(opp.interests ?? [])].join(' ').toLowerCase();
      const deadline = opp.deadline ? new Date(opp.deadline).getTime() : NaN;
      const isDueWithin7Days = Number.isFinite(deadline) && deadline >= now && deadline <= week;
      return (!q || haystack.includes(q)) && (!selectedCategory || opp.category === selectedCategory) && (!verifiedOnly || opp.isVerified) && (!governmentOnly || opp.isGovt) && (!dueWithin7Days || isDueWithin7Days);
    });
    return result.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'deadline') {
        const ad = a.deadline ? new Date(a.deadline).getTime() : Number.POSITIVE_INFINITY;
        const bd = b.deadline ? new Date(b.deadline).getTime() : Number.POSITIVE_INFINITY;
        return ad - bd;
      }
      return (b.matchScore ?? 0) - (a.matchScore ?? 0);
    });
  }, [opportunities, searchQuery, selectedCategory, verifiedOnly, governmentOnly, dueWithin7Days, sortBy]);

  const selectStat = (stat: StatFilter) => {
    const isSame = activeStat === stat;
    setActiveStat(isSame ? null : stat);
    if (isSame) { setVerifiedOnly(true); setGovernmentOnly(false); setDueWithin7Days(false); setSortBy('match'); return; }
    setSelectedCategory(null); setSearchQuery('');
    if (stat === 'matched' || stat === 'verified') { setVerifiedOnly(true); setGovernmentOnly(false); setDueWithin7Days(false); setSortBy('match'); }
    else if (stat === 'government') { setVerifiedOnly(false); setGovernmentOnly(true); setDueWithin7Days(false); setSortBy('match'); }
    else { setVerifiedOnly(false); setGovernmentOnly(false); setDueWithin7Days(true); setSortBy('deadline'); }
  };

  const clearFilters = () => { setSearchQuery(''); setSelectedCategory(null); setGovernmentOnly(false); setVerifiedOnly(true); setDueWithin7Days(false); setSortBy('match'); setActiveStat(null); };

  return <div className="mx-auto max-w-4xl space-y-6 px-4 pb-28 pt-6 sm:px-6 lg:pt-8">
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div><p className="text-xs font-medium uppercase tracking-[0.18em] text-sky-700">Your opportunity dashboard</p><h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">A clearer path to your next opportunity.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Search, filter and review opportunities matched to your profile. Everything here follows the same clean NextMarga workspace.</p></div>
      <div className="relative mt-5"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search scholarships, exams, internships, jobs..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100" /></div>
    </section>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { key: 'matched' as StatFilter, label: 'Matched', value: opportunities.length },
        { key: 'verified' as StatFilter, label: 'Verified', value: verifiedCount },
        { key: 'government' as StatFilter, label: 'Government', value: governmentCount },
        { key: 'due7d' as StatFilter, label: 'Due in 7d', value: urgentCount },
      ].map((stat) => <button key={stat.label} onClick={() => selectStat(stat.key)} aria-pressed={activeStat === stat.key} className={`rounded-xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 ${activeStat === stat.key ? 'border-sky-300 bg-sky-50' : 'border-slate-200 bg-white hover:border-sky-200'}`}><div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{stat.label}</div><div className="mt-1 text-2xl font-semibold text-slate-950">{stat.value}</div><div className="mt-1 text-[10px] text-slate-500">{activeStat === stat.key ? 'Active filter' : 'Click to filter'}</div></button>)}
    </div>

    <section className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4 sm:p-5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm"><Sparkles className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">Personalized path</div><div className="mt-1 text-sm font-semibold text-slate-950">{profile.currentClass ? `Built for Class ${profile.currentClass}` : 'Complete your profile for better matches'}</div><div className="mt-0.5 text-xs text-slate-600">{profile.state || 'India'}{profile.interests?.length ? ` • ${profile.interests.slice(0, 2).join(' • ')}` : ''}</div></div><button onClick={() => onNavigate('profile')} className="rounded-lg border border-sky-200 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-700 hover:bg-sky-100">Profile</button></section>

    <section>
      <div className="mb-3 flex items-end justify-between border-b border-slate-200 pb-2"><div><div className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">Curated tracks</div><h2 className="mt-1 text-sm font-semibold text-slate-950">Explore categories</h2></div><button onClick={() => onNavigate('explore')} className="text-xs font-semibold text-sky-700 hover:text-sky-800">View all</button></div>
      <div className="grid gap-3 sm:grid-cols-3">
        <button onClick={() => setSelectedCategory(selectedCategory === 'competition' ? null : 'competition')} className={`rounded-xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 ${selectedCategory === 'competition' ? 'border-sky-300 bg-sky-50' : 'border-slate-200 bg-white hover:border-sky-200'}`}><Trophy className="h-5 w-5 text-sky-700" /><span className="mt-4 block text-xs uppercase tracking-[0.12em] text-slate-500">Division 01</span><span className="mt-1 block text-base font-semibold text-slate-950">Competitions</span><span className="mt-1 block text-xs text-slate-500">Challenges and contests</span></button>
        <button onClick={() => setSelectedCategory(selectedCategory === 'exam' ? null : 'exam')} className={`rounded-xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 ${selectedCategory === 'exam' ? 'border-sky-300 bg-sky-50' : 'border-slate-200 bg-white hover:border-sky-200'}`}><GraduationCap className="h-5 w-5 text-sky-700" /><span className="mt-4 block text-xs uppercase tracking-[0.12em] text-slate-500">Division 02</span><span className="mt-1 block text-base font-semibold text-slate-950">Examinations</span><span className="mt-1 block text-xs text-slate-500">Entrance and academic exams</span></button>
        <button onClick={() => setSelectedCategory(selectedCategory === 'scholarship' ? null : 'scholarship')} className={`rounded-xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 ${selectedCategory === 'scholarship' ? 'border-sky-300 bg-sky-50' : 'border-slate-200 bg-white hover:border-sky-200'}`}><Banknote className="h-5 w-5 text-sky-700" /><span className="mt-4 block text-xs uppercase tracking-[0.12em] text-slate-500">Division 03</span><span className="mt-1 block text-base font-semibold text-slate-950">Scholarships</span><span className="mt-1 block text-xs text-slate-500">Funding and financial support</span></button>
      </div>
      <button onClick={() => onNavigate('explore')} className="mt-3 flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-sky-200 hover:bg-slate-50"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-sky-700"><Sparkles className="h-4 w-4" /></div><div className="flex-1"><div className="text-xs font-semibold text-slate-950">AI Opportunity Rationale</div><div className="mt-1 text-xs text-slate-500">Tailored for {profile.currentClass || 'your class'} • {profile.state || 'your state'}</div></div><ArrowRight className="h-4 w-4 text-slate-400" /></button>
    </section>

    <section>
      <div className="mb-3 flex items-end justify-between border-b border-slate-200 pb-2"><div><div className="text-xs font-semibold text-slate-950">Opportunities for you</div><span className="text-[10px] text-slate-500">{filteredOpps.length} matching records{activeStat ? ` • ${activeStat === 'due7d' ? 'due within 7 days' : activeStat}` : ''}</span></div><button onClick={clearFilters} className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-700">Reset</button></div>
      <div className="mb-4 flex flex-wrap items-center gap-2"><button onClick={() => setVerifiedOnly(!verifiedOnly)} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[10px] font-semibold uppercase tracking-wider ${verifiedOnly ? 'border-sky-200 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white text-slate-600'}`}><CheckCircle2 className="h-3 w-3" /> Verified</button><button onClick={() => setGovernmentOnly(!governmentOnly)} className={`rounded-lg border px-3 py-2 text-[10px] font-semibold uppercase tracking-wider ${governmentOnly ? 'border-sky-200 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white text-slate-600'}`}>Government</button><button onClick={() => { setDueWithin7Days(!dueWithin7Days); setSortBy('deadline'); }} className={`rounded-lg border px-3 py-2 text-[10px] font-semibold uppercase tracking-wider ${dueWithin7Days ? 'border-sky-200 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white text-slate-600'}`}>Due in 7d</button><label className="ml-auto inline-flex items-center gap-2 text-xs text-slate-500"><SlidersHorizontal className="h-3.5 w-3.5" /><select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 outline-none"><option value="match">Best match</option><option value="deadline">Nearest deadline</option><option value="title">A–Z</option></select></label></div>
      {opportunitiesLoading ? <div className="space-y-4">{[1,2,3].map((i) => <div key={i} className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white" />)}</div> : filteredOpps.length === 0 ? <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"><Sparkles className="mx-auto h-5 w-5 text-slate-400" /><h3 className="mt-3 text-sm font-semibold text-slate-950">No matching opportunities</h3><p className="mt-2 text-xs text-slate-500">Try a different search or remove a filter.</p></div> : <div className="space-y-4">{filteredOpps.map((opp) => { const isSaved = savedOpportunityIds.includes(opp.id); return <article key={opp.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 flex-1 items-start gap-3"><span className="rounded-md border border-sky-100 bg-sky-50 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-sky-700">{categoryLabels[opp.category] ?? opp.category}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="font-display text-base font-semibold leading-snug text-slate-950 sm:text-lg">{opp.title}</h3>{opp.isVerified && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />}</div>{opp.organization && <div className="mt-1 text-xs text-slate-500">{opp.organization}{opp.isGovt ? ' • Government' : ''}</div>}</div></div><span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1.5 text-[10px] font-medium text-slate-600"><Clock className="h-3 w-3 text-slate-400" />{opp.timeRemainingBadge || 'No deadline'}</span></div><p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{opp.description}</p><div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-600"><MapPin className="h-3.5 w-3.5 text-slate-400" /><span>{opp.matchScore !== undefined ? `${opp.matchScore}% match` : opp.aiMatchReason}</span></div><div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4"><button onClick={() => onSelectOpportunity(opp)} className="flex-1 rounded-lg bg-sky-700 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-sky-800">Inspect details</button><button onClick={() => onToggleSave(opp.id)} className={`rounded-lg border p-2.5 ${isSaved ? 'border-sky-200 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`} title={isSaved ? 'Remove saved opportunity' : 'Save opportunity'}><Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} /></button></div></article>; })}</div>}
    </section>
  </div>;
};
