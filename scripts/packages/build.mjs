// Builds the design system's npm package, @krackedui/open-figment (packages/open-figment):
// one package per design system, with a subpath for every part of it.
//
//   @krackedui/open-figment            everything (same as /react)
//   @krackedui/open-figment/react      every component, icon and token
//   @krackedui/open-figment/<component>  one component (button, select, menu, …)
//   @krackedui/open-figment/icons      91 React icons (SVG files under /svg/*)
//   @krackedui/open-figment/tokens     typed tokens (CSS: /tokens.css, JSON: /tokens.json)
//   CSS: /styles.css (tokens + all components), /components.css, /<component>/styles.css,
//        /tokens.css, /base.css
//
// Every module ships ESM, CommonJS and types. Sources: packages/open-figment/src/<component>/
// index.tsx (hand-written), source/tokens.json, source/icons.json and public/ds/{tokens,bundle}.css
// (generated from the app by scripts/build_content.py). Run: npm run packages:build
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { PACKAGE, SYSTEM, components } from './manifest.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const PKGS = path.join(ROOT, 'packages');
const PKG = path.join(PKGS, SYSTEM.dir);
const SRC = path.join(PKG, 'src');
const CSS = path.join(PKG, 'css');
const BUILD = path.join(ROOT, '.packages-build');
const { version } = JSON.parse(fs.readFileSync(path.join(PKGS, 'version.json'), 'utf8'));
const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const DOCS = SYSTEM.docs;
const REPO = 'https://github.com/iintore/Open-Figment-Design-System';
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, s) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s);
};
const pascal = (s) => s.replace(/(^|[-_ ])(\w)/g, (_, __, c) => c.toUpperCase()).replace(/^\w/, (c) => c.toUpperCase());
const log = (...a) => console.log('·', ...a);

// ---------------------------------------------------------------------------------------------
// CSS: a small parser for the generated stylesheet (comments, strings, nested at-rules).
// ---------------------------------------------------------------------------------------------
function parseCss(src) {
  let i = 0;
  const skipWs = () => {
    for (;;) {
      while (i < src.length && /\s/.test(src[i])) i++;
      if (src.startsWith('/*', i)) i = src.indexOf('*/', i + 2) + 2;
      else return;
    }
  };
  const readUntil = (stops) => {
    let out = '';
    while (i < src.length && !stops.includes(src[i])) {
      if (src[i] === '"' || src[i] === "'") {
        const q = src[i];
        let j = i + 1;
        while (j < src.length && src[j] !== q) j += src[j] === '\\' ? 2 : 1;
        out += src.slice(i, j + 1);
        i = j + 1;
      } else if (src.startsWith('url(', i)) {
        const j = src.indexOf(')', i);
        out += src.slice(i, j + 1);
        i = j + 1;
      } else if (src.startsWith('/*', i)) i = src.indexOf('*/', i + 2) + 2;
      else out += src[i++];
    }
    return out;
  };
  const block = () => {
    const nodes = [];
    for (;;) {
      skipWs();
      if (i >= src.length || src[i] === '}') {
        i++;
        return nodes;
      }
      const prelude = readUntil(['{', ';', '}']).trim();
      if (src[i] === ';') {
        i++;
        nodes.push({ type: 'at', prelude });
        continue;
      }
      if (src[i] === '}') continue;
      i++; // {
      if (prelude.startsWith('@') && !/^@(font-face|page)/.test(prelude) && !/^@keyframes|^@-webkit-keyframes/.test(prelude)) {
        nodes.push({ type: 'group', prelude, children: block() });
      } else {
        // Read the body with balanced braces (@keyframes nest one level).
        let depth = 1;
        let body = '';
        while (i < src.length) {
          const part = readUntil(['{', '}']);
          body += part;
          if (src[i] === '{') depth++;
          else if (--depth === 0) break;
          body += src[i++];
        }
        i++;
        nodes.push({ type: 'rule', prelude, body: body.trim() });
      }
    }
  };
  return block();
}

const splitSelectors = (s) => {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
};
const classesOf = (sel) => [...sel.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]);
// Docs-only state mirrors and desktop-app-only rules never ship.
const DROP = /\.is-(hover|pressed|focus|desktop)\b/;
const fmtRule = (sels, body, indent = '') => `${indent}${sels.join(`,\n${indent}`)} {\n${body.split(/;\s*/).filter(Boolean).map((d) => `${indent}  ${d.trim()};`).join('\n')}\n${indent}}`;

/** The rules (and @media blocks) whose selectors belong to any of `classes`. */
function pick(nodes, test, indent = '') {
  const out = [];
  for (const n of nodes) {
    if (n.type === 'group') {
      const inner = pick(n.children, test, indent + '  ');
      if (inner.length) out.push(`${indent}${n.prelude} {\n${inner.join('\n\n')}\n${indent}}`);
    } else if (n.type === 'rule' && /^@(-webkit-)?keyframes/.test(n.prelude)) {
      if (test(n.prelude)) out.push(`${indent}${n.prelude} {\n${indent}  ${n.body}\n${indent}}`);
    } else if (n.type === 'rule' && !n.prelude.startsWith('@')) {
      const sels = splitSelectors(n.prelude).filter((s) => !DROP.test(s) && test(s));
      if (sels.length) out.push(fmtRule(sels, n.body, indent));
    }
  }
  return out;
}

const bundle = parseCss(read('public/ds/bundle.css'));
const ownerOf = (sel) => classesOf(sel)[0];
const cssFor = (classes) => pick(bundle, (s) => classes.includes(ownerOf(s)));

/** Element defaults the components rely on, scoped to their own elements (zero specificity). */
function scopedReset(classes) {
  const roots = classes.map((c) => '.' + c).join(', ');
  return `/* Element defaults, scoped to these components only (zero specificity, so any rule wins). */
:where(${roots}),
:where(${roots}) * {
  box-sizing: border-box;
}
:where(button):where(${roots}),
:where(${roots}) :where(button) {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  padding: 0;
  margin: 0;
  cursor: default;
}
:where(${roots}) {
  font: var(--text-body-medium);
  letter-spacing: 0.055px;
  -webkit-font-smoothing: antialiased;
}
:where(${roots}) :where(input, textarea, select) {
  font: inherit;
  color: inherit;
}
:where(${roots}) :where(svg) {
  display: block;
  flex: none;
}`;
}

// ---------------------------------------------------------------------------------------------
// Package metadata helpers
// ---------------------------------------------------------------------------------------------
const install = (name) => '```bash\nnpm install ' + name + '\n```\n\n```bash\npnpm add ' + name + '\n```\n\n```bash\nyarn add ' + name + '\n```';
const decl = '// Side-effect stylesheet import.\nexport {};\n';
/** A CSS export with empty declarations, so `import 'pkg/x.css'` type-checks without bundler types. */
const cssEntry = (rel) => {
  write(path.join(PKG, rel + '.d.ts'), decl);
  write(path.join(PKG, rel + '.d.cts'), decl);
  return { import: { types: `./${rel}.d.ts`, default: `./${rel}` }, require: { types: `./${rel}.d.cts`, default: `./${rel}` } };
};
const jsEntry = (mod) => {
  const base = mod ? `./dist/${mod}/index` : './dist/index';
  return { import: { types: `${base}.d.ts`, default: `${base}.js` }, require: { types: `${base}.d.cts`, default: `${base}.cjs` } };
};

fs.rmSync(path.join(PKG, 'dist'), { recursive: true, force: true });
fs.rmSync(CSS, { recursive: true, force: true });
fs.rmSync(path.join(PKG, 'svg'), { recursive: true, force: true });

// ---------------------------------------------------------------------------------------------
// 1. Tokens: /tokens (typed JS), /tokens.css, /base.css, /tokens.json, fonts
// ---------------------------------------------------------------------------------------------
{
  const typeVars = pick(bundle, (s) => s === ':root' || s === ':host');
  write(path.join(CSS, 'tokens.css'), `/* ${SYSTEM.title} tokens: colour (light and dark), type, spacing, radius, shadow, and the Inter font.
   Dark theme: set data-theme="dark" on <html> (or any container). */\n` + read('public/ds/tokens.css').replace(/^\/\*.*?\*\/\n/s, '') + '\n' + typeVars.join('\n\n') + '\n');
  fs.mkdirSync(path.join(CSS, 'fonts'), { recursive: true });
  for (const f of fs.readdirSync(path.join(ROOT, 'public/ds/fonts'))) fs.copyFileSync(path.join(ROOT, 'public/ds/fonts', f), path.join(CSS, 'fonts', f));
  fs.copyFileSync(path.join(ROOT, 'licenses/Inter-OFL-1.1.txt'), path.join(CSS, 'fonts', 'OFL.txt'));
  write(
    path.join(CSS, 'base.css'),
    `/* Optional page defaults for an app built entirely with ${SYSTEM.title}: the 11px interface type,
   colours and box sizing on the whole document. Components don't need this file. */
*,
*::before,
*::after {
  box-sizing: border-box;
}
body {
  margin: 0;
  font: var(--text-body-medium);
  letter-spacing: 0.055px;
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
}
kbd {
  font: var(--text-body-medium);
  background: var(--color-bg-secondary);
  border-radius: 4px;
  padding: 1px 6px;
  color: var(--color-text-secondary);
}
`,
  );
  const json = JSON.parse(read('source/tokens.json'));
  write(path.join(PKG, 'tokens.json'), JSON.stringify(json, null, 2) + '\n');
  write(path.join(SRC, 'tokens', 'index.ts'), `// Generated by scripts/packages/build.mjs from source/tokens.json.\n/** Every ${SYSTEM.title} token: colour (light and dark), type, spacing, radius and shadow. */\nexport const tokens = ${JSON.stringify(json, null, 2)} as const;\n\nexport type Tokens = typeof tokens;\n\n/** \`var(--name)\` for a CSS variable token, e.g. \`cssVar('color-bg-brand')\`. */\nexport const cssVar = (name: string) => \`var(--\${name})\`;\n`);
  log('tokens');
}

// ---------------------------------------------------------------------------------------------
// 2. Icons: /icons (React), /svg/*
// ---------------------------------------------------------------------------------------------
const icons = JSON.parse(read('source/icons.json'));
{
  const ATTR = { 'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin', viewbox: 'viewBox' };
  const rows = [];
  const names = [];
  for (const [name, svg] of Object.entries(icons)) {
    const m = svg.match(/^<svg([^>]*)>([\s\S]*)<\/svg>$/);
    const attrs = Object.fromEntries([...m[1].matchAll(/([\w:-]+)="([^"]*)"/g)].filter(([, k]) => !['aria-hidden', 'xmlns'].includes(k)).map(([, k, v]) => [ATTR[k] ?? k, v]));
    const size = Number(attrs.width ?? 24);
    delete attrs.width;
    delete attrs.height;
    const Comp = 'Icon' + pascal(name);
    names.push([name, Comp]);
    rows.push(`/** The \`${name}\` icon. */\nexport const ${Comp} = /*#__PURE__*/ icon('${Comp}', ${size}, ${JSON.stringify(attrs)}, ${JSON.stringify(m[2])});`);
    write(path.join(PKG, 'svg', `${name}.svg`), svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"').replace(' aria-hidden="true"', ''));
  }
  write(
    path.join(SRC, 'icons', 'index.tsx'),
    `// Generated by scripts/packages/build.mjs from source/icons.json (the app's icon set).
import type { JSX, SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'dangerouslySetInnerHTML'> {
  /** Rendered size in px. Default 24 (8 for the small chevrons). Strokes scale with it. */
  size?: number;
  /** An accessible name. Without one the icon is decorative (aria-hidden). */
  title?: string;
}

export type IconComponent = ((props: IconProps) => JSX.Element) & { displayName: string };

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function icon(displayName: string, base: number, attrs: Record<string, string>, body: string): IconComponent {
  const C = ({ size = base, title, ...rest }: IconProps) => (
    <svg
      width={size}
      height={size}
      {...attrs}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
      {...rest}
      dangerouslySetInnerHTML={{ __html: (title ? \`<title>\${esc(title)}</title>\` : '') + body }}
    />
  );
  C.displayName = displayName;
  return C;
}

${rows.join('\n')}

/** Every icon by its name in the design system (\`plus\`, \`chevronDown\`, …). */
export const icons = {
${names.map(([n, C]) => `  ${n}: ${C},`).join('\n')}
} as const;

export type IconName = keyof typeof icons;

/** Render an icon by name: \`<Icon name="plus" />\`. */
export function Icon({ name, ...props }: IconProps & { name: IconName }) {
  const C = icons[name];
  return <C {...props} />;
}
`,
  );
  log('icons', names.length);
}

// ---------------------------------------------------------------------------------------------
// 3. Components: /<component> and /<component>/styles.css; /components.css, /styles.css
// ---------------------------------------------------------------------------------------------
const content = JSON.parse(read('src/content/content.json'));
const byDir = Object.fromEntries(components.map((c) => [c.dir, c]));
const allClasses = (c, seen = new Set()) => {
  if (seen.has(c.dir)) return [];
  seen.add(c.dir);
  return [...c.classes, ...(c.deps ?? []).flatMap((d) => allClasses(byDir[d], seen))];
};
const exportsMap = { '.': jsEntry(''), './react': jsEntry('react'), './icons': jsEntry('icons'), './tokens': jsEntry('tokens') };
const cssMap = {};
for (const c of components) {
  const page = content.pages[`components/${c.dir}`];
  const title = page?.title ?? pascal(c.dir);
  const classes = [...new Set(allClasses(c))];
  const rules = cssFor(classes);
  if (!rules.length) throw new Error(`no CSS found for ${c.dir}`);
  write(path.join(CSS, `${c.dir}.css`), `/* ${PACKAGE}/${c.dir}/styles.css: ${title}. Needs ${PACKAGE}/tokens.css loaded once in your app. */\n\n${scopedReset(classes)}\n\n${rules.join('\n\n')}\n`);
  exportsMap[`./${c.dir}`] = jsEntry(c.dir);
  cssMap[`./${c.dir}/styles.css`] = cssEntry(`css/${c.dir}.css`);
}
const allRoots = [...new Set(components.flatMap((c) => c.classes))];
const allCss = `${scopedReset(allRoots)}\n\n${cssFor(allRoots).join('\n\n')}\n`;
write(path.join(CSS, 'components.css'), `/* ${PACKAGE}/components.css: every component's CSS, without tokens (load ${PACKAGE}/tokens.css yourself). */\n\n${allCss}`);
write(path.join(CSS, 'styles.css'), `/* ${PACKAGE}/styles.css: tokens, the Inter font and every component's CSS. Import once. */\n@import url('./tokens.css');\n\n${allCss}`);
write(
  path.join(SRC, 'react', 'index.ts'),
  [`// Generated by scripts/packages/build.mjs: the whole ${SYSTEM.title} design system in one import.`, `export * from '../tokens/index.js';`, `export * from '../icons/index.js';`, ...components.map((c) => `export * from '../${c.dir}/index.js';`)].join('\n') + '\n',
);
write(path.join(SRC, 'index.ts'), `// Generated by scripts/packages/build.mjs: the package root is the whole system (same as /react).\nexport * from './react/index.js';\n`);
log('components', components.length);

// What the docs need to show Install / Usage on each component page (read by scripts/build_content.py).
write(
  path.join(ROOT, 'source', 'packages.json'),
  JSON.stringify(
    {
      version,
      package: PACKAGE,
      components: components.map((c) => ({ dir: c.dir, exports: c.exports.filter((e) => c.usage.includes(e) || e === c.exports[0]), usage: c.usage, icons: [...new Set([...c.usage.matchAll(/<(Icon[A-Z]\w*)/g)].map((m) => m[1]))], iconButton: c.usage.includes('<IconButton') && c.dir !== 'icon-button' })),
    },
    null,
    2,
  ) + '\n',
);

// ---------------------------------------------------------------------------------------------
// 4. package.json, README, LICENSE
// ---------------------------------------------------------------------------------------------
const modules = ['', 'react', 'tokens', 'icons', ...components.map((c) => c.dir)];
const pkgJson = {
  name: PACKAGE,
  version,
  description: `The ${SYSTEM.title} design system for React: ${components.length} components, ${Object.keys(icons).length} icons and design tokens, with one stylesheet or one per component.`,
  keywords: ['krackedui', SYSTEM.dir, 'design-system', 'react', 'components', 'ui', 'icons', 'tokens', 'css'],
  homepage: DOCS,
  bugs: { url: `${REPO}/issues` },
  repository: { type: 'git', url: `git+${REPO}.git`, directory: `packages/${SYSTEM.dir}` },
  license: 'MIT',
  author: rootPkg.author,
  type: 'module',
  engines: { node: '>=18' },
  sideEffects: ['*.css'],
  main: './dist/index.cjs',
  module: './dist/index.js',
  types: './dist/index.d.ts',
  exports: {
    ...exportsMap,
    './styles.css': cssEntry('css/styles.css'),
    './components.css': cssEntry('css/components.css'),
    './tokens.css': cssEntry('css/tokens.css'),
    './base.css': cssEntry('css/base.css'),
    ...cssMap,
    './tokens.json': './tokens.json',
    './svg/*': './svg/*',
    './fonts/*': './css/fonts/*',
    './package.json': './package.json',
  },
  // Types for subpath imports under TypeScript's legacy "node" resolution, which ignores "exports".
  typesVersions: {
    '*': Object.fromEntries([
      ...modules.filter(Boolean).map((m) => [m, [`dist/${m}/index.d.ts`]]),
      ...Object.keys(cssMap).map((k) => [k.slice(2), [`css/${k.slice(2, -'/styles.css'.length)}.css.d.ts`]]),
      ...['styles', 'components', 'tokens', 'base'].map((n) => [`${n}.css`, [`css/${n}.css.d.ts`]]),
    ]),
  },
  files: ['dist', 'css', 'svg', 'tokens.json', 'README.md', 'LICENSE'],
  peerDependencies: { react: '>=18', 'react-dom': '>=18' },
  publishConfig: { access: 'public' },
};
write(path.join(PKG, 'package.json'), JSON.stringify(pkgJson, null, 2) + '\n');
write(path.join(PKG, 'LICENSE'), read('LICENSE'));
{
  const groups = [...new Set(components.map((c) => c.group))];
  write(
    path.join(PKG, 'README.md'),
    `# ${PACKAGE}

The [${SYSTEM.title} design system](${DOCS}) for React: ${components.length} components, ${Object.keys(icons).length} icons and the design tokens. One package: import the whole system, or one component at a time.

Part of [KrackedUI](https://www.npmjs.com/org/krackedui): every KrackedUI design system is one package, \`@krackedui/<design-system>\`.

## Install

${install(PACKAGE)}

Peer dependencies: \`react\` and \`react-dom\` 18 or newer. ES modules, CommonJS and TypeScript types.

## Use the whole system

\`\`\`tsx
import '${PACKAGE}/styles.css'; // once, at the root of your app: tokens, font, every component
import { Button, IconButton, IconPlus } from '${PACKAGE}/react';

export function Toolbar() {
  return (
    <>
      <Button variant="primary">Share</Button>
      <IconButton label="Add"><IconPlus /></IconButton>
    </>
  );
}
\`\`\`

## Use one component

Each component has its own entry point and stylesheet, so you only ship what you use.

\`\`\`tsx
import '${PACKAGE}/tokens.css'; // once per app
import '${PACKAGE}/select/styles.css';
import { Select } from '${PACKAGE}/select';
\`\`\`

## Entry points

| Import | What you get |
| --- | --- |
| \`${PACKAGE}/react\` (or the package root) | Every component, icon and token |
| \`${PACKAGE}/<component>\` | One component, e.g. \`/button\`, \`/select\`, \`/menu\` |
| \`${PACKAGE}/icons\` | ${Object.keys(icons).length} icons as React components (\`IconPlus\`, \`<Icon name="plus" />\`) |
| \`${PACKAGE}/tokens\` | Typed tokens (\`tokens\`, \`cssVar()\`) |
| \`${PACKAGE}/styles.css\` | Tokens, the Inter font and all component CSS |
| \`${PACKAGE}/<component>/styles.css\` | One component's CSS (load \`tokens.css\` once too) |
| \`${PACKAGE}/tokens.css\`, \`/base.css\`, \`/components.css\` | Tokens and font; optional page defaults; all component CSS without tokens |
| \`${PACKAGE}/tokens.json\`, \`/svg/<name>.svg\` | Tokens as JSON; icons as SVG files |

Dark theme: set \`data-theme="dark"\` on \`<html>\` (or any container).

## Components

${groups.map((g) => `**${g}:** ` + components.filter((c) => c.group === g).map((c) => `[${c.exports[0]}](${DOCS}/components/${c.dir}) (\`/${c.dir}\`)`).join(', ')).join('\n\n')}

## License

MIT. Inter is under the SIL Open Font License 1.1.
`,
  );
}

// ---------------------------------------------------------------------------------------------
// 5. Compile: ESM + declarations with tsc, CommonJS with Rolldown, into dist/<module>/
// ---------------------------------------------------------------------------------------------
const entryOf = (m) => {
  const dir = m ? path.join(SRC, m) : SRC;
  return path.join(dir, fs.existsSync(path.join(dir, 'index.tsx')) ? 'index.tsx' : 'index.ts');
};
fs.rmSync(BUILD, { recursive: true, force: true });
write(
  path.join(BUILD, 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: { target: 'ES2020', module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', lib: ['ES2022', 'DOM', 'DOM.Iterable'], strict: true, skipLibCheck: true, declaration: true, esModuleInterop: true, rootDir: SRC, outDir: path.join(BUILD, 'esm'), types: [] },
      files: modules.map(entryOf),
    },
    null,
    2,
  ),
);
execFileSync(path.join(ROOT, 'node_modules', '.bin', 'tsc'), ['-p', path.join(BUILD, 'tsconfig.json')], { stdio: 'inherit' });
fs.cpSync(path.join(BUILD, 'esm'), path.join(PKG, 'dist'), { recursive: true });
const { build: rolldownBuild } = await import(path.join(ROOT, 'node_modules', 'rolldown', 'dist', 'index.mjs'));
for (const m of modules) {
  const dir = m ? path.join(PKG, 'dist', m) : path.join(PKG, 'dist');
  const dts = fs.readFileSync(path.join(dir, 'index.d.ts'), 'utf8');
  // CommonJS declarations point at the CommonJS siblings.
  fs.writeFileSync(path.join(dir, 'index.d.cts'), dts.replace(/(from '\.{1,2}\/[\w/-]+\/index)\.js'/g, "$1.cjs'"));
  // CommonJS from the ESM output: sibling modules and packages stay external, so each module
  // is its own file and the same code is never duplicated.
  await rolldownBuild({
    input: path.join(dir, 'index.js'),
    external: (id, importer) => !!importer,
    output: { file: path.join(dir, 'index.cjs'), format: 'cjs' },
    logLevel: 'silent',
  });
  const cjs = path.join(dir, 'index.cjs');
  fs.writeFileSync(cjs, fs.readFileSync(cjs, 'utf8').replace(/require\("(\.{1,2}\/[\w/-]+\/index)\.js"\)/g, 'require("$1.cjs")'));
}
fs.rmSync(BUILD, { recursive: true, force: true });
log(`compiled ${modules.length} modules (ESM, CJS, types)`);
log(`${PACKAGE}@${version} ready in packages/${SYSTEM.dir}/`);
