import { useEffect, useState } from "react";
import { Drawer } from "./ui/Modal";
import { Button, Input, Label, Select, StatCard } from "./ui/Primitives";
import Badge from "./ui/Badge";
import { patchQueue, pauseQueue, resumeQueue } from "../lib/api";
import { formatDateTime } from "../lib/utils";

export default function QueueDrawer({ queue, onClose, onChanged }) {
  const [priority, setPriority] = useState(queue?.priority ?? 5);
  const [concurrency, setConcurrency] = useState(queue?.concurrencyLimit ?? 4);
  const [retryType, setRetryType] = useState(queue?.retryPolicy?.type ?? "exponential");
  const [maxAttempts, setMaxAttempts] = useState(queue?.retryPolicy?.maxAttempts ?? 5);
  const [baseDelay, setBaseDelay] = useState(queue?.retryPolicy?.baseDelaySec ?? 15);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!queue) return;
    setPriority(queue.priority);
    setConcurrency(queue.concurrencyLimit);
    setRetryType(queue.retryPolicy.type);
    setMaxAttempts(queue.retryPolicy.maxAttempts);
    setBaseDelay(queue.retryPolicy.baseDelaySec);
  }, [queue?.id]);

  if (!queue) return null;

  async function save() {
    setSaving(true);
    await patchQueue(queue.id, {
      priority: Number(priority),
      concurrencyLimit: Number(concurrency),
      retryPolicy: { type: retryType, maxAttempts: Number(maxAttempts), baseDelaySec: Number(baseDelay) },
    });
    setSaving(false);
    onChanged?.();
  }

  async function toggleStatus() {
    if (queue.status === "active") await pauseQueue(queue.id);
    else await resumeQueue(queue.id);
    onChanged?.();
  }

  return (
    <Drawer
      open={!!queue}
      onClose={onClose}
      title={queue.name}
      subtitle={`created ${formatDateTime(queue.createdAt)}`}
      badge={<Badge status={queue.status} />}
      footer={
        <>
          <Button variant={queue.status === "active" ? "outline" : "pulse"} onClick={toggleStatus}>
            {queue.status === "active" ? "Pause queue" : "Resume queue"}
          </Button>
          <Button variant="primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Queued" value={queue.stats.queued} />
          <StatCard label="Running" value={queue.stats.running} accent="text-pulse" />
          <StatCard label="Dead" value={queue.stats.dead} accent="text-dlq" />
        </div>

        <div>
          <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-ink-faint">Configuration</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Priority (1–10)</Label>
              <Input type="number" min={1} max={10} value={priority} onChange={(e) => setPriority(e.target.value)} />
            </div>
            <div>
              <Label>Concurrency limit</Label>
              <Input type="number" min={1} max={64} value={concurrency} onChange={(e) => setConcurrency(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border-light bg-surface-2 p-3">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-ink-faint">Retry policy</div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Strategy</Label>
              <Select value={retryType} onChange={(e) => setRetryType(e.target.value)}>
                <option value="fixed">Fixed delay</option>
                <option value="linear">Linear backoff</option>
                <option value="exponential">Exponential backoff</option>
              </Select>
            </div>
            <div>
              <Label>Max attempts</Label>
              <Input type="number" min={1} max={10} value={maxAttempts} onChange={(e) => setMaxAttempts(e.target.value)} />
            </div>
            <div>
              <Label>Base delay (s)</Label>
              <Input type="number" min={1} value={baseDelay} onChange={(e) => setBaseDelay(e.target.value)} />
            </div>
          </div>
          <p className="mt-3 font-mono text-[11px] text-ink-faint">
            {retryType === "fixed" && `Every retry waits ${baseDelay}s.`}
            {retryType === "linear" && `Attempt N waits ${baseDelay}s × N (e.g. ${baseDelay*2}s, ${baseDelay*3}s…).`}
            {retryType === "exponential" && `Attempt N waits ${baseDelay}s × 2^(N-1) (e.g. ${baseDelay*2}s, ${baseDelay*4}s…).`}
          </p>
        </div>
      </div>
    </Drawer>
  );
}
