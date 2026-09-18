import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Pet } from '../types';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DeletePetModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: Pet;
}

export function DeletePetModal({ isOpen, onClose, pet }: DeletePetModalProps) {
  const { deletePet } = useApp();
  const [typedName, setTypedName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !pet) return null;

  const isMatch = typedName.trim().toLowerCase() === pet.name.trim().toLowerCase();

  const handleDelete = async () => {
    if (!isMatch) {
      setError(`Please type "${pet.name}" exactly to confirm deletion.`);
      return;
    }

    setIsDeleting(true);
    try {
      await deletePet(pet.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting pet profile.');
      setIsDeleting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 pointer-events-auto">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-red-100 z-10 space-y-4 max-h-[90vh] overflow-y-auto my-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shadow-2xs shrink-0">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading font-black text-lg text-slate-900">
                Delete Pet Profile
              </h2>
              <p className="text-xs text-red-600 font-bold">
                Permanent Database Erase
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pet details card */}
        <div className="p-3.5 rounded-2xl bg-red-50/60 border border-red-100 flex items-center gap-3">
          <img
            src={pet.avatarUrl}
            alt={pet.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-red-200"
          />
          <div>
            <div className="font-heading font-bold text-slate-900 text-base">
              {pet.name}
            </div>
            <div className="text-xs text-slate-600">
              {pet.breed} • {pet.species} • {pet.gender}
            </div>
          </div>
        </div>

        {/* Warning text */}
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-1.5 text-red-600 font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>This action cannot be undone!</span>
          </div>
          <p>
            Deleting <strong>{pet.name}</strong> will permanently erase all associated data from local state and cloud database:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-500 pl-1">
            <li>Medical charts, vaccines &amp; medications</li>
            <li>Daily feeding logs, calories &amp; weight history</li>
            <li>Bond memories, photo album &amp; trophies</li>
            <li>Custom care safety settings &amp; emergency notes</li>
          </ul>
        </div>

        {/* Confirmation Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Type <span className="text-red-600 font-mono underline">{pet.name}</span> to confirm permanent deletion:
          </label>
          <input
            type="text"
            value={typedName}
            onChange={(e) => {
              setTypedName(e.target.value);
              setError('');
            }}
            placeholder={pet.name}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
          />
          {error && (
            <p className="text-[11px] font-bold text-red-600 mt-1">
              {error}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="pt-2 flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!isMatch || isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Erasing...' : 'Permanently Delete'}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
