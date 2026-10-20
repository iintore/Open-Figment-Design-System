# @open-figment/resource-card

A large tile under Get started on the home screen: blank file, sample file, import.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `ResourceCard`, `ResourceGroup`.

## Install

```bash
npm install @open-figment/resource-card @open-figment/icons
```

```bash
pnpm add @open-figment/resource-card @open-figment/icons
```

```bash
yarn add @open-figment/resource-card @open-figment/icons
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/resource-card/styles.css';
import { ResourceCard } from '@open-figment/resource-card';
import { IconPlus } from '@open-figment/icons';

<ResourceCard title="Blank design file" description="Start from scratch" icon={<IconPlus />} onClick={create} />
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/resource-card

## License

MIT
