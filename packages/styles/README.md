# @open-figment/styles

Every Open Figment component's CSS in one place, for apps that render the markup themselves (any framework, or plain HTML). The class names and markup for each component are documented at https://open-figment-design-system.vercel.app.

## Install

```bash
npm install @open-figment/styles
```

```bash
pnpm add @open-figment/styles
```

```bash
yarn add @open-figment/styles
```

## Use

```ts
import '@open-figment/styles'; // tokens + font + all components
// or pick:
import '@open-figment/styles/tokens.css';
import '@open-figment/styles/components/button.css';
```

```html
<button class="btn primary">Share</button>
```
