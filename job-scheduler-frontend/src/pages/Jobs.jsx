import { useState } from "react";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Topbar from "../components/Topbar";
import { Panel, Button, Input, Select, EmptyState } from "../components/ui/Primitives";
import Badge from "../components/ui/Badge";
import { useApp } from "../lib/AppContext";
import { usePoll } from "../lib/usePoll";
import { listJobs, listQueues } from "../lib/api";
import { formatDuration, timeAgo, shortId } from "../lib/utils";
import CreateJobModal from "../components/CreateJobModal";
import JobDrawer from "../components/JobDrawer";

const STATUSES = ["all", "queued", "scheduled", "claimed", "running", "retrying", "completed", "dead"];
const TYPES = ["all", "immediate", "delayed", "scheduled", "cron", "batch"];

export default function Jobs() {
  const { project } = useApp();
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [queueId, setQueueId] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const { data: queues } = usePoll(() => listQueues({ projectId: project?.id }), [project?.id], 3000);
  const { data, refresh } = usePoll(
    () => listJobs({ projectId: project?.id, status, type, queueId: queueId === "all" ? undefined : queueId, search, page, pageSize: 15 }),
    [project?.id, status, type, queueId, search, page],
    1500
  );

  return (
    <>
      <Topbar
        title="Job Explorer"
        subtitle={project ? `${data?.total ?? 0} jobs matching filters` : "Loading…"}
        actions={<Button variant="pulse" size="sm" onClick={() => setCreateOpen(true)}><Plus className="h-3.5 w-3.5" /> New job</Button>}
      />

      <main className="px-6 py-6 space-y-4">
        <Panel className="p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-ink-faint" />
              <Input className="pl-8" placeholder="Search by job name or id…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <Select className="w-auto" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              {STATUSES.map((s) => <option key={s} value={s}>{s === "all" ? "All statuses" : s}</option>)}
            </Select>
            <Select className="w-auto" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
              {TYPES.map((t) => <option key={t} value={t}>{t === "all" ? "All types" : t}</option>)}
            </Select>
            <Select className="w-auto" value={queueId} onChange={(e) => { setQueueId(e.target.value); setPage(1); }}>
              <option value="all">All queues</option>
              {queues?.map((q) => <option key={q.id} value={q.id}>{q.name}</option>)}
            </Select>
          </div>
        </Panel>

        <Panel>
          {data?.items?.length ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-[11px] uppercase tracking-wider text-ink-faint font-mono">
                      <th className="px-5 py-2.5 font-medium">Job</th>
                      <th className="px-5 py-2.5 font-medium">Queue</th>
                      <th className="px-5 py-2.5 font-medium">Type</th>
                      <th className="px-5 py-2.5 font-medium">Status</th>
                      <th className="px-5 py-2.5 font-medium">Attempts</th>
                      <th className="px-5 py-2.5 font-medium">Worker</th>
                      <th className="px-5 py-2.5 font-medium">Duration</th>
                      <th className="px-5 py-2.5 font-medium">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.items.map((j) => (
                      <tr key={j.id} className="cursor-pointer hover:bg-surface-hover" onClick={() => setSelectedJobId(j.id)}>
                        <td className="px-5 py-3">
                          <div className="font-mono text-ink">{j.name}</div>
                          <div className="font-mono text-[10px] text-ink-faint">{shortId(j.id)}</div>
                        </td>
                        <td className="px-5 py-3 text-ink-dim">{j.queueName}</td>
                        <td className="px-5 py-3 capitalize text-ink-dim">{j.type}</td>
                        <td className="px-5 py-3"><Badge status={j.status} /></td>
                        <td className="px-5 py-3 tabular text-ink-dim">{j.attempts}/{j.maxAttempts}</td>
                        <td className="px-5 py-3 text-ink-dim">{j.worker?.name || "—"}</td>
                        <td className="px-5 py-3 tabular text-ink-dim">{formatDuration(j.durationMs)}</td>
                        <td className="px-5 py-3 font-mono text-[11px] text-ink-faint">{timeAgo(j.updatedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-border px-5 py-3">
                <span className="font-mono text-[11px] text-ink-faint">
                  page {data.page} of {data.totalPages} · {data.total} jobs
                </span>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
                  <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState title="No jobs match these filters" subtitle="Try widening your filters, or create a new job." />
          )}
        </Panel>
      </main>

      <CreateJobModal open={createOpen} onClose={() => setCreateOpen(false)} queues={queues} onCreated={refresh} />
      <JobDrawer jobId={selectedJobId} onClose={() => setSelectedJobId(null)} onChanged={refresh} />
    </>
  );
}
