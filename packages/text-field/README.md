# @open-figment/text-field

A single-line text field in the properties panel style, committed on blur or Enter.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `TextField`.

## Install

```bash
npm install @open-figment/text-field
```

```bash
pnpm add @open-figment/text-field
```

```bash
yarn add @open-figment/text-field
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/text-field/styles.css';
import { TextField } from '@open-figment/text-field';

<TextField value={name} onChange={setName} placeholder="Add a description" />
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/text-field

## License

MIT
