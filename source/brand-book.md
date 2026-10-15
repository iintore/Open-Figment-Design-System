Open Figment is a dense, quiet design-tool interface: neutral panels around a canvas, one brand blue for action and selection, one purple for components, and small, precise type. The interface should disappear behind the user's work. Use these rules when building or extending any part of the editor, the file browser or the desktop shell.

## Structure of this system

- **Foundations:** colour, type, spacing and sizes, radius, elevation, iconography (this page and the token views).
- **Primitives:** the controls every panel is built from: Button, IconButton, ToolButton, NumberField, Select, SegmentedControl, LayerRow, Menu and the rest. Each card shows every state the code defines; hover, pressed and focus are shown at rest with the `is-hover`, `is-pressed` and `is-focus` classes, which mirror `:hover`, `:active` and `:focus` in `bundle.css`.
- **Blocks:** the panels and screens composed from primitives: TabBar, Toolbar, FilePanel, PropertiesPanel, ColorPicker, VariablesView, HomeScreen and others, rendered from the app's real markup.

Build from the bottom up: a new panel is a stack of **PropertySection**s made of primitives; a new screen is blocks around the canvas. Never restyle a primitive inside one block.

## Content fundamentals

The voice is a capable colleague: short, literal and calm. It names things the way the user sees them on screen.

- **Sentence case everywhere:** *Add auto layout*, *Show in exports*, *Save local copy…*. Proper nouns keep their capitals (*Dev Mode*, *Figment*).
- **Commands are verbs:** *Share*, *Export Home*, *Restore*, *Create component*. Menu items that open a dialog end with an ellipsis: *Open file…*, *Quick actions…*.
- **Confirmations are past tense and specific:** *Copied as PNG*, *Saved to version history*, *Version restored*.
- **Errors say what happened and what to do:** *Couldn’t save changes. Free up disk space and keep this tab open.* No apologies, no exclamation marks, no blame.
- **Empty states explain and offer the next step:** *No variables created in this file* / *Variables store reusable values like colors, numbers and text. Color variables appear in the color picker.* with a *Create* button.
- **Tooltips and titles** give the name and the shortcut: *Rectangle  R*, *Create component (⌥⌘K)*.
- **Address the user as "you"** and the product in the third person only when needed: *Files are stored locally in this browser.*
- **No emoji** in interface copy. The comment popover's text glyphs (✓ 🗑 ✕ ↑) are the one exception in the code; new UI uses the icon set.
- Use real units: *393 × 852*, *100 %*, *0°*. Multiplication sign, not the letter x, in sizes.

## Visual foundations

### Colour
Two themes, **Light** and **Dark**, from the same token names. Switch by setting `data-theme="dark"` on the root.

- **Surfaces:** `color-bg` for panels, toolbar and dialogs; `color-bg-secondary` for recessed areas (tab bar, home sidebar, field fills); `color-bg-canvas` behind frames. Hover and pressed fills are `color-bg-hover` and `color-bg-pressed`.
- **Text:** `color-text` for values and names; `color-text-secondary` for labels and section titles; `color-text-tertiary` only for placeholders and disabled text.
- **Brand blue** (`color-bg-brand`, text `color-text-brand`) means *act* or *selected*: the primary button, the active tool, the canvas selection, focus rings (`color-border-selected`) and selected rows (`color-bg-selected`). Don't use it for decoration.
- **Purple** (`color-bg-component`, `color-text-component`, `color-bg-component-selected`) means *component or instance*, and nothing else.
- **Red** (`color-bg-danger`, `color-text-danger`) is for destructive actions and errors only.
- **Menus and tooltips are always dark** (`color-bg-menu`, `color-bg-tooltip`) in both themes, with `color-text-menu`.
- **Dev Mode** is the one green: `#14ae5c`, a literal in the code, used only on the active Dev Mode switch.
- The canvas overlay draws selection in `#0D99FF` (brand), components in `#9747FF` and measurements in `#F24822`, the light-theme values of `color-bg-brand`, `color-bg-component` and `color-bg-danger`.

### Typography
One family, **Inter** (variable, bundled), at UI sizes; **Roboto Mono** for code. Weights are 450 (regular) and 550 (strong), never bold 700 in the UI.

- `body-medium` (11/16, 450) is the default for everything in panels: values, layer names, menu items.
- `body-medium-strong` (11/16, 550) for section titles, selected or top-level names and button labels.
- `body-large` / `body-large-strong` (13/22) for longer copy: dialogs, toasts, the home screen, the agents panel.
- `heading-small` (13/22), `heading-medium` (15/25) and `heading-large` (24/32) for panel, page and empty-state headings.
- `code` (Roboto Mono 11) for generated CSS and SVG.
- Body styles carry a 0.055px letter spacing. Don't set sizes outside this scale.

### Space and size
The interface is built on fixed control sizes, not a free spacing scale:

- Controls are `control-h` (24px) high; rows (layers, pages, paints) are `row-h` (32px); section headers 40px; the tab bar `tabbar-h` (40px).
- Panels are `panel-w` (241px) wide; the rail is `rail-w` (52px).
- Gaps: `space-8` between paired fields and toolbar groups; `space-4` between an icon and its label; `space-2` between tabs and segments; `space-16` for panel side padding.
- Pair related numeric fields side by side (X / Y, W / H) in an 8px-gap two-column grid.

### Radius
`radius` (5px) is the default for every control. `radius-3` for swatches, `radius-4` for badges and small parts, `radius-6` for tabs and tools, `radius-8` for file cards, `radius-13` for floating surfaces (toolbar, menus, popovers, dialogs), `radius-round` for avatars and pins.

### Borders, elevation and layering
- Panels and sections are separated by 1px `color-border` hairlines, never by shadows.
- Only floating surfaces cast shadows: `shadow-elevation` for menus, popovers, dialogs and hovered cards; `shadow-toolbar` for the toolbar.
- Selection and focus use a 1px (fields) or 2px (cards, drop targets) `color-border-selected` outline.

### States
Every interactive primitive defines the same set where it applies: **default**, **hover** (`color-bg-hover` fill), **pressed/active** (`color-bg-pressed`, or brand fill for the current tool), **selected** (`color-bg-selected`), **focus** (`color-border-selected` outline), **disabled** (35–40% opacity, no hover) and **mixed** (empty value with the placeholder *Mixed*).

### Motion
Motion is minimal and functional. Hover fills, menus, tooltips and popovers change instantly. The only UI transitions are the layer disclosure caret rotating (`transform 0.1s`), collaborators' cursors gliding between updates (`transform 60ms linear`) and the blue hotspot flash when you click a non-interactive spot while presenting (0.5s ease-out fade). Prototype transitions (dissolve, move in, push, slide) belong to the user's content, not the UI.

### Layout
The editor is a fixed frame around the canvas: TabBar on top, NavigationRail and left dock on the left, PropertiesPanel on the right, the Toolbar floating at the bottom centre. The home screen is a sidebar plus a scrolling main column. Panels scroll internally; their headers stay put.

## Iconography

The icon set is the app's own outline set (`src/ui/icons.tsx`): 24 × 24 viewBox, 1px strokes with round caps and joins, glyphs drawn within roughly 5.5–18.5 so they sit centred in 24px buttons. Icons inherit `currentColor`, so they take `color-icon`, `color-icon-secondary` or `color-text-brand` from their control. The SVG files under **Assets → Icons** are exported with a `#1e1e1e` ink for use outside the app. Filled glyphs are used only for the move cursor, the filled star and small dots. Never mix in another icon family.

The logo is the monkey mark (`Monkey` in `src/ui/Monkey.tsx`): a flat drawing on a `#FFC531` rounded tile, with no gradients. Use the tiled version as the app icon and in the rail; use the bare version on coloured or photographic grounds.

## Accessibility

- Every icon-only control needs an accessible name (`aria-label` or `title`); toolbar buttons expose `aria-pressed`; menus use `role="menu"` and `menuitem` / `menuitemcheckbox` and work with the arrow keys, Enter and Escape.
- Measured contrast of the source palette: `color-text` passes everywhere (≥ 11.7:1). `color-text-secondary` is 4.0:1 on `color-bg` in light (7.6:1 dark); white on `color-bg-brand` is 3.0:1 in light (3.5:1 dark); `color-text-brand` is 4.2:1 in light. These are the code's values and are kept exactly; keep text in those pairs short and at weight 550, and never rely on `color-text-tertiary` (2.1:1) to carry meaning.
- Shortcut labels follow the platform: ⌘ ⌥ ⇧ ⌃ on macOS, *Ctrl+*, *Alt+*, *Shift+* elsewhere, all from `SHORTCUTS` in `src/editor/keys.ts`.

## Using this system in code

Load `tokens.css`, then `components/bundle.css`; set `data-theme` on the root. Build markup with the class names shown in each component's card (`btn primary`, `field`, `layer-row selected`…). In the Open Figment codebase, use the React components named in each card (`NumberField`, `Select`, `Seg`, `Section`, `PaintRow`…) rather than raw markup.
