# @open-figment/tool-button

A canvas tool in the floating toolbar: a 32px tool button, optionally with a 14px caret that opens the tool's group menu.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `ToolButton`.

## Install

```bash
npm install @open-figment/tool-button
```

```bash
pnpm add @open-figment/tool-button
```

```bash
yarn add @open-figment/tool-button
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/tool-button/styles.css';
import { ToolButton } from '@open-figment/tool-button';
import { IconRectangle } from '@open-figment/icons';

<ToolButton icon={<IconRectangle />} label="Rectangle" title="Rectangle  R" active caret onCaretClick={openShapes} />
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/tool-button

## License

MIT
