import React from 'react';
import { Home, Search, TrendingUp, ClipboardList, User } from 'lucide-react';
import { AppScreen } from '../types';

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems: { id: AppScreen; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Search },
    { id: 'roadmap', label: 'Roadmap', icon: TrendingUp },
    { id: 'applications', label: 'Applications', icon: ClipboardList },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-md mx-auto px-3 py-2 flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all duration-200 select-none group ${
                isActive
                  ? 'text-[#F5F2ED]'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              <div
                className={`p-2 rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 border border-white/30 -translate-y-0.5 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                    : 'bg-transparent hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#F5F2ED] stroke-[2]' : 'text-white/50 group-hover:text-white/80 stroke-[1.5]'}`} />
              </div>
              <span
                className={`text-[10px] mt-1 uppercase tracking-[0.15em] font-medium transition-colors ${
                  isActive ? 'text-[#F5F2ED] font-semibold' : 'text-white/40 group-hover:text-white/70'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
