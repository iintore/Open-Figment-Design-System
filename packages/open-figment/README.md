# @krackedui/open-figment

The [Open Figment design system](https://open-figment-design-system.vercel.app) for React: 31 components, 91 icons and the design tokens. One package: import the whole system, or one component at a time.

Part of [KrackedUI](https://www.npmjs.com/org/krackedui): every KrackedUI design system is one package, `@krackedui/<design-system>`.

## Install

```bash
npm install @krackedui/open-figment
```

```bash
pnpm add @krackedui/open-figment
```

```bash
yarn add @krackedui/open-figment
```

Peer dependencies: `react` and `react-dom` 18 or newer. ES modules, CommonJS and TypeScript types.

## Use the whole system

```tsx
import '@krackedui/open-figment/styles.css'; // once, at the root of your app: tokens, font, every component
import { Button, IconButton, IconPlus } from '@krackedui/open-figment/react';

export function Toolbar() {
  return (
    <>
      <Button variant="primary">Share</Button>
      <IconButton label="Add"><IconPlus /></IconButton>
    </>
  );
}
```

## Use one component

Each component has its own entry point and stylesheet, so you only ship what you use.

```tsx
import '@krackedui/open-figment/tokens.css'; // once per app
import '@krackedui/open-figment/select/styles.css';
import { Select } from '@krackedui/open-figment/select';
```

## Entry points

| Import | What you get |
| --- | --- |
| `@krackedui/open-figment/react` (or the package root) | Every component, icon and token |
| `@krackedui/open-figment/<component>` | One component, e.g. `/button`, `/select`, `/menu` |
| `@krackedui/open-figment/icons` | 91 icons as React components (`IconPlus`, `<Icon name="plus" />`) |
| `@krackedui/open-figment/tokens` | Typed tokens (`tokens`, `cssVar()`) |
| `@krackedui/open-figment/styles.css` | Tokens, the Inter font and all component CSS |
| `@krackedui/open-figment/<component>/styles.css` | One component's CSS (load `tokens.css` once too) |
| `@krackedui/open-figment/tokens.css`, `/base.css`, `/components.css` | Tokens and font; optional page defaults; all component CSS without tokens |
| `@krackedui/open-figment/tokens.json`, `/svg/<name>.svg` | Tokens as JSON; icons as SVG files |

Dark theme: set `data-theme="dark"` on `<html>` (or any container).

## Components

**Actions:** [Button](https://open-figment-design-system.vercel.app/components/button) (`/button`), [IconButton](https://open-figment-design-system.vercel.app/components/icon-button) (`/icon-button`), [ToolButton](https://open-figment-design-system.vercel.app/components/tool-button) (`/tool-button`), [ModeSwitch](https://open-figment-design-system.vercel.app/components/mode-switch) (`/mode-switch`), [ProductPill](https://open-figment-design-system.vercel.app/components/product-pill) (`/product-pill`), [StarButton](https://open-figment-design-system.vercel.app/components/star-button) (`/star-button`)

**Inputs:** [NumberField](https://open-figment-design-system.vercel.app/components/number-field) (`/number-field`), [TextField](https://open-figment-design-system.vercel.app/components/text-field) (`/text-field`), [Select](https://open-figment-design-system.vercel.app/components/select) (`/select`), [SegmentedControl](https://open-figment-design-system.vercel.app/components/segmented-control) (`/segmented-control`), [Checkbox](https://open-figment-design-system.vercel.app/components/checkbox) (`/checkbox`), [SearchField](https://open-figment-design-system.vercel.app/components/search-field) (`/search-field`), [PaintRow](https://open-figment-design-system.vercel.app/components/paint-row) (`/paint-row`)

**Navigation:** [Tab](https://open-figment-design-system.vercel.app/components/tab) (`/tab`), [RailItem](https://open-figment-design-system.vercel.app/components/rail-item) (`/rail-item`), [PageRow](https://open-figment-design-system.vercel.app/components/page-row) (`/page-row`), [LayerRow](https://open-figment-design-system.vercel.app/components/layer-row) (`/layer-row`)

**Overlays:** [Menu](https://open-figment-design-system.vercel.app/components/menu) (`/menu`), [Tooltip](https://open-figment-design-system.vercel.app/components/tooltip) (`/tooltip`), [Toast](https://open-figment-design-system.vercel.app/components/toast) (`/toast`), [Popover](https://open-figment-design-system.vercel.app/components/popover) (`/popover`), [Dialog](https://open-figment-design-system.vercel.app/components/dialog) (`/dialog`), [Drawer](https://open-figment-design-system.vercel.app/components/drawer) (`/drawer`)

**Display:** [Badge](https://open-figment-design-system.vercel.app/components/badge) (`/badge`), [Avatar](https://open-figment-design-system.vercel.app/components/avatar) (`/avatar`), [PropertySection](https://open-figment-design-system.vercel.app/components/property-section) (`/property-section`), [TypeHeader](https://open-figment-design-system.vercel.app/components/type-header) (`/type-header`), [FileCard](https://open-figment-design-system.vercel.app/components/file-card) (`/file-card`), [FileRow](https://open-figment-design-system.vercel.app/components/file-row) (`/file-row`), [ResourceCard](https://open-figment-design-system.vercel.app/components/resource-card) (`/resource-card`), [CodeBlock](https://open-figment-design-system.vercel.app/components/code-block) (`/code-block`)

## License

MIT. Inter is under the SIL Open Font License 1.1.
