import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, PencilIcon, TrashIcon, ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline';

import { Pagination } from '../components/Pagination';
import { Dialog } from '../components/Dialog';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { EmptyState } from '../components/EmptyState';
import { TableSkeleton } from '../components/Loading';

import {
  useCreateRetryPolicy,
  useDeleteRetryPolicy,
  useRetryPolicies,
  useUpdateRetryPolicy,
} from '../hooks/useRetryPolicies';
import { retryPolicySchema, type RetryPolicyFormValues } from '../utils/validation';

import type { RetryPolicy } from '../types';

const PAGE_SIZE = 10;

const STRATEGY_OPTIONS = [
  { label: 'Fixed Delay', value: 'FIXED' },
  { label: 'Linear Backoff', value: 'LINEAR' },
  { label: 'Exponential Backoff', value: 'EXPONENTIAL' },
];

export default function RetryPolicies() {
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<RetryPolicy | null>(null);
  const [deletingPolicy, setDeletingPolicy] = useState<RetryPolicy | null>(null);

  const { data, isLoading } = useRetryPolicies({ page, limit: PAGE_SIZE });
  const createMutation = useCreateRetryPolicy();
  const updateMutation = useUpdateRetryPolicy();
  const deleteMutation = useDeleteRetryPolicy();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RetryPolicyFormValues>({
    resolver: zodResolver(retryPolicySchema),
    defaultValues: { strategy: 'FIXED', maxAttempts: 3, baseDelayMs: 1000, jitter: false },
  });

  const strategy = watch('strategy');

  function openCreateDialog() {
    setEditingPolicy(null);
    reset({ name: '', strategy: 'FIXED', maxAttempts: 3, baseDelayMs: 1000, jitter: false });
    setDialogOpen(true);
  }

  function openEditDialog(policy: RetryPolicy) {
    setEditingPolicy(policy);
    reset({
      name: policy.name,
      strategy: policy.strategy,
      maxAttempts: policy.maxAttempts,
      baseDelayMs: policy.baseDelayMs,
      maxDelayMs: policy.maxDelayMs ?? undefined,
      jitter: policy.jitter,
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: RetryPolicyFormValues) {
    if (editingPolicy) {
      await updateMutation.mutateAsync({ id: editingPolicy.id, payload: values });
    } else {
      await createMutation.mutateAsync(values);
    }
    setDialogOpen(false);
  }

  async function confirmDelete() {
    if (!deletingPolicy) return;
    await deleteMutation.mutateAsync(deletingPolicy.id);
    setDeletingPolicy(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreateDialog}>
          <PlusIcon className="h-4 w-4" />
          New Retry Policy
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
                  <th className="px-4 py-3 font-medium">Strategy</th>
                  <th className="px-4 py-3 font-medium">Max Attempts</th>
                  <th className="px-4 py-3 font-medium">Base Delay</th>
                  <th className="px-4 py-3 font-medium">Jitter</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((policy) => (
                  <tr key={policy.id} className="border-b border-border/60 hover:bg-canvas-subtle/60">
                    <td className="px-4 py-3 font-medium text-ink">{policy.name}</td>
                    <td className="px-4 py-3 text-ink-muted">{policy.strategy}</td>
                    <td className="px-4 py-3 text-ink-muted">{policy.maxAttempts}</td>
                    <td className="px-4 py-3 text-ink-muted">{policy.baseDelayMs}ms</td>
                    <td className="px-4 py-3 text-ink-muted">{policy.jitter ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditDialog(policy)}
                          className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-canvas-raised hover:text-ink"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingPolicy(policy)}
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
            icon={ArrowPathRoundedSquareIcon}
            title="No retry policies yet"
            description="Define how failed jobs should be retried."
            action={
              <Button onClick={openCreateDialog} variant="secondary">
                <PlusIcon className="h-4 w-4" />
                New Retry Policy
              </Button>
            }
          />
        )}
      </div>

      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingPolicy ? 'Edit Retry Policy' : 'New Retry Policy'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">Name</label>
            <input className="input-field" {...register('name')} />
            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">Strategy</label>
            <Select options={STRATEGY_OPTIONS} {...register('strategy')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Max Attempts</label>
              <input type="number" className="input-field" {...register('maxAttempts')} />
              {errors.maxAttempts && <p className="mt-1 text-xs text-danger">{errors.maxAttempts.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Base Delay (ms)</label>
              <input type="number" className="input-field" {...register('baseDelayMs')} />
              {errors.baseDelayMs && <p className="mt-1 text-xs text-danger">{errors.baseDelayMs.message}</p>}
            </div>
          </div>

          {(strategy === 'LINEAR' || strategy === 'EXPONENTIAL') && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Max Delay (ms)</label>
              <input type="number" className="input-field" {...register('maxDelayMs')} />
            </div>
          )}

          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input type="checkbox" className="h-4 w-4 rounded border-border bg-canvas-subtle" {...register('jitter')} />
            Add random jitter to delay
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingPolicy ? 'Save Changes' : 'Create Policy'}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        isOpen={Boolean(deletingPolicy)}
        onClose={() => setDeletingPolicy(null)}
        title="Delete Retry Policy"
        description={`Are you sure you want to delete "${deletingPolicy?.name}"?`}
      >
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeletingPolicy(null)}>
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
