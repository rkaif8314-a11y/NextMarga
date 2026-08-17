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

export const HomeScreen: React.FC<HomeScreenProps> = ({ profile, opportunities, opportunitiesLoading = false, savedOpportunityIds, onSelectOpportunity, onToggleSave, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [governmentOnly, setGovernmentOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'title'>('match');

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
    const result = opportunities.filter((opp) => {
      const haystack = [opp.title, opp.organization, opp.description, opp.eligibility, opp.mode, ...(opp.interests ?? [])].join(' ').toLowerCase();
      return (!q || haystack.includes(q)) && (!selectedCategory || opp.category === selectedCategory) && (!verifiedOnly || opp.isVerified) && (!governmentOnly || opp.isGovt);
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
  }, [opportunities, searchQuery, selectedCategory, verifiedOnly, governmentOnly, sortBy]);

  const clearFilters = () => { setSearchQuery(''); setSelectedCategory(null); setGovernmentOnly(false); setVerifiedOnly(true); setSortBy('match'); };

  return <div className="max-w-2xl mx-auto px-4 pt-4 pb-24 space-y-6 animate-fadeIn">
    <div className="relative"><div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"><Search className="w-4 h-4" /></div><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search scholarships, exams, internships, jobs..." className="w-full pl-10 pr-4 py-3 bg-[#121212] rounded-xl border border-white/15 text-[#F5F2ED] placeholder-white/30 text-xs tracking-wide focus:outline-none focus:ring-1 focus:ring-white/40" /></div>

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {[
        { label: 'Matched', value: opportunities.length, action: () => { setSelectedCategory(null); setGovernmentOnly(false); } },
        { label: 'Verified', value: verifiedCount, action: () => setVerifiedOnly(true) },
        { label: 'Government', value: governmentCount, action: () => setGovernmentOnly(true) },
        { label: 'Due in 7d', value: urgentCount, action: () => setSortBy('deadline') },
      ].map((stat) => <button key={stat.label} onClick={stat.action} className="text-left p-3 rounded-xl bg-[#121212] border border-white/10 hover:border-white/25 transition-colors"><div className="text-[9px] uppercase tracking-[0.18em] text-white/40">{stat.label}</div><div className="mt-1 text-lg font-serif-luxury">{stat.value}</div></button>)}
    </div>

    <div className="p-4 rounded-xl border border-white/10 bg-[#121212] flex items-center gap-3.5"><Sparkles className="w-4 h-4 shrink-0" /><div className="flex-1"><span className="text-[9px] uppercase tracking-[0.2em] text-white/40 block">Personalized path</span><div className="font-serif-luxury text-sm">{profile.currentClass ? `Built for Class ${profile.currentClass}` : 'Complete your profile for better matches'}</div><div className="text-xs text-white/50 mt-0.5">{profile.state || 'India'}{profile.interests?.length ? ` • ${profile.interests.slice(0, 2).join(' • ')}` : ''}</div></div><button onClick={() => onNavigate('profile')} className="text-[10px] uppercase tracking-[0.15em] text-white/60 hover:text-white">Profile</button></div>

    <div>
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2"><span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Curated Tracks</span><h2 className="text-xs uppercase tracking-[0.2em] font-medium">Explore Categories</h2></div>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setSelectedCategory(selectedCategory === 'competition' ? null : 'competition')} className={`col-span-1 row-span-2 p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${selectedCategory === 'competition' ? 'bg-white/10 border-white/40' : 'bg-[#121212] border-white/10'}`}><div className="p-2.5 bg-white/5 border border-white/10 rounded-lg w-fit"><Trophy className="w-5 h-5" /></div><div><span className="text-[10px] uppercase tracking-[0.2em] text-white/40 block">Division 01</span><div className="font-serif-luxury font-medium text-base">Competitions</div><div className="text-[11px] font-mono text-white/60 mt-1 uppercase tracking-wider">Matched for you</div></div></button>
        <button onClick={() => setSelectedCategory(selectedCategory === 'exam' ? null : 'exam')} className={`p-3.5 rounded-xl border text-left flex items-center gap-3 ${selectedCategory === 'exam' ? 'bg-white/10 border-white/40' : 'bg-[#121212] border-white/10'}`}><GraduationCap className="w-4 h-4" /><div><span className="text-[9px] uppercase tracking-[0.2em] text-white/40 block">Division 02</span><div className="font-serif-luxury text-sm">Examinations</div></div></button>
        <button onClick={() => setSelectedCategory(selectedCategory === 'scholarship' ? null : 'scholarship')} className={`p-3.5 rounded-xl border text-left flex items-center gap-3 ${selectedCategory === 'scholarship' ? 'bg-white/10 border-white/40' : 'bg-[#121212] border-white/10'}`}><Banknote className="w-4 h-4" /><div><span className="text-[9px] uppercase tracking-[0.2em] text-white/40 block">Division 03</span><div className="font-serif-luxury text-sm">Scholarships</div></div></button>
      </div>
      {availableCategories.length > 0 && <div className="flex gap-2 overflow-x-auto pt-3 pb-1">{availableCategories.map((category) => <button key={category} onClick={() => setSelectedCategory(selectedCategory === category ? null : category)} className={`shrink-0 px-3 py-2 rounded-lg border text-[10px] uppercase tracking-wider ${selectedCategory === category ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/60'}`}>{categoryLabels[category] ?? category}</button>)}</div>}
      <div onClick={() => onNavigate('explore')} className="mt-3 p-4 bg-[#141414] border border-white/15 rounded-xl flex items-center gap-3.5 cursor-pointer hover:border-white/30"><Sparkles className="w-4 h-4" /><div className="flex-1"><span className="text-[9px] uppercase tracking-[0.2em] text-white/40 block">Intelligence Feed</span><div className="font-serif-luxury text-sm">AI Opportunity Rationale</div><div className="text-xs text-white/60 mt-0.5">Tailored for {profile.currentClass || 'your class'} • {profile.state || 'your state'}</div></div><ArrowRight className="w-4 h-4 text-white/60" /></div>
    </div>

    <div><div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2"><div><h2 className="text-xs uppercase tracking-[0.2em] font-medium">Opportunities for You</h2><span className="text-[10px] text-white/40">{filteredOpps.length} matching records</span></div><button onClick={clearFilters} className="text-[10px] uppercase tracking-[0.2em] text-white/50">Reset</button></div>
      <div className="mb-4 flex flex-wrap items-center gap-2"><button onClick={() => setVerifiedOnly(!verifiedOnly)} className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[10px] uppercase tracking-wider ${verifiedOnly ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/60'}`}><CheckCircle2 className="w-3 h-3" /> Verified</button><button onClick={() => setGovernmentOnly(!governmentOnly)} className={`px-3 py-2 rounded-lg border text-[10px] uppercase tracking-wider ${governmentOnly ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/60'}`}>Government</button><label className="ml-auto inline-flex items-center gap-1.5 text-[10px] text-white/45"><SlidersHorizontal className="w-3 h-3" /><select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="bg-transparent text-white/70 outline-none"><option value="match" className="bg-[#121212]">Best match</option><option value="deadline" className="bg-[#121212]">Nearest deadline</option><option value="title" className="bg-[#121212]">A–Z</option></select></label></div>
      {opportunitiesLoading ? <div className="space-y-4">{[1,2,3].map((i) => <div key={i} className="h-44 rounded-2xl bg-[#121212] border border-white/10 animate-pulse" />)}</div> : filteredOpps.length === 0 ? <div className="rounded-2xl border border-white/10 bg-[#121212] p-8 text-center"><Sparkles className="w-5 h-5 mx-auto text-white/40" /><h3 className="mt-3 text-sm">No matching opportunities</h3><p className="mt-2 text-xs text-white/50">Try a different search or remove a filter.</p></div> : <div className="space-y-4">{filteredOpps.map((opp) => { const isSaved = savedOpportunityIds.includes(opp.id); return <div key={opp.id} className="bg-[#121212] border border-white/10 rounded-2xl p-5 hover:border-white/25 transition-all space-y-4">
        <div className="flex items-start justify-between gap-3"><div className="flex items-start gap-2.5 flex-1"><span className="text-xs px-1.5 py-0.5 border border-white/20 rounded bg-white/5 text-white/60 uppercase text-[9px]">{categoryLabels[opp.category] ?? opp.category}</span><div className="flex-1"><div className="flex items-center gap-2"><h3 className="font-serif-luxury font-medium text-base sm:text-lg leading-snug">{opp.title}</h3>{opp.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-white/70" />}</div>{opp.organization && <div className="text-[10px] text-white/40 mt-1">{opp.organization}{opp.isGovt ? ' • Government' : ''}</div>}</div></div><span className="inline-flex items-center gap-1.5 text-[10px] text-white/80 bg-white/5 px-2.5 py-1 rounded border border-white/10"><Clock className="w-3 h-3 text-white/50" />{opp.timeRemainingBadge || 'No deadline'}</span></div>
        <p className="text-xs sm:text-sm text-white/60 leading-relaxed line-clamp-2">{opp.description}</p><div className="p-2.5 bg-[#0A0A0A] border border-white/10 rounded-lg flex items-center gap-2 text-xs text-white/70"><MapPin className="w-3.5 h-3.5 text-white/50" /><span className="text-[11px]">{opp.matchScore !== undefined ? `${opp.matchScore}% match` : opp.aiMatchReason}</span></div>
        <div className="flex items-center gap-2 pt-1 border-t border-white/5"><button onClick={() => onSelectOpportunity(opp)} className="flex-1 py-2.5 px-4 bg-[#F5F2ED] hover:bg-white text-black font-medium text-[11px] uppercase tracking-[0.15em] rounded-lg">Inspect Details</button><button onClick={() => onToggleSave(opp.id)} className={`p-2.5 rounded-lg border ${isSaved ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/60'}`} title={isSaved ? 'Remove saved opportunity' : 'Save opportunity'}><Bookmark className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} /></button></div>
      </div>; })}</div>}
    </div>
  </div>;
};
