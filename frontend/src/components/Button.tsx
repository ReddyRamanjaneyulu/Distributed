import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

import { Spinner } from './Loading';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  isLoading,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-canvas-subtle hover:text-ink',
  }[variant];

  return (
    <button
      className={clsx(variantClass, className)}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}
