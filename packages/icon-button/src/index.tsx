'use client';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  /** What the button does. Used as the tooltip and the accessible name. */
  label: string;
  /** Pressed / on state of a toggle (e.g. *Constrain proportions*). */
  active?: boolean;
  /** `sm` is 20px, used for layer row actions. */
  size?: 'default' | 'sm';
}

/** A 24px square button holding one icon, for every icon-only action in panels. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, active, size = 'default', className, type = 'button', children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      title={label}
      aria-label={label}
      aria-pressed={active === undefined ? undefined : active}
      className={cx('icon-btn', size === 'sm' && 'sm', active && 'active', className)}
      {...rest}
    >
      {children}
    </button>
  );
});
