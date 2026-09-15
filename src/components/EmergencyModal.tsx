import { useState } from 'react';
import { PhoneCall, Phone, Share2, X, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { Pet } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  pet: Pet;
  onClose: () => void;
}

export function EmergencyModal({ isOpen, pet, onClose }: EmergencyModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSharePass = () => {
    const text = `PAWdiCURE EMERGENCY PASS\nPet: ${pet.name} (${pet.species}, ${pet.breed})\nWeight: ${pet.weight} kg | Microchip: ${pet.microchipId}\nBlood Type: ${pet.bloodType}\nKnown Allergies: ${pet.allergies.join(', ')}\nPrimary Clinic: ${pet.vetClinic}\nOwner: Sarah M. (+1 555-019-2834)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Container */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-red-100 z-10 max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-base text-slate-900 leading-tight">
                Emergency Pet Profile
              </h4>
              <p className="text-[11px] font-bold text-red-600">
                Immediate Veterinary Emergency Reference
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

        {/* Pet Basic ID card */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <img
            src={pet.avatarUrl}
            alt={pet.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-red-300"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-heading font-extrabold text-base text-slate-800">
                {pet.name}
              </h3>
              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                Rapid Access
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {pet.breed} • {pet.age} • {pet.weight} kg
            </p>
            <p className="text-[11px] text-slate-600 font-semibold truncate">
              {pet.vetClinic}
            </p>
          </div>
        </div>

        {/* Quick Vitals Snapshot */}
        <div className="mt-3.5 p-3.5 rounded-2xl bg-red-50/70 border border-red-100 space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-700">Known Allergies:</span>
            <span className="font-bold text-red-700 px-2 py-0.5 rounded bg-white shadow-2xs">
              {pet.allergies.join(', ')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-700">Blood Type:</span>
            <span className="font-bold text-slate-900">{pet.bloodType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-700">Microchip ID:</span>
            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded shadow-2xs">
              {pet.microchipId}
            </span>
          </div>
        </div>

        {/* Contact Actions */}
        <div className="mt-4 space-y-2">
          <a
            href="tel:5550192834"
            className="w-full py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 24/7 ER Vet: Bay Paws Emergency</span>
          </a>

          <a
            href="tel:5550199999"
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>Call Primary Parent (Sarah M.)</span>
          </a>

          <button
            type="button"
            onClick={handleSharePass}
            className="w-full py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-[#ff6b4a] font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied pass to clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Emergency Card Link to Clinic</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
