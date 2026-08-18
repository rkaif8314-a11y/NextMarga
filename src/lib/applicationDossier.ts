import { supabase } from './supabase';
import { ApplicationDossier, ApplicationDocument, ApplicationHistoryItem, ApplicationTask } from '../types';

export async function getApplicationDossier(applicationId: string): Promise<ApplicationDossier | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: app, error: appError } = await supabase.from('applications').select('id,user_id,opportunity_id,status,applied_date,submitted_at,deadline_snapshot,notes,next_action,interview_date,interview_location,interview_notes,checklist,opportunities(title,organization,official_url)').eq('id', applicationId).eq('user_id', user.id).maybeSingle();
  if (appError) throw new Error(appError.message);
  if (!app) return null;
  const [historyRes, docsRes, tasksRes] = await Promise.all([
    supabase.from('application_status_history').select('id,from_status,to_status,note,created_at').eq('application_id', applicationId).eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('application_documents').select('id,name,document_type,storage_path,file_url,required,uploaded,notes').eq('application_id', applicationId).eq('user_id', user.id).order('created_at'),
    supabase.from('application_tasks').select('id,title,description,due_at,completed,priority').eq('application_id', applicationId).eq('user_id', user.id).order('completed').order('due_at', { ascending: true, nullsFirst: false }),
  ]);
  if (historyRes.error) throw new Error(historyRes.error.message);
  if (docsRes.error) throw new Error(docsRes.error.message);
  if (tasksRes.error) throw new Error(tasksRes.error.message);
  const opportunity = Array.isArray(app.opportunities) ? app.opportunities[0] : app.opportunities;
  return {
    id: app.id,
    opportunityId: app.opportunity_id ?? undefined,
    title: opportunity?.title ?? 'Opportunity',
    organization: opportunity?.organization ?? '',
    status: app.status,
    deadline: app.deadline_snapshot,
    appliedDate: app.applied_date,
    submittedAt: app.submitted_at,
    notes: app.notes,
    nextAction: app.next_action,
    interviewDate: app.interview_date,
    interviewLocation: app.interview_location,
    interviewNotes: app.interview_notes,
    checklist: Array.isArray(app.checklist) ? app.checklist : [],
    officialUrl: opportunity?.official_url,
    history: (historyRes.data ?? []).map((x: any): ApplicationHistoryItem => ({ id: x.id, fromStatus: x.from_status, toStatus: x.to_status, note: x.note, createdAt: x.created_at })),
    documents: (docsRes.data ?? []).map((x: any): ApplicationDocument => ({ id: x.id, name: x.name, documentType: x.document_type, storagePath: x.storage_path, fileUrl: x.file_url, required: x.required, uploaded: x.uploaded, notes: x.notes })),
    tasks: (tasksRes.data ?? []).map((x: any): ApplicationTask => ({ id: x.id, title: x.title, description: x.description, dueAt: x.due_at, completed: x.completed, priority: x.priority })),
  };
}

export async function updateApplicationDossier(applicationId: string, patch: Record<string, unknown>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in first.');
  const { error } = await supabase.from('applications').update(patch).eq('id', applicationId).eq('user_id', user.id);
  if (error) throw new Error(error.message);
}

export async function addApplicationTask(applicationId: string, title: string, dueAt?: string, priority: ApplicationTask['priority'] = 'normal') {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in first.');
  const { error } = await supabase.from('application_tasks').insert({ application_id: applicationId, user_id: user.id, title, due_at: dueAt || null, priority });
  if (error) throw new Error(error.message);
}

export async function toggleApplicationTask(taskId: string, completed: boolean) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in first.');
  const { error } = await supabase.from('application_tasks').update({ completed, completed_at: completed ? new Date().toISOString() : null }).eq('id', taskId).eq('user_id', user.id);
  if (error) throw new Error(error.message);
}

export async function addApplicationDocument(applicationId: string, name: string, required = false) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in first.');
  const { error } = await supabase.from('application_documents').insert({ application_id: applicationId, user_id: user.id, name, required, uploaded: false });
  if (error) throw new Error(error.message);
}

export async function toggleApplicationDocument(documentId: string, uploaded: boolean) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in first.');
  const { error } = await supabase.from('application_documents').update({ uploaded }).eq('id', documentId).eq('user_id', user.id);
  if (error) throw new Error(error.message);
}
