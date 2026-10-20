# @open-figment/type-header

The first row of the properties panel: the selection's type (opens a menu to convert it) and quick actions.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `TypeHeader`.

## Install

```bash
npm install @open-figment/type-header
```

```bash
pnpm add @open-figment/type-header
```

```bash
yarn add @open-figment/type-header
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/type-header/styles.css';
import { TypeHeader } from '@open-figment/type-header';
import { IconButton, IconDots } from '@open-figment/icons';
import { IconButton } from '@open-figment/icon-button';

<TypeHeader label="Frame" onLabelClick={openPresets}>
  <IconButton label="More actions"><IconDots /></IconButton>
</TypeHeader>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/type-header

## License

MIT
