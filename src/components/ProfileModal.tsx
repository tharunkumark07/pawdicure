import { Pet, HouseholdData } from '../types';
import { User, ShieldCheck, Phone, Mail, MapPin, X, PlusCircle, Cloud } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileModalProps {
  isOpen: boolean;
  activePet: Pet;
  householdData: HouseholdData;
  onClose: () => void;
  onOpenSync: () => void;
  onOpenAddPet: () => void;
}

export function ProfileModal({
  isOpen,
  activePet,
  householdData,
  onClose,
  onOpenSync,
  onOpenAddPet,
}: ProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%', opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 z-10 max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#ff6b4a]" />
            <h3 className="font-heading font-bold text-base text-slate-900">
              Household &amp; Pet Profile
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

        {/* Primary Pet Badge */}
        <div className="mt-4 p-4 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
          <img
            src={activePet.avatarUrl}
            alt={activePet.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-orange-200 shadow-2xs"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-black text-lg text-slate-900">
                {activePet.name}
              </h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Active Companion
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {activePet.breed} • {activePet.age} • {activePet.weight} kg
            </p>
            <p className="text-[11px] text-slate-600 font-mono mt-0.5">
              Chip: {activePet.microchipId}
            </p>
          </div>
        </div>

        {/* Primary Caretaker Information */}
        <div className="mt-4 space-y-2.5 text-xs">
          <span className="text-xs font-bold text-slate-700 block">
            Primary Caretaker
          </span>
          <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Sarah"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Sarah M.</span>
                  <span className="text-[10px] text-slate-400">Owner &amp; Admin</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#ae3115] bg-orange-50 px-2 py-0.5 rounded-full">
                Pro Member
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600 text-[11px]">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+1 (555) 019-2834</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>sarah@pawdicure.app</span>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Device & Cloud Sync Access */}
        <div className="mt-4 p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cloud className="w-5 h-5 text-[#ff6b4a]" />
            <div>
              <div className="text-xs font-bold text-slate-900">
                Sync Code: {householdData.syncCode}
              </div>
              <div className="text-[10px] text-slate-600">
                Firestore cloud persistence enabled
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSync();
            }}
            className="px-3 py-1.5 rounded-xl bg-[#ff6b4a] hover:bg-[#ed4d26] text-white text-xs font-bold shadow-2xs transition"
          >
            Manage Sync
          </button>
        </div>

        {/* Add Companion CTA */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAddPet();
            }}
            className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Another Pet Profile</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
