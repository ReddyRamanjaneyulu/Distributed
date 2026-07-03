import { Cpu, Server } from "lucide-react";
import Topbar from "../components/Topbar";
import { Panel, StatCard, EmptyState } from "../components/ui/Primitives";
import Badge from "../components/ui/Badge";
import { usePoll } from "../lib/usePoll";
import { listWorkers } from "../lib/api";
import { timeAgo } from "../lib/utils";

export default function Workers() {
  const { data: workers } = usePoll(() => listWorkers(), [], 1200);

  const online = workers?.filter((w) => w.status !== "offline").length ?? 0;
  const busy = workers?.filter((w) => w.status === "busy").length ?? 0;
  const totalCapacity = workers?.reduce((a, w) => a + w.concurrency, 0) ?? 0;
  const usedCapacity = workers?.reduce((a, w) => a + w.currentJobIds.length, 0) ?? 0;

  return (
    <>
      <Topbar title="Workers" subtitle="Live worker fleet, heartbeats and current assignments" />

      <main className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Workers online" value={`${online}/${workers?.length ?? 0}`} icon={Server} accent="text-success" />
          <StatCard label="Currently busy" value={busy} icon={Cpu} accent="text-pulse" />
          <StatCard label="Capacity used" value={`${usedCapacity}/${totalCapacity}`} sub="concurrent execution slots" />
          <StatCard label="Utilization" value={totalCapacity ? `${Math.round((usedCapacity / totalCapacity) * 100)}%` : "—"} />
        </div>

        <Panel>
          {workers?.length ? (
            <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-3">
              {workers.map((w) => (
                <div key={w.id} className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm font-medium text-ink">{w.name}</div>
                    <Badge status={w.status} />
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-ink-faint">{w.host} · {w.version}</div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-md border border-border-light bg-surface-2 px-2.5 py-2">
                      <div className="text-[10px] uppercase tracking-wider text-ink-faint">Slots</div>
                      <div className="mt-0.5 font-mono tabular text-ink">{w.currentJobIds.length}/{w.concurrency}</div>
                    </div>
                    <div className="rounded-md border border-border-light bg-surface-2 px-2.5 py-2">
                      <div className="text-[10px] uppercase tracking-wider text-ink-faint">Heartbeat</div>
                      <div className="mt-0.5 font-mono tabular text-ink">{w.status === "offline" ? "stale" : timeAgo(w.lastHeartbeat)}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 text-[10px] uppercase tracking-wider text-ink-faint">Running jobs</div>
                    {w.currentJobs.length ? (
                      <div className="space-y-1.5">
                        {w.currentJobs.map((j) => (
                          <div key={j.id} className="flex items-center justify-between rounded-md bg-surface-2 px-2.5 py-1.5">
                            <span className="truncate font-mono text-[11px] text-ink-dim">{j.name}</span>
                            <span className="font-mono text-[10px] text-ink-faint">attempt {j.attempts}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-md border border-dashed border-border-light px-2.5 py-3 text-center text-[11px] text-ink-faint">idle</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No workers registered" subtitle="Start a worker process to see it appear here." />
          )}
        </Panel>
      </main>
    </>
  );
}
