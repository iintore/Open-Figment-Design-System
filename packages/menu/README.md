# @open-figment/menu

A dark floating list of commands: the canvas and layer context menus, dropdowns opened by Select and toolbar carets, and the main menu.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `Menu`, types `MenuItem`.

## Install

```bash
npm install @open-figment/menu
```

```bash
pnpm add @open-figment/menu
```

```bash
yarn add @open-figment/menu
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/menu/styles.css';
import { Menu } from '@open-figment/menu';

<Menu
  x={event.clientX}
  y={event.clientY}
  onClose={close}
  items={[
    { label: 'Copy', shortcut: '⌘C', onSelect: copy },
    { separator: true },
    { label: 'Delete', shortcut: '⌫', onSelect: remove },
  ]}
/>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/menu

## License

MIT
