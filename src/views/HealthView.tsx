import { useState, FormEvent } from 'react';
import {
  Pet,
  VaccineRecord,
  MedicationRecord,
  HealthMilestone,
  DocumentVaultItem,
} from '../types';
import {
  CheckCircle2,
  AlertCircle,
  Plus,
  Clock,
  History,
  Lock,
  FileText,
  Upload,
  Cpu,
  Bot,
  Send,
  Sparkles,
  Check,
  Calendar,
} from 'lucide-react';

interface HealthViewProps {
  pet: Pet;
  vaccinationHistory: VaccineRecord[];
  medications: MedicationRecord[];
  milestones: HealthMilestone[];
  documents: DocumentVaultItem[];
  onOpenEmergency: () => void;
  onToggleMedication: (medId: string) => void;
  onToggleVaccine: (vacId: string) => void;
  onOpenAddVaccine: () => void;
  onUploadDoc: () => void;
  onShowToast: (msg: string, icon?: string) => void;
}

const AI_NURSE_PRESETS: Record<string, string> = {
  'Pre-booster prep 💉':
    "Ensure Milo is well-rested and hydrated. Avoid intense cardio 2 hours prior to the DHPP appointment. You can feed him a light meal since fasting is not required for booster vaccines.",
  'Post-vaccine care 🐾':
    "Mild lethargy for 24-36 hours is standard. Provide a quiet, plush sleeping bed, plenty of fresh water, and monitor for any facial puffiness or unusual hives.",
  'Salmon oil benefits 🐟':
    "Milo receives high EPA/DHA fatty acids supporting skin moisture barrier, shiny coat luster, and joint flexibility complementing his Glucosamine chew.",
  'Tick prevention 🌿':
    "NexGard Spectra covers fleas, ticks, and heartworm with a single chew. Best administered after mealtime once every 30 days.",
};

export function HealthView({
  pet,
  vaccinationHistory,
  medications,
  milestones,
  documents,
  onOpenEmergency,
  onToggleMedication,
  onToggleVaccine,
  onOpenAddVaccine,
  onUploadDoc,
  onShowToast,
}: HealthViewProps) {
  const [aiQuery, setAiQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAskAi = (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    setIsAiLoading(true);
    setAiAnswer(null);

    setTimeout(() => {
      setIsAiLoading(false);
      const matched = Object.entries(AI_NURSE_PRESETS).find(([key]) =>
        q.toLowerCase().includes(key.toLowerCase().slice(0, 10))
      );

      if (matched) {
        setAiAnswer(matched[1]);
      } else {
        setAiAnswer(
          `Based on ${pet.name}'s medical profile (${pet.weight} kg, ${pet.breed}, last exam Oct 6), vitals are optimal! For "${q}", ensure moderate hydration, consistent feeding times, and review with Dr. Elena Rostova at Bay Paws Clinic if symptoms persist.`
        );
      }
    }, 450);
  };

  return (
    <div className="flex flex-col w-full pb-8 space-y-4 animate-in fade-in duration-200">
      {/* Top Priority Quick-Access Emergency Bar */}
      <div className="w-full flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-[var(--text)]">
            Health &amp; Records Hub
          </span>
        </div>
        {/* Emergency Pet Profile Trigger */}
        <button
          id="health-emergency-pass-btn"
          type="button"
          onClick={onOpenEmergency}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold shadow-xs transition-transform active:scale-95"
        >
          <span>🚨</span>
          <span>Emergency Pass</span>
        </button>
      </div>

      {/* Primary Pet Vitality Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-4 sm:p-5 shadow-xs border border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-13 h-13 rounded-2xl overflow-hidden shrink-0 shadow-inner">
              <img
                src={pet.avatarUrl}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-heading font-extrabold text-base text-slate-900 truncate">
                  {pet.name}
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Up-to-Date</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                {pet.vetClinic}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Last Full Exam: 18 days ago (Oct 6)
              </p>
            </div>
          </div>

          <button
            id="log-rx-btn"
            type="button"
            onClick={onOpenAddVaccine}
            className="shrink-0 px-3 py-1.5 rounded-full bg-[var(--primary)] hover:opacity-90 text-white text-xs font-bold shadow-xs transition-transform active:scale-95 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Rx</span>
          </button>
        </div>

        {/* Quick Biometrics Ribbon */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 bg-slate-50 rounded-2xl p-2.5 border border-slate-100/80">
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold">
              Weight
            </span>
            <span className="font-heading font-extrabold text-base text-slate-800">
              {pet.weight}{' '}
              <span className="text-[11px] font-normal text-slate-500">kg</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">
              Optimal BMI
            </span>
          </div>

          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold">
              Resting Pulse
            </span>
            <span className="font-heading font-extrabold text-base text-slate-800">
              {pet.restingBpm}{' '}
              <span className="text-[11px] font-normal text-slate-500">bpm</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">
              Restful
            </span>
          </div>

          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold">
              Hydration
            </span>
            <span className="font-heading font-extrabold text-base text-slate-800">
              Good
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">
              Skin turgor 1s
            </span>
          </div>
        </div>
      </div>

      {/* Preventive Immunization & Care Schedule */}
      <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-xs border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Preventive &amp; Vaccines
            </h3>
          </div>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-full">
            1 Due Soon
          </span>
        </div>

        <div className="space-y-2.5">
          {(vaccinationHistory || []).map((vac) => (
            <div
              key={vac.id}
              className={`p-3 rounded-2xl border transition-all ${
                vac.alert
                  ? 'bg-amber-50/50 border-amber-200/80'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex items-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => onToggleVaccine(vac.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition ${
                      vac.completed
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-white border border-slate-300 hover:border-[var(--primary)]'
                    }`}
                  >
                    {vac.completed && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <div>
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {vac.name}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {vac.status}
                    </p>
                  </div>
                </div>

                {vac.alert ? (
                  <button
                    type="button"
                    onClick={() =>
                      onShowToast(
                        `Bay Paws Clinic booked for ${vac.name} on Nov 7!`,
                        '📅'
                      )
                    }
                    className="shrink-0 px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold shadow-2xs transition active:scale-95"
                  >
                    Book Visit
                  </button>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                    🟢 Valid
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medication & Daily Supplement Routine */}
      <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-xs border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Medications &amp; Supplements
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
            2 Active
          </span>
        </div>

        <div className="space-y-2">
          {medications.map((med) => (
            <div
              key={med.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                  💊
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {med.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {med.dose} • {med.schedule}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleMedication(med.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  med.takenToday
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-white border border-slate-300 hover:border-[var(--primary)] text-slate-700'
                }`}
              >
                {med.takenToday ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Given</span>
                  </>
                ) : (
                  <span>Give Dose</span>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Treatment History note */}
        <div className="pt-1">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>Ear Cleanser Tx • Resolved Sep 12</span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">
              Bay Paws Dr. Rostova
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Health Milestone Flow */}
      <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-xs border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Health Milestone Flow
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">
            2024 Schedule
          </span>
        </div>

        <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {milestones.map((ms) => (
            <div key={ms.id} className="relative">
              <span
                className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full ring-4 ring-white ${
                  ms.status === 'completed'
                    ? 'bg-emerald-500'
                    : ms.status === 'upcoming'
                    ? 'bg-amber-500 animate-pulse'
                    : 'bg-blue-400'
                }`}
              />
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900">
                    {ms.title}
                  </p>
                  <span
                    className={`text-[10px] font-bold ${
                      ms.status === 'upcoming'
                        ? 'text-amber-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {ms.date}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {ms.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Documents Vault */}
      <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-xs border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--primary)]" />
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Verified Documents Vault
            </h3>
          </div>
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <Cpu className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-bold text-emerald-700">
                  {doc.type}
                </span>
              </div>
              <div className="mt-2.5">
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  {doc.title}
                </p>
                <p className="text-xs font-mono font-bold text-slate-900 truncate">
                  {doc.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Medical Record button */}
        <button
          id="upload-medical-record-btn"
          type="button"
          onClick={onUploadDoc}
          className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>+ Upload Medical Record / Lab Results</span>
        </button>
      </div>

      {/* PAWdiCURE AI Health Companion Widget */}
      <div className="rounded-3xl bg-[var(--primary-light)] p-4 sm:p-5 border border-[var(--primary-border)] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center shadow-2xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-slate-900">
              PAWdiCURE AI Pet Nurse
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-bold">
            24/7 Companion
          </span>
        </div>

        <p className="text-xs text-slate-600">
          Ask about {pet.name}'s upcoming booster, food sensitivities, or comfort rituals:
        </p>

        {/* Quick Question Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {Object.keys(AI_NURSE_PRESETS).map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setAiQuery(chip);
                handleAskAi(chip);
              }}
              className="shrink-0 px-3 py-1 rounded-full bg-white hover:bg-orange-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs transition"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Interactive AI input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskAi(aiQuery);
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder={`Ask anything about ${pet.name}'s health...`}
            className="w-full h-10 pl-3.5 pr-10 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:border-[var(--primary)]"
          />
          <button
            type="submit"
            className="absolute right-1 w-8 h-8 rounded-lg bg-[var(--primary)] hover:opacity-90 text-white flex items-center justify-center transition active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Response Box */}
        {(aiAnswer || isAiLoading) && (
          <div className="p-3.5 rounded-2xl bg-white border border-orange-100 shadow-xs space-y-1 animate-in fade-in">
            <div className="flex items-center gap-1.5 text-[var(--primary)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">
                {pet.name}'s Personalized Guidance
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed min-h-[3rem] flex items-center">
              {isAiLoading ? (
                <span className="flex items-center gap-2 italic text-slate-500 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Reviewing {pet.name}'s medical history & care data…
                </span>
              ) : aiAnswer}
            </p>
          </div>
        )}

        <p className="text-[10px] text-slate-400 leading-tight">
          ℹ️ AI guidance is informational and does not replace professional veterinary diagnostics or clinical emergency intervention.
        </p>
      </div>
    </div>
  );
}
