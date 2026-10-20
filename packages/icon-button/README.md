# @open-figment/icon-button

A 24px square button holding one 24px icon, used for every icon-only action in panels and headers.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `IconButton`.

## Install

```bash
npm install @open-figment/icon-button @open-figment/icons
```

```bash
pnpm add @open-figment/icon-button @open-figment/icons
```

```bash
yarn add @open-figment/icon-button @open-figment/icons
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/icon-button/styles.css';
import { IconButton } from '@open-figment/icon-button';
import { IconButton, IconPlus } from '@open-figment/icons';

<IconButton label="Add fill" onClick={add}>
  <IconPlus />
</IconButton>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/icon-button

## License

MIT
