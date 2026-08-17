import { supabase } from './supabase';
import { Opportunity, UserProfile } from '../types';
import { evaluateEligibility } from './eligibility';

interface OpportunityRow {
  id: string;
  title: string;
  organization: string;
  category: Opportunity['category'];
  is_verified: boolean;
  is_govt: boolean;
  deadline: string | null;
  fee: string | null;
  mode: string | null;
  eligibility: string | null;
  description: string | null;
  why_consider: string | null;
  required_docs: string[] | null;
  official_url: string | null;
  minimum_class: string | null;
  maximum_class: string | null;
  minimum_age: number | null;
  maximum_age: number | null;
  states: string[] | null;
  boards: string[] | null;
  interests: string[] | null;
}

function formatDeadline(deadline: string | null) {
  if (!deadline) return { display: 'No deadline listed', remaining: '' };
  const date = new Date(deadline);
  const display = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  const diffMs = date.getTime() - Date.now();
  if (diffMs <= 0) return { display, remaining: 'Closed' };
  const days = Math.ceil(diffMs / 86_400_000);
  return { display, remaining: days === 1 ? '1 day' : `${days} days` };
}

function buildEligibilitySummary(row: OpportunityRow) {
  const parts: string[] = [];
  if (row.minimum_class || row.maximum_class) parts.push(`${row.minimum_class ?? 'Any'} – ${row.maximum_class ?? 'Any'} class`);
  if (row.minimum_age !== null || row.maximum_age !== null) parts.push(`Age ${row.minimum_age ?? 'any'}–${row.maximum_age ?? 'any'}`);
  if (row.states?.length) parts.push(row.states.join(', '));
  if (row.boards?.length) parts.push(row.boards.join(', '));
  return parts.join(' · ') || 'Eligibility details will be checked before applying.';
}

function mapOpportunity(row: OpportunityRow): Opportunity {
  const deadline = formatDeadline(row.deadline);
  return {
    id: row.id,
    title: row.title,
    organization: row.organization,
    category: row.category === 'job' || row.category === 'other' ? 'fellowship' : row.category,
    isVerified: row.is_verified,
    isGovt: row.is_govt,
    deadline: row.deadline ?? '',
    deadlineDisplay: deadline.display,
    timeRemainingBadge: deadline.remaining,
    fee: row.fee ?? 'Not specified',
    mode: row.mode ?? 'Not specified',
    eligibility: row.eligibility ?? buildEligibilitySummary(row),
    description: row.description ?? '',
    whyConsider: row.why_consider ?? '',
    aiMatchReason: 'Checking your eligibility…',
    requiredDocs: row.required_docs ?? [],
    timeline: [],
    officialUrl: row.official_url ?? undefined,
    minimumClass: row.minimum_class,
    maximumClass: row.maximum_class,
    minimumAge: row.minimum_age,
    maximumAge: row.maximum_age,
    states: row.states ?? [],
    boards: row.boards ?? [],
    interests: row.interests ?? [],
  };
}

export async function getVerifiedOpportunities(limit = 100): Promise<Opportunity[]> {
  const { data, error } = await supabase
    .from('opportunities')
    .select('id,title,organization,category,is_verified,is_govt,deadline,fee,mode,eligibility,description,why_consider,required_docs,official_url,minimum_class,maximum_class,minimum_age,maximum_age,states,boards,interests')
    .eq('is_verified', true)
    .order('deadline', { ascending: true, nullsFirst: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return ((data ?? []) as OpportunityRow[]).map(mapOpportunity);
}

export async function getPersonalizedOpportunities(profile: UserProfile, limit = 50): Promise<Opportunity[]> {
  const opportunities = await getVerifiedOpportunities(limit);

  return opportunities
    .map((opportunity) => {
      const result = evaluateEligibility(opportunity, profile);
      return {
        ...opportunity,
        matchScore: result.score,
        aiMatchReason: result.reason,
      };
    })
    .filter((opportunity) => opportunity.matchScore === undefined || opportunity.matchScore >= 40)
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
}
