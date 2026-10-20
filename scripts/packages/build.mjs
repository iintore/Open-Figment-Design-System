// Builds every npm package under packages/:
//
//   @open-figment/tokens      tokens.css (variables + Inter), base.css, tokens.json, typed JS
//   @open-figment/icons       91 React icon components + SVG files
//   @open-figment/<component> 31 component packages: ESM + CJS + types, and their own styles.css
//   @open-figment/styles      all component CSS (and per-component files) for non-React use
//   @open-figment/react       every component, icon and token from one package, one stylesheet
//
// Sources: packages/<component>/src/index.tsx (hand-written), source/tokens.json,
// source/icons.json and public/ds/{tokens,bundle}.css (generated from the app by
// scripts/build_content.py). Run: npm run packages:build
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { SCOPE, components } from './manifest.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const PKGS = path.join(ROOT, 'packages');
const BUILD = path.join(ROOT, '.packages-build');
const { version } = JSON.parse(fs.readFileSync(path.join(PKGS, 'version.json'), 'utf8'));
const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const DOCS = 'https://open-figment-design-system.vercel.app';
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
// Shared package files
// ---------------------------------------------------------------------------------------------
const LICENSE = read('LICENSE');
const install = (names) => {
  const list = names.join(' ');
  return '```bash\nnpm install ' + list + '\n```\n\n```bash\npnpm add ' + list + '\n```\n\n```bash\nyarn add ' + list + '\n```';
};
function packageJson(dir, { name, description, keywords = [], deps = {}, peers = {}, exports, files, type = 'module', main = true, extra = {} }) {
  const pkg = {
    name,
    version,
    description,
    keywords: ['open-figment', 'design-system', ...keywords],
    homepage: extra.homepage ?? DOCS,
    bugs: { url: `${REPO}/issues` },
    repository: { type: 'git', url: `git+${REPO}.git`, directory: `packages/${dir}` },
    license: 'MIT',
    author: rootPkg.author,
    type,
    engines: { node: '>=18' },
    sideEffects: ['*.css'],
    ...(main ? { main: './dist/index.cjs', module: './dist/index.js', types: './dist/index.d.ts' } : {}),
    exports,
    files: [...files, 'README.md', 'LICENSE'],
    ...(Object.keys(deps).length ? { dependencies: deps } : {}),
    ...(Object.keys(peers).length ? { peerDependencies: peers } : {}),
    publishConfig: { access: 'public' },
  };
  write(path.join(PKGS, dir, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
  write(path.join(PKGS, dir, 'LICENSE'), LICENSE);
}
const jsExports = (more = {}) => ({
  '.': {
    import: { types: './dist/index.d.ts', default: './dist/index.js' },
    require: { types: './dist/index.d.cts', default: './dist/index.cjs' },
  },
  ...more,
  './package.json': './package.json',
});

/** A CSS export with an empty declaration file, so `import 'pkg/x.css'` type-checks without bundler types. */
const cssEntry = (dir, file) => {
  const decl = '// Side-effect stylesheet import.\nexport {};\n';
  write(path.join(PKGS, dir, file + '.d.ts'), decl);
  write(path.join(PKGS, dir, file + '.d.cts'), decl);
  return { import: { types: `./${file}.d.ts`, default: `./${file}` }, require: { types: `./${file}.d.cts`, default: `./${file}` } };
};

// ---------------------------------------------------------------------------------------------
// 1. @open-figment/tokens
// ---------------------------------------------------------------------------------------------
{
  const dir = path.join(PKGS, 'tokens');
  const typeVars = pick(bundle, (s) => s === ':root' || s === ':host');
  write(path.join(dir, 'tokens.css'), `/* Open Figment tokens: colour (light and dark), type, spacing, radius, shadow, and the Inter font.
   Dark theme: set data-theme="dark" on <html> (or any container). */\n` + read('public/ds/tokens.css').replace(/^\/\*.*?\*\/\n/s, '') + '\n' + typeVars.join('\n\n') + '\n');
  for (const f of fs.readdirSync(path.join(ROOT, 'public/ds/fonts'))) {
    fs.mkdirSync(path.join(dir, 'fonts'), { recursive: true });
    fs.copyFileSync(path.join(ROOT, 'public/ds/fonts', f), path.join(dir, 'fonts', f));
  }
  fs.copyFileSync(path.join(ROOT, 'licenses/Inter-OFL-1.1.txt'), path.join(dir, 'fonts', 'OFL.txt'));
  write(
    path.join(dir, 'base.css'),
    `/* Optional page defaults for an app built entirely with Open Figment: the 11px interface type,
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
  write(path.join(dir, 'tokens.json'), JSON.stringify(json, null, 2) + '\n');
  write(path.join(dir, 'src', 'index.ts'), `// Generated by scripts/packages/build.mjs from source/tokens.json.\n/** Every Open Figment token: colour (light and dark), type, spacing, radius and shadow. */\nexport const tokens = ${JSON.stringify(json, null, 2)} as const;\n\nexport type Tokens = typeof tokens;\n\n/** \`var(--name)\` for a CSS variable token, e.g. \`cssVar('color-bg-brand')\`. */\nexport const cssVar = (name: string) => \`var(--\${name})\`;\n`);
  packageJson('tokens', {
    name: `${SCOPE}/tokens`,
    description: 'Open Figment design tokens: CSS variables (light and dark), JSON and typed JS, with the Inter font.',
    keywords: ['tokens', 'css-variables', 'theme'],
    exports: jsExports({ './tokens.css': cssEntry('tokens', 'tokens.css'), './base.css': cssEntry('tokens', 'base.css'), './tokens.json': './tokens.json', './fonts/*': './fonts/*' }),
    files: ['dist', 'tokens.css', 'base.css', '*.css.d.ts', '*.css.d.cts', 'tokens.json', 'fonts'],
  });
  write(
    path.join(dir, 'README.md'),
    `# ${SCOPE}/tokens\n\nThe Open Figment design tokens: colour for light and dark themes, the type scale, spacing, radius and shadow, as CSS variables, JSON and typed JavaScript. Ships the Inter variable font (OFL 1.1).\n\n## Install\n\n${install([`${SCOPE}/tokens`])}\n\n## Use\n\n\`\`\`ts\nimport '${SCOPE}/tokens/tokens.css'; // CSS variables and the font, once per app\nimport '${SCOPE}/tokens/base.css'; // optional: page defaults for a full Open Figment UI\n\nimport { tokens, cssVar } from '${SCOPE}/tokens';\ntokens.color; // every colour token\ncssVar('color-bg-brand'); // "var(--color-bg-brand)"\n\`\`\`\n\nDark theme: set \`data-theme="dark"\` on \`<html>\` (or on any container).\n\nDocs: ${DOCS}/foundations/color\n`,
  );
  log('tokens');
}

// ---------------------------------------------------------------------------------------------
// 2. @open-figment/icons
// ---------------------------------------------------------------------------------------------
const icons = JSON.parse(read('source/icons.json'));
{
  const dir = path.join(PKGS, 'icons');
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
    write(path.join(dir, 'svg', `${name}.svg`), svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"').replace(' aria-hidden="true"', ''));
  }
  write(
    path.join(dir, 'src', 'index.tsx'),
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
  packageJson('icons', {
    name: `${SCOPE}/icons`,
    description: `The Open Figment icon set: ${names.length} outline icons as React components and SVG files.`,
    keywords: ['icons', 'react', 'svg'],
    peers: { react: '>=18' },
    exports: jsExports({ './svg/*': './svg/*' }),
    files: ['dist', 'svg'],
  });
  write(
    path.join(dir, 'README.md'),
    `# ${SCOPE}/icons\n\nThe Open Figment icon set: ${names.length} outline icons drawn to one spec (24px grid, 1px round strokes, 12px live area), as tree-shakable React components and plain SVG files. Icons use \`currentColor\`.\n\n## Install\n\n${install([`${SCOPE}/icons`])}\n\n## Use\n\n\`\`\`tsx\nimport { IconPlus, IconFrame, Icon } from '${SCOPE}/icons';\n\n<IconPlus />\n<IconFrame size={16} title="Frame" />\n<Icon name="chevronDown" />\n\`\`\`\n\nSVG files: \`${SCOPE}/icons/svg/<name>.svg\`.\n\n## Icons\n\n${names.map(([n, C]) => `\`${C}\``).join(' · ')}\n\nDocs: ${DOCS}/foundations/iconography\n`,
  );
  log('icons', names.length);
}

// ---------------------------------------------------------------------------------------------
// 3. Component packages
// ---------------------------------------------------------------------------------------------
const content = JSON.parse(read('src/content/content.json'));
const byDir = Object.fromEntries(components.map((c) => [c.dir, c]));
const allClasses = (c, seen = new Set()) => {
  if (seen.has(c.dir)) return [];
  seen.add(c.dir);
  return [...c.classes, ...(c.deps ?? []).flatMap((d) => allClasses(byDir[d], seen))];
};
const cssOut = {};
for (const c of components) {
  const dir = path.join(PKGS, c.dir);
  const src = fs.readFileSync(path.join(dir, 'src', 'index.tsx'), 'utf8');
  const page = content.pages[`components/${c.dir}`];
  const title = page?.title ?? pascal(c.dir);
  const description = page?.lead?.replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1').replace(/`([^`]+)`/g, '$1') ?? `The Open Figment ${title} component.`;
  const classes = [...new Set(allClasses(c))];
  const rules = cssFor(classes);
  if (!rules.length) throw new Error(`no CSS found for ${c.dir}`);
  const css = `/* ${SCOPE}/${c.dir}: ${title}. Needs ${SCOPE}/tokens/tokens.css loaded once in your app. */\n\n${scopedReset(classes)}\n\n${rules.join('\n\n')}\n`;
  cssOut[c.dir] = { own: cssFor(c.classes), classes: c.classes };
  write(path.join(dir, 'styles.css'), css);
  const usesIcons = src.includes(`'${SCOPE}/icons'`);
  const deps = { [`${SCOPE}/tokens`]: `^${version}` };
  if (usesIcons) deps[`${SCOPE}/icons`] = `^${version}`;
  for (const d of c.deps ?? []) deps[`${SCOPE}/${d}`] = `^${version}`;
  const peers = { react: '>=18' };
  if (src.includes("'react-dom'")) peers['react-dom'] = '>=18';
  packageJson(c.dir, {
    name: `${SCOPE}/${c.dir}`,
    description,
    keywords: ['react', 'component', c.dir, c.group.toLowerCase()],
    deps,
    peers,
    exports: jsExports({ './styles.css': cssEntry(c.dir, 'styles.css') }),
    files: ['dist', 'styles.css', '*.css.d.ts', '*.css.d.cts'],
    extra: { homepage: `${DOCS}/components/${c.dir}` },
  });
  const iconImports = [...c.usage.matchAll(/<(Icon[A-Z]\w*)/g)].map((m) => m[1]);
  const needIcons = iconImports.length > 0;
  const usageImports = [`import { ${c.exports.filter((e) => c.usage.includes(e) || e === c.exports[0]).join(', ')} } from '${SCOPE}/${c.dir}';`];
  if (needIcons) usageImports.push(`import { ${[...new Set(iconImports)].join(', ')} } from '${SCOPE}/icons';`);
  if (c.usage.includes('<IconButton') && c.dir !== 'icon-button') usageImports.push(`import { IconButton } from '${SCOPE}/icon-button';`);
  write(
    path.join(dir, 'README.md'),
    `# ${SCOPE}/${c.dir}\n\n${description}\n\nPart of the [Open Figment design system](${DOCS}). Exports: ${c.exports.map((e) => `\`${e}\``).join(', ')}${c.types ? `, types ${c.types.map((t) => `\`${t}\``).join(', ')}` : ''}.\n\n## Install\n\n${install([`${SCOPE}/${c.dir}`, ...(needIcons && !usesIcons ? [`${SCOPE}/icons`] : [])])}\n\n## Use\n\n\`\`\`tsx\nimport '${SCOPE}/tokens/tokens.css'; // once per app\nimport '${SCOPE}/${c.dir}/styles.css';\n${usageImports.join('\n')}\n\n${c.usage}\n\`\`\`\n\nEvery prop is typed and documented in the editor. Full reference, states and rules: ${DOCS}/components/${c.dir}\n\n## License\n\nMIT\n`,
  );
}
log('components', components.length);

// What the docs need to show Install / Usage on each component page (read by scripts/build_content.py).
write(
  path.join(ROOT, 'source', 'packages.json'),
  JSON.stringify(
    {
      version,
      scope: SCOPE,
      components: components.map((c) => {
        const src = fs.readFileSync(path.join(PKGS, c.dir, 'src', 'index.tsx'), 'utf8');
        const usedIcons = [...new Set([...c.usage.matchAll(/<(Icon[A-Z]\w*)/g)].map((m) => m[1]))];
        return { dir: c.dir, exports: c.exports.filter((e) => c.usage.includes(e) || e === c.exports[0]), usage: c.usage, icons: usedIcons, iconButton: c.usage.includes('<IconButton') && c.dir !== 'icon-button', bundlesIcons: src.includes(`'${SCOPE}/icons'`) };
      }),
    },
    null,
    2,
  ) + '\n',
);

// ---------------------------------------------------------------------------------------------
// 4. @open-figment/styles (all CSS) and @open-figment/react (everything)
// ---------------------------------------------------------------------------------------------
const allRoots = [...new Set(components.flatMap((c) => c.classes))];
const allCss = `${scopedReset(allRoots)}\n\n${cssFor(allRoots).join('\n\n')}\n`;
{
  const dir = path.join(PKGS, 'styles');
  for (const c of components) write(path.join(dir, 'components', `${c.dir}.css`), fs.readFileSync(path.join(PKGS, c.dir, 'styles.css'), 'utf8'));
  write(path.join(dir, 'index.css'), `/* ${SCOPE}/styles: every Open Figment component's CSS, with the tokens and font. */\n@import url('./tokens.css');\n\n${allCss}`);
  write(path.join(dir, 'components.css'), `/* ${SCOPE}/styles: every component's CSS, without tokens (load ${SCOPE}/tokens/tokens.css yourself). */\n\n${allCss}`);
  // tokens.css travels with the fonts so the relative font URLs resolve in this package too.
  fs.copyFileSync(path.join(PKGS, 'tokens', 'tokens.css'), path.join(dir, 'tokens.css'));
  fs.cpSync(path.join(PKGS, 'tokens', 'fonts'), path.join(dir, 'fonts'), { recursive: true });
  packageJson('styles', {
    name: `${SCOPE}/styles`,
    description: 'All Open Figment component CSS, for use with or without React: class-based styles, tokens and the Inter font.',
    keywords: ['css', 'styles'],
    main: false,
    exports: { '.': cssEntry('styles', 'index.css'), './index.css': cssEntry('styles', 'index.css'), './components.css': cssEntry('styles', 'components.css'), './tokens.css': cssEntry('styles', 'tokens.css'), './components/*': './components/*', './fonts/*': './fonts/*', './package.json': './package.json' },
    files: ['index.css', 'components.css', 'tokens.css', '*.css.d.ts', '*.css.d.cts', 'components', 'fonts'],
  });
  write(
    path.join(dir, 'README.md'),
    `# ${SCOPE}/styles\n\nEvery Open Figment component's CSS in one place, for apps that render the markup themselves (any framework, or plain HTML). The class names and markup for each component are documented at ${DOCS}.\n\n## Install\n\n${install([`${SCOPE}/styles`])}\n\n## Use\n\n\`\`\`ts\nimport '${SCOPE}/styles'; // tokens + font + all components\n// or pick:\nimport '${SCOPE}/styles/tokens.css';\nimport '${SCOPE}/styles/components/button.css';\n\`\`\`\n\n\`\`\`html\n<button class="btn primary">Share</button>\n\`\`\`\n`,
  );
  log('styles');
}
{
  const dir = path.join(PKGS, 'react');
  const lines = [
    `// Generated by scripts/packages/build.mjs: every Open Figment package in one import.`,
    `export * from '${SCOPE}/tokens';`,
    `export * from '${SCOPE}/icons';`,
    ...components.map((c) => `export * from '${SCOPE}/${c.dir}';`),
  ];
  write(path.join(dir, 'src', 'index.ts'), lines.join('\n') + '\n');
  write(path.join(dir, 'styles.css'), `/* ${SCOPE}/react: tokens, font and every component's CSS. Import once. */\n@import url('./tokens.css');\n\n${allCss}`);
  fs.copyFileSync(path.join(PKGS, 'tokens', 'tokens.css'), path.join(dir, 'tokens.css'));
  fs.cpSync(path.join(PKGS, 'tokens', 'fonts'), path.join(dir, 'fonts'), { recursive: true });
  const deps = { [`${SCOPE}/tokens`]: `^${version}`, [`${SCOPE}/icons`]: `^${version}` };
  for (const c of components) deps[`${SCOPE}/${c.dir}`] = `^${version}`;
  packageJson('react', {
    name: `${SCOPE}/react`,
    description: `The whole Open Figment design system for React: ${components.length} components, ${Object.keys(icons).length} icons, tokens and one stylesheet.`,
    keywords: ['react', 'components', 'ui'],
    deps,
    peers: { react: '>=18', 'react-dom': '>=18' },
    exports: jsExports({ './styles.css': cssEntry('react', 'styles.css'), './tokens.css': cssEntry('react', 'tokens.css'), './fonts/*': './fonts/*' }),
    files: ['dist', 'styles.css', 'tokens.css', '*.css.d.ts', '*.css.d.cts', 'fonts'],
  });
  const groups = [...new Set(components.map((c) => c.group))];
  write(
    path.join(dir, 'README.md'),
    `# ${SCOPE}/react\n\nThe whole [Open Figment design system](${DOCS}) for React: ${components.length} components, ${Object.keys(icons).length} icons and the design tokens, with one stylesheet. Want a single component instead? Every one is also published on its own (\`${SCOPE}/button\`, \`${SCOPE}/select\`, …).\n\n## Install\n\n${install([`${SCOPE}/react`])}\n\nPeer dependencies: \`react\` and \`react-dom\` 18 or newer.\n\n## Use\n\n\`\`\`tsx\nimport '${SCOPE}/react/styles.css'; // once, at the root of your app\nimport { Button, IconButton, IconPlus } from '${SCOPE}/react';\n\nexport function Toolbar() {\n  return (\n    <>\n      <Button variant="primary">Share</Button>\n      <IconButton label="Add"><IconPlus /></IconButton>\n    </>\n  );\n}\n\`\`\`\n\nDark theme: set \`data-theme="dark"\` on \`<html>\`.\n\n## Components\n\n${groups.map((g) => `**${g}:** ` + components.filter((c) => c.group === g).map((c) => `[${c.exports[0]}](${DOCS}/components/${c.dir})`).join(', ')).join('\n\n')}\n\n## License\n\nMIT. Inter is under the SIL Open Font License 1.1.\n`,
  );
  log('react');
}

// ---------------------------------------------------------------------------------------------
// 5. Compile: ESM + declarations, then CommonJS, into each package's dist/
// ---------------------------------------------------------------------------------------------
const jsPkgs = ['tokens', 'icons', ...components.map((c) => c.dir), 'react'];
fs.rmSync(BUILD, { recursive: true, force: true });
const tsconfig = (module, out, declaration) => {
  void module;
  const p = path.join(BUILD, `tsconfig.${module}.json`);
  write(
    p,
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          jsx: 'react-jsx',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          strict: true,
          skipLibCheck: true,
          declaration,
          esModuleInterop: true,
          verbatimModuleSyntax: false,
          rootDir: PKGS,
          outDir: out,
          types: [],
          paths: { [`${SCOPE}/*`]: [path.join(PKGS, '*', 'src')] },
        },
        files: jsPkgs.map((d) => path.join(PKGS, d, 'src', fs.existsSync(path.join(PKGS, d, 'src', 'index.tsx')) ? 'index.tsx' : 'index.ts')),
      },
      null,
      2,
    ),
  );
  return p;
};
const tsc = path.join(ROOT, 'node_modules', '.bin', 'tsc');
execFileSync(tsc, ['-p', tsconfig('esm', path.join(BUILD, 'esm'), true)], { stdio: 'inherit' });
const { build: rolldownBuild } = await import(path.join(ROOT, 'node_modules', 'rolldown', 'dist', 'index.mjs'));
for (const d of jsPkgs) {
  const dist = path.join(PKGS, d, 'dist');
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist, { recursive: true });
  const esm = path.join(BUILD, 'esm', d, 'src');
  fs.copyFileSync(path.join(esm, 'index.js'), path.join(dist, 'index.js'));
  const dts = fs.readFileSync(path.join(esm, 'index.d.ts'), 'utf8');
  fs.writeFileSync(path.join(dist, 'index.d.ts'), dts);
  fs.writeFileSync(path.join(dist, 'index.d.cts'), dts);
  // CommonJS from the ESM output; every package import (react, other @open-figment packages) stays external.
  await rolldownBuild({
    input: path.join(dist, 'index.js'),
    external: (id) => !id.startsWith('.') && !path.isAbsolute(id),
    output: { file: path.join(dist, 'index.cjs'), format: 'cjs' },
    logLevel: 'silent',
  });
}
fs.rmSync(BUILD, { recursive: true, force: true });
log('compiled', jsPkgs.length, 'packages (ESM, CJS, types)');
log(`version ${version}: ${jsPkgs.length + 1} packages ready in packages/`);
