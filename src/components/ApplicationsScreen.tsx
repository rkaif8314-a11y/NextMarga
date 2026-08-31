import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, PlayCircle, CheckCircle2, ExternalLink, Clock3, XCircle, FileText, Plus, Check, Circle, Save, X, ListChecks, History, ClipboardList } from 'lucide-react';
import { ApplicationItem, ApplicationDossier, AppScreen } from '../types';
import { addApplicationDocument, addApplicationTask, getApplicationDossier, toggleApplicationDocument, toggleApplicationTask, updateApplicationDossier } from '../lib/applicationDossier';

interface ApplicationsScreenProps {
  applications: ApplicationItem[];
  onNavigate: (screen: AppScreen) => void;
  onStartAssessment: () => void;
  onUpdateStatus?: (id: string, status: ApplicationItem['status']) => void;
  onInspectOpportunity?: (opportunityId?: string) => void;
}

const fmtDate = (value?: string | null) => value ? new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Not set';

export const ApplicationsScreen: React.FC<ApplicationsScreenProps> = ({ applications, onNavigate, onStartAssessment, onUpdateStatus, onInspectOpportunity }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'saved' | 'completed'>('active');
  const [dossier, setDossier] = useState<ApplicationDossier | null>(null);
  const [loadingDossier, setLoadingDossier] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newDoc, setNewDoc] = useState('');
  const [error, setError] = useState('');
  const activeCount = applications.filter((a) => a.category === 'active').length;
  const savedCount = applications.filter((a) => a.category === 'saved').length;
  const completedCount = applications.filter((a) => a.category === 'completed').length;
  const filteredApps = applications.filter((a) => a.category === activeTab);

  const openDossier = async (id: string) => {
    setLoadingDossier(true); setError('');
    try { const data = await getApplicationDossier(id); setDossier(data); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not load dossier.'); }
    finally { setLoadingDossier(false); }
  };

  const saveDossier = async (patch: Record<string, unknown>) => {
    if (!dossier) return;
    setSaving(true); setError('');
    try { await updateApplicationDossier(dossier.id, patch); setDossier(await getApplicationDossier(dossier.id)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not save dossier.'); }
    finally { setSaving(false); }
  };

  const nextAction = (app: ApplicationItem) => {
    if (!onUpdateStatus) return null;
    if (app.status === 'Saved') return <button onClick={() => onUpdateStatus(app.id, 'Applied')} className="flex items-center gap-1.5 px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-medium uppercase tracking-[0.12em] rounded-lg"><CheckCircle2 className="w-3.5 h-3.5" />Mark Applied</button>;
    if (app.status === 'Applied') return <button onClick={() => onUpdateStatus(app.id, 'Under Review')} className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-sky-800/10 text-slate-950 text-xs font-medium uppercase tracking-[0.12em] rounded-lg border border-slate-200"><Clock3 className="w-3.5 h-3.5" />Under Review</button>;
    if (app.status === 'Under Review') return <button onClick={() => onUpdateStatus(app.id, 'Interview Scheduled')} className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-sky-800/10 text-slate-950 text-xs font-medium uppercase tracking-[0.12em] rounded-lg border border-slate-200">Schedule Interview</button>;
    return null;
  };

  useEffect(() => { setDossier(null); }, [activeTab]);

  return <div className="max-w-2xl mx-auto px-4 pt-4 pb-28 space-y-5 animate-fadeIn">
    <div className="border-b border-slate-200 pb-4"><span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 block mb-1 font-medium">Registry & Portfolio</span><h1 className="text-2xl sm:text-3xl font-light font-serif-luxury text-slate-950 tracking-tight uppercase">Application Dossiers</h1><p className="text-xs text-slate-500 mt-2">A complete workspace for every application: timeline, documents, tasks, notes, interviews and decisions.</p></div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>}
    <div className="flex bg-white border border-slate-200 p-1 rounded-xl">{[{ id: 'active', label: `Active (${activeCount})` }, { id: 'saved', label: `Saved (${savedCount})` }, { id: 'completed', label: `Archived (${completedCount})` }].map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 py-2 text-xs font-medium uppercase tracking-[0.12em] rounded-lg transition-all ${activeTab === tab.id ? 'bg-sky-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'}`}>{tab.label}</button>)}</div>
    <div className="space-y-4 pt-1">
      {filteredApps.length === 0 && <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Nothing here yet. Explore opportunities and save or apply to build your portfolio.</div>}
      {filteredApps.map((app) => <div key={app.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all space-y-4">
        <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3.5"><div className="w-11 h-11 rounded-lg border border-slate-300 bg-slate-50 text-slate-950 font-serif-luxury font-medium text-lg flex items-center justify-center flex-shrink-0">{app.letter}</div><div><h3 className="font-serif-luxury font-medium text-slate-950 text-base leading-tight">{app.title}</h3><div className="text-xs text-slate-500 font-light mt-0.5">{app.organization}</div></div></div><span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded border ${app.status === 'Rejected' ? 'border-red-200 text-red-700 bg-red-50' : app.status === 'Accepted' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'bg-slate-50 text-slate-800 border-slate-200'}`}>{app.status}</span></div>
        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 font-light"><div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500" /><span>{app.location}</span></div><div className="flex items-center gap-1.5 font-mono text-[11px]"><Calendar className="w-3.5 h-3.5 text-slate-500" /><span>{app.term || app.appliedDate}</span></div></div>
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
          {app.status === 'Interview Scheduled' && <><div className="flex-1 min-w-[160px] text-[11px] font-mono text-slate-700">SCHEDULED // {app.interviewTime || 'Time to be confirmed'}</div><button onClick={onStartAssessment} className="flex items-center gap-1.5 px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-medium uppercase tracking-[0.15em] rounded-lg"><PlayCircle className="w-3.5 h-3.5" />Initiate Assessment</button></>}
          {app.status === 'Rejected' && <div className="flex-1 text-[11px] font-mono text-red-700/70"><XCircle className="w-3.5 h-3.5 inline mr-1" />APPLICATION CLOSED</div>}
          {nextAction(app)}
          <button onClick={() => void openDossier(app.id)} className="flex-1 min-w-[150px] py-2 text-center text-xs uppercase tracking-[0.15em] font-medium text-slate-800 hover:text-slate-950 bg-slate-50 hover:bg-sky-800/10 border border-slate-200 rounded-lg transition-colors"><FileText className="w-3.5 h-3.5 inline mr-1" />Open Dossier</button>
          {app.opportunityId && <button onClick={() => onInspectOpportunity?.(app.opportunityId)} className="py-2 px-3 text-xs uppercase tracking-[0.12em] text-slate-500 hover:text-slate-950 border border-slate-200 rounded-lg"><ExternalLink className="w-3.5 h-3.5 inline mr-1" />Opportunity</button>}
          {app.status === 'Accepted' && <button onClick={() => onNavigate('roadmap')} className="py-2 px-3 text-xs uppercase tracking-[0.12em] bg-slate-50 border border-slate-200 rounded-lg">Open Roadmap</button>}
        </div>
      </div>)}
    </div>

    {(loadingDossier || dossier) && <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm p-3 sm:p-6 flex items-end sm:items-center justify-center" onClick={() => !saving && setDossier(null)}>
      <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {loadingDossier && <div className="p-12 text-center text-sm text-slate-500">Opening dossier…</div>}
        {dossier && <>
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200 p-5 flex items-start justify-between gap-4"><div><div className="text-[9px] uppercase tracking-[0.3em] text-slate-400">Application dossier</div><h2 className="text-xl font-serif-luxury mt-1">{dossier.title}</h2><div className="text-xs text-slate-500 mt-1">{dossier.organization}</div></div><button onClick={() => setDossier(null)} disabled={saving} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-950"><X className="w-4 h-4" /></button></div>
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2"><div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="text-[9px] uppercase tracking-widest text-slate-400">Status</div><div className="text-xs mt-1">{dossier.status}</div></div><div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="text-[9px] uppercase tracking-widest text-slate-400">Deadline</div><div className="text-xs mt-1">{fmtDate(dossier.deadline)}</div></div><div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="text-[9px] uppercase tracking-widest text-slate-400">Applied</div><div className="text-xs mt-1">{fmtDate(dossier.appliedDate)}</div></div><div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="text-[9px] uppercase tracking-widest text-slate-400">Submitted</div><div className="text-xs mt-1">{fmtDate(dossier.submittedAt)}</div></div></div>
            <section className="rounded-2xl border border-slate-200 p-4 space-y-3"><div className="flex items-center gap-2 text-xs uppercase tracking-widest"><ClipboardList className="w-4 h-4" />Application plan</div><textarea value={dossier.notes ?? ''} onChange={(e) => setDossier({ ...dossier, notes: e.target.value })} onBlur={() => void saveDossier({ notes: dossier.notes ?? null })} placeholder="Private notes about this application…" className="w-full min-h-24 rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm outline-none focus:border-white/25"/><div className="flex gap-2"><input value={dossier.nextAction ?? ''} onChange={(e) => setDossier({ ...dossier, nextAction: e.target.value })} placeholder="Next action" className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm outline-none"/><button onClick={() => void saveDossier({ next_action: dossier.nextAction ?? null })} className="px-3 rounded-xl bg-sky-700 text-white text-xs uppercase tracking-wider"><Save className="w-3.5 h-3.5 inline mr-1" />Save</button></div></section>
            <section className="rounded-2xl border border-slate-200 p-4 space-y-3"><div className="flex items-center gap-2 text-xs uppercase tracking-widest"><ListChecks className="w-4 h-4" />Checklist</div>{dossier.checklist.length === 0 && <div className="text-xs text-slate-400">No checklist items yet. Add documents below.</div>}{dossier.checklist.map((item) => <button key={item.id} onClick={() => setDossier({ ...dossier, checklist: dossier.checklist.map((x) => x.id === item.id ? { ...x, done: !x.done } : x) })} className="w-full flex items-center gap-2 text-left text-sm"><span className={item.done ? 'text-emerald-600' : 'text-slate-400'}>{item.done ? <Check className="w-4 h-4" /> : <Circle className="w-4 h-4" />}</span>{item.label}</button>)}</section>
            <section className="rounded-2xl border border-slate-200 p-4 space-y-3"><div className="flex items-center gap-2 text-xs uppercase tracking-widest"><FileText className="w-4 h-4" />Documents</div>{dossier.documents.map((doc) => <div key={doc.id} className="flex items-center justify-between gap-3 py-2 border-b border-slate-100"><div><div className="text-sm">{doc.name}</div><div className="text-[10px] text-slate-400">{doc.required ? 'Required' : 'Optional'}</div></div><button onClick={async () => { await toggleApplicationDocument(doc.id, !doc.uploaded); setDossier(await getApplicationDossier(dossier.id)); }} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200">{doc.uploaded ? 'Uploaded' : 'Mark ready'}</button></div>)}<div className="flex gap-2"><input value={newDoc} onChange={(e) => setNewDoc(e.target.value)} placeholder="Add document" className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm"/><button onClick={async () => { if (!newDoc.trim()) return; await addApplicationDocument(dossier.id, newDoc.trim()); setNewDoc(''); setDossier(await getApplicationDossier(dossier.id)); }} className="px-3 rounded-xl border border-slate-200"><Plus className="w-4 h-4" /></button></div></section>
            <section className="rounded-2xl border border-slate-200 p-4 space-y-3"><div className="flex items-center gap-2 text-xs uppercase tracking-widest"><ListChecks className="w-4 h-4" />Tasks & reminders</div>{dossier.tasks.map((task) => <button key={task.id} onClick={async () => { await toggleApplicationTask(task.id, !task.completed); setDossier(await getApplicationDossier(dossier.id)); }} className="w-full flex items-center justify-between gap-3 text-left py-2 border-b border-slate-100"><span className={task.completed ? 'line-through text-slate-400' : 'text-sm'}>{task.title}</span><span className="text-[10px] uppercase text-slate-400">{task.completed ? 'Done' : task.priority}</span></button>)}<div className="flex gap-2"><input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Add next task" className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm"/><button onClick={async () => { if (!newTask.trim()) return; await addApplicationTask(dossier.id, newTask.trim()); setNewTask(''); setDossier(await getApplicationDossier(dossier.id)); }} className="px-3 rounded-xl border border-slate-200"><Plus className="w-4 h-4" /></button></div></section>
            <section className="rounded-2xl border border-slate-200 p-4 space-y-3"><div className="flex items-center gap-2 text-xs uppercase tracking-widest"><Calendar className="w-4 h-4" />Interview</div><div className="grid sm:grid-cols-2 gap-2"><input type="datetime-local" value={dossier.interviewDate ? new Date(dossier.interviewDate).toISOString().slice(0,16) : ''} onChange={(e) => setDossier({ ...dossier, interviewDate: e.target.value ? new Date(e.target.value).toISOString() : null })} className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm"/><input value={dossier.interviewLocation ?? ''} onChange={(e) => setDossier({ ...dossier, interviewLocation: e.target.value })} placeholder="Interview location / link" className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm"/></div><textarea value={dossier.interviewNotes ?? ''} onChange={(e) => setDossier({ ...dossier, interviewNotes: e.target.value })} placeholder="Interview preparation notes" className="w-full min-h-20 rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm"/><button onClick={() => void saveDossier({ interview_date: dossier.interviewDate ?? null, interview_location: dossier.interviewLocation ?? null, interview_notes: dossier.interviewNotes ?? null })} className="px-4 py-2 rounded-xl bg-sky-700 text-white text-xs uppercase tracking-wider">Save interview</button></section>
            <section className="rounded-2xl border border-slate-200 p-4 space-y-3"><div className="flex items-center gap-2 text-xs uppercase tracking-widest"><History className="w-4 h-4" />Status history</div>{dossier.history.map((item) => <div key={item.id} className="flex items-start gap-3 py-2 border-b border-slate-100"><div className="w-2 h-2 rounded-full bg-slate-500 mt-1.5"/><div><div className="text-xs">{item.fromStatus ? `${item.fromStatus} → ` : ''}{item.toStatus}</div><div className="text-[10px] text-slate-400">{fmtDate(item.createdAt)}{item.note ? ` · ${item.note}` : ''}</div></div></div>)}</section>
            {dossier.officialUrl && <a href={dossier.officialUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-700 text-white text-xs uppercase tracking-widest font-medium"><ExternalLink className="w-4 h-4" />Open official application portal</a>}
          </div>
        </>}
      </div>
    </div>}
  </div>;
};
