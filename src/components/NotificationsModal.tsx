import { Bell, Flame, ShieldAlert, Check, X } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: 'home' | 'feed' | 'health' | 'bond' | 'rewards') => void;
}

export function NotificationsModal({
  isOpen,
  onClose,
  onNavigate,
}: NotificationsModalProps) {
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
            <Bell className="w-5 h-5 text-[#ff6b4a]" />
            <h3 className="font-heading font-bold text-base text-slate-900">
              Notifications &amp; Alerts
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {/* Notification 1 */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-3">
            <span className="p-2 rounded-xl bg-amber-500 text-white shadow-2xs shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  DHPP Booster Due Soon
                </span>
                <span className="text-[10px] text-slate-400">2h ago</span>
              </div>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Milo's booster is recommended within the next 14 days at Bay Paws Clinic.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate('health');
                }}
                className="mt-2.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[11px] shadow-2xs transition"
              >
                Schedule Visit
              </button>
            </div>
          </div>

          {/* Notification 2 */}
          <div className="p-3.5 bg-white border border-slate-100 rounded-2xl flex items-start gap-3 shadow-xs">
            <span className="p-2 rounded-xl bg-[#ff6b4a] text-white shadow-2xs shrink-0">
              <Flame className="w-4 h-4 fill-white" />
            </span>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  Streak Bonus Unlocked! 🔥
                </span>
                <span className="text-[10px] text-slate-400">Yesterday</span>
              </div>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                12 consecutive days of balanced care reached! 1.25x multiplier active on all Paw Points.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
