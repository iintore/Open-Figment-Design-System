'use client';
import type { ReactNode } from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface RailItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  /** Keyboard shortcut shown in the tooltip, e.g. "⌥2". */
  shortcut?: string;
  onClick?: () => void;
  className?: string;
}

/** A labelled icon in the navigation rail: File, Agents, Assets, Tools, Variables. */
export function RailItem({ icon, label, active, shortcut, onClick, className }: RailItemProps) {
  return (
    <button type="button" className={cx('rail-item', active && 'active', className)} title={shortcut ? `${label}  ${shortcut}` : label} aria-pressed={!!active} onClick={onClick}>
      <span className="rail-icon">{icon}</span>
      <span className="rail-label">{label}</span>
    </button>
  );
}

/** The vertical rail that holds RailItems. */
export function Rail({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <nav className={cx('rail', className)} aria-label="Panels">
      {children}
    </nav>
  );
}
