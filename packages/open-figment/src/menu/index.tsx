'use client';
import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { IconCheck, IconChevronRight } from '../icons/index.js';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ') || undefined;

export interface MenuItem {
  label?: ReactNode;
  shortcut?: string;
  /** Runs when the item is chosen; the menu then closes. */
  onSelect?: () => void;
  disabled?: boolean;
  /** Makes the item a checkbox item; `true` shows the check. */
  checked?: boolean;
  /** Renders a divider instead of an item. */
  separator?: boolean;
  /** Nested items, opened on hover or →. */
  submenu?: MenuItem[];
}

export interface MenuProps {
  items: MenuItem[];
  /**
   * Viewport position (fixed). Omit both to render the menu in place, e.g. inside your own
   * positioned container.
   */
  x?: number;
  y?: number;
  /** Called after an item is chosen, and on Escape. */
  onClose?: () => void;
  /** Focus the menu when it mounts so arrow keys work. Default true. */
  autoFocus?: boolean;
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
}

/** A dark floating list of commands, with checks, shortcuts, separators, submenus and full keyboard support. */
export function Menu(props: MenuProps) {
  return <MenuList {...props} level={0} />;
}

function MenuList({ items, x, y, onClose, autoFocus = true, className, style, level, onBack, ...aria }: MenuProps & { level: number; onBack?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const fixed = x !== undefined && y !== undefined;
  const [pos, setPos] = useState({ x: x ?? 0, y: y ?? 0 });
  const [open, setOpen] = useState<{ index: number; x: number; y: number } | null>(null);
  const [kb, setKb] = useState(-1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (fixed) {
      const r = el.getBoundingClientRect();
      let nx = x!;
      let ny = y!;
      if (nx + r.width > window.innerWidth - 8) nx = level ? x! - r.width - 220 : window.innerWidth - r.width - 8;
      if (ny + r.height > window.innerHeight - 8) ny = Math.max(8, window.innerHeight - r.height - 8);
      setPos({ x: Math.max(8, nx), y: ny });
    }
    if (autoFocus) el.focus({ preventScroll: true });
  }, [x, y, level, fixed, autoFocus]);
  const usable = (i: number) => !!items[i] && !items[i].separator && !items[i].disabled;
  const move = (dir: 1 | -1) => {
    for (let k = 1; k <= items.length; k++) {
      const i = ((((kb === -1 && dir === -1 ? 0 : kb) + dir * k) % items.length) + items.length) % items.length;
      if (usable(i)) return setKb(i);
    }
  };
  const openSub = (i: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const host = ref.current?.getBoundingClientRect();
    // In-place menus position their submenu relative to themselves.
    setOpen(fixed || !host ? { index: i, x: r.right + 8, y: r.top - 8 } : { index: i, x: r.right - host.left + 8, y: r.top - host.top - 8 });
  };
  const choose = (it: MenuItem, i: number, el?: HTMLElement | null) => {
    if (it.disabled) return;
    if (it.submenu) {
      if (el) openSub(i, el);
      return;
    }
    onClose?.();
    it.onSelect?.();
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (open) return;
    if (e.key === 'ArrowDown') move(1);
    else if (e.key === 'ArrowUp') move(-1);
    else if ((e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') && usable(kb)) {
      if (e.key === 'ArrowRight' && !items[kb].submenu) return;
      choose(items[kb], kb, ref.current?.querySelector<HTMLElement>(`[data-index="${kb}"]`));
    } else if (e.key === 'Escape') (onBack ?? onClose)?.();
    else if (e.key === 'ArrowLeft' && onBack) onBack();
    else return;
    e.preventDefault();
    e.stopPropagation();
  };
  const sub = open && items[open.index]?.submenu;
  return (
    <>
      <div
        className={cx('menu', className)}
        role="menu"
        aria-label={aria['aria-label']}
        tabIndex={-1}
        ref={ref}
        style={fixed ? { left: pos.x, top: pos.y, ...style } : { position: 'relative', left: 'auto', top: 'auto', width: 'max-content', ...style }}
        onKeyDown={onKeyDown}
        onContextMenu={(e) => e.preventDefault()}
      >
        {items.map((it, i) =>
          it.separator ? (
            <div key={i} className="menu-sep" role="separator" />
          ) : (
            <div
              key={i}
              data-index={i}
              role={it.checked !== undefined ? 'menuitemcheckbox' : 'menuitem'}
              aria-checked={it.checked !== undefined ? !!it.checked : undefined}
              aria-disabled={it.disabled || undefined}
              aria-haspopup={it.submenu ? 'menu' : undefined}
              aria-expanded={it.submenu ? open?.index === i : undefined}
              className={cx('menu-item', it.disabled && 'disabled', (open?.index === i || kb === i) && 'hl')}
              onPointerEnter={(e) => {
                setKb(-1);
                if (it.submenu && !it.disabled) openSub(i, e.currentTarget);
                else setOpen(null);
              }}
              onClick={() => !it.submenu && choose(it, i)}
            >
              <span className="check">{it.checked ? <IconCheck /> : null}</span>
              <span className="label">{it.label}</span>
              {it.shortcut && <span className="shortcut">{it.shortcut}</span>}
              {it.submenu && <IconChevronRight />}
            </div>
          ),
        )}
      </div>
      {sub && open && (
        <div style={fixed ? undefined : { position: 'absolute', left: open.x, top: open.y }}>
          <MenuList
            items={sub}
            x={fixed ? open.x : undefined}
            y={fixed ? open.y : undefined}
            onClose={onClose}
            level={level + 1}
            onBack={() => {
              setOpen(null);
              ref.current?.focus({ preventScroll: true });
            }}
          />
        </div>
      )}
    </>
  );
}
