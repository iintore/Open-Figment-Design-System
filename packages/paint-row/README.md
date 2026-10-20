# @open-figment/paint-row

One fill or stroke paint: a swatch that opens the ColorPicker, the hex value, opacity, and hide / remove actions.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `PaintRow`.

## Install

```bash
npm install @open-figment/paint-row
```

```bash
pnpm add @open-figment/paint-row
```

```bash
yarn add @open-figment/paint-row
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/paint-row/styles.css';
import { PaintRow } from '@open-figment/paint-row';

<PaintRow
  color="0D99FF"
  opacity={100}
  visible
  onColorChange={setColor}
  onOpacityChange={setOpacity}
  onVisibleChange={setVisible}
  onRemove={remove}
/>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/paint-row

## License

MIT
