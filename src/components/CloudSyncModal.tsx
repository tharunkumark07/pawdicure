import { useState, FormEvent } from 'react';
import { Cloud, Check, Copy, RefreshCw, Smartphone, Database, X, AlertCircle } from 'lucide-react';
import { connectBySyncCode, syncHouseholdToCloud } from '../lib/firebase';
import { HouseholdData } from '../types';

interface CloudSyncModalProps {
  isOpen: boolean;
  householdData: HouseholdData;
  isOnline: boolean;
  isSyncing: boolean;
  onClose: () => void;
  onDataUpdated: (data: HouseholdData) => void;
  onShowToast: (msg: string, icon?: string) => void;
}

export function CloudSyncModal({
  isOpen,
  householdData,
  isOnline,
  isSyncing,
  onClose,
  onDataUpdated,
  onShowToast,
}: CloudSyncModalProps) {
  const [syncCodeInput, setSyncCodeInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(householdData.syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    onShowToast(`Copied Sync Code ${householdData.syncCode}!`, '📋');
  };

  const handleConnectDevice = async (e: FormEvent) => {
    e.preventDefault();
    if (!syncCodeInput.trim()) return;

    setLoading(true);
    setErrorMsg('');
    const res = await connectBySyncCode(syncCodeInput.trim());
    setLoading(false);

    if (res.success && res.data) {
      onDataUpdated(res.data);
      onShowToast(`Successfully paired device! Data synced.`, '🎉');
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleForceSync = async () => {
    setLoading(true);
    const success = await syncHouseholdToCloud(householdData);
    setLoading(false);
    if (success) {
      onShowToast('Cloud Firestore synced successfully!', '☁️');
    } else {
      onShowToast('Synced to local storage, cloud offline', '💾');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 z-10 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
              <Cloud className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Cloud Sync & Multi-Device
              </h3>
              <p className="text-[11px] text-slate-500">
                Firebase Firestore Real-Time Replication
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cloud Status Banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800">
                Firestore Cloud Database Active
              </div>
              <div className="text-[10px] text-slate-500">
                Last synced: {new Date(householdData.lastSyncedAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleForceSync}
            disabled={loading}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1 shadow-2xs transition"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-[#ff6b4a]' : ''}`} />
            <span>Sync</span>
          </button>
        </div>

        {/* Sync Code Box */}
        <div className="mt-4 p-4 rounded-2xl bg-orange-50/60 border border-orange-200/70 text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Your Household Device Sync Code
          </span>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="font-mono font-extrabold text-2xl tracking-widest text-[#ff6b4a]">
              {householdData.syncCode}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="p-1.5 rounded-lg bg-white shadow-2xs hover:bg-orange-100 text-[#ff6b4a] transition"
              title="Copy Sync Code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
            Enter this code on your mobile phone, tablet, or another browser to keep all your pets, vaccines, feedings, and memories in sync!
          </p>
        </div>

        {/* Connect Another Device Form */}
        <form onSubmit={handleConnectDevice} className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            Link from another device / Enter Sync Code:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={syncCodeInput}
              onChange={(e) => setSyncCodeInput(e.target.value)}
              placeholder="e.g. MILO-88"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold uppercase text-slate-800 focus:outline-none focus:border-[#ff6b4a] focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={loading || !syncCodeInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#ff6b4a] hover:bg-[#ed4d26] text-white font-bold text-xs shadow-sm transition disabled:opacity-50"
            >
              Connect
            </button>
          </div>
          {errorMsg && (
            <div className="p-2 rounded-lg bg-red-50 text-red-600 text-[11px] font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>

        {/* Sync Specs summary */}
        <div className="mt-5 grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50">
            <Smartphone className="w-4 h-4 text-slate-500 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Target Platform</span>
            <span className="font-bold text-slate-800">Mobile & Web Responsive</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50">
            <Database className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Cloud Storage</span>
            <span className="font-bold text-slate-800">Firestore Real-Time</span>
          </div>
        </div>
      </div>
    </div>
  );
}
