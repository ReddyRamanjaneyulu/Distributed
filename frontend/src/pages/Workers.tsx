import { useState } from 'react';
import { ServerStackIcon, PowerIcon } from '@heroicons/react/24/outline';

import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { StatusChip } from '../components/StatusChip';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { TableSkeleton } from '../components/Loading';
import { Dialog } from '../components/Dialog';

import { useShutdownWorker, useWorkers } from '../hooks/useWorkers';
import { formatRelativeTime } from '../utils/formatters';

import type { Worker } from '../types';

const PAGE_SIZE = 12;

export default function Workers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [confirmTarget, setConfirmTarget] = useState<Worker | null>(null);

  const { data, isLoading } = useWorkers({ page, limit: PAGE_SIZE, search });
  const shutdownMutation = useShutdownWorker();

  async function confirmShutdown() {
    if (!confirmTarget) return;
    await shutdownMutation.mutateAsync(confirmTarget.id);
    setConfirmTarget(null);
  }

  return (
    <div className="space-y-4">
      <div className="w-full max-w-xs">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search workers…" />
      </div>

      {isLoading ? (
        <div className="panel p-4">
          <TableSkeleton rows={4} cols={4} />
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((worker) => (
              <div key={worker.id} className="panel animate-slideUp flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-semibold text-ink">{worker.name}</p>
                    <p className="truncate text-xs text-ink-muted">{worker.hostname}</p>
                  </div>
                  <StatusChip status={worker.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-ink-muted">
                  <div>
                    <p className="text-ink-faint">Process ID</p>
                    <p className="text-ink">{worker.processId}</p>
                  </div>
                  <div>
                    <p className="text-ink-faint">Version</p>
                    <p className="text-ink">{worker.version ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-ink-faint">Last Seen</p>
                    <p className="text-ink">{formatRelativeTime(worker.lastSeenAt)}</p>
                  </div>
                  <div>
                    <p className="text-ink-faint">Started</p>
                    <p className="text-ink">{formatRelativeTime(worker.startedAt)}</p>
                  </div>
                </div>

                <div className="flex justify-end border-t border-border pt-3">
                  <Button
                    variant="danger"
                    onClick={() => setConfirmTarget(worker)}
                    disabled={worker.status === 'OFFLINE'}
                  >
                    <PowerIcon className="h-4 w-4" />
                    Shutdown
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="panel">
            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        </>
      ) : (
        <div className="panel">
          <EmptyState icon={ServerStackIcon} title="No workers found" description="Workers will appear here once they connect." />
        </div>
      )}

      <Dialog
        isOpen={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        title="Shutdown Worker"
        description={`Send a graceful shutdown signal to "${confirmTarget?.name}"?`}
      >
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirmTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmShutdown} isLoading={shutdownMutation.isPending}>
            Shutdown
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
