'use client';
import type { MouseEvent, ReactNode } from 'react';
import { IconDots, IconFile, IconPen } from '@open-figment/icons';
import { IconButton } from '@open-figment/icon-button';
import { StarButton } from '@open-figment/star-button';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface FileCardProps {
  name: string;
  /** e.g. "Edited just now". */
  edited: string;
  /** Thumbnail image URL. Without one a file icon is shown. */
  thumbnail?: string;
  /** The coloured chip before the name. Defaults to the design file chip. */
  chip?: ReactNode;
  starred?: boolean;
  /** Show the star toggle. */
  onStarredChange?: (starred: boolean) => void;
  onOpen?: () => void;
  /** The ••• button; receives the click so you can open a menu at it. */
  onMore?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

/** A file in the home screen grid: thumbnail, star toggle, file chip, name, last edited time and menu. */
export function FileCard({ name, edited, thumbnail, chip, starred = false, onStarredChange, onOpen, onMore, className }: FileCardProps) {
  return (
    <div className={cx('file-card', className)} role="button" tabIndex={0} aria-label={name} onClick={onOpen} onKeyDown={(e) => e.key === 'Enter' && onOpen?.()}>
      <div className="file-thumb">
        {thumbnail ? <img src={thumbnail} alt="" /> : <IconFile />}
        {onStarredChange && <StarButton starred={starred} onChange={onStarredChange} />}
      </div>
      <div className="file-meta">
        <span className="file-chip">{chip ?? <IconPen />}</span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <b>{name}</b>
          <span>{edited}</span>
        </div>
        {onMore && (
          <IconButton label="More actions" onClick={(e) => (e.stopPropagation(), onMore(e))}>
            <IconDots />
          </IconButton>
        )}
      </div>
    </div>
  );
}
