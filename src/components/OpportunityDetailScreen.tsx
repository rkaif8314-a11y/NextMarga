import React from 'react';
import { ArrowLeft, Share2, Bookmark, ExternalLink, Calendar, CreditCard, Laptop, GraduationCap, CheckCircle2, ShieldCheck, Landmark } from 'lucide-react';
import { Opportunity } from '../types';

interface OpportunityDetailScreenProps {
  opportunity: Opportunity;
  isSaved: boolean;
  onBack: () => void;
  onToggleSave: () => void;
  onStartAssessment?: () => void;
}

export const OpportunityDetailScreen: React.FC<OpportunityDetailScreenProps> = ({
  opportunity,
  isSaved,
  onBack,
  onToggleSave,
  onStartAssessment,
}) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: opportunity.title,
          text: opportunity.description,
          url: window.location.href,
        });
      } catch (e) {
        // Fallback
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F2ED] pb-32 animate-fadeIn">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
          </button>
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-mono">
            Repository Dossier #{opportunity.id.slice(0, 6)}
          </div>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {/* Badges Header */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] uppercase tracking-[0.15em] font-mono bg-white/5 text-white/80 border border-white/15">
            <span>DIVISION // {opportunity.category.toUpperCase()}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] uppercase tracking-[0.15em] font-mono bg-white/5 text-white/80 border border-white/15">
            <ShieldCheck className="w-3.5 h-3.5 text-white/70" />
            <span>VERIFIED REPOSITORY</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] uppercase tracking-[0.15em] font-mono bg-white/5 text-white/80 border border-white/15">
            <Landmark className="w-3.5 h-3.5 text-white/70" />
            <span>ACCREDITED</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-light font-serif-luxury text-[#F5F2ED] tracking-tight leading-tight">
          {opportunity.title}
        </h1>

        {/* Hero Visual Card (Geometric Luxury Minimalist) */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-white/15 bg-[#121212] flex items-center justify-center p-6 text-white">
          <div className="absolute inset-0 opacity-20 bg-dot-pattern" />
          {/* Abstract Geometric Luxury Core */}
          <div className="relative z-10 text-center space-y-2">
            <div className="w-12 h-12 mx-auto border border-white/30 rotate-45 flex items-center justify-center bg-white/5">
              <div className="w-3 h-3 bg-[#F5F2ED] rotate-45 shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
            </div>
            <div className="text-[10px] font-mono text-white/50 tracking-[0.3em] uppercase pt-2">
              SCHOLARSHIP & COMPETITION DIRECTIVE
            </div>
          </div>
        </div>

        {/* 4-Grid Key Specs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-[#121212] border border-white/10 rounded-xl">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium mb-1">
              <Calendar className="w-3.5 h-3.5 text-white/60" />
              <span>Deadline</span>
            </div>
            <div className="text-base font-serif-luxury font-medium text-[#F5F2ED]">{opportunity.deadlineDisplay}</div>
          </div>

          <div className="p-4 bg-[#121212] border border-white/10 rounded-xl">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium mb-1">
              <CreditCard className="w-3.5 h-3.5 text-white/60" />
              <span>Tariff / Fee</span>
            </div>
            <div className="text-base font-serif-luxury font-medium text-[#F5F2ED]">{opportunity.fee}</div>
          </div>

          <div className="p-4 bg-[#121212] border border-white/10 rounded-xl">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium mb-1">
              <Laptop className="w-3.5 h-3.5 text-white/60" />
              <span>Assessment Mode</span>
            </div>
            <div className="text-base font-serif-luxury font-medium text-[#F5F2ED]">{opportunity.mode}</div>
          </div>

          <div className="p-4 bg-[#121212] border border-white/10 rounded-xl">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium mb-1">
              <GraduationCap className="w-3.5 h-3.5 text-white/60" />
              <span>Eligibility</span>
            </div>
            <div className="text-base font-serif-luxury font-medium text-[#F5F2ED]">{opportunity.eligibility}</div>
          </div>
        </div>

        {/* Why Consider This? */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-medium">Strategic Value</span>
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-[#F5F2ED]">
              Why Consider This Opportunity
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
            {opportunity.whyConsider}
          </p>
        </div>

        {/* Required Documents */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-medium">Documentation</span>
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-[#F5F2ED]">
              Required Credentials
            </h2>
          </div>
          <ul className="space-y-2.5">
            {opportunity.requiredDocs.map((doc, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-white/75 font-light">
                <CheckCircle2 className="w-3.5 h-3.5 text-white/60 mt-0.5 flex-shrink-0" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Process Timeline */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-medium">Phases</span>
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-[#F5F2ED]">
              Process Timeline
            </h2>
          </div>

          <div className="relative pl-6 space-y-5">
            <div className="absolute left-[9px] top-2 bottom-2 w-[1px] bg-white/20" />
            {opportunity.timeline.map((item, idx) => (
              <div key={idx} className="relative">
                <div
                  className={`absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full border border-white/40 ${
                    item.status === 'current' ? 'bg-[#F5F2ED]' : 'bg-[#121212]'
                  }`}
                />
                <div className="text-[10px] font-mono tracking-wider text-white/50 uppercase">
                  {item.phase}
                </div>
                <div className="font-serif-luxury font-medium text-[#F5F2ED] text-sm">{item.title}</div>
                <div className="text-xs text-white/60 font-light mt-0.5">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={onToggleSave}
            className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg border font-medium text-xs uppercase tracking-[0.15em] transition-all ${
              isSaved
                ? 'bg-white text-black border-white'
                : 'bg-white/5 border-white/15 text-[#F5F2ED] hover:bg-white/10'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-black' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <a
            href={opportunity.officialUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-[#F5F2ED] hover:bg-white text-black font-medium text-xs uppercase tracking-[0.15em] shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.99] transition-all text-center"
          >
            <span>Apply on Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
