'use client';
import { useState } from 'react';
import { IconEye, IconEyeOff, IconMinus } from '@open-figment/icons';
import { IconButton } from '@open-figment/icon-button';
import { NumberField } from '@open-figment/number-field';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface PaintRowProps {
  /** Hex colour without `#`, e.g. "0D99FF". */
  color: string;
  /** Opacity, 0–100. */
  opacity: number;
  visible?: boolean;
  onColorChange: (hex: string) => void;
  onOpacityChange: (opacity: number) => void;
  /** Show / hide the paint. Omit to hide the eye button. */
  onVisibleChange?: (visible: boolean) => void;
  /** Remove the paint. Omit to hide the minus button. */
  onRemove?: () => void;
  /** Open your colour picker from the swatch. */
  onSwatchClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** CSS background for the swatch; defaults to the colour. Use it for gradients and images. */
  swatch?: string;
  className?: string;
}

const normalise = (raw: string) => {
  let v = raw.replace('#', '').trim();
  if (/^[0-9a-f]{3}$/i.test(v)) v = v.split('').map((c) => c + c).join('');
  if (/^[0-9a-f]{1,2}$/i.test(v)) v = v.repeat(6 / v.length);
  return /^[0-9a-f]{6}$/i.test(v) ? v.toUpperCase() : null;
};

/** One fill, stroke or effect row: swatch, hex value, opacity, visibility and remove. */
export function PaintRow({ color, opacity, visible = true, onColorChange, onOpacityChange, onVisibleChange, onRemove, onSwatchClick, swatch, className }: PaintRowProps) {
  const [hex, setHex] = useState<string | null>(null);
  return (
    <div className={cx('paint-row', !visible && 'hidden-paint', className)}>
      <div className="paint-field">
        <button type="button" className="swatch" title="Edit paint" aria-label="Edit paint" onClick={onSwatchClick}>
          <i style={{ background: swatch ?? '#' + color }} />
        </button>
        <input
          className="hex"
          aria-label="Hex color"
          value={hex ?? color}
          onFocus={(e) => {
            setHex(color);
            const el = e.currentTarget;
            requestAnimationFrame(() => el.select());
          }}
          onChange={(e) => setHex(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          onBlur={() => {
            const v = normalise(hex ?? '');
            if (v && v !== color) onColorChange(v);
            setHex(null);
          }}
        />
        <div style={{ width: 52 }}>
          <NumberField value={opacity} onChange={onOpacityChange} min={0} max={100} decimals={0} suffix="%" inlineSuffix aria-label="Opacity" />
        </div>
      </div>
      {onVisibleChange && (
        <IconButton label={visible ? 'Hide' : 'Show'} onClick={() => onVisibleChange(!visible)}>
          {visible ? <IconEye /> : <IconEyeOff />}
        </IconButton>
      )}
      {onRemove && (
        <IconButton label="Remove" onClick={onRemove}>
          <IconMinus />
        </IconButton>
      )}
    </div>
  );
}
