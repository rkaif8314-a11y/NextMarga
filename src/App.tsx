import React, { Suspense, lazy, useState, useEffect, useCallback } from 'react';
import { UserProfile, Opportunity, AppNotification, ApplicationItem, AppScreen } from './types';
import { initialProfile, sampleOpportunities, sampleNotifications, sampleApplications } from './data/mockData';
import { TopHeader } from './components/TopHeader';
import { BottomNav } from './components/BottomNav';
import { LandingScreen } from './components/LandingScreen';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingWizard } from './components/OnboardingWizard';
import { LegalScreen } from './components/LegalScreen';
import { supabase } from './lib/supabase';
import { signOut } from './lib/auth';
import { getUserProfile, saveUserProfile } from './lib/profile';
import { getPersonalizedOpportunities, getOpportunityById } from './lib/opportunities';
import { getSavedOpportunityIds, toggleSavedOpportunity, getMyApplications, applyToOpportunity, updateApplicationStatus } from './lib/applications';
import { getMyNotifications, getDeadlineNotifications, markAllNotificationsRead, markNotificationRead } from './lib/notifications';
import { syncMyRoadmapWithProfile } from './lib/roadmap';

const HomeScreen = lazy(() => import('./components/HomeScreen').then((m) => ({ default: m.HomeScreen })));
const OpportunityDetailScreen = lazy(() => import('./components/OpportunityDetailScreen').then((m) => ({ default: m.OpportunityDetailScreen })));
const RoadmapScreen = lazy(() => import('./components/RoadmapScreen').then((m) => ({ default: m.RoadmapScreen })));
const OpportunityHub = lazy(() => import('./components/OpportunityHub').then((m) => ({ default: m.OpportunityHub })));
const ApplicationsScreen = lazy(() => import('./components/ApplicationsScreen').then((m) => ({ default: m.ApplicationsScreen })));
const AssessmentScreen = lazy(() => import('./components/AssessmentScreen').then((m) => ({ default: m.AssessmentScreen })));
const NotificationsScreen = lazy(() => import('./components/NotificationsScreen').then((m) => ({ default: m.NotificationsScreen })));
const ProfileScreen = lazy(() => import('./components/ProfileScreen').then((m) => ({ default: m.ProfileScreen })));
const SettingsScreen = lazy(() => import('./components/SettingsScreen').then((m) => ({ default: m.SettingsScreen })));

const protectedScreens: AppScreen[] = ['home', 'detail', 'roadmap', 'explore', 'applications', 'assessment', 'notifications', 'profile', 'settings'];
const ScreenLoader = () => <div className="min-h-[45vh] flex items-center justify-center"><div className="text-center"><div className="text-[10px] uppercase tracking-[0.3em] text-white/35">NextMarga</div><div className="mt-2 text-xs text-white/45">Loading…</div></div></div>;

function getCachedProfile(userId: string): UserProfile {
  try {
    const cached = localStorage.getItem(`nextmarga_profile_${userId}`);
    if (!cached) return initialProfile;
    const parsed = JSON.parse(cached);
    if (parsed && typeof parsed === 'object' && typeof parsed.fullName === 'string') return parsed as UserProfile;
  } catch {}
  return initialProfile;
}

export function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');
  const [authLoading, setAuthLoading] = useState(true);
  const [opportunitiesLoading, setOpportunitiesLoading] = useState(false);
  const [appError, setAppError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [authUserId, setAuthUserId] = useState('');
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(sampleOpportunities);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity>(sampleOpportunities[0]);
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(sampleNotifications);
  const [applications, setApplications] = useState<ApplicationItem[]>(sampleApplications);

  const navigate = useCallback(async (screen: AppScreen) => {
    if (!protectedScreens.includes(screen)) { setCurrentScreen(screen); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setCurrentScreen('auth'); return; }
    setCurrentScreen(screen);
  }, []);

  const loadOpportunities = useCallback(async (userProfile: UserProfile) => {
    setOpportunitiesLoading(true);
    try {
      const personalized = await getPersonalizedOpportunities(userProfile, 1000);
      setOpportunities(personalized);
      setNotifications((current) => [...getDeadlineNotifications(personalized), ...current.filter((n) => !n.id.startsWith('deadline-'))]);
      if (personalized.length > 0) setSelectedOpportunity((current) => personalized.find((o) => o.id === current.id) ?? personalized[0]);
    } catch (error) { console.error(error); setAppError(error instanceof Error ? error.message : 'Could not load opportunities.'); }
    finally { setOpportunitiesLoading(false); }
  }, []);

  const loadUserData = useCallback(async () => {
    const [savedIds, myApplications, myNotifications] = await Promise.all([getSavedOpportunityIds(), getMyApplications(), getMyNotifications()]);
    setSavedOpportunityIds(savedIds); setApplications(myApplications); setNotifications(myNotifications);
  }, []);
  const refreshApplications = useCallback(async () => { setApplications(await getMyApplications()); }, []);

  const loadAuthenticatedUser = useCallback(async () => {
    setAppError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setAuthUserId(''); setUserEmail(''); setCurrentScreen('landing'); return; }
      setAuthUserId(user.id);
      setUserEmail(user.email ?? '');
      setProfile(getCachedProfile(user.id));
      const remoteProfile = await getUserProfile();
      await loadUserData();
      if (remoteProfile && remoteProfile.fullName.trim()) { setProfile(remoteProfile); setCurrentScreen('home'); await loadOpportunities(remoteProfile); }
      else setCurrentScreen('onboarding');
    } catch (error) { console.error(error); setAppError(error instanceof Error ? error.message : 'Could not load your account.'); }
  }, [loadOpportunities, loadUserData]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nextmarga_preferences');
      const prefs = raw ? JSON.parse(raw) : {};
      document.documentElement.dataset.theme = prefs.theme || 'dark';
      document.documentElement.dataset.accent = prefs.accent || 'ivory';
      document.documentElement.dataset.compact = String(Boolean(prefs.compactMode));
      document.documentElement.dataset.reducedMotion = String(Boolean(prefs.reducedMotion));
    } catch {}
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data: { session } }) => { if (!active) return; if (session?.user) await loadAuthenticatedUser(); if (active) setAuthLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === 'SIGNED_IN' && session?.user) window.setTimeout(() => { if (active) void loadAuthenticatedUser(); }, 0);
      else if (event === 'SIGNED_OUT') { setAuthUserId(''); setUserEmail(''); setProfile(initialProfile); setOpportunities(sampleOpportunities); setSavedOpportunityIds([]); setNotifications([]); setApplications([]); localStorage.removeItem('nextmarga_profile'); setCurrentScreen('landing'); }
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [loadAuthenticatedUser]);

  useEffect(() => {
    if (!authUserId) return;
    try { localStorage.setItem(`nextmarga_profile_${authUserId}`, JSON.stringify(profile)); } catch {}
  }, [profile, authUserId]);

  const handleToggleSaveOpportunity = async (oppId: string) => { try { setAppError(''); const saved = await toggleSavedOpportunity(oppId); setSavedOpportunityIds((prev) => saved ? [...new Set([...prev, oppId])] : prev.filter((id) => id !== oppId)); await refreshApplications(); } catch (error) { setAppError(error instanceof Error ? error.message : 'Could not update saved opportunity.'); } };
  const handleApplyOpportunity = async (oppId: string) => { setAppError(''); await applyToOpportunity(oppId); setSavedOpportunityIds((prev) => prev.filter((id) => id !== oppId)); await refreshApplications(); setCurrentScreen('applications'); };
  const handleUpdateApplicationStatus = async (id: string, status: ApplicationItem['status']) => { try { setAppError(''); await updateApplicationStatus(id, status); await loadUserData(); } catch (error) { setAppError(error instanceof Error ? error.message : 'Could not update application.'); } };
  const handleSelectOpportunity = (opp: Opportunity) => { setSelectedOpportunity(opp); setCurrentScreen('detail'); };
  const handleSelectOpportunityById = (id: string) => { const match = opportunities.find((o) => o.id === id); if (match) { setSelectedOpportunity(match); setCurrentScreen('detail'); } };
  const handleInspectApplication = async (opportunityId?: string) => { if (!opportunityId) { setCurrentScreen('explore'); return; } try { const localMatch = opportunities.find((o) => o.id === opportunityId); if (localMatch) { setSelectedOpportunity(localMatch); setCurrentScreen('detail'); return; } const remote = await getOpportunityById(opportunityId); if (remote) { setSelectedOpportunity(remote); setCurrentScreen('detail'); return; } setCurrentScreen('explore'); } catch (error) { setAppError(error instanceof Error ? error.message : 'Could not open this opportunity dossier.'); } };
  const handleMarkAllNotificationsRead = async () => { try { setAppError(''); await markAllNotificationsRead(); setNotifications((prev) => prev.map((n) => ({ ...n, unread: false }))); } catch (error) { setAppError(error instanceof Error ? error.message : 'Could not mark notifications as read.'); } };
  const handleSelectNotification = async (notif: AppNotification) => { try { setAppError(''); if (notif.unread) { if (!notif.id.startsWith('deadline-')) await markNotificationRead(notif.id); setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, unread: false } : n)); } if (notif.actionScreen === 'detail' && notif.actionId) handleSelectOpportunityById(notif.actionId); else if (notif.actionScreen) await navigate(notif.actionScreen as AppScreen); } catch (error) { setAppError(error instanceof Error ? error.message : 'Could not update notification.'); } };
  const handleProfileSave = async (updated: UserProfile) => { try { setAppError(''); await saveUserProfile(updated); setProfile(updated); await Promise.all([loadOpportunities(updated), syncMyRoadmapWithProfile(updated)]); } catch (error) { setAppError(error instanceof Error ? error.message : 'Could not save your profile.'); } };
  const handleOnboardingComplete = async (updated: UserProfile) => { try { setAppError(''); await saveUserProfile(updated); setProfile(updated); await loadUserData(); await Promise.all([loadOpportunities(updated), syncMyRoadmapWithProfile(updated)]); setCurrentScreen('home'); } catch (error) { setAppError(error instanceof Error ? error.message : 'Could not save your profile.'); } };
  const handleSignOut = useCallback(async () => { setAppError(''); const { error } = await signOut(); if (error) setAppError(error.message); }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const showBottomNav = ['home', 'explore', 'roadmap', 'applications', 'profile'].includes(currentScreen);
  const showTopHeader = ['home', 'roadmap', 'explore'].includes(currentScreen);
  if (authLoading) return <div className="min-h-screen bg-[#0A0A0A] text-[#F5F2ED] flex items-center justify-center"><div className="text-center"><div className="text-xs uppercase tracking-[0.3em] text-white/40">NextMarga</div><div className="mt-3 text-sm text-white/60">Preparing your opportunity path...</div></div></div>;

  return <div className="min-h-screen bg-[#0A0A0A] text-[#F5F2ED] flex flex-col font-sans selection:bg-white/20 selection:text-white">
    {showTopHeader && <TopHeader profile={profile} userEmail={userEmail} unreadNotificationsCount={unreadCount} onNavigate={(scr) => void navigate(scr)} />}
    {appError && <div className="mx-auto w-full max-w-xl px-5 pt-4"><div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-xs text-red-200">{appError}</div></div>}
    <main className="flex-1"><Suspense fallback={<ScreenLoader />}>
      {currentScreen === 'landing' && <LandingScreen onNavigate={(scr) => void navigate(scr)} onStartOnboarding={() => setCurrentScreen('auth')} />}
      {currentScreen === 'auth' && <AuthScreen onBack={() => setCurrentScreen('landing')} onAuthenticated={() => void loadAuthenticatedUser()} />}
      {currentScreen === 'onboarding' && <OnboardingWizard initialProfile={profile} onComplete={handleOnboardingComplete} onCancel={() => void navigate('home')} />}
      {currentScreen === 'home' && <HomeScreen profile={profile} opportunities={opportunities} opportunitiesLoading={opportunitiesLoading} onSelectOpportunity={handleSelectOpportunity} savedOpportunityIds={savedOpportunityIds} onToggleSave={handleToggleSaveOpportunity} onNavigate={(scr) => void navigate(scr)} />}
      {currentScreen === 'detail' && <OpportunityDetailScreen opportunity={selectedOpportunity} isSaved={savedOpportunityIds.includes(selectedOpportunity.id)} onBack={() => void navigate('explore')} onToggleSave={() => void handleToggleSaveOpportunity(selectedOpportunity.id)} onApply={handleApplyOpportunity} onStartAssessment={() => void navigate('assessment')} />}
      {currentScreen === 'roadmap' && <RoadmapScreen profile={profile} onNavigate={(scr) => void navigate(scr)} />}
      {currentScreen === 'explore' && <OpportunityHub opportunities={opportunities} savedOpportunityIds={savedOpportunityIds} opportunitiesLoading={opportunitiesLoading} onSelectOpportunity={handleSelectOpportunity} onToggleSave={handleToggleSaveOpportunity} />}
      {currentScreen === 'applications' && <ApplicationsScreen applications={applications} onNavigate={(scr) => void navigate(scr)} onStartAssessment={() => void navigate('assessment')} onUpdateStatus={(id, status) => void handleUpdateApplicationStatus(id, status)} onInspectOpportunity={(id) => void handleInspectApplication(id)} />}
      {currentScreen === 'assessment' && <AssessmentScreen profile={profile} onExit={() => void navigate('applications')} />}
      {currentScreen === 'notifications' && <NotificationsScreen notifications={notifications} onBack={() => void navigate('home')} onSelectNotification={handleSelectNotification} onMarkAllRead={() => void handleMarkAllNotificationsRead()} />}
      {currentScreen === 'profile' && <ProfileScreen profile={profile} onBack={() => void navigate('home')} onSave={handleProfileSave} onStartOnboarding={() => setCurrentScreen('onboarding')} />}
      {currentScreen === 'settings' && <SettingsScreen onBack={() => void navigate('home')} onNavigate={(scr) => void navigate(scr)} onSignOut={() => void handleSignOut()} />}
      {currentScreen === 'legal-privacy' && <LegalScreen page="privacy" onBack={() => void navigate('home')} onNavigate={(scr) => void navigate(scr)} />}
      {currentScreen === 'legal-terms' && <LegalScreen page="terms" onBack={() => void navigate('home')} onNavigate={(scr) => void navigate(scr)} />}
      {currentScreen === 'legal-verification' && <LegalScreen page="verification" onBack={() => void navigate('home')} onNavigate={(scr) => void navigate(scr)} />}
      {currentScreen === 'support' && <LegalScreen page="support" onBack={() => void navigate('home')} onNavigate={(scr) => void navigate(scr)} />}
    </Suspense></main>
    {showBottomNav && <BottomNav currentScreen={currentScreen} onNavigate={(scr) => void navigate(scr)} />}
  </div>;
}

export default App;
