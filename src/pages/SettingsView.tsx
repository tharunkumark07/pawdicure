import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Cloud,
  Moon,
  Shield,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Trash2,
  LogOut,
  LogIn,
  UserCheck,
  Mail,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { DeletePetModal } from '../components/DeletePetModal';
import { LogoutConfirmModal } from '../components/LogoutConfirmModal';
import { Pet } from '../types';

export function SettingsView() {
  const {
    householdData,
    updateHouseholdSettings,
    forceCloudSync,
    showToast,
    navigate,
    currentTheme,
    setCurrentTheme,
    loginUserWithFirebase,
    signupUserWithFirebase,
    logoutUserWithFirebase,
  } = useApp();

  const [showAuthInline, setShowAuthInline] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  const handleLogout = async () => {
    if (logoutUserWithFirebase) {
      await logoutUserWithFirebase();
      setShowAuthInline(false);
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

  const rawSettings = householdData.settings || {};
  const settings = {
    weightUnit: rawSettings.weightUnit || 'kg',
    volumeUnit: rawSettings.volumeUnit || 'ml',
    feedingReminders: rawSettings.feedingReminders !== false,
    medicationReminders: rawSettings.medicationReminders !== false,
    activityReminders: rawSettings.activityReminders !== false,
    cloudBackup: rawSettings.cloudBackup !== false,
    notifyFeeding: rawSettings.notifyFeeding !== false,
    notifyMeds: rawSettings.notifyMeds !== false,
    notifyVaccinations: rawSettings.notifyVaccinations !== false,
    notifyVet: rawSettings.notifyVet !== false,
    notifyAchievements: rawSettings.notifyAchievements !== false,
    quietHoursEnabled: !!rawSettings.quietHoursEnabled,
    quietHoursStart: rawSettings.quietHoursStart || '22:00',
    quietHoursEnd: rawSettings.quietHoursEnd || '07:00',
  };

  const [confirmReset, setConfirmReset] = useState(false);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);

  const petList: Pet[] = Array.isArray(householdData.pets)
    ? householdData.pets
    : Object.values(householdData.pets || {});

  const toggleSetting = (key: keyof typeof settings) => {
    const updated = {
      ...settings,
      [key]: !settings[key],
    };
    updateHouseholdSettings(updated);
    showToast('Preference updated', 'info');
  };

  const updateTimeSetting = (key: 'quietHoursStart' | 'quietHoursEnd', val: string) => {
    const updated = {
      ...settings,
      [key]: val,
    };
    updateHouseholdSettings(updated);
  };

  const handleManualSync = async () => {
    await forceCloudSync();
  };

  const handleResetData = () => {
    localStorage.clear();
    showToast('Resetting application state...', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="flex flex-col w-full pb-14 space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[var(--card-bg)] p-4 sm:p-5 rounded-3xl border border-[var(--card-border)] shadow-xs flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-xl text-[var(--text)]">
            Household Settings
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Cloud persistence, pet profile management &amp; notifications
          </p>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold">
          <SettingsIcon className="w-5 h-5" />
        </div>
      </div>

      {/* PROMINENT DELETE PET PROFILE SECTION */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-red-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
                <span>Delete Pet Profile</span>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full uppercase">
                  Permanent Erase
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Permanently delete a pet and erase all associated medical, feeding, and care data
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {petList.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-2">No pets currently in your household.</p>
          ) : (
            petList.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-red-50/40 border border-red-100 hover:bg-red-50/80 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    className="w-10 h-10 rounded-2xl object-cover ring-2 ring-red-200 shadow-2xs"
                  />
                  <div>
                    <div className="font-bold text-sm text-slate-900 font-heading">
                      {p.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {p.breed} • {p.species} • Level {p.level}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPetToDelete(p)}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 active:scale-95"
                  title={`Delete ${p.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete {p.name}</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cloud Sync Status */}
      <div className="bg-[var(--primary-light)] p-4 sm:p-5 rounded-3xl border border-[var(--primary-border)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-blue-100 text-blue-600 flex items-center justify-center shadow-2xs shrink-0">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-xs text-slate-900">
              Firebase Firestore Cloud Sync
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Status:{' '}
              <span className="font-bold text-emerald-600">
                {householdData.syncStatus === 'synced' ? 'Active & Up to Date' : 'Local Persistence Active'}
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleManualSync}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition shadow-2xs"
        >
          Sync Now
        </button>
      </div>

      {/* Theme Picker - Change Dynamically */}
      <div className="bg-[var(--card-bg)] p-4 sm:p-5 rounded-3xl border border-[var(--card-border)] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--primary)]" />
          <h3 className="font-heading font-bold text-sm text-slate-900">
            Dynamic Appearance &amp; Themes
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {[
            { id: 'sunset', label: 'Sunset', icon: '🌇', color: 'bg-[#ff6b4a]' },
            { id: 'forest', label: 'Forest', icon: '🌲', color: 'bg-[#059669]' },
            { id: 'royal', label: 'Royal', icon: '👑', color: 'bg-[#2563eb]' },
            { id: 'purple', label: 'Purple', icon: '🔮', color: 'bg-[#7c3aed]' },
            { id: 'glossy-black', label: 'Glossy Black', icon: '✨', color: 'bg-[#09090b] text-white shadow-xs border border-black/10' },
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                setCurrentTheme(theme.id);
                showToast(`Switched to ${theme.label} theme!`, 'success');
              }}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all active:scale-95 cursor-pointer ${
                currentTheme === theme.id
                  ? 'border-[var(--primary)] bg-[var(--primary-light)] ring-2 ring-[var(--primary)]/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl ${theme.color} flex items-center justify-center text-white text-lg shadow-sm`}>
                {theme.icon}
              </div>
              <span className={`text-[11px] font-bold ${currentTheme === theme.id ? 'text-[var(--primary)]' : 'text-slate-600'}`}>
                {theme.label}
              </span>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-500 font-medium italic text-center">
          Themes sync automatically with the current time of day by default.
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[var(--primary)]" />
          <h3 className="font-heading font-bold text-sm text-slate-900">
            Smart Alerts &amp; Notifications
          </h3>
        </div>

        <div className="space-y-2.5 pt-1 text-xs">
          {/* Feeding */}
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <div>
              <div className="font-bold text-slate-900">Feeding Alerts</div>
              <div className="text-[11px] text-slate-500">
                Reminders for morning/evening portions and overdue watchdog warnings
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyFeeding}
              onChange={() => toggleSetting('notifyFeeding')}
              className="w-4 h-4 text-[var(--primary)] accent-[var(--primary)] rounded cursor-pointer"
            />
          </div>

          {/* Meds */}
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <div>
              <div className="font-bold text-slate-900">Medication Reminders</div>
              <div className="text-[11px] text-slate-500">
                High-priority supplement dosages &amp; therapeutic schedules
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyMeds}
              onChange={() => toggleSetting('notifyMeds')}
              className="w-4 h-4 text-[var(--primary)] accent-[var(--primary)] rounded cursor-pointer"
            />
          </div>

          {/* Vaccinations */}
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <div>
              <div className="font-bold text-slate-900">Vaccination Triggers</div>
              <div className="text-[11px] text-slate-500">
                Core booster schedules and veterinary immunization alerts
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyVaccinations}
              onChange={() => toggleSetting('notifyVaccinations')}
              className="w-4 h-4 text-[var(--primary)] accent-[var(--primary)] rounded cursor-pointer"
            />
          </div>

          {/* Vet */}
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <div>
              <div className="font-bold text-slate-900">Vet &amp; Clinical Visits</div>
              <div className="text-[11px] text-slate-500">
                Appointment confirmations and clinical checkups
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyVet}
              onChange={() => toggleSetting('notifyVet')}
              className="w-4 h-4 text-[var(--primary)] accent-[var(--primary)] rounded cursor-pointer"
            />
          </div>

          {/* Achievements */}
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <div>
              <div className="font-bold text-slate-900">Achievements &amp; Milestones</div>
              <div className="text-[11px] text-slate-500">
                Instant alerts on level-ups, badge unlocks, and family streaks
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyAchievements}
              onChange={() => toggleSetting('notifyAchievements')}
              className="w-4 h-4 text-[var(--primary)] accent-[var(--primary)] rounded cursor-pointer"
            />
          </div>

          {/* Routine/Activity Reminders */}
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <div>
              <div className="font-bold text-slate-900">Daily Activity Summary</div>
              <div className="text-[11px] text-slate-500">
                Evening recap of steps, hydration &amp; care score
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.activityReminders}
              onChange={() => toggleSetting('activityReminders')}
              className="w-4 h-4 text-[var(--primary)] accent-[var(--primary)] rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Quiet Hours Sub-Section */}
        <div className="border-t border-slate-100 pt-3 mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-500 shrink-0" />
              <div>
                <div className="font-bold text-slate-900 text-xs">Quiet Hours (Mute Alerts)</div>
                <div className="text-[11px] text-slate-500">
                  Do not send push notifications during specified sleep windows
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.quietHoursEnabled}
              onChange={() => toggleSetting('quietHoursEnabled')}
              className="w-4 h-4 text-[var(--primary)] accent-[var(--primary)] rounded cursor-pointer"
            />
          </div>

          {settings.quietHoursEnabled && (
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Mute From</label>
                <input
                  type="time"
                  value={settings.quietHoursStart}
                  onChange={(e) => updateTimeSetting('quietHoursStart', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[var(--primary)]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Mute Until</label>
                <input
                  type="time"
                  value={settings.quietHoursEnd}
                  onChange={(e) => updateTimeSetting('quietHoursEnd', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Measurement Units */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs space-y-3">
        <h3 className="font-heading font-bold text-sm text-slate-900">
          Units of Measurement
        </h3>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Weight Metric
            </span>
            <div className="font-bold text-slate-900">Kilograms (kg)</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Liquid Volume
            </span>
            <div className="font-bold text-slate-900">Milliliters (ml)</div>
          </div>
        </div>
      </div>

      {/* Account & Authentication Tile (Log Out / Log In) */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[var(--primary)] flex items-center justify-center font-bold shadow-2xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>Account &amp; Session</span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  householdData.userProfile?.email
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {householdData.userProfile?.email ? 'Logged In' : 'Guest Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[220px] sm:max-w-[320px]">
                {householdData.userProfile?.email || 'Guest Caregiver Session (Unlinked)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {householdData.userProfile?.email && (
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowAuthInline(!showAuthInline)}
              className="px-3.5 py-2 rounded-xl bg-[var(--primary-light)] hover:bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary-border)] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>{showAuthInline ? 'Close' : householdData.userProfile?.email ? 'Switch Account' : 'Log In / Sign Up'}</span>
            </button>
          </div>
        </div>

        {/* Inline Login / Sign-up form when expanded */}
        {showAuthInline && (
          <form onSubmit={handleAuthSubmit} className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 font-heading uppercase tracking-wide">
                {authMode === 'signin' ? 'Sign In to Existing Account' : 'Create New Cloud Account'}
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className={`px-3 py-1 rounded-lg transition ${authMode === 'signin' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`px-3 py-1 rounded-lg transition ${authMode === 'signup' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Miller"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="sarah@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--primary)] text-white text-xs font-bold transition hover:brightness-105 shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isAuthSubmitting ? (
                <span>Authenticating with Cloud...</span>
              ) : authMode === 'signin' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In &amp; Restore Session</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Create Account &amp; Sync Household</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* System Reset Section */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-red-100 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-xs text-red-700 uppercase">
            System Reset
          </h3>
          <p className="text-[11px] text-slate-500">
            Restore sample data and reset all mock counters
          </p>
        </div>

        {confirmReset ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetData}
              className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-2xs hover:bg-red-700 transition cursor-pointer"
            >
              Confirm Reset
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold border border-red-200 transition cursor-pointer"
          >
            Reset to Defaults
          </button>
        )}
      </div>

      {/* App Info Footer */}
      <div className="text-center py-2 text-slate-400 text-[11px] space-y-0.5">
        <p className="font-bold text-slate-600">PAWdiCURE Companion Suite v2.4.0</p>
        <p>Built with clinical precision, React 19 &amp; Tailwind CSS</p>
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
    </div>
  );
}
