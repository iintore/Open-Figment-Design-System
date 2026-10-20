# @open-figment/tokens

The Open Figment design tokens: colour for light and dark themes, the type scale, spacing, radius and shadow, as CSS variables, JSON and typed JavaScript. Ships the Inter variable font (OFL 1.1).

## Install

```bash
npm install @open-figment/tokens
```

```bash
pnpm add @open-figment/tokens
```

```bash
yarn add @open-figment/tokens
```

## Use

```ts
import '@open-figment/tokens/tokens.css'; // CSS variables and the font, once per app
import '@open-figment/tokens/base.css'; // optional: page defaults for a full Open Figment UI

import { tokens, cssVar } from '@open-figment/tokens';
tokens.color; // every colour token
cssVar('color-bg-brand'); // "var(--color-bg-brand)"
```

Dark theme: set `data-theme="dark"` on `<html>` (or on any container).

Docs: https://open-figment-design-system.vercel.app/foundations/color
