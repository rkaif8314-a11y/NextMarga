import React, { useState } from 'react';
import { Search, Trophy, GraduationCap, Banknote, Sparkles, Bookmark, CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react';
import { UserProfile, Opportunity, AppScreen } from '../types';

interface HomeScreenProps {
  profile: UserProfile;
  opportunities: Opportunity[];
  savedOpportunityIds: string[];
  onSelectOpportunity: (opp: Opportunity) => void;
  onToggleSave: (id: string) => void;
  onNavigate: (screen: AppScreen) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  opportunities,
  savedOpportunityIds,
  onSelectOpportunity,
  onToggleSave,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredOpps = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? opp.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-24 space-y-6 animate-fadeIn">
      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search global scholarships, olympiads, entrance fellowships..."
          className="w-full pl-10 pr-4 py-3 bg-[#121212] rounded-xl border border-white/15 text-[#F5F2ED] placeholder-white/30 text-xs tracking-wide focus:outline-none focus:ring-1 focus:ring-white/40 focus:border-white/40 transition-all"
        />
      </div>

      {/* Explore Categories */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">Curated Tracks</span>
          <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-[#F5F2ED]">
            Explore Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Competitions Card (Tall) */}
          <button
            onClick={() => setSelectedCategory(selectedCategory === 'competition' ? null : 'competition')}
            className={`col-span-1 row-span-2 p-4 rounded-xl border text-left flex flex-col justify-between transition-all group ${
              selectedCategory === 'competition'
                ? 'bg-white/10 border-white/40 ring-1 ring-white/20'
                : 'bg-[#121212] border-white/10 hover:border-white/25'
            }`}
          >
            <div className="p-2.5 bg-white/5 border border-white/10 text-[#F5F2ED] rounded-lg w-fit group-hover:border-white/30 transition-all">
              <Trophy className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 block">Division 01</span>
              <div className="font-serif-luxury font-medium text-[#F5F2ED] text-base">Competitions</div>
              <div className="text-[11px] font-mono text-white/60 mt-1 uppercase tracking-wider">3 Active Calls</div>
            </div>
          </button>

          {/* Exams Tile */}
          <button
            onClick={() => setSelectedCategory(selectedCategory === 'exam' ? null : 'exam')}
            className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
              selectedCategory === 'exam'
                ? 'bg-white/10 border-white/40 ring-1 ring-white/20'
                : 'bg-[#121212] border-white/10 hover:border-white/25'
            }`}
          >
            <div className="p-2 bg-white/5 border border-white/10 text-[#F5F2ED] rounded-lg">
              <GraduationCap className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 block">Division 02</span>
              <div className="font-serif-luxury font-medium text-[#F5F2ED] text-sm">Examinations</div>
            </div>
          </button>

          {/* Scholarships Tile */}
          <button
            onClick={() => setSelectedCategory(selectedCategory === 'scholarship' ? null : 'scholarship')}
            className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
              selectedCategory === 'scholarship'
                ? 'bg-white/10 border-white/40 ring-1 ring-white/20'
                : 'bg-[#121212] border-white/10 hover:border-white/25'
            }`}
          >
            <div className="p-2 bg-white/5 border border-white/10 text-[#F5F2ED] rounded-lg">
              <Banknote className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 block">Division 03</span>
              <div className="font-serif-luxury font-medium text-[#F5F2ED] text-sm">Scholarships</div>
            </div>
          </button>
        </div>

        {/* AI Suggestions Card */}
        <div
          onClick={() => onNavigate('explore')}
          className="mt-3 p-4 bg-[#141414] border border-white/15 rounded-xl flex items-center gap-3.5 cursor-pointer hover:border-white/30 hover:bg-[#181818] transition-all group"
        >
          <div className="p-2.5 bg-white/10 border border-white/20 text-[#F5F2ED] rounded-lg">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 block">Intelligence Feed</span>
            <div className="font-serif-luxury font-medium text-[#F5F2ED] text-sm">AI Opportunity Rationale</div>
            <div className="text-xs text-white/60 font-light mt-0.5">Tailored algorithmically for {profile.currentClass} • {profile.state}</div>
          </div>
          <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
        </div>
      </div>

      {/* Opportunities for You */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
          <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-[#F5F2ED]">
            Curated Repositories
          </h2>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50 hover:text-white transition-colors"
          >
            Reset Filter
          </button>
        </div>

        <div className="space-y-4">
          {filteredOpps.map((opp) => {
            const isSaved = savedOpportunityIds.includes(opp.id);

            return (
              <div
                key={opp.id}
                className="bg-[#121212] border border-white/10 rounded-2xl p-5 hover:border-white/25 transition-all space-y-4 shadow-sm"
              >
                {/* Top header line */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 flex-1">
                    <div className="mt-0.5">
                      <span className="text-xs px-1.5 py-0.5 border border-white/20 rounded bg-white/5 font-mono text-white/60 uppercase text-[9px] tracking-wider">
                        {opp.category}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif-luxury font-medium text-[#F5F2ED] text-base sm:text-lg leading-snug">
                          {opp.title}
                        </h3>
                        {opp.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white/70 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-white/80 bg-white/5 px-2.5 py-1 rounded border border-white/10 whitespace-nowrap">
                    <Clock className="w-3 h-3 text-white/50" />
                    <span>{opp.timeRemainingBadge}</span>
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-white/60 font-light leading-relaxed line-clamp-2">
                  {opp.description}
                </p>

                {/* AI Rationale Badge */}
                <div className="p-2.5 bg-[#0A0A0A] border border-white/10 rounded-lg flex items-center gap-2 text-xs text-white/70">
                  {opp.aiMatchReason.includes('Bihar') || opp.aiMatchReason.includes('State') ? (
                    <MapPin className="w-3.5 h-3.5 text-white/50 flex-shrink-0" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-white/50 flex-shrink-0" />
                  )}
                  <span className="font-light text-[11px] tracking-wide">Eligibility Match: {opp.aiMatchReason}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                  <button
                    onClick={() => onSelectOpportunity(opp)}
                    className="flex-1 py-2.5 px-4 bg-[#F5F2ED] hover:bg-white text-black font-medium text-[11px] uppercase tracking-[0.15em] rounded-lg transition-all text-center"
                  >
                    {opp.category === 'competition' ? 'Proceed to Apply' : 'Inspect Details'}
                  </button>

                  <button
                    onClick={() => onToggleSave(opp.id)}
                    className={`p-2.5 rounded-lg border transition-all ${
                      isSaved
                        ? 'bg-white text-black border-white'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30'
                    }`}
                    title={isSaved ? 'Remove from Saved' : 'Save Opportunity'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
