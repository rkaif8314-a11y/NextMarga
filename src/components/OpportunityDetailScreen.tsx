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
    const portal = window.open(opportunity.officialUrl, '_blank', 'noopener,noreferrer');
    try { await onApply(); if (!portal) alert('Your browser blocked the official portal popup. Please allow popups for NextMarga. Your application was still recorded.'); }
    catch { if (portal) portal.close(); }
    finally { setApplying(false); }
  };
  let officialDomain = '';
  if (opportunity.officialUrl) { try { officialDomain = new URL(opportunity.officialUrl).hostname.replace(/^www\./, ''); } catch {} }

  return <div className="min-h-screen bg-slate-50 text-slate-900 pb-32">
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl"><div className="mx-auto flex max-w-3xl items-center justify-between"><button onClick={onBack} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"><ArrowLeft className="h-4 w-4" /></button><div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Opportunity details</div><button onClick={handleShare} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"><Share2 className="h-4 w-4" /></button></div></header>
    <main className="mx-auto max-w-3xl space-y-5 px-4 pb-6 pt-6 sm:px-6">
      <div className="flex flex-wrap gap-2"><span className="rounded-md border border-sky-100 bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-700">{opportunity.category}</span>{opportunity.isVerified && <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700"><ShieldCheck className="h-3.5 w-3.5" /> Verified</span>}{opportunity.isGovt && <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-700"><Landmark className="h-3.5 w-3.5" /> Government</span>}</div>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h1 className="font-display text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl">{opportunity.title}</h1>{opportunity.organization && <p className="mt-2 text-sm text-slate-500">{opportunity.organization}</p>}</section>
      <section className="grid grid-cols-2 gap-3"><>{[['Deadline', opportunity.deadlineDisplay, Calendar], ['Fee', opportunity.fee, CreditCard], ['Mode', opportunity.mode, Laptop], ['Eligibility', opportunity.eligibility, GraduationCap]].map(([label, value, Icon]: any) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500"><Icon className="h-3.5 w-3.5" />{label}</div><div className="text-sm font-semibold leading-snug text-slate-950 sm:text-base">{value}</div></div>)}</></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="border-b border-slate-100 pb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Why consider this</div><p className="pt-4 text-sm leading-6 text-slate-600">{opportunity.whyConsider}</p></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="border-b border-slate-100 pb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Required credentials</div><ul className="space-y-2.5 pt-4">{opportunity.requiredDocs.length ? opportunity.requiredDocs.map((doc, idx) => <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{doc}</li>) : <li className="text-sm text-slate-500">No additional documents listed by the source.</li>}</ul></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="border-b border-slate-100 pb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Opportunity brief</div><p className="pt-4 text-sm leading-6 text-slate-600">{opportunity.description}</p><div className="mt-4 rounded-xl bg-sky-50 p-3 text-sm text-slate-600">Personalized match: <span className="font-semibold text-sky-700">{opportunity.matchScore !== undefined ? `${opportunity.matchScore}%` : 'Profile matched'}</span> — {opportunity.aiMatchReason}</div></section>
      {opportunity.officialUrl && <section className="rounded-2xl border border-sky-100 bg-sky-50 p-4"><div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-700">Official source</div><div className="mt-1 break-all text-sm font-medium text-slate-900">{officialDomain || opportunity.officialUrl}</div><div className="mt-1 text-xs text-slate-600">NextMarga sends you to the official source for the actual application.</div></section>}
    </main>
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 p-4 backdrop-blur-xl"><div className="mx-auto flex max-w-3xl items-center gap-3"><button onClick={onToggleSave} disabled={applying} className={`rounded-lg border px-4 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] ${isSaved ? 'border-sky-200 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white text-slate-600'}`}><span className="inline-flex items-center gap-2"><Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} />{isSaved ? 'Saved' : 'Save'}</span></button>{opportunity.officialUrl ? <button type="button" onClick={() => void handleApply()} disabled={applying} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-700 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-sky-800 disabled:opacity-60">{applying ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Recording application...</> : <><span>Apply on official portal</span><ExternalLink className="h-3.5 w-3.5" /></>}</button> : <button disabled className="flex-1 rounded-lg bg-slate-100 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Official portal unavailable</button>}</div></div>
  </div>;
};
