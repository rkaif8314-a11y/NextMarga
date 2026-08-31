import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { UserProfile, AppScreen } from '../types';

interface TopHeaderProps {
  profile: UserProfile;
  userEmail?: string;
  unreadNotificationsCount?: number;
  onNavigate: (screen: AppScreen) => void;
  showSubtitlePill?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  profile,
  userEmail,
  unreadNotificationsCount = 0,
  onNavigate,
  showSubtitlePill = true,
}) => {
  const firstName = profile.fullName ? profile.fullName.split(' ')[0] : 'Scholar';
  const interestsSummary = profile.interests?.length
    ? profile.interests.slice(0, 2).join(' • ')
    : 'STEM • Research';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => onNavigate('profile')}
            className="relative shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-200 active:scale-95"
            title="View profile"
          >
            <img
              src={profile.avatarUrl}
              alt={profile.fullName || 'Profile'}
              className="h-10 w-10 rounded-full object-cover border border-slate-200 bg-slate-100 sm:h-11 sm:w-11"
            />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
                Scholar Portal
              </span>
              {userEmail && (
                <span className="hidden text-[9px] font-medium uppercase tracking-[0.12em] text-emerald-700 sm:inline">
                  Account connected
                </span>
              )}
            </div>
            <div className="truncate font-display text-base font-semibold tracking-tight text-slate-950 sm:text-lg">
              Welcome, {firstName}
            </div>
            {showSubtitlePill && (
              <div className="mt-0.5 inline-flex max-w-full truncate rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600">
                {profile.currentClass} &nbsp;|&nbsp; {profile.state} &nbsp;|&nbsp; {interestsSummary}
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => onNavigate('settings')}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 active:scale-95"
            title="Settings"
            aria-label="Open settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => onNavigate('notifications')}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 active:scale-95"
            title="Notifications"
            aria-label="Open notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-sky-700 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
