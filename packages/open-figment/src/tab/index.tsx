'use client';
import type { ReactNode } from 'react';
import { IconClose, IconFile, IconHome, IconPlus } from '../icons/index.js';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface TabProps {
  title: string;
  active?: boolean;
  /** The tab's icon. Defaults to a file icon. */
  icon?: ReactNode;
  onSelect?: () => void;
  /** Show the close button. */
  onClose?: () => void;
  className?: string;
}

/** A file tab in the desktop tab bar: icon, name and a close button. */
export function Tab({ title, active, icon, onSelect, onClose, className }: TabProps) {
  return (
    <div
      className={cx('tab', active && 'active', className)}
      role="tab"
      aria-selected={!!active}
      tabIndex={active ? 0 : -1}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect?.())}
      onAuxClick={(e) => e.button === 1 && onClose?.()}
    >
      {icon ?? <IconFile />}
      <span className="tab-title">{title}</span>
      {onClose && (
        <button
          type="button"
          className="tab-close"
          title="Close tab"
          aria-label={`Close ${title}`}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <IconClose />
        </button>
      )}
    </div>
  );
}

/** The bar that holds the home tab, file tabs and the new-tab button. */
export function TabBar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx('tabbar', className)} role="tablist">
      {children}
    </div>
  );
}

/** The home tab at the start of the tab bar. */
export function TabHome({ active, onClick }: { active?: boolean; onClick?: () => void }) {
  return (
    <button type="button" className={cx('tab', 'tab-home', active && 'active')} title="Home" aria-label="Home" onClick={onClick}>
      <IconHome />
    </button>
  );
}

/** The + button after the tabs (or any trailing tab-bar action, via `icon` and `label`). */
export function TabNew({ onClick, label = 'New design file', icon }: { onClick?: () => void; label?: string; icon?: ReactNode }) {
  return (
    <button type="button" className="tab-new" title={label} aria-label={label} onClick={onClick}>
      {icon ?? <IconPlus />}
    </button>
  );
}
