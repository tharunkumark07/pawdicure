import { Home, Utensils, Activity, Sparkles, Gift } from 'lucide-react';
import { PawLogo } from './PawLogo';

export type NavTab = 'home' | 'feed' | 'health' | 'bond' | 'rewards';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenQuickCare: () => void;
}

export function Navigation({
  currentTab,
  onSelectTab,
  onOpenQuickCare,
}: NavigationProps) {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'feed' as const, label: 'Feed', icon: Utensils },
    { id: 'care' as const, label: 'Care', icon: null }, // Center Floating Button
    { id: 'health' as const, label: 'Health', icon: Activity },
    { id: 'bond' as const, label: 'Bond', icon: Sparkles },
    { id: 'rewards' as const, label: 'Rewards', icon: Gift },
  ];

  return (
    <nav
      id="bottom-nav-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-orange-200/60 shadow-[0_-4px_24px_rgba(255,107,74,0.06)]"
    >
      <div className="relative max-w-md md:max-w-lg mx-auto px-2 sm:px-4 h-16 flex items-center justify-between">
        {/* Tab 1: Home */}
        <button
          id="nav-tab-home"
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all duration-150 active:scale-95 ${
            currentTab === 'home'
              ? 'text-[#ff6b4a] font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${currentTab === 'home' ? 'bg-orange-50' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] leading-tight tracking-tight mt-0.5">Home</span>
        </button>

        {/* Tab 2: Feed */}
        <button
          id="nav-tab-feed"
          type="button"
          onClick={() => onSelectTab('feed')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all duration-150 active:scale-95 ${
            currentTab === 'feed'
              ? 'text-[#ff6b4a] font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${currentTab === 'feed' ? 'bg-orange-50' : ''}`}>
            <Utensils className="w-5 h-5" />
          </div>
          <span className="text-[10px] leading-tight tracking-tight mt-0.5">Feed</span>
        </button>

        {/* Center Floating Action Button: Quick Care */}
        <div className="flex-1 flex flex-col items-center justify-center relative -top-3 shrink-0">
          <button
            id="nav-center-care-btn"
            type="button"
            aria-label="Quick Care actions"
            onClick={onOpenQuickCare}
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-br from-[#ff6b4a] to-[#ae3115] text-white shadow-[0_6px_20px_-2px_rgba(255,107,74,0.55)] hover:shadow-[0_8px_24px_rgba(255,107,74,0.7)] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 border-2 border-white ring-2 ring-orange-200"
          >
            <div className="w-6 h-6 text-white flex items-center justify-center">
              <PawLogo className="w-6 h-6 text-white" variant="mark" />
            </div>
          </button>
          <span className="text-[10px] text-orange-950 font-bold leading-tight mt-0.5">Care</span>
        </div>

        {/* Tab 3: Health */}
        <button
          id="nav-tab-health"
          type="button"
          onClick={() => onSelectTab('health')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all duration-150 active:scale-95 ${
            currentTab === 'health'
              ? 'text-[#ff6b4a] font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${currentTab === 'health' ? 'bg-orange-50' : ''}`}>
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-[10px] leading-tight tracking-tight mt-0.5">Health</span>
        </button>

        {/* Tab 4: Bond */}
        <button
          id="nav-tab-bond"
          type="button"
          onClick={() => onSelectTab('bond')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all duration-150 active:scale-95 ${
            currentTab === 'bond'
              ? 'text-[#ff6b4a] font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${currentTab === 'bond' ? 'bg-orange-50' : ''}`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[10px] leading-tight tracking-tight mt-0.5">Bond</span>
        </button>

        {/* Tab 5: Rewards */}
        <button
          id="nav-tab-rewards"
          type="button"
          onClick={() => onSelectTab('rewards')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all duration-150 active:scale-95 ${
            currentTab === 'rewards'
              ? 'text-[#ff6b4a] font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${currentTab === 'rewards' ? 'bg-orange-50' : ''}`}>
            <Gift className="w-5 h-5" />
          </div>
          <span className="text-[10px] leading-tight tracking-tight mt-0.5">Rewards</span>
        </button>
      </div>
      <div className="h-[env(safe-area-inset-bottom,0px)] w-full" />
    </nav>
  );
}
