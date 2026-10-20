'use client';
import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

const fmt = (n: number, d: number) => String(Math.round(n * Math.pow(10, d)) / Math.pow(10, d));

/** Evaluates simple math typed into the field ("100/2", "24+8", "*2"). No `eval`, so it runs under a strict CSP. */
export function evalExpr(input: string, current: number): number | null {
  const t = input.trim().replace(/,/g, '.').replace(/%$/, '');
  if (!t) return null;
  if (/^[-+*/]/.test(t) && !/^-?\d/.test(t)) return evalExpr(`${current}${t}`, current);
  if (!/^[\d\s.+\-*/()]+$/.test(t)) return null;
  const tokens = t.match(/\d*\.?\d+\.?|\*\*|[-+*/()]|\S/g) ?? [];
  let i = 0;
  const num = (): number => {
    const tok = tokens[i++];
    if (tok === '(') {
      const v = sum();
      if (tokens[i++] !== ')') throw new Error('expected )');
      return v;
    }
    if (tok === '-') return -num();
    if (tok === '+') return num();
    if (tok === undefined || tok === '.' || !/^\d*\.?\d*$/.test(tok)) throw new Error('expected number');
    return parseFloat(tok);
  };
  const power = (): number => {
    const base = num();
    if (tokens[i] === '**') {
      i++;
      return base ** power();
    }
    return base;
  };
  const product = (): number => {
    let v = power();
    while (tokens[i] === '*' || tokens[i] === '/') v = tokens[i++] === '*' ? v * power() : v / power();
    return v;
  };
  const sum = (): number => {
    let v = product();
    while (tokens[i] === '+' || tokens[i] === '-') v = tokens[i++] === '+' ? v + product() : v - product();
    return v;
  };
  try {
    const v = sum();
    return i === tokens.length && Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}

export interface NumberFieldProps {
  /** The value, or `'mixed'` when a multi-selection disagrees (shows a *Mixed* placeholder). */
  value: number | 'mixed';
  /** Called with the committed value: on Enter, on blur, on arrow keys and while scrubbing. */
  onChange: (value: number) => void;
  /** A short label ("X", "W") or an icon. Drag the label left or right to scrub the value. */
  label?: ReactNode;
  /** A unit shown after the value, e.g. "%". */
  suffix?: string;
  /** Show the suffix tight against the value (percent fields). */
  inlineSuffix?: boolean;
  min?: number;
  max?: number;
  /** Step for arrow keys and scrubbing; Shift multiplies it by 10. Default 1. */
  step?: number;
  /** Decimal places shown. Default 2. */
  decimals?: number;
  /** Display multiplier, e.g. 100 to edit a 0–1 opacity as a percentage. */
  scale?: number;
  title?: string;
  'aria-label'?: string;
  className?: string;
  /** Scrubbing started / ended (useful to group the changes into one undo step). */
  onScrubStart?: () => void;
  onScrubEnd?: () => void;
}

/** A compact number input with a label you can drag to scrub, arrow-key steps and inline arithmetic. */
export function NumberField(props: NumberFieldProps) {
  const scale = props.scale ?? 1;
  const decimals = props.decimals ?? 2;
  const display = props.value === 'mixed' ? '' : fmt(props.value * scale, decimals);
  const [text, setText] = useState(display);
  const [focused, setFocused] = useState(false);
  const latest = useRef(props);
  latest.current = props;
  const clamp = (v: number) => Math.max(props.min ?? -Infinity, Math.min(props.max ?? Infinity, v));
  const commit = (raw: string) => {
    const cur = props.value === 'mixed' ? 0 : props.value * scale;
    const v = evalExpr(raw, cur);
    if (v === null) return setText(display);
    props.onChange(clamp(v / scale));
  };
  const scrub = (e: ReactPointerEvent<HTMLElement>) => {
    if (props.value === 'mixed') return;
    e.preventDefault();
    const startX = e.clientX;
    const start = props.value;
    const id = e.pointerId;
    e.currentTarget.setPointerCapture(id);
    props.onScrubStart?.();
    const move = (ev: PointerEvent) => {
      const p = latest.current;
      const step = (p.step ?? 1) * (ev.shiftKey ? 10 : 1);
      p.onChange(Math.max(p.min ?? -Infinity, Math.min(p.max ?? Infinity, start + (Math.round((ev.clientX - startX) / 2) * step) / scale)));
    };
    const up = (ev: PointerEvent) => {
      if (ev.pointerId !== id) return;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      latest.current.onScrubEnd?.();
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };
  return (
    <label className={cx('field', props.label === undefined && 'no-label', props.inlineSuffix && 'pct-inline', props.className)} title={props.title}>
      {props.label !== undefined && (
        <span className="field-label" onPointerDown={scrub}>
          {props.label}
        </span>
      )}
      <input
        inputMode="decimal"
        aria-label={props['aria-label'] ?? (typeof props.label === 'string' ? props.label : props.title)}
        value={focused ? text : display}
        placeholder={props.value === 'mixed' ? 'Mixed' : ''}
        onFocus={(e) => {
          setFocused(true);
          setText(display);
          const el = e.currentTarget;
          requestAnimationFrame(() => el.select());
        }}
        onBlur={(e) => {
          setFocused(false);
          if (e.currentTarget.value !== display) commit(e.currentTarget.value);
        }}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            commit(text);
            e.currentTarget.blur();
          } else if (e.key === 'Escape') {
            setText(display);
            e.currentTarget.blur();
          } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            const cur = props.value === 'mixed' ? 0 : props.value;
            const step = ((props.step ?? 1) * (e.shiftKey ? 10 : 1)) / scale;
            const v = clamp(cur + (e.key === 'ArrowUp' ? step : -step));
            props.onChange(v);
            setText(fmt(v * scale, decimals));
          }
        }}
      />
      {props.suffix && <span className="suffix">{props.suffix}</span>}
    </label>
  );
}
