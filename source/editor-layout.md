# Editor layout

How the blocks fit together: screenshots of the running app in both themes.

## Regions
1. **TabBar** across the top (40px).
2. **NavigationRail** (52px) and the left dock (`panel-w`) on the left.
3. The canvas (`color-bg-canvas`) in the middle, with frame labels, selection and the floating **Toolbar** at the bottom centre.
4. **PropertiesPanel** (`panel-w`) on the right.

## Rules
- Panels never overlap the canvas except floating surfaces (toolbar, menus, popovers, toasts).
- Hiding the UI (⌘\\) leaves only the canvas; presenting replaces the editor with the presenter view.
