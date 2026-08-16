import React from 'react';
import { Bell } from 'lucide-react';
import { UserProfile, AppScreen } from '../types';

interface TopHeaderProps {
  profile: UserProfile;
  unreadNotificationsCount?: number;
  onNavigate: (screen: AppScreen) => void;
  showSubtitlePill?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  profile,
  unreadNotificationsCount = 3,
  onNavigate,
  showSubtitlePill = true,
}) => {
  const firstName = profile.fullName ? profile.fullName.split(' ')[0] : 'Scholar';
  const interestsSummary = profile.interests && profile.interests.length > 0
    ? profile.interests.slice(0, 2).join(' • ')
    : 'STEM • Research';

  return (
    <header className="bg-[#0A0A0A]/90 backdrop-blur-xl sticky top-0 z-30 border-b border-white/10 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* User Info & Avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('profile')}
            className="relative focus:outline-none focus:ring-1 focus:ring-white/40 rounded-full transition-transform active:scale-95 group"
            title="View Profile Settings"
          >
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-white/20 ring-1 ring-white/10 bg-white/5 transition-all group-hover:border-white/50"
            />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">Scholar Portal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif-luxury text-[#F5F2ED] text-base sm:text-lg tracking-wide">
                Welcome, {firstName}
              </span>
            </div>

            {showSubtitlePill && (
              <div className="mt-0.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-[0.15em] font-medium bg-white/5 text-white/70 border border-white/10">
                {profile.currentClass} &nbsp;|&nbsp; {profile.state} &nbsp;|&nbsp; {interestsSummary}
              </div>
            )}
          </div>
        </div>

        {/* Notifications Icon Button */}
        <button
          onClick={() => onNavigate('notifications')}
          className="relative p-2.5 rounded-full border border-white/10 bg-white/5 text-white/80 hover:text-[#F5F2ED] hover:bg-white/10 hover:border-white/30 active:scale-95 transition-all focus:outline-none focus:ring-1 focus:ring-white/40"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-[#F5F2ED]" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#F5F2ED] text-[9px] font-bold text-black ring-2 ring-[#0A0A0A]">
              {unreadNotificationsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
