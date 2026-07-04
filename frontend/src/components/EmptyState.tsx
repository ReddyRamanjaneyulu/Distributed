import type { ComponentType, ReactNode, SVGProps } from 'react';

interface EmptyStateProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-canvas-subtle">
        <Icon className="h-6 w-6 text-ink-faint" />
      </div>
      <div>
        <p className="font-medium text-ink">{title}</p>
        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
