import React, { useState } from 'react';
import { Bell, BellRing, Check, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PushNotificationBannerProps {
  petName: string;
}

export function PushNotificationBanner({ petName }: PushNotificationBannerProps) {
  const {
    isPushEnabled,
    registerPushNotifications,
    triggerTestPushNotification,
  } = useApp();

  const [dismissed, setDismissed] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const handleEnablePush = async () => {
    setIsRequesting(true);
    const success = await registerPushNotifications();
    setIsRequesting(false);
    if (success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 4000);
    }
  };

  const handleSendSampleAlert = async () => {
    setTestSent(true);
    await triggerTestPushNotification();
    setTimeout(() => setTestSent(false), 3500);
  };

  if (dismissed || isPushEnabled) {
    return null;
  }

  return (
    <div className="mx-3 sm:mx-4 mt-2 mb-1 p-3 rounded-2xl bg-gradient-to-r from-orange-100/90 via-amber-50 to-orange-50 border border-orange-200 shadow-xs flex items-center justify-between gap-3 animate-in fade-in">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff6b4a] to-[#ae3115] text-white flex items-center justify-center shadow-xs shrink-0">
          <Bell className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h4 className="font-heading font-bold text-xs text-orange-950 truncate">
            Enable Push Notifications
          </h4>
          <p className="text-[11px] text-orange-800/90 truncate">
            Get instant alerts for {petName}'s meals, meds &amp; vaccines
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="px-2 py-1.5 text-slate-400 hover:text-slate-600 text-xs font-semibold"
        >
          Later
        </button>
        <button
          type="button"
          disabled={isRequesting}
          onClick={handleEnablePush}
          className="px-3 py-1.5 rounded-xl bg-[#ff6b4a] hover:bg-[#ed4d26] text-white text-xs font-bold shadow-xs hover:scale-105 active:scale-95 transition"
        >
          {isRequesting ? 'Enabling...' : 'Enable'}
        </button>
      </div>
    </div>
  );
}
