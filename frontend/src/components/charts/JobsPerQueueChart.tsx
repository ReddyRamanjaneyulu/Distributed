import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface JobsPerQueueChartProps {
  data: { name: string; totalJobs: number }[];
}

export function JobsPerQueueChart({ data }: JobsPerQueueChartProps) {
  const chartData = data.map((d) => ({
    name: d.name.length > 12 ? `${d.name.slice(0, 12)}…` : d.name,
    totalJobs: d.totalJobs,
  }));

  if (chartData.length === 0) {
    return <p className="flex h-full items-center justify-center text-sm text-ink-faint">No queues yet</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1A1B23" vertical={false} />
        <XAxis dataKey="name" stroke="#5C6070" tick={{ fontSize: 11 }} />
        <YAxis stroke="#5C6070" tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: '#181A23',
            border: '1px solid #22242E',
            borderRadius: 8,
            fontSize: 12,
          }}
          cursor={{ fill: 'rgba(91,140,255,0.06)' }}
        />
        <Bar dataKey="totalJobs" fill="#5B8CFF" radius={[6, 6, 0, 0]} name="Jobs" />
      </BarChart>
    </ResponsiveContainer>
  );
}
