// Captures the markup the running app renders for each component and state, the icon set,
// and reference screenshots, for the docs site. Run with the app's dev server up:
//
//   npm run dev            # in the Open Figment app checkout (http://localhost:5173)
//   npm run capture        # here; then: npm run content
//
// Writes source/markup/*.json, source/icons.json and public/shots/*.png.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const DOCS = path.resolve(import.meta.dirname, '..');
const BASE = process.argv[2] ?? 'http://localhost:5173/';
const out = { html: path.join(DOCS, 'source', 'markup'), shots: path.join(DOCS, 'public', 'shots') };
fs.mkdirSync(out.html, { recursive: true });
fs.mkdirSync(out.shots, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
// Seeded randomness: the collaborator name and colour the app picks stay the same between runs,
// so re-capturing only changes what actually changed in the UI.
await ctx.addInitScript(() => {
  let seed = 42;
  Math.random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
});
const page = await ctx.newPage();
const log = [];
page.on('pageerror', (e) => log.push('pageerror: ' + e.message));

async function grab(name, selector, { nth = 0, all = false, strip = true } = {}) {
  const res = await page.evaluate(
    ({ selector, nth, all, strip }) => {
      const els = [...document.querySelectorAll(selector)];
      const pick = all ? els : els.slice(nth, nth + 1);
      if (!pick.length) return null;
      const clean = (el) => {
        const c = el.cloneNode(true);
        if (strip) for (const img of c.querySelectorAll('img')) if (img.src.startsWith('data:') && img.src.length > 2000) img.setAttribute('src', '');
        for (const cv of c.querySelectorAll('canvas')) cv.remove();
        return c.outerHTML;
      };
      const r = pick[0].getBoundingClientRect();
      return { html: pick.map(clean).join('\n'), w: Math.round(r.width), h: Math.round(r.height), count: els.length };
    },
    { selector, nth, all, strip },
  );
  if (!res) {
    log.push(`MISSING ${name}: ${selector}`);
    return;
  }
  fs.writeFileSync(path.join(out.html, name + '.json'), JSON.stringify(res));
  log.push(`ok ${name} ${res.w}x${res.h} (${res.count})`);
}
const store = (fn, arg) => page.evaluate(async ({ fn, arg }) => {
  const S = await import('/src/store/store.ts');
  const UI = await import('/src/store/ui.ts');
  const A = await import('/src/editor/actions.ts');
  // eslint-disable-next-line no-new-func
  return new Function('S', 'UI', 'A', 'arg', `return (async () => { ${fn} })()`)(S, UI, A, arg);
}, { fn, arg });
const shot = async (name, selector) => {
  const el = selector ? page.locator(selector).first() : page;
  await el.screenshot({ path: path.join(out.shots, name + '.png') });
};
const settle = () => page.waitForTimeout(350);
const idOf = (name) => store(`const d=S.get().doc; return Object.values(d.nodes).find(n=>n.name===arg)?.id`, name);

// ---------- Home ----------
await page.goto(BASE);
await page.getByText('Welcome to Figment').first().waitFor();
await settle();
await shot('home-light');
await grab('home', '.home');
await grab('tabbar-home', '.tabbar');
await grab('file-card', '.file-card');
await grab('resources', '.resources');
await grab('resource', '.resource', { nth: 0 });
await grab('home-side', '.home-side');
await grab('home-top', '.home-top');
await grab('home-tabs', '.home-tabs');
await grab('search', '.search');
await grab('badge', '.badge');
await grab('avatar', '.avatar');
await grab('home-seg', '.home .seg');
await grab('product-pills', '.product-pill', { all: true });
await page.locator('.file-card').first().click({ button: 'right' });
await settle();
await grab('menu-file', '.menu');
await page.keyboard.press('Escape');
await page.mouse.click(5, 300);
// list layout
await page.locator('.home .seg button').nth(1).click();
await settle();
await grab('file-row', '.file-row');
await grab('file-list', '.file-list');
await page.locator('.home .seg button').nth(0).click();
await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
await settle();
await shot('home-dark');
await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; });

// ---------- Editor ----------
await page.locator('.file-card').first().click();
await page.locator('.layers').waitFor();
await settle();
await shot('editor-light');
await grab('tabbar', '.tabbar');
await grab('rail', '.rail');
await grab('left-dock-file', '.left-dock');
await grab('file-header', '.file-header');
await grab('pages', '.pages');
await grab('page-rows', '.page-row', { all: true });
await grab('layers', '.layers');
await grab('toolbar', '.toolbar');
await grab('tool', '.toolbar .tool', { nth: 0 });
await grab('tool-shape', '.toolbar .tool', { nth: 2 });
await grab('mode-switch', '.mode-switch');
await grab('right-panel-page', '.panel.right');
await grab('right-header', '.right-header');
await grab('section-header', '.section-header');
// tooltip
await page.locator('.toolbar .tool-main').nth(2).hover();
await settle();
await grab('tooltip', '.tooltip');
await page.mouse.move(700, 450);

// Select a frame
await store(`S.set({ selection: [arg] })`, await idOf('Details'));
await settle();
await grab('right-panel-frame', '.panel.right');
await grab('type-header', '.type-header');
await grab('prop-sections', '.panel.right .prop-section', { all: true });
await grab('prop-section-position', '.panel.right .prop-section', { nth: 0 });
await grab('fields', '.panel.right .field', { all: true });
await grab('field', '.panel.right .field', { nth: 0 });
await grab('seg', '.panel.right .seg', { nth: 0 });
await grab('paint-row', '.panel.right .paint-row', { nth: 0 });
await grab('icon-btns', '.panel.right .icon-btn', { all: true });
await grab('checkbox-row', '.panel.right .checkbox-row', { nth: 0 });
await grab('align-bar', '.panel.right .align-bar', { nth: 0 });
await grab('sublabel', '.panel.right .sublabel', { nth: 0 });
await grab('layer-row-selected', '.layer-row.selected');
await grab('layer-rows', '.layer-row', { all: true });
await shot('editor-frame-selected');

// Color picker
await page.locator('.panel.right .paint-row .swatch').first().click();
await settle();
await grab('color-picker', '.popover');
await shot('color-picker', '.popover');
await page.keyboard.press('Escape');
await page.mouse.click(700, 860);
await settle();


// Context menu with submenu
await page.locator('.layer-row').first().click({ button: 'right' });
await settle();
await grab('menu-context', '.menu');
const sub = page.locator('.menu .menu-item[aria-haspopup="menu"]').first();
if (await sub.count()) {
  await sub.hover();
  await settle();
  await grab('menu-submenu', '.menu', { all: true });
}
await page.keyboard.press('Escape');
await settle();

// Text node
const textId = await store(`const d=S.get().doc; return Object.values(d.nodes).find(n=>n.type==='TEXT' && !n.refId)?.id`);
await store(`S.set({ selection: [arg] })`, textId);
await settle();
await grab('right-panel-text', '.panel.right');
await grab('select-btn', '.panel.right .select-btn', { nth: 0 });
if (await page.locator('.panel.right .select-btn').count()) {
  await page.locator('.panel.right .select-btn').first().click();
  await settle();
  await grab('menu-select', '.menu');
  await page.keyboard.press('Escape');
  await settle();
}

// Component / instance
const compId = await store(`const d=S.get().doc; return Object.values(d.nodes).find(n=>n.type==='COMPONENT')?.id`);
if (compId) {
  await store(`S.set({ selection: [arg] })`, compId);
  await settle();
  await grab('right-panel-component', '.panel.right');
}
const instId = await store(`const d=S.get().doc; return Object.values(d.nodes).find(n=>n.type==='INSTANCE' && !n.refId)?.id`);
if (instId) {
  await store(`S.set({ selection: [arg] })`, instId);
  await settle();
  await grab('right-panel-instance', '.panel.right');
  await grab('layer-row-instance', '.layer-row.selected');
}

// Toast
await store(`S.showToast('Copied as PNG')`);
await settle();
await grab('toast', '.toast');

// Dialogs
await store(`S.set({ selection: [], quickActions: true })`);
await settle();
await grab('quick-actions-empty', '.dialog');
await page.keyboard.type('zoom');
await settle();
await grab('quick-actions', '.dialog');
await store(`S.set({ quickActions: false, shortcutsOpen: true })`);
await settle();
await grab('shortcuts', '.dialog');
await store(`S.set({ shortcutsOpen: false })`);
const M = `const M = await import('/src/editor/menus.ts'); M.saveVersion('Before handoff');`;
await store(M);
await store(`S.set({ versionsOpen: true })`);
await settle();
await grab('version-history', '.drawer');
await store(`S.set({ versionsOpen: false })`);

// Rail panels
for (const tab of ['AGENTS', 'ASSETS', 'TOOLS']) {
  await store(`UI.openRail(arg)`, tab);
  await settle();
  await grab('left-dock-' + tab.toLowerCase(), '.left-dock');
}
await store(`UI.openRail('FILE')`);

// Agents with a conversation
await store(`UI.openRail('AGENTS')`);
await settle();
const composer = page.locator('.agent-composer textarea, .agent-composer input').first();
if (await composer.count()) {
  await composer.fill('generate a login screen');
  await composer.press('Enter');
  await page.waitForTimeout(600);
  await grab('left-dock-agents-chat', '.left-dock');
  await shot('agents-chat', '.left-dock');
  await page.keyboard.press('ControlOrMeta+z');
}
await store(`UI.openRail('FILE')`);

// Prototype + Dev Mode
await store(`S.set({ selection: [arg], rightTab: 'PROTOTYPE' })`, await idOf('Home'));
await settle();
await grab('right-panel-prototype', '.panel.right');
await store(`S.set({ rightTab: 'DESIGN', devMode: true })`);
await settle();
await grab('right-panel-inspect', '.panel.right');
await grab('code-block', '.code-block');
await store(`S.set({ devMode: false })`);

// Draw mode toolbar
await store(`S.set({ editorMode: 'DRAW', tool: 'PENCIL' })`);
await settle();
await grab('toolbar-draw', '.toolbar');
await store(`S.set({ editorMode: 'DESIGN', tool: 'MOVE' })`);

// Variables
await store(`S.set({ variablesOpen: true })`);
await settle();
await grab('variables-empty', '.variables-view');
await store(`S.mutate((d) => { d.variableCollections = [{ id: 'c1', name: 'Brand', modes: [{ id: 'm1', name: 'Light' }, { id: 'm2', name: 'Dark' }], variables: [
  { id: 'v1', name: 'surface', type: 'COLOR', values: { m1: 'FFFFFF', m2: '2C2C2C' } },
  { id: 'v2', name: 'accent', type: 'COLOR', values: { m1: '0D99FF', m2: '0C8CE9' } },
  { id: 'v3', name: 'radius-md', type: 'NUMBER', values: { m1: 8, m2: 8 } },
  { id: 'v4', name: 'cta-label', type: 'STRING', values: { m1: 'Get started', m2: 'Get started' } },
  { id: 'v5', name: 'show-badge', type: 'BOOLEAN', values: { m1: true, m2: false } } ] }]; })`);
await settle();
await grab('variables-view', '.variables-view');
await shot('variables', '.variables-view');
await page.keyboard.press('ControlOrMeta+z');
await store(`S.set({ variablesOpen: false })`);

// Comments panel
await store(`S.mutate((d) => { d.comments.push({ id: 'cm1', pageId: d.pages[0].id, x: 120, y: 80, resolved: false, messages: [{ id: 'm1', author: 'Ada', color: '#0D99FF', text: 'Can the hero card use the brand blue?', at: Date.now() - 3600e3 }] }); })`);
await store(`S.set({ commentsOpen: true, rightTab: 'DESIGN' })`);
await settle();
await grab('right-panel-comments', '.panel.right');
await grab('comment-pin', '.comment-pin-wrap');
await store(`S.set({ activeCommentId: 'cm1' })`);
await settle();
await grab('comment-popover', '.comment-popover');
await store(`S.set({ activeCommentId: null, commentsOpen: false })`);
await page.keyboard.press('ControlOrMeta+z');

// Dark editor shot
await store(`S.set({ selection: [arg] })`, await idOf('Details'));
await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
await settle();
await shot('editor-dark');
await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; });

// Presenter
await store(`S.set({ selection: [], presenting: { frameId: arg } })`, await idOf('Home'));
await page.waitForTimeout(800);
await grab('presenter-bar', '.presenter-bar');
await shot('presenter');
await store(`S.set({ presenting: null })`);

// Frame presets (frame tool)
await page.keyboard.press('Escape');
await store(`A.setTool('FRAME')`);
await settle();
await grab('right-panel-frame-presets', '.panel.right');
await store(`A.setTool('MOVE')`);

// ---------- Icon set (serialized from the app's own icon components) ----------
const iconSet = await page.evaluate(async () => {
  const { Icon } = await import('/src/ui/icons.tsx');
  const { Monkey } = await import('/src/ui/Monkey.tsx');
  const KEEP = new Set(['viewBox', 'preserveAspectRatio', 'gradientUnits', 'gradientTransform', 'patternUnits', 'clipPathUnits']);
  const kebab = (k) => (k === 'className' ? 'class' : KEEP.has(k) ? k : k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()));
  const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const ser = (node) => {
    if (node == null || node === false || node === true) return '';
    if (Array.isArray(node)) return node.map(ser).join('');
    if (typeof node === 'string' || typeof node === 'number') return esc(node);
    if (typeof node.type === 'function') return ser(node.type(node.props));
    if (typeof node.type === 'symbol') return ser(node.props.children); // fragments
    const { children, ...rest } = node.props;
    const attrs = Object.entries(rest)
      .filter(([, v]) => v !== undefined && v !== null && v !== false && typeof v !== 'function')
      .map(([k, v]) => (v === true ? ` ${kebab(k)}="true"` : ` ${kebab(k)}="${esc(v)}"`))
      .join('');
    return `<${node.type}${attrs}>${ser(children)}</${node.type}>`;
  };
  const icons = {};
  for (const [name, C] of Object.entries(Icon)) icons[name] = ser(C({}));
  return { icons, monkey: ser(Monkey({ size: 64 })), monkeyBare: ser(Monkey({ size: 64, tile: false })) };
});
fs.writeFileSync(path.join(DOCS, 'source', 'icons.json'), JSON.stringify(iconSet.icons));
log.push(`ok icons ${Object.keys(iconSet.icons).length}`);

console.log(log.join('\n'));
await browser.close();
