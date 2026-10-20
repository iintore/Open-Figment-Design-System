'use client';
import type { CSSProperties } from 'react';
import { IconStarFill } from '@open-figment/icons';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface StarButtonProps {
  starred: boolean;
  onChange: (starred: boolean) => void;
  /**
   * Inside a FileCard the button only shows on card hover (and when starred). Set `standalone`
   * to show it anywhere else.
   */
  standalone?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** The star toggle in the corner of a file card that adds a file to *Starred*. */
export function StarButton({ starred, onChange, standalone, className, style }: StarButtonProps) {
  const label = starred ? 'Remove from starred' : 'Add to starred';
  return (
    <button
      type="button"
      className={cx('star-btn', starred && 'on', className)}
      title={label}
      aria-label={label}
      aria-pressed={starred}
      style={standalone ? { display: 'grid', position: 'static', ...style } : style}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!starred);
      }}
    >
      <IconStarFill />
    </button>
  );
}
