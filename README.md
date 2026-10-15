# Open Figment Design System

**The design system behind [Open Figment](https://github.com/iintore/Open-Figment)**, an
open-source collaborative design tool: foundations, 31 components and 19 blocks, documented with
live previews rendered from the app's real markup and stylesheet.

[![CI](https://github.com/iintore/Open-Figment-Design-System/actions/workflows/ci.yml/badge.svg)](https://github.com/iintore/Open-Figment-Design-System/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

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

## Use the tokens and styles

The built site serves the system's stylesheets at `/ds/tokens.css` (tokens for both themes) and
`/ds/bundle.css` (component styles). Load both, set `data-theme="light"` or `"dark"` on the root,
and use the class names shown on each component page. See the **Installation** page.

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
