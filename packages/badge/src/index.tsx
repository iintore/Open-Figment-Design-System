import type { ReactNode } from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface BadgeProps {
  children: ReactNode;
  /** Grey instead of brand blue. */
  muted?: boolean;
  className?: string;
}

/** A small label next to a title: the plan (*Free*) or a status (*No AI*). */
export function Badge({ children, muted, className }: BadgeProps) {
  return <span className={cx('badge', muted && 'muted', className)}>{children}</span>;
}
