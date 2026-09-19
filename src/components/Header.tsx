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
        className={`sticky top-0 z-40 w-full bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--primary)]/20 shadow-[0_1px_8px_rgba(var(--primary-rgb),0.04)] transition-all duration-300 ${
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
            <span className="font-heading font-black text-sm sm:text-base tracking-tight text-[var(--primary)]">
              PAWdiCURE
            </span>
          </div>

          {/* Right: Streak & Settings */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Streak badge */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold shadow-[0_2px_8px_-2px_rgba(var(--primary-rgb),0.1)]"
              title="Active daily care streak"
            >
              <Flame className="w-3.5 h-3.5 text-[var(--primary)] fill-[var(--primary)]/50" />
              <span>{streakDays}d</span>
            </div>

            {/* Settings button */}
            <button
              id="header-settings-btn"
              type="button"
              onClick={onOpenSettings}
              className="w-9 h-9 flex items-center justify-center rounded-2xl bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 border border-[var(--primary)]/20 text-[var(--primary)] transition-all cursor-pointer shadow-2xs"
              title="App Settings & Guide"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
  );
}
