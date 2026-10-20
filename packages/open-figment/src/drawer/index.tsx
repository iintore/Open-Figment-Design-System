'use client';
import type { CSSProperties, ReactNode } from 'react';
import { IconClose } from '../icons/index.js';
import { IconButton } from '../icon-button/index.js';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface DrawerProps {
  title: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * A panel that docks to the right of its positioned container (over the canvas, left of the
 * properties panel when `--panel-w` is set), such as Version history.
 */
export function Drawer({ title, onClose, children, className, style }: DrawerProps) {
  return (
    <aside className={cx('drawer', className)} aria-label={typeof title === 'string' ? title : undefined} style={{ right: 'var(--panel-w, 0px)', ...style }}>
      <div className="dialog-head">
        <span className="title">{title}</span>
        {onClose && (
          <IconButton label="Close" onClick={onClose}>
            <IconClose />
          </IconButton>
        )}
      </div>
      {children}
    </aside>
  );
}
