# @open-figment/star-button

The star toggle in the corner of a file card that adds a file to Starred.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `StarButton`.

## Install

```bash
npm install @open-figment/star-button
```

```bash
pnpm add @open-figment/star-button
```

```bash
yarn add @open-figment/star-button
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/star-button/styles.css';
import { StarButton } from '@open-figment/star-button';

<StarButton starred={starred} onChange={setStarred} standalone />
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/star-button

## License

MIT
