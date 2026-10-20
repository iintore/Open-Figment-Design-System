'use client';
import type { MouseEvent, ReactNode } from 'react';
import { IconChevronDown } from '@open-figment/icons';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface ToolButtonProps {
  /** The tool's icon. */
  icon: ReactNode;
  /** The tool's name, e.g. "Rectangle". Accessible name of the button. */
  label: string;
  /** Optional tooltip text, e.g. "Rectangle  R". */
  title?: string;
  /** The tool is the current tool. */
  active?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Show the 14px caret that opens the tool group's menu. */
  caret?: boolean;
  /** Accessible name of the caret. Defaults to "More <label> tools". */
  caretLabel?: string;
  onCaretClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

/** A canvas tool in the floating toolbar: a 32px tool button, optionally with a caret menu. */
export function ToolButton({ icon, label, title, active, onClick, caret, caretLabel, onCaretClick, className }: ToolButtonProps) {
  return (
    <div className={cx('tool', active && 'active', className)}>
      <button type="button" className="tool-main" aria-label={label} aria-pressed={!!active} title={title} onClick={onClick}>
        {icon}
      </button>
      {caret && (
        <button type="button" className="tool-caret" aria-label={caretLabel ?? `More ${label.toLowerCase()} tools`} aria-haspopup="menu" onClick={onCaretClick}>
          <IconChevronDown />
        </button>
      )}
    </div>
  );
}
