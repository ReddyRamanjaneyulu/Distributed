import clsx from 'clsx';

import type { JobStatus, QueueStatus, WorkerStatus } from '../types';

type AnyStatus = JobStatus | QueueStatus | WorkerStatus;

const STATUS_STYLES: Record<AnyStatus, string> = {
  QUEUED: 'bg-ink-faint/15 text-ink-muted border-ink-faint/30',
  CLAIMED: 'bg-accent/15 text-accent border-accent/30',
  RUNNING: 'bg-accent/15 text-accent border-accent/30',
  COMPLETED: 'bg-ok/15 text-ok border-ok/30',
  FAILED: 'bg-danger/15 text-danger border-danger/30',
  RETRYING: 'bg-warn/15 text-warn border-warn/30',
  CANCELLED: 'bg-ink-faint/15 text-ink-muted border-ink-faint/30',
  DEAD: 'bg-dead/15 text-dead border-dead/30',

  ACTIVE: 'bg-ok/15 text-ok border-ok/30',
  PAUSED: 'bg-warn/15 text-warn border-warn/30',
  ARCHIVED: 'bg-ink-faint/15 text-ink-muted border-ink-faint/30',

  ONLINE: 'bg-ok/15 text-ok border-ok/30',
  OFFLINE: 'bg-ink-faint/15 text-ink-muted border-ink-faint/30',
  DRAINING: 'bg-warn/15 text-warn border-warn/30',
};

const PULSE_STATUSES = new Set<AnyStatus>(['RUNNING', 'CLAIMED', 'ONLINE']);

interface StatusChipProps {
  status: AnyStatus;
  className?: string;
}

export function StatusChip({ status, className }: StatusChipProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide',
        STATUS_STYLES[status],
        className,
      )}
    >
      <span
        className={clsx(
          'h-1.5 w-1.5 rounded-full bg-current',
          PULSE_STATUSES.has(status) && 'animate-pulseSoft',
        )}
      />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
