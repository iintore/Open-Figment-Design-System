'use client';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface PageRowProps {
  name: string;
  /** The page shown on the canvas. */
  active?: boolean;
  onSelect?: () => void;
  className?: string;
}

/** A page in the Pages list. */
export function PageRow({ name, active, onSelect, className }: PageRowProps) {
  return (
    <div
      className={cx('page-row', active && 'active', className)}
      role="button"
      tabIndex={0}
      aria-current={active ? 'page' : undefined}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect?.())}
    >
      <span>{name}</span>
    </div>
  );
}
