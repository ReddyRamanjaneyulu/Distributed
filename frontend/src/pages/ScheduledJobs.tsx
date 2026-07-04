import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, PencilIcon, TrashIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

import { Pagination } from '../components/Pagination';
import { Dialog } from '../components/Dialog';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { TableSkeleton } from '../components/Loading';

import {
  useCreateScheduledJob,
  useDeleteScheduledJob,
  useScheduledJobs,
  useToggleScheduledJob,
  useUpdateScheduledJob,
} from '../hooks/useScheduledJobs';
import { useQueues } from '../hooks/useQueues';
import { scheduledJobSchema, type ScheduledJobFormValues } from '../utils/validation';
import { formatRelativeTime } from '../utils/formatters';

import type { ScheduledJob } from '../types';

const PAGE_SIZE = 10;

export default function ScheduledJobs() {
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<ScheduledJob | null>(null);
  const [deletingJob, setDeletingJob] = useState<ScheduledJob | null>(null);

  const { data, isLoading } = useScheduledJobs({ page, limit: PAGE_SIZE });
  const { data: queuesData } = useQueues({ page: 1, limit: 100 });

  const createMutation = useCreateScheduledJob();
  const updateMutation = useUpdateScheduledJob();
  const deleteMutation = useDeleteScheduledJob();
  const toggleMutation = useToggleScheduledJob();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ScheduledJobFormValues>({
    resolver: zodResolver(scheduledJobSchema),
    defaultValues: { timezone: 'UTC', enabled: true, payload: '{}' },
  });

  function openCreateDialog() {
    setEditingJob(null);
    reset({ name: '', cronExpression: '', timezone: 'UTC', queueId: '', enabled: true, payload: '{}' });
    setDialogOpen(true);
  }

  function openEditDialog(job: ScheduledJob) {
    setEditingJob(job);
    reset({
      name: job.name,
      cronExpression: job.cronExpression,
      timezone: job.timezone,
      queueId: job.queueId,
      enabled: job.enabled,
      payload: JSON.stringify(job.payload, null, 2),
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: ScheduledJobFormValues) {
    const payload = {
      ...values,
      payload: JSON.parse(values.payload),
    };

    if (editingJob) {
      await updateMutation.mutateAsync({ id: editingJob.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setDialogOpen(false);
  }

  async function confirmDelete() {
    if (!deletingJob) return;
    await deleteMutation.mutateAsync(deletingJob.id);
    setDeletingJob(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreateDialog}>
          <PlusIcon className="h-4 w-4" />
          New Scheduled Job
        </Button>
      </div>

      <div className="panel overflow-hidden">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={5} cols={5} />
          </div>
        ) : data && data.items.length > 0 ? (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-ink-faint">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Cron</th>
                  <th className="px-4 py-3 font-medium">Timezone</th>
                  <th className="px-4 py-3 font-medium">Next Run</th>
                  <th className="px-4 py-3 font-medium">Enabled</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((job) => (
                  <tr key={job.id} className="border-b border-border/60 hover:bg-canvas-subtle/60">
                    <td className="px-4 py-3 font-medium text-ink">{job.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-muted">{job.cronExpression}</td>
                    <td className="px-4 py-3 text-ink-muted">{job.timezone}</td>
                    <td className="px-4 py-3 text-ink-muted">{formatRelativeTime(job.nextRunAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleMutation.mutate({ id: job.id, enabled: !job.enabled })}
                        className={`h-5 w-9 rounded-full transition-colors ${job.enabled ? 'bg-ok' : 'bg-canvas-subtle'}`}
                      >
                        <span
                          className={`block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform ${
                            job.enabled ? 'translate-x-4' : ''
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditDialog(job)}
                          className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-canvas-raised hover:text-ink"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingJob(job)}
                          className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-canvas-raised hover:text-danger"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
          </>
        ) : (
          <EmptyState
            icon={CalendarDaysIcon}
            title="No scheduled jobs yet"
            description="Create cron-based recurring jobs."
            action={
              <Button onClick={openCreateDialog} variant="secondary">
                <PlusIcon className="h-4 w-4" />
                New Scheduled Job
              </Button>
            }
          />
        )}
      </div>

      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingJob ? 'Edit Scheduled Job' : 'New Scheduled Job'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">Name</label>
            <input className="input-field" {...register('name')} />
            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Cron Expression</label>
              <input className="input-field font-mono" placeholder="*/5 * * * *" {...register('cronExpression')} />
              {errors.cronExpression && (
                <p className="mt-1 text-xs text-danger">{errors.cronExpression.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Timezone</label>
              <input className="input-field" placeholder="UTC" {...register('timezone')} />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">Queue</label>
            <select className="input-field" {...register('queueId')}>
              <option value="">Select a queue</option>
              {queuesData?.items.map((queue) => (
                <option key={queue.id} value={queue.id}>
                  {queue.name}
                </option>
              ))}
            </select>
            {errors.queueId && <p className="mt-1 text-xs text-danger">{errors.queueId.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">Payload (JSON)</label>
            <textarea className="input-field font-mono" rows={4} {...register('payload')} />
            {errors.payload && <p className="mt-1 text-xs text-danger">{errors.payload.message}</p>}
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input type="checkbox" className="h-4 w-4 rounded border-border bg-canvas-subtle" {...register('enabled')} />
            Enabled
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingJob ? 'Save Changes' : 'Create Schedule'}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        isOpen={Boolean(deletingJob)}
        onClose={() => setDeletingJob(null)}
        title="Delete Scheduled Job"
        description={`Are you sure you want to delete "${deletingJob?.name}"?`}
      >
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeletingJob(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} isLoading={deleteMutation.isPending}>
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
