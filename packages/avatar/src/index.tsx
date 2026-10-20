import type { ReactNode } from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface AvatarProps {
  /** The person's name; the first letter is shown and the full name is the tooltip. */
  name: string;
  /** Background colour. */
  color: string;
  size?: 'default' | 'sm';
  className?: string;
}

/** A collaborator's initial on their colour. */
export function Avatar({ name, color, size = 'default', className }: AvatarProps) {
  return (
    <div className={cx('avatar', size === 'sm' && 'sm', className)} style={{ background: color }} title={name} role="img" aria-label={name}>
      {name.trim().charAt(0).toUpperCase()}
    </div>
  );
}

/** Overlapping avatars of the people in a file. */
export function AvatarStack({ children }: { children: ReactNode }) {
  return <div style={{ display: 'flex' }}>{children}</div>;
}
