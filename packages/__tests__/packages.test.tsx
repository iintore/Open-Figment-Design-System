import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { renderToStaticMarkup as html } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import * as All from '@open-figment/react';
import { components } from '../../scripts/packages/manifest.mjs';
import {
  Avatar, Badge, Button, Checkbox, CodeBlock, Dialog, DialogItem, Drawer, FileCard, FileRow, IconButton, LayerRow, Menu, ModeSwitch,
  NumberField, PageRow, PaintRow, Popover, ProductPill, PropertySection, RailItem, ResourceCard, SearchField, SegmentedControl, Select,
  StarButton, Tab, TextField, Toast, ToolButton, Tooltip, TypeHeader, IconPlus, IconFrame, Icon, icons, tokens, evalExpr,
} from '@open-figment/react';

const PKGS = path.resolve(import.meta.dirname, '..');
const noop = () => {};
// Class lists of every element in document order (icon internals skipped): the structure the stylesheet targets.
const classes = (markup: string) => {
  const out: string[] = [];
  let inSvg = 0;
  for (const m of markup.matchAll(/<(\/?)(\w+)([^>]*?)(\/?)>/g)) {
    const [, close, tag, attrs, selfClose] = m;
    if (close) {
      if (tag === 'svg') inSvg--;
      continue;
    }
    if (inSvg) continue;
    const cls = attrs.match(/\sclass="([^"]*)"/)?.[1];
    out.push(tag + (cls ? '.' + cls.split(' ').sort().join('.') : ''));
    if (tag === 'svg' && !selfClose) inSvg++;
  }
  return out;
};

describe('exports', () => {
  it('@open-figment/react exports every component, the icons and the tokens', () => {
    for (const c of components) for (const name of c.exports) expect(All, `${c.dir} → ${name}`).toHaveProperty(name);
    expect(Object.keys(icons)).toHaveLength(91);
    expect(tokens.color).toBeTruthy();
  });
  it('every package resolves through both import and require', () => {
    const req = createRequire(import.meta.url);
    for (const d of ['tokens', 'icons', 'react', ...components.map((c) => c.dir)]) {
      const mod = req(`@open-figment/${d}`);
      expect(Object.keys(mod).length, d).toBeGreaterThan(0);
    }
  });
});

describe('markup matches the design system', () => {
  const cases: [string, string, string][] = [
    ['Button', html(<Button variant="primary">Share</Button>), '<button type="button" class="btn primary">Share</button>'],
    ['Button ghost danger', html(<Button variant="ghost" danger>Delete</Button>), '<button type="button" class="btn ghost danger">Delete</button>'],
    ['Badge muted', html(<Badge muted>No AI</Badge>), '<span class="badge muted">No AI</span>'],
    ['Toast', html(<Toast>Copied as PNG</Toast>), '<div class="toast" role="status" aria-live="polite">Copied as PNG</div>'],
    ['CodeBlock', html(<CodeBlock>width: 393px;</CodeBlock>), '<div class="code-block">width: 393px;</div>'],
  ];
  it.each(cases)('%s', (_, got, want) => expect(got).toBe(want));

  const shapes: [string, string, string[]][] = [
    ['IconButton', html(<IconButton label="Add" size="sm"><IconPlus /></IconButton>), ['button.icon-btn.sm', 'svg']],
    ['ToolButton', html(<ToolButton icon={<IconFrame />} label="Frame" active caret />), ['div.active.tool', 'button.tool-main', 'svg', 'button.tool-caret', 'svg']],
    ['ModeSwitch', html(<ModeSwitch value="b" onChange={noop} options={[{ value: 'a', label: 'A', icon: <IconPlus /> }, { value: 'b', label: 'B', icon: <IconPlus />, tone: 'dev' }]} />), ['div.mode-switch', 'button', 'svg', 'button.dev.on', 'svg']],
    ['ProductPill', html(<ProductPill icon={<IconPlus />} color="#0d99ff">Design</ProductPill>), ['button.product-pill', 'span.product-icon', 'svg']],
    ['StarButton', html(<StarButton starred onChange={noop} />), ['button.on.star-btn', 'svg']],
    ['NumberField', html(<NumberField label="X" value={493} onChange={noop} />), ['label.field', 'span.field-label', 'input']],
    ['NumberField percent', html(<NumberField value={100} onChange={noop} suffix="%" inlineSuffix />), ['label.field.no-label.pct-inline', 'input', 'span.suffix']],
    ['TextField', html(<TextField value="" onChange={noop} placeholder="Add a description" />), ['label.field.no-label', 'input']],
    ['Select', html(<Select value="hug" onChange={noop} options={[{ value: 'hug', label: 'Hug contents' }]} />), ['button.select-btn', 'span', 'svg']],
    ['SegmentedControl', html(<SegmentedControl value="a" onChange={noop} options={[{ value: 'a', icon: <IconPlus />, title: 'A' }, { value: 'b', icon: <IconPlus />, title: 'B' }]} />), ['div.seg', 'button.on', 'svg', 'button', 'svg']],
    ['Checkbox', html(<Checkbox checked onChange={noop}>Clip content</Checkbox>), ['label.checkbox-row', 'input']],
    ['SearchField', html(<SearchField value="" onChange={noop} />), ['div.search', 'svg', 'input']],
    ['PaintRow', html(<PaintRow color="FFFFFF" opacity={100} onColorChange={noop} onOpacityChange={noop} onVisibleChange={noop} onRemove={noop} />), ['div.paint-row', 'div.paint-field', 'button.swatch', 'i', 'input.hex', 'div', 'label.field.no-label.pct-inline', 'input', 'span.suffix', 'button.icon-btn', 'svg', 'button.icon-btn', 'svg']],
    ['Tab', html(<Tab title="Welcome" active onClose={noop} />), ['div.active.tab', 'svg', 'span.tab-title', 'button.tab-close', 'svg']],
    ['RailItem', html(<RailItem icon={<IconPlus />} label="Assets" />), ['button.rail-item', 'span.rail-icon', 'svg', 'span.rail-label']],
    ['PageRow', html(<PageRow name="Design" active />), ['div.active.page-row', 'span']],
    ['LayerRow', html(<LayerRow name="Home" icon={<IconFrame />} expanded={false} selected onLockedChange={noop} onHiddenChange={noop} />), ['div.layer-row.selected.top', 'span.caret', 'svg', 'span.layer-icon', 'svg', 'span.layer-name', 'span.layer-actions', 'button.icon-btn.sm', 'svg', 'button.icon-btn.sm', 'svg']],
    ['Menu', html(<Menu items={[{ label: 'Copy', shortcut: '⌘C' }, { separator: true }, { label: 'Fill', checked: true }, { label: 'More', submenu: [] }]} />), ['div.menu', 'div.menu-item', 'span.check', 'span.label', 'span.shortcut', 'div.menu-sep', 'div.menu-item', 'span.check', 'svg', 'span.label', 'div.menu-item', 'span.check', 'span.label', 'svg']],
    ['Tooltip', html(<Tooltip>Rectangle R</Tooltip>), ['div.tooltip']],
    ['Popover', html(<Popover title="Drop shadow" onClose={noop}>x</Popover>), ['div.popover', 'div.popover-head', 'span.title', 'button.icon-btn', 'svg']],
    ['Dialog', html(<Dialog title="Shortcuts" onClose={noop}><DialogItem path="View" shortcut="⌘+" highlighted>Zoom in</DialogItem></Dialog>), ['div.dialog', 'div.dialog-head', 'span.title', 'button.icon-btn', 'svg', 'div.dialog-body', 'div.hl.qa-item', 'span', 'span.path', 'span.shortcut']],
    ['Drawer', html(<Drawer title="Version history" onClose={noop} />), ['aside.drawer', 'div.dialog-head', 'span.title', 'button.icon-btn', 'svg']],
    ['Avatar', html(<Avatar name="ada" color="#0d99ff" size="sm" />), ['div.avatar.sm']],
    ['PropertySection', html(<PropertySection title="Effects" muted collapsed />), ['section.collapsed.prop-section', 'div.section-header', 'span.muted.title']],
    ['TypeHeader', html(<TypeHeader label="Frame" />), ['div.type-header', 'button.type-btn', 'svg']],
    ['FileCard', html(<FileCard name="Welcome" edited="Edited just now" onStarredChange={noop} onMore={noop} />), ['div.file-card', 'div.file-thumb', 'svg', 'button.star-btn', 'svg', 'div.file-meta', 'span.file-chip', 'svg', 'div', 'b', 'span', 'button.icon-btn', 'svg']],
    ['FileRow', html(<FileRow name="Welcome" edited="Edited just now" onMore={noop} />), ['div.file-row', 'span.file-chip', 'svg', 'span.file-row-name', 'b', 'span.file-row-time', 'button.icon-btn', 'svg']],
    ['ResourceCard', html(<ResourceCard title="Blank design file" description="Start from scratch" icon={<IconPlus />} />), ['button.resource', 'div.blank.resource-thumb', 'svg', 'b', 'span']],
  ];
  it.each(shapes)('%s', (_, got, want) => expect(classes(got)).toEqual(want));

  it('Avatar shows the initial', () => expect(html(<Avatar name="ada" color="#000" />)).toContain('>A</div>'));
});

describe('icons', () => {
  it('render decoratively by default and accessibly with a title', () => {
    expect(html(<IconPlus />)).toMatch(/^<svg width="24" height="24" viewBox="0 0 24 24"[^>]*aria-hidden="true"/);
    expect(html(<IconPlus title="Add" size={16} />)).toMatch(/width="16".*role="img".*<title>Add<\/title>/);
    expect(html(<Icon name="chevronDown" />)).toContain('viewBox="0 0 8 8"');
  });
  it('ship as SVG files', () => expect(fs.readdirSync(path.join(PKGS, 'icons/svg'))).toHaveLength(91));
});

describe('number field arithmetic', () => {
  it.each([
    ['100/2', 0, 50],
    ['24+8', 0, 32],
    ['*2', 21, 42],
    ['(1+2)*3', 0, 9],
    ['abc', 5, null],
  ])('%s', (input, cur, want) => expect(evalExpr(input as string, cur as number)).toBe(want));
});

describe('styles', () => {
  it.each(components.map((c) => [c.dir, c.classes[0]]))('%s/styles.css styles .%s and ships no docs-only selectors', (dir, cls) => {
    const css = fs.readFileSync(path.join(PKGS, dir, 'styles.css'), 'utf8');
    expect(css).toMatch(new RegExp(`(^|\\n)\\.${cls}[\\s.:{,\\[]`));
    expect(css).not.toMatch(/\.is-(hover|pressed|focus|desktop)\b/);
    expect(css).not.toMatch(/(^|\n)(body|html|\*|button)\s*\{/);
  });
  it('tokens.css defines the colour, type and font tokens', () => {
    const css = fs.readFileSync(path.join(PKGS, 'tokens/tokens.css'), 'utf8');
    for (const v of ['--color-bg-brand', '--text-body-medium', '--radius']) expect(css).toContain(v);
    expect(css).toContain('[data-theme="dark"]');
    for (const m of css.matchAll(/url\('([^']+)'\)/g)) expect(fs.existsSync(path.join(PKGS, 'tokens', m[1])), m[1]).toBe(true);
  });
});
