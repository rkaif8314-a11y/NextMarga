import React from 'react';
import { Bell, Search, Settings, Sparkles } from 'lucide-react';
import { UserProfile, AppScreen } from '../types';

interface TopHeaderProps {
  profile: UserProfile;
  userEmail?: string;
  unreadNotificationsCount?: number;
  onNavigate: (screen: AppScreen) => void;
  showSubtitlePill?: boolean;
}

const publicNav: { label: string; screen: AppScreen }[] = [
  { label: 'Opportunities', screen: 'explore' },
  { label: 'Roadmap', screen: 'roadmap' },
  { label: 'Applications', screen: 'applications' },
  { label: 'CareerAI', screen: 'assessment' },
  { label: 'About', screen: 'support' },
];

export const TopHeader: React.FC<TopHeaderProps> = ({
  profile,
  userEmail,
  unreadNotificationsCount = 0,
  onNavigate,
}) => {
  const firstName = profile.fullName ? profile.fullName.split(' ')[0] : 'Scholar';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <button onClick={() => onNavigate(userEmail ? 'home' : 'landing')} className="flex shrink-0 items-center gap-3 text-left" aria-label="NextMarga home">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-sky-700 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-slate-950">NextMarga</span>
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {publicNav.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.screen)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${item.screen === 'explore' ? 'bg-sky-50 text-sky-800' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button onClick={() => onNavigate('explore')} className="hidden h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm hover:bg-slate-50 sm:inline-flex" title="Search opportunities">
            <Search className="h-4 w-4" /> Search
          </button>
          <button onClick={() => onNavigate('settings')} className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-950" aria-label="Open settings">
            <Settings className="h-4 w-4" />
          </button>
          {userEmail ? (
            <>
              <button onClick={() => onNavigate('notifications')} className="relative flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-950" aria-label="Open notifications">
                <Bell className="h-4 w-4" />
                {unreadNotificationsCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-sky-700 px-1 text-[9px] font-bold text-white ring-2 ring-white">{unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}</span>}
              </button>
              <button onClick={() => onNavigate('profile')} className="hidden h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100 sm:block" aria-label={`Open profile for ${firstName}`}>
                <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
              </button>
            </>
          ) : (
            <button onClick={() => onNavigate('auth')} className="inline-flex h-10 items-center rounded-md bg-sky-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-sky-800">Sign in</button>
          )}
        </div>
      </div>
    </header>
  );
};
