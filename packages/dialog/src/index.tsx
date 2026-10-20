'use client';
import type { CSSProperties, ReactNode } from 'react';
import { IconClose } from '@open-figment/icons';
import { IconButton } from '@open-figment/icon-button';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface DialogProps {
  /** Title shown in the dialog head with a close button. */
  title?: ReactNode;
  onClose?: () => void;
  /** Content above the scrolling body, e.g. a search input. */
  header?: ReactNode;
  children?: ReactNode;
  /** Width in px. Default 480. */
  width?: number;
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
}

/** A modal dialog: quick actions, keyboard shortcuts, confirmations. */
export function Dialog({ title, onClose, header, children, width = 480, className, style, ...aria }: DialogProps) {
  return (
    <div className={cx('dialog', className)} role="dialog" aria-modal="true" aria-label={aria['aria-label'] ?? (typeof title === 'string' ? title : undefined)} style={{ width, ...style }}>
      {title !== undefined && (
        <div className="dialog-head">
          <span className="title">{title}</span>
          {onClose && (
            <IconButton label="Close" onClick={onClose}>
              <IconClose />
            </IconButton>
          )}
        </div>
      )}
      {header}
      <div className="dialog-body">{children}</div>
    </div>
  );
}

export interface DialogItemProps {
  children: ReactNode;
  /** Where the command lives, e.g. "View". */
  path?: string;
  shortcut?: string;
  highlighted?: boolean;
  onSelect?: () => void;
}

/** A row in a command list such as Quick actions. */
export function DialogItem({ children, path, shortcut, highlighted, onSelect }: DialogItemProps) {
  return (
    <div className={cx('qa-item', highlighted && 'hl')} role="option" aria-selected={!!highlighted} onClick={onSelect}>
      <span>{children}</span>
      {path && <span className="path">{path}</span>}
      {shortcut && <span className="shortcut">{shortcut}</span>}
    </div>
  );
}
