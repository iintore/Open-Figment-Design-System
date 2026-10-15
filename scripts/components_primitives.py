from lib import cap, cap_parts, icon, root_class, cell, stage, strip_style

C = []  # (name, group, height, preview_html, readme, extra-marker)


def add(name, group, height, preview, readme, subtitle=''):
    C.append({'name': name, 'group': group, 'height': height, 'preview': preview, 'readme': readme, 'subtitle': subtitle})


# =====================================================================================
# Actions
# =====================================================================================
btn = lambda cls, label, extra='': f'<button class="btn {cls}"{extra}>{label}</button>'
add('Button', 'Actions', 200, stage(
    cell('Primary', btn('primary', 'Share')),
    cell('Primary · hover', btn('primary is-hover', 'Share')),
    cell('Secondary', btn('secondary', 'Restore')),
    cell('Secondary · hover', btn('secondary is-hover', 'Restore')),
    cell('Ghost', btn('ghost', 'Copy CSS')),
    cell('Ghost · hover', btn('ghost is-hover', 'Copy CSS')),
    cell('Ghost danger', btn('ghost danger', 'Delete')),
    cell('With icon', f'<button class="btn primary">{icon("plus")} Create</button>'),
    cell('Large', btn('primary large', 'Get started')),
    cell('Full width (export)', '<div style="width:208px"><button class="btn secondary" style="width:100%;justify-content:center">Export Home</button></div>'),
), '''# Button

Text buttons trigger a command: share, present, export, create, restore, delete.

## When to use
- **Primary** (`btn primary`): the one main action of a surface: *Share* in the properties header, *Present* in the prototype panel, *Create* in an empty Variables view. At most one per surface.
- **Secondary** (`btn secondary`): a real action that isn't the main one: *Export Home*, *Restore* a version, library actions.
- **Ghost** (`btn ghost`): low-emphasis actions inside panels: *Copy CSS*, *Copy SVG*, *Go to main component*, *Create variable*.
- **Danger** (`btn ghost danger`): destructive actions, always ghost: *Delete* a version. Ask for confirmation first.
- For icon-only actions use **IconButton**; for tools on the canvas use **ToolButton**.

## Anatomy
A 24px-high inline-flex row: optional 24px icon, then a label in `body-medium-strong`, 4px gap, 8px side padding, `radius` corners. `large` makes it 32px high with 12px padding.

## Properties (classes)
| Class | Effect |
| --- | --- |
| `btn` | Base: 24px high, label in `body-medium-strong` |
| `primary` | `color-bg-brand` fill, white label |
| `secondary` | 1px inset outline in `color-border` |
| `ghost` | No fill until hover |
| `danger` | Label in `color-text-danger` (combine with `ghost`) |
| `large` | 32px high, 12px padding |

## States
| State | Look |
| --- | --- |
| Default | As above |
| Hover | Primary → `color-bg-brand-hover`; secondary and ghost → `color-bg-hover` fill |
| Focus | Browser focus ring (keyboard only) |

## Rules
- Label with a verb that says what happens: *Share*, *Export Home*, *Restore*. Not *OK* or *Submit*.
- White text on `color-bg-brand` is 3.0:1 in light theme (below AA for small text); keep primary labels to one or two words.
- Full-width buttons (export) set `width: 100%` and centre their label.
''')

add('IconButton', 'Actions', 150, stage(
    cell('Default', f'<button class="icon-btn" title="Add">{icon("plus")}</button>'),
    cell('Hover', f'<button class="icon-btn is-hover" title="Add">{icon("plus")}</button>'),
    cell('Active', f'<button class="icon-btn active" title="Constrain proportions">{icon("link")}</button>'),
    cell('Disabled', f'<button class="icon-btn" disabled title="Distribute">{icon("distribute")}</button>'),
    cell('Small (layer actions)', f'<button class="icon-btn sm" title="Lock">{icon("lock")}</button>'),
    cell('In a section header', cap('section-header').replace('class="section-header"', 'class="section-header ds-w-panel"')),
), '''# IconButton

A 24px square button holding one 24px icon, used for every icon-only action in panels and headers.

## When to use
Section actions (*Add new page*, *Add fill*, *Remove*), header actions (*Inspect in Dev Mode*, *Create component*), toggles (*Hide*, *Lock*, *Constrain proportions*). Always give it a `title` (shown as the native tooltip) that names the action and its shortcut, e.g. `Create component (⌥⌘K)`.

## Properties (classes and attributes)
| Class / attribute | Effect |
| --- | --- |
| `icon-btn` | 24 × 24, `radius`, icon in `color-icon` |
| `active` | On state of a toggle: `color-bg-selected` fill, icon in `color-text-brand` |
| `sm` | 20 × 20, for actions inside 32px rows (layer lock/hide) |
| `disabled` | 35% opacity, no hover |
| `title` | Required: the accessible name and tooltip |

## States
Default · Hover (`color-bg-hover` fill) · Active · Disabled.

## Rules
- Use the icon from the Icons set that matches the command; don't mix icon sizes.
- A toggle (hide/show, lock/unlock) swaps both its icon and its title (*Hide* ↔ *Show*).
''')

tool = cap('tool')
tool_shape = cap('tool-shape')
add('ToolButton', 'Actions', 170, stage(
    cell('Active', tool),
    cell('Default', tool_shape),
    cell('Hover', tool_shape.replace('class="tool-main"', 'class="tool-main is-hover"')),
    cell('Caret hover', tool_shape.replace('class="tool-caret"', 'class="tool-caret is-hover"')),
    cell('Without caret', f'<div class="tool"><button class="tool-main" aria-label="Comment">{icon("comment")}</button></div>'),
    cell('With tooltip', '<div style="display:flex;flex-direction:column;align-items:center;gap:6px">' + strip_style(strip_style(strip_style(cap('tooltip'), 'left'), 'top'), 'transform') + tool_shape + '</div>'),
), '''# ToolButton

A canvas tool in the floating toolbar: a 32px tool button, optionally with a 14px caret that opens the tool's group menu.

## When to use
Only inside the **Toolbar**. Each group (Move, Frame, Shapes, Pen, Text) is one ToolButton showing its last-used tool; the caret lists the rest of the group with their shortcuts. Comment and Insert are single buttons with no caret.

## Anatomy
`div.tool` › `button.tool-main` (32 × 32, `radius-6`, icon) + optional `button.tool-caret` (14 × 32, chevron in `color-icon-secondary`).

## Properties
| Class / attribute | Effect |
| --- | --- |
| `tool` | Group container |
| `active` (on `tool`) | Current tool: main button filled `color-bg-brand`, white icon |
| `aria-label` | The tool's name (*Rectangle*) |
| `aria-pressed` | `true` for the current tool |
| `aria-haspopup="menu"` (caret) | The caret opens a menu |

## States
Default · Hover (`color-bg-hover`) · Active · Caret hover.

## Behaviour
- Hovering shows a **Tooltip** above the button with the tool name and shortcut, e.g. *Rectangle  R*.
- Choosing a tool from the caret menu makes it the group's visible tool.
''')

add('ModeSwitch', 'Actions', 130, stage(
    cell('Design mode', cap('mode-switch')),
    cell('Draw mode', cap('mode-switch').replace('class="" aria-label="Draw mode" aria-pressed="false"', 'class="on" aria-label="Draw mode" aria-pressed="true"', 1).replace('class="on" aria-label="Design mode" aria-pressed="true"', 'class="" aria-label="Design mode" aria-pressed="false"')),
    cell('Dev Mode', cap('mode-switch').replace('class="on" aria-label="Design mode" aria-pressed="true"', 'class="" aria-label="Design mode" aria-pressed="false"').replace('class="" aria-label="Dev Mode" aria-pressed="false"', 'class="on dev" aria-label="Dev Mode" aria-pressed="true"')),
), '''# ModeSwitch

The four-way switch at the right end of the toolbar that changes the editor mode: Draw, Design, Motion and Dev Mode.

## Anatomy
A `color-bg-secondary` track (`radius-8`, 2px padding) holding four icon buttons.

## States
| State | Look |
| --- | --- |
| Off | Icon in `color-icon-secondary` |
| On (`on`) | `color-bg` chip with a hairline and small shadow, icon in `color-text-brand` |
| Dev Mode on (`on dev`) | Green chip (`#14ae5c`, a literal in the code) with a white icon |
| Disabled (`disabled`) | Motion: not available in this build; still shows a tooltip explaining why |

## Rules
- Exactly one of Draw / Design is on; Dev Mode overrides both while it is on.
- Every button needs an `aria-label` and `aria-pressed`; the disabled one uses `aria-disabled`.
''')

add('ProductPill', 'Actions', 110, stage(
    cell('Default', cap_parts('product-pills')[0]),
    cell('Hover', root_class(cap_parts('product-pills')[0], 'is-hover')),
    cell('Group', '<div style="display:flex;gap:8px">' + ''.join(cap_parts('product-pills')) + '</div>'),
), '''# ProductPill

A 32px pill button on the home screen for starting work: *Design* (new file), *Import*, *More*.

## Anatomy
Pill (`radius` 16px) with a 1px `color-border` outline, a 20px coloured product chip, and a label in `body-large`.

## Rules
- Lives only in the home screen's top bar, right-aligned, as one group.
- The last pill (*More*) opens a menu (sample file, blank file) and has no product chip.
''')

star_card = cap('file-card')
add('StarButton', 'Actions', 120, stage(
    cell('Off (shows on card hover)', f'<button class="star-btn" style="display:grid;position:static" title="Add to starred">{icon("star")}</button>'),
    cell('On', f'<button class="star-btn on" style="position:static" title="Remove from starred">{icon("starFill")}</button>'),
), '''# StarButton

The star toggle in the corner of a file card that adds a file to *Starred*.

## States
- **Off**: hidden until the card is hovered; outline star.
- **On** (`on`): always visible; filled star.
- The title flips between *Add to starred* and *Remove from starred*.
''')

# =====================================================================================
# Inputs
# =====================================================================================
field = cap('field')
add('NumberField', 'Inputs', 190, stage(
    cell('Label', field),
    cell('Hover', root_class(field, 'is-hover')),
    cell('Focus', root_class(field, 'is-focus')),
    cell('Icon label', f'<label class="field" style="width:88px"><span class="field-label">{icon("rotate")}</span><input value="0°"></label>'),
    cell('Suffix', '<label class="field" style="width:88px"><span class="field-label">W</span><input value="393"></label>'),
    cell('Percent (no label)', '<div style="width:64px"><label class="field no-label pct-inline"><input value="100"><span class="suffix">%</span></label></div>'),
    cell('Mixed', '<label class="field" style="width:88px"><span class="field-label">X</span><input placeholder="Mixed" value=""></label>'),
    cell('Pair (X / Y)', '<div style="display:flex;gap:8px;width:184px">' + field + field.replace('>X<', '>Y<').replace('value="493"', 'value="0"') + '</div>'),
), '''# NumberField

A 24px field for a numeric property (position, size, rotation, spacing, opacity) whose label can be dragged to scrub the value.

## When to use
Every numeric property in the properties panel. Pair related values side by side with an 8px gap (X / Y, W / H). For a fixed list of options use **Select** or **SegmentedControl**.

## Properties (from `NumberField` in `src/ui/controls.tsx`)
| Prop | Type | Notes |
| --- | --- | --- |
| `value` | `number \\| 'mixed'` | `'mixed'` shows an empty field with the placeholder *Mixed* |
| `onChange` | `(v: number) => void` | Called with the new value |
| `label` | text or icon | Scrub handle: drag left/right to change the value (Shift = ×10) |
| `suffix` | string | Unit shown after the value (`%`, `°`) |
| `min`, `max`, `step`, `decimals` | number | Clamping, arrow-key step and display rounding |
| `scale` | number | Display multiplier (100 for percentages) |

## Behaviour
- Accepts maths: `100/2`, `24+8`, and relative input (`+10`, `*2`) applied to the current value.
- ↑ / ↓ change by `step` (×10 with Shift); Enter commits; Escape reverts.
- A scrub or an arrow-key change is a single undo step.

## States
Default · Hover · Focus (1px inset `color-border-selected`) · Mixed.

## Tokens
Fill `color-bg-secondary`, value `body-medium` in `color-text`, label `color-text-secondary`, `radius`.
''')

add('TextField', 'Inputs', 110, stage(
    cell('Default', '<div style="width:208px"><label class="field no-label"><input placeholder="Add a description" value=""></label></div>'),
    cell('Filled', '<div style="width:208px"><label class="field no-label"><input value="Primary button"></label></div>'),
    cell('Focus', '<div style="width:208px"><label class="field no-label is-focus"><input value="Primary button"></label></div>'),
), '''# TextField

A single-line text field in the properties panel style, committed on blur or Enter.

## Properties (`TextField` in `src/ui/controls.tsx`)
| Prop | Type |
| --- | --- |
| `value` | string |
| `onChange` | `(v: string) => void`, called only when the text changed |
| `placeholder`, `className` | optional |

## Behaviour
The draft is local while typing; it follows the value again when the selection changes. Enter blurs and commits.
''')

sel = cap('select-btn').replace('class="select-btn "', 'class="select-btn"')
add('Select', 'Inputs', 230, stage(
    cell('Default', f'<div style="width:120px">{sel}</div>'),
    cell('Hover', f'<div style="width:120px">{root_class(sel, "is-hover")}</div>'),
    cell('Mixed', f'<div style="width:120px">{sel.replace("Hug contents", "Mixed")}</div>'),
    cell('Open', f'<div style="width:200px">{cap("menu-select")}</div>'),
), '''# Select

A dropdown for choosing one option from a list (font family, sizing, blend mode, export format). It opens a **Menu** with a check next to the current option.

## Properties (`Select<T>` in `src/ui/controls.tsx`)
| Prop | Type | Notes |
| --- | --- | --- |
| `value` | `T \\| 'mixed'` | Shows *Mixed* when the selection disagrees |
| `options` | `{ value, label, separatorBefore? }[]` | `separatorBefore` draws a menu separator |
| `onChange` | `(v: T) => void` | |
| `title` | string | Tooltip / accessible name when the label alone is unclear |

## Anatomy
Full-width 24px row on `color-bg-secondary`: current label (truncates) and a chevron.

## States
Default · Hover · Open (menu) · Mixed.
''')

seg = cap('seg')
add('SegmentedControl', 'Inputs', 120, stage(
    cell('None selected', f'<div style="width:88px">{seg}</div>'),
    cell('One on', '<div style="width:88px">' + seg.replace('<button title=', '<button class="on" title=', 1) + '</div>'),
    cell('Hover', '<div style="width:88px">' + seg.replace('<button title=', '<button class="is-hover" title=', 1) + '</div>'),
    cell('Home layout', cap('home-seg')),
), '''# SegmentedControl

A row of 24px icon segments for choosing one of a few options: alignment, layout flow, text alignment, grid / list view.

## Properties (`Seg<T>` in `src/ui/controls.tsx`)
| Prop | Type | Notes |
| --- | --- | --- |
| `value` | `T \\| null` | `null` when no option applies (e.g. mixed selection) |
| `options` | `{ value, icon, title }[]` | Every segment needs a `title` (*Align left (⌥A)*) |
| `onChange` | `(v: T) => void` | |

## States
Off (icon `color-icon-secondary`) · Hover · On (`on`: `color-bg` chip, hairline, icon `color-icon`).

## Rules
Use for 2–5 options that are easier to recognise by icon than by name. For longer lists use **Select**.
''')

add('Checkbox', 'Inputs', 100, stage(
    cell('Checked', f'<div class="ds-w-panel">{cap("checkbox-row")}</div>'),
    cell('Unchecked', '<div class="ds-w-panel">' + cap('checkbox-row').replace(' checked=""', '') + '</div>'),
), '''# Checkbox

A labelled native checkbox in a 32px row, for on/off properties: *Clip content*, *Show in exports*.

## Rules
- The whole row is the label, so clicking the text toggles it.
- Use for properties of the selection. For view settings in menus use a checked **Menu** item instead.
''')

add('SearchField', 'Inputs', 110, stage(
    cell('Empty', f'<div class="ds-w-panel">{strip_style(cap("search"), "margin")}</div>'),
    cell('Focus', '<div class="ds-w-panel">' + root_class(strip_style(cap('search'), 'margin'), 'is-focus').replace('value=""', 'value="butt"') + '</div>'),
), '''# SearchField

A 32px search box with a leading search icon, used to filter files, layers, assets, tools and variables.

## Anatomy
`color-bg-secondary` fill, `radius`, search icon in `color-icon-secondary`, input in `body-medium`. Placeholder names what is searched: *Search*, *Search assets*, *Search tools*.

## Behaviour
Filters as you type; it never needs a submit button. Escape clears focus.
''')

pr = cap('paint-row')
add('PaintRow', 'Inputs', 190, stage(
    cell('Solid fill', f'<div class="ds-w-panel">{pr}</div>'),
    cell('Hover', '<div class="ds-w-panel">' + pr.replace('class="paint-field"', 'class="paint-field is-hover"') + '</div>'),
    cell('Hidden paint', f'<div class="ds-w-panel">{root_class(pr, "hidden-paint")}</div>'),
    cell('Brand colour', f'<div class="ds-w-panel">{pr.replace("rgb(255, 255, 255)", "rgb(13, 153, 255)").replace("FFFFFF", "0D99FF")}</div>'),
), '''# PaintRow

One fill or stroke paint: a swatch that opens the **ColorPicker**, the hex value, opacity, and hide / remove actions.

## Properties (`PaintRow` in `src/ui/PaintList.tsx`)
| Prop | Type | Notes |
| --- | --- | --- |
| `paint` | `Paint` | Solid, gradient (linear, radial, angular) or image |
| `onChange` | `(p: Paint) => void` | |
| `onRemove` | `() => void` | Shows the remove button |
| `allowImage` | boolean | Lets the picker switch to an image fill |
| `hideToggle` | boolean | Hides the visibility toggle |

## Anatomy
32px row: `paint-field` (swatch 16px with checkerboard, hex input, % field) then two **IconButton**s.

## States
Default · Hover (field fill) · Hidden (`hidden-paint`: dimmed, eye-off icon).

## Rules
- Lists show the top-most paint first (the reverse of the stored order).
- Hex accepts 3- or 6-digit values with or without `#`.
''')

# =====================================================================================
# Navigation
# =====================================================================================
tabbar = cap('tabbar')
add('Tab', 'Navigation', 120, stage(
    cell('Active', '<div class="tabbar" style="width:260px;border:0">' + tabbar.split('<div class="tab active">')[1].split('<button class="tab-new"')[0].join(['<div class="tab active">', '']) + '</div>'),
    cell('Inactive', '<div class="tabbar" style="width:260px;border:0"><div class="tab">' + icon('file') + '<span class="tab-title">Brand refresh</span><button class="tab-close" title="Close tab">' + icon('close') + '</button></div></div>'),
    cell('Hover', '<div class="tabbar" style="width:260px;border:0"><div class="tab is-hover">' + icon('file') + '<span class="tab-title">Brand refresh</span><button class="tab-close" title="Close tab">' + icon('close') + '</button></div></div>'),
    cell('Home and new', '<div class="tabbar" style="width:120px;border:0"><button class="tab tab-home" title="Home">' + icon('home') + '</button><button class="tab-new" title="New design file">' + icon('plus') + '</button></div>'),
), '''# Tab

A file tab in the desktop tab bar: file icon, name and a close button.

## States
| State | Look |
| --- | --- |
| Inactive | Text `color-text-secondary`, close button hidden |
| Hover | `color-bg-hover` fill, close button shows |
| Active (`active`) | `color-bg` chip with hairline and shadow, text `color-text`, close button visible |

## Rules
- Max 220px wide; the name truncates with an ellipsis.
- The home tab and the new-file button are icon-only tabs at the start of the bar.
- In the desktop app the bar is the window drag region; tabs and buttons are excluded from it.
''')

add('RailItem', 'Navigation', 140, stage(
    cell('Default', '<div class="rail" style="height:auto;border:0;padding:0"><button class="rail-item" title="Assets  ⌥2"><span class="rail-icon">' + icon('assets') + '</span><span class="rail-label">Assets</span></button></div>'),
    cell('Hover', '<div class="rail" style="height:auto;border:0;padding:0"><button class="rail-item is-hover" title="Assets  ⌥2"><span class="rail-icon">' + icon('assets') + '</span><span class="rail-label">Assets</span></button></div>'),
    cell('Active', '<div class="rail" style="height:auto;border:0;padding:0"><button class="rail-item active" title="File  ⌥1"><span class="rail-icon">' + icon('file') + '</span><span class="rail-label">File</span></button></div>'),
), '''# RailItem

One destination in the navigation rail: a 32px icon tile with a label underneath (*File*, *Agents*, *Assets*, *Tools*, *Variables*).

## States
Default (icon `color-icon-secondary`) · Hover (tile `color-bg-hover`) · Active (tile `color-bg-selected`, icon and label `color-text-brand`).

## Behaviour
Clicking the active item collapses the left panel; clicking another switches panels. Shortcuts: ⌥1 File, ⌥2 Assets, ⌥3 Tools, ⌘↵ Agents.
''')

pages = cap_parts('page-rows')
add('PageRow', 'Navigation', 130, stage(
    cell('Current page', f'<div class="ds-w-panel">{pages[0]}</div>'),
    cell('Default', f'<div class="ds-w-panel">{pages[1]}</div>'),
    cell('Hover', f'<div class="ds-w-panel">{root_class(pages[1], "is-hover")}</div>'),
), '''# PageRow

One page in the Pages list of the File panel.

## States
Default · Hover · Current (`active`: `color-bg-secondary` fill, name in `body-medium-strong`).

## Behaviour
Click switches page; double-click renames inline; the context menu offers rename, duplicate and delete (delete is disabled for the last page).
''')

rows = cap_parts('layer-rows')
sel_row, row = rows[0], rows[1]
inst_row = cap('layer-row-instance')
add('LayerRow', 'Navigation', 330, stage(
    cell('Default', f'<div class="ds-w-panel">{row}</div>'),
    cell('Hover', f'<div class="ds-w-panel">{root_class(row, "is-hover")}</div>'),
    cell('Selected', f'<div class="ds-w-panel">{sel_row}</div>'),
    cell('Child of selected', f'<div class="ds-w-panel">{root_class(row, "selected-child", "top").replace("padding-left: 8px; --indent: 8px;", "padding-left: 24px; --indent: 24px;")}</div>'),
    cell('Instance (selected)', f'<div class="ds-w-panel">{inst_row}</div>'),
    cell('Hidden', f'<div class="ds-w-panel">{root_class(row, "hidden-layer")}</div>'),
    cell('Drop inside', f'<div class="ds-w-panel">{root_class(row, "drop-inside")}</div>'),
    cell('Drop before', f'<div class="ds-w-panel" style="padding-top:4px">{root_class(row, "drop-before")}</div>'),
), '''# LayerRow

One layer in the layers tree: disclosure caret, type icon, name, and lock / hide actions.

## Anatomy
32px row, indented 16px per depth level (`--indent`), `radius` corners; caret (containers only), 16px type icon (frame, group, component, text, shape…), name in `body-medium` (`body-medium-strong` for top-level frames), actions on hover.

## States
| State | Class | Look |
| --- | --- | --- |
| Default | | |
| Hover | | `color-bg-hover` fill; lock and hide actions appear |
| Selected | `selected` | `color-bg-selected` fill |
| Child of selected | `selected-child` | `color-bg-selected-secondary`, square corners so a selected subtree reads as one block |
| Component / instance | `component` | Icon and name in `color-text-component`; selected fill `color-bg-component-selected` |
| Hidden | `hidden-layer` | Icon in `color-icon-tertiary`; the eye-off action stays pinned |
| Locked | | Lock action stays pinned |
| Drag target | `drop-before` / `drop-after` / `drop-inside` | 2px `color-border-selected` line or inset outline |

## Behaviour
Click selects (Shift adds); double-click renames; drag reorders or reparents; the caret expands. Selecting a layer on the canvas expands its ancestors so the row is visible. Drops that would put a component inside itself, or edit an instance's copied layers, are refused.
''')

# =====================================================================================
# Feedback & overlays
# =====================================================================================
ctx_menu = cap('menu-context')
sub_menus = cap_parts('menu-submenu')
add('Menu', 'Overlays', 640, stage(
    cell('Context menu', ctx_menu),
    cell('Submenu open', '<div style="display:flex;gap:8px;align-items:flex-start">' + ''.join(sub_menus) + '</div>'),
    cell('File menu', cap('menu-file')),
), '''# Menu

A dark floating list of commands: the canvas and layer context menus, dropdowns opened by **Select** and toolbar carets, and the main menu.

## Anatomy
`color-bg-menu` surface, `radius-13`, 8px padding, `shadow-elevation`. Items are 24px rows: check column, label, right-aligned shortcut in `color-text-menu-secondary`, chevron for submenus. Separators are 1px `color-border-menu` lines.

## Item properties (`MenuItem` in `src/store/store.ts`)
| Field | Type | Effect |
| --- | --- | --- |
| `label` | string | Item text |
| `shortcut` | string | From the `SHORTCUTS` table (`src/editor/keys.ts`): ⌘ glyphs on macOS, Ctrl/Alt/Shift elsewhere |
| `action` | `() => void` | Runs after the menu closes |
| `checked` | boolean | Shows a check; the item becomes a `menuitemcheckbox` |
| `disabled` | boolean | 40% white text, not selectable |
| `submenu` | `MenuItem[]` | Opens to the right on hover or → |
| `separator` | true | A divider instead of an item |

## States
Item: default · highlighted (`hl`: `color-bg-menu-hover` fill) · disabled · checked.

## Keyboard
↑ ↓ move the highlight, Enter or Space activates, → opens a submenu, ← or Escape goes back, Escape on the top menu closes it. The menu has `role="menu"`; items have `role="menuitem"` or `menuitemcheckbox`.

## Rules
- Group related commands with separators; put destructive commands last.
- Show the shortcut for every command that has one, from the shared table.
''')

tt = strip_style(strip_style(strip_style(cap('tooltip'), 'left'), 'top'), 'transform')
add('Tooltip', 'Overlays', 100, stage(
    cell('Tool name and shortcut', tt),
    cell('Disabled reason', tt.replace('Rectangle  R', 'Motion (Beta) — not available in this build')),
), '''# Tooltip

A small dark label that appears above a toolbar control on hover, giving its name and shortcut.

## Anatomy
`color-bg-tooltip`, white `body-medium` text, 4px × 8px padding, `radius`. Positioned centred 30px above the control.

## Rules
- Toolbar controls use this tooltip; other icon buttons use their native `title`.
- Content: *Name  Shortcut* (two spaces between), or a short reason when the control is unavailable.
''')

add('Toast', 'Overlays', 100, stage(
    cell('Confirmation', strip_style(strip_style(cap('toast'), 'left'), 'transform')),
    cell('Error', '<div class="toast">Couldn’t save changes. Free up disk space and keep this tab open.</div>'),
), '''# Toast

A brief message centred above the toolbar confirming an action or reporting a problem; it disappears after 2.2 seconds.

## Anatomy
`color-bg-tooltip` pill-ish box (`radius-8`), white `body-large` text, 8px × 16px padding, `shadow-elevation`.

## Writing
- Confirm what happened in past tense: *Copied as PNG*, *Saved to version history*, *Version restored*.
- Errors say what went wrong and what to do: *Couldn’t save changes. Free up disk space and keep this tab open.*
- One sentence, no exclamation marks, no apologies.

## API
`showToast(message: string)` from `src/store/store.ts`. A newer toast replaces the current one.
''')

add('Popover', 'Overlays', 150, stage(
    cell('Popover shell', '<div class="popover"><div class="popover-head"><span class="title">Drop shadow</span><button class="icon-btn" title="Close">' + icon('close') + '</button></div><div style="padding:8px 16px 16px;color:var(--color-text-secondary)">Effect settings go here.</div></div>'),
), '''# Popover

A light floating panel anchored to a control, used for editors that don't fit in the properties panel: the **ColorPicker** and the effect editor.

## Anatomy
`color-bg`, `radius-13`, `shadow-elevation`, 241px wide (the panel width). A 40px head with a title in `body-medium-strong` and a close button.

## Behaviour
Opens next to the control that triggered it (usually to the left of the properties panel); closes on Escape, the close button or a click outside. Edits apply live and are undoable.
''')

qa = cap('quick-actions')
add('Dialog', 'Overlays', 300, stage(
    cell('Quick actions', qa),
), '''# Dialog

A centred modal surface for commands that need focus: Quick actions (⌘/) and the Keyboard shortcuts reference.

## Anatomy
`color-bg`, `radius-13`, `shadow-elevation`, 520px wide (max 76% of the window height) over a dimmed backdrop. Optional head (title + close) and a scrolling body.

## Quick actions
A search field (`qa-input`) and a filtered list of commands (`qa-item`); the highlighted item (`hl`) uses `color-bg-selected`. ↑ ↓ move, Enter runs, Escape closes. Each item shows its menu path and shortcut.
''')

add('Drawer', 'Overlays', 420, stage(
    cell('Version history', '<div style="height:380px;display:flex">' + cap('version-history') + '</div>'),
), '''# Drawer

A 280px panel that slides in beside the properties panel for a secondary view: version history.

## Anatomy
Full height, `color-bg`, left border `color-border`, soft left shadow. Head with title and close; scrolling list of `version-row`s (name, time, *Restore* and *Delete* buttons).

## Rules
Destructive actions in a drawer are ghost danger buttons and ask for confirmation.
''')

add('Badge', 'Feedback', 90, stage(
    cell('Default', cap('badge')),
    cell('Muted', '<span class="badge muted">No AI</span>'),
), '''# Badge

A small label that marks status or tier next to a name: *Free* next to *Drafts*, *No AI* on the local assistant.

## Variants
- Default: `color-bg-selected` fill, `color-text-brand` text.
- `muted`: `color-bg-secondary` fill, `color-text-secondary` text.

## Rules
One or two words, no icons, never interactive.
''')

av = cap('avatar').replace(' margin: 0px;', '')
add('Avatar', 'Feedback', 110, stage(
    cell('Default', av),
    cell('Small', '<div class="avatar sm" style="background:#0d99ff">A</div>'),
    cell('Stack (collaborators)', '<div style="display:flex">' + av + av.replace('rgb(242, 72, 34)', 'rgb(13, 153, 255)').replace('>H<', '>G<') + av.replace('rgb(242, 72, 34)', 'rgb(20, 174, 92)').replace('>H<', '>L<') + '</div>'),
), '''# Avatar

A collaborator's initial on their cursor colour: in the properties header, comment threads and the home account.

## Variants
Default 24px with a 2px `color-bg` ring (so stacked avatars overlap cleanly, −6px) · `sm` 22px without a ring, for comment lists.

## Rules
Use the collaborator's presence colour; it matches their cursor and selection on the canvas. The letter is white `body-medium-strong`.
''')

# =====================================================================================
# Content
# =====================================================================================
add('PropertySection', 'Content', 260, stage(
    cell('Section', f'<div class="ds-w-panel">{cap("prop-section-position")}</div>'),
    cell('Collapsed', '<div class="ds-w-panel"><div class="prop-section collapsed"><div class="section-header"><span class="title muted">Effects</span><button class="icon-btn" title="Add effect">' + icon('plus') + '</button></div></div></div>'),
), '''# PropertySection

A titled group in the properties panel (Position, Layout, Appearance, Fill, Stroke, Effects, Export) with optional header actions.

## Properties (`Section` in `src/ui/controls.tsx`)
| Prop | Type | Notes |
| --- | --- | --- |
| `title` | string | Shown in `body-medium-strong` |
| `actions` | node | Header **IconButton**s (add, grid view, settings) |
| `muted` | boolean | Title in `color-text-secondary`: an empty section the user can add to |
| `collapsed` | boolean | Header only |

## Anatomy
40px header (16px left padding), content, 8px bottom padding and a 1px `color-border` divider. Inside, `sublabel`s name sub-groups (*Alignment*, *Dimensions*) in `color-text-secondary`.

## Rules
- Order sections by how often they're used: Position, Layout, Appearance, Fill, Stroke, Effects, Export.
- An empty section shows only its header with a `+` action and a muted title.
''')

add('TypeHeader', 'Content', 100, stage(
    cell('Frame selected', f'<div class="ds-w-panel">{cap("type-header")}</div>'),
), '''# TypeHeader

The first row of the properties panel: the selection's type (opens a menu to convert it) and quick actions.

## Anatomy
48px row: type button in `body-large-strong` with a chevron, then IconButtons: *Inspect in Dev Mode*, *Create component*, *More actions*.
''')

fc = cap('file-card')
add('FileCard', 'Content', 300, stage(
    cell('Default', f'<div style="width:270px">{fc}</div>'),
    cell('Hover', f'<div style="width:270px">{root_class(fc, "is-hover")}</div>'),
    cell('Starred', '<div style="width:270px">' + fc.replace('class="star-btn"', 'class="star-btn on"').replace(icon('star'), icon('starFill')) + '</div>'),
), '''# FileCard

A file in the home screen grid: thumbnail, star toggle, file chip, name, last edited time and a more-actions button.

## Anatomy
`radius-8` card with a 1px inset `color-border` outline; thumbnail on `color-bg-secondary`; meta row with the name in `body-medium-strong` and *Edited …* in `color-text-secondary`.

## States
Default · Hover (2px `color-bg-brand` ring, star appears) · Starred (star stays visible, filled).

## Behaviour
Click opens; right-click or the more button opens the file menu (open, open in new window, star, rename, duplicate, copy link, move to trash).
''')

add('FileRow', 'Content', 110, stage(
    cell('List view row', f'<div style="width:720px">{cap("file-row")}</div>'),
), '''# FileRow

A file in the home screen list view: small thumbnail, name, star marker and last-edited time in a 44px row.

## Rules
Same actions and menu as **FileCard**; use when the user switches the layout control to *List view*.
''')

res = cap('resource')
add('ResourceCard', 'Content', 160, stage(
    cell('Blank file', res),
    cell('Hover', root_class(res, 'is-hover')),
    cell('Group', f'<div style="width:760px">{cap("resources")}</div>'),
), '''# ResourceCard

A large tile under *Get started* on the home screen: blank file, sample file, import.

## Anatomy
Thumbnail tile (tinted per kind: blank on `color-bg` with a hairline, sample on `#fff4d6`, import on `#e0f6e5` with a `#14ae5c` icon; literal values in the code) with a title in `body-medium-strong` and a one-line description in `color-text-secondary`.
''')

add('CodeBlock', 'Content', 150, stage(
    cell('Generated CSS', f'<div class="ds-w-panel">{cap("code-block")}</div>'),
), '''# CodeBlock

Monospace code in Dev Mode: generated CSS and SVG for the selection, selectable for copying.

## Anatomy
`color-bg-secondary` box, `radius`, 10px × 12px padding, `code` text style (Roboto Mono 11/18), wraps long lines. Paired with ghost buttons *Copy CSS* / *Copy SVG*.
''')
