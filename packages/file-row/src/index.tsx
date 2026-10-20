'use client';
import type { MouseEvent, ReactNode } from 'react';
import { IconDots, IconPen } from '@open-figment/icons';
import { IconButton } from '@open-figment/icon-button';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface FileRowProps {
  name: string;
  /** e.g. "Edited just now". */
  edited: string;
  chip?: ReactNode;
  onOpen?: () => void;
  onMore?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

/** A file in the home screen's list view. */
export function FileRow({ name, edited, chip, onOpen, onMore, className }: FileRowProps) {
  return (
    <div className={cx('file-row', className)} role="button" tabIndex={0} aria-label={name} onClick={onOpen} onKeyDown={(e) => e.key === 'Enter' && onOpen?.()}>
      <span className="file-chip">{chip ?? <IconPen />}</span>
      <span className="file-row-name">
        <b>{name}</b>
      </span>
      <span className="file-row-time">{edited}</span>
      {onMore && (
        <IconButton label="More actions" onClick={(e) => (e.stopPropagation(), onMore(e))}>
          <IconDots />
        </IconButton>
      )}
    </div>
  );
}
