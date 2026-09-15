import { useState } from 'react';
import { PawLogo } from './PawLogo';
import { Pet } from '../types';
import {
  ChevronDown,
  Flame,
  Bell,
  Cloud,
  CheckCircle2,
  ShieldAlert,
  PlusCircle,
  RefreshCw,
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
}

export function Header({
  pets,
  activePet,
  streakDays,
  isSyncing,
  isOnline,
  onSelectPet,
  onOpenAddPet,
  onOpenEmergency,
  onOpenSyncModal,
  onOpenNotifications,
  onOpenProfile,
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-orange-200/60 shadow-[0_1px_8px_rgba(255,107,74,0.04)] transition-all"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="h-16 px-3 sm:px-4 max-w-lg mx-auto flex items-center justify-between gap-1.5">
        {/* Left: Brand & Pet Switcher */}
        <div className="flex items-center space-x-2 min-w-0">
          <div className="cursor-pointer flex items-center shrink-0">
            <PawLogo className="w-8 h-8" />
          </div>

          {/* Pet Switcher dropdown button */}
          <div className="relative z-50">
            <button
              id="pet-switcher-button"
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50/90 hover:bg-orange-100 border border-orange-200 text-slate-900 transition-all shrink-0 max-w-[155px] shadow-2xs text-left cursor-pointer"
              title="Switch household companion"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-xs font-bold text-slate-800 truncate">
                {activePet.name} {activePet.species === 'Cat' ? '🐈' : '🐶'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-orange-500 shrink-0 ml-auto" />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-50 bg-black/5"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white/98 backdrop-blur-md shadow-2xl border border-orange-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1 text-[10px] font-bold text-orange-900/60 uppercase tracking-wider">
                    Household Companions
                  </div>
                  {Object.values(pets).map((pet) => (
                    <button
                      key={pet.id}
                      type="button"
                      onClick={() => {
                        onSelectPet(pet.id);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs font-semibold text-slate-800 hover:bg-orange-50 flex items-center justify-between transition cursor-pointer border-b border-slate-50 last:border-none"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className="text-base">{pet.species === 'Cat' ? '🐈' : '🐶'}</span>
                        <div className="truncate">
                          <div className="font-bold text-slate-900 truncate">{pet.name}</div>
                          <div className="text-[10px] text-slate-400 font-medium truncate">{pet.breed}</div>
                        </div>
                      </span>
                      {pet.id === activePet.id ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold shrink-0">
                          Active
                        </span>
                      ) : null}
                    </button>
                  ))}
                  <div className="border-t border-orange-100 my-1.5" />
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenAddPet();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-[#ff6b4a] font-bold hover:bg-orange-50/70 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Add New Companion</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Cloud Sync, Streak, SOS, Notifications & Profile */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Cloud Sync Status Pill */}
          <button
            id="cloud-sync-status-btn"
            type="button"
            onClick={onOpenSyncModal}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-[11px] font-semibold text-slate-600 transition"
            title="Firebase Cloud Sync active across devices"
          >
            {isSyncing ? (
              <RefreshCw className="w-3 h-3 text-[#ff6b4a] animate-spin" />
            ) : isOnline ? (
              <Cloud className="w-3 h-3 text-emerald-600" />
            ) : (
              <Cloud className="w-3 h-3 text-slate-400" />
            )}
            <span className="hidden sm:inline">Sync</span>
          </button>

          {/* Streak badge */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50/80 border border-amber-200/60 text-amber-800 text-xs font-bold shadow-[0_2px_8px_-2px_rgba(245,158,11,0.15)]"
            title="Active daily care streak"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{streakDays}d</span>
          </div>

          {/* Emergency SOS quick pass */}
          <button
            id="header-sos-button"
            type="button"
            onClick={onOpenEmergency}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold transition-transform active:scale-95"
            title="Emergency Pet Medical Pass"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="text-[11px]">SOS</span>
          </button>

          {/* Notifications bell */}
          <button
            id="header-notifications-btn"
            type="button"
            onClick={onOpenNotifications}
            className="relative w-8 h-8 flex items-center justify-center rounded-full text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ff6b4a] ring-2 ring-white" />
          </button>

          {/* Profile Menu with Sarah photo */}
          <button
            id="header-profile-btn"
            type="button"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full p-0.5 ring-2 ring-orange-200 hover:ring-[#ff6b4a] transition-all overflow-hidden shrink-0"
            title="Profile & Settings"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
