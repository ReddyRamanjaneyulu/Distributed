import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ListChecks, Timer, Percent, Cpu, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Topbar from "../components/Topbar";
import { Panel, PanelHeader, StatCard, Button, Skeleton } from "../components/ui/Primitives";
import Badge from "../components/ui/Badge";
import { useApp } from "../lib/AppContext";
import { usePoll } from "../lib/usePoll";
import { getOverview, listQueues, listDlq } from "../lib/api";
import { formatDuration, timeAgo } from "../lib/utils";

export default function Overview() {
  const { project } = useApp();
  const { data: overview } = usePoll(() => getOverview({ projectId: project?.id }), [project?.id], 1500);
  const { data: queues } = usePoll(() => listQueues({ projectId: project?.id }), [project?.id], 2000);
  const { data: dlq } = usePoll(() => listDlq({ projectId: project?.id, pageSize: 5 }), [project?.id], 2000);

  return (
    <>
      <Topbar title="Overview" subtitle={project ? `System health for ${project.name}` : "Loading…"} />

      <main className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Jobs in flight" value={overview ? overview.counts.running + overview.counts.claimed : "—"} sub={overview ? `${overview.counts.queued} queued · ${overview.counts.scheduled} scheduled` : ""} icon={ListChecks} accent="text-accent" />
          <StatCard label="Success rate (all-time)" value={overview ? `${overview.successRate}%` : "—"} sub={overview ? `${overview.counts.dead} in dead letter` : ""} icon={Percent} accent={overview && overview.successRate < 90 ? "text-warning" : "text-success"} />
          <StatCard label="Avg. duration (6h)" value={overview ? formatDuration(overview.avgDuration) : "—"} sub="completed executions" icon={Timer} accent="text-pulse" />
          <StatCard label="Workers online" value={overview ? `${overview.onlineWorkerCount}/${overview.workerCount}` : "—"} sub={overview ? `${overview.activeQueueCount}/${overview.queueCount} queues active` : ""} icon={Cpu} accent="text-ink" />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <Panel className="xl:col-span-2">
            <PanelHeader eyebrow="Live" title="Throughput" subtitle="Completed vs. failed executions, last 30 minutes" />
            <div className="h-64 px-2 py-4">
              {overview ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={overview.throughput} margin={{ top: 6, right: 12, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22D3C7" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#22D3C7" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="failedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F87171" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#F87171" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1D2230" vertical={false} />
                    <XAxis dataKey="t" tick={{ fill: "#5B6178", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={{ stroke: "#232838" }} tickLine={false} interval={5} />
                    <YAxis tick={{ fill: "#5B6178", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: "#171B26", border: "1px solid #232838", borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: "#9AA2B8", fontFamily: "IBM Plex Mono", fontSize: 11 }}
                    />
                    <Area type="monotone" dataKey="completed" stroke="#22D3C7" fill="url(#completedGrad)" strokeWidth={2} name="Completed" />
                    <Area type="monotone" dataKey="failed" stroke="#F87171" fill="url(#failedGrad)" strokeWidth={2} name="Failed" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Skeleton className="h-full w-full" />
              )}
            </div>
          </Panel>

          <Panel>
            <PanelHeader eyebrow="Live" title="Recent dead letters" subtitle="Jobs that exhausted retries" action={
              <Link to="/dlq"><Button variant="ghost" size="sm">View all <ArrowRight className="h-3.5 w-3.5" /></Button></Link>
            } />
            <div className="divide-y divide-border">
              {dlq?.items?.length ? dlq.items.map((d) => (
                <Link to="/dlq" key={d.id} className="block px-5 py-3 hover:bg-surface-hover">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-ink">{d.job?.name}</span>
                    <span className="font-mono text-[10px] text-ink-faint">{timeAgo(d.failedAt)}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-ink-dim">{d.reason}</p>
                </Link>
              )) : (
                <div className="px-5 py-8 text-center text-xs text-ink-faint">No dead letters right now.</div>
              )}
            </div>
          </Panel>
        </div>

        <Panel>
          <PanelHeader eyebrow={`${queues?.length ?? 0} queues`} title="Queue health" subtitle="Backlog and throughput by queue" action={
            <Link to="/queues"><Button variant="ghost" size="sm">Manage queues <ArrowRight className="h-3.5 w-3.5" /></Button></Link>
          } />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wider text-ink-faint font-mono">
                  <th className="px-5 py-2.5 font-medium">Queue</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                  <th className="px-5 py-2.5 font-medium">Priority</th>
                  <th className="px-5 py-2.5 font-medium">Concurrency</th>
                  <th className="px-5 py-2.5 font-medium">Queued</th>
                  <th className="px-5 py-2.5 font-medium">Running</th>
                  <th className="px-5 py-2.5 font-medium">Dead</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {queues?.map((q) => (
                  <tr key={q.id} className="hover:bg-surface-hover">
                    <td className="px-5 py-3 font-mono text-ink">{q.name}</td>
                    <td className="px-5 py-3"><Badge status={q.status} /></td>
                    <td className="px-5 py-3 tabular text-ink-dim">{q.priority}</td>
                    <td className="px-5 py-3 tabular text-ink-dim">{q.concurrencyLimit}</td>
                    <td className="px-5 py-3 tabular text-ink-dim">{q.stats.queued}</td>
                    <td className="px-5 py-3 tabular text-pulse">{q.stats.running}</td>
                    <td className="px-5 py-3 tabular text-dlq">{q.stats.dead}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </main>
    </>
  );
}
