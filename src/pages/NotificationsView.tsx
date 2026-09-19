import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Clock,
  Sparkles,
  Gift,
  Activity,
  ArrowRight,
} from 'lucide-react';

export function NotificationsView() {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    navigate,
    showToast,
    isPushEnabled,
    registerPushNotifications,
    triggerTestPushNotification,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread' | 'health' | 'reminder'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'health') return n.type === 'health';
    if (filter === 'reminder') return n.type === 'reminder';
    return true;
  });

  const handleNotificationClick = (n: any) => {
    markNotificationRead(n.id);
    if (n.actionRoute) {
      navigate(n.actionRoute);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'health':
        return <Activity className="w-4 h-4 text-emerald-600" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'reward':
        return <Gift className="w-4 h-4 text-purple-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-[var(--primary)]" />;
    }
  };

  return (
    <div className="flex flex-col w-full pb-14 space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-[var(--card-bg)] p-4 sm:p-5 rounded-3xl border border-[var(--card-border)] shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-black text-xl text-[var(--text)]">
              Notification Center
            </h1>
            {unreadNotificationCount > 0 && (
              <span className="text-[10px] font-bold text-white bg-[var(--primary)] px-2 py-0.5 rounded-full">
                {unreadNotificationCount} new
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Vital alerts, upcoming care schedules &amp; rewards
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadNotificationCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] bg-[var(--background-alt)] hover:opacity-80 rounded-xl text-xs font-bold transition"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              onClick={() => {
                notifications.forEach((n) => deleteNotification(n.id));
                showToast('All notifications cleared', 'info');
              }}
              className="p-2 text-[var(--text-muted)] opacity-40 hover:text-red-500 hover:bg-red-500/10 rounded-xl text-xs font-bold transition"
              title="Clear all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Real Device Push Configuration */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="font-heading font-black text-sm tracking-wide text-white flex items-center gap-2">
              <span>📲 REAL-DEVICE PUSH ALERTS</span>
              <span className={`w-2 h-2 rounded-full ${isPushEnabled ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed max-w-md">
              Deliver critical medication alarms, due reminders, and missed-feeding alerts directly to your actual physical phone, even when PAWdiCURE runs in the background.
            </p>
          </div>
          <span className="text-xl shrink-0">📱</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800">
          {!isPushEnabled ? (
            <button
              type="button"
              onClick={registerPushNotifications}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl text-xs font-bold hover:opacity-90 transition shadow-xs flex items-center gap-1.5"
            >
              <span>🔔 Enable Native Push Alerts</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 w-full justify-between">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <span>✓ Push Active on this Device</span>
              </span>
              <button
                type="button"
                onClick={triggerTestPushNotification}
                className="px-3.5 py-1.5 bg-[var(--background-alt)] text-[var(--text-muted)] hover:text-[var(--text)] rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <span>📲 Send Test Push</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'unread', label: `Unread (${unreadNotificationCount})` },
          { id: 'health', label: 'Health & Vet 🩺' },
          { id: 'reminder', label: 'Reminders ⏰' },
        ].map((tab) => (
            <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              filter === tab.id
                ? 'bg-[var(--text)] text-[var(--background)] shadow-2xs'
                : 'bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-muted)] hover:bg-[var(--background-alt)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List with Animate-In and Stagger Shifting */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[var(--card-bg)] p-8 rounded-3xl border border-dashed border-[var(--card-border)] text-center space-y-2"
            >
              <Bell className="w-10 h-10 text-[var(--text-muted)] opacity-30 mx-auto" />
              <h3 className="font-heading font-bold text-sm text-[var(--text)]">
                No notifications here
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                You are completely caught up on your pet care routines!
              </p>
            </motion.div>
          ) : (
            filtered.map((n, i) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 15, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 28,
                  delay: Math.min(i * 0.04, 0.24)
                }}
                onClick={() => handleNotificationClick(n)}
                className={`p-4 rounded-3xl border transition cursor-pointer flex items-start justify-between gap-3 select-none active:scale-99 ${
                  n.read
                    ? 'bg-[var(--card-bg)] border-[var(--card-border)] shadow-2xs opacity-80 hover:opacity-100'
                    : 'bg-[var(--primary)]/5 border-[var(--primary)]/20 shadow-xs hover:border-[var(--primary)]/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[var(--text)]">
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[9px] text-[var(--text-muted)] opacity-50 font-mono mt-1 block">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {n.actionRoute && (
                  <button
                    type="button"
                    className="text-[var(--text-muted)] opacity-50 hover:text-[var(--primary)] hover:opacity-100 p-1 shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
