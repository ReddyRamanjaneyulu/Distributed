import { useState } from "react";
import { Modal } from "./ui/Modal";
import { Button, Input, Label, Select } from "./ui/Primitives";
import { createJobApi } from "../lib/api";

const TYPE_HELP = {
  immediate: "Runs as soon as a worker has capacity.",
  delayed: "Becomes eligible to run after a fixed delay from now.",
  scheduled: "Runs at a specific date and time.",
  cron: "Runs repeatedly on a cron schedule.",
  batch: "Grouped with other jobs under one batch id for bulk tracking.",
};

export default function CreateJobModal({ open, onClose, queues, defaultQueueId, onCreated }) {
  const [queueId, setQueueId] = useState(defaultQueueId || queues?.[0]?.id || "");
  const [name, setName] = useState("");
  const [type, setType] = useState("immediate");
  const [delayMin, setDelayMin] = useState(5);
  const [scheduledAt, setScheduledAt] = useState("");
  const [cronExpr, setCronExpr] = useState("*/15 * * * *");
  const [batchSize, setBatchSize] = useState(5);
  const [saving, setSaving] = useState(false);

  const effectiveQueueId = queueId || queues?.[0]?.id;

  async function submit() {
    if (!name.trim() || !effectiveQueueId) return;
    setSaving(true);
    const base = { queueId: effectiveQueueId, type, name: name.trim() };
    if (type === "delayed") base.scheduledAt = Date.now() + Number(delayMin) * 60 * 1000;
    if (type === "scheduled") base.scheduledAt = scheduledAt ? new Date(scheduledAt).getTime() : Date.now();
    if (type === "cron") base.cronExpr = cronExpr;

    if (type === "batch") {
      const batchId = `batch_${Date.now()}`;
      for (let i = 0; i < Number(batchSize); i++) {
        await createJobApi({ ...base, batchId, name: `${name.trim()} #${i + 1}` });
      }
    } else {
      await createJobApi(base);
    }
    setSaving(false);
    setName("");
    onCreated?.();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New job"
      subtitle="Enqueue a job onto one of this project's queues"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="pulse" onClick={submit} disabled={saving || !name.trim()}>
            {saving ? "Creating…" : "Create job"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label>Job name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. send-welcome-email" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Queue</Label>
            <Select value={effectiveQueueId} onChange={(e) => setQueueId(e.target.value)}>
              {queues?.map((q) => <option key={q.id} value={q.id}>{q.name}</option>)}
            </Select>
          </div>
          <div>
            <Label>Type</Label>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="immediate">Immediate</option>
              <option value="delayed">Delayed</option>
              <option value="scheduled">Scheduled</option>
              <option value="cron">Recurring (cron)</option>
              <option value="batch">Batch</option>
            </Select>
          </div>
        </div>

        <p className="rounded-md bg-surface-2 px-3 py-2 font-mono text-[11px] text-ink-faint">{TYPE_HELP[type]}</p>

        {type === "delayed" && (
          <div>
            <Label>Delay (minutes from now)</Label>
            <Input type="number" min={1} value={delayMin} onChange={(e) => setDelayMin(e.target.value)} />
          </div>
        )}
        {type === "scheduled" && (
          <div>
            <Label>Run at</Label>
            <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
          </div>
        )}
        {type === "cron" && (
          <div>
            <Label>Cron expression</Label>
            <Input value={cronExpr} onChange={(e) => setCronExpr(e.target.value)} placeholder="*/15 * * * *" />
          </div>
        )}
        {type === "batch" && (
          <div>
            <Label>Number of jobs in batch</Label>
            <Input type="number" min={2} max={100} value={batchSize} onChange={(e) => setBatchSize(e.target.value)} />
          </div>
        )}
      </div>
    </Modal>
  );
}
