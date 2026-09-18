import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Shield,
  Pill,
  Stethoscope,
  Calendar,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  ChevronRight,
  Sparkles,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { AddVaccineModal } from '../components/AddVaccineModal';
import { AddMedicationModal } from '../components/AddMedicationModal';
import { AddVetVisitModal } from '../components/AddVetVisitModal';

interface HealthViewProps {
  initialSubTab?: 'overview' | 'vaccinations' | 'medications' | 'vet-visits';
}

export function HealthView({ initialSubTab = 'overview' }: HealthViewProps) {
  const {
    activePet,
    householdData,
    navigate,
    toggleVaccine,
    deleteVaccine,
    toggleMedication,
    snoozeMedication,
    deleteMedication,
    deleteVetVisit,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'vaccinations' | 'medications' | 'vet-visits'>(
    initialSubTab
  );

  const [isAddVaccineOpen, setIsAddVaccineOpen] = useState(false);
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [isAddVetOpen, setIsAddVetOpen] = useState(false);
  const [newAllergyInput, setNewAllergyInput] = useState('');
  const [showAllergyInput, setShowAllergyInput] = useState(false);

  const petVaccines = householdData.vaccines.filter((v) => v.petId === activePet.id);
  const petMeds = householdData.medications.filter((m) => m.petId === activePet.id);
  const petVisits = (householdData.vetVisits || []).filter((v) => v.petId === activePet.id);
  const weightPoints = (householdData.weightHistory || []).filter((w) => w.petId === activePet.id);

  return (
    <div className="flex flex-col w-full pb-10 space-y-4 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 rounded-3xl p-4 sm:p-5 border border-emerald-100 flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800 shadow-2xs mb-1">
            <Activity className="w-3 h-3 text-emerald-600" />
            <span>Veterinary Health Center</span>
          </span>
          <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900">
            {activePet.name}'s Medical Chart
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            {activePet.vetClinic || 'Bay Paws Veterinary Care Center'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/emergency')}
          className="px-3 py-2 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shrink-0"
        >
          <AlertCircle className="w-4 h-4" />
          <span>Emergency Pass</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100/80 rounded-2xl">
        <button
          type="button"
          onClick={() => {
            setActiveTab('overview');
            navigate('/health');
          }}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'overview'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Overview
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('vaccinations');
            navigate('/health/vaccinations');
          }}
          className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 ${
            activeTab === 'vaccinations'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Vaccines</span>
          {petVaccines.some((v) => !v.completed) && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('medications');
            navigate('/health/medications');
          }}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'medications'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Medications
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('vet-visits');
            navigate('/health/vet-visits');
          }}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'vet-visits'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Vet Visits
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: OVERVIEW */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Key Clinical Vitals */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Resting Heart Rate
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-slate-900 font-heading">
                  {activePet.restingBpm}
                </span>
                <span className="text-xs text-slate-400">BPM</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                Optimal rhythm
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Current Weight
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-slate-900 font-heading">
                  {activePet.weight}
                </span>
                <span className="text-xs text-slate-400">kg</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 mt-1 inline-block">
                Target: {activePet.weight} kg
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Blood Group
              </span>
              <div className="mt-1">
                <span className="text-base font-extrabold text-slate-900 font-heading">
                  {activePet.bloodType || 'DEA 1.1 Neg'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 truncate block mt-1">
                Chip: {activePet.microchipId?.slice(0, 8)}...
              </span>
            </div>
          </div>

          {/* Clinical Alerts / Reminders Pill */}
          {(() => {
            const pendingVaccine = petVaccines.find((v) => !v.completed || v.status === 'Overdue' || v.status === 'Upcoming');
            return pendingVaccine ? (
              <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-amber-900">
                    Upcoming Immunization Booster
                  </h4>
                  <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
                    {pendingVaccine.name} booster window opens on {pendingVaccine.dueDate}. Schedule with {pendingVaccine.vet}.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('vaccinations');
                        navigate('/health/vaccinations');
                      }}
                      className="px-3 py-1 rounded-xl bg-amber-600 text-white text-[11px] font-bold hover:bg-amber-700 transition"
                    >
                      View Vaccine Passport
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/reminders')}
                      className="px-3 py-1 rounded-xl bg-white text-amber-900 border border-amber-300 text-[11px] font-bold hover:bg-amber-100 transition"
                    >
                      Set Reminder
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-3xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-emerald-900">
                    All Immunizations Up-to-Date
                  </h4>
                  <p className="text-[11px] text-emerald-800/90 mt-0.5 leading-relaxed">
                    {activePet.name} is completely up-to-date with all clinical vaccinations and immunization booster windows!
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Find Clinics & Hospitals CTA Banner */}
          <div className="bg-slate-900 text-white p-4 rounded-3xl relative overflow-hidden flex items-center justify-between border border-slate-800 shadow-md">
            {/* Background design accents */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#ff6b4a]/20 blur-xl" />
            <div className="absolute right-12 top-2 w-12 h-12 rounded-full bg-emerald-500/10 blur-lg" />
            
            <div className="space-y-1 relative z-10 pr-2">
              <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block">Interactive Locator</span>
              <h3 className="font-heading font-black text-xs leading-tight">Find Vaccine Centres &amp; Hospitals</h3>
              <p className="text-[10px] text-slate-300 leading-relaxed max-w-[220px] sm:max-w-md">
                Locate certified vaccine clinics, low-cost booster centers, and 24/7 emergency pet hospitals near you.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => navigate('/health/clinics')}
              className="px-3.5 py-2 rounded-xl bg-[#ff6b4a] hover:bg-orange-600 text-white text-xs font-bold transition shrink-0 shadow-sm relative z-10 hover:scale-105 active:scale-95"
            >
              Find Care 🏥
            </button>
          </div>

          {/* Weight Growth / Stability Trend */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#ff6b4a]" />
                <h3 className="font-heading font-bold text-sm text-slate-900">
                  Weight Trend &amp; Stability
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Healthy BMI
              </span>
            </div>

            {/* Simple Visual Sparkline / Bar Graph */}
            <div className="flex items-end justify-between h-28 pt-4 px-2 gap-2 border-b border-slate-100">
              {weightPoints.map((w, idx) => {
                const heightPct = Math.min(100, Math.max(30, (w.weightKg / 32) * 100));
                return (
                  <div key={w.id} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-bold text-slate-700">
                      {w.weightKg}kg
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-lg transition-all ${
                        idx === weightPoints.length - 1
                          ? 'bg-gradient-to-t from-[#ff6b4a] to-[#ff937b]'
                          : 'bg-slate-200 hover:bg-slate-300'
                      }`}
                    />
                    <span className="text-[9px] text-slate-400 font-medium">
                      {w.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Allergies & Conditions */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Known Allergies &amp; Sensitivities
              </h3>
              <button
                type="button"
                onClick={() => setShowAllergyInput(!showAllergyInput)}
                className="text-xs font-bold text-[#ff6b4a] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Allergy</span>
              </button>
            </div>

            {showAllergyInput && (
              <div className="mb-3 flex items-center gap-2">
                <input
                  type="text"
                  value={newAllergyInput}
                  onChange={(e) => setNewAllergyInput(e.target.value)}
                  placeholder="e.g. Dairy, Bee Stings, Soy"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newAllergyInput.trim()) {
                      showToast(`Added allergy: ${newAllergyInput.trim()}`, 'info');
                      setNewAllergyInput('');
                      setShowAllergyInput(false);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#ff6b4a] text-white text-xs font-bold"
                >
                  Save
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              {activePet.allergies && activePet.allergies.length > 0 ? (
                activePet.allergies.map((allergy, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1"
                  >
                    <span>⚠️ {allergy}</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No known drug or food allergies recorded.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: VACCINATIONS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'vaccinations' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Immunization Passport ({petVaccines.length})
            </h3>
            <button
              type="button"
              onClick={() => setIsAddVaccineOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#ff6b4a] text-white text-xs font-bold hover:bg-[#ed4d26] transition flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vaccine</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {petVaccines.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs flex items-start justify-between gap-3 transition hover:border-orange-100"
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleVaccine(v.id)}
                    className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center transition ${
                      v.completed
                        ? 'bg-emerald-500 text-white'
                        : 'border-2 border-slate-300 text-transparent hover:border-slate-400'
                    }`}
                    title="Toggle completed"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {v.name}
                      </h4>
                      {v.alert ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-full">
                          Due Soon
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Administered: {v.administeredDate} • Next Due: <span className="font-bold text-slate-700">{v.dueDate}</span>
                    </p>

                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Clinic: {v.vet} {v.tagNumber ? `• Tag #${v.tagNumber}` : ''}
                    </p>

                    {v.notes && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl mt-2 border border-slate-100">
                        {v.notes}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteVaccine(v.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition shrink-0"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: MEDICATIONS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'medications' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Active Prescription &amp; Supplements ({petMeds.length})
            </h3>
            <button
              type="button"
              onClick={() => setIsAddMedOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#ff6b4a] text-white text-xs font-bold hover:bg-[#ed4d26] transition flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medication</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {petMeds.map((med) => (
              <div
                key={med.id}
                className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-2.5 transition hover:border-blue-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {med.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-blue-600 mt-0.5">
                        {med.dose} • {med.frequency}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Schedule: {med.schedule}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => snoozeMedication(med.id)}
                      className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold transition"
                      title="Snooze 1h"
                    >
                      Snooze
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMedication(med.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition"
                      title="Delete medication"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {med.notes && (
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    {med.notes}
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Status:{' '}
                    <span className={`font-bold ${med.takenToday ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {med.takenToday ? `Taken today (${med.lastTakenTime || 'Recorded'})` : 'Pending today'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleMedication(med.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      med.takenToday
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-[#ff6b4a] text-white hover:bg-[#ed4d26] shadow-2xs'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{med.takenToday ? 'Dose Given ✓' : 'Mark as Taken'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: VET VISITS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'vet-visits' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Clinical Records &amp; Consultations ({petVisits.length})
            </h3>
            <button
              type="button"
              onClick={() => setIsAddVetOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#ff6b4a] text-white text-xs font-bold hover:bg-[#ed4d26] transition flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Vet Visit</span>
            </button>
          </div>

          <div className="space-y-3">
            {petVisits.map((visit) => (
              <div
                key={visit.id}
                className="p-4 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-2.5 transition hover:border-purple-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      {visit.date}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                      {visit.reason}
                    </h4>
                    <p className="text-[11px] text-purple-700 font-semibold">
                      {visit.vetName} • {visit.clinic}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {visit.cost && (
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">
                        {visit.cost}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteVetVisit(visit.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                  <div className="text-slate-700">
                    <strong className="text-slate-900">Diagnosis:</strong> {visit.diagnosis}
                  </div>
                  <div className="text-slate-700">
                    <strong className="text-slate-900">Treatment:</strong> {visit.treatment}
                  </div>
                  {visit.notes && (
                    <div className="text-slate-600 italic mt-1">
                      "{visit.notes}"
                    </div>
                  )}
                </div>

                {visit.documents && visit.documents.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    {visit.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 text-[10px] font-bold"
                      >
                        <FileText className="w-3 h-3" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddVaccineModal isOpen={isAddVaccineOpen} onClose={() => setIsAddVaccineOpen(false)} />
      <AddMedicationModal isOpen={isAddMedOpen} onClose={() => setIsAddMedOpen(false)} />
      <AddVetVisitModal isOpen={isAddVetOpen} onClose={() => setIsAddVetOpen(false)} />
    </div>
  );
}
