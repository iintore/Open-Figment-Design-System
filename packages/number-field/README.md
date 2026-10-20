# @open-figment/number-field

A 24px field for a numeric property (position, size, rotation, spacing, opacity) whose label can be dragged to scrub the value.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `NumberField`, `evalExpr`.

## Install

```bash
npm install @open-figment/number-field
```

```bash
pnpm add @open-figment/number-field
```

```bash
yarn add @open-figment/number-field
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/number-field/styles.css';
import { NumberField } from '@open-figment/number-field';

<NumberField label="X" value={x} onChange={setX} />
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/number-field

## License

MIT
