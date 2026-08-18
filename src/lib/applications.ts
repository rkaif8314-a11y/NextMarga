import { supabase } from './supabase';
import { ApplicationItem } from '../types';

export async function getSavedOpportunityIds(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase.from('applications').select('opportunity_id').eq('user_id', user.id).eq('status', 'Saved');
  if (error) throw new Error(error.message);
  return (data ?? []).map((row: { opportunity_id: string | null }) => row.opportunity_id).filter((id): id is string => Boolean(id));
}

export async function toggleSavedOpportunity(opportunityId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in to save opportunities.');
  const { data: existing, error: lookupError } = await supabase.from('applications').select('id').eq('user_id', user.id).eq('opportunity_id', opportunityId).eq('status', 'Saved').maybeSingle();
  if (lookupError) throw new Error(lookupError.message);
  if (existing) {
    const { error } = await supabase.from('applications').delete().eq('id', existing.id).eq('user_id', user.id);
    if (error) throw new Error(error.message);
    return false;
  }
  const { error } = await supabase.from('applications').upsert({ user_id: user.id, opportunity_id: opportunityId, status: 'Saved' }, { onConflict: 'user_id,opportunity_id' });
  if (error) throw new Error(error.message);
  return true;
}

export async function applyToOpportunity(opportunityId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in first.');
  const { error } = await supabase.from('applications').upsert(
    { user_id: user.id, opportunity_id: opportunityId, status: 'Applied', applied_date: new Date().toISOString() },
    { onConflict: 'user_id,opportunity_id' },
  );
  if (error) throw new Error(error.message);
}

export async function getMyApplications(): Promise<ApplicationItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase.from('applications').select('id,opportunity_id,status,applied_date,created_at,opportunities(title,organization,category)').eq('user_id', user.id).order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row: any) => {
    const opportunity = Array.isArray(row.opportunities) ? row.opportunities[0] : row.opportunities;
    const status = row.status as ApplicationItem['status'];
    const completed = status === 'Accepted' || status === 'Rejected';
    return {
      id: row.id,
      opportunityId: row.opportunity_id ?? undefined,
      title: opportunity?.title ?? 'Opportunity',
      organization: opportunity?.organization ?? '',
      location: 'Online',
      status,
      badgeColor: status === 'Accepted' ? 'green' : status === 'Rejected' ? 'red' : status === 'Applied' ? 'blue' : 'gray',
      letter: (opportunity?.organization ?? 'O').slice(0, 1).toUpperCase(),
      appliedDate: row.applied_date ?? row.created_at,
      category: status === 'Saved' ? 'saved' : completed ? 'completed' : 'active',
    } as ApplicationItem;
  });
}

export async function updateApplicationStatus(id: string, status: ApplicationItem['status']) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in first.');
  const { error } = await supabase.from('applications').update({ status, applied_date: status === 'Saved' ? null : new Date().toISOString() }).eq('id', id).eq('user_id', user.id);
  if (error) throw new Error(error.message);
}
