# @open-figment/popover

A light floating panel anchored to a control, used for editors that don't fit in the properties panel: the ColorPicker and the effect editor.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `Popover`.

## Install

```bash
npm install @open-figment/popover
```

```bash
pnpm add @open-figment/popover
```

```bash
yarn add @open-figment/popover
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/popover/styles.css';
import { Popover } from '@open-figment/popover';

<Popover title="Drop shadow" onClose={close}>
  …settings
</Popover>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/popover

## License

MIT
