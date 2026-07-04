import { BellIcon } from '@heroicons/react/24/outline';

interface NavbarProps {
  title: string;
  subtitle?: string;
}

export function Navbar({ title, subtitle }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-canvas/80 px-8 py-5 backdrop-blur-md">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-lg p-2 text-ink-faint transition-colors hover:bg-canvas-subtle hover:text-ink">
          <BellIcon className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
