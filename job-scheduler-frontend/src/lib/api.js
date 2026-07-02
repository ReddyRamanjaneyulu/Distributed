// ---------------------------------------------------------------------------
// API client.
//
// Every function here mirrors an endpoint in /docs/api.md
// (e.g. `listJobs` -> `GET /api/v1/projects/:id/jobs`). Pages only import
// from this file. To point the app at a real backend, replace the bodies
// below with `fetch()` calls -- the function signatures and return shapes
// are already REST-shaped (paginated lists, `{data, error}`-free resolved
// promises) so no calling code should need to change.
// ---------------------------------------------------------------------------

import { db, createQueue, updateQueue, createProject, createJob, requeueDlqEntry, retryJob, STATUS } from "./engine";

const latency = (min = 120, max = 320) => new Promise((r) => setTimeout(r, min + Math.random() * (max - min)));

function paginate(items, { page = 1, pageSize = 20 } = {}) {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
  };
}

// --- Projects ---------------------------------------------------------------

export async function listProjects() {
  await latency();
  return db.projects.slice().sort((a, b) => a.createdAt - b.createdAt);
}

export async function addProject(input) {
  await latency();
  return createProject(input);
}

// --- Queues -------------------------------------------------------------

export async function listQueues({ projectId } = {}) {
  await latency();
  let qs = db.queues.slice();
  if (projectId) qs = qs.filter((q) => q.projectId === projectId);
  return qs.map((q) => enrichQueue(q));
}

export async function getQueue(id) {
  await latency();
  const q = db.queues.find((q) => q.id === id);
  return q ? enrichQueue(q) : null;
}

function enrichQueue(q) {
  const qJobs = db.jobs.filter((j) => j.queueId === q.id);
  return {
    ...q,
    stats: {
      queued: qJobs.filter((j) => j.status === STATUS.QUEUED).length,
      scheduled: qJobs.filter((j) => j.status === STATUS.SCHEDULED).length,
      running: qJobs.filter((j) => j.status === STATUS.RUNNING || j.status === STATUS.CLAIMED).length,
      retrying: qJobs.filter((j) => j.status === STATUS.RETRYING).length,
      completed: qJobs.filter((j) => j.status === STATUS.COMPLETED).length,
      dead: qJobs.filter((j) => j.status === STATUS.DEAD).length,
      total: qJobs.length,
    },
  };
}

export async function createQueueApi(input) {
  await latency();
  return createQueue(input);
}

export async function patchQueue(id, patch) {
  await latency();
  return updateQueue(id, patch);
}

export async function pauseQueue(id) {
  return patchQueue(id, { status: "paused" });
}
export async function resumeQueue(id) {
  return patchQueue(id, { status: "active" });
}

// --- Jobs ------------------------------------------------------------------

export async function listJobs({ projectId, queueId, status, type, search, page = 1, pageSize = 20 } = {}) {
  await latency();
  let js = db.jobs.slice();
  if (projectId) js = js.filter((j) => j.projectId === projectId);
  if (queueId) js = js.filter((j) => j.queueId === queueId);
  if (status && status !== "all") js = js.filter((j) => j.status === status);
  if (type && type !== "all") js = js.filter((j) => j.type === type);
  if (search) {
    const s = search.toLowerCase();
    js = js.filter((j) => j.name.toLowerCase().includes(s) || j.id.toLowerCase().includes(s));
  }
  js.sort((a, b) => b.updatedAt - a.updatedAt);
  const result = paginate(js, { page, pageSize });
  result.items = result.items.map((j) => enrichJob(j));
  return result;
}

export async function getJob(id) {
  await latency();
  const j = db.jobs.find((j) => j.id === id);
  return j ? enrichJob(j) : null;
}

function enrichJob(j) {
  const queue = db.queues.find((q) => q.id === j.queueId);
  const worker = j.workerId ? db.workers.find((w) => w.id === j.workerId) : null;
  return { ...j, queueName: queue?.name, worker: worker ? { id: worker.id, name: worker.name } : null };
}

export async function listExecutions(jobId) {
  await latency();
  return db.executions.filter((e) => e.jobId === jobId).sort((a, b) => a.startedAt - b.startedAt);
}

export async function listLogs(jobId) {
  await latency();
  return db.logs.filter((l) => l.jobId === jobId).sort((a, b) => a.timestamp - b.timestamp);
}

export async function createJobApi(input) {
  await latency();
  return createJob(input);
}

export async function retryJobApi(id) {
  await latency();
  return retryJob(id);
}

// --- Workers -----------------------------------------------------------

export async function listWorkers() {
  await latency();
  return db.workers.map((w) => ({
    ...w,
    currentJobs: w.currentJobIds.map((id) => db.jobs.find((j) => j.id === id)).filter(Boolean),
    heartbeatAgeMs: Date.now() - w.lastHeartbeat,
  }));
}

// --- Dead letter queue ---------------------------------------------------

export async function listDlq({ projectId, queueId, page = 1, pageSize = 20 } = {}) {
  await latency();
  let entries = db.dlq.slice();
  if (queueId) entries = entries.filter((d) => d.queueId === queueId);
  if (projectId) entries = entries.filter((d) => db.queues.find((q) => q.id === d.queueId)?.projectId === projectId);
  entries.sort((a, b) => b.failedAt - a.failedAt);
  const result = paginate(entries, { page, pageSize });
  result.items = result.items.map((d) => {
    const job = db.jobs.find((j) => j.id === d.jobId);
    const queue = db.queues.find((q) => q.id === d.queueId);
    return { ...d, job, queueName: queue?.name };
  });
  return result;
}

export async function requeueDlq(id) {
  await latency();
  return requeueDlqEntry(id);
}

// --- Metrics / overview -----------------------------------------------

export async function getOverview({ projectId } = {}) {
  await latency();
  let js = db.jobs.slice();
  let qs = db.queues.slice();
  if (projectId) {
    js = js.filter((j) => j.projectId === projectId);
    qs = qs.filter((q) => q.projectId === projectId);
  }
  const byStatus = (s) => js.filter((j) => j.status === s).length;
  const completedRecent = js.filter((j) => j.status === STATUS.COMPLETED && j.finishedAt && j.finishedAt > Date.now() - 1000 * 60 * 60 * 6);
  const avgDuration = completedRecent.length
    ? Math.round(completedRecent.reduce((a, j) => a + (j.durationMs || 0), 0) / completedRecent.length)
    : 0;
  const failed = js.filter((j) => j.status === STATUS.DEAD || j.status === STATUS.FAILED).length;
  const successRate = js.length ? Math.round(((js.length - failed) / js.length) * 1000) / 10 : 100;

  // throughput over the last 30 minutes, bucketed per minute
  const buckets = [];
  const bucketSizeMs = 60 * 1000;
  const nowT = Date.now();
  for (let i = 29; i >= 0; i--) {
    const bucketStart = nowT - i * bucketSizeMs;
    const bucketEnd = bucketStart + bucketSizeMs;
    const completed = js.filter((j) => j.finishedAt && j.finishedAt >= bucketStart && j.finishedAt < bucketEnd && j.status === STATUS.COMPLETED).length;
    const failedInBucket = js.filter((j) => j.finishedAt && j.finishedAt >= bucketStart && j.finishedAt < bucketEnd && (j.status === STATUS.DEAD || j.status === STATUS.FAILED)).length;
    buckets.push({
      t: new Date(bucketStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      completed,
      failed: failedInBucket,
    });
  }

  return {
    counts: {
      queued: byStatus(STATUS.QUEUED),
      scheduled: byStatus(STATUS.SCHEDULED),
      running: byStatus(STATUS.RUNNING) + byStatus(STATUS.CLAIMED),
      retrying: byStatus(STATUS.RETRYING),
      completed: byStatus(STATUS.COMPLETED),
      dead: byStatus(STATUS.DEAD),
      total: js.length,
    },
    queueCount: qs.length,
    activeQueueCount: qs.filter((q) => q.status === "active").length,
    workerCount: db.workers.length,
    onlineWorkerCount: db.workers.filter((w) => w.status !== "offline").length,
    avgDuration,
    successRate,
    throughput: buckets,
  };
}
