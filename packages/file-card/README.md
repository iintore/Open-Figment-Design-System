# @open-figment/file-card

A file in the home screen grid: thumbnail, star toggle, file chip, name, last edited time and a more-actions button.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `FileCard`.

## Install

```bash
npm install @open-figment/file-card
```

```bash
pnpm add @open-figment/file-card
```

```bash
yarn add @open-figment/file-card
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/file-card/styles.css';
import { FileCard } from '@open-figment/file-card';

<FileCard name="Welcome to Figment" edited="Edited just now" starred={starred} onStarredChange={setStarred} onOpen={open} />
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/file-card

## License

MIT
