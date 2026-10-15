# Contributing

Thanks for helping improve the Open Figment design system.

1. `npm install`, then `npm run dev` to work on the site.
2. To change what a component page says, edit its spec in `scripts/components_*.py` or the
   sources in `source/`, then run `npm run content`.
3. If the component itself changed in the [app](https://github.com/iintore/Open-Figment), run the
   app (`npm run dev` there) and `npm run capture` here first, so previews show the real UI.
4. Run `npm run check` before opening a pull request. CI runs the same checks.

Write guidelines the way the [Writing](source/brand-book.md) page describes: short, literal,
sentence case, and name tokens in backticks.

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
