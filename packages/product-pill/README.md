# @open-figment/product-pill

A 32px pill button on the home screen for starting work: Design (new file), Import, More.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `ProductPill`.

## Install

```bash
npm install @open-figment/product-pill @open-figment/icons
```

```bash
pnpm add @open-figment/product-pill @open-figment/icons
```

```bash
yarn add @open-figment/product-pill @open-figment/icons
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/product-pill/styles.css';
import { ProductPill } from '@open-figment/product-pill';
import { IconPen } from '@open-figment/icons';

<ProductPill icon={<IconPen />} color="#0d99ff" onClick={createFile}>Design</ProductPill>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/product-pill

## License

MIT
