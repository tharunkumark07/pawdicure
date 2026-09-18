import React, { useState, useEffect } from 'react';
import { Settings, Play, Cloud, Bell, ShieldAlert, User, X, Sparkles, Palette, Check, PlusCircle, Vibrate } from 'lucide-react';
import { Pet } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestartGuide: () => void;
  onOpenSync: () => void;
  onOpenEmergency: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  characterId: string;
  currentTheme: string;
  onSelectTheme: (themeId: string) => void;
  isPushEnabled: boolean;
  pushPermissionStatus: string;
  onEnablePush: () => Promise<void>;
  onTestPush: () => Promise<void>;
  pets: Record<string, Pet>;
  activePet: Pet;
  onSelectPet: (petId: string) => void;
  onOpenAddPet: () => void;
}

import { MobileBottomSheet } from './ui/MobileBottomSheet';

export function SettingsModal({
  isOpen,
  onClose,
  onRestartGuide,
  onOpenSync,
  onOpenEmergency,
  onOpenNotifications,
  onOpenProfile,
  characterId,
  currentTheme,
  onSelectTheme,
  isPushEnabled,
  pushPermissionStatus,
  onEnablePush,
  onTestPush,
  pets,
  activePet,
  onSelectPet,
  onOpenAddPet,
}: SettingsModalProps) {
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('pawdicure_haptics_enabled');
    if (saved === 'false') setHapticsEnabled(false);
  }, []);

  const toggleHaptics = () => {
    const nextState = !hapticsEnabled;
    setHapticsEnabled(nextState);
    localStorage.setItem('pawdicure_haptics_enabled', String(nextState));
    if (nextState && typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(25); // Test vibration when turning on
    }
  };

  if (!isOpen) return null;

  const themes = [
    { id: 'sunset', name: 'Sunset Orange', color: '#ff6b4a', bgClass: 'bg-orange-500' },
    { id: 'forest', name: 'Forest Green', color: '#059669', bgClass: 'bg-emerald-600' },
    { id: 'royal', name: 'Royal Blue', color: '#2563eb', bgClass: 'bg-blue-600' },
    { id: 'purple', name: 'Purple Dream', color: '#7c3aed', bgClass: 'bg-violet-600' },
  ];

  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      fullHeight={true}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-orange-100 text-[var(--primary)] flex items-center justify-center shadow-xs">
            <Settings className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <span className="font-heading font-bold text-base text-slate-900 block">
              App Settings & Guide
            </span>
            <span className="text-[11px] text-slate-500 block">
              Manage tour guides, sync, emergency & themes
            </span>
          </div>
        </div>
      }
    >
      <div className="mt-2 space-y-6">
          {/* Theme Color Palette Section */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center gap-2 mb-2.5">
              <Palette className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-xs font-bold text-slate-900">Accent Color Theme</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t) => {
                const isSelected = currentTheme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelectTheme(t.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'border-[var(--primary)] bg-orange-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-orange-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full shadow-2xs shrink-0"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className={`text-xs ${isSelected ? 'font-extrabold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {t.name}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[var(--primary)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pet Switching Section */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🐾</span>
                <span className="text-xs font-bold text-slate-900">Switch Active Pet Companion</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAddPet();
                }}
                className="text-[11px] font-bold text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Add Pet
              </button>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
              {Object.values(pets).map((p) => {
                const isActive = p.id === activePet.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onSelectPet(p.id);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl transition cursor-pointer ${
                      isActive
                        ? 'bg-orange-50 border border-[var(--primary)] text-slate-900 font-bold'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <img src={p.avatarUrl} alt={p.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div className="text-left truncate">
                        <div className="text-xs font-bold text-slate-900 truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{p.breed}</div>
                      </div>
                    </div>
                    {isActive && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. Interactive Guide Tour (Guide Me) */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onRestartGuide();
            }}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[#ae3115] text-white hover:brightness-105 flex items-center justify-between shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                {characterId === 'dog' ? '🐶' : '🐱'}
              </div>
              <div className="text-left">
                <div className="text-xs font-extrabold flex items-center gap-1.5">
                  <span>Interactive Guide Tour</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                </div>
                <div className="text-[11px] text-orange-100">
                  Restart step-by-step app walkthrough
                </div>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/20 text-xs font-bold flex items-center gap-1 group-hover:bg-white/30 transition">
              <Play className="w-3 h-3 fill-white" />
              <span>Start</span>
            </div>
          </button>

          {/* 2. Cloud Sync */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSync();
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50/60 border border-slate-200 hover:border-orange-200 flex items-center justify-between transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Cloud className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">Cloud Sync &amp; Backup</div>
                <div className="text-[11px] text-slate-500">Firebase Firestore multi-device sync</div>
              </div>
            </div>
            <span className="text-xs font-bold text-[var(--primary)]">Manage</span>
          </button>

          {/* 3. Emergency SOS Pass */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenEmergency();
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-red-50/60 border border-slate-200 hover:border-red-200 flex items-center justify-between transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">Emergency Medical Pass (SOS)</div>
                <div className="text-[11px] text-slate-500">Quick access vet contacts &amp; microchip info</div>
              </div>
            </div>
            <span className="text-xs font-bold text-red-600">View</span>
          </button>

          {/* 4. Notifications & Reminders */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenNotifications();
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50/60 border border-slate-200 hover:border-orange-200 flex items-center justify-between transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">Notifications &amp; Alerts</div>
                <div className="text-[11px] text-slate-500">Feeding reminders &amp; health updates</div>
              </div>
            </div>
            <span className="text-xs font-bold text-[var(--primary)]">Check</span>
          </button>

          {/* 4b. Haptic Feedback Toggle */}
          <button
            type="button"
            onClick={toggleHaptics}
            className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Vibrate className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">Haptic Feedback</div>
                <div className="text-[11px] text-slate-500">Tactile vibrations on button press</div>
              </div>
            </div>
            <div
              className={`w-10 h-6 rounded-full transition-colors flex items-center p-1 ${
                hapticsEnabled ? 'bg-[var(--primary)]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                  hapticsEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
          </button>

          {/* 5. Household & Pet Profile */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenProfile();
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50/60 border border-slate-200 hover:border-orange-200 flex items-center justify-between transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-[var(--primary)] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">Household &amp; Pet Profile</div>
                <div className="text-[11px] text-slate-500">Caretaker details &amp; companion switcher</div>
              </div>
            </div>
            <span className="text-xs font-bold text-[var(--primary)]">Open</span>
          </button>

          {/* 6. Push Notifications Section */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[var(--primary)]" />
                <span className="text-xs font-bold text-slate-900">Push Notifications</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isPushEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {isPushEnabled ? 'Enabled' : pushPermissionStatus === 'denied' ? 'Blocked' : 'Disabled'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Receive OS-level reminders for feeding schedules and care tasks.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onEnablePush}
                disabled={isPushEnabled}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  isPushEnabled
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                    : 'bg-[var(--primary)] text-white hover:brightness-105 shadow-xs'
                }`}
              >
                {isPushEnabled ? 'Push Notifications Active' : 'Enable Push Notifications'}
              </button>
              {isPushEnabled && (
                <button
                  type="button"
                  onClick={onTestPush}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-2xs"
                  title="Test Push"
                >
                  Test
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>PAWdiCURE v2.4 Pro</span>
          <span className="font-semibold text-slate-600">Secure Cloud Environment</span>
        </div>
    </MobileBottomSheet>
  );
}

