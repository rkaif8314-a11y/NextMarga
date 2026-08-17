import { supabase } from './supabase';
import { RoadmapPhase, UserProfile } from '../types';

function buildPhases(profile: UserProfile): RoadmapPhase[] {
  const cls = Number.parseInt(profile.currentClass, 10) || 12;
  const target = profile.targetPath || 'Explore suitable career paths';
  const senior = cls >= 11;
  return [
    { id: 'now', phase: 'NOW', phaseTag: 'Start here', timeframe: 'Next 30 days', title: senior ? 'Strengthen your current academic path' : `Build a strong Class ${cls} foundation`, description: `Focus on the skills and opportunities that support ${target}.`, goals: [{ id: 'g1', text: 'Review your current subjects, interests and strengths', completed: false }, { id: 'g2', text: senior ? 'Find 3 relevant exams, scholarships or internships' : 'Find 3 suitable competitions or scholarships', completed: false }], ctaText: 'Explore opportunities', ctaAction: 'explore' },
    { id: 'next', phase: 'NEXT', phaseTag: 'Build', timeframe: 'Next 3–6 months', title: 'Turn interests into evidence', description: 'Build projects, solve problems and collect achievements that strengthen future applications.', goals: [{ id: 'g3', text: 'Complete one meaningful project or competition', completed: false }, { id: 'g4', text: 'Track deadlines and required documents', completed: false }], ctaText: 'View saved opportunities', ctaAction: 'applications' },
    { id: 'later', phase: 'LATER', phaseTag: 'Plan ahead', timeframe: '6–24 months', title: 'Prepare for your next major milestone', description: `Keep your plan aligned with ${target} and update it whenever your class or goals change.`, goals: [{ id: 'g5', text: 'Choose a shortlist of target pathways', completed: false }, { id: 'g6', text: 'Review the roadmap after each academic milestone', completed: false }], ctaText: 'Update profile', ctaAction: 'profile' },
  ];
}

export async function getMyRoadmap(): Promise<RoadmapPhase[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: phases, error } = await supabase.from('roadmap_phases').select('id,phase,phase_tag,timeframe,title,description,cta_text,cta_action,sort_order,roadmap_goals(id,text,completed,sort_order)').eq('user_id', user.id).order('sort_order');
  if (error) throw new Error(error.message);
  return (phases ?? []).map((p: any) => ({ id: p.id, phase: p.phase, phaseTag: p.phase_tag ?? '', timeframe: p.timeframe ?? '', title: p.title, description: p.description ?? '', ctaText: p.cta_text ?? undefined, ctaAction: p.cta_action ?? undefined, goals: (p.roadmap_goals ?? []).sort((a: any,b: any) => a.sort_order - b.sort_order).map((g: any) => ({ id: g.id, text: g.text, completed: g.completed })) }));
}

export async function ensureMyRoadmap(profile: UserProfile): Promise<RoadmapPhase[]> {
  const existing = await getMyRoadmap();
  if (existing.length) return existing;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return buildPhases(profile);
  const phases = buildPhases(profile);
  for (let i = 0; i < phases.length; i++) {
    const p = phases[i];
    const { data: phase, error } = await supabase.from('roadmap_phases').insert({ user_id: user.id, phase: p.phase, phase_tag: p.phaseTag, timeframe: p.timeframe, title: p.title, description: p.description, cta_text: p.ctaText, cta_action: p.ctaAction, sort_order: i }).select('id').single();
    if (error) throw new Error(error.message);
    const { error: goalError } = await supabase.from('roadmap_goals').insert(p.goals.map((g, index) => ({ phase_id: phase.id, text: g.text, completed: false, sort_order: index })));
    if (goalError) throw new Error(goalError.message);
  }
  return getMyRoadmap();
}

export async function setRoadmapGoalCompleted(goalId: string, completed: boolean) {
  const { error } = await supabase.from('roadmap_goals').update({ completed }).eq('id', goalId);
  if (error) throw new Error(error.message);
}
