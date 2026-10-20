'use client';
import type { DragEvent, MouseEvent, ReactNode } from 'react';
import { IconChevronRight, IconEye, IconEyeOff, IconLock, IconUnlock } from '@open-figment/icons';
import { IconButton } from '@open-figment/icon-button';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface LayerRowProps {
  name: string;
  /** The layer type icon, e.g. `<IconFrame />`. */
  icon: ReactNode;
  /** Nesting depth; each level indents 16px. */
  depth?: number;
  /** `true`/`false` shows the expand caret; omit for layers without children. */
  expanded?: boolean;
  onToggle?: () => void;
  selected?: boolean;
  /** An ancestor is selected. */
  selectedChild?: boolean;
  /** Components and instances are shown in purple. */
  kind?: 'default' | 'component' | 'instance';
  locked?: boolean;
  hidden?: boolean;
  onLockedChange?: (locked: boolean) => void;
  onHiddenChange?: (hidden: boolean) => void;
  /** Drag-and-drop indicator. */
  drop?: 'before' | 'inside' | 'after' | null;
  onSelect?: (event: MouseEvent<HTMLDivElement>) => void;
  onDoubleClick?: (event: MouseEvent<HTMLDivElement>) => void;
  draggable?: boolean;
  onDragStart?: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: DragEvent<HTMLDivElement>) => void;
  onDrop?: (event: DragEvent<HTMLDivElement>) => void;
  className?: string;
}

/** A row in the layers panel: caret, type icon, name, and lock / visibility actions. */
export function LayerRow(p: LayerRowProps) {
  const depth = p.depth ?? 0;
  const indent = 8 + depth * 16;
  return (
    <div
      className={cx(
        'layer-row',
        p.selected && 'selected',
        p.selectedChild && 'selected-child',
        p.kind && p.kind !== 'default' && p.kind,
        depth === 0 && 'top',
        p.hidden && 'hidden-layer',
        p.drop && 'drop-' + p.drop,
        p.className,
      )}
      role="treeitem"
      aria-level={depth + 1}
      aria-selected={!!p.selected}
      aria-expanded={p.expanded}
      draggable={p.draggable ?? true}
      style={{ paddingLeft: indent, ['--indent' as string]: indent + 'px' }}
      onClick={p.onSelect}
      onDoubleClick={p.onDoubleClick}
      onDragStart={p.onDragStart}
      onDragOver={p.onDragOver}
      onDrop={p.onDrop}
    >
      <span
        className={cx('caret', p.expanded && 'open')}
        onClick={(e) => {
          e.stopPropagation();
          p.onToggle?.();
        }}
      >
        {p.expanded !== undefined ? <IconChevronRight /> : null}
      </span>
      <span className="layer-icon">{p.icon}</span>
      <span className="layer-name">{p.name}</span>
      <span className={cx('layer-actions', (p.locked || p.hidden) && 'pinned')}>
        {p.onLockedChange && (
          <IconButton size="sm" label={p.locked ? 'Unlock' : 'Lock'} onClick={(e) => (e.stopPropagation(), p.onLockedChange!(!p.locked))}>
            {p.locked ? <IconLock /> : <IconUnlock />}
          </IconButton>
        )}
        {p.onHiddenChange && (
          <IconButton size="sm" label={p.hidden ? 'Show' : 'Hide'} onClick={(e) => (e.stopPropagation(), p.onHiddenChange!(!p.hidden))}>
            {p.hidden ? <IconEyeOff /> : <IconEye />}
          </IconButton>
        )}
      </span>
    </div>
  );
}
