'use client';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `primary` for the one main action of a surface, `secondary` for other actions, `ghost` for low emphasis. */
  variant?: ButtonVariant;
  /** Destructive action. Combine with `variant="ghost"`. */
  danger?: boolean;
  /** `large` is 32px high instead of 24px. */
  size?: 'default' | 'large';
  /** An icon shown before the label, e.g. `<IconPlus />` from `@open-figment/icons`. */
  icon?: ReactNode;
  /** Stretch to the container width with a centred label. */
  fullWidth?: boolean;
}

/** A text button that triggers a command: share, present, export, create, restore, delete. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', danger, size = 'default', icon, fullWidth, className, style, type = 'button', children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx('btn', variant, danger && 'danger', size === 'large' && 'large', className)}
      style={fullWidth ? { width: '100%', justifyContent: 'center', ...style } : style}
      {...rest}
    >
      {icon}
      {icon && children ? ' ' : null}
      {children}
    </button>
  );
});
