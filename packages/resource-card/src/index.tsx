'use client';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface ResourceCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  title: string;
  description?: string;
  /** What's drawn in the thumbnail. */
  icon: ReactNode;
  /** Thumbnail style: white (`blank`), yellow (`sample`) or green (`import`). */
  tone?: 'blank' | 'sample' | 'import';
}

/** A card on the home screen for starting a new file. */
export const ResourceCard = forwardRef<HTMLButtonElement, ResourceCardProps>(function ResourceCard({ title, description, icon, tone = 'blank', className, type = 'button', ...rest }, ref) {
  return (
    <button ref={ref} type={type} className={cx('resource', className)} {...rest}>
      <div className={cx('resource-thumb', tone)}>{icon}</div>
      <b>{title}</b>
      {description && <span>{description}</span>}
    </button>
  );
});

/** The *Get started* panel that groups ResourceCards. */
export function ResourceGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="resources">
      <div className="resources-head">
        <b>{title}</b>
      </div>
      <div className="resources-row">{children}</div>
    </div>
  );
}
