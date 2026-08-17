import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, Opportunity, AppNotification, ApplicationItem, AppScreen } from './types';
import { initialProfile, sampleOpportunities, sampleNotifications, sampleApplications } from './data/mockData';
import { TopHeader } from './components/TopHeader';
import { BottomNav } from './components/BottomNav';
import { LandingScreen } from './components/LandingScreen';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingWizard } from './components/OnboardingWizard';
import { HomeScreen } from './components/HomeScreen';
import { OpportunityDetailScreen } from './components/OpportunityDetailScreen';
import { RoadmapScreen } from './components/RoadmapScreen';
import { CareerAIChatScreen } from './components/CareerAIChatScreen';
import { ApplicationsScreen } from './components/ApplicationsScreen';
import { AssessmentScreen } from './components/AssessmentScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { supabase } from './lib/supabase';
import { getUserProfile, saveUserProfile } from './lib/profile';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');
  const [authLoading, setAuthLoading] = useState(true);
  const [appError, setAppError] = useState('');
  const [profile, setProfile] = useState<UserProfile>(() => {
    const cached = localStorage.getItem('nextmarga_profile');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return initialProfile;
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(sampleOpportunities);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity>(sampleOpportunities[0]);
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(sampleNotifications);
  const [applications, setApplications] = useState<ApplicationItem[]>(sampleApplications);

  const loadAuthenticatedUser = useCallback(async () => {
    setAppError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCurrentScreen('landing');
        return;
      }

      const remoteProfile = await getUserProfile();
      if (remoteProfile && remoteProfile.fullName.trim()) {
        setProfile(remoteProfile);
        setCurrentScreen('home');
      } else {
        setCurrentScreen('onboarding');
      }
    } catch (error) {
      console.error(error);
      setAppError(error instanceof Error ? error.message : 'Could not load your account.');
    }
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return;
      if (session?.user) {
        await loadAuthenticatedUser();
      }
      if (active) setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === 'SIGNED_IN' && session?.user) {
        window.setTimeout(() => {
          if (active) void loadAuthenticatedUser();
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setProfile(initialProfile);
        localStorage.removeItem('nextmarga_profile');
        setCurrentScreen('landing');
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadAuthenticatedUser]);

  useEffect(() => {
    localStorage.setItem('nextmarga_profile', JSON.stringify(profile));
  }, [profile]);

  const handleToggleSaveOpportunity = (oppId: string) => {
    setSavedOpportunityIds((prev) => {
      const exists = prev.includes(oppId);
      return exists ? prev.filter((id) => id !== oppId) : [...prev, oppId];
    });
  };

  const handleSelectOpportunity = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setCurrentScreen('detail');
  };

  const handleSelectOpportunityById = (id: string) => {
    const match = opportunities.find((o) => o.id === id);
    if (match) {
      setSelectedOpportunity(match);
      setCurrentScreen('detail');
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleSelectNotification = (notif: AppNotification) => {
    setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n)));
    if (notif.actionScreen === 'detail' && notif.actionId) {
      handleSelectOpportunityById(notif.actionId);
    } else if (notif.actionScreen) {
      setCurrentScreen(notif.actionScreen as AppScreen);
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;
  const showBottomNav = ['home', 'explore', 'roadmap', 'applications', 'profile'].includes(currentScreen);
  const showTopHeader = ['home', 'roadmap', 'explore'].includes(currentScreen);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F2ED] flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-white/40">NextMarga</div>
          <div className="mt-3 text-sm text-white/60">Preparing your opportunity path...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F2ED] flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {showTopHeader && (
        <TopHeader
          profile={profile}
          unreadNotificationsCount={unreadCount}
          onNavigate={(scr) => setCurrentScreen(scr)}
        />
      )}

      {appError && (
        <div className="mx-auto w-full max-w-xl px-5 pt-4">
          <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-xs text-red-200">
            {appError}
          </div>
        </div>
      )}

      <main className="flex-1">
        {currentScreen === 'landing' && (
          <LandingScreen
            onNavigate={(scr) => setCurrentScreen(scr)}
            onStartOnboarding={() => setCurrentScreen('auth')}
          />
        )}

        {currentScreen === 'auth' && (
          <AuthScreen
            onBack={() => setCurrentScreen('landing')}
            onAuthenticated={() => void loadAuthenticatedUser()}
          />
        )}

        {currentScreen === 'onboarding' && (
          <OnboardingWizard
            initialProfile={profile}
            onComplete={async (updated) => {
              try {
                setAppError('');
                await saveUserProfile(updated);
                setProfile(updated);
                setCurrentScreen('home');
              } catch (error) {
                console.error(error);
                setAppError(error instanceof Error ? error.message : 'Could not save your profile.');
              }
            }}
            onCancel={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'home' && (
          <HomeScreen
            profile={profile}
            opportunities={opportunities}
            savedOpportunityIds={savedOpportunityIds}
            onSelectOpportunity={handleSelectOpportunity}
            onToggleSave={handleToggleSaveOpportunity}
            onNavigate={(scr) => setCurrentScreen(scr)}
          />
        )}

        {currentScreen === 'detail' && (
          <OpportunityDetailScreen
            opportunity={selectedOpportunity}
            isSaved={savedOpportunityIds.includes(selectedOpportunity.id)}
            onBack={() => setCurrentScreen('home')}
            onToggleSave={() => handleToggleSaveOpportunity(selectedOpportunity.id)}
            onStartAssessment={() => setCurrentScreen('assessment')}
          />
        )}

        {currentScreen === 'roadmap' && <RoadmapScreen profile={profile} onNavigate={(scr) => setCurrentScreen(scr)} />}

        {currentScreen === 'explore' && (
          <CareerAIChatScreen
            profile={profile}
            onSelectOpportunityById={handleSelectOpportunityById}
            onNavigate={(scr) => setCurrentScreen(scr)}
          />
        )}

        {currentScreen === 'applications' && (
          <ApplicationsScreen
            applications={applications}
            onNavigate={(scr) => setCurrentScreen(scr)}
            onStartAssessment={() => setCurrentScreen('assessment')}
          />
        )}

        {currentScreen === 'assessment' && <AssessmentScreen profile={profile} onExit={() => setCurrentScreen('applications')} />}

        {currentScreen === 'notifications' && (
          <NotificationsScreen
            notifications={notifications}
            onBack={() => setCurrentScreen('home')}
            onSelectNotification={handleSelectNotification}
            onMarkAllRead={handleMarkAllNotificationsRead}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            profile={profile}
            onBack={() => setCurrentScreen('home')}
            onSave={async (updated) => {
              try {
                await saveUserProfile(updated);
                setProfile(updated);
              } catch (error) {
                setAppError(error instanceof Error ? error.message : 'Could not save your profile.');
              }
            }}
            onStartOnboarding={() => setCurrentScreen('onboarding')}
          />
        )}
      </main>

      {showBottomNav && (
        <BottomNav currentScreen={currentScreen} onNavigate={(scr) => setCurrentScreen(scr)} />
      )}
    </div>
  );
}

export default App;
