import { Home, Utensils, Activity, Heart, Gift, PawPrint, Award } from 'lucide-react';

export type NavTab = 'home' | 'feed' | 'health' | 'bond' | 'rewards' | 'badges';

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
    { id: 'badges' as const, label: 'Badges', icon: Award },
    { id: 'care' as const, label: 'Care', icon: null }, // Central Action
    { id: 'health' as const, label: 'Stats', icon: Activity },
    { id: 'bond' as const, label: 'Relationship', icon: Heart },
    { id: 'rewards' as const, label: 'Rewards', icon: Gift },
  ];

  return (
    <nav
      id="bottom-nav-bar"
      className="fixed left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-md md:max-w-lg z-40 bg-white/95 backdrop-blur-xl border border-orange-100/80 shadow-[0_12px_32px_rgba(255,107,74,0.12)] rounded-2xl h-18 flex items-center px-1 py-1"
      style={{ bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="relative w-full h-full grid grid-cols-7 items-center justify-items-center">
        {tabs.map((tab) => {
          if (tab.id === 'care') {
            return (
              <div
                key="center-care-action"
                className="relative flex flex-col items-center justify-center w-full h-full"
              >
                {/* Elevated Central Paw Button */}
                <button
                  id="nav-tab-care"
                  type="button"
                  onClick={onOpenQuickCare}
                  aria-label="Open Care"
                  className="absolute -top-7 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#ff6b4a] to-[#d94f2d] text-white shadow-[0_8px_20px_rgba(255,107,74,0.35),0_3px_8px_rgba(255,107,74,0.15)] flex items-center justify-center border-3 border-white ring-2 ring-orange-100 z-50 group cursor-pointer"
                >
                  <PawPrint
                    className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-white"
                    fill="currentColor"
                  />
                </button>
                
                {/* Spacing alignment for text label under floating button */}
                <div className="h-5 sm:h-6" />
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-2.5 pointer-events-none select-none">
                  Care
                </span>
              </div>
            );
          }

          const isActive = currentTab === tab.id;
          const Icon = tab.icon!;

          return (
            <button
              id={`nav-tab-${tab.id}`}
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id as NavTab)}
              className="flex flex-col items-center justify-center w-full h-full py-1.5 relative group select-none cursor-pointer"
            >
              {/* Static background pill */}
              {isActive && (
                <div className="absolute inset-x-1 sm:inset-x-1.5 top-1 bottom-6 rounded-xl bg-orange-50/80 -z-10" />
              )}

              {/* Icon Container */}
              <div
                className={`p-1 flex items-center justify-center rounded-lg ${
                  isActive ? 'text-[#ff6b4a]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                <Icon
                  className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${
                    isActive ? 'stroke-[2.5px]' : 'stroke-2'
                  }`}
                />
              </div>

              {/* Text labels */}
              <span
                className={`text-[9px] sm:text-[10px] whitespace-nowrap mt-1 leading-none tracking-tight ${
                  isActive
                    ? 'text-[#ff6b4a] font-extrabold'
                    : 'text-slate-400 font-medium group-hover:text-slate-600'
                }`}
              >
                {tab.label}
              </span>

              {/* Indicator Dot */}
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-[#ff6b4a] absolute bottom-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
