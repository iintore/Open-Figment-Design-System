import type { ReactNode } from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface CodeBlockProps {
  children: ReactNode;
  className?: string;
}

/** Generated code shown in the inspect and properties panels, e.g. CSS for a frame. */
export function CodeBlock({ children, className }: CodeBlockProps) {
  return <div className={cx('code-block', className)}>{children}</div>;
}
