# @open-figment/checkbox

A labelled native checkbox in a 32px row, for on/off properties: Clip content, Show in exports.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `Checkbox`.

## Install

```bash
npm install @open-figment/checkbox
```

```bash
pnpm add @open-figment/checkbox
```

```bash
yarn add @open-figment/checkbox
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/checkbox/styles.css';
import { Checkbox } from '@open-figment/checkbox';

<Checkbox checked={clip} onChange={setClip}>Clip content</Checkbox>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/checkbox

## License

MIT
