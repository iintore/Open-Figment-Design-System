# @open-figment/select

A dropdown for choosing one option from a list (font family, sizing, blend mode, export format). It opens a Menu with a check next to the current option.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `Select`.

## Install

```bash
npm install @open-figment/select
```

```bash
pnpm add @open-figment/select
```

```bash
yarn add @open-figment/select
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/select/styles.css';
import { Select } from '@open-figment/select';

<Select
  value={sizing}
  onChange={setSizing}
  options={[
    { value: 'fixed', label: 'Fixed width' },
    { value: 'hug', label: 'Hug contents' },
    { value: 'fill', label: 'Fill container' },
  ]}
/>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/select

## License

MIT
