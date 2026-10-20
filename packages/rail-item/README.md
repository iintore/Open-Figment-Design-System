# @open-figment/rail-item

One destination in the navigation rail: a 32px icon tile with a label underneath (File, Agents, Assets, Tools, Variables).

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `RailItem`, `Rail`.

## Install

```bash
npm install @open-figment/rail-item @open-figment/icons
```

```bash
pnpm add @open-figment/rail-item @open-figment/icons
```

```bash
yarn add @open-figment/rail-item @open-figment/icons
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/rail-item/styles.css';
import { RailItem, Rail } from '@open-figment/rail-item';
import { IconFile, IconAssets } from '@open-figment/icons';

<Rail>
  <RailItem icon={<IconFile />} label="File" shortcut="⌥1" active />
  <RailItem icon={<IconAssets />} label="Assets" shortcut="⌥2" />
</Rail>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/rail-item

## License

MIT
