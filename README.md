# adminkit — monorepo (PoC)

Two packages. **Plain CSS** (no Sass, no CSS-Modules), one shared class contract
across Vue + vanilla + Twig, level-2 typed via a generated `as const` manifest.

## Packages
- **adminkit** — the base, **pure styling contract, zero JS logic**:
  - `src/css/*.css` — plain BEM CSS (source of truth) + `tokens.css`. Global,
    stable class names (`button--primary`) — the SAME strings every runtime uses.
  - `src/generated-classes/*.ts` — **generated `as const` key→value manifest** of
    each file's class names (`button.buttonPrimary === 'button--primary'`, values
    + literal types) via `scripts/gen-classes.mjs`.
  - Exports: `adminkit/button.css`, `adminkit/generated-classes/button`, `adminkit/tokens.css`.
- **@adminkit/vue** — the Vue layer: the variant resolver (`src/lib/defineVariants`)
  **plus** the components. Import the manifest from `adminkit/generated-classes/*`
  and reference `m.buttonPrimary` (like scss's `styles.buttonPrimary`) — a typo
  (`m.buttonPrimaryy`) is a compile error (level-2). Each component imports its
  `adminkit/*.css` for styling.

No Sass. No CSS-Modules (so no scoping → Vue, vanilla and Twig share the exact
same class names). Type generation is our own script over the plain CSS.

## Verify
    pnpm install
    ./verify.sh           # regenerate manifest from css → vue-tsc level-2
    pnpm --filter @adminkit/vue test   # resolver unit tests

Typo proof: mistype a class key in `packages/adminkit-vue/src/Button/Button.variants.ts`
(`m.buttonPrimaryy`) → vue-tsc: "Property 'buttonPrimaryy' does not exist".

## Demo (plain static HTML, no JS, no build)
    open packages/adminkit/demo/index.html

## Add a component (e.g. `Badge`)
1. **CSS** — `packages/adminkit/src/css/badge.css`, plain BEM
   (`.badge`, `&.badge--success`, …). Add classes under one block.
2. **Generate the manifest** — `pnpm gen:classes` (or run `gen:classes:watch`
   while editing). Produces `src/generated-classes/badge.ts` (`as const`) and an
   `adminkit/generated-classes/badge` export.
3. **Variant map** — `packages/adminkit-vue/src/Badge/Badge.variants.ts`:
   `import { badge as m } from 'adminkit/generated-classes/badge'`, then
   `defineVariants(m.badge, { variants: { … } })` referencing `m.badgeSuccess`
   etc (typo = compile error). Inside this package import the resolver from
   `../lib`; from outside it is `import { defineVariants } from '@adminkit/vue'`.
4. **Component** — `Badge.vue`: `import 'adminkit/badge.css'`, wrap the resolver
   in a `computed`, bind `:class`. (a11y: label associations via `useId()`, etc.)
5. **Export** — add `Badge/index.ts` and a line to `src/index.ts`. That barrel is
   auto-discovered as a build entry, so `@adminkit/vue/Badge` works too.

Multi-part components (root/header/…) use `defineParts` instead of `defineVariants`
— see `Input`/`Card`. `Button` shows `compoundVariants` (a class applied only when
a whole combo matches). Button/Input/Card are **EXAMPLE references**, not a fixed API.

## Public entry points
| Import | Gives you |
|---|---|
| `@adminkit/vue` | components + `defineVariants`/`defineParts` |
| `@adminkit/vue/Button` (`/Input`, `/Card`, `/lib`) | one barrel, for finer tree-shaking |
| `adminkit/button.css`, `adminkit/tokens.css` | the styling contract (any runtime) |
| `adminkit/generated-classes/button` | the `as const` class manifest |

## Theming
`tokens.css` defines light tokens on `:root` and dark overrides on
`[data-theme='dark']`. Set `data-theme="dark"` on `<html>` (or any ancestor) to
switch. Sizing/typography tokens are theme-agnostic. All packages consume the same
`--ds-*` variables, so theming is orthogonal to the component layer.

## Why plain CSS + manifest (vs the earlier scss/css-modules PoC)
- One class contract everywhere (no `.module.scss` scoping that diverged Vue↔Twig).
- No Sass toolchain, no unmaintained `typed-css-modules`; L2 comes from a generated
  `as const` manifest we own. Regenerate on css change (CI step / pre-commit).
