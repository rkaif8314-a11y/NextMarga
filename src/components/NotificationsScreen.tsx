import React, { useState } from 'react';
import { ArrowLeft, CheckCheck, Clock, Sparkles, FileText, CheckCircle2, BellRing } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsScreenProps {
  notifications: AppNotification[];
  onBack: () => void;
  onSelectNotification: (notif: AppNotification) => void;
  onMarkAllRead: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ notifications, onBack, onSelectNotification, onMarkAllRead }) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const filtered = notifications.filter((n) => (filter === 'unread' ? n.unread : true));

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'urgent': return { icon: Clock, bg: 'bg-slate-50 text-slate-800 border-slate-200' };
      case 'match': return { icon: Sparkles, bg: 'bg-slate-50 text-slate-800 border-slate-200' };
      case 'update': return { icon: FileText, bg: 'bg-slate-50 text-slate-800 border-slate-200' };
      case 'milestone': return { icon: CheckCircle2, bg: 'bg-slate-50 text-slate-800 border-slate-200' };
    }
  };

  const formatTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return <div className="max-w-2xl mx-auto px-4 pt-4 pb-28 space-y-5 animate-fadeIn">
    <div className="flex items-center justify-between border-b border-slate-200 pb-4"><div className="flex items-center gap-3"><button onClick={onBack} className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-sky-800/5 transition-colors"><ArrowLeft className="w-4 h-4 stroke-[1.5]" /></button><div><span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 block font-medium">Activity Log</span><h1 className="text-xl sm:text-2xl font-light font-serif-luxury text-slate-950 tracking-tight uppercase">Notifications & Alerts</h1></div></div><button onClick={onMarkAllRead} className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-sky-800/5 transition-colors" title="Mark all as read"><CheckCheck className="w-4 h-4" /></button></div>
    <div className="flex bg-white border border-slate-200 p-1 rounded-xl"><button onClick={() => setFilter('all')} className={`flex-1 py-1.5 text-xs uppercase tracking-[0.12em] font-medium rounded-lg transition-all ${filter === 'all' ? 'bg-sky-700 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-950'}`}>All Activity</button><button onClick={() => setFilter('unread')} className={`flex-1 py-1.5 text-xs uppercase tracking-[0.12em] font-medium rounded-lg transition-all ${filter === 'unread' ? 'bg-sky-700 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-950'}`}>Unread Alerts</button></div>
    <div className="space-y-3 pt-1">
      {filtered.length === 0 && <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center"><BellRing className="w-5 h-5 mx-auto text-slate-400" /><div className="mt-3 text-sm">No alerts right now</div><div className="mt-1 text-xs text-slate-500">NextMarga will surface relevant activity and approaching deadlines here.</div></div>}
      {filtered.map((notif) => { const { icon: Icon, bg } = getIcon(notif.type); const isDeadline = notif.id.startsWith('deadline-'); return <div key={notif.id} onClick={() => onSelectNotification(notif)} className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${notif.unread ? 'bg-white border-slate-300 shadow-sm' : 'bg-white/60 border-slate-200 hover:border-slate-300'}`}>
        <div className={`p-2.5 rounded-lg border flex-shrink-0 ${bg}`}><Icon className="w-4 h-4" /></div>
        <div className="flex-1 min-w-0"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-[10px] font-mono tracking-[0.2em] text-slate-500 uppercase">{isDeadline ? 'DEADLINE ALERT' : notif.title}</span><span className="text-[9px] font-mono text-slate-500">{formatTime(notif.timestamp)}</span></div>{isDeadline && <div className="mt-1 inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] uppercase tracking-wider text-slate-600">Personalized for your profile</div>}<p className="text-xs sm:text-sm text-slate-800 mt-1.5 leading-relaxed font-light">{notif.message}</p></div>
        {notif.unread && <div className="w-2 h-2 rounded-full bg-sky-700 shadow-[0_0_8px_rgba(255,255,255,0.8)] flex-shrink-0 mt-2" />}
      </div>; })}
    </div>
  </div>;
};
