import React, { useEffect, useMemo, useState } from 'react';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { UserProfile, RoadmapPhase, AppScreen } from '../types';
import { ensureMyRoadmap, setRoadmapGoalCompleted } from '../lib/roadmap';
import { sampleCareerOutcomes } from '../data/mockData';

interface RoadmapScreenProps { profile: UserProfile; onNavigate: (screen: AppScreen) => void; }

export const RoadmapScreen: React.FC<RoadmapScreenProps> = ({ profile, onNavigate }) => {
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    ensureMyRoadmap(profile).then((data) => { if (active) setPhases(data); }).catch((e) => { if (active) setError(e instanceof Error ? e.message : 'Could not load roadmap.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [profile]);

  const progress = useMemo(() => {
    const goals = phases.flatMap((p) => p.goals ?? []);
    const completed = goals.filter((g) => g.completed).length;
    return { completed, total: goals.length, percent: goals.length ? Math.round((completed / goals.length) * 100) : 0 };
  }, [phases]);

  const toggleGoal = async (phaseId: string, goalId: string) => {
    const phase = phases.find((p) => p.id === phaseId);
    const goal = phase?.goals.find((g) => g.id === goalId);
    if (!goal) return;
    const next = !goal.completed;
    setPhases((prev) => prev.map((p) => p.id === phaseId ? { ...p, goals: p.goals.map((g) => g.id === goalId ? { ...g, completed: next } : g) } : p));
    try { await setRoadmapGoalCompleted(goalId, next); } catch (e) { setPhases((prev) => prev.map((p) => p.id === phaseId ? { ...p, goals: p.goals.map((g) => g.id === goalId ? { ...g, completed: !next } : g) } : p)); setError(e instanceof Error ? e.message : 'Could not save goal.'); }
  };

  if (loading) return <div className="max-w-2xl mx-auto px-4 pt-10 pb-28 flex items-center justify-center text-slate-600 text-sm"><Loader2 className="w-4 h-4 animate-spin mr-2" />Loading your roadmap...</div>;

  return <div className="max-w-2xl mx-auto px-4 pt-4 pb-28 space-y-6 animate-fadeIn">
    <div className="border-b border-slate-200 pb-4"><span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 block mb-1 font-medium">Trajectory Planner</span><h1 className="text-2xl sm:text-3xl font-light font-serif-luxury text-slate-950 tracking-tight uppercase">Personalized Roadmap</h1><div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded text-[10px] uppercase tracking-[0.15em] font-mono bg-slate-50 text-slate-800 border border-slate-200"><span>TARGET DOMAIN //</span><span className="text-slate-950 font-semibold">{profile.targetPath || 'Explore suitable career paths'}</span></div></div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>}
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3"><div className="flex items-center justify-between"><div><div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Roadmap progress</div><div className="mt-1 text-lg font-serif-luxury">{progress.percent}% complete</div></div><div className="text-right text-xs text-slate-500">{progress.completed}/{progress.total} goals</div></div><div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-sky-700 transition-all" style={{ width: `${progress.percent}%` }} /></div><p className="text-xs text-slate-500">Your progress is saved to your account and stays connected to your roadmap.</p></div>
    <div className="space-y-5">{phases.map((phase) => <div key={phase.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-all space-y-4"><div className="flex items-center justify-between border-b border-slate-200 pb-2"><span className="text-[10px] font-mono tracking-[0.25em] text-slate-500 uppercase font-medium">PHASE // {phase.phaseTag}</span><span className="text-[10px] font-mono text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded">{phase.timeframe}</span></div><h2 className="text-xl sm:text-2xl font-serif-luxury font-medium text-slate-950">{phase.title}</h2>{phase.goals?.length > 0 && <div className="space-y-2 pt-1">{phase.goals.map((goal) => <button key={goal.id} onClick={() => void toggleGoal(phase.id, goal.id)} className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-sky-800/5 border border-slate-200 rounded-xl transition-colors text-left group"><div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${goal.completed ? 'bg-sky-700 border-[#F5F2ED] text-white' : 'border-white/30 bg-transparent group-hover:border-white/60'}`}>{goal.completed && <Check className="w-3 h-3 stroke-[3]" />}</div><span className={`text-xs tracking-wide ${goal.completed ? 'line-through text-slate-400' : 'text-slate-800 font-light'}`}>{goal.text}</span></button>)}</div>}{phase.description && <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">{phase.description}</p>}{phase.ctaText && <button onClick={() => onNavigate((phase.ctaAction as AppScreen) || 'explore')} className="mt-2 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs uppercase tracking-[0.15em] font-medium shadow-sm transition-all"><span>{phase.ctaText}</span><ArrowRight className="w-3.5 h-3.5" /></button>}</div>)}</div>
    <div className="space-y-4 pt-2"><div className="flex items-center justify-between border-b border-slate-200 pb-2"><span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-medium">Trajectory Forecast</span><h2 className="text-xs uppercase tracking-[0.2em] font-medium text-slate-950">Potential Outcomes</h2></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">{sampleCareerOutcomes.map((outcome) => <div key={outcome.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-2.5 hover:border-slate-300 transition-all"><div className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">{outcome.pathLabel}</div><h3 className="font-serif-luxury font-medium text-slate-950 text-base">{outcome.title}</h3><p className="text-xs text-slate-600 font-light leading-relaxed">{outcome.description}</p><div className="flex flex-wrap gap-1.5 pt-1">{outcome.tags.map((tag, idx) => <span key={idx} className="text-[9px] uppercase tracking-wider font-mono bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded">{tag}</span>)}</div></div>)}</div></div>
  </div>;
};
