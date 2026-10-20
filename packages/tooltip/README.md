# @open-figment/tooltip

A small dark label that appears above a toolbar control on hover, giving its name and shortcut.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `Tooltip`.

## Install

```bash
npm install @open-figment/tooltip
```

```bash
pnpm add @open-figment/tooltip
```

```bash
yarn add @open-figment/tooltip
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/tooltip/styles.css';
import { Tooltip } from '@open-figment/tooltip';

<Tooltip x={rect.left} y={rect.top - 32}>Rectangle  R</Tooltip>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/tooltip

## License

MIT
