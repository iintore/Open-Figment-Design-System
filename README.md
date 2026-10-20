# Open Figment Design System

**The design system behind [Open Figment](https://github.com/iintore/Open-Figment)**, an
open-source collaborative design tool: foundations, 31 components and 19 blocks, documented with
live previews rendered from the app's real markup and stylesheet.

[![CI](https://github.com/iintore/Open-Figment-Design-System/actions/workflows/ci.yml/badge.svg)](https://github.com/iintore/Open-Figment-Design-System/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Docs:** [open-figment-design-system.vercel.app](https://open-figment-design-system.vercel.app)  
**App:** [open-figment.vercel.app](https://open-figment.vercel.app)

## Install

The whole system, or any single component, from npm with npm, pnpm or Yarn. ES modules,
CommonJS and TypeScript types; React 18 and 19.

```bash
npm install @open-figment/react       # or: pnpm add / yarn add
```

```tsx
import '@open-figment/react/styles.css';
import { Button, Select, IconPlus } from '@open-figment/react';
```

One component on its own:

```bash
npm install @open-figment/button
```

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/button/styles.css';
import { Button } from '@open-figment/button';
```

| Package | Contents |
| --- | --- |
| [`@open-figment/react`](packages/react) | All 31 components, 91 icons and the tokens, one `styles.css` |
| `@open-figment/<component>` | One component and its `styles.css`: [`button`](packages/button), [`select`](packages/select), [`menu`](packages/menu), [`number-field`](packages/number-field), [`layer-row`](packages/layer-row), [and 26 more](packages) |
| [`@open-figment/icons`](packages/icons) | 91 icons as React components and SVG files |
| [`@open-figment/tokens`](packages/tokens) | CSS variables (light and dark), JSON, typed JS, the Inter font |
| [`@open-figment/styles`](packages/styles) | All component CSS, for non-React use |

## What's inside

- **Foundations:** colour (light and dark), typography, spacing and size, radius, elevation,
  states and motion, iconography (91 icons), logo, editor layout, writing and accessibility.
- **Components:** buttons, fields, selects, segmented controls, layer rows, menus, tooltips and
  more. Every state the code defines is shown: hover, pressed, selected, focus, disabled, mixed.
- **Blocks:** the toolbar, layers panel, properties panel, colour picker, variables view, home
  screen and other composed panels and screens.

Each example has Preview / Code tabs, copy and 200% zoom. The site has full-text search (`/` or
⌘K), an "On this page" outline, light / dark / system themes and works on phones.

## Run it

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static site in dist/
npm run check     # type-check, lint, tests and build (what CI runs)
```

## The packages

`packages/` is an npm workspace. Component sources are `packages/<name>/src/index.tsx`; the
tokens, icons, styles and react packages, every `styles.css` and the compiled `dist/` folders are
generated from the same sources the docs use.

```bash
npm run packages:build     # generate and compile all 35 packages (ESM, CJS, types, CSS)
npm run packages:test      # render every component and check its markup, CSS and exports
npm run packages:check     # publint + Are the Types Wrong on every package, pack tarballs
node scripts/packages/install-test.mjs   # install the tarballs with npm, pnpm, Yarn 1 and 4,
                                         # build an app with each and test it in Chromium
```

Each component's `styles.css` holds only the rules for its own classes (plus those of components
it renders), with element defaults scoped to them, so nothing leaks into the rest of your app.

### Releasing

1. `npm run packages:version -- 1.2.0` and `npm run packages:build`.
2. Commit, then `git tag v1.2.0 && git push --follow-tags`.
3. The **Release packages** workflow tests everything again and publishes all packages to npm
   with provenance. It needs an `NPM_TOKEN` secret with publish rights to the `@open-figment`
   scope. (To publish from your machine instead: `npm login`, then `npm run release`.)

## How the content is made

Nothing in the previews is drawn by hand:

1. **Capture.** With the [Open Figment app](https://github.com/iintore/Open-Figment) running
   (`npm run dev` in its checkout), `npm run capture` drives it with Playwright, puts each
   component in each state and saves the rendered markup to `source/markup/`, the icon set to
   `source/icons.json` and screenshots to `public/shots/`. Randomness is seeded, so re-running
   only changes what changed in the UI.
2. **Build.** `npm run content` (`scripts/build_content.py`, Python 3, no packages) reads the
   app's `src/index.css`, the captures and the specs, and writes `public/ds/*.css` and
   `src/content/content.json`. It looks for the app at `../Open-Figment`; set
   `OPEN_FIGMENT_APP` to use another folder.
3. **Render.** The React site in `src/` shows each example inside a shadow root with those
   stylesheets, so site styles never leak into previews and previews follow the page theme.

## Where to edit

| To change | Edit |
| --- | --- |
| A component's guidelines, examples or block description | `scripts/components_primitives.py` or `scripts/components_blocks.py` |
| Foundations, writing and accessibility pages | `source/brand-book.md` |
| Introduction, Installation, Logo, Editor layout, the cover | `source/*.md`, `source/cover.html` |
| Token usage notes, type scale, spacing and radius names | `source/tokens.json` (colour values always come from the app) |
| Navigation groups | `scripts/build_content.py` |
| Site chrome | `src/` and `src/styles.css` |

Run `npm run content` after editing and commit the regenerated files with your change.

## Contributing

Issues and pull requests are welcome. Keep the system in step with the app: when a component
changes there, re-capture and rebuild here in the same change. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2026 Tony Lewis MANZI and Open Figment contributors. Third-party components and
fonts are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
