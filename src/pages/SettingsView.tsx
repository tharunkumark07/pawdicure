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
              className="w-4 h-4 text-[#ff6b4a] accent-[#ff6b4a] rounded cursor-pointer"
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
              className="w-4 h-4 text-[#ff6b4a] accent-[#ff6b4a] rounded cursor-pointer"
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
              className="w-4 h-4 text-[#ff6b4a] accent-[#ff6b4a] rounded cursor-pointer"
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
              className="w-4 h-4 text-[#ff6b4a] accent-[#ff6b4a] rounded cursor-pointer"
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
              className="w-4 h-4 text-[#ff6b4a] accent-[#ff6b4a] rounded cursor-pointer"
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
              className="w-4 h-4 text-[#ff6b4a] accent-[#ff6b4a] rounded cursor-pointer"
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
              className="w-4 h-4 text-[#ff6b4a] accent-[#ff6b4a] rounded cursor-pointer"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff6b4a]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Mute Until</label>
                <input
                  type="time"
                  value={settings.quietHoursEnd}
                  onChange={(e) => updateTimeSetting('quietHoursEnd', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#ff6b4a]"
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
