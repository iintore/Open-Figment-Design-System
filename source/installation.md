# Installation

Install the whole system or one component at a time, with npm, pnpm or Yarn. Every package ships ES modules, CommonJS and TypeScript types, and works with React 18 and 19.

## With a package manager

### The whole system
`@open-figment/react` has every component, all 91 icons and the tokens, with one stylesheet.

```install
@open-figment/react
```

```tsx
import '@open-figment/react/styles.css'; // once, at the root of your app
import { Button, IconButton, IconPlus } from '@open-figment/react';

export function Toolbar() {
  return (
    <>
      <Button variant="primary">Share</Button>
      <IconButton label="Add"><IconPlus /></IconButton>
    </>
  );
}
```

### One component
Each component is also its own package, with its own stylesheet. Load the tokens once.

```install
@open-figment/button
```

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/button/styles.css';
import { Button } from '@open-figment/button';

<Button variant="primary">Share</Button>
```

Every component page lists its package under **Install**.

### The packages
| Package | What's in it |
| --- | --- |
| `@open-figment/react` | Every component, icon and token, and `styles.css` with all of them |
| `@open-figment/<component>` | One component and its `styles.css`, e.g. `@open-figment/select` |
| `@open-figment/icons` | 91 icons as React components (`IconPlus`, `<Icon name="plus" />`) and SVG files |
| `@open-figment/tokens` | `tokens.css` (variables, light and dark, Inter), `tokens.json`, typed `tokens` |
| `@open-figment/styles` | All component CSS without React, for any framework or plain HTML |

### Dark theme
Set `data-theme="dark"` on `<html>`, or on any container to theme just that part.

### Frameworks
- **Vite, Remix, Parcel, webpack:** import the CSS files from JavaScript as shown.
- **Next.js (App Router):** import the stylesheets in `app/layout.tsx`. Components are marked `'use client'`, so you can use them from server components.
- **TypeScript:** types are included, including for the CSS imports.

## In a web page

### Add the stylesheets
Without a bundler, load the tokens first, then the component styles. Both are in `@open-figment/styles` (`tokens.css`, `components.css`) and on this site under `ds/`.

```html
<link rel="stylesheet" href="tokens.css" />
<link rel="stylesheet" href="bundle.css" />
```

### Pick a theme
Set `data-theme` on the root element. Every token has a light and a dark value.

```html
<html data-theme="light">
<!-- or -->
<html data-theme="dark">
```

### Use the component classes
Components are plain markup with the class names shown on each component page.

```html
<button class="btn primary">Share</button>
<label class="field"><span class="field-label">W</span><input value="393" /></label>
```

## In the Open Figment codebase

### Get the source
```bash
git clone https://github.com/iintore/Open-Figment.git
cd Open-Figment
npm install
npm run dev
```

### Use the React components
Inputs and panels are React components in `src/ui/controls.tsx` and `src/ui/`. Prefer them to raw markup: they handle scrubbing, maths in fields, undo grouping and keyboard behaviour.

```tsx
import { NumberField, Select, Seg } from '../ui/controls';

<NumberField label="W" value={node.w} min={0.01} onChange={(w) => updateNodes(ids, { w })} />
<Select value={blend} options={BLENDS} onChange={(blendMode) => updateNodes(ids, { blendMode })} />
```

### Use tokens in CSS
All tokens are CSS custom properties. Never paste raw values.

```css
.my-panel {
  background: var(--color-bg);
  border-left: 1px solid var(--color-border);
  font: var(--text-body-medium);
  color: var(--color-text);
}
```

### Shortcut labels
Shortcut text in menus and tooltips comes from one table, so it follows the platform automatically (⌘ on macOS, Ctrl elsewhere).

```ts
import { SHORTCUTS } from '../editor/keys';

{ label: 'Group selection', shortcut: SHORTCUTS.groupSelection, action: groupSelection }
```
