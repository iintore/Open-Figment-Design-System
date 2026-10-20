'use client';
import type { CSSProperties, ReactNode } from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface ToastProps {
  children: ReactNode;
  /** Render in place instead of fixed at the bottom of the viewport. */
  inline?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** A short confirmation or error message at the bottom of the window. Announced to screen readers. */
export function Toast({ children, inline, className, style }: ToastProps) {
  return (
    <div className={cx('toast', className)} role="status" aria-live="polite" style={inline ? { position: 'relative', left: 'auto', bottom: 'auto', transform: 'none', width: 'max-content', ...style } : style}>
      {children}
    </div>
  );
}
