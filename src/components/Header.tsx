import { PawLogo } from './PawLogo';
import { Pet } from '../types';
import {
  Flame,
  Settings,
} from 'lucide-react';

interface HeaderProps {
  pets: Record<string, Pet>;
  activePet: Pet;
  streakDays: number;
  isSyncing: boolean;
  isOnline: boolean;
  onSelectPet: (petId: string) => void;
  onOpenAddPet: () => void;
  onOpenEmergency: () => void;
  onOpenSyncModal: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  isTutorialActive?: boolean;
}

export function Header({
  streakDays,
  onOpenSettings,
  isTutorialActive = false,
}: HeaderProps) {
  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-orange-200/60 shadow-[0_1px_8px_rgba(255,107,74,0.04)] transition-all duration-300 ${
        isTutorialActive ? 'opacity-35 brightness-75 pointer-events-none' : ''
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="h-16 px-3 sm:px-4 max-w-lg mx-auto flex items-center justify-between gap-1.5">
        {/* Left: Brand name & Logo */}
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="cursor-pointer flex items-center shrink-0">
            <PawLogo className="w-11 h-11 text-[var(--primary)]" />
          </div>
          <span className="font-heading font-black text-sm sm:text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-amber-500">
            PAWdiCURE
          </span>
        </div>

        {/* Right: Streak & Settings */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Streak badge */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50/80 border border-amber-200/60 text-amber-800 text-xs font-bold shadow-[0_2px_8px_-2px_rgba(245,158,11,0.15)]"
            title="Active daily care streak"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{streakDays}d</span>
          </div>

          {/* Settings button */}
          <button
            id="header-settings-btn"
            type="button"
            onClick={onOpenSettings}
            className="w-9 h-9 flex items-center justify-center rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-200/80 text-[var(--primary)] transition-all cursor-pointer shadow-2xs"
            title="App Settings & Guide"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
