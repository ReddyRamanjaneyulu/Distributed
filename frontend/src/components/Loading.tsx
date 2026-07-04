import clsx from 'clsx';

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={clsx('animate-spin text-accent', className)}
      viewBox="0 0 24 24"
      fill="none"
      width={20}
      height={20}
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PageLoading({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex h-64 w-full flex-col items-center justify-center gap-3 text-ink-muted">
      <Spinner className="h-8 w-8" />
      <p className="text-sm">{label}…</p>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx('animate-pulseSoft rounded-md bg-canvas-subtle', className)}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-3">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-9 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
