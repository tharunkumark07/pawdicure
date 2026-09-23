import React, { useState, useEffect } from 'react';
import { Settings, Play, Cloud, Bell, ShieldAlert, User, X, Sparkles, Palette, Check, PlusCircle, Vibrate, Trash2, AlertTriangle, Award, LogOut, LogIn, UserCheck, Mail, Lock, ShieldCheck } from 'lucide-react';
import { Pet } from '../types';
import { useApp } from '../context/AppContext';
import { MobileBottomSheet } from './ui/MobileBottomSheet';
import { DeletePetModal } from './DeletePetModal';
import { LogoutConfirmModal } from './LogoutConfirmModal';
import { safeStorage } from '../lib/safeStorage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestartGuide: () => void;
  onOpenSync: () => void;
  onOpenEmergency: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenBadges: () => void;
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

export function SettingsModal({
  isOpen,
  onClose,
  onRestartGuide,
  onOpenSync,
  onOpenEmergency,
  onOpenNotifications,
  onOpenProfile,
  onOpenBadges,
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
  const {
    deletePet,
    householdData,
    loginUserWithFirebase,
    loginUserWithGoogle,
    signupUserWithFirebase,
    logoutUserWithFirebase,
    showToast,
  } = useApp();
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [showAuthInline, setShowAuthInline] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  useEffect(() => {
    const saved = safeStorage.getItem('pawdicure_haptics_enabled');
    if (saved === 'false') setHapticsEnabled(false);
  }, []);

  const handleLogout = async () => {
    if (logoutUserWithFirebase) {
      await logoutUserWithFirebase();
      setShowAuthInline(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsAuthSubmitting(true);
    try {
      const res = await loginUserWithGoogle();
      if (res.success) {
        setShowAuthInline(false);
      }
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;
    if (authPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'warning');
      return;
    }
    setIsAuthSubmitting(true);
    try {
      if (authMode === 'signin') {
        const res = await loginUserWithFirebase(authEmail, authPassword);
        if (res.success) {
          setShowAuthInline(false);
          setAuthEmail('');
          setAuthPassword('');
        }
      } else {
        const res = await signupUserWithFirebase(authEmail, authPassword, authName || 'Companion Caregiver');
        if (res.success) {
          setShowAuthInline(false);
          setAuthEmail('');
          setAuthPassword('');
          setAuthName('');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const toggleHaptics = () => {
    const nextState = !hapticsEnabled;
    setHapticsEnabled(nextState);
    safeStorage.setItem('pawdicure_haptics_enabled', String(nextState));
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
    { id: 'glossy-black', name: 'Glossy Black', color: '#09090b', bgClass: 'bg-zinc-950' },
  ];

  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      fullHeight={true}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center shadow-xs">
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
      <>
        <div className="mt-2 space-y-6">
          {/* Theme Color Palette Section */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center gap-2 mb-2.5">
              <Palette className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-xs font-bold text-slate-900">Accent Color Theme</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t, idx) => {
                const isSelected = currentTheme === t.id;
                return (
                  <button
                    key={`${t.id}-${idx}`}
                    type="button"
                    onClick={() => onSelectTheme(t.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'border-[var(--primary)] bg-[var(--primary-light)] shadow-xs ring-1 ring-[var(--primary)]/20'
                        : 'border-slate-200 bg-white hover:border-[var(--primary-border)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full shadow-2xs shrink-0 border border-black/10 dark:border-white/30"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className={`text-xs ${isSelected ? 'font-extrabold text-[var(--text)]' : 'font-medium text-slate-700'}`}>
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
            <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
              {Object.values(pets).map((p, idx) => {
                const isActive = p.id === activePet.id;
                return (
                  <div
                    key={`pet-switch-${p.id || idx}`}
                    className={`w-full flex items-center justify-between p-2 rounded-xl transition ${
                      isActive
                        ? 'bg-[var(--primary-light)] border border-[var(--primary)] text-slate-900 font-bold'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectPet(p.id)}
                      className="flex-1 flex items-center gap-2.5 truncate text-left cursor-pointer"
                    >
                      <img src={p.avatarUrl} alt={p.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{p.breed}</div>
                      </div>
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isActive && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          Active
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPetToDelete(p);
                        }}
                        className="p-1 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                        title={`Permanently Remove ${p.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dedicated Permanently Remove Pet Section in SettingsModal */}
          <div className="p-3.5 rounded-2xl bg-red-50/60 border border-red-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold font-heading uppercase tracking-wide">Danger Zone: Delete Pet</span>
              </div>
              <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                Permanent
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Permanently erase {activePet?.name || 'active pet'} from Firestore database and local storage.
            </p>
            {activePet && (
              <button
                type="button"
                onClick={() => setPetToDelete(activePet)}
                className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Permanently Remove {activePet.name}</span>
              </button>
            )}
          </div>

          {/* 1. Interactive Guide Tour (Guide Me) */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onRestartGuide();
            }}
            className="w-full p-3.5 rounded-2xl bg-[var(--primary)] text-white hover:brightness-105 flex items-center justify-between shadow-md transition cursor-pointer group"
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
                <div className="text-[11px] text-white/80">
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
            className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-[var(--primary-light)] border border-slate-200 hover:border-[var(--primary-border)] flex items-center justify-between transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
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

          {/* 7. Companion Badges & Medals Tile */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenBadges();
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-200 flex items-center justify-between transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">Companion Medals &amp; Badges</div>
                <div className="text-[11px] text-slate-500">View unlockable achievements &amp; milestone rewards</div>
              </div>
            </div>
            <span className="text-xs font-bold text-[var(--primary)]">View</span>
          </button>

          {/* 8. Account & Authentication Tile (Log Out / Log In) */}
          <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[var(--primary)] flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>Account &amp; Session</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      householdData.userProfile?.email
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {householdData.userProfile?.email ? 'Logged In' : 'Guest Mode'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[180px] sm:max-w-[240px]">
                    {householdData.userProfile?.email || 'Guest Caregiver Session'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {householdData.userProfile?.email && (
                  <button
                    type="button"
                    onClick={() => setShowLogoutModal(true)}
                    className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowAuthInline(!showAuthInline)}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <LogIn className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span>{showAuthInline ? 'Close' : householdData.userProfile?.email ? 'Switch' : 'Log In'}</span>
                </button>
              </div>
            </div>

            {/* Inline Login / Sign-up form when expanded */}
            {showAuthInline && (
              <form onSubmit={handleAuthSubmit} className="pt-2 border-t border-slate-200/80 space-y-2.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                    {authMode === 'signin' ? 'Sign In to Account' : 'Create New Account'}
                  </span>
                  <div className="flex items-center gap-1 bg-slate-200/60 p-0.5 rounded-lg text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className={`px-2 py-0.5 rounded-md transition ${authMode === 'signin' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className={`px-2 py-0.5 rounded-md transition ${authMode === 'signup' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>

                {authMode === 'signup' && (
                  <input
                    type="text"
                    placeholder="Full Name (e.g. Sarah Miller)"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                )}

                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                </div>

                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAuthSubmitting}
                  className="w-full py-2 px-3 rounded-xl bg-[var(--primary)] text-white text-xs font-bold transition hover:brightness-105 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isAuthSubmitting ? (
                    <span>Authenticating...</span>
                  ) : authMode === 'signin' ? (
                    <>
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Log In Again</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Create &amp; Link Account</span>
                    </>
                  )}
                </button>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={isAuthSubmitting}
                    className="w-full py-1.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>PAWdiCURE v2.4 Pro</span>
          <span className="font-semibold text-slate-600">Secure Cloud Environment</span>
        </div>

        {petToDelete && (
          <DeletePetModal
            isOpen={!!petToDelete}
            onClose={() => setPetToDelete(null)}
            pet={petToDelete}
          />
        )}

        <LogoutConfirmModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
        />
      </>
    </MobileBottomSheet>
  );
}

