# Introduction

Open Figment is an open-source, collaborative design tool for the web and macOS. This is the documentation of its interface: the foundations, components and blocks every screen is built from.

## What's in the system

The interface is built in three layers, and these docs follow the same order:

- **Foundations:** colour, typography, spacing and size, radius, elevation, iconography and writing. Every value is a token in `tokens.json`, with a light and a dark theme.
- **Components:** the controls every panel is made of: buttons, fields, selects, segmented controls, layer rows, menus, tooltips and more. Each page shows every state the code defines.
- **Blocks:** whole panels and screens composed from components: the toolbar, the layers panel, the properties panel, the colour picker, the home screen and others.

## Built from the real product

Nothing on these pages is a mock-up. Previews use the markup the running app renders and the stylesheet it ships, so what you see here is exactly what users see in the editor.

- Tokens come straight from the app's stylesheet (`src/index.css`).
- Component markup was captured from the running editor, state by state.
- Properties come from the React components in `src/ui/` and `src/editor/`.

## Principles

- **The work comes first.** Panels are quiet and neutral so the canvas can be loud. Colour is reserved for meaning.
- **One blue means act.** Brand blue marks the primary action, the current tool, selection and focus; nothing decorative.
- **Dense, not cramped.** 24px controls, 32px rows and 11px type let a full properties panel fit on a laptop screen.
- **Every state is designed.** Hover, pressed, selected, focus, disabled and mixed are part of each component, not afterthoughts.

## Next steps

- Read **Installation** to use the tokens and component styles in your own work.
- Start with **Color** and **Typography** in Foundations.
- Browse **Components** for the controls, and **Blocks** for full panels.
