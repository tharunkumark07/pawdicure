import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { RadialQuickCare } from './components/RadialQuickCare';
import { AddMemoryModal } from './components/AddMemoryModal';
import { EmergencyModal } from './components/EmergencyModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { AddPetModal } from './components/AddPetModal';
import { PillarDetailModal } from './components/PillarDetailModal';
import { ProfileModal } from './components/ProfileModal';
import { NotificationsModal } from './components/NotificationsModal';
import { SettingsModal } from './components/SettingsModal';
import { DynamicPetBackground } from './components/DynamicPetBackground';
import { PushNotificationBanner } from './components/PushNotificationBanner';
import { PetGuide } from './components/pet-guide/PetGuide';
import { usePetGuide } from './hooks/usePetGuide';
import { WelcomeAnimation } from './components/WelcomeAnimation';
import { PAWdiCURELoading } from './components/PAWdiCURELoading';

// Views
import { HomeView } from './views/HomeView';
import { FeedView } from './views/FeedView';
import { BondView } from './views/BondView';
import { BiometryView } from './views/BiometryView';

// Dedicated Full Functional Pages
import { HealthView } from './pages/HealthView';
import { NearbyCareView } from './pages/NearbyCareView';
import { RemindersView } from './pages/RemindersView';
import { EmergencyView } from './pages/EmergencyView';
import { AIAssistantView } from './pages/AIAssistantView';
import { ExploreView } from './pages/ExploreView';
import { FamilyCareView } from './pages/FamilyCareView';
import { StatsView } from './pages/StatsView';
import { RelationshipRoadmapView } from './pages/RelationshipRoadmapView';
import { RelationshipLevelsView } from './pages/RelationshipLevelsView';
import { MemoriesView } from './pages/MemoriesView';
import { RewardsView } from './pages/RewardsView';
import { StoreView } from './pages/StoreView';
import { ProductDetailsView } from './pages/ProductDetailsView';
import { CartView } from './pages/CartView';
import { WishlistView } from './pages/WishlistView';
import { PetProfileView } from './pages/PetProfileView';
import { NotificationsView } from './pages/NotificationsView';
import { SettingsView } from './pages/SettingsView';
import { OnboardingView } from './pages/OnboardingView';
import { BadgesView } from './pages/BadgesView';
import { VaccinePassportView } from './pages/VaccinePassportView';
import { RoutinesView } from './pages/RoutinesView';

import { AffinityPillar } from './types';
import { SplashAndAuth } from './components/SplashAndAuth';
import {
  Search,
  X,
  ArrowRight,
  Activity,
  Calendar,
  Sparkles,
  MapPin,
  Users,
  Compass,
  Award,
} from 'lucide-react';

function AppContent() {
  const {
    householdData,
    activePet,
    currentRoute,
    routeParams,
    navigate,
    isSyncing,
    isOnline,
    toasts,
    showToast,
    triggerConfetti,
    setActivePetId,
    addPet,
    feedPet,
    refreshWater,
    orderFoodRefill,
    toggleTask,
    boostPillar,
    addXp,
    addMemory,
    toggleMedication,
    performDailyCheckIn,
    isPushEnabled,
    pushPermissionStatus,
    registerPushNotifications,
    triggerTestPushNotification,
    currentTheme,
    setCurrentTheme,
    isAuthenticated,
    authLoading,
    currentUser,
    onboardingCompleted,
  } = useApp();

  const {
    isVisible,
    currentStep,
    totalSteps,
    step,
    handleNext,
    handleBack,
    handleSkip,
    restartGuide,
    characterId,
    setCharacterId,
  } = usePetGuide();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    Array<{ title: string; sub: string; route: string }>
  >([]);

  // Modals state
  const [isQuickCareOpen, setIsQuickCareOpen] = useState(false);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState(false);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [inspectedPillar, setInspectedPillar] = useState<AffinityPillar | null>(null);

  // One-time login / entrance animation state
  const [showAnimation, setShowAnimation] = useState(false);
  const [showSplashAndAuth, setShowSplashAndAuth] = useState<boolean>(() => {
    const isCompleted = localStorage.getItem('PAWdiCURE_AUTH_COMPLETED_V1');
    return !isCompleted;
  });

  // Welcome animation trigger (runs exactly when transitioning into the authenticated app)
  useEffect(() => {
    if (isAuthenticated && onboardingCompleted && !showSplashAndAuth && !authLoading) {
      const hasBeenOpened = sessionStorage.getItem('PAWdiCURE_WELCOME_PLAYED');
      if (!hasBeenOpened) {
        setShowAnimation(true);
        sessionStorage.setItem('PAWdiCURE_WELCOME_PLAYED', 'true');
      }
    }
  }, [isAuthenticated, onboardingCompleted, showSplashAndAuth, authLoading]);

  // Synchronize authentication view display with auth state & route
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || currentRoute === '/auth') {
        setShowSplashAndAuth(true);
      } else {
        setShowSplashAndAuth(false);
      }
    }
  }, [isAuthenticated, authLoading, currentRoute]);

  // Centralized Route Guard: Ensures users are routed to /auth, /onboarding, or /home correctly
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !currentUser) {
      if (currentRoute !== '/auth') {
        navigate('/auth', { replace: true });
      }
    } else if (!onboardingCompleted && !currentUser.isAnonymous) {
      if (currentRoute !== '/onboarding') {
        navigate('/onboarding', { replace: true });
      }
    } else if (isAuthenticated && (onboardingCompleted || currentUser.isAnonymous)) {
      if (currentRoute === '/auth' || currentRoute === '/onboarding') {
        navigate('/home', { replace: true });
      }
    }
  }, [isAuthenticated, onboardingCompleted, authLoading, currentRoute, currentUser]);

  // Page Transition Skeleton State for UI stability during navigation
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [activeViewRoute, setActiveViewRoute] = useState(currentRoute);

  useEffect(() => {
    if (currentRoute !== activeViewRoute) {
      setIsPageTransitioning(true);
      const timer = setTimeout(() => {
        setActiveViewRoute(currentRoute);
        setIsPageTransitioning(false);
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [currentRoute, activeViewRoute]);

  // Derive current active bottom tab from currentRoute
  const getActiveTab = (): NavTab => {
    if (currentRoute === '/feed') return 'feed';
    if (currentRoute === '/biometry' || currentRoute === '/health/biometry') return 'biometry';
    if (
      currentRoute.startsWith('/health') ||
      currentRoute === '/stats' ||
      currentRoute === '/reminders' ||
      currentRoute === '/ai-assistant'
    )
      return 'health';
    if (
      currentRoute.startsWith('/relationship') ||
      currentRoute === '/bond' ||
      currentRoute === '/memories' ||
      currentRoute === '/family'
    )
      return 'bond';
    if (
      currentRoute.startsWith('/rewards') ||
      currentRoute.startsWith('/store')
    )
      return 'rewards';
    return 'home';
  };

  const handleSelectTab = (tab: NavTab) => {
    switch (tab) {
      case 'home':
        navigate('/home');
        break;
      case 'feed':
        navigate('/feed');
        break;
      case 'biometry':
        navigate('/biometry');
        break;
      case 'health':
        navigate('/health');
        break;
      case 'bond':
        navigate('/relationship');
        break;
      case 'rewards':
        navigate('/rewards');
        break;
    }
  };

  // Search handler matching records and catalog
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const q = query.toLowerCase().trim();
    if (!q) {
      setSearchResults([]);
      return;
    }

    const matches: Array<{ title: string; sub: string; route: string }> = [];

    // Search in vaccine history
    (householdData.vaccinationHistory || []).forEach((v) => {
      if (v.name.toLowerCase().includes(q) || v.status.toLowerCase().includes(q)) {
        matches.push({
          title: v.name,
          sub: `Vaccine • ${v.status}`,
          route: '/health',
        });
      }
    });

    // Search in medications
    (householdData.medications || []).forEach((m) => {
      if (m.name.toLowerCase().includes(q) || m.dose.toLowerCase().includes(q)) {
        matches.push({
          title: m.name,
          sub: `Medication • ${m.dose}`,
          route: '/health',
        });
      }
    });

    // Search in reminders
    (householdData.reminders || []).forEach((r) => {
      if (r.title.toLowerCase().includes(q)) {
        matches.push({
          title: r.title,
          sub: `Reminder • ${r.time} ${r.repeat}`,
          route: '/reminders',
        });
      }
    });

    // Search in memories
    (householdData.memories || []).forEach((m) => {
      if (m.title.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q)) {
        matches.push({
          title: m.title,
          sub: `Memory • ${m.date}`,
          route: '/memories',
        });
      }
    });

    // Search in store products
    if (
      q.includes('food') ||
      q.includes('salmon') ||
      q.includes('kibble') ||
      q.includes('bed') ||
      q.includes('leash') ||
      q.includes('treat') ||
      q.includes('toy')
    ) {
      matches.push({
        title: 'Pet Nutrition & Care Essentials',
        sub: 'PAWdiCURE Veterinary Store',
        route: '/store',
      });
    }

    // Search places
    if (q.includes('park') || q.includes('clinic') || q.includes('vet') || q.includes('cafe')) {
      matches.push({
        title: 'Pet-Friendly Parks & Vets',
        sub: 'Explore Local Map Directory',
        route: '/explore',
      });
    }

    setSearchResults(matches);
  };

  // Quick Action trigger from floating dock
  const handleQuickCareAction = (
    action: 'feed' | 'walk' | 'med' | 'memory' | 'play' | 'health' | 'water' | 'reminder' | 'routine'
  ) => {
    setIsQuickCareOpen(false);
    if (action === 'feed') {
      navigate('/feed');
    } else if (action === 'walk') {
      addXp(30, 'Completed 25m energetic walk loop');
      showToast('Walk completed! (+30 XP)', 'success', '🏃');
    } else if (action === 'routine') {
      navigate('/routines');
    } else if (action === 'med') {
      const pendingMed = (householdData.medications || []).find(
        (m) => !m.takenToday
      );
      if (pendingMed) {
        toggleMedication(pendingMed.id);
      } else {
        showToast('All daily medications up to date!', 'info', '💊');
      }
    } else if (action === 'memory') {
      setIsAddMemoryOpen(true);
    } else if (action === 'play') {
      addXp(25, 'Completed 15m agility tug & fetch');
      showToast('Playtime recorded! (+25 XP)', 'success', '🎾');
    } else if (action === 'health') {
      navigate('/health');
    } else if (action === 'reminder') {
      navigate('/reminders');
    }
  };

  const handleSaveMemory = (newMemory: any) => {
    addMemory(newMemory);
    setIsAddMemoryOpen(false);
  };

  // Render view based on route
  const renderCurrentView = () => {
    if (currentRoute === '/feed') {
      return (
        <FeedView
          pet={activePet}
          onFeedMeal={(g, t) => feedPet(g, t)}
          onRefreshWater={refreshWater}
          onOrderFoodRefill={orderFoodRefill}
        />
      );
    }

    if (currentRoute === '/stats') {
      return <StatsView />;
    }

    if (currentRoute === '/health/clinics') {
      return <NearbyCareView />;
    }

    if (currentRoute === '/health/passport') {
      return <VaccinePassportView />;
    }

    if (currentRoute === '/health/biometry' || currentRoute === '/biometry') {
      return <BiometryView pet={activePet} onShowToast={(msg, icon) => showToast(msg, 'success', icon)} />;
    }

    if (currentRoute.startsWith('/health')) {
      return <HealthView />;
    }

    if (currentRoute === '/reminders') {
      return <RemindersView />;
    }

    if (currentRoute === '/emergency') {
      return <EmergencyView />;
    }

    if (currentRoute === '/ai-assistant') {
      return <AIAssistantView />;
    }

    if (currentRoute === '/explore') {
      return <ExploreView />;
    }

    if (currentRoute === '/family') {
      return <FamilyCareView />;
    }

    if (currentRoute === '/relationship' || currentRoute === '/bond') {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => navigate('/relationship')}
              className="px-3 py-1.5 rounded-xl bg-[var(--text)] text-white text-xs font-bold shrink-0"
            >
              Bond Hub
            </button>
            <button
              type="button"
              onClick={() => navigate('/relationship/roadmap')}
              className="px-3 py-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text)] text-xs font-bold hover:bg-[var(--primary)]/5 shrink-0"
            >
              Roadmap 🗺️
            </button>
            <button
              type="button"
              onClick={() => navigate('/badges')}
              className="px-3 py-1.5 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--primary)] text-xs font-bold hover:bg-[var(--primary)]/20 shrink-0 flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Digital Badges 🏅</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/relationship/levels')}
              className="px-3 py-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text)] text-xs font-bold hover:bg-[var(--primary)]/5 shrink-0"
            >
              All Tiers 🏆
            </button>
            <button
              type="button"
              onClick={() => navigate('/memories')}
              className="px-3 py-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text)] text-xs font-bold hover:bg-[var(--primary)]/5 shrink-0"
            >
              Pet Journal 📖
            </button>
          </div>

          <BondView
            pet={activePet}
            memories={(householdData.memories || []).filter((m) => !m.petId || m.petId === activePet.id)}
            onOpenAddMemory={() => setIsAddMemoryOpen(true)}
            onInspectPillar={(pillarId) => {
              const found = (activePet.affinityPillars || []).find(
                (p) => p.id === pillarId
              );
              if (found) setInspectedPillar(found);
            }}
          />
        </div>
      );
    }

    if (currentRoute === '/relationship/roadmap') {
      return <RelationshipRoadmapView />;
    }

    if (currentRoute === '/relationship/levels') {
      return <RelationshipLevelsView />;
    }

    if (currentRoute === '/memories') {
      return <MemoriesView />;
    }

    if (currentRoute === '/rewards') {
      return <RewardsView />;
    }

    if (currentRoute === '/store') {
      return <StoreView />;
    }

    if (currentRoute.startsWith('/store/product/')) {
      const productId = currentRoute.replace('/store/product/', '');
      return <ProductDetailsView productId={productId} />;
    }

    if (currentRoute === '/store/cart') {
      return <CartView />;
    }

    if (currentRoute === '/store/wishlist') {
      return <WishlistView />;
    }

    if (currentRoute === '/pet-profile' || currentRoute.startsWith('/pets/')) {
      const routePetId = currentRoute.startsWith('/pets/') ? currentRoute.replace('/pets/', '') : null;
      return <PetProfileView routePetId={routePetId} />;
    }

    if (currentRoute === '/notifications') {
      return <NotificationsView />;
    }

    if (currentRoute === '/badges') {
      return <BadgesView />;
    }

    if (currentRoute === '/routines' || currentRoute.startsWith('/routine')) {
      return <RoutinesView />;
    }

    if (currentRoute === '/settings') {
      return <SettingsView />;
    }

    if (currentRoute === '/onboarding') {
      return <OnboardingView />;
    }

    if (currentRoute === '/auth') {
      return (
        <SplashAndAuth
          onComplete={() => {
            setShowSplashAndAuth(false);
            navigate('/home');
          }}
        />
      );
    }

    // Default: HomeView
    return (
      <HomeView
        pet={activePet}
        tasks={(householdData.routineTasks || []).filter((t) => !t.petId || t.petId === activePet.id)}
        streakDays={activePet.streakDays ?? householdData.streakDays ?? 5}
        lastCheckInDate={activePet.lastCheckInDate ?? householdData.lastCheckInDate}
        onDailyCheckIn={performDailyCheckIn}
        onNavigate={(route) => {
          if (['home', 'feed', 'health', 'bond', 'rewards', 'badges'].includes(route)) {
            handleSelectTab(route as NavTab);
          } else {
            navigate(route.startsWith('/') ? route : '/' + route);
          }
        }}
        onToggleTask={(tId) => toggleTask(tId)}
        onLogExercise={() => {
          triggerConfetti();
          addXp(30, 'Completed 20m agility loop');
          showToast('Activity logged! (+30 XP) 🏃✨', 'success', '🎉');
        }}
        memories={(householdData.memories || []).filter((m) => !m.petId || m.petId === activePet.id)}
      />
    );
  };

  if (authLoading) {
    return <PAWdiCURELoading fullscreen={true} route={currentRoute} />;
  }

  const showAppChrome = isAuthenticated && onboardingCompleted && !showSplashAndAuth && currentRoute !== '/auth' && currentRoute !== '/onboarding';

  return (
    <motion.div
      animate={{ 
        backgroundColor: 'var(--background)',
        color: 'var(--text)'
      }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="min-h-screen flex flex-col items-center justify-start"
    >
      {showAnimation && <WelcomeAnimation onComplete={() => setShowAnimation(false)} />}
      {isVisible && step && (
        <PetGuide 
          characterId={characterId}
          message={step.message}
          targetId={step.targetId}
          onNext={handleNext}
          onBack={handleBack}
          onSkip={handleSkip}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onToggleCharacter={() => setCharacterId((prev) => (prev === 'dog' ? 'cat' : 'dog'))}
        />
      )}

      {showSplashAndAuth && (
        <SplashAndAuth onComplete={() => setShowSplashAndAuth(false)} />
      )}

      <div
        id="app-mobile-shell"
        className="w-full max-w-md md:max-w-lg min-h-screen bg-transparent flex flex-col relative shadow-2xl border-x border-[var(--card-border)] overflow-hidden"
        style={{ paddingBottom: showAppChrome ? 'calc(96px + env(safe-area-inset-bottom, 0px))' : '0px' }}
      >
        {/* Dynamic Route-Specific Background with Interactive Pets & Ambient Light */}
        <DynamicPetBackground route={currentRoute} />

        {/* Global Top Header */}
        {showAppChrome && (
          <div className="relative z-50">
            <Header
              pets={householdData.pets}
              activePet={activePet}
              streakDays={activePet.streakDays ?? householdData.streakDays ?? 5}
              isSyncing={isSyncing}
              isOnline={isOnline}
              onSelectPet={(petId) => setActivePetId(petId)}
              onOpenAddPet={() => setIsAddPetOpen(true)}
              onOpenEmergency={() => navigate('/emergency')}
              onOpenSyncModal={() => setIsCloudSyncOpen(true)}
              onOpenNotifications={() => navigate('/notifications')}
              onOpenProfile={() => navigate('/pet-profile')}
              onOpenSettings={() => setIsSettingsOpen(true)}
              isTutorialActive={isVisible}
            />
          </div>
        )}

        {/* Native Push Notification Request & Care Alert Banner */}
        {showAppChrome && (
          <div className="relative z-10">
            <PushNotificationBanner petName={activePet.name} />
          </div>
        )}

        {/* Global Interactive Search Bar */}
        {showAppChrome && (
          <div className="relative z-20 px-3 sm:px-4 pt-2 pb-1">
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--primary)] absolute left-3.5 top-3" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={`Search ${activePet.name}'s vaccines, meds, places, store...`}
                className="w-full pl-10 pr-9 py-2.5 bg-[var(--card-bg)] backdrop-blur-xs rounded-2xl border border-[var(--card-border)] text-xs font-medium text-[var(--text)] placeholder:text-[var(--text-muted)] opacity-80 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 shadow-2xs transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Results Drawer */}
            {searchResults.length > 0 && (
              <div className="mt-2 p-2 bg-[var(--card-bg)] rounded-2xl shadow-xl border border-[var(--card-border)] text-xs z-40 animate-in fade-in">
                {searchResults.map((res, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      navigate(res.route);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="w-full p-2 rounded-xl hover:bg-[var(--primary)]/5 text-left flex items-center justify-between border-b border-[var(--primary)]/5 last:border-none transition"
                  >
                    <div>
                      <div className="font-bold text-[var(--text)]">{res.title}</div>
                      <div className="text-[10px] text-[var(--text-muted)] opacity-70">{res.sub}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--primary)]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Content Area with Subtle Skeleton Transition State */}
        <main className="relative z-10 flex-1 px-3 sm:px-4 pt-6 pb-4 flex flex-col items-center justify-start w-full min-h-[520px]">
          <div className="w-full flex flex-col items-stretch">
            <AnimatePresence mode="wait">
              {isPageTransitioning ? (
                <PAWdiCURELoading key={`loading-${currentRoute}`} route={currentRoute} fullscreen={false} />
              ) : (
                <motion.div
                  key={currentRoute}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 1 }}
                  className="w-full"
                >
                  {renderCurrentView()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Persistent Bottom Navigation */}
        {showAppChrome && (
          <Navigation
            currentTab={getActiveTab()}
            onSelectTab={handleSelectTab}
            onOpenQuickCare={() => setIsQuickCareOpen(true)}
          />
        )}

        {/* Global Toast Stack */}
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-1.5 pointer-events-none w-full max-w-[90%] sm:max-w-xs">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.92, transition: { duration: 0.18 } }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="pointer-events-auto w-full flex justify-center"
              >
                <div
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-xs font-semibold shadow-xl border backdrop-blur-md ${
                    t.type === 'error'
                      ? 'bg-red-950/95 border-red-800/50'
                      : t.type === 'warning'
                      ? 'bg-amber-950/95 border-amber-800/50'
                      : 'bg-slate-900/95 border-slate-800/60'
                  }`}
                >
                  <span className="shrink-0">{t.icon || '✨'}</span>
                  <span className="truncate max-w-[200px]">{t.title}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Global Modals & Drawers */}
        <RadialQuickCare
          isOpen={isQuickCareOpen}
          onClose={() => setIsQuickCareOpen(false)}
          onAction={handleQuickCareAction}
        />
        
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onRestartGuide={() => restartGuide()}
          onOpenSync={() => setIsCloudSyncOpen(true)}
          onOpenEmergency={() => navigate('/emergency')}
          onOpenNotifications={() => navigate('/notifications')}
          onOpenProfile={() => navigate('/pet-profile')}
          onOpenBadges={() => navigate('/badges')}
          characterId={characterId}
          currentTheme={currentTheme}
          onSelectTheme={(t) => setCurrentTheme(t)}
          isPushEnabled={isPushEnabled}
          pushPermissionStatus={pushPermissionStatus}
          onEnablePush={async () => { await registerPushNotifications(); }}
          onTestPush={async () => { await triggerTestPushNotification(); }}
          pets={householdData.pets}
          activePet={activePet}
          onSelectPet={(pId) => setActivePetId(pId)}
          onOpenAddPet={() => setIsAddPetOpen(true)}
        />
        
        <NotificationsModal
          isOpen={false}
          onClose={() => {}}
          onNavigate={(tab) => handleSelectTab(tab as NavTab)}
        />
      </div>
    </motion.div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
