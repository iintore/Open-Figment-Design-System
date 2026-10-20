'use client';
import type { ReactNode } from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** The label, e.g. "Clip content". */
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

/** A checkbox with its label, as used for *Clip content* and *Show in exports*. */
export function Checkbox({ checked, onChange, children, disabled, className }: CheckboxProps) {
  return (
    <label className={cx('checkbox-row', className)}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      {children}
    </label>
  );
}
