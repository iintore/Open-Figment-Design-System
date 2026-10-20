# @open-figment/react

The whole [Open Figment design system](https://open-figment-design-system.vercel.app) for React: 31 components, 91 icons and the design tokens, with one stylesheet. Want a single component instead? Every one is also published on its own (`@open-figment/button`, `@open-figment/select`, …).

## Install

```bash
npm install @open-figment/react
```

```bash
pnpm add @open-figment/react
```

```bash
yarn add @open-figment/react
```

Peer dependencies: `react` and `react-dom` 18 or newer.

## Use

```tsx
import '@open-figment/react/styles.css'; // once, at the root of your app
import { Button, IconButton, IconPlus } from '@open-figment/react';

export function Toolbar() {
  return (
    <>
      <Button variant="primary">Share</Button>
      <IconButton label="Add"><IconPlus /></IconButton>
    </>
  );
}
```

Dark theme: set `data-theme="dark"` on `<html>`.

## Components

**Actions:** [Button](https://open-figment-design-system.vercel.app/components/button), [IconButton](https://open-figment-design-system.vercel.app/components/icon-button), [ToolButton](https://open-figment-design-system.vercel.app/components/tool-button), [ModeSwitch](https://open-figment-design-system.vercel.app/components/mode-switch), [ProductPill](https://open-figment-design-system.vercel.app/components/product-pill), [StarButton](https://open-figment-design-system.vercel.app/components/star-button)

**Inputs:** [NumberField](https://open-figment-design-system.vercel.app/components/number-field), [TextField](https://open-figment-design-system.vercel.app/components/text-field), [Select](https://open-figment-design-system.vercel.app/components/select), [SegmentedControl](https://open-figment-design-system.vercel.app/components/segmented-control), [Checkbox](https://open-figment-design-system.vercel.app/components/checkbox), [SearchField](https://open-figment-design-system.vercel.app/components/search-field), [PaintRow](https://open-figment-design-system.vercel.app/components/paint-row)

**Navigation:** [Tab](https://open-figment-design-system.vercel.app/components/tab), [RailItem](https://open-figment-design-system.vercel.app/components/rail-item), [PageRow](https://open-figment-design-system.vercel.app/components/page-row), [LayerRow](https://open-figment-design-system.vercel.app/components/layer-row)

**Overlays:** [Menu](https://open-figment-design-system.vercel.app/components/menu), [Tooltip](https://open-figment-design-system.vercel.app/components/tooltip), [Toast](https://open-figment-design-system.vercel.app/components/toast), [Popover](https://open-figment-design-system.vercel.app/components/popover), [Dialog](https://open-figment-design-system.vercel.app/components/dialog), [Drawer](https://open-figment-design-system.vercel.app/components/drawer)

**Display:** [Badge](https://open-figment-design-system.vercel.app/components/badge), [Avatar](https://open-figment-design-system.vercel.app/components/avatar), [PropertySection](https://open-figment-design-system.vercel.app/components/property-section), [TypeHeader](https://open-figment-design-system.vercel.app/components/type-header), [FileCard](https://open-figment-design-system.vercel.app/components/file-card), [FileRow](https://open-figment-design-system.vercel.app/components/file-row), [ResourceCard](https://open-figment-design-system.vercel.app/components/resource-card), [CodeBlock](https://open-figment-design-system.vercel.app/components/code-block)

## License

MIT. Inter is under the SIL Open Font License 1.1.
