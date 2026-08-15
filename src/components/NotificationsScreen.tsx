import React, { useState } from 'react';
import { ArrowLeft, CheckCheck, Clock, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsScreenProps {
  notifications: AppNotification[];
  onBack: () => void;
  onSelectNotification: (notif: AppNotification) => void;
  onMarkAllRead: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications,
  onBack,
  onSelectNotification,
  onMarkAllRead,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => (filter === 'unread' ? n.unread : true));

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'urgent':
        return { icon: Clock, bg: 'bg-white/5 text-white/80 border-white/15' };
      case 'match':
        return { icon: Sparkles, bg: 'bg-white/5 text-white/80 border-white/15' };
      case 'update':
        return { icon: FileText, bg: 'bg-white/5 text-white/80 border-white/15' };
      case 'milestone':
        return { icon: CheckCircle2, bg: 'bg-white/5 text-white/80 border-white/15' };
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-28 space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
          </button>
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block font-medium">Activity Log</span>
            <h1 className="text-xl sm:text-2xl font-light font-serif-luxury text-[#F5F2ED] tracking-tight uppercase">
              Notifications & Alerts
            </h1>
          </div>
        </div>

        <button
          onClick={onMarkAllRead}
          className="p-2 rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          title="Mark all as read"
        >
          <CheckCheck className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-[#121212] border border-white/10 p-1 rounded-xl">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 text-xs uppercase tracking-[0.12em] font-medium rounded-lg transition-all ${
            filter === 'all' ? 'bg-[#F5F2ED] text-black shadow-sm' : 'text-white/50 hover:text-white'
          }`}
        >
          All Activity
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`flex-1 py-1.5 text-xs uppercase tracking-[0.12em] font-medium rounded-lg transition-all ${
            filter === 'unread' ? 'bg-[#F5F2ED] text-black shadow-sm' : 'text-white/50 hover:text-white'
          }`}
        >
          Unread Alerts
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 pt-1">
        {filtered.map((notif) => {
          const { icon: Icon, bg } = getIcon(notif.type);

          return (
            <div
              key={notif.id}
              onClick={() => onSelectNotification(notif)}
              className={`p-4.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                notif.unread
                  ? 'bg-[#121212] border-white/20 shadow-sm'
                  : 'bg-[#121212]/60 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Circular Icon */}
              <div className={`p-2.5 rounded-lg border flex-shrink-0 ${bg}`}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase">
                    {notif.title}
                  </span>
                  <span className="text-[9px] font-mono text-white/40">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/80 mt-1 leading-relaxed font-light">
                  {notif.message}
                </p>
              </div>

              {/* Unread dot */}
              {notif.unread && (
                <div className="w-2 h-2 rounded-full bg-[#F5F2ED] shadow-[0_0_8px_rgba(255,255,255,0.8)] flex-shrink-0 mt-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
