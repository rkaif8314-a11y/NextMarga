import React, { useState } from 'react';
import { Calendar, MapPin, PlayCircle, CheckCircle2 } from 'lucide-react';
import { ApplicationItem, AppScreen } from '../types';

interface ApplicationsScreenProps {
  applications: ApplicationItem[];
  onNavigate: (screen: AppScreen) => void;
  onStartAssessment: () => void;
  onUpdateStatus?: (id: string, status: ApplicationItem['status']) => void;
}

export const ApplicationsScreen: React.FC<ApplicationsScreenProps> = ({ applications, onNavigate, onStartAssessment, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'saved' | 'completed'>('active');
  const activeCount = applications.filter((a) => a.category === 'active').length;
  const savedCount = applications.filter((a) => a.category === 'saved').length;
  const completedCount = applications.filter((a) => a.category === 'completed').length;
  const filteredApps = applications.filter((a) => a.category === activeTab);

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-28 space-y-5 animate-fadeIn">
      <div className="border-b border-white/10 pb-4"><span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-1 font-medium">Registry & Portfolio</span><h1 className="text-2xl sm:text-3xl font-light font-serif-luxury text-[#F5F2ED] tracking-tight uppercase">Application Dossiers</h1></div>
      <div className="flex bg-[#121212] border border-white/10 p-1 rounded-xl">
        {[{ id: 'active', label: `Active (${activeCount})` }, { id: 'saved', label: `Saved (${savedCount})` }, { id: 'completed', label: `Archived (${completedCount})` }].map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 py-2 text-xs font-medium uppercase tracking-[0.12em] rounded-lg transition-all ${activeTab === tab.id ? 'bg-[#F5F2ED] text-black shadow-sm' : 'text-white/50 hover:text-white'}`}>{tab.label}</button>)}
      </div>
      <div className="space-y-4 pt-1">
        {filteredApps.length === 0 && <div className="rounded-2xl border border-white/10 bg-[#121212] p-8 text-center text-sm text-white/45">Nothing here yet. Explore opportunities and save or apply to build your portfolio.</div>}
        {filteredApps.map((app) => <div key={app.id} className="bg-[#121212] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all space-y-4">
          <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3.5"><div className="w-11 h-11 rounded-lg border border-white/20 bg-white/5 text-[#F5F2ED] font-serif-luxury font-medium text-lg flex items-center justify-center flex-shrink-0">{app.letter}</div><div><h3 className="font-serif-luxury font-medium text-[#F5F2ED] text-base leading-tight">{app.title}</h3><div className="text-xs text-white/50 font-light mt-0.5">{app.organization}</div></div></div><span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-white/5 text-white/80 border border-white/15">{app.status}</span></div>
          <div className="flex items-center gap-4 text-xs text-white/50 pt-1 font-light"><div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-white/40" /><span>{app.location}</span></div><div className="flex items-center gap-1.5 font-mono text-[11px]"><Calendar className="w-3.5 h-3.5 text-white/40" /><span>{app.term || app.appliedDate}</span></div></div>
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            {app.status === 'Interview Scheduled' ? <><div className="flex-1 text-[11px] font-mono text-white/70">SCHEDULED // {app.interviewTime}</div><button onClick={onStartAssessment} className="flex items-center gap-1.5 px-4 py-2 bg-[#F5F2ED] hover:bg-white text-black text-xs font-medium uppercase tracking-[0.15em] rounded-lg transition-all"><PlayCircle className="w-3.5 h-3.5" /><span>Initiate Assessment</span></button></> : <>
              {app.status === 'Saved' && onUpdateStatus && <button onClick={() => onUpdateStatus(app.id, 'Applied')} className="flex items-center gap-1.5 px-4 py-2 bg-[#F5F2ED] hover:bg-white text-black text-xs font-medium uppercase tracking-[0.12em] rounded-lg transition-all"><CheckCircle2 className="w-3.5 h-3.5" />Mark Applied</button>}
              <button onClick={() => onNavigate('explore')} className="flex-1 py-2 text-center text-xs uppercase tracking-[0.15em] font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors">Inspect Dossier</button>
            </>}
          </div>
        </div>)}
      </div>
    </div>
  );
};
