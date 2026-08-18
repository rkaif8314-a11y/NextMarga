import { supabase } from './supabase';
import { Opportunity, UserProfile } from '../types';
import { rankOpportunities } from './eligibility';

export interface OpportunityFilters {
  search?: string;
  category?: Opportunity['category'] | 'all';
  country?: string;
  region?: string;
}

interface OpportunityRow {
  id: string; title: string; organization: string; category: Opportunity['category']; is_verified: boolean; is_govt: boolean; deadline: string | null; fee: string | null; mode: string | null; eligibility: string | null; description: string | null; why_consider: string | null; required_docs: string[] | null; official_url: string | null; minimum_class: string | null; maximum_class: string | null; minimum_age: number | null; maximum_age: number | null; states: string[] | null; boards: string[] | null; interests: string[] | null; countries?: string[] | null; regions?: string[] | null; opportunity_status?: 'active' | 'closed' | 'upcoming' | 'archived' | 'rolling' | 'seasonal';
}

type MatchableOpportunity = Opportunity & { minimumClass?: string | null; maximumClass?: string | null; minimumAge?: number | null; maximumAge?: number | null; states?: string[] | null; boards?: string[] | null; interests?: string[] | null; countries?: string[]; regions?: string[]; };

const opportunitySelect = 'id,title,organization,category,is_verified,is_govt,deadline,fee,mode,eligibility,description,why_consider,required_docs,official_url,minimum_class,maximum_class,minimum_age,maximum_age,states,boards,interests,countries,regions,opportunity_status';

function formatDeadline(deadline: string | null) {
  if (!deadline) return { display: 'No deadline listed', remaining: '' };
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return { display: 'Deadline to be confirmed', remaining: '' };
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

function mapOpportunity(row: OpportunityRow): MatchableOpportunity {
  const deadline = formatDeadline(row.deadline);
  return {
    id: row.id, title: row.title, organization: row.organization, category: row.category,
    isVerified: row.is_verified, isGovt: row.is_govt, deadline: row.deadline ?? '', deadlineDisplay: deadline.display,
    timeRemainingBadge: deadline.remaining || 'No deadline', fee: row.fee ?? 'Not specified', mode: row.mode ?? 'Not specified',
    eligibility: row.eligibility ?? buildEligibilitySummary(row), description: row.description ?? '', whyConsider: row.why_consider ?? '',
    aiMatchReason: 'Matched to your profile', requiredDocs: row.required_docs ?? [], timeline: [], officialUrl: row.official_url ?? undefined,
    minimumClass: row.minimum_class, maximumClass: row.maximum_class, minimumAge: row.minimum_age, maximumAge: row.maximum_age,
    states: row.states ?? [], boards: row.boards ?? [], interests: row.interests ?? [],
    countries: row.countries ?? [], regions: row.regions ?? []
  };
}

export async function getVerifiedOpportunities(limit = 250, filters: OpportunityFilters = {}): Promise<MatchableOpportunity[]> {
  let query = supabase.from('opportunities').select(opportunitySelect).eq('is_verified', true).in('opportunity_status', ['active', 'upcoming', 'rolling', 'seasonal']);
  if (filters.category && filters.category !== 'all') query = query.eq('category', filters.category);
  if (filters.country) query = query.contains('countries', [filters.country]);
  if (filters.region) query = query.contains('regions', [filters.region]);
  const { data, error } = await query.order('deadline', { ascending: true, nullsFirst: false }).limit(limit);
  if (error) throw new Error(error.message);

  let results = ((data ?? []) as OpportunityRow[]).map(mapOpportunity);
  const term = filters.search?.trim().toLowerCase();
  if (term) {
    results = results.filter(item => [item.title, item.organization, item.category, item.description, ...(item.interests ?? []), ...(item.countries ?? []), ...(item.regions ?? [])].some(value => value?.toLowerCase().includes(term)));
  }
  return results;
}

export async function getOpportunityById(id: string): Promise<Opportunity | null> {
  const { data, error } = await supabase.from('opportunities').select(opportunitySelect).eq('id', id).eq('is_verified', true).in('opportunity_status', ['active', 'upcoming', 'rolling', 'seasonal']).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapOpportunity(data as OpportunityRow) : null;
}

export async function getPersonalizedOpportunities(profile: UserProfile, limit = 250, filters: OpportunityFilters = {}): Promise<Opportunity[]> {
  const opportunities = await getVerifiedOpportunities(limit, filters);
  const matches = rankOpportunities(opportunities, { currentClass: profile.currentClass, dob: profile.dob, educationalBoard: profile.educationalBoard, state: profile.state, interests: profile.interests });
  return matches.map(({ opportunity, score, reasons, warnings }) => ({ ...opportunity, matchScore: score, aiMatchReason: reasons[0] ?? warnings[0] ?? 'Matched to your profile' }));
}
