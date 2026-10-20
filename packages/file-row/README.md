# @open-figment/file-row

A file in the home screen list view: small thumbnail, name, star marker and last-edited time in a 44px row.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `FileRow`.

## Install

```bash
npm install @open-figment/file-row
```

```bash
pnpm add @open-figment/file-row
```

```bash
yarn add @open-figment/file-row
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/file-row/styles.css';
import { FileRow } from '@open-figment/file-row';

<FileRow name="Welcome to Figment" edited="Edited just now" onOpen={open} />
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/file-row

## License

MIT
