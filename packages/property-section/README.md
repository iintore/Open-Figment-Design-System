# @open-figment/property-section

A titled group in the properties panel (Position, Layout, Appearance, Fill, Stroke, Effects, Export) with optional header actions.

Part of the [Open Figment design system](https://open-figment-design-system.vercel.app). Exports: `PropertySection`, `Sublabel`, `PropertyGrid`.

## Install

```bash
npm install @open-figment/property-section
```

```bash
pnpm add @open-figment/property-section
```

```bash
yarn add @open-figment/property-section
```

## Use

```tsx
import '@open-figment/tokens/tokens.css'; // once per app
import '@open-figment/property-section/styles.css';
import { PropertySection, Sublabel, PropertyGrid } from '@open-figment/property-section';

<PropertySection title="Position">
  <Sublabel>Position</Sublabel>
  <PropertyGrid>…</PropertyGrid>
</PropertySection>
```

Every prop is typed and documented in the editor. Full reference, states and rules: https://open-figment-design-system.vercel.app/components/property-section

## License

MIT
