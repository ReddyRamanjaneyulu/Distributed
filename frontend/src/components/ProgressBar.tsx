import clsx from 'clsx';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'accent' | 'ok' | 'warn' | 'danger';
  className?: string;
  showLabel?: boolean;
}

const VARIANT_STYLES: Record<NonNullable<ProgressBarProps['variant']>, string> = {
  accent: 'bg-accent',
  ok: 'bg-ok',
  warn: 'bg-warn',
  danger: 'bg-danger',
};

export function ProgressBar({
  value,
  max = 100,
  variant = 'accent',
  className,
  showLabel = false,
}: ProgressBarProps) {
  const pct = max === 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-canvas-subtle">
        <div
          className={clsx('h-full rounded-full transition-all duration-500', VARIANT_STYLES[variant])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="w-10 shrink-0 text-right text-xs text-ink-muted">{pct.toFixed(0)}%</span>
      )}
    </div>
  );
}
