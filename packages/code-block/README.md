# @open-figment/code-block

Monospace code in Dev Mode: generated CSS and SVG for the selection, selectable for copying.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `CodeBlock`.

## Install

```bash
npm install @open-figment/code-block
```

```bash
pnpm add @open-figment/code-block
```

```bash
yarn add @open-figment/code-block
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/code-block/styles.css';
import { CodeBlock } from '@open-figment/code-block';

<CodeBlock>{'width: 393px;\nheight: 852px;'}</CodeBlock>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/code-block

## License

MIT
