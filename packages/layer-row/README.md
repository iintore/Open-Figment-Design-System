# @open-figment/layer-row

One layer in the layers tree: disclosure caret, type icon, name, and lock / hide actions.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `LayerRow`.

## Install

```bash
npm install @open-figment/layer-row
```

```bash
pnpm add @open-figment/layer-row
```

```bash
yarn add @open-figment/layer-row
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/layer-row/styles.css';
import { LayerRow } from '@open-figment/layer-row';
import { IconFrame } from '@open-figment/icons';

<LayerRow
  name="Home"
  icon={<IconFrame />}
  expanded={open}
  onToggle={toggle}
  selected
  onLockedChange={setLocked}
  onHiddenChange={setHidden}
/>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/layer-row

## License

MIT
