import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Check, ShieldCheck, Sparkles, Send } from 'lucide-react';
import { pushNotifications } from '../lib/pushNotifications';

interface PushNotificationBannerProps {
  petName: string;
}

export function PushNotificationBanner({ petName }: PushNotificationBannerProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [dismissed, setDismissed] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    setPermission(pushNotifications.getPermissionStatus());
  }, []);

  const handleEnablePush = async () => {
    setIsRequesting(true);
    const status = await pushNotifications.requestPermission();
    setPermission(status);
    setIsRequesting(false);

    if (status === 'granted') {
      pushNotifications.sendNotification({
        title: `🐾 PAWdiCURE Alerts Activated!`,
        body: `You will now receive vital reminders for ${petName}'s feedings, walks, and vaccines.`,
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 4000);
    }
  };

  const handleSendSampleAlert = () => {
    pushNotifications.scheduleCareAlert(petName, 'feeding');
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3500);
  };

  if (dismissed || permission === 'denied') {
    return null;
  }

  if (permission === 'granted') {
    return (
      <div className="mx-3 sm:mx-4 mt-2 mb-1 p-2.5 rounded-2xl bg-orange-50/80 border border-orange-200/80 flex items-center justify-between text-xs animate-in fade-in">
        <div className="flex items-center gap-2 text-orange-950">
          <div className="w-6 h-6 rounded-lg bg-orange-100 text-[#ff6b4a] flex items-center justify-center">
            <BellRing className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold">
            Push notifications active for <strong>{petName}</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={handleSendSampleAlert}
          className="px-2.5 py-1 rounded-xl bg-white border border-orange-200 text-orange-800 text-[11px] font-bold hover:bg-orange-100/60 transition shadow-2xs flex items-center gap-1 active:scale-95"
        >
          {testSent ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Sent!</span>
            </>
          ) : (
            <>
              <Send className="w-3 h-3 text-[#ff6b4a]" />
              <span>Test Push</span>
            </>
          )}
        </button>
      </div>
    );
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
