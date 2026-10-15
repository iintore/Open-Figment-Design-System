from lib import cap, cap_parts, icon, root_class, cell, stage, strip_style

B = []


def add(name, height, preview, readme, width=None, group='Blocks'):
    B.append({'name': name, 'group': group, 'height': height, 'width': width, 'preview': preview, 'readme': readme})


def frame(html, w, h, extra=''):
    return f'<div class="ds-frame" style="width:{w}px;height:{h}px;{extra}">{html}</div>'


def panel_frame(name, h=760):
    return frame(cap(name), 241, h)


# ---------------------------------------------------------------- Shell
add('TabBar', 140, stage(
    cell('Editor', f'<div style="width:1100px">{cap("tabbar")}</div>', cls='fill'),
    cell('Home', f'<div style="width:1100px">{cap("tabbar-home")}</div>', cls='fill'),
    cls='col'), '''# TabBar

The 40px strip at the top of the window: home tab, open file **Tab**s, new-file button and, at the far end, the theme toggle.

## Composition
`Tab` (home, icon only) · `Tab` per open file · new-file button · spacer · theme toggle. Background `color-bg-secondary` (`#1e1e1e` in dark), bottom border `color-border`.

## Behaviour
- In the macOS app the bar is the window's drag region and leaves room for the traffic lights.
- Closing the active tab opens its neighbour; closing the last returns home.
- Open tabs are remembered between sessions.
''', width=1140)

add('Toolbar', 150, stage(
    cell('Design mode', cap('toolbar')),
    cell('Draw mode', cap('toolbar-draw')),
    cls='col canvas'), '''# Toolbar

The floating toolbar centred at the bottom of the canvas: tool groups, comment, insert, and the **ModeSwitch**.

## Composition
- **Design mode:** Move group (Move, Hand, Scale) · Frame group (Frame, Section) · Shapes (Rectangle, Line, Arrow, Ellipse, Polygon, Star, Image) · Pen group (Pen, Pencil) · Text · Comment · Insert · separator · ModeSwitch.
- **Draw mode:** Move · Pencil · Pen · Shapes · Eraser · separator · stroke colour swatch · stroke size · separator · ModeSwitch.

## Anatomy
`color-bg-toolbar` surface, `radius-13`, 8px padding, 2px gaps, `shadow-toolbar`, 12px above the bottom edge.

## Rules
- Each group shows its last-used tool; the caret opens the group as a **Menu** with shortcuts.
- `role="toolbar"`, `aria-label="Tools"`; every button has an accessible name.
- Hidden when the UI is hidden (⌘\\) and while presenting.
''', width=None)

add('NavigationRail', 560, stage(frame(cap('rail'), 52, 520)), '''# NavigationRail

The 52px column on the far left: main menu (the monkey logo), then **RailItem**s for File, Agents, Assets, Tools and Variables.

## Behaviour
- The logo opens the main menu (file, edit, view, preferences).
- Selecting an item opens its panel in the left dock; selecting the open item again collapses the dock.
- Variables opens a full-width view instead of a panel.
''')

add('FilePanel', 800, stage(frame(cap('left-dock-file'), 293, 760)), '''# FilePanel

The default left panel: file header, Pages and the layers tree.

## Composition
NavigationRail · file header (file name with rename, *Drafts* + **Badge**, panel toggle) · **PropertySection** *Pages* with search and add actions · **PageRow**s · section *Layers* · **LayerRow** tree.

## Behaviour
- The layers tree mirrors the canvas: top of the list is top of the stack.
- Selecting on the canvas expands the tree to show the selected layer.
- The panel width is `panel-w`.
''')

add('AgentsPanel', 800, stage(
    cell('Empty', frame(cap('left-dock-agents'), 293, 760)),
    cell('Conversation', frame(cap('left-dock-agents-chat'), 293, 760)),
), '''# AgentsPanel

The local assistant: suggestions to start from, a conversation, and a composer. It runs rule-based commands on your device and never uses AI or the network.

## Composition
Panel head (*New chat*, *Clear chat*, *Examples*) · banner (`agent-banner`: *Local assistant*, *No AI* **Badge**, one sentence explaining it runs on your device with fixed rules) · empty state *What's next?* with suggestion groups (*Tidy and polish*, *Generate designs*, *Create plugins and shaders*) · messages (`agent-msg`) with chips for created layers · composer with *Send*.

## Writing
Replies say what changed in the file, in past tense: *Added a login screen to the right of your designs.* Every request is one undo step.
''', width=640)

add('AssetsPanel', 800, stage(frame(cap('left-dock-assets'), 293, 760)), '''# AssetsPanel

Lists the file's components with thumbnails, a library card, and search. Drag a component onto the canvas to place an instance.

## Composition
Panel head with *Libraries* · **SearchField** · library selector (*All libraries*) · *Created in this file* with the component count · component grid (`asset-grid` of `asset-tile`s with `asset-label`).

## Rules
Thumbnails re-render only when the component itself changes. An empty file explains how to create components, with the real shortcut from the shortcut table.
''')

add('ToolsPanel', 800, stage(frame(cap('left-dock-tools'), 293, 760)), '''# ToolsPanel

A searchable catalogue of every command in the app, grouped by category, with shortcuts. Running a command here is the same as using its menu item.

## Composition
Panel head · **SearchField** · filters (*Create*, *Source*, *Category*) · `tool-row`s: a letter tile, the command name, and its menu path with shortcut (*File · ⌘N*).
''')

# ---------------------------------------------------------------- Properties
add('PropertiesPanel', 800, stage(
    cell('Frame', panel_frame('right-panel-frame')),
    cell('Text', panel_frame('right-panel-text')),
), '''# PropertiesPanel

The right panel in Design mode: everything about the current selection, as a stack of **PropertySection**s.

## Composition
Header (avatars, present, **Button** *Share*) · panel tabs (*Design* / *Prototype*, zoom) · **TypeHeader** · sections:
- **Position:** alignment **SegmentedControl**s, X / Y and rotation **NumberField**s, constraints.
- **Layout:** flow (freeform, vertical, horizontal, grid, wrap), dimensions with sizing **Select**s, gap and padding, *Clip content* **Checkbox**.
- **Appearance:** opacity, corner radius, blend mode.
- **Text** (text layers): family, weight, size, line height, letter spacing, alignment.
- **Fill**, **Stroke** (**PaintRow** lists), **Effects**, **Layout guides**, **Export**.

## Rules
- Sections appear only when they apply to the selection; empty ones show a muted title and a `+`.
- A mixed multi-selection shows *Mixed* in fields and selects.
- Width is `panel-w`; the panel scrolls, the header stays.
''', width=560)

add('ComponentProperties', 800, stage(
    cell('Main component', panel_frame('right-panel-component')),
    cell('Instance', panel_frame('right-panel-instance')),
), '''# ComponentProperties

How the properties panel changes for components and instances.

## Main component
The type header reads *Component* with a *Component options* menu. Below it: the component's name, its instance count (*1 instance*) and *Create instance*. Then the usual sections, including *Auto layout* and *Selection colors*.

## Instance
The type header reads *Instance* with an *Instance options* menu (reset changes, detach). Below it: the main component's name with *Go to main*. Edited properties are overrides that survive changes to the main component; layers inside an instance can be edited but not moved, deleted or reparented.
''', width=560)

add('CanvasProperties', 800, stage(
    cell('Nothing selected', panel_frame('right-panel-page')),
    cell('Frame tool (presets)', panel_frame('right-panel-frame-presets')),
), '''# CanvasProperties

What the properties panel shows with nothing selected, and while the Frame tool is active.

## Nothing selected
Page background (**PaintRow**), local *Styles* and page *Export*.

## Frame tool
Device and paper presets grouped by family (phone, tablet, desktop, presentation, watch, paper, social). Clicking one places a frame of that size to the right of existing content.
''', width=560)

add('PrototypePanel', 800, stage(frame(cap('right-panel-prototype'), 241, 760)), '''# PrototypePanel

The *Prototype* tab: flow starting points and interactions of the selected frame, and the *Present* button.

## Composition
*Flow starting point* section · *Interactions* section with an *Add interaction* action and one `interaction-card` per interaction (trigger, action, destination, transition, duration, easing). With no interactions it explains how to add one: *Drag the blue “+” handle on the canvas onto a frame, or click + to add an interaction.* Present from the play button in the header (⌥⌘↵).

## Rules
Connections are drawn on the canvas as noodles from the selection to its destination; editing a card updates the noodle.
''')

add('InspectPanel', 800, stage(frame(cap('right-panel-inspect'), 241, 760)), '''# InspectPanel

Dev Mode's right panel: read-only measurements, colours, typography and generated code for the selection.

## Composition
Layer name · W / H / X / Y values · *Code*: a **CodeBlock** of CSS with a ghost *Copy* button · *Colors* with hex values · *SVG* with *Copy*. The panel tabs read *Inspect* instead of Design / Prototype.

## Rules
Nothing in Dev Mode edits the file; the canvas still selects and measures. The **ModeSwitch** shows Dev Mode in green.
''')

add('CommentsPanel', 800, stage(
    cell('Comments list', frame(cap('right-panel-comments'), 241, 760)),
    cell('Thread on the canvas', '<div class="ds-stage canvas" style="width:380px;height:240px;position:relative;padding:20px">' + cap('comment-pin') + cap('comment-popover') + '</div>'),
), '''# CommentsPanel

Comment threads: a list in the right panel and pins on the canvas that open a thread popover.

## Composition
- Panel: one `comment-list-item` per thread (**Avatar** sm, author, time, first message).
- Canvas: `comment-pin` (author colour, teardrop shape) and `comment-popover`: head with *Resolve*, *Delete thread* and *Close*; messages (**Avatar**, author, time, text); a reply field with *Post*. The popover's actions are drawn with text glyphs (✓ 🗑 ✕ ↑) rather than the icon set.

## Rules
Clicking a thread on another page switches to that page. Deleting a page deletes its comments.
''', width=760)

add('ColorPicker', 520, stage(cap('color-picker')), '''# ColorPicker

The **Popover** for editing a paint: type (solid, gradients, image), the colour field, hue and opacity sliders, hex and opacity inputs, and the file's colour styles and variables.

## Composition
Popover head with tabs *Custom* / *Libraries* and close · paint type **Select** (*Solid*, gradients, image) · gradient bar with stops (gradients) · saturation/value field (`picker-sv`) · *Pick color from screen*, hue `slider` and alpha `slider` on a checkerboard · hex + opacity row · *On this page*: swatches of colours used in the file. *Libraries* lists colour styles and colour variables.

## Behaviour
- Dragging in the field or on a slider is one undo step.
- Greys keep the last hue, so dragging back out of grey doesn't jump.
- Escape or a click outside closes it.
''')

# ---------------------------------------------------------------- Views
add('ShortcutsDialog', 720, stage(cap('shortcuts')), '''# ShortcutsDialog

The keyboard shortcuts reference (Ctrl+Shift+? or *Help → Keyboard shortcuts*), grouped by tools, editing, arrange, view, text and prototype.

## Rules
Shortcut labels follow the platform: ⌘ ⌥ ⇧ ⌃ glyphs on macOS, *Ctrl+*, *Alt+*, *Shift+* elsewhere, from the same table menus use.
''', width=940)

add('VariablesView', 880, stage(cap('variables-view'), cls='flush'), '''# VariablesView

A full-width table for the file's variables: collections on the left, variables × modes in the table.

## Composition
Collections list (**PageRow**-style rows with counts) · head (collection name **TextField**, close) · table: name with type chip, one value cell per mode (colour **swatch** + hex, number, string or boolean), add-mode and delete actions · *Create variable* (**Button** ghost).

## Empty state
*No variables created in this file* with a short explanation and a primary *Create* button that asks for the type (Color, Number, String, Boolean).

## Rules
Colour variables appear in the **ColorPicker** under *Libraries*. Every edit is undoable.
''', width=1388)

add('HomeScreen', 900, stage(
    f'<div style="width:1440px;height:860px;display:flex;flex-direction:column;overflow:hidden">{cap("home")}</div>', cls='flush'), '''# HomeScreen

The file browser: account and navigation on the left, *Get started* resources, and recent files.

## Composition
Sidebar (`home-side`: account **Avatar** and *Notifications*, **SearchField**, *Recents*, team *Figment* with *Free* **Badge**, *Drafts*, *Trash*, and a footer note) · top bar (title, **ProductPill**s) · *Get started* **ResourceCard**s · tabs *Recently viewed* / *Starred* with the grid / list **SegmentedControl** · **FileCard** grid or **FileRow** list.

## Rules
- Files are stored locally; the sidebar footer says so in one sentence.
- Trash keeps files until *Delete forever* (confirmed); starring and trashing survive reloads.
- The layout choice (grid / list) is remembered.
''', width=1440)

add('PresenterBar', 120, stage(f'<div style="width:1100px;position:relative">{cap("presenter-bar")}</div>', cls='flush'), '''# PresenterBar

The 40px bar above a running prototype: *Close*, *← Back*, the current frame's name, the position in the flow (*1 / 3*) and *Restart (R)*.

## Rules
Escape also leaves presentation mode; *Back* is disabled at the start of the flow.
''', width=1100)

add('ErrorScreen', 260, '''<div style="height:240px;display:flex"><div class="error-screen" role="alert"><b>Something went wrong</b><span>Your work up to the last change has been saved.</span><div class="error-actions"><button class="btn secondary">Back to files</button><button class="btn primary">Reload</button></div></div></div>''', '''# ErrorScreen

The recovery screen shown in place of the editor or home if a panel fails to render.

## Writing
State what happened and that work is safe: *Something went wrong* / *Your work up to the last change has been saved.* Offer two ways out: *Back to files* (secondary) and *Reload* (primary).

## Behaviour
Switching tabs clears the error and tries again; the error is logged to the console.
''')
