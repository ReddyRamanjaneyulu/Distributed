import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, className, ...rest }, ref) => {
    return (
      <div className="relative">
        <select ref={ref} className={`input-field appearance-none pr-9 ${className ?? ''}`} {...rest}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
      </div>
    );
  },
);

Select.displayName = 'Select';
