// End-to-end install test: installs the packed design system (.packages-pack/, from packages:check)
// into fresh Vite + React apps with npm, pnpm, Yarn 1 and Yarn 4 (Plug'n'Play), builds each app,
// checks require() and import in Node, then runs it in Chromium and checks styles, the font,
// the Select menu, keyboard input, the number field and the dark theme.
//
//   npm run packages:build && npm run packages:check && node scripts/packages/install-test.mjs [npm|pnpm|yarn1|yarn4 ...]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync, spawn } from 'node:child_process';
import { chromium } from '@playwright/test';

const ROOT = path.resolve(import.meta.dirname, '../..');
const PACK = path.join(ROOT, '.packages-pack');
// The design system's tarball (packages:check packs it).
const tarball = path.join(PACK, fs.readdirSync(PACK).find((f) => f.startsWith('krackedui-') && f.endsWith('.tgz')));
const P = '@krackedui/open-figment';
const MANAGERS = {
  npm: { install: 'npm install --no-audit --no-fund --loglevel=error', run: 'npx' },
  pnpm: { install: 'npx -y pnpm@10 install --reporter=silent', run: 'npx -y pnpm@10 exec' },
  yarn1: { install: 'npx -y yarn@1.22.22 install --silent --non-interactive', run: 'npx -y yarn@1.22.22 run --silent' },
  yarn4: { install: 'npx -y -p @yarnpkg/cli-dist@4 yarn install', run: 'npx -y -p @yarnpkg/cli-dist@4 yarn', pnp: true },
};
const only = process.argv.slice(2);
const results = [];

const MAIN = `
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@krackedui/open-figment/styles.css';
import '@krackedui/open-figment/button/styles.css';
import { Button as SingleButton } from '@krackedui/open-figment/button';
import {
  Avatar, Badge, Button, Checkbox, CodeBlock, Dialog, DialogItem, Drawer, FileCard, FileRow, IconButton, LayerRow, Menu, ModeSwitch,
  NumberField, PageRow, PaintRow, Popover, ProductPill, PropertySection, RailItem, Rail, ResourceCard, SearchField, SegmentedControl,
  Select, StarButton, Tab, TabBar, TabHome, TabNew, TextField, Toast, ToolButton, Tooltip, TypeHeader,
  IconPlus, IconFrame, IconRectangle, IconMove, IconCode, IconGrid, IconList, IconFile, IconAssets, IconPen, IconDots, tokens,
} from '@krackedui/open-figment/react';

function App() {
  const [sizing, setSizing] = useState<'fixed' | 'hug' | 'fill'>('hug');
  const [x, setX] = useState(493);
  const [mode, setMode] = useState('design');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [clip, setClip] = useState(true);
  const [q, setQ] = useState('');
  const [star, setStar] = useState(false);
  return (
    <div style={{ padding: 24, display: 'grid', gap: 16, width: 520 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="primary" id="primary">Share</Button>
        <Button variant="secondary">Restore</Button>
        <Button variant="ghost" danger>Delete</Button>
        <SingleButton variant="primary" icon={<IconPlus />}>Create</SingleButton>
        <IconButton label="Add"><IconPlus /></IconButton>
        <Badge>Free</Badge>
        <Avatar name="Ada" color="#14ae5c" />
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <ToolButton icon={<IconRectangle />} label="Rectangle" active caret />
        <ModeSwitch value={mode} onChange={setMode} options={[{ value: 'design', label: 'Design mode', icon: <IconMove /> }, { value: 'dev', label: 'Dev Mode', icon: <IconCode />, tone: 'dev' }]} />
        <ProductPill icon={<IconPen />} color="#0d99ff">Design</ProductPill>
        <StarButton starred={star} onChange={setStar} standalone />
        <SegmentedControl value={view} onChange={setView} options={[{ value: 'grid', icon: <IconGrid />, title: 'Grid view' }, { value: 'list', icon: <IconList />, title: 'List view' }]} />
      </div>
      <PropertySection title="Layout" actions={<IconButton label="Add"><IconPlus /></IconButton>}>
        <div style={{ display: 'flex', gap: 8, padding: '0 16px' }}>
          <div style={{ width: 120 }}><Select value={sizing} onChange={setSizing} options={[{ value: 'fixed', label: 'Fixed width' }, { value: 'hug', label: 'Hug contents' }, { value: 'fill', label: 'Fill container' }]} /></div>
          <div style={{ width: 88 }} id="x"><NumberField label="X" value={x} onChange={setX} /></div>
          <TextField value="" onChange={() => {}} placeholder="Add a description" />
        </div>
        <Checkbox checked={clip} onChange={setClip}>Clip content</Checkbox>
      </PropertySection>
      <output id="state">{sizing}|{x}|{mode}|{view}|{String(clip)}|{String(star)}</output>
      <SearchField value={q} onChange={setQ} />
      <PaintRow color="0D99FF" opacity={100} onColorChange={() => {}} onOpacityChange={() => {}} onVisibleChange={() => {}} onRemove={() => {}} />
      <TabBar><TabHome /><Tab title="Welcome to Figment" active onClose={() => {}} /><TabNew /></TabBar>
      <Rail><RailItem icon={<IconFile />} label="File" active /><RailItem icon={<IconAssets />} label="Assets" /></Rail>
      <PageRow name="Design" active />
      <LayerRow name="Home" icon={<IconFrame />} expanded selected onLockedChange={() => {}} onHiddenChange={() => {}} />
      <Menu autoFocus={false} items={[{ label: 'Copy', shortcut: '⌘C' }, { separator: true }, { label: 'Hug contents', checked: true }]} />
      <Tooltip>Rectangle  R</Tooltip>
      <Toast inline>Copied as PNG</Toast>
      <Popover title="Drop shadow" onClose={() => {}}><div style={{ padding: 16 }}>Effect settings</div></Popover>
      <Dialog title="Quick actions" onClose={() => {}} width={360}><DialogItem path="View" shortcut="⌘+" highlighted>Zoom in</DialogItem></Dialog>
      <div style={{ height: 160, display: 'flex', position: 'relative', overflow: 'hidden' }}><Drawer title="Version history" onClose={() => {}}>…</Drawer></div>
      <TypeHeader label="Frame"><IconButton label="More"><IconDots /></IconButton></TypeHeader>
      <div style={{ width: 270 }}><FileCard name="Welcome to Figment" edited="Edited just now" onStarredChange={() => {}} onMore={() => {}} /></div>
      <FileRow name="Welcome to Figment" edited="Edited just now" />
      <ResourceCard title="Blank design file" description="Start from scratch" icon={<IconPlus />} />
      <CodeBlock>{'width: 393px;'}</CodeBlock>
      <span id="tokens">{Object.keys(tokens.color).length}</span>
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
`;

const NODE_SMOKE = `
const cjs = require('@krackedui/open-figment/button');
const all = require('@krackedui/open-figment/react');
const root = require('@krackedui/open-figment');
if (root.Select !== all.Select) throw new Error('package root differs from /react');
if (typeof cjs.Button !== 'object' && typeof cjs.Button !== 'function') throw new Error('CJS Button missing');
if (!all.Select || !all.IconPlus || !all.tokens) throw new Error('CJS react bundle incomplete');
import('@krackedui/open-figment/select').then((m) => {
  if (!m.Select) throw new Error('ESM Select missing');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { createElement } = require('react');
  const html = renderToStaticMarkup(createElement(all.Button, { variant: 'primary' }, 'Share'));
  if (html !== '<button type="button" class="btn primary">Share</button>') throw new Error('SSR markup: ' + html);
  console.log('node ok');
});
`;

async function test(pm) {
  const M = MANAGERS[pm];
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `of-${pm}-`));
  const pkg = {
    name: `of-install-${pm}`,
    private: true,
    type: 'module',
    scripts: { build: 'vite build', preview: 'vite preview --strictPort' },
    dependencies: { react: '^19.2.0', 'react-dom': '^19.2.0', [P]: `file:${tarball}` },
    devDependencies: { vite: '^8.0.0', '@vitejs/plugin-react': '^6.0.0', typescript: '~6.0.2', '@types/react': '^19.2.0', '@types/react-dom': '^19.2.0' },
  };
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
  if (M.pnp) fs.writeFileSync(path.join(dir, '.yarnrc.yml'), 'enableTelemetry: false\nenableGlobalCache: false\n');
  if (pm === 'yarn4') fs.writeFileSync(path.join(dir, 'yarn.lock'), '');
  fs.writeFileSync(path.join(dir, 'index.html'), '<!doctype html><html><head><meta charset="utf-8"><title>of</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>');
  fs.mkdirSync(path.join(dir, 'src'));
  fs.writeFileSync(path.join(dir, 'src', 'main.tsx'), MAIN);
  fs.writeFileSync(path.join(dir, 'vite.config.ts'), "import react from '@vitejs/plugin-react';\nimport { defineConfig } from 'vite';\nexport default defineConfig({ plugins: [react()] });\n");
  fs.writeFileSync(path.join(dir, 'smoke.cjs'), NODE_SMOKE);
  fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', strict: true, noEmit: true, skipLibCheck: false, types: [] }, include: ['src'] }));
  const sh = (cmd) => execSync(cmd, { cwd: dir, stdio: 'pipe', env: { ...process.env, YARN_ENABLE_IMMUTABLE_INSTALLS: 'false', COREPACK_ENABLE_STRICT: '0' } }).toString();
  const t0 = Date.now();
  sh(M.install);
  const run = (bin) => (pm === 'npm' ? `npx ${bin}` : `${M.run} ${bin}`);
  sh(run('tsc -p tsconfig.json'));
  sh(run('vite build'));
  const node = pm === 'yarn4' ? `${M.run} node smoke.cjs` : 'node smoke.cjs';
  const smoke = sh(node).trim();
  const port = 4800 + Object.keys(MANAGERS).indexOf(pm);
  const server = spawn(run(`vite preview --strictPort --port ${port}`), { cwd: dir, shell: true, stdio: 'ignore', detached: true });
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 800, height: 1600 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    for (let i = 0; i < 60; i++) {
      try {
        await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
        break;
      } catch {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
    await page.waitForSelector('#primary');
    const st = () => page.textContent('#state');
    const checks = {};
    checks.primaryBlue = await page.$eval('#primary', (e) => getComputedStyle(e).backgroundColor);
    checks.interFont = await page.evaluate(async () => (await document.fonts.ready, document.fonts.check('11px Inter')));
    checks.fontSize = await page.$eval('.menu-item', (e) => getComputedStyle(e).fontSize);
    await page.click('.select-btn');
    await page.waitForSelector('body > .menu');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    checks.select = (await st()).split('|')[0];
    // fill() replaces the text in one step (typing can race the field's select-on-focus).
    await page.fill('#x input', '100/4');
    await page.press('#x input', 'Enter');
    checks.numberField = (await st()).split('|')[1];
    await page.click('[aria-label="Dev Mode"]');
    await page.click('[aria-label="List view"]');
    await page.click('.checkbox-row');
    await page.click('.star-btn');
    checks.toggles = (await st()).split('|').slice(2).join('|');
    checks.darkBg = await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark';
      return getComputedStyle(document.querySelector('.menu')).backgroundColor + ' / ' + getComputedStyle(document.body).getPropertyValue('--color-bg').trim();
    });
    fs.mkdirSync(path.join(ROOT, '.packages-pack', 'screens'), { recursive: true });
    await page.evaluate(() => (document.documentElement.dataset.theme = 'light'));
    await page.screenshot({ path: path.join(ROOT, '.packages-pack', 'screens', `${pm}.png`), fullPage: true });
    await browser.close();
    const ok =
      checks.primaryBlue === 'rgb(13, 153, 255)' && checks.interFont && checks.fontSize === '11px' && checks.select === 'fill' && checks.numberField === '25' && checks.toggles === 'dev|list|false|true' && checks.darkBg.endsWith('#2c2c2c') && !errors.length && smoke === 'node ok';
    results.push({ pm, ok, seconds: Math.round((Date.now() - t0) / 1000), checks, errors: errors.slice(0, 3), dir });
  } finally {
    process.kill(-server.pid);
  }
}

for (const pm of Object.keys(MANAGERS)) {
  if (only.length && !only.includes(pm)) continue;
  try {
    await test(pm);
  } catch (e) {
    results.push({ pm, ok: false, error: (String(e.message) + '\n' + String(e.stdout ?? '') + String(e.stderr ?? '')).slice(0, 2500) });
  }
  const r = results.at(-1);
  console.log(`${r.ok ? '✓' : '✗'} ${pm}${r.seconds ? ` (${r.seconds}s)` : ''}`, r.checks ? JSON.stringify(r.checks) : '', r.errors?.length ? r.errors : '', r.error ?? '');
}
process.exit(results.every((r) => r.ok) ? 0 : 1);
