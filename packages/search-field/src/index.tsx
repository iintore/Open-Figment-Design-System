'use client';
import { forwardRef, type InputHTMLAttributes } from 'react';
import { IconSearch } from '@open-figment/icons';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
}

/** The search input at the top of the layers, assets and file lists. */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField({ value, onChange, placeholder = 'Search', className, ...rest }, ref) {
  return (
    <div className={cx('search', className)}>
      <IconSearch />
      <input ref={ref} type="search" value={value} placeholder={placeholder} aria-label={rest['aria-label'] ?? placeholder} onChange={(e) => onChange(e.target.value)} {...rest} />
    </div>
  );
});
