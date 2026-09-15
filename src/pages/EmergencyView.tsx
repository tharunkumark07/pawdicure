import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Phone,
  AlertTriangle,
  Heart,
  Pill,
  Shield,
  Copy,
  Check,
  Building,
  User,
  Activity,
  ArrowLeft,
} from 'lucide-react';

export function EmergencyView() {
  const { activePet, householdData, navigate, showToast } = useApp();
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const petVaccines = householdData.vaccines.filter((v) => v.petId === activePet.id);
  const petMeds = householdData.medications.filter((m) => m.petId === activePet.id);

  const handleCopyPass = () => {
    const text = `🚨 PAWdiCURE EMERGENCY PET PASS 🚨
Pet: ${activePet.name} (${activePet.species}, ${activePet.breed})
Age: ${activePet.age} | Weight: ${activePet.weight} kg | Blood: ${activePet.bloodType || 'DEA 1.1 Neg'}
Microchip ID: ${activePet.microchipId}
ALLERGIES: ${activePet.allergies?.join(', ') || 'None recorded'}
Active Meds: ${petMeds.map((m) => m.name).join(', ') || 'None'}
Owner Contact: ${activePet.emergencyContact || 'Sarah Miller'} (${activePet.emergencyPhone || '+1 555 019 2834'})
Preferred Clinic: ${activePet.vetClinic || 'Bay Paws Specialty 24/7'}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      showToast('Emergency medical pass copied to clipboard!', 'success', '📋');
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div
      className={`flex flex-col w-full pb-14 space-y-4 animate-in fade-in duration-200 ${
        emergencyMode ? 'bg-red-950/20 -m-4 p-4 rounded-3xl' : ''
      }`}
    >
      {/* Top Banner with Back and Emergency Toggle */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const next = !emergencyMode;
            setEmergencyMode(next);
            showToast(
              next ? '🚨 EMERGENCY MODE ENGAGED!' : 'Emergency mode disabled',
              next ? 'error' : 'info'
            );
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition ${
            emergencyMode
              ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/40'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{emergencyMode ? 'Emergency Active' : 'Toggle SOS Mode'}</span>
        </button>
      </div>

      {/* Primary Emergency Card */}
      <div className="bg-red-600 text-white rounded-3xl p-5 shadow-xl shadow-red-600/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={activePet.avatarUrl}
              alt={activePet.name}
              className="w-16 h-16 rounded-2xl object-cover ring-3 ring-white shadow-md"
            />
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full inline-block">
                EMERGENCY MEDICAL PASS
              </span>
              <h1 className="font-heading font-black text-2xl mt-0.5">
                {activePet.name}
              </h1>
              <p className="text-xs text-red-100 font-semibold">
                {activePet.breed} • {activePet.age} • {activePet.weight} kg
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyPass}
            className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex flex-col items-center gap-1 transition"
            title="Copy Pass text"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span className="text-[9px]">{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>

        {/* Microchip & Blood */}
        <div className="grid grid-cols-2 gap-2 bg-black/20 p-3 rounded-2xl text-xs">
          <div>
            <span className="text-red-200 text-[10px] uppercase font-bold block">
              ISO Microchip #
            </span>
            <span className="font-mono font-bold text-white text-xs select-all">
              {activePet.microchipId}
            </span>
          </div>
          <div>
            <span className="text-red-200 text-[10px] uppercase font-bold block">
              Canine Blood Type
            </span>
            <span className="font-bold text-white text-xs">
              {activePet.bloodType || 'DEA 1.1 Negative'}
            </span>
          </div>
        </div>

        {/* CRITICAL ALLERGIES IN HIGH VISIBILITY RED */}
        <div className="bg-white text-slate-900 p-3.5 rounded-2xl space-y-1">
          <div className="flex items-center gap-1.5 text-red-600 font-black text-xs uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4" />
            <span>KNOWN ALLERGIES &amp; CONTRAINDICATIONS</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {activePet.allergies && activePet.allergies.length > 0 ? (
              activePet.allergies.map((allergy, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-red-100 text-red-800 text-xs font-black"
                >
                  ⛔ {allergy}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">No known drug allergies.</span>
            )}
          </div>
        </div>
      </div>

      {/* Immediate 1-Tap Emergency Phone Contacts */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-3">
        <h3 className="font-heading font-bold text-xs text-slate-400 uppercase tracking-wider">
          Immediate 1-Tap Emergency Contacts
        </h3>

        {/* Owner Contact */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#ff6b4a] flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {activePet.emergencyContact || 'Sarah Miller (Primary Caregiver)'}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {activePet.emergencyPhone || '+1 (555) 019-2834'}
              </div>
            </div>
          </div>

          <a
            href={`tel:${activePet.emergencyPhone || '+15550192834'}`}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call</span>
          </a>
        </div>

        {/* Veterinary Emergency Hospital */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Bay Paws 24/7 Veterinary Trauma ICU
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                +1 (555) 019-VETS (8387)
              </div>
            </div>
          </div>

          <a
            href="tel:+15550198387"
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call 24/7</span>
          </a>
        </div>

        {/* National ASPCA Animal Poison Control */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900">
                ASPCA Poison Control Center
              </div>
              <div className="text-[11px] text-amber-700 font-mono">
                +1 (888) 426-4435
              </div>
            </div>
          </div>

          <a
            href="tel:+18884264435"
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call</span>
          </a>
        </div>
      </div>

      {/* Active Medications & Vaccines Quick Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Pill className="w-4 h-4 text-blue-600" />
            <span>Active Medications</span>
          </div>
          {petMeds.length > 0 ? (
            <ul className="space-y-1 text-[11px] text-slate-600">
              {petMeds.map((m) => (
                <li key={m.id} className="truncate">
                  • <strong>{m.name}</strong> ({m.dose})
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-[11px] text-slate-400 italic">None active</span>
          )}
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Core Vaccines</span>
          </div>
          <ul className="space-y-1 text-[11px] text-slate-600">
            {petVaccines.slice(0, 3).map((v) => (
              <li key={v.id} className="truncate">
                • {v.name.split(' ')[0]} ({v.status})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
