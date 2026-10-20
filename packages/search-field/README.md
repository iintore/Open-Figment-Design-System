# @open-figment/search-field

A 32px search box with a leading search icon, used to filter files, layers, assets, tools and variables.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `SearchField`.

## Install

```bash
npm install @open-figment/search-field
```

```bash
pnpm add @open-figment/search-field
```

```bash
yarn add @open-figment/search-field
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/search-field/styles.css';
import { SearchField } from '@open-figment/search-field';

<SearchField value={query} onChange={setQuery} />
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/search-field

## License

MIT
