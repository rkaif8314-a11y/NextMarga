import React, { useState, useEffect } from 'react';
import { UserProfile, Opportunity, AppNotification, ApplicationItem, AppScreen } from './types';
import { initialProfile, sampleOpportunities, sampleNotifications, sampleApplications } from './data/mockData';
import { TopHeader } from './components/TopHeader';
import { BottomNav } from './components/BottomNav';
import { LandingScreen } from './components/LandingScreen';
import { OnboardingWizard } from './components/OnboardingWizard';
import { HomeScreen } from './components/HomeScreen';
import { OpportunityDetailScreen } from './components/OpportunityDetailScreen';
import { RoadmapScreen } from './components/RoadmapScreen';
import { CareerAIChatScreen } from './components/CareerAIChatScreen';
import { ApplicationsScreen } from './components/ApplicationsScreen';
import { AssessmentScreen } from './components/AssessmentScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { ProfileScreen } from './components/ProfileScreen';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
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
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>(['math-olympiad-2024', 'stem-scholarship-bihar']);
  const [notifications, setNotifications] = useState<AppNotification[]>(sampleNotifications);
  const [applications, setApplications] = useState<ApplicationItem[]>(sampleApplications);

  // Save profile changes to local storage
  useEffect(() => {
    localStorage.setItem('nextmarga_profile', JSON.stringify(profile));
  }, [profile]);

  const handleToggleSaveOpportunity = (oppId: string) => {
    setSavedOpportunityIds((prev) => {
      const exists = prev.includes(oppId);
      if (exists) {
        return prev.filter((id) => id !== oppId);
      } else {
        return [...prev, oppId];
      }
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
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );
    if (notif.actionScreen === 'detail' && notif.actionId) {
      handleSelectOpportunityById(notif.actionId);
    } else if (notif.actionScreen) {
      setCurrentScreen(notif.actionScreen as AppScreen);
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const showBottomNav = ['home', 'explore', 'roadmap', 'applications', 'profile'].includes(currentScreen);
  const showTopHeader = ['home', 'roadmap', 'explore'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F2ED] flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {/* Top Header on primary tabs */}
      {showTopHeader && (
        <TopHeader
          profile={profile}
          unreadNotificationsCount={unreadCount}
          onNavigate={(scr) => setCurrentScreen(scr)}
        />
      )}

      {/* Screen Render Switch */}
      <main className="flex-1">
        {currentScreen === 'landing' && (
          <LandingScreen
            onNavigate={(scr) => setCurrentScreen(scr)}
            onStartOnboarding={() => setCurrentScreen('onboarding')}
          />
        )}

        {currentScreen === 'onboarding' && (
          <OnboardingWizard
            initialProfile={profile}
            onComplete={(updated) => {
              setProfile(updated);
              setCurrentScreen('home');
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

        {currentScreen === 'roadmap' && (
          <RoadmapScreen
            profile={profile}
            onNavigate={(scr) => setCurrentScreen(scr)}
          />
        )}

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

        {currentScreen === 'assessment' && (
          <AssessmentScreen
            profile={profile}
            onExit={() => setCurrentScreen('applications')}
          />
        )}

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
            onSave={(updated) => setProfile(updated)}
            onStartOnboarding={() => setCurrentScreen('onboarding')}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation Bar */}
      {showBottomNav && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={(scr) => setCurrentScreen(scr)}
        />
      )}
    </div>
  );
}

export default App;
