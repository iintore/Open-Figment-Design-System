'use client';
import type { CSSProperties, ReactNode } from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface TooltipProps {
  /** The text: a tool name and shortcut, or why something is disabled. */
  children: ReactNode;
  /** Viewport position (fixed). Omit to render in place. */
  x?: number;
  y?: number;
  id?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * The dark tooltip bubble. Show it on hover after a short delay and point `aria-describedby`
 * of the trigger at its `id`.
 */
export function Tooltip({ children, x, y, id, className, style }: TooltipProps) {
  const fixed = x !== undefined && y !== undefined;
  return (
    <div id={id} role="tooltip" className={cx('tooltip', className)} style={fixed ? { left: x, top: y, ...style } : { position: 'relative', left: 'auto', top: 'auto', transform: 'none', width: 'max-content', ...style }}>
      {children}
    </div>
  );
}
