# Installation

Use the Open Figment tokens and component styles in a page, or work on the components inside the app.

## In a web page

### Add the stylesheets
Load the tokens first, then the component styles. Both files are in the design system and in this site under `ds/`.

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
