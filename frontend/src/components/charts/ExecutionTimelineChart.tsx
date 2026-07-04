import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { Job } from '../../types';

interface ExecutionTimelineChartProps {
  jobs: Job[];
}

/**
 * Buckets recently created jobs into hourly windows to approximate an
 * execution timeline. If the backend later exposes a dedicated
 * time-series endpoint, swap the bucketing logic below for real data.
 */
export function ExecutionTimelineChart({ jobs }: ExecutionTimelineChartProps) {
  const buckets = new Map<string, { time: string; completed: number; failed: number }>();

  for (const job of jobs) {
    const date = new Date(job.createdAt);
    const bucketKey = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;

    if (!buckets.has(bucketKey)) {
      buckets.set(bucketKey, { time: bucketKey, completed: 0, failed: 0 });
    }

    const bucket = buckets.get(bucketKey)!;

    if (job.status === 'COMPLETED') bucket.completed += 1;
    if (job.status === 'FAILED' || job.status === 'DEAD') bucket.failed += 1;
  }

  const data = Array.from(buckets.values()).slice(-12);

  if (data.length === 0) {
    return <p className="flex h-full items-center justify-center text-sm text-ink-faint">No execution history yet</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3FC97F" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#3FC97F" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F0554F" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#F0554F" stopOpacity={0} />
          </linearGradient>
        </defs>
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
        <Area type="monotone" dataKey="completed" stroke="#3FC97F" fill="url(#completedGradient)" strokeWidth={2} name="Completed" />
        <Area type="monotone" dataKey="failed" stroke="#F0554F" fill="url(#failedGradient)" strokeWidth={2} name="Failed" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
