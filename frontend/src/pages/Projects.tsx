import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, PencilIcon, TrashIcon, FolderIcon } from '@heroicons/react/24/outline';

import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { Dialog } from '../components/Dialog';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { TableSkeleton } from '../components/Loading';
import {
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from '../hooks/useProjects';
import { projectSchema, type ProjectFormValues } from '../utils/validation';
import { formatDate } from '../utils/formatters';

import type { Project } from '../types';

/**
 * ASSUMPTION: creating a project requires an organizationId. Since no
 * "current organization" endpoint was listed, the form takes it as a
 * plain text field. Wire this to your org-switcher/context if you have one.
 */

const PAGE_SIZE = 10;

export default function Projects() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const { data, isLoading } = useProjects({ page, limit: PAGE_SIZE, search });
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  });

  function openCreateDialog() {
    setEditingProject(null);
    reset({ name: '', description: '', organizationId: '' });
    setDialogOpen(true);
  }

  function openEditDialog(project: Project) {
    setEditingProject(project);
    reset({
      name: project.name,
      description: project.description ?? '',
      organizationId: project.organizationId,
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: ProjectFormValues) {
    if (editingProject) {
      await updateMutation.mutateAsync({
        id: editingProject.id,
        payload: { name: values.name, description: values.description },
      });
    } else {
      await createMutation.mutateAsync(values);
    }

    setDialogOpen(false);
  }

  async function confirmDelete() {
    if (!deletingProject) return;
    await deleteMutation.mutateAsync(deletingProject.id);
    setDeletingProject(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="w-full max-w-xs">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search projects…" />
        </div>

        <Button onClick={openCreateDialog}>
          <PlusIcon className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="panel overflow-hidden">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={5} cols={4} />
          </div>
        ) : data && data.items.length > 0 ? (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-ink-faint">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((project) => (
                  <tr key={project.id} className="border-b border-border/60 hover:bg-canvas-subtle/60">
                    <td className="px-4 py-3 font-medium text-ink">{project.name}</td>
                    <td className="px-4 py-3 text-ink-muted">{project.description || '—'}</td>
                    <td className="px-4 py-3 text-ink-muted">{formatDate(project.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditDialog(project)}
                          className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-canvas-raised hover:text-ink"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProject(project)}
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
            icon={FolderIcon}
            title="No projects yet"
            description="Create your first project to start organizing queues."
            action={
              <Button onClick={openCreateDialog} variant="secondary">
                <PlusIcon className="h-4 w-4" />
                New Project
              </Button>
            }
          />
        )}
      </div>

      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingProject ? 'Edit Project' : 'New Project'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">Name</label>
            <input className="input-field" {...register('name')} />
            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">Description</label>
            <textarea className="input-field" rows={3} {...register('description')} />
          </div>

          {!editingProject && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Organization ID</label>
              <input className="input-field" {...register('organizationId')} />
              {errors.organizationId && (
                <p className="mt-1 text-xs text-danger">{errors.organizationId.message}</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingProject ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        isOpen={Boolean(deletingProject)}
        onClose={() => setDeletingProject(null)}
        title="Delete Project"
        description={`Are you sure you want to delete "${deletingProject?.name}"? This cannot be undone.`}
      >
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeletingProject(null)}>
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
