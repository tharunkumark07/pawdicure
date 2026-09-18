import React from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-2.5 p-3 rounded-2xl shadow-xl backdrop-blur-md border transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
              isSuccess
                ? 'bg-slate-900/95 text-white border-slate-700/60'
                : isWarning
                ? 'bg-amber-950/95 text-amber-100 border-amber-600/50'
                : isError
                ? 'bg-red-950/95 text-red-100 border-red-600/50'
                : 'bg-slate-900/95 text-white border-slate-700/60'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.icon ? (
                <span className="text-base shrink-0">{toast.icon}</span>
              ) : isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isWarning ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : isError ? (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-sky-400 shrink-0" />
              )}
              <span className="text-xs font-semibold leading-snug truncate">
                {toast.title}
              </span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-full text-slate-400 hover:text-white transition shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
