'use client';
import type { CSSProperties, ReactNode } from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface SegmentedOption<T extends string> {
  value: T;
  icon: ReactNode;
  /** Tooltip and accessible name, e.g. "Align left (⌥A)". */
  title: string;
}

export interface SegmentedControlProps<T extends string> {
  /** The selected option, or `null` when none is on (e.g. alignment buttons). */
  value: T | null;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
}

/** A row of icon buttons sharing one grey track; the selected one is raised in white. */
export function SegmentedControl<T extends string>({ value, options, onChange, className, style, ...aria }: SegmentedControlProps<T>) {
  return (
    <div className={cx('seg', className)} role="group" aria-label={aria['aria-label']} style={style}>
      {options.map((o) => (
        <button key={o.value} type="button" className={cx(value === o.value && 'on')} title={o.title} aria-label={o.title} aria-pressed={value === null ? undefined : value === o.value} onClick={() => onChange(o.value)}>
          {o.icon}
        </button>
      ))}
    </div>
  );
}
