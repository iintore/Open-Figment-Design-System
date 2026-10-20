'use client';
import { useState } from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface TextFieldProps {
  value: string;
  /** Called with the new text when the edit is committed (Enter or blur), not on every keystroke. */
  onChange: (value: string) => void;
  placeholder?: string;
  'aria-label'?: string;
  className?: string;
}

/** A single-line text input in the panel style, for names and descriptions. */
export function TextField({ value, onChange, placeholder, className, ...aria }: TextFieldProps) {
  const [text, setText] = useState(value);
  // Follow the value when it changes from outside.
  const [shown, setShown] = useState(value);
  if (shown !== value) {
    setShown(value);
    setText(value);
  }
  return (
    <label className={cx('field', 'no-label', className)}>
      <input
        value={text}
        placeholder={placeholder}
        aria-label={aria['aria-label'] ?? placeholder}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => text !== value && onChange(text)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
          else if (e.key === 'Escape') {
            setText(value);
            e.currentTarget.blur();
          }
        }}
      />
    </label>
  );
}
