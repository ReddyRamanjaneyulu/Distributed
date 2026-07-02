import { useState } from "react";
import { RotateCcw, ChevronLeft, ChevronRight, Skull } from "lucide-react";
import Topbar from "../components/Topbar";
import { Panel, Button, EmptyState } from "../components/ui/Primitives";
import { useApp } from "../lib/AppContext";
import { usePoll } from "../lib/usePoll";
import { listDlq, requeueDlq } from "../lib/api";
import { formatDateTime, timeAgo, shortId } from "../lib/utils";
import JobDrawer from "../components/JobDrawer";

export default function Dlq() {
  const { project } = useApp();
  const [page, setPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [requeuing, setRequeuing] = useState(null);
  const { data, refresh } = usePoll(() => listDlq({ projectId: project?.id, page, pageSize: 15 }), [project?.id, page], 1500);

  async function handleRequeue(id, e) {
    e.stopPropagation();
    setRequeuing(id);
    await requeueDlq(id);
    setRequeuing(null);
    refresh();
  }

  return (
    <>
      <Topbar title="Dead Letter Queue" subtitle={project ? `${data?.total ?? 0} jobs exhausted their retries in ${project.name}` : "Loading…"} />

      <main className="px-6 py-6">
        <Panel>
          {data?.items?.length ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-[11px] uppercase tracking-wider text-ink-faint font-mono">
                      <th className="px-5 py-2.5 font-medium">Job</th>
                      <th className="px-5 py-2.5 font-medium">Queue</th>
                      <th className="px-5 py-2.5 font-medium">Attempts</th>
                      <th className="px-5 py-2.5 font-medium">Failure reason</th>
                      <th className="px-5 py-2.5 font-medium">Failed</th>
                      <th className="px-5 py-2.5 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.items.map((d) => (
                      <tr key={d.id} className="cursor-pointer hover:bg-surface-hover" onClick={() => setSelectedJobId(d.jobId)}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Skull className="h-3.5 w-3.5 text-dlq" />
                            <div>
                              <div className="font-mono text-ink">{d.job?.name}</div>
                              <div className="font-mono text-[10px] text-ink-faint">{shortId(d.jobId)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-ink-dim">{d.queueName}</td>
                        <td className="px-5 py-3 tabular text-ink-dim">{d.attempts}</td>
                        <td className="px-5 py-3 max-w-xs truncate text-danger" title={d.reason}>{d.reason}</td>
                        <td className="px-5 py-3 font-mono text-[11px] text-ink-faint" title={formatDateTime(d.failedAt)}>{timeAgo(d.failedAt)}</td>
                        <td className="px-5 py-3">
                          <Button variant="outline" size="sm" onClick={(e) => handleRequeue(d.id, e)} disabled={requeuing === d.id}>
                            <RotateCcw className="h-3.5 w-3.5" /> {requeuing === d.id ? "Requeuing…" : "Requeue"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-border px-5 py-3">
                <span className="font-mono text-[11px] text-ink-faint">page {data.page} of {data.totalPages} · {data.total} entries</span>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
                  <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState title="Dead letter queue is empty" subtitle="Jobs land here after exhausting every retry attempt." />
          )}
        </Panel>
      </main>

      <JobDrawer jobId={selectedJobId} onClose={() => setSelectedJobId(null)} onChanged={refresh} />
    </>
  );
}
