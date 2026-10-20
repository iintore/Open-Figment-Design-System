# @open-figment/drawer

A 280px panel that slides in beside the properties panel for a secondary view: version history.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `Drawer`.

## Install

```bash
npm install @open-figment/drawer
```

```bash
pnpm add @open-figment/drawer
```

```bash
yarn add @open-figment/drawer
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/drawer/styles.css';
import { Drawer } from '@open-figment/drawer';

<Drawer title="Version history" onClose={close}>
  …
</Drawer>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/drawer

## License

MIT
