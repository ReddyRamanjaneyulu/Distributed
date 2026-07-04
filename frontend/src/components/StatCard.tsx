import clsx from 'clsx';
import type { ComponentType, SVGProps } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  accent?: 'default' | 'ok' | 'warn' | 'danger' | 'dead';
  hint?: string;
}

const ACCENT_STYLES: Record<NonNullable<StatCardProps['accent']>, string> = {
  default: 'text-accent bg-accent/10',
  ok: 'text-ok bg-ok/10',
  warn: 'text-warn bg-warn/10',
  danger: 'text-danger bg-danger/10',
  dead: 'text-dead bg-dead/10',
};

export function StatCard({ label, value, icon: Icon, accent = 'default', hint }: StatCardProps) {
  return (
    <div className="panel animate-slideUp flex items-center gap-4 p-5">
      {Icon && (
        <div className={clsx('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', ACCENT_STYLES[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      )}

      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-ink-faint">
          {label}
        </p>
        <p className="mt-1 font-display text-2xl font-semibold text-ink">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-ink-muted">{hint}</p>}
      </div>
    </div>
  );
}
