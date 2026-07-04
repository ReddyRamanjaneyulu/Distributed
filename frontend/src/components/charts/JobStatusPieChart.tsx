import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface JobStatusPieChartProps {
  data: {
    running: number;
    completed: number;
    failed: number;
    dead: number;
    queued: number;
    retrying: number;
  };
}

const COLORS: Record<string, string> = {
  Running: '#5B8CFF',
  Completed: '#3FC97F',
  Failed: '#F0554F',
  Dead: '#8B5CF6',
  Queued: '#5C6070',
  Retrying: '#F5A623',
};

export function JobStatusPieChart({ data }: JobStatusPieChartProps) {
  const chartData = [
    { name: 'Running', value: data.running },
    { name: 'Completed', value: data.completed },
    { name: 'Failed', value: data.failed },
    { name: 'Dead', value: data.dead },
    { name: 'Queued', value: data.queued },
    { name: 'Retrying', value: data.retrying },
  ].filter((d) => d.value > 0);

  if (chartData.length === 0) {
    return <p className="flex h-full items-center justify-center text-sm text-ink-faint">No job data yet</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={3}
          strokeWidth={0}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#181A23',
            border: '1px solid #22242E',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          wrapperStyle={{ fontSize: 12, color: '#9296A6' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
