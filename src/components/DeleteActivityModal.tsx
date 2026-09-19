import React, { useState } from 'react';
import { PetActivityRecord } from '../types';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: PetActivityRecord | null;
  onConfirm: (activity: PetActivityRecord) => Promise<void>;
}

export const DeleteActivityModal: React.FC<DeleteActivityModalProps> = ({
  isOpen,
  onClose,
  activity,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !activity) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(activity);
      onClose();
    } catch (err) {
      console.error('Failed to delete activity:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-heading font-black text-[var(--text)] tracking-tight">
            Remove this activity?
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            "{activity.title}" ({activity.durationMinutes ? `${activity.durationMinutes} min • ` : ''}{activity.startTime}) will be removed. Your daily care statistics and XP will be updated.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-[var(--bg)] hover:bg-[var(--card-border)]/40 text-xs font-bold text-[var(--text-muted)] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Removing...' : 'Delete Activity'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
