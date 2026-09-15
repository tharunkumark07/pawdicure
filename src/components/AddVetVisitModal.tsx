import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Stethoscope, X, Building, Calendar, DollarSign, FileText } from 'lucide-react';

interface AddVetVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddVetVisitModal({ isOpen, onClose }: AddVetVisitModalProps) {
  const { activePet, addVetVisit } = useApp();
  const [vetName, setVetName] = useState('Dr. Elena Rostova');
  const [clinic, setClinic] = useState(activePet.vetClinic?.split('•')[0]?.trim() || 'Bay Paws Veterinary Specialty Center');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason for the clinical visit.');
      return;
    }
    if (!clinic.trim()) {
      setError('Please specify the clinic or hospital name.');
      return;
    }

    addVetVisit({
      petId: activePet.id,
      vetName: vetName.trim(),
      clinic: clinic.trim(),
      date,
      reason: reason.trim(),
      diagnosis: diagnosis.trim() || 'Routine examination normal.',
      treatment: treatment.trim() || 'Continued preventative wellness protocol.',
      notes: notes.trim(),
      cost: cost.trim() ? (cost.startsWith('$') ? cost.trim() : `$${cost.trim()}`) : undefined,
      documents: ['Clinical_Summary_' + date + '.pdf'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 z-10 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Log Veterinary Visit
              </h3>
              <p className="text-[11px] text-slate-500">For {activePet.name}</p>
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

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Attending Veterinarian *
              </label>
              <input
                type="text"
                value={vetName}
                onChange={(e) => setVetName(e.target.value)}
                placeholder="Dr. Elena Rostova"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Visit Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Veterinary Clinic / Hospital *
            </label>
            <input
              type="text"
              value={clinic}
              onChange={(e) => {
                setClinic(e.target.value);
                setError('');
              }}
              placeholder="e.g. Bay Paws Veterinary Specialty Center"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Reason for Visit *
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              placeholder="e.g. Annual Wellness Examination, Ear Infection, Limp"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Diagnosis / Findings
            </label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Musculoskeletal optimal, minor ear yeast accumulation"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Treatment / Prescriptions Given
            </label>
            <input
              type="text"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              placeholder="e.g. Ear flush, Otic drops 2x daily for 7 days"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Total Cost
              </label>
              <input
                type="text"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="$145.00"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Follow-up Needed?
              </label>
              <select className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]">
                <option>No follow-up needed</option>
                <option>Follow-up in 2 weeks</option>
                <option>Follow-up in 1 month</option>
                <option>Annual checkup next year</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Clinical Notes &amp; Recommendations
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Vital signs normal. Heart clear. Recommended weight maintained."
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a] resize-none"
            />
          </div>

          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#ff6b4a] hover:bg-[#ed4d26] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
