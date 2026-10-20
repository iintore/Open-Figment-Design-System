# @open-figment/button

Text buttons trigger a command: share, present, export, create, restore, delete.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `Button`.

## Install

```bash
npm install @open-figment/button
```

```bash
pnpm add @open-figment/button
```

```bash
yarn add @open-figment/button
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/button/styles.css';
import { Button } from '@open-figment/button';

<Button variant="primary" onClick={share}>Share</Button>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/button

## License

MIT
