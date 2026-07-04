export function formatDate(value?: string | null): string {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(value?: string | null): string {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);

  if (Math.abs(diffSec) < 60) return diffSec >= 0 ? 'just now' : 'in a few seconds';

  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) {
    return diffMin > 0 ? `${diffMin}m ago` : `in ${Math.abs(diffMin)}m`;
  }

  const diffHour = Math.round(diffMin / 60);
  if (Math.abs(diffHour) < 24) {
    return diffHour > 0 ? `${diffHour}h ago` : `in ${Math.abs(diffHour)}h`;
  }

  const diffDay = Math.round(diffHour / 24);
  return diffDay > 0 ? `${diffDay}d ago` : `in ${Math.abs(diffDay)}d`;
}

export function formatDuration(ms?: number | null): string {
  if (ms == null) return '—';

  if (ms < 1000) return `${ms}ms`;

  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;

  const minutes = seconds / 60;
  if (minutes < 60) return `${minutes.toFixed(1)}m`;

  const hours = minutes / 60;
  return `${hours.toFixed(1)}h`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(undefined).format(value);
}

export function truncate(value: string, length = 48): string {
  if (value.length <= length) return value;
  return `${value.slice(0, length)}…`;
}
