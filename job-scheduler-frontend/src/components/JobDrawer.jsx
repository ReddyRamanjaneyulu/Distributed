import { useEffect, useState } from "react";
import { RotateCcw, CheckCircle2, XCircle, Clock, PlayCircle, Repeat } from "lucide-react";
import { Drawer } from "./ui/Modal";
import { Button, Skeleton } from "./ui/Primitives";
import Badge from "./ui/Badge";
import { getJob, listExecutions, listLogs, retryJobApi } from "../lib/api";
import { formatDateTime, formatDuration, timeAgo } from "../lib/utils";

const LOG_COLOR = { info: "text-ink-dim", warn: "text-warning", error: "text-danger" };

export default function JobDrawer({ jobId, onClose, onChanged }) {
  const [job, setJob] = useState(null);
  const [executions, setExecutions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    let cancelled = false;
    let timer = null;
    async function load() {
      const [j, ex, lg] = await Promise.all([getJob(jobId), listExecutions(jobId), listLogs(jobId)]);
      if (!cancelled) {
        setJob(j);
        setExecutions(ex);
        setLogs(lg);
      }
      timer = setTimeout(load, 1500);
    }
    load();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [jobId]);

  if (!jobId) return null;

  async function handleRetry() {
    setRetrying(true);
    await retryJobApi(jobId);
    setRetrying(false);
    onChanged?.();
  }

  const canRetry = job && (job.status === "dead" || job.status === "failed");

  return (
    <Drawer
      open={!!jobId}
      onClose={onClose}
      title={job?.name || "Loading…"}
      subtitle={job ? `${job.id} · queue: ${job.queueName}` : ""}
      badge={job && <Badge status={job.status} />}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          {canRetry && (
            <Button variant="pulse" onClick={handleRetry} disabled={retrying}>
              <RotateCcw className="h-3.5 w-3.5" /> {retrying ? "Retrying…" : "Retry job"}
            </Button>
          )}
        </>
      }
    >
      {!job ? (
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3 font-mono text-xs">
            <Info label="Type" value={job.type} />
            <Info label="Priority" value={job.priority} />
            <Info label="Attempts" value={`${job.attempts}/${job.maxAttempts}`} />
            <Info label="Created" value={timeAgo(job.createdAt)} />
            <Info label="Updated" value={timeAgo(job.updatedAt)} />
            <Info label="Duration" value={formatDuration(job.durationMs)} />
            {job.cronExpr && <Info label="Cron" value={job.cronExpr} />}
            {job.batchId && <Info label="Batch" value={job.batchId} />}
            {job.worker && <Info label="Worker" value={job.worker.name} />}
          </div>

          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-ink-faint">Execution history</div>
            <div className="space-y-2">
              {executions.length ? executions.map((ex) => (
                <div key={ex.id} className="flex items-start gap-3 rounded-lg border border-border-light bg-surface-2 px-3 py-2.5">
                  {ex.status === "completed" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-ink">Attempt {ex.attempt}</span>
                      <span className="font-mono text-[10px] text-ink-faint">{formatDateTime(ex.startedAt)}</span>
                    </div>
                    {ex.error ? (
                      <p className="mt-0.5 text-xs text-danger">{ex.error}</p>
                    ) : (
                      <p className="mt-0.5 text-xs text-ink-dim">Completed in {formatDuration(ex.finishedAt - ex.startedAt)}</p>
                    )}
                  </div>
                </div>
              )) : (
                <div className="rounded-lg border border-dashed border-border-light px-3 py-6 text-center text-xs text-ink-faint">
                  No executions yet — job is still queued.
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-ink-faint">Logs</div>
            <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-lg border border-border-light bg-bg px-3 py-2.5 font-mono text-[11px]">
              {logs.map((l) => (
                <div key={l.id} className="flex gap-2">
                  <span className="shrink-0 text-ink-faint">{new Date(l.timestamp).toLocaleTimeString()}</span>
                  <span className={LOG_COLOR[l.level]}>{l.message}</span>
                </div>
              ))}
            </div>
          </div>

          <LifecycleStrip status={job.status} />
        </div>
      )}
    </Drawer>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-md border border-border-light bg-surface-2 px-2.5 py-2">
      <div className="text-[10px] uppercase tracking-wider text-ink-faint">{label}</div>
      <div className="mt-0.5 truncate text-ink">{String(value)}</div>
    </div>
  );
}

const STAGES = [
  { key: "queued", label: "Queued", icon: Clock },
  { key: "claimed", label: "Claimed", icon: PlayCircle },
  { key: "running", label: "Running", icon: PlayCircle },
  { key: "completed", label: "Completed", icon: CheckCircle2 },
];

function LifecycleStrip({ status }) {
  const failureLike = status === "dead" || status === "failed" || status === "retrying";
  const activeIndex = STAGES.findIndex((s) => s.key === status);
  return (
    <div>
      <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-ink-faint">Lifecycle</div>
      <div className="flex items-center">
        {STAGES.map((s, i) => {
          const done = !failureLike && activeIndex >= 0 && i <= activeIndex;
          const Icon = s.icon;
          return (
            <div key={s.key} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full border ${done ? "border-pulse bg-pulse/10 text-pulse" : "border-border-light text-ink-faint"}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className={`font-mono text-[10px] ${done ? "text-ink" : "text-ink-faint"}`}>{s.label}</span>
              </div>
              {i < STAGES.length - 1 && <div className={`mx-1 h-px flex-1 ${done ? "bg-pulse/40" : "bg-border-light"}`} />}
            </div>
          );
        })}
        {failureLike && (
          <div className="ml-2 flex flex-col items-center gap-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-danger bg-danger/10 text-danger">
              {status === "retrying" ? <Repeat className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
            </div>
            <span className="font-mono text-[10px] text-danger">{status === "retrying" ? "Retrying" : "Dead letter"}</span>
          </div>
        )}
      </div>
    </div>
  );
}
