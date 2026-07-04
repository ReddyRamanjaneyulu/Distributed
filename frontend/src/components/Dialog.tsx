import { AnimatePresence, motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, type ReactNode } from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Dialog({ isOpen, onClose, title, description, children, maxWidth = 'max-w-lg' }: DialogProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            className={`panel relative w-full ${maxWidth} p-6`}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="dialog-title" className="font-display text-lg font-semibold text-ink">
                  {title}
                </h2>
                {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
              </div>

              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-canvas-subtle hover:text-ink"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
