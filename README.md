# ui-kit-poc — monorepo skeleton (PoC)

One source of truth for styling, three consumers. Proves: **Vue keeps level-2
typed CSS-module classes even when the styles live in a separate package**, and
the **same styles drive plain HTML (Twig)**.

## Packages
- **@ui-kit/css** — SCSS source of truth: BEM classes (`button--primary`) + tokens.
  Builds a plain `dist/button.css` any consumer can use.
- **@ui-kit/vue** — Vue components, approach **H** (CSS Modules + BEM). Each
  component's `.module.scss` `@use`s the ui-kit-css partial; `typed-scss-modules`
  generates a `.d.ts` from it → `styles.*` is **level-2** typed (a typo is a
  compile error). Ships its own module-scoped CSS.
- **@ui-kit/twig** — **vanilla HTML + JS** implementations for the Twig/CMS side
  (no framework). Plain BEM markup + a tiny vanilla `defineVariants` (the same
  algorithm as the Vue helper) + a DOM factory (`createButton`). Styled by
  `@ui-kit/css/dist/button.css`. Twig renders the static HTML; this JS enhances /
  builds dynamically.

Shared **source** (SCSS in ui-kit-css), per-package **output**. Variant→class
logic is shared: the plain-JS `defineVariants` in @ui-kit/twig is the core the
Vue package wraps — same algorithm, over the plain BEM class names.

## Verify
    pnpm install          # then `pnpm approve-builds` once (pick esbuild) — pnpm 11 quirk
    ./verify.sh           # runs the whole chain without pnpm's script runner

verify.sh does:
1. build @ui-kit/css → `packages/ui-kit-css/dist/button.css` (plain BEM, for Twig)
2. generate `Button.module.scss.d.ts` in @ui-kit/vue from the `@use`'d css package
3. `vue-tsc --noEmit` — a mistyped class name is a compile error (level-2)

Try it: edit `packages/ui-kit-vue/src/Button/Button.variants.ts`, mistype a class
(`styles.buttonPrimaryy`) → step 3 fails. That's the separate CSS package still
giving Vue full type-safety.

## See the Twig side (vanilla HTML + JS, no Vue)
    open packages/ui-kit-twig/demo/index.html   # after ./verify.sh built the css

Static buttons = what Twig renders server-side; the second row is built by the
vanilla `createButton()` — identical classes, zero framework.

## Key finding baked in
- Separate SCSS package + L2 works via **`@use` + typed-scss-modules/sass-dts**
  (JS-import path). Inline `<style module>` + strictCssModules does NOT resolve
  `@use`'d classes — so the JS-import (H/G) path is the one for a css package.
