# @open-figment/segmented-control

A row of 24px icon segments for choosing one of a few options: alignment, layout flow, text alignment, grid / list view.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `SegmentedControl`.

## Install

```bash
npm install @open-figment/segmented-control @open-figment/icons
```

```bash
pnpm add @open-figment/segmented-control @open-figment/icons
```

```bash
yarn add @open-figment/segmented-control @open-figment/icons
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/segmented-control/styles.css';
import { SegmentedControl } from '@open-figment/segmented-control';
import { IconGrid, IconList } from '@open-figment/icons';

<SegmentedControl
  value={view}
  onChange={setView}
  options={[
    { value: 'grid', icon: <IconGrid />, title: 'Grid view' },
    { value: 'list', icon: <IconList />, title: 'List view' },
  ]}
/>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/segmented-control

## License

MIT
