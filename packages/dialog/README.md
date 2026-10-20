# @open-figment/dialog

A centred modal surface for commands that need focus: Quick actions (⌘/) and the Keyboard shortcuts reference.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `Dialog`, `DialogItem`.

## Install

```bash
npm install @open-figment/dialog
```

```bash
pnpm add @open-figment/dialog
```

```bash
yarn add @open-figment/dialog
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/dialog/styles.css';
import { Dialog, DialogItem } from '@open-figment/dialog';

<Dialog title="Keyboard shortcuts" onClose={close}>
  <DialogItem path="View" shortcut="⌘+">Zoom in</DialogItem>
</Dialog>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/dialog

## License

MIT
