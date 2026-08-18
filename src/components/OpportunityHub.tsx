import React, { useMemo, useState } from 'react';
import { Search, Bookmark, CalendarDays, MapPin, ExternalLink, Filter, Globe2, Loader2, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Opportunity } from '../types';

interface OpportunityHubProps {
  opportunities: Opportunity[];
  savedOpportunityIds: string[];
  opportunitiesLoading?: boolean;
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onToggleSave: (opportunityId: string) => void;
}

const labels: Record<Opportunity['category'], string> = {
  competition: 'Competition', scholarship: 'Scholarship', exam: 'Exam', internship: 'Internship', fellowship: 'Fellowship', job: 'Job', research: 'Research', hackathon: 'Hackathon', program: 'Program', other: 'Other',
};

type SortMode = 'match' | 'deadline' | 'newest';
type QuickFilter = 'all' | 'closing' | 'government' | 'online' | 'saved';

export const OpportunityHub: React.FC<OpportunityHubProps> = ({ opportunities, savedOpportunityIds, opportunitiesLoading = false, onSelectOpportunity, onToggleSave }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | Opportunity['category']>('All');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('match');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = Date.now();
    const result = opportunities.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesQuick = quickFilter === 'all'
        || (quickFilter === 'government' && item.isGovt)
        || (quickFilter === 'online' && /online|remote|virtual/i.test(item.mode || ''))
        || (quickFilter === 'saved' && savedOpportunityIds.includes(item.id))
        || (quickFilter === 'closing' && !!item.deadline && new Date(item.deadline).getTime() > now && new Date(item.deadline).getTime() - now <= 14 * 86_400_000);
      if (!matchesCategory || !matchesQuick) return false;
      if (!q) return true;
      const text = [item.title, item.organization, item.category, item.description, item.mode, item.fee, item.eligibility, item.officialUrl, ...(item.states ?? []), ...(item.boards ?? []), ...(item.interests ?? [])].join(' ').toLowerCase();
      return text.includes(q);
    });

    return [...result].sort((a, b) => {
      if (sortMode === 'match') return (b.matchScore ?? -1) - (a.matchScore ?? -1);
      if (sortMode === 'deadline') {
        const ad = a.deadline ? new Date(a.deadline).getTime() : Number.POSITIVE_INFINITY;
        const bd = b.deadline ? new Date(b.deadline).getTime() : Number.POSITIVE_INFINITY;
        return ad - bd;
      }
      return a.title.localeCompare(b.title);
    });
  }, [opportunities, query, category, quickFilter, sortMode, savedOpportunityIds]);

  const categories: ('All' | Opportunity['category'])[] = ['All', 'scholarship', 'internship', 'fellowship', 'research', 'hackathon', 'competition', 'exam', 'job', 'program', 'other'];
  const quickFilters: { id: QuickFilter; label: string }[] = [
    { id: 'all', label: 'All opportunities' },
    { id: 'closing', label: 'Closing in 14 days' },
    { id: 'government', label: 'Government' },
    { id: 'online', label: 'Online / Remote' },
    { id: 'saved', label: 'Saved' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 pt-5 pb-28 space-y-6 animate-fadeIn">
      <div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40"><Globe2 className="w-3.5 h-3.5" />Global opportunity directory</div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div><h1 className="text-3xl sm:text-4xl font-light font-serif-luxury text-[#F5F2ED] mt-1">Opportunity Hub</h1><p className="text-sm text-white/45 mt-2 max-w-3xl">Explore the verified opportunities currently available to your profile. Search globally across organizations, categories, interests, eligibility, funding and official sources.</p></div>
          <div className="flex items-center gap-2 text-xs text-white/45"><Sparkles className="w-3.5 h-3.5" />{opportunities.length.toLocaleString()} records loaded</div>
        </div>
      </div>

      <div className="bg-[#121212] border border-white/10 rounded-2xl p-3 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search opportunities, organizations, countries, skills..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-white/30" /></div>
          <button onClick={() => setShowFilters((v) => !v)} className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs uppercase tracking-wider border ${showFilters ? 'bg-[#F5F2ED] text-black border-[#F5F2ED]' : 'bg-white/5 text-white/60 border-white/10 hover:text-white'}`}><SlidersHorizontal className="w-4 h-4" />Advanced filters</button>
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none"><option value="match">Best match</option><option value="deadline">Deadline soonest</option><option value="newest">A–Z</option></select>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1"><Filter className="w-4 h-4 text-white/40 flex-shrink-0" />{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap px-3 py-2 rounded-lg text-[11px] uppercase tracking-wider transition-all ${category === item ? 'bg-[#F5F2ED] text-black' : 'bg-white/5 text-white/50 hover:text-white'}`}>{item === 'All' ? 'All' : labels[item]}</button>)}</div>
        {showFilters && <div className="border-t border-white/10 pt-3 flex flex-wrap gap-2">{quickFilters.map((item) => <button key={item.id} onClick={() => setQuickFilter(item.id)} className={`px-3 py-2 rounded-lg text-[11px] uppercase tracking-wider border ${quickFilter === item.id ? 'border-white/40 bg-white/10 text-white' : 'border-white/10 bg-white/5 text-white/50 hover:text-white'}`}>{item.label}</button>)}</div>}
      </div>

      <div className="flex items-center justify-between border-b border-white/10 pb-3"><span className="text-xs text-white/45">Showing {filtered.length.toLocaleString()} of {opportunities.length.toLocaleString()} verified opportunities</span><span className="text-xs text-white/45">{savedOpportunityIds.length} saved</span></div>

      {opportunitiesLoading && <div className="rounded-2xl border border-white/10 bg-[#121212] p-8 flex items-center justify-center gap-3 text-sm text-white/55"><Loader2 className="w-4 h-4 animate-spin" />Loading the global directory...</div>}

      {!opportunitiesLoading && <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const saved = savedOpportunityIds.includes(item.id);
          return <div key={item.id} className="bg-[#121212] border border-white/10 rounded-2xl p-5 hover:border-white/25 transition-all flex flex-col">
            <div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap gap-1.5"><span className="text-[9px] uppercase tracking-[0.2em] text-white/35">{labels[item.category]}</span>{item.isGovt && <span className="text-[9px] uppercase tracking-[0.2em] text-white/50">Government</span>}{item.isVerified && <span className="text-[9px] uppercase tracking-[0.2em] text-white/50">Verified</span>}</div><h3 className="text-lg font-serif-luxury text-[#F5F2ED] mt-1">{item.title}</h3><p className="text-xs text-white/45 mt-1 truncate">{item.organization || 'Verified source'}</p></div><button onClick={() => void onToggleSave(item.id)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 flex-shrink-0" aria-label={saved ? 'Remove saved opportunity' : 'Save opportunity'}><Bookmark className={`w-4 h-4 ${saved ? 'fill-current text-[#F5F2ED]' : 'text-white/45'}`} /></button></div>
            <p className="text-sm text-white/55 leading-relaxed mt-4 flex-1 line-clamp-4">{item.description || 'Opportunity details available on the official source.'}</p>
            <div className="flex flex-wrap gap-3 mt-4 text-[11px] text-white/45"><span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{item.mode || 'Global / Online'}</span><span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" />{item.timeRemainingBadge || item.deadlineDisplay}</span>{item.matchScore !== undefined && <span className="text-white/65">{item.matchScore}% match</span>}</div>
            <div className="flex gap-2 mt-5"><button onClick={() => onSelectOpportunity(item)} className="flex-1 py-2.5 rounded-lg bg-[#F5F2ED] text-black text-xs uppercase tracking-[0.15em] font-medium hover:bg-white transition-all flex items-center justify-center gap-2">View Dossier<ExternalLink className="w-3.5 h-3.5" /></button>{item.officialUrl && <a href={item.officialUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-2.5 rounded-lg border border-white/15 bg-white/5 text-white/70 hover:text-white" aria-label="Open official portal"><ExternalLink className="w-4 h-4" /></a>}</div>
          </div>;
        })}
      </div>}

      {!opportunitiesLoading && filtered.length === 0 && <div className="rounded-2xl border border-white/10 bg-[#121212] p-10 text-center"><Search className="w-7 h-7 mx-auto text-white/25" /><p className="text-sm text-white/45 mt-3">No verified opportunities match your current filters.</p><button onClick={() => { setQuery(''); setCategory('All'); setQuickFilter('all'); }} className="mt-4 text-xs uppercase tracking-wider text-white/70 hover:text-white">Clear all filters</button></div>}
    </div>
  );
};