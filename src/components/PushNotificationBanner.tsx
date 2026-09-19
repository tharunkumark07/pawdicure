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
    <div className="mx-3 sm:mx-4 mt-2 mb-1 p-3 rounded-2xl bg-[var(--primary-light)] border border-[var(--primary-border)] shadow-xs flex items-center justify-between gap-3 animate-in fade-in">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shadow-xs shrink-0">
          <Bell className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <h4 className="font-heading font-bold text-xs text-[var(--text)] truncate">
            Enable Push Notifications
          </h4>
          <p className="text-[11px] text-[var(--text-muted)] truncate">
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
          className="px-3 py-1.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-xs hover:scale-105 active:scale-95 transition"
        >
          {isRequesting ? 'Enabling...' : 'Enable'}
        </button>
      </div>
    </div>
  );
}
