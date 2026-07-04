import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { WorkerHeartbeat } from '../../types';

interface WorkerActivityChartProps {
  heartbeats: WorkerHeartbeat[];
}

export function WorkerActivityChart({ heartbeats }: WorkerActivityChartProps) {
  const data = [...heartbeats]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((hb) => ({
      time: new Date(hb.timestamp).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      }),
      activeJobs: hb.activeJobs,
      queuedJobs: hb.queuedJobs,
    }));

  if (data.length === 0) {
    return <p className="flex h-full items-center justify-center text-sm text-ink-faint">No heartbeat data yet</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1A1B23" vertical={false} />
        <XAxis dataKey="time" stroke="#5C6070" tick={{ fontSize: 11 }} />
        <YAxis stroke="#5C6070" tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: '#181A23',
            border: '1px solid #22242E',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Line type="monotone" dataKey="activeJobs" stroke="#5B8CFF" strokeWidth={2} dot={false} name="Active jobs" />
        <Line type="monotone" dataKey="queuedJobs" stroke="#F5A623" strokeWidth={2} dot={false} name="Queued jobs" />
      </LineChart>
    </ResponsiveContainer>
  );
}
