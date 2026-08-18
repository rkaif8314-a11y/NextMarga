import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bell, Check, ChevronRight, Moon, Palette, RotateCcw, Shield, Sparkles, Sun, UserRound } from 'lucide-react';
import { AppScreen } from '../types';

export type ThemeMode = 'dark' | 'light' | 'system';
export type Accent = 'ivory' | 'blue' | 'violet' | 'emerald' | 'amber';

export interface AppPreferences {
  theme: ThemeMode;
  accent: Accent;
  compactMode: boolean;
  reducedMotion: boolean;
  notifications: boolean;
}

const defaults: AppPreferences = { theme: 'dark', accent: 'ivory', compactMode: false, reducedMotion: false, notifications: true };

export const getPreferences = (): AppPreferences => {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem('nextmarga_preferences') || '{}') }; }
  catch { return defaults; }
};

interface SettingsScreenProps { onBack: () => void; onNavigate: (screen: AppScreen) => void; onPreferencesChange?: (prefs: AppPreferences) => void; }

const accents: { id: Accent; label: string; className: string }[] = [
  { id: 'ivory', label: 'Ivory', className: 'bg-[#F5F2ED]' },
  { id: 'blue', label: 'Ocean', className: 'bg-sky-400' },
  { id: 'violet', label: 'Violet', className: 'bg-violet-400' },
  { id: 'emerald', label: 'Emerald', className: 'bg-emerald-400' },
  { id: 'amber', label: 'Amber', className: 'bg-amber-400' },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onNavigate, onPreferencesChange }) => {
  const [prefs, setPrefs] = useState<AppPreferences>(getPreferences);
  const update = (patch: Partial<AppPreferences>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next); localStorage.setItem('nextmarga_preferences', JSON.stringify(next)); onPreferencesChange?.(next);
  };
  useEffect(() => { document.documentElement.dataset.theme = prefs.theme; document.documentElement.dataset.accent = prefs.accent; document.documentElement.dataset.compact = String(prefs.compactMode); document.documentElement.dataset.reducedMotion = String(prefs.reducedMotion); }, [prefs]);
  const reset = () => { setPrefs(defaults); localStorage.setItem('nextmarga_preferences', JSON.stringify(defaults)); onPreferencesChange?.(defaults); };
  return <div className="min-h-screen bg-[#0A0A0A] text-[#F5F2ED] px-4 py-6 sm:px-6 pb-28">
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div className="flex items-center gap-3"><button onClick={onBack} className="p-2 rounded-lg border border-white/10 hover:bg-white/5"><ArrowLeft className="w-4 h-4" /></button><div><div className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">Control Center</div><h1 className="font-serif-luxury text-2xl sm:text-3xl">Settings</h1></div></div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-emerald-300/70"><span className="w-1.5 h-1.5 rounded-full bg-emerald-300" /> Preferences saved</div>
      </div>

      <section className="mt-6 rounded-2xl border border-white/10 bg-[#121212] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10"><div className="flex items-center gap-2"><Palette className="w-4 h-4 text-white/60" /><span className="text-xs uppercase tracking-[0.22em] font-mono text-white/50">Appearance</span></div><p className="text-xs text-white/40 mt-1">Make NextMarga feel like your workspace.</p></div>
        <div className="p-5 space-y-6">
          <div><div className="text-xs font-medium mb-3">Theme</div><div className="grid grid-cols-3 gap-2">{([['dark','Dark',Moon],['light','Light',Sun],['system','System',Sparkles]] as const).map(([id,label,Icon]) => <button key={id} onClick={() => update({ theme: id })} className={`p-3 rounded-xl border text-left transition-all ${prefs.theme === id ? 'border-white/50 bg-white/10' : 'border-white/10 bg-white/[0.02] hover:bg-white/5'}`}><Icon className="w-4 h-4 mb-3 text-white/70" /><div className="text-xs">{label}</div>{prefs.theme === id && <Check className="w-3.5 h-3.5 mt-2" />}</button>)}</div></div>
          <div><div className="text-xs font-medium mb-3">Accent</div><div className="flex flex-wrap gap-3">{accents.map(a => <button key={a.id} onClick={() => update({ accent: a.id })} className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 hover:bg-white/5"><span className={`w-3 h-3 rounded-full ${a.className}`} /> <span className="text-[11px] text-white/70">{a.label}</span>{prefs.accent === a.id && <Check className="w-3 h-3" />}</button>)}</div></div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-white/10 bg-[#121212] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10"><div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-white/60" /><span className="text-xs uppercase tracking-[0.22em] font-mono text-white/50">Experience</span></div></div>
        <div className="divide-y divide-white/10">
          {[['compactMode','Compact interface','Fit more opportunities and information on screen.'],['reducedMotion','Reduce motion','Use simpler transitions and animations.'],['notifications','Opportunity alerts','Receive deadline, match and application notifications.']].map(([key,title,desc]) => <button key={key} onClick={() => update({ [key]: !prefs[key as keyof AppPreferences] } as Partial<AppPreferences>)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.03]"><div><div className="text-xs">{title}</div><div className="text-[11px] text-white/35 mt-1">{desc}</div></div><span className={`w-10 h-5 rounded-full p-0.5 transition-colors ${prefs[key as keyof AppPreferences] ? 'bg-white' : 'bg-white/10'}`}><span className={`block w-4 h-4 rounded-full transition-transform ${prefs[key as keyof AppPreferences] ? 'translate-x-5 bg-black' : 'bg-white/40'}`} /></span></button>)}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-white/10 bg-[#121212] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10"><div className="text-xs uppercase tracking-[0.22em] font-mono text-white/50">Account & Profile</div></div>
        <button onClick={() => onNavigate('profile')} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.03]"><span className="flex items-center gap-3"><UserRound className="w-4 h-4 text-white/50" /><span><span className="block text-xs text-left">Profile & personal information</span><span className="block text-[11px] text-white/35 mt-1">Update your academic and contact details</span></span></span><ChevronRight className="w-4 h-4 text-white/30" /></button>
        <button onClick={() => onNavigate('notifications')} className="w-full flex items-center justify-between px-5 py-4 border-t border-white/10 hover:bg-white/[0.03]"><span className="flex items-center gap-3"><Bell className="w-4 h-4 text-white/50" /><span><span className="block text-xs text-left">Notification center</span><span className="block text-[11px] text-white/35 mt-1">Review deadline and opportunity updates</span></span></span><ChevronRight className="w-4 h-4 text-white/30" /></button>
      </section>

      <button onClick={reset} className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-[10px] uppercase tracking-[0.18em] text-white/45 hover:text-white hover:bg-white/5"><RotateCcw className="w-3.5 h-3.5" /> Reset appearance & preferences</button>
      <div className="mt-6 flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.25em] text-white/20 font-mono"><Shield className="w-3 h-3" /> Your preferences stay on this device</div>
    </div>
  </div>;
};
