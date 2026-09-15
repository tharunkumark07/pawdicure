import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { QuickCareSheet } from './components/QuickCareSheet';
import { AddMemoryModal } from './components/AddMemoryModal';
import { EmergencyModal } from './components/EmergencyModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { AddPetModal } from './components/AddPetModal';
import { PillarDetailModal } from './components/PillarDetailModal';
import { ProfileModal } from './components/ProfileModal';
import { NotificationsModal } from './components/NotificationsModal';
import { DynamicPetBackground } from './components/DynamicPetBackground';
import { PushNotificationBanner } from './components/PushNotificationBanner';

// Views
import { HomeView } from './views/HomeView';
import { FeedView } from './views/FeedView';
import { BondView } from './views/BondView';

// Dedicated Full Functional Pages
import { HealthView } from './pages/HealthView';
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
  } = useApp();

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
  const [inspectedPillar, setInspectedPillar] = useState<AffinityPillar | null>(null);

  // One-time login / entrance animation state
  // Check if the user has previously logged in/setup on this device
  const [showSplashAndAuth, setShowSplashAndAuth] = useState<boolean>(() => {
    const isCompleted = localStorage.getItem('PAWdiCURE_AUTH_COMPLETED_V1');
    return !isCompleted;
  });

  // Derive current active bottom tab from currentRoute
  const getActiveTab = (): NavTab => {
    if (currentRoute === '/feed') return 'feed';
    if (currentRoute === '/badges') return 'badges';
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
      case 'badges':
        navigate('/badges');
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

    // Search in vaccines
    (householdData.vaccines || []).forEach((v) => {
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
    action: 'feed' | 'walk' | 'med' | 'memory' | 'play' | 'health'
  ) => {
    setIsQuickCareOpen(false);
    if (action === 'feed') {
      navigate('/feed');
    } else if (action === 'walk') {
      addXp(30, 'Completed 25m energetic walk loop');
      showToast('Walk completed! (+30 XP)', 'success', '🏃');
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
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold shrink-0"
            >
              Bond Hub
            </button>
            <button
              type="button"
              onClick={() => navigate('/relationship/roadmap')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 shrink-0"
            >
              Roadmap 🗺️
            </button>
            <button
              type="button"
              onClick={() => navigate('/badges')}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-300 text-[#ae3115] text-xs font-bold hover:bg-amber-100/50 shrink-0 flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Digital Badges 🏅</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/relationship/levels')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 shrink-0"
            >
              All Tiers 🏆
            </button>
            <button
              type="button"
              onClick={() => navigate('/memories')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 shrink-0"
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

    if (currentRoute === '/pet-profile') {
      return <PetProfileView />;
    }

    if (currentRoute === '/notifications') {
      return <NotificationsView />;
    }

    if (currentRoute === '/badges') {
      return <BadgesView />;
    }

    if (currentRoute === '/settings') {
      return <SettingsView />;
    }

    if (currentRoute === '/onboarding') {
      return <OnboardingView />;
    }

    // Default: HomeView with full interactive quick routing
    return (
      <div className="space-y-4">
        {/* Quick Route Shortcuts Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => navigate('/badges')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ff6b4a]/10 border border-orange-300 text-[#ae3115] text-xs font-bold shadow-2xs hover:bg-orange-100/60 transition shrink-0"
          >
            <Award className="w-3.5 h-3.5 text-[#ff6b4a]" />
            <span>Digital Badges 🏅</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/stats')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs hover:bg-orange-50 hover:border-orange-200 hover:text-[#ae3115] transition shrink-0"
          >
            <Activity className="w-3.5 h-3.5 text-[#ff6b4a]" />
            <span>Biometrics &amp; Telemetry</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/reminders')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs hover:bg-orange-50 hover:border-orange-200 hover:text-[#ae3115] transition shrink-0"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Care Reminders</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/ai-assistant')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs hover:bg-orange-50 hover:border-orange-200 hover:text-[#ae3115] transition shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>AI Pet Concierge</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs hover:bg-orange-50 hover:border-orange-200 hover:text-[#ae3115] transition shrink-0"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-500" />
            <span>Parks &amp; Places</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/family')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs hover:bg-orange-50 hover:border-orange-200 hover:text-[#ae3115] transition shrink-0"
          >
            <Users className="w-3.5 h-3.5 text-purple-500" />
            <span>Household Sync</span>
          </button>
        </div>

        <HomeView
          pet={activePet}
          tasks={(householdData.routineTasks || []).filter((t) => !t.petId || t.petId === activePet.id)}
          streakDays={householdData.streakDays}
          lastCheckInDate={householdData.lastCheckInDate}
          onDailyCheckIn={performDailyCheckIn}
          onNavigate={(tab) => handleSelectTab(tab)}
          onToggleTask={(tId) => toggleTask(tId)}
          onLogExercise={() => {
            triggerConfetti();
            addXp(30, 'Completed 20m agility loop');
            showToast('Activity logged! (+30 XP) 🏃✨', 'success', '🎉');
          }}
          onOpenAi={() => navigate('/ai-assistant')}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] flex flex-col items-center justify-start text-[#2c1810]">
      {showSplashAndAuth && (
        <SplashAndAuth onComplete={() => setShowSplashAndAuth(false)} />
      )}

      <div
        id="app-mobile-shell"
        className="w-full max-w-md md:max-w-lg min-h-screen bg-[#fffaf5] flex flex-col relative shadow-2xl border-x border-orange-200/50 overflow-hidden"
        style={{ paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Dynamic Route-Specific Background with Interactive Pets & Ambient Light */}
        <DynamicPetBackground route={currentRoute} />

        {/* Global Top Header */}
        <div className="relative z-50">
          <Header
            pets={householdData.pets}
            activePet={activePet}
            streakDays={householdData.streakDays}
            isSyncing={isSyncing}
            isOnline={isOnline}
            onSelectPet={(petId) => setActivePetId(petId)}
            onOpenAddPet={() => setIsAddPetOpen(true)}
            onOpenEmergency={() => navigate('/emergency')}
            onOpenSyncModal={() => setIsCloudSyncOpen(true)}
            onOpenNotifications={() => navigate('/notifications')}
            onOpenProfile={() => navigate('/pet-profile')}
          />
        </div>

        {/* Native Push Notification Request & Care Alert Banner */}
        <div className="relative z-10">
          <PushNotificationBanner petName={activePet.name} />
        </div>

        {/* Global Interactive Search Bar */}
        <div className="relative z-20 px-3 sm:px-4 pt-2 pb-1">
          <div className="relative">
            <Search className="w-4 h-4 text-orange-400 absolute left-3.5 top-3" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={`Search ${activePet.name}'s vaccines, meds, places, store...`}
              className="w-full pl-10 pr-9 py-2.5 bg-white/90 backdrop-blur-xs rounded-2xl border border-orange-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#ff6b4a] focus:ring-2 focus:ring-orange-200 shadow-2xs transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Live Search Results Drawer */}
          {searchResults.length > 0 && (
            <div className="mt-2 p-2 bg-white rounded-2xl shadow-xl border border-slate-100 text-xs z-40 animate-in fade-in">
              {searchResults.map((res, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    navigate(res.route);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="w-full p-2 rounded-xl hover:bg-orange-50/70 text-left flex items-center justify-between border-b border-slate-50 last:border-none transition"
                >
                  <div>
                    <div className="font-bold text-slate-900">{res.title}</div>
                    <div className="text-[10px] text-slate-500">{res.sub}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#ff6b4a]" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 px-3 sm:px-4 pt-6 pb-4 flex flex-col items-center justify-start w-full">
          <div className="w-full flex flex-col items-stretch">
            {renderCurrentView()}
          </div>
        </main>

        {/* Persistent Bottom Navigation */}
        <Navigation
          currentTab={getActiveTab()}
          onSelectTab={handleSelectTab}
          onOpenQuickCare={() => setIsQuickCareOpen(true)}
        />

        {/* Global Toast Stack */}
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="animate-in fade-in slide-in-from-top-4 duration-200"
            >
              <div
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-xs font-semibold shadow-xl border backdrop-blur-md pointer-events-auto ${
                  t.type === 'error'
                    ? 'bg-red-900/90 border-red-800'
                    : t.type === 'warning'
                    ? 'bg-amber-900/90 border-amber-800'
                    : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                <span>{t.icon || '✨'}</span>
                <span>{t.title}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Global Modals & Drawers */}
        <QuickCareSheet
          isOpen={isQuickCareOpen}
          activePet={activePet}
          onClose={() => setIsQuickCareOpen(false)}
          onQuickAction={handleQuickCareAction}
        />

        <AddMemoryModal
          isOpen={isAddMemoryOpen}
          petName={activePet.name}
          onClose={() => setIsAddMemoryOpen(false)}
          onSave={handleSaveMemory}
        />

        <EmergencyModal
          isOpen={isEmergencyOpen}
          pet={activePet}
          onClose={() => setIsEmergencyOpen(false)}
        />

        <CloudSyncModal
          isOpen={isCloudSyncOpen}
          householdData={householdData}
          isOnline={isOnline}
          isSyncing={isSyncing}
          onClose={() => setIsCloudSyncOpen(false)}
          onDataUpdated={() => {
            showToast('Household data synced from cloud!', 'success');
          }}
          onShowToast={(msg, icon) => showToast(msg, 'info', icon)}
        />

        <AddPetModal
          isOpen={isAddPetOpen}
          onClose={() => setIsAddPetOpen(false)}
          onAddPet={(newPet) => {
            addPet(newPet);
          }}
        />

        <PillarDetailModal
          pillar={inspectedPillar}
          petName={activePet.name}
          onClose={() => setInspectedPillar(null)}
          onBoostPillar={(pId) => boostPillar(pId)}
        />

        <ProfileModal
          isOpen={isProfileOpen}
          activePet={activePet}
          householdData={householdData}
          onClose={() => setIsProfileOpen(false)}
          onOpenSync={() => setIsCloudSyncOpen(true)}
          onOpenAddPet={() => setIsAddPetOpen(true)}
        />

        <NotificationsModal
          isOpen={false}
          onClose={() => {}}
          onNavigate={(tab) => handleSelectTab(tab as NavTab)}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
