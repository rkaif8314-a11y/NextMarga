import React, { useMemo, useState } from 'react';
import { Bookmark, CalendarDays, CheckCircle2, ExternalLink, Filter, Globe2, GraduationCap, Landmark, Loader2, MapPin, Search, SlidersHorizontal, X } from 'lucide-react';
import { Opportunity } from '../types';

interface OpportunityHubProps {
  opportunities: Opportunity[];
  savedOpportunityIds: string[];
  opportunitiesLoading?: boolean;
  compactIntro?: boolean;
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onToggleSave: (opportunityId: string) => void;
}

const labels: Record<Opportunity['category'], string> = {
  competition: 'Competition', scholarship: 'Scholarship', exam: 'Exam', internship: 'Internship', fellowship: 'Fellowship', job: 'Job', research: 'Research', hackathon: 'Hackathon', program: 'Program', other: 'Other',
};

type SortMode = 'relevance' | 'profile' | 'deadline' | 'funded' | 'az';
type QuickFilter = 'all' | 'closing' | 'government' | 'online' | 'free' | 'saved';
type RichOpportunity = Opportunity & { countries?: string[]; regions?: string[] };

const suggestions = ['Scholarships', 'Internships', 'Hackathons', 'IIT opportunities', 'Research', 'Government opportunities'];

const aliases: Record<string, string[]> = {
  scholarship: ['scholar', 'scholorship', 'scholarships', 'grant', 'funded'],
  internship: ['intern', 'internships', 'training'],
  hackathon: ['hack', 'coding challenge'],
  competition: ['olympiad', 'contest', 'challenge'],
  research: ['research', 'phd', 'lab'],
  exam: ['iit', 'jee', 'neet', 'gate', 'entrance'],
};

function dateValue(item: Opportunity) {
  if (!item.deadline) return Number.POSITIVE_INFINITY;
  const value = new Date(item.deadline).getTime();
  return Number.isNaN(value) ? Number.POSITIVE_INFINITY : value;
}

function deadlineLabel(item: Opportunity) {
  const value = dateValue(item);
  if (!Number.isFinite(value)) return 'No deadline';
  const days = Math.ceil((value - Date.now()) / 86_400_000);
  if (days < 0) return 'Closed';
  if (days === 0) return 'Closes today';
  if (days === 1) return '1 day left';
  if (days <= 30) return `${days} days left`;
  return item.deadlineDisplay || `${days} days left`;
}

function queryTokens(query: string) {
  return query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function scoreOpportunity(item: RichOpportunity, query: string) {
  const tokens = queryTokens(query);
  if (!tokens.length) return item.matchScore ?? 0;
  const fields = [
    { value: item.title, weight: 90 },
    { value: item.organization, weight: 70 },
    { value: labels[item.category], weight: 60 },
    { value: item.eligibility, weight: 45 },
    { value: item.interests?.join(' '), weight: 40 },
    { value: [...(item.states ?? []), ...(item.countries ?? []), ...(item.regions ?? [])].join(' '), weight: 35 },
    { value: item.description, weight: 20 },
    { value: `${item.mode} ${item.fee} ${item.officialUrl}`, weight: 18 },
  ];
  return tokens.reduce((total, token) => {
    const expanded = [token, ...Object.entries(aliases).filter(([key, values]) => key.startsWith(token) || values.some((value) => value.startsWith(token) || token.startsWith(value))).map(([key]) => key)];
    const tokenScore = fields.reduce((best, field) => {
      const text = String(field.value ?? '').toLowerCase();
      if (!text) return best;
      if (expanded.some((term) => text === term || text.includes(term))) return Math.max(best, field.weight);
      return best;
    }, 0);
    return total + tokenScore;
  }, 0);
}

export const OpportunityHub: React.FC<OpportunityHubProps> = ({ opportunities, savedOpportunityIds, opportunitiesLoading = false, compactIntro = false, onSelectOpportunity, onToggleSave }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | Opportunity['category']>('All');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [focused, setFocused] = useState(false);

  const categories: ('All' | Opportunity['category'])[] = ['All', 'scholarship', 'internship', 'exam', 'fellowship', 'research', 'hackathon', 'competition', 'program', 'job', 'other'];

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>([['All', opportunities.length]]);
    opportunities.forEach((item) => counts.set(item.category, (counts.get(item.category) ?? 0) + 1));
    return counts;
  }, [opportunities]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const rows = opportunities
      .map((item) => ({ item: item as RichOpportunity, score: scoreOpportunity(item as RichOpportunity, query) }))
      .filter(({ item, score }) => {
        const matchesCategory = category === 'All' || item.category === category;
        const matchesQuick = quickFilter === 'all'
          || (quickFilter === 'government' && item.isGovt)
          || (quickFilter === 'online' && /online|remote|virtual|hybrid/i.test(item.mode || ''))
          || (quickFilter === 'free' && /free|funded|stipend|grant/i.test(`${item.fee} ${item.description}`))
          || (quickFilter === 'saved' && savedOpportunityIds.includes(item.id))
          || (quickFilter === 'closing' && Number.isFinite(dateValue(item)) && dateValue(item) > now && dateValue(item) - now <= 30 * 86_400_000);
        return matchesCategory && matchesQuick && (!query.trim() || score > 0);
      });

    return rows.sort((a, b) => {
      if (sortMode === 'profile') return (b.item.matchScore ?? 0) - (a.item.matchScore ?? 0);
      if (sortMode === 'deadline') return dateValue(a.item) - dateValue(b.item);
      if (sortMode === 'funded') return Number(/free|funded|stipend|grant/i.test(`${b.item.fee} ${b.item.description}`)) - Number(/free|funded|stipend|grant/i.test(`${a.item.fee} ${a.item.description}`));
      if (sortMode === 'az') return a.item.title.localeCompare(b.item.title);
      return (b.score + (b.item.matchScore ?? 0) / 4) - (a.score + (a.item.matchScore ?? 0) / 4);
    }).map(({ item }) => item);
  }, [opportunities, query, category, quickFilter, sortMode, savedOpportunityIds]);

  const activeChips = [
    category !== 'All' ? labels[category] : '',
    quickFilter !== 'all' ? ({ closing: 'Closing soon', government: 'Government', online: 'Online / Remote', free: 'Free / funded', saved: 'Saved' } as Record<Exclude<QuickFilter, 'all'>, string>)[quickFilter] : '',
    query.trim() ? `"${query.trim()}"` : '',
  ].filter(Boolean);

  const resetFilters = () => { setQuery(''); setCategory('All'); setQuickFilter('all'); };
  const resultLabel = query.trim() ? `${filtered.length.toLocaleString()} opportunities found for "${query.trim()}"` : `${filtered.length.toLocaleString()} opportunities found`;

  return (
    <section className={`mx-auto max-w-7xl px-4 pb-10 sm:px-6 ${compactIntro ? 'pt-2' : 'pt-6'}`}>
      {!compactIntro && (
        <div className="mb-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700"><Globe2 className="h-4 w-4" /> Opportunity directory</div>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-normal text-slate-950">Explore verified opportunities</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Search across titles, organizations, categories, eligibility, interests, location, mode, fee and source information.</p>
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input value={query} onFocus={() => setFocused(true)} onBlur={() => window.setTimeout(() => setFocused(false), 120)} onChange={(e) => setQuery(e.target.value)} placeholder="Search scholarships, internships, exams, IIT, research..." className="h-12 w-full rounded-md border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" aria-label="Search opportunities" />
            {focused && !query && (
              <div className="absolute left-0 right-0 top-14 z-20 rounded-lg border border-slate-200 bg-white p-2 shadow-xl">
                <div className="px-3 py-2 text-xs font-semibold text-slate-500">Recent searches</div>
                {suggestions.map((item) => <button key={item} onMouseDown={() => setQuery(item)} className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-sky-50">{item}</button>)}
              </div>
            )}
          </div>
          <button onClick={() => setShowFilters((value) => !value)} className={`inline-flex h-12 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold transition ${showFilters ? 'border-sky-700 bg-sky-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}><SlidersHorizontal className="h-4 w-4" /> Filters</button>
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)} className="h-12 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-sky-400">
            <option value="relevance">Most relevant</option>
            <option value="profile">Best for you</option>
            <option value="deadline">Closing soon</option>
            <option value="funded">Fully funded first</option>
            <option value="az">A-Z</option>
          </select>
        </div>
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="h-4 w-4 shrink-0 text-slate-400" />
          {categories.map((item) => (
            <button key={item} onClick={() => setCategory(item)} className={`inline-flex min-h-9 shrink-0 items-center gap-2 rounded-md border px-3 text-xs font-semibold ${category === item ? 'border-sky-700 bg-sky-50 text-sky-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
              {item === 'All' ? 'All' : labels[item]} <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">{categoryCounts.get(item) ?? 0}</span>
            </button>
          ))}
        </div>
        {showFilters && (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-200 pt-3">
            {[
              ['all', 'All opportunities'], ['closing', 'Closing in 30 days'], ['government', 'Government'], ['online', 'Online / Remote'], ['free', 'Free / funded'], ['saved', 'Saved'],
            ].map(([id, label]) => (
              <button key={id} onClick={() => setQuickFilter(id as QuickFilter)} className={`rounded-md border px-3 py-2 text-xs font-semibold ${quickFilter === id ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>{label}</button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-semibold text-slate-950" aria-live="polite">{resultLabel}</div>
        {activeChips.length > 0 && <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">Active filters: {activeChips.map((chip) => <span key={chip} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700">{chip}<button onClick={resetFilters} aria-label={`Remove ${chip} filter`}><X className="h-3 w-3" /></button></span>)}<button onClick={resetFilters} className="text-xs font-semibold text-sky-700">Clear all</button></div>}
      </div>

      {opportunitiesLoading && (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-64 animate-pulse rounded-lg border border-slate-200 bg-white p-5"><Loader2 className="h-4 w-4 animate-spin text-slate-300" /></div>)}
        </div>
      )}

      {!opportunitiesLoading && filtered.length > 0 && (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => {
            const saved = savedOpportunityIds.includes(item.id);
            return (
              <article key={item.id} className="flex min-h-[280px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">{labels[item.category]}</span>
                      {item.isGovt && <span className="inline-flex items-center gap-1 rounded bg-sky-50 px-2 py-1 text-[11px] font-semibold text-sky-800"><Landmark className="h-3 w-3" /> Government</span>}
                      {item.isVerified && <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700"><CheckCircle2 className="h-3 w-3" /> Verified source</span>}
                    </div>
                    <h3 className="mt-3 text-lg font-semibold leading-snug text-slate-950">{item.title}</h3>
                    <p className="mt-1 truncate text-sm text-slate-500">{item.organization || 'Official source'}</p>
                  </div>
                  <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{item.matchScore ?? 82}% match</span>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-slate-600">
                  <span className="flex items-center gap-2 font-medium text-amber-700"><CalendarDays className="h-4 w-4" /> {deadlineLabel(item)}</span>
                  <span className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-slate-400" /> {item.eligibility}</span>
                  <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" /> {item.mode || 'India / Online'} · {item.fee || 'Fee not listed'}</span>
                </div>
                <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{item.aiMatchReason || item.description || 'Matched to your profile and current opportunity preferences.'}</p>
                <div className="mt-auto flex gap-2 pt-5">
                  <button onClick={() => onToggleSave(item.id)} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold ${saved ? 'border-sky-700 bg-sky-50 text-sky-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`} aria-label={saved ? 'Remove saved opportunity' : 'Save opportunity'}><Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} /> {saved ? 'Saved' : 'Save'}</button>
                  <button onClick={() => onSelectOpportunity(item)} className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md bg-slate-950 px-3 text-sm font-semibold text-white hover:bg-slate-800">View details</button>
                  {item.officialUrl && <a href={item.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-200 px-3 text-sky-700 hover:bg-sky-50" aria-label="Open official site"><ExternalLink className="h-4 w-4" /></a>}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!opportunitiesLoading && filtered.length === 0 && (
        <div className="mt-5 rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Search className="mx-auto h-8 w-8 text-slate-300" />
          <h2 className="mt-3 text-lg font-semibold text-slate-950">No exact matches for {query.trim() ? `"${query.trim()}"` : 'these filters'}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">Check spelling, remove a filter, search broader, or browse all verified opportunities.</p>
          <button onClick={resetFilters} className="mt-4 rounded-md bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800">Browse all opportunities</button>
        </div>
      )}
    </section>
  );
};
