import { useMemo } from "react";

// The scheduler's "vitals" line: a heartbeat-style waveform built from real
// completed-vs-failed throughput. It's the one signature visual element of
// the dashboard -- a nod to the worker heartbeat concept at the heart of the
// system, made literal.
export default function PulseStrip({ throughput = [], height = 44 }) {
  const { points, failPoints, max } = useMemo(() => {
    const vals = throughput.length ? throughput : Array.from({ length: 30 }, () => ({ completed: 0, failed: 0 }));
    const max = Math.max(1, ...vals.map((v) => v.completed + v.failed));
    const w = 100;
    const step = w / Math.max(1, vals.length - 1);
    const points = vals
      .map((v, i) => `${(i * step).toFixed(2)},${(28 - (v.completed / max) * 24).toFixed(2)}`)
      .join(" ");
    const failPoints = vals
      .map((v, i) => `${(i * step).toFixed(2)},${(28 - (v.failed / max) * 24).toFixed(2)}`)
      .join(" ");
    return { points, failPoints, max };
  }, [throughput]);

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-full w-full">
        <line x1="0" y1="28" x2="100" y2="28" stroke="#232838" strokeWidth="0.5" />
        <polyline
          points={failPoints}
          fill="none"
          stroke="#F87171"
          strokeWidth="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.55"
        />
        <polyline
          points={points}
          fill="none"
          stroke="#22D3C7"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_4px_rgba(34,211,199,0.6)]"
        />
      </svg>
    </div>
  );
}
