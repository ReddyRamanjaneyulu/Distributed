// ---------------------------------------------------------------------------
// Simulated scheduler engine.
//
// This module stands in for the real backend described in the design docs
// (see /docs/api.md and /docs/schema.md). It models the same entities the
// REST API exposes -- Projects, Queues, Jobs, Executions, Workers, Heartbeats,
// Logs and Dead Letter entries -- and advances jobs through the same
// lifecycle a real worker fleet would: queued -> scheduled -> claimed ->
// running -> completed | retrying -> dead.
//
// Swapping this for the real API later means replacing the exported
// functions in `api.js` with `fetch()` calls against the backend; every page
// in this app only talks to `api.js`, never to this file directly.
// ---------------------------------------------------------------------------

const now = () => Date.now();
const uid = (p) => `${p}_${Math.random().toString(36).slice(2, 9)}`;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

export const STATUS = {
  QUEUED: "queued",
  SCHEDULED: "scheduled",
  CLAIMED: "claimed",
  RUNNING: "running",
  RETRYING: "retrying",
  COMPLETED: "completed",
  FAILED: "failed",
  DEAD: "dead",
  PAUSED: "paused",
};

const STATUS_LABEL = {
  queued: "Queued",
  scheduled: "Scheduled",
  claimed: "Claimed",
  running: "Running",
  retrying: "Retrying",
  completed: "Completed",
  failed: "Failed",
  dead: "Dead letter",
  paused: "Paused",
};
export const statusLabel = (s) => STATUS_LABEL[s] || s;

const JOB_TYPES = ["immediate", "delayed", "scheduled", "cron", "batch"];
const JOB_NAMES = [
  "send-email-confirmation", "generate-invoice-pdf", "sync-crm-contacts",
  "resize-uploaded-image", "compute-monthly-report", "webhook-dispatch",
  "transcode-video", "index-search-document", "expire-stale-sessions",
  "reconcile-payments", "push-notification-batch", "geo-ip-enrich",
  "export-user-data", "cleanup-tmp-storage", "refresh-materialized-view",
];
const FAILURE_REASONS = [
  "Connection timeout to downstream service",
  "Unhandled exception: NullReferenceException at handler.js:44",
  "Rate limited by third-party API (429)",
  "Payload validation failed: missing field 'customer_id'",
  "Out of memory during transcode",
  "Database deadlock detected, transaction rolled back",
  "Upstream returned 503 Service Unavailable",
];

// --- seed: projects & queues -----------------------------------------------

const projects = [
  { id: "proj_core", name: "Core Platform", slug: "core-platform", createdAt: now() - 1000 * 60 * 60 * 24 * 120 },
  { id: "proj_billing", name: "Billing & Payments", slug: "billing", createdAt: now() - 1000 * 60 * 60 * 24 * 90 },
  { id: "proj_media", name: "Media Pipeline", slug: "media-pipeline", createdAt: now() - 1000 * 60 * 60 * 24 * 45 },
];

const retryPolicyPresets = {
  fixed: { type: "fixed", baseDelaySec: 30, maxAttempts: 3 },
  linear: { type: "linear", baseDelaySec: 20, maxAttempts: 5 },
  exponential: { type: "exponential", baseDelaySec: 10, maxAttempts: 6 },
};

let queues = [
  { id: "q_emails", projectId: "proj_core", name: "emails", priority: 8, concurrencyLimit: 6, status: "active", retryPolicy: { ...retryPolicyPresets.exponential }, createdAt: now() - 1000 * 60 * 60 * 24 * 100 },
  { id: "q_webhooks", projectId: "proj_core", name: "webhooks", priority: 6, concurrencyLimit: 10, status: "active", retryPolicy: { ...retryPolicyPresets.exponential }, createdAt: now() - 1000 * 60 * 60 * 24 * 95 },
  { id: "q_reports", projectId: "proj_core", name: "reports", priority: 3, concurrencyLimit: 2, status: "active", retryPolicy: { ...retryPolicyPresets.fixed }, createdAt: now() - 1000 * 60 * 60 * 24 * 80 },
  { id: "q_payments", projectId: "proj_billing", name: "payment-reconciliation", priority: 9, concurrencyLimit: 4, status: "active", retryPolicy: { ...retryPolicyPresets.linear }, createdAt: now() - 1000 * 60 * 60 * 24 * 88 },
  { id: "q_invoices", projectId: "proj_billing", name: "invoice-generation", priority: 5, concurrencyLimit: 3, status: "paused", retryPolicy: { ...retryPolicyPresets.fixed }, createdAt: now() - 1000 * 60 * 60 * 24 * 70 },
  { id: "q_transcode", projectId: "proj_media", name: "video-transcode", priority: 7, concurrencyLimit: 4, status: "active", retryPolicy: { ...retryPolicyPresets.exponential }, createdAt: now() - 1000 * 60 * 60 * 24 * 40 },
  { id: "q_thumbnails", projectId: "proj_media", name: "thumbnail-generation", priority: 4, concurrencyLimit: 8, status: "active", retryPolicy: { ...retryPolicyPresets.linear }, createdAt: now() - 1000 * 60 * 60 * 24 * 38 },
];

let workers = Array.from({ length: 9 }).map((_, i) => {
  const q = pick(queues);
  return {
    id: uid("wrk"),
    name: `worker-${String(i + 1).padStart(2, "0")}`,
    host: `10.42.${randInt(0, 3)}.${randInt(2, 250)}`,
    status: "idle",
    concurrency: pick([2, 4, 6]),
    currentJobIds: [],
    queueIds: [q.id],
    lastHeartbeat: now(),
    startedAt: now() - randInt(1000 * 60 * 10, 1000 * 60 * 60 * 24 * 6),
    version: "v1.4.2",
  };
});

let jobs = [];
let executions = [];
let logs = [];
let dlq = [];

function addLog(jobId, executionId, level, message) {
  logs.push({ id: uid("log"), jobId, executionId, level, message, timestamp: now() });
}

function newJob({ queueId, type, name, priority, scheduledAt, cronExpr, batchId }) {
  const queue = queues.find((q) => q.id === queueId);
  const job = {
    id: uid("job"),
    queueId,
    projectId: queue.projectId,
    type,
    name,
    payload: { requestId: uid("req") },
    status: type === "scheduled" || type === "delayed" || type === "cron" ? STATUS.SCHEDULED : STATUS.QUEUED,
    priority: priority ?? queue.priority,
    attempts: 0,
    maxAttempts: queue.retryPolicy.maxAttempts,
    retryPolicy: { ...queue.retryPolicy },
    scheduledAt: scheduledAt ?? now(),
    cronExpr: cronExpr ?? null,
    batchId: batchId ?? null,
    workerId: null,
    createdAt: now(),
    updatedAt: now(),
    startedAt: null,
    finishedAt: null,
    durationMs: null,
  };
  jobs.push(job);
  addLog(job.id, null, "info", `Job created (${type}) in queue "${queue.name}"`);
  return job;
}

// --- seed a realistic backlog ----------------------------------------------
(function seedJobs() {
  for (const q of queues) {
    const count = randInt(20, 60);
    for (let i = 0; i < count; i++) {
      const type = pick(JOB_TYPES);
      const job = newJob({
        queueId: q.id,
        type,
        name: pick(JOB_NAMES),
        scheduledAt: type === "delayed" ? now() + randInt(1000 * 30, 1000 * 60 * 30) : now(),
        cronExpr: type === "cron" ? pick(["*/15 * * * *", "0 * * * *", "0 0 * * *"]) : null,
      });
      // fast-forward some jobs into history so dashboards aren't empty
      const roll = Math.random();
      if (roll < 0.55) {
        job.status = STATUS.COMPLETED;
        job.attempts = 1;
        job.createdAt = now() - randInt(1000 * 60, 1000 * 60 * 60 * 36);
        job.startedAt = job.createdAt + randInt(200, 4000);
        job.durationMs = randInt(80, 6000);
        job.finishedAt = job.startedAt + job.durationMs;
        job.updatedAt = job.finishedAt;
        const ex = {
          id: uid("exec"), jobId: job.id, workerId: pick(workers).id, attempt: 1,
          status: STATUS.COMPLETED, startedAt: job.startedAt, finishedAt: job.finishedAt, error: null,
        };
        executions.push(ex);
      } else if (roll < 0.68) {
        job.status = STATUS.DEAD;
        job.attempts = job.maxAttempts;
        job.createdAt = now() - randInt(1000 * 60 * 5, 1000 * 60 * 60 * 40);
        job.updatedAt = now() - randInt(1000 * 10, 1000 * 60 * 60);
        const reason = pick(FAILURE_REASONS);
        for (let a = 1; a <= job.attempts; a++) {
          const st = job.createdAt + a * randInt(20000, 60000);
          executions.push({
            id: uid("exec"), jobId: job.id, workerId: pick(workers).id, attempt: a,
            status: STATUS.FAILED, startedAt: st, finishedAt: st + randInt(100, 3000), error: reason,
          });
        }
        dlq.push({ id: uid("dlq"), jobId: job.id, queueId: q.id, reason, failedAt: job.updatedAt, attempts: job.attempts });
        addLog(job.id, null, "error", `Moved to dead letter queue after ${job.attempts} attempts: ${reason}`);
      }
    }
  }
})();

// --- pub/sub -----------------------------------------------------------------

const listeners = new Set();
function emit() {
  for (const l of listeners) l();
}
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// --- simulation tick -----------------------------------------------------

function tick() {
  const t = now();

  // heartbeats
  for (const w of workers) {
    if (w.status !== "offline") w.lastHeartbeat = t;
  }

  // promote scheduled -> queued when due
  for (const j of jobs) {
    if (j.status === STATUS.SCHEDULED && j.scheduledAt <= t) {
      j.status = STATUS.QUEUED;
      j.updatedAt = t;
      addLog(j.id, null, "info", "Job promoted from scheduled to queued");
    }
  }

  // claim jobs onto idle-ish workers, respecting queue concurrency limits
  for (const q of queues) {
    if (q.status === "paused") continue;
    const runningForQueue = jobs.filter((j) => j.queueId === q.id && (j.status === STATUS.RUNNING || j.status === STATUS.CLAIMED)).length;
    let capacity = q.concurrencyLimit - runningForQueue;
    if (capacity <= 0) continue;

    const candidates = jobs
      .filter((j) => j.queueId === q.id && j.status === STATUS.QUEUED)
      .sort((a, b) => b.priority - a.priority || a.createdAt - b.createdAt);

    for (const job of candidates) {
      if (capacity <= 0) break;
      const worker = workers.find((w) => w.status !== "offline" && w.currentJobIds.length < w.concurrency);
      if (!worker) break;
      job.status = STATUS.CLAIMED;
      job.workerId = worker.id;
      job.attempts += 1;
      job.updatedAt = t;
      worker.currentJobIds.push(job.id);
      worker.status = "busy";
      addLog(job.id, null, "info", `Claimed by ${worker.name} (attempt ${job.attempts}/${job.maxAttempts})`);
      capacity -= 1;

      // start running shortly after claim
      setTimeout(() => {
        if (job.status !== STATUS.CLAIMED) return;
        job.status = STATUS.RUNNING;
        job.startedAt = now();
        job.updatedAt = now();
        addLog(job.id, null, "info", "Execution started");
      }, randInt(150, 500));
    }
  }

  // progress running jobs -> completed / retrying / dead
  for (const job of jobs) {
    if (job.status !== STATUS.RUNNING) continue;
    const runFor = t - job.startedAt;
    const targetDuration = job.type === "batch" ? randInt(4000, 9000) : randInt(1200, 5000);
    if (runFor < targetDuration) continue;

    const worker = workers.find((w) => w.id === job.workerId);
    const willFail = Math.random() < 0.16;
    job.finishedAt = t;
    job.durationMs = job.finishedAt - job.startedAt;
    job.updatedAt = t;

    if (worker) {
      worker.currentJobIds = worker.currentJobIds.filter((id) => id !== job.id);
      if (worker.currentJobIds.length === 0) worker.status = "idle";
    }

    if (!willFail) {
      job.status = STATUS.COMPLETED;
      executions.push({ id: uid("exec"), jobId: job.id, workerId: job.workerId, attempt: job.attempts, status: STATUS.COMPLETED, startedAt: job.startedAt, finishedAt: job.finishedAt, error: null });
      addLog(job.id, null, "info", `Completed successfully in ${job.durationMs}ms`);
    } else {
      const reason = pick(FAILURE_REASONS);
      executions.push({ id: uid("exec"), jobId: job.id, workerId: job.workerId, attempt: job.attempts, status: STATUS.FAILED, startedAt: job.startedAt, finishedAt: job.finishedAt, error: reason });
      addLog(job.id, null, "error", `Attempt ${job.attempts} failed: ${reason}`);

      if (job.attempts >= job.maxAttempts) {
        job.status = STATUS.DEAD;
        dlq.push({ id: uid("dlq"), jobId: job.id, queueId: job.queueId, reason, failedAt: t, attempts: job.attempts });
        addLog(job.id, null, "error", `Exhausted retries, moved to dead letter queue`);
      } else {
        job.status = STATUS.RETRYING;
        const delay = computeBackoff(job.retryPolicy, job.attempts);
        job.scheduledAt = t + delay;
        addLog(job.id, null, "warn", `Will retry in ${Math.round(delay / 1000)}s (${job.retryPolicy.type} backoff)`);
        setTimeout(() => {
          if (job.status === STATUS.RETRYING) {
            job.status = STATUS.QUEUED;
            job.updatedAt = now();
          }
        }, delay);
      }
    }
    job.workerId = null;
  }

  // trickle in new immediate jobs so the system feels alive
  if (Math.random() < 0.35) {
    const q = pick(queues.filter((q) => q.status === "active"));
    if (q) newJob({ queueId: q.id, type: "immediate", name: pick(JOB_NAMES) });
  }

  // occasionally flap a worker offline/online
  if (Math.random() < 0.02) {
    const w = pick(workers);
    w.status = w.status === "offline" ? "idle" : "offline";
    if (w.status === "offline") {
      w.currentJobIds.forEach((jid) => {
        const j = jobs.find((x) => x.id === jid);
        if (j) { j.status = STATUS.QUEUED; j.workerId = null; }
      });
      w.currentJobIds = [];
    }
  }

  emit();
}

function computeBackoff(policy, attempt) {
  const base = policy.baseDelaySec * 1000;
  if (policy.type === "fixed") return base;
  if (policy.type === "linear") return base * attempt;
  if (policy.type === "exponential") return base * Math.pow(2, attempt - 1);
  return base;
}

let interval = null;
export function startEngine() {
  if (interval) return;
  interval = setInterval(tick, 900);
}
export function stopEngine() {
  clearInterval(interval);
  interval = null;
}

// --- accessors used by api.js -------------------------------------------

export const db = {
  get projects() { return projects; },
  get queues() { return queues; },
  get jobs() { return jobs; },
  get executions() { return executions; },
  get workers() { return workers; },
  get logs() { return logs; },
  get dlq() { return dlq; },
};

export function createQueue(input) {
  const q = {
    id: uid("q"),
    projectId: input.projectId,
    name: input.name,
    priority: input.priority ?? 5,
    concurrencyLimit: input.concurrencyLimit ?? 4,
    status: "active",
    retryPolicy: input.retryPolicy ?? { ...retryPolicyPresets.exponential },
    createdAt: now(),
  };
  queues.push(q);
  emit();
  return q;
}

export function updateQueue(id, patch) {
  const q = queues.find((q) => q.id === id);
  if (!q) return null;
  Object.assign(q, patch);
  emit();
  return q;
}

export function createProject(input) {
  const p = { id: uid("proj"), name: input.name, slug: input.name.toLowerCase().replace(/\s+/g, "-"), createdAt: now() };
  projects.push(p);
  emit();
  return p;
}

export function createJob(input) {
  const job = newJob(input);
  emit();
  return job;
}

export function requeueDlqEntry(dlqId) {
  const entry = dlq.find((d) => d.id === dlqId);
  if (!entry) return null;
  const job = jobs.find((j) => j.id === entry.jobId);
  if (job) {
    job.status = STATUS.QUEUED;
    job.attempts = 0;
    job.workerId = null;
    job.updatedAt = now();
    addLog(job.id, null, "info", "Manually requeued from dead letter queue");
  }
  dlq = dlq.filter((d) => d.id !== dlqId);
  emit();
  return job;
}

export function retryJob(jobId) {
  const job = jobs.find((j) => j.id === jobId);
  if (!job) return null;
  job.status = STATUS.QUEUED;
  job.workerId = null;
  job.updatedAt = now();
  addLog(job.id, null, "info", "Manually retried by operator");
  dlq = dlq.filter((d) => d.jobId !== jobId);
  emit();
  return job;
}

export { retryPolicyPresets, uid, now };
