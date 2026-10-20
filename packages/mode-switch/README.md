# @open-figment/mode-switch

The four-way switch at the right end of the toolbar that changes the editor mode: Draw, Design, Motion and Dev Mode.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `ModeSwitch`.

## Install

```bash
npm install @open-figment/mode-switch @open-figment/icons
```

```bash
pnpm add @open-figment/mode-switch @open-figment/icons
```

```bash
yarn add @open-figment/mode-switch @open-figment/icons
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/mode-switch/styles.css';
import { ModeSwitch } from '@open-figment/mode-switch';
import { IconMove, IconCode } from '@open-figment/icons';

<ModeSwitch
  value={mode}
  onChange={setMode}
  options={[
    { value: 'design', label: 'Design mode', icon: <IconMove /> },
    { value: 'dev', label: 'Dev Mode', icon: <IconCode />, tone: 'dev' },
  ]}
/>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/mode-switch

## License

MIT
