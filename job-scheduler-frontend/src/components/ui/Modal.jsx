import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export function Modal({ open, onClose, title, subtitle, children, footer, width = "max-w-lg" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative z-10 w-full rounded-xl border border-border-light bg-surface shadow-panel", width)}>
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="font-display text-sm font-semibold text-ink">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-ink-dim">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-ink-faint hover:bg-surface-hover hover:text-ink">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-border px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

export function Drawer({ open, onClose, title, subtitle, badge, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-border-light bg-surface shadow-panel">
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
              {badge}
            </div>
            {subtitle && <p className="mt-1 font-mono text-xs text-ink-dim">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-ink-faint hover:bg-surface-hover hover:text-ink">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-border px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
