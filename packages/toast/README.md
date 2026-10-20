# @open-figment/toast

A brief message centred above the toolbar confirming an action or reporting a problem; it disappears after 2.2 seconds.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `Toast`.

## Install

```bash
npm install @open-figment/toast
```

```bash
pnpm add @open-figment/toast
```

```bash
yarn add @open-figment/toast
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/toast/styles.css';
import { Toast } from '@open-figment/toast';

{message && <Toast>{message}</Toast>}
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/toast

## License

MIT
