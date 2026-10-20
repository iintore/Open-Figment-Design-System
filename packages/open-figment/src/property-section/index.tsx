import type { ReactNode } from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface PropertySectionProps {
  title: string;
  /** Buttons on the right of the header, e.g. an add button. */
  actions?: ReactNode;
  /** Grey title for a section with nothing set yet (Stroke, Effects). */
  muted?: boolean;
  /** Header only. */
  collapsed?: boolean;
  children?: ReactNode;
  className?: string;
}

/** A titled group of properties in the right panel: Position, Layout, Fill, Stroke, Effects. */
export function PropertySection({ title, actions, muted, collapsed, children, className }: PropertySectionProps) {
  return (
    <section className={cx('prop-section', collapsed && 'collapsed', className)} aria-label={title}>
      <div className="section-header">
        <span className={cx('title', muted && 'muted')}>{title}</span>
        {actions}
      </div>
      {!collapsed && children}
    </section>
  );
}

/** A small grey label above a row of controls ("Alignment", "Position"). */
export function Sublabel({ children }: { children: ReactNode }) {
  return <div className="sublabel">{children}</div>;
}

/** The two-column grid that lays out pairs of fields (X / Y, W / H). */
export function PropertyGrid({ children }: { children: ReactNode }) {
  return <div className="prop-grid">{children}</div>;
}
