'use client';
import type { ReactNode } from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface ModeSwitchOption<T extends string> {
  value: T;
  /** Accessible name and tooltip, e.g. "Dev Mode". */
  label: string;
  icon: ReactNode;
  /** Shown but not selectable (e.g. a mode not available in this build). */
  disabled?: boolean;
  /** `dev` gives the selected state Dev Mode's green. */
  tone?: 'default' | 'dev';
}

export interface ModeSwitchProps<T extends string> {
  value: T;
  options: ModeSwitchOption<T>[];
  onChange: (value: T) => void;
  /** Accessible name of the group. */
  'aria-label'?: string;
  className?: string;
}

/** The editor's mode switch: Draw, Design, Motion and Dev Mode. */
export function ModeSwitch<T extends string>({ value, options, onChange, className, ...aria }: ModeSwitchProps<T>) {
  return (
    <div className={cx('mode-switch', className)} role="group" aria-label={aria['aria-label'] ?? 'Mode'}>
      {options.map((o) => {
        const on = o.value === value && !o.disabled;
        return (
          <button
            key={o.value}
            type="button"
            className={cx(on && 'on', on && o.tone === 'dev' && 'dev', o.disabled && 'disabled')}
            aria-label={o.label}
            title={o.label}
            aria-pressed={o.disabled ? undefined : on}
            aria-disabled={o.disabled || undefined}
            onClick={() => !o.disabled && onChange(o.value)}
          >
            {o.icon}
          </button>
        );
      })}
    </div>
  );
}
