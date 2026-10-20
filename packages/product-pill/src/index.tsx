'use client';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface ProductPillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The icon inside the coloured chip. */
  icon: ReactNode;
  /** Chip colour, e.g. `#0d99ff` for Design. */
  color: string;
}

/** A 32px pill button on the home screen for starting work: Design, Import, More. */
export const ProductPill = forwardRef<HTMLButtonElement, ProductPillProps>(function ProductPill({ icon, color, className, type = 'button', children, ...rest }, ref) {
  return (
    <button ref={ref} type={type} className={cx('product-pill', className)} {...rest}>
      <span className="product-icon" style={{ background: color }}>
        {icon}
      </span>
      {children}
    </button>
  );
});
