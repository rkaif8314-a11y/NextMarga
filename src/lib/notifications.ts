import { supabase } from './supabase';
import { AppNotification } from '../types';

export async function getMyNotifications(): Promise<AppNotification[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase.from('notifications').select('id,type,title,message,action_screen,action_id,unread,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50);
  if (error) throw new Error(error.message);
  return (data ?? []).map((n: any) => ({ id: n.id, type: n.type, title: n.title, message: n.message, timestamp: n.created_at, unread: n.unread, actionScreen: n.action_screen ?? undefined, actionId: n.action_id ?? undefined }));
}

export async function markNotificationRead(id: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.from('notifications').update({ unread: false }).eq('id', id).eq('user_id', user.id);
  if (error) throw new Error(error.message);
}

export async function markAllNotificationsRead() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.from('notifications').update({ unread: false }).eq('user_id', user.id).eq('unread', true);
  if (error) throw new Error(error.message);
}

export async function createDeadlineNotification(title: string, message: string, opportunityId?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.from('notifications').insert({ user_id: user.id, type: 'urgent', title, message, action_screen: 'detail', action_id: opportunityId ?? null });
  if (error) throw new Error(error.message);
}
