import { useState } from "react";
import { Plus, FolderKanban, ArrowRight } from "lucide-react";
import Topbar from "../components/Topbar";
import { Panel, Button, Input, Label, EmptyState } from "../components/ui/Primitives";
import { Modal } from "../components/ui/Modal";
import { useApp } from "../lib/AppContext";
import { usePoll } from "../lib/usePoll";
import { listQueues, addProject, listProjects } from "../lib/api";
import { formatDateTime } from "../lib/utils";

export default function Projects() {
  const { setProjectId, setProjects } = useApp();
  const { data: projects, refresh } = usePoll(() => listProjects(), [], 3000);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!name.trim()) return;
    setSaving(true);
    const p = await addProject({ name: name.trim() });
    const all = await listProjects();
    setProjects(all);
    setProjectId(p.id);
    setSaving(false);
    setName("");
    setCreateOpen(false);
    refresh();
  }

  return (
    <>
      <Topbar title="Projects" subtitle="Each project owns its own queues, jobs and workers" actions={
        <Button variant="pulse" size="sm" onClick={() => setCreateOpen(true)}><Plus className="h-3.5 w-3.5" /> New project</Button>
      } />

      <main className="px-6 py-6">
        {projects?.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((p) => <ProjectCard key={p.id} project={p} onOpen={() => setProjectId(p.id)} />)}
          </div>
        ) : (
          <Panel><EmptyState title="No projects yet" subtitle="Create your first project to start scheduling jobs." /></Panel>
        )}
      </main>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New project"
        subtitle="Projects group related queues and jobs"
        footer={<>
          <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="pulse" onClick={submit} disabled={saving || !name.trim()}>{saving ? "Creating…" : "Create project"}</Button>
        </>}
      >
        <Label>Project name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Notifications Service" />
      </Modal>
    </>
  );
}

function ProjectCard({ project, onOpen }) {
  const { data: queues } = usePoll(() => listQueues({ projectId: project.id }), [project.id], 4000);
  const totals = queues?.reduce((acc, q) => {
    acc.queued += q.stats.queued;
    acc.dead += q.stats.dead;
    return acc;
  }, { queued: 0, dead: 0 });

  return (
    <Panel className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/30 bg-accent/10">
          <FolderKanban className="h-4 w-4 text-accent" />
        </div>
        <span className="font-mono text-[10px] text-ink-faint">since {formatDateTime(project.createdAt)}</span>
      </div>
      <h3 className="mt-3 font-display text-sm font-semibold text-ink">{project.name}</h3>
      <p className="mt-0.5 font-mono text-[11px] text-ink-faint">{project.slug}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-md border border-border-light bg-surface-2 py-2">
          <div className="font-mono text-sm tabular text-ink">{queues?.length ?? "—"}</div>
          <div className="text-[10px] text-ink-faint">queues</div>
        </div>
        <div className="rounded-md border border-border-light bg-surface-2 py-2">
          <div className="font-mono text-sm tabular text-accent">{totals?.queued ?? "—"}</div>
          <div className="text-[10px] text-ink-faint">queued</div>
        </div>
        <div className="rounded-md border border-border-light bg-surface-2 py-2">
          <div className="font-mono text-sm tabular text-dlq">{totals?.dead ?? "—"}</div>
          <div className="text-[10px] text-ink-faint">dead</div>
        </div>
      </div>

      <Button variant="outline" size="sm" className="mt-4 w-full" onClick={onOpen}>
        Open project <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </Panel>
  );
}
