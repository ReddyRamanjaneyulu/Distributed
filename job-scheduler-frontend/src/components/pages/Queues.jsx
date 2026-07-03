import { useState } from "react";
import { Plus, Pause, Play, Settings2 } from "lucide-react";
import Topbar from "../components/Topbar";
import { Panel, Button, EmptyState } from "../components/ui/Primitives";
import Badge from "../components/ui/Badge";
import { useApp } from "../lib/AppContext";
import { usePoll } from "../lib/usePoll";
import { listQueues, pauseQueue, resumeQueue } from "../lib/api";
import CreateQueueModal from "../components/CreateQueueModal";
import QueueDrawer from "../components/QueueDrawer";

export default function Queues() {
  const { project } = useApp();
  const { data: queues, refresh } = usePoll(() => listQueues({ projectId: project?.id }), [project?.id], 1500);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const selected = queues?.find((q) => q.id === selectedId) || null;

  async function toggle(q, e) {
    e.stopPropagation();
    if (q.status === "active") await pauseQueue(q.id);
    else await resumeQueue(q.id);
    refresh();
  }

  return (
    <>
      <Topbar
        title="Queues"
        subtitle={project ? `${queues?.length ?? 0} queues in ${project.name}` : "Loading…"}
        actions={<Button variant="pulse" size="sm" onClick={() => setCreateOpen(true)}><Plus className="h-3.5 w-3.5" /> New queue</Button>}
      />

      <main className="px-6 py-6">
        <Panel>
          {queues?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-wider text-ink-faint font-mono">
                    <th className="px-5 py-2.5 font-medium">Queue</th>
                    <th className="px-5 py-2.5 font-medium">Status</th>
                    <th className="px-5 py-2.5 font-medium">Priority</th>
                    <th className="px-5 py-2.5 font-medium">Concurrency</th>
                    <th className="px-5 py-2.5 font-medium">Retry policy</th>
                    <th className="px-5 py-2.5 font-medium">Backlog</th>
                    <th className="px-5 py-2.5 font-medium">Running</th>
                    <th className="px-5 py-2.5 font-medium">Dead</th>
                    <th className="px-5 py-2.5 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {queues.map((q) => (
                    <tr key={q.id} className="cursor-pointer hover:bg-surface-hover" onClick={() => setSelectedId(q.id)}>
                      <td className="px-5 py-3 font-mono text-ink">{q.name}</td>
                      <td className="px-5 py-3"><Badge status={q.status} /></td>
                      <td className="px-5 py-3 tabular text-ink-dim">{q.priority}</td>
                      <td className="px-5 py-3 tabular text-ink-dim">{q.concurrencyLimit}</td>
                      <td className="px-5 py-3">
                        <span className="rounded border border-border-light bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-ink-dim capitalize">
                          {q.retryPolicy.type} · ×{q.retryPolicy.maxAttempts}
                        </span>
                      </td>
                      <td className="px-5 py-3 tabular text-ink-dim">{q.stats.queued + q.stats.scheduled}</td>
                      <td className="px-5 py-3 tabular text-pulse">{q.stats.running}</td>
                      <td className="px-5 py-3 tabular text-dlq">{q.stats.dead}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={(e) => toggle(q, e)} className="rounded-md p-1.5 text-ink-faint hover:bg-surface-hover hover:text-ink" title={q.status === "active" ? "Pause" : "Resume"}>
                            {q.status === "active" ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                          </button>
                          <button onClick={() => setSelectedId(q.id)} className="rounded-md p-1.5 text-ink-faint hover:bg-surface-hover hover:text-ink" title="Configure">
                            <Settings2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No queues yet" subtitle="Create a queue to start scheduling jobs for this project." action={
              <Button variant="pulse" size="sm" className="mt-2" onClick={() => setCreateOpen(true)}><Plus className="h-3.5 w-3.5" /> New queue</Button>
            } />
          )}
        </Panel>
      </main>

      <CreateQueueModal open={createOpen} onClose={() => setCreateOpen(false)} projectId={project?.id} onCreated={refresh} />
      <QueueDrawer queue={selected} onClose={() => setSelectedId(null)} onChanged={refresh} />
    </>
  );
}
