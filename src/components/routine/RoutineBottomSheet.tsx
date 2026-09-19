import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface RoutineBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function RoutineBottomSheet({ isOpen, onClose, title, children }: RoutineBottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-2xl bg-[var(--card-bg)] border-t border-[var(--card-border)] rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="p-4 sm:p-5 border-b border-[var(--card-border)] flex items-center justify-between shrink-0">
          <h3 className="text-base font-heading font-black text-[var(--text)]">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--background-alt)] hover:bg-[var(--card-border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
