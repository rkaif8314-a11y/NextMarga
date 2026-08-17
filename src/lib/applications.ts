import { supabase } from './supabase';

export async function getSavedOpportunityIds(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('applications')
    .select('opportunity_id')
    .eq('user_id', user.id)
    .eq('status', 'Saved');

  if (error) throw new Error(error.message);
  return (data ?? [])
    .map((row: { opportunity_id: string | null }) => row.opportunity_id)
    .filter((id): id is string => Boolean(id));
}

export async function toggleSavedOpportunity(opportunityId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in to save opportunities.');

  const { data: existing, error: lookupError } = await supabase
    .from('applications')
    .select('id')
    .eq('user_id', user.id)
    .eq('opportunity_id', opportunityId)
    .eq('status', 'Saved')
    .maybeSingle();

  if (lookupError) throw new Error(lookupError.message);

  if (existing) {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', existing.id)
      .eq('user_id', user.id);
    if (error) throw new Error(error.message);
    return false;
  }

  const { error } = await supabase
    .from('applications')
    .upsert({ user_id: user.id, opportunity_id: opportunityId, status: 'Saved' }, { onConflict: 'user_id,opportunity_id' });

  if (error) throw new Error(error.message);
  return true;
}
