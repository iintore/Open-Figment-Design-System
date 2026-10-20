'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconChevronDown } from '../icons/index.js';
import { Menu } from '../menu/index.js';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface SelectOption<T extends string | number> {
  value: T;
  label: string;
  /** Draw a separator above this option in the menu. */
  separatorBefore?: boolean;
  disabled?: boolean;
}

export interface SelectProps<T extends string | number> {
  /** The current value, or `'mixed'` when a multi-selection disagrees. */
  value: T | 'mixed';
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  title?: string;
  'aria-label'?: string;
  className?: string;
}

/** A dropdown that opens a dark menu of options below the button, the current one checked. */
export function Select<T extends string | number>({ value, options, onChange, title, className, ...aria }: SelectProps<T>) {
  const btn = useRef<HTMLButtonElement>(null);
  const [at, setAt] = useState<{ x: number; y: number } | null>(null);
  const cur = options.find((o) => o.value === value);
  useEffect(() => {
    if (!at) return;
    const close = (e: Event) => {
      if (e.target instanceof Node && (btn.current?.contains(e.target) || (e.target as Element).closest?.('.menu'))) return;
      setAt(null);
    };
    const t = window.setTimeout(() => {
      window.addEventListener('pointerdown', close);
      window.addEventListener('blur', close);
      window.addEventListener('resize', close);
    }, 0);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('pointerdown', close);
      window.removeEventListener('blur', close);
      window.removeEventListener('resize', close);
    };
  }, [at]);
  return (
    <>
      <button
        ref={btn}
        type="button"
        className={cx('select-btn', className)}
        title={title}
        aria-label={aria['aria-label']}
        aria-haspopup="menu"
        aria-expanded={!!at}
        onClick={(e) => {
          if (at) return setAt(null);
          const r = e.currentTarget.getBoundingClientRect();
          setAt({ x: r.left, y: r.bottom + 4 });
        }}
      >
        <span>{value === 'mixed' ? 'Mixed' : cur?.label ?? String(value)}</span>
        <IconChevronDown />
      </button>
      {at &&
        createPortal(
          <Menu
            x={at.x}
            y={at.y}
            onClose={() => {
              setAt(null);
              btn.current?.focus();
            }}
            items={options.flatMap((o) => [
              ...(o.separatorBefore ? [{ separator: true }] : []),
              { label: o.label, checked: o.value === value, disabled: o.disabled, onSelect: () => onChange(o.value) },
            ])}
          />,
          document.body,
        )}
    </>
  );
}
