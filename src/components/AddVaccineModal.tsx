import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, X, Calendar, UserCheck, Tag, FileText } from 'lucide-react';

interface AddVaccineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddVaccineModal({ isOpen, onClose }: AddVaccineModalProps) {
  const { activePet, addVaccine, showToast } = useApp();
  const [name, setName] = useState('');
  const [administeredDate, setAdministeredDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [dueDate, setDueDate] = useState('');
  const [vet, setVet] = useState(activePet.vetClinic || 'Bay Paws Veterinary Clinic');
  const [tagNumber, setTagNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter the vaccine name.');
      return;
    }
    if (!dueDate) {
      setError('Please select the next booster due date.');
      return;
    }

    addVaccine({
      petId: activePet.id,
      name: name.trim(),
      status: 'Verified Current',
      alert: false,
      administeredDate,
      dueDate,
      vet: vet.trim(),
      tagNumber: tagNumber.trim() || undefined,
      notes: notes.trim() || undefined,
      completed: true,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 z-10 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Add Immunization Record
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
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Vaccine Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="e.g. DHPP 5-in-1 Core Booster"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Administered Date *
              </label>
              <input
                type="date"
                value={administeredDate}
                onChange={(e) => setAdministeredDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Next Due Date *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Veterinary Clinic / Administering Vet
            </label>
            <input
              type="text"
              value={vet}
              onChange={(e) => setVet(e.target.value)}
              placeholder="e.g. Bay Paws Veterinary • Dr. Elena Rostova"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Serial / Tag / Certificate #
            </label>
            <input
              type="text"
              value={tagNumber}
              onChange={(e) => setTagNumber(e.target.value)}
              placeholder="e.g. RAB-992018-CA"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff6b4a]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Clinical Notes / Reactions
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Subcutaneous injection; no adverse reactions observed."
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
              Save Vaccine Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
