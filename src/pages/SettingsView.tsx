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
} from 'lucide-react';

export function SettingsView() {
  const {
    householdData,
    updateHouseholdSettings,
    forceCloudSync,
    showToast,
    navigate,
  } = useApp();

  const settings = householdData.settings || {
    weightUnit: 'kg',
    volumeUnit: 'ml',
    feedingReminders: true,
    medicationReminders: true,
    activityReminders: true,
    cloudBackup: true,
  };

  const [confirmReset, setConfirmReset] = useState(false);

  const toggleSetting = (key: keyof typeof settings) => {
    const updated = {
      ...settings,
      [key]: !settings[key],
    };
    updateHouseholdSettings(updated);
    showToast('Settings saved', 'info');
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
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-xl text-slate-900">
            Household Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cloud persistence, notifications &amp; telemetry units
          </p>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#ff6b4a] flex items-center justify-center font-bold">
          <SettingsIcon className="w-5 h-5" />
        </div>
      </div>

      {/* Cloud Sync Status */}
      <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-teal-500/10 p-4 sm:p-5 rounded-3xl border border-blue-100 flex items-center justify-between gap-3">
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

      {/* Notification Preferences */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#ff6b4a]" />
          <h3 className="font-heading font-bold text-sm text-slate-900">
            Smart Alerts &amp; Notifications
          </h3>
        </div>

        <div className="space-y-2.5 pt-1 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <div>
              <div className="font-bold text-slate-900">Feeding Schedules</div>
              <div className="text-[11px] text-slate-500">
                Reminders for morning and evening portions
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.feedingReminders}
              onChange={() => toggleSetting('feedingReminders')}
              className="w-4 h-4 text-[#ff6b4a] accent-[#ff6b4a] rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <div>
              <div className="font-bold text-slate-900">Medications &amp; Supplements</div>
              <div className="text-[11px] text-slate-500">
                High-priority dosage alerts &amp; heartworm reminders
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.medicationReminders}
              onChange={() => toggleSetting('medicationReminders')}
              className="w-4 h-4 text-[#ff6b4a] accent-[#ff6b4a] rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-1">
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
              className="w-4 h-4 text-[#ff6b4a] accent-[#ff6b4a] rounded cursor-pointer"
            />
          </div>
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

      {/* Danger Zone: Reset Data */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-red-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-xs text-red-700 uppercase">
              Sign Out / Re-Login
            </h3>
            <p className="text-[11px] text-slate-500">
              Clear one-time login credentials on this device
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('PAWdiCURE_AUTH_COMPLETED_V1');
              showToast('Logged out! Reloading...', 'info');
              setTimeout(() => window.location.reload(), 500);
            }}
            className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200 transition"
          >
            Sign Out
          </button>
        </div>

        <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
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
                className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-2xs hover:bg-red-700 transition"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold border border-red-200 transition"
            >
              Reset to Defaults
            </button>
          )}
        </div>
      </div>

      {/* App Info Footer */}
      <div className="text-center py-2 text-slate-400 text-[11px] space-y-0.5">
        <p className="font-bold text-slate-600">PAWdiCURE Companion Suite v2.4.0</p>
        <p>Built with clinical precision, React 19 &amp; Tailwind CSS</p>
      </div>
    </div>
  );
}
