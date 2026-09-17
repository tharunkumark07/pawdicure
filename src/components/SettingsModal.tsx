import React from 'react';
import { Settings, Play, Cloud, Bell, ShieldAlert, User, X, Sparkles, Volume2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestartGuide: () => void;
  onOpenSync: () => void;
  onOpenEmergency: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  characterId: string;
}

export function SettingsModal({
  isOpen,
  onClose,
  onRestartGuide,
  onOpenSync,
  onOpenEmergency,
  onOpenNotifications,
  onOpenProfile,
  characterId,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 z-10 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-orange-100 text-[#ff6b4a] flex items-center justify-center shadow-xs">
              <Settings className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                App Settings &amp; Guide
              </h3>
              <p className="text-[11px] text-slate-500">
                Manage tour guides, sync, emergency &amp; preferences
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {/* 1. Interactive Guide Tour (Guide Me) */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onRestartGuide();
            }}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-[#e05333] text-white hover:from-orange-600 hover:to-[#cc4627] flex items-center justify-between shadow-md shadow-orange-500/20 transition cursor-pointer group"
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
            <span className="text-xs font-bold text-[#ff6b4a]">Manage</span>
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
            <span className="text-xs font-bold text-[#ff6b4a]">Check</span>
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
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#ff6b4a] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900">Household &amp; Pet Profile</div>
                <div className="text-[11px] text-slate-500">Caretaker details &amp; companion switcher</div>
              </div>
            </div>
            <span className="text-xs font-bold text-[#ff6b4a]">Open</span>
          </button>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>PAWdiCURE v2.4 Pro</span>
          <span className="font-semibold text-slate-600">Secure Cloud Environment</span>
        </div>
      </div>
    </div>
  );
}
