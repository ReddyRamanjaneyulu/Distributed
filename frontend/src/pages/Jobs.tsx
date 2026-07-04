import { useState } from 'react';

import { SearchBar } from '../components/SearchBar';
import { Select } from '../components/Select';
import { Pagination } from '../components/Pagination';
import { JobTable } from '../components/JobTable';

import { useCancelJob, useJobs, useRetryJob } from '../hooks/useJobs';

import type { JobStatus } from '../types';

const PAGE_SIZE = 15;

const STATUS_OPTIONS: { label: string; value: JobStatus | '' }[] = [
  { label: 'All statuses', value: '' },
  { label: 'Queued', value: 'QUEUED' },
  { label: 'Claimed', value: 'CLAIMED' },
  { label: 'Running', value: 'RUNNING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Retrying', value: 'RETRYING' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Dead', value: 'DEAD' },
];

const PRIORITY_OPTIONS = [
  { label: 'All priorities', value: '' },
  { label: 'Priority 0', value: '0' },
  { label: 'Priority 1', value: '1' },
  { label: 'Priority 2', value: '2' },
  { label: 'Priority 3+', value: '3' },
];

export default function Jobs() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<JobStatus | ''>('');
  const [priority, setPriority] = useState('');

  const { data, isLoading } = useJobs({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    status: status || undefined,
    priority: priority ? Number(priority) : undefined,
  });

  const retryMutation = useRetryJob();
  const cancelMutation = useCancelJob();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full max-w-xs">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search jobs by ID…" />
        </div>

        <div className="w-44">
          <Select
            options={STATUS_OPTIONS}
            value={status}
            onChange={(e) => { setStatus(e.target.value as JobStatus | ''); setPage(1); }}
          />
        </div>

        <div className="w-40">
          <Select
            options={PRIORITY_OPTIONS}
            value={priority}
            onChange={(e) => { setPriority(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div className="panel overflow-hidden">
        <JobTable
          jobs={data?.items ?? []}
          isLoading={isLoading}
          onRetry={(id) => retryMutation.mutate(id)}
          onCancel={(id) => cancelMutation.mutate(id)}
          retryingId={retryMutation.isPending ? retryMutation.variables : undefined}
          cancellingId={cancelMutation.isPending ? cancelMutation.variables : undefined}
        />

        {data && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />}
      </div>
    </div>
  );
}
