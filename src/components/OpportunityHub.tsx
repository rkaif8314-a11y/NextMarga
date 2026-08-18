import React, { useMemo, useState } from 'react';
import { Search, Bookmark, CalendarDays, MapPin, ExternalLink, Filter, Globe2, Loader2 } from 'lucide-react';
import { Opportunity } from '../types';

interface OpportunityHubProps {
  opportunities: Opportunity[];
  savedOpportunityIds: string[];
  opportunitiesLoading?: boolean;
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onToggleSave: (opportunityId: string) => void;
}

const labels: Record<Opportunity['category'], string> = {
  competition: 'Competition', scholarship: 'Scholarship', exam: 'Exam', internship: 'Internship', fellowship: 'Fellowship', job: 'Job', other: 'Other',
};

export const OpportunityHub: React.FC<OpportunityHubProps> = ({ opportunities, savedOpportunityIds, opportunitiesLoading = false, onSelectOpportunity, onToggleSave }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | Opportunity['category']>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return opportunities.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      if (!q) return matchesCategory;
      const text = [item.title, item.organization, item.category, item.description, item.mode, item.eligibility, ...(item.states ?? []), ...(item.interests ?? [])].join(' ').toLowerCase();
      return matchesCategory && text.includes(q);
    });
  }, [opportunities, query, category]);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-5 pb-28 space-y-6 animate-fadeIn">
      <div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40"><Globe2 className="w-3.5 h-3.5" />Global opportunity directory</div>
        <h1 className="text-3xl sm:text-4xl font-light font-serif-luxury text-[#F5F2ED] mt-1">Opportunity Hub</h1>
        <p className="text-sm text-white/45 mt-2">Explore every verified opportunity currently available in your NextMarga database — scholarships, internships, competitions, exams, fellowships and more.</p>
      </div>

      <div className="bg-[#121212] border border-white/10 rounded-2xl p-3 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by opportunity, organization, country, skill..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-white/30" /></div>
        <div className="flex items-center gap-2 overflow-x-auto"><Filter className="w-4 h-4 text-white/40 flex-shrink-0" />{(['All', 'scholarship', 'internship', 'competition', 'exam', 'fellowship', 'job', 'other'] as const).map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap px-3 py-2 rounded-lg text-[11px] uppercase tracking-wider transition-all ${category === item ? 'bg-[#F5F2ED] text-black' : 'bg-white/5 text-white/50 hover:text-white'}`}>{item === 'All' ? 'All' : labels[item]}</button>)}</div>
      </div>

      <div className="flex items-center justify-between border-b border-white/10 pb-3"><span className="text-xs text-white/45">{filtered.length} of {opportunities.length} opportunities</span><span className="text-xs text-white/45">{savedOpportunityIds.length} saved</span></div>

      {opportunitiesLoading && <div className="rounded-2xl border border-white/10 bg-[#121212] p-8 flex items-center justify-center gap-3 text-sm text-white/55"><Loader2 className="w-4 h-4 animate-spin" />Loading the global directory...</div>}

      {!opportunitiesLoading && <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const saved = savedOpportunityIds.includes(item.id);
          return <div key={item.id} className="bg-[#121212] border border-white/10 rounded-2xl p-5 hover:border-white/25 transition-all flex flex-col">
            <div className="flex items-start justify-between gap-3"><div><span className="text-[9px] uppercase tracking-[0.2em] text-white/35">{labels[item.category]}{item.isGovt ? ' · Government' : ''}</span><h3 className="text-lg font-serif-luxury text-[#F5F2ED] mt-1">{item.title}</h3><p className="text-xs text-white/45 mt-1">{item.organization || 'Verified source'}</p></div><button onClick={() => void onToggleSave(item.id)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10" aria-label={saved ? 'Remove saved opportunity' : 'Save opportunity'}><Bookmark className={`w-4 h-4 ${saved ? 'fill-current text-[#F5F2ED]' : 'text-white/45'}`} /></button></div>
            <p className="text-sm text-white/55 leading-relaxed mt-4 flex-1">{item.description || 'Opportunity details available on the official source.'}</p>
            <div className="flex flex-wrap gap-3 mt-4 text-[11px] text-white/45"><span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{item.mode || 'Global / Online'}</span><span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" />{item.deadlineDisplay}</span></div>
            <div className="flex gap-2 mt-5"><button onClick={() => onSelectOpportunity(item)} className="flex-1 py-2.5 rounded-lg bg-[#F5F2ED] text-black text-xs uppercase tracking-[0.15em] font-medium hover:bg-white transition-all flex items-center justify-center gap-2">View Opportunity<ExternalLink className="w-3.5 h-3.5" /></button>{item.officialUrl && <a href={item.officialUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-2.5 rounded-lg border border-white/15 bg-white/5 text-white/70 hover:text-white" aria-label="Open official portal"><ExternalLink className="w-4 h-4" /></a>}</div>
          </div>;
        })}
      </div>}

      {!opportunitiesLoading && filtered.length === 0 && <div className="rounded-2xl border border-white/10 bg-[#121212] p-10 text-center"><Search className="w-7 h-7 mx-auto text-white/25" /><p className="text-sm text-white/45 mt-3">No verified opportunities match your filters.</p></div>}
    </div>
  );
};
