import React, { useState } from 'react';
import { ArrowLeft, Share2, Bookmark, ExternalLink, Calendar, CreditCard, Laptop, GraduationCap, CheckCircle2, ShieldCheck, Landmark, Loader2 } from 'lucide-react';
import { Opportunity } from '../types';

interface OpportunityDetailScreenProps {
  opportunity: Opportunity;
  isSaved: boolean;
  onBack: () => void;
  onToggleSave: () => void;
  onApply?: () => Promise<void>;
  onStartAssessment?: () => void;
}

export const OpportunityDetailScreen: React.FC<OpportunityDetailScreenProps> = ({ opportunity, isSaved, onBack, onToggleSave, onApply }) => {
  const [applying, setApplying] = useState(false);
  const handleShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: opportunity.title, text: opportunity.description, url: window.location.href }); } catch {} }
    else { await navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard'); }
  };
  const handleApply = async () => {
    if (!opportunity.officialUrl || !onApply || applying) return;
    setApplying(true);
    try {
      await onApply();
      window.open(opportunity.officialUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // App-level error banner handles the failure; keep the dossier open.
    } finally {
      setApplying(false);
    }
  };
  let officialDomain = '';
  if (opportunity.officialUrl) { try { officialDomain = new URL(opportunity.officialUrl).hostname.replace(/^www\./, ''); } catch {} }

  return <div className="min-h-screen bg-[#0A0A0A] text-[#F5F2ED] pb-32 animate-fadeIn">
    <header className="sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3"><div className="max-w-2xl mx-auto flex items-center justify-between"><button onClick={onBack} className="p-2 rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/5"><ArrowLeft className="w-4 h-4" /></button><div className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-mono">Opportunity Dossier #{opportunity.id.slice(0, 6)}</div><button onClick={handleShare} className="p-2 rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/5"><Share2 className="w-4 h-4" /></button></div></header>
    <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
      <div className="flex flex-wrap gap-2"><span className="px-3 py-1 rounded text-[10px] uppercase tracking-[0.15em] font-mono bg-white/5 border border-white/15">DIVISION // {opportunity.category.toUpperCase()}</span>{opportunity.isVerified && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] uppercase tracking-[0.15em] font-mono bg-white/5 border border-white/15"><ShieldCheck className="w-3.5 h-3.5" /> VERIFIED SOURCE</span>}{opportunity.isGovt && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] uppercase tracking-[0.15em] font-mono bg-white/5 border border-white/15"><Landmark className="w-3.5 h-3.5" /> GOVERNMENT</span>}</div>
      <div><h1 className="text-2xl sm:text-3xl font-light font-serif-luxury tracking-tight leading-tight">{opportunity.title}</h1>{opportunity.organization && <p className="mt-2 text-xs sm:text-sm text-white/50">{opportunity.organization}</p>}</div>
      <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-white/15 bg-[#121212] flex items-center justify-center"><div className="absolute inset-0 opacity-20 bg-dot-pattern" /><div className="relative z-10 text-center"><div className="w-12 h-12 mx-auto border border-white/30 rotate-45 flex items-center justify-center bg-white/5"><div className="w-3 h-3 bg-[#F5F2ED] rotate-45" /></div><div className="text-[10px] font-mono text-white/50 tracking-[0.3em] uppercase pt-5">VERIFIED OPPORTUNITY RECORD</div></div></div>
      <div className="grid grid-cols-2 gap-3">{[['Deadline', opportunity.deadlineDisplay, Calendar], ['Fee', opportunity.fee, CreditCard], ['Mode', opportunity.mode, Laptop], ['Eligibility', opportunity.eligibility, GraduationCap]].map(([label, value, Icon]: any) => <div key={label} className="p-4 bg-[#121212] border border-white/10 rounded-xl"><div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1"><Icon className="w-3.5 h-3.5" />{label}</div><div className="text-sm sm:text-base font-serif-luxury font-medium leading-snug">{value}</div></div>)}</div>
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 space-y-3"><div className="flex items-center gap-2 border-b border-white/10 pb-2"><span className="text-[10px] uppercase tracking-[0.25em] text-white/40">Strategic Value</span><h2 className="text-xs uppercase tracking-[0.2em] font-medium">Why Consider This Opportunity</h2></div><p className="text-xs sm:text-sm text-white/70 leading-relaxed">{opportunity.whyConsider}</p></div>
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 space-y-3"><div className="flex items-center gap-2 border-b border-white/10 pb-2"><span className="text-[10px] uppercase tracking-[0.25em] text-white/40">Documentation</span><h2 className="text-xs uppercase tracking-[0.2em] font-medium">Required Credentials</h2></div><ul className="space-y-2.5">{opportunity.requiredDocs.length ? opportunity.requiredDocs.map((doc, idx) => <li key={idx} className="flex items-start gap-2.5 text-xs text-white/75"><CheckCircle2 className="w-3.5 h-3.5 text-white/60 mt-0.5" />{doc}</li>) : <li className="text-xs text-white/50">No additional documents listed by the source.</li>}</ul></div>
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 space-y-4"><div className="flex items-center gap-2 border-b border-white/10 pb-2"><span className="text-[10px] uppercase tracking-[0.25em] text-white/40">Opportunity Brief</span><h2 className="text-xs uppercase tracking-[0.2em] font-medium">What You Need to Know</h2></div><p className="text-xs sm:text-sm text-white/70 leading-relaxed">{opportunity.description}</p><div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/60">Personalized match: <span className="text-white/90">{opportunity.matchScore !== undefined ? `${opportunity.matchScore}%` : 'profile matched'}</span> — {opportunity.aiMatchReason}</div></div>
      {opportunity.officialUrl && <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-4"><div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Official Source</div><div className="mt-1 text-sm text-white/80 break-all">{officialDomain || opportunity.officialUrl}</div><div className="mt-1 text-xs text-white/45">NextMarga sends you to this external source for the actual application.</div></div>}
    </main>
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/10 p-4"><div className="max-w-2xl mx-auto flex items-center gap-3"><button onClick={onToggleSave} disabled={applying} className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg border text-xs uppercase tracking-[0.15em] ${isSaved ? 'bg-white text-black border-white' : 'bg-white/5 border-white/15 text-[#F5F2ED]'}`}><Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-black' : ''}`} /><span>{isSaved ? 'Saved' : 'Save'}</span></button>{opportunity.officialUrl ? <button type="button" onClick={() => void handleApply()} disabled={applying} className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-[#F5F2ED] hover:bg-white disabled:opacity-60 text-black font-medium text-xs uppercase tracking-[0.15em] text-center">{applying ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Recording application...</> : <><span>Apply on Official Portal</span><ExternalLink className="w-3.5 h-3.5" /></>}</button> : <button disabled className="flex-1 py-3.5 px-6 rounded-lg bg-white/10 text-white/35 text-xs uppercase tracking-[0.15em]">Official portal unavailable</button>}</div></div>
  </div>;
};
