import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, QueueListIcon } from '@heroicons/react/24/outline';

import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { Dialog } from '../components/Dialog';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { QueueCard } from '../components/QueueCard';
import { Select } from '../components/Select';
import { TableSkeleton } from '../components/Loading';

import { useCreateQueue, usePauseQueue, useQueues, useResumeQueue } from '../hooks/useQueues';
import { useProjects } from '../hooks/useProjects';
import { useRetryPolicies } from '../hooks/useRetryPolicies';
import { queueSchema, type QueueFormValues } from '../utils/validation';

const PAGE_SIZE = 12;

export default function Queues() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useQueues({ page, limit: PAGE_SIZE, search });
  const { data: projectsData } = useProjects({ page: 1, limit: 100 });
  const { data: retryPoliciesData } = useRetryPolicies({ page: 1, limit: 100 });

  const createMutation = useCreateQueue();
  const pauseMutation = usePauseQueue();
  const resumeMutation = useResumeQueue();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QueueFormValues>({
    resolver: zodResolver(queueSchema),
    defaultValues: { priority: 0, concurrency: 5, visibilityTimeout: 60 },
  });

  function openCreateDialog() {
    reset({ name: '', description: '', projectId: '', priority: 0, concurrency: 5, visibilityTimeout: 60 });
    setDialogOpen(true);
  }

  async function onSubmit(values: QueueFormValues) {
    await createMutation.mutateAsync({
      ...values,
      retryPolicyId: values.retryPolicyId || undefined,
    });
    setDialogOpen(false);
  }

  const projectOptions = [
    { label: 'Select a project', value: '' },
    ...(projectsData?.items.map((p) => ({ label: p.name, value: p.id })) ?? []),
  ];

  const retryPolicyOptions = [
    { label: 'No retry policy', value: '' },
    ...(retryPoliciesData?.items.map((r) => ({ label: r.name, value: r.id })) ?? []),
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="w-full max-w-xs">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search queues…" />
        </div>

        <Button onClick={openCreateDialog}>
          <PlusIcon className="h-4 w-4" />
          New Queue
        </Button>
      </div>

      {isLoading ? (
        <div className="panel p-4">
          <TableSkeleton rows={4} cols={4} />
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((queue) => (
              <QueueCard
                key={queue.id}
                queue={queue}
                onPause={(id) => pauseMutation.mutate(id)}
                onResume={(id) => resumeMutation.mutate(id)}
                isMutating={pauseMutation.isPending || resumeMutation.isPending}
              />
            ))}
          </div>

          <div className="panel">
            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        </>
      ) : (
        <div className="panel">
          <EmptyState
            icon={QueueListIcon}
            title="No queues yet"
            description="Create a queue to start dispatching jobs."
            action={
              <Button onClick={openCreateDialog} variant="secondary">
                <PlusIcon className="h-4 w-4" />
                New Queue
              </Button>
            }
          />
        </div>
      )}

      <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} title="New Queue" maxWidth="max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Name</label>
              <input className="input-field" {...register('name')} />
              {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
            </div>

            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Description</label>
              <textarea className="input-field" rows={2} {...register('description')} />
            </div>

            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Project</label>
              <Select options={projectOptions} {...register('projectId')} />
              {errors.projectId && <p className="mt-1 text-xs text-danger">{errors.projectId.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Priority</label>
              <input type="number" className="input-field" {...register('priority')} />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Concurrency</label>
              <input type="number" className="input-field" {...register('concurrency')} />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Visibility Timeout (s)</label>
              <input type="number" className="input-field" {...register('visibilityTimeout')} />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Retry Policy</label>
              <Select options={retryPolicyOptions} {...register('retryPolicyId')} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Queue
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
