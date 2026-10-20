'use client';
import type { MouseEvent, ReactNode } from 'react';
import { IconChevronDown } from '@open-figment/icons';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface TypeHeaderProps {
  /** The selection's type, e.g. "Frame", "Text", "Component". */
  label: string;
  /** Opens the type menu (e.g. frame presets). */
  onLabelClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Icon buttons on the right. */
  children?: ReactNode;
  className?: string;
}

/** The header of the properties panel naming what's selected, with its actions. */
export function TypeHeader({ label, onLabelClick, children, className }: TypeHeaderProps) {
  return (
    <div className={cx('type-header', className)}>
      <button type="button" className="type-btn" aria-haspopup={onLabelClick ? 'menu' : undefined} onClick={onLabelClick}>
        {label}
        <IconChevronDown />
      </button>
      {children}
    </div>
  );
}
