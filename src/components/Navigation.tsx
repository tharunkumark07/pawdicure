import { Home, Utensils, Activity, Heart, Gift, PawPrint, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { triggerHaptic } from '../lib/haptics';
import { TapButton } from './ui/TapButton';

export type NavTab = 'home' | 'feed' | 'biometry' | 'health' | 'bond' | 'rewards';

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
    { id: 'biometry' as const, label: 'Biometry', icon: Cpu },
    { id: 'care' as const, label: 'Care', icon: null }, // Central Action
    { id: 'health' as const, label: 'Stats', icon: Activity },
    { id: 'bond' as const, label: 'Relationship', icon: Heart },
    { id: 'rewards' as const, label: 'Rewards', icon: Gift },
  ];

  return (
    <nav
      id="bottom-nav-bar"
      className="fixed left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-md md:max-w-lg z-40 bg-[var(--background)]/85 backdrop-blur-2xl backdrop-saturate-200 border border-[var(--primary)]/25 shadow-[0_16px_40px_rgba(var(--primary-rgb),0.15),inset_0_1px_0_rgba(255,255,255,0.4)] rounded-3xl h-20 flex items-center px-2 py-1.5"
      style={{ bottom: 'calc(14px + env(safe-area-inset-bottom, 0px))' }}
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
                <TapButton
                  id="nav-tab-care"
                  scale={0.92}
                  onClick={() => {
                    triggerHaptic('medium');
                    onOpenQuickCare();
                  }}
                  aria-label="Open Care"
                  className="absolute -top-8 w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-[var(--primary)] text-white shadow-[0_10px_24px_rgba(var(--primary-rgb),0.4),0_4px_10px_rgba(var(--primary-rgb),0.2)] flex items-center justify-center border-3 border-white ring-4 ring-[var(--primary)]/15 z-10 cursor-pointer active:scale-95 transition-transform"
                >
                  <PawPrint
                    className="w-6 h-6 sm:w-6.5 sm:h-6.5 text-white"
                    fill="currentColor"
                  />
                </TapButton>
                
                <div className="h-5 sm:h-6" />
                <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mt-2.5 pointer-events-none select-none">
                  Care
                </span>
              </div>
            );
          }

          const isActive = currentTab === tab.id;
          const Icon = tab.icon!;

          return (
            <TapButton
              id={`nav-tab-${tab.id}`}
              key={tab.id}
              scale={0.92}
              onClick={() => {
                triggerHaptic('light');
                onSelectTab(tab.id as NavTab);
              }}
              className="flex flex-col items-center justify-center w-full h-full py-1.5 relative select-none cursor-pointer group"
            >
              {/* Unified iOS Glass Indicator with Shared layoutId */}
              {isActive && (
                <motion.div
                  layoutId="unified-nav-indicator"
                  transition={{
                    type: 'spring',
                    stiffness: 350,
                    damping: 28,
                    mass: 0.7,
                  }}
                  className="absolute inset-0.5 rounded-2xl bg-[var(--primary)]/15 backdrop-blur-xl backdrop-saturate-200 border border-[var(--primary)]/35 shadow-[0_6px_20px_rgba(var(--primary-rgb),0.22),inset_0_1px_1px_rgba(255,255,255,0.8)] -z-10 pointer-events-none"
                />
              )}

              {/* Icon Container */}
              <div
                className={`p-1 flex items-center justify-center rounded-xl transition-colors duration-200 ${
                  isActive ? 'text-[var(--primary)]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                <Icon
                  className={`w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform duration-200 ${
                    isActive ? 'stroke-[2.5px] scale-105' : 'stroke-[1.8px]'
                  }`}
                />
              </div>

              {/* Text label */}
              <span
                className={`text-[9px] sm:text-[10px] whitespace-nowrap mt-0.5 leading-none tracking-tight transition-all duration-200 ${
                  isActive
                    ? 'text-[var(--primary)] font-extrabold'
                    : 'text-slate-400 font-medium group-hover:text-slate-600'
                }`}
              >
                {tab.label}
              </span>
            </TapButton>
          );
        })}
      </div>
    </nav>
  );
}
