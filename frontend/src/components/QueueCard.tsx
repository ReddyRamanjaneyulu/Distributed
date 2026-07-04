import { Link } from 'react-router-dom';
import { PauseIcon, PlayIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

import { StatusChip } from './StatusChip';
import { ProgressBar } from './ProgressBar';

import type { Queue } from '../types';

interface QueueCardProps {
  queue: Queue;
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  isMutating?: boolean;
}

export function QueueCard({ queue, onPause, onResume, isMutating }: QueueCardProps) {
  return (
    <div className="panel animate-slideUp flex flex-col gap-4 p-5 transition-shadow hover:shadow-glow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/queues/${queue.id}`}
            className="truncate font-display text-base font-semibold text-ink hover:text-accent"
          >
            {queue.name}
          </Link>
          {queue.description && (
            <p className="mt-0.5 truncate text-xs text-ink-muted">{queue.description}</p>
          )}
        </div>

        <StatusChip status={queue.status} />
      </div>

      <div className="flex items-center gap-4 text-xs text-ink-muted">
        <span>Priority {queue.priority}</span>
        <span>·</span>
        <span>Concurrency {queue.concurrency}</span>
        <span>·</span>
        <span>Timeout {queue.visibilityTimeout}s</span>
      </div>

      {queue.project && (
        <ProgressBar
          value={queue.paused ? 0 : 100}
          variant={queue.paused ? 'warn' : 'ok'}
          className="pt-1"
        />
      )}

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="truncate text-xs text-ink-faint">
          {queue.project?.name ?? 'No project'}
        </span>

        <div className="flex items-center gap-1">
          {queue.paused ? (
            <button
              onClick={() => onResume?.(queue.id)}
              disabled={isMutating}
              className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-canvas-subtle hover:text-ok disabled:opacity-40"
              title="Resume queue"
            >
              <PlayIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => onPause?.(queue.id)}
              disabled={isMutating}
              className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-canvas-subtle hover:text-warn disabled:opacity-40"
              title="Pause queue"
            >
              <PauseIcon className="h-4 w-4" />
            </button>
          )}

          <Link
            to={`/queues/${queue.id}`}
            className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-canvas-subtle hover:text-ink"
            title="Queue details"
          >
            <Cog6ToothIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
