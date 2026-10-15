# Logo

The Figment monkey: a flat, friendly mark on a `#FFC531` rounded tile, with no gradients.

## Usage
- **Tile** (`figment-monkey.svg`): app icon, favicon, rail logo button (26px), sample-file thumbnail.
- **Bare** (`figment-monkey-bare.svg`): on coloured or photographic grounds where the tile would clash.
- In code: `<Monkey size={26} />` and `<Monkey tile={false} />` from `src/ui/Monkey.tsx`; `<Logo />` renders the tile.

## Rules
- Keep the mark's colours; don't recolour, outline or add effects.
- Minimum size 16px (favicon); clear space of at least a quarter of its width.
