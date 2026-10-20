'use client';
import type { CSSProperties, ReactNode } from 'react';
import { IconClose } from '../icons/index.js';
import { IconButton } from '../icon-button/index.js';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface PopoverProps {
  title: ReactNode;
  /** Viewport position (fixed). Omit both to render in place. */
  x?: number;
  y?: number;
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** A white floating panel with a title and close button, for settings that don't fit in a row. */
export function Popover({ title, x, y, onClose, children, className, style }: PopoverProps) {
  const fixed = x !== undefined && y !== undefined;
  return (
    <div className={cx('popover', className)} role="dialog" aria-label={typeof title === 'string' ? title : undefined} style={fixed ? { left: x, top: y, ...style } : { position: 'relative', ...style }}>
      <div className="popover-head">
        <span className="title">{title}</span>
        {onClose && (
          <IconButton label="Close" onClick={onClose}>
            <IconClose />
          </IconButton>
        )}
      </div>
      {children}
    </div>
  );
}
