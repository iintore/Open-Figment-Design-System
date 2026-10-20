# @open-figment/tab

A file tab in the desktop tab bar: file icon, name and a close button.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `Tab`, `TabBar`, `TabHome`, `TabNew`.

## Install

```bash
npm install @open-figment/tab
```

```bash
pnpm add @open-figment/tab
```

```bash
yarn add @open-figment/tab
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/tab/styles.css';
import { Tab, TabBar, TabHome, TabNew } from '@open-figment/tab';

<TabBar>
  <TabHome onClick={goHome} />
  <Tab title="Welcome to Figment" active onClose={close} />
  <TabNew onClick={newFile} />
</TabBar>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/tab

## License

MIT
