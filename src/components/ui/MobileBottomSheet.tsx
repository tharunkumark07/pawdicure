import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { triggerHaptic } from '../../lib/haptics';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  fullHeight?: boolean;
}

export function MobileBottomSheet({ isOpen, onClose, title, children, fullHeight = false }: MobileBottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      triggerHaptic('light');
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 overscroll-contain"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl flex flex-col will-change-transform ${
              fullHeight ? 'h-[90vh]' : 'max-h-[90vh]'
            }`}
          >
            {/* Drag Handle */}
            <div className="w-full pt-3 pb-2 flex justify-center shrink-0">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div className="px-5 pb-3 flex items-center justify-between shrink-0">
                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-50 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 pb-6 overscroll-contain safe-area-pb">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
