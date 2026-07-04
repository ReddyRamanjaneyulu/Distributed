import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageWindow(page, totalPages);

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="btn-secondary !px-3 !py-1.5 disabled:opacity-40"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Prev
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-sm text-ink-faint">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={clsx(
                'h-8 w-8 rounded-lg text-sm font-medium transition-colors',
                p === page
                  ? 'bg-accent text-white'
                  : 'text-ink-muted hover:bg-canvas-subtle hover:text-ink',
              )}
            >
              {p}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="btn-secondary !px-3 !py-1.5 disabled:opacity-40"
      >
        Next
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

function getPageWindow(current: number, total: number): (number | '...')[] {
  const delta = 1;
  const range: (number | '...')[] = [];
  const rangeStart = Math.max(2, current - delta);
  const rangeEnd = Math.min(total - 1, current + delta);

  range.push(1);
  if (rangeStart > 2) range.push('...');

  for (let i = rangeStart; i <= rangeEnd; i++) range.push(i);

  if (rangeEnd < total - 1) range.push('...');
  if (total > 1) range.push(total);

  return range;
}
