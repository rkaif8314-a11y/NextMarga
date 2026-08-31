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
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-[0_-8px_24px_rgba(15,23,42,0.06)]">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-3 py-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group flex min-w-16 flex-col items-center justify-center rounded-lg px-2 py-1.5 text-center transition-colors ${
                isActive ? 'text-sky-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                isActive
                  ? 'border-sky-200 bg-sky-50 text-sky-700'
                  : 'border-transparent bg-transparent text-slate-400 group-hover:bg-slate-50'
              }`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className={`mt-1 text-[10px] font-medium tracking-wide ${isActive ? 'text-sky-700' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
