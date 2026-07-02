import { useState } from "react";
import { Modal } from "./ui/Modal";
import { Button, Input, Label, Select } from "./ui/Primitives";
import { createQueueApi } from "../lib/api";

export default function CreateQueueModal({ open, onClose, projectId, onCreated }) {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState(5);
  const [concurrency, setConcurrency] = useState(4);
  const [retryType, setRetryType] = useState("exponential");
  const [maxAttempts, setMaxAttempts] = useState(5);
  const [baseDelay, setBaseDelay] = useState(15);
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!name.trim()) return;
    setSaving(true);
    await createQueueApi({
      projectId,
      name: name.trim(),
      priority: Number(priority),
      concurrencyLimit: Number(concurrency),
      retryPolicy: { type: retryType, maxAttempts: Number(maxAttempts), baseDelaySec: Number(baseDelay) },
    });
    setSaving(false);
    setName("");
    onCreated?.();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New queue"
      subtitle="Configure priority, concurrency and retry behavior"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="pulse" onClick={submit} disabled={saving || !name.trim()}>
            {saving ? "Creating…" : "Create queue"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label>Queue name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. order-fulfillment" />
        </div>
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
        </div>
      </div>
    </Modal>
  );
}
