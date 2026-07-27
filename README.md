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
    ./verify.sh   # gen manifest → drift guard → vue-tsc level-2 → unit tests

Typo proof: mistype a class key in `packages/adminkit-vue/src/Button/Button.variants.ts`
(`m.buttonPrimaryy`) → vue-tsc: "Property 'buttonPrimaryy' does not exist".

Drift guard: the manifest is committed, so `verify.sh` compares its content before and
after generating. Edit css without running `gen:classes` and step 2 fails — a plain
regenerate-then-typecheck would pass, because it checks the freshly written output.

## Demo (static HTML, no build, no framework)
    open packages/adminkit/demo/index.html

Writes the class strings by hand, the way Twig does. Only JS on the page is the
light/dark toggle.

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
   auto-discovered as a build entry, so `@adminkit/vue/Badge` works too. Export a
   named `BadgeProps` from `Badge.variants.ts` — props declared inline in the SFC
   only reach the `.d.ts` as an internal alias, so consumers cannot type a wrapper.

**Where defaults live:** style defaults go in `defaultVariants`, never in
`withDefaults`. A prop default makes the prop always defined, so the resolver never
consults its own default — the two literals then drift with only one taking effect.
`withDefaults` is for DOM attributes (`type: 'button'`). Boolean props need no entry;
Vue casts an absent one to `false`. Non-Vue callers get the same defaults for free.

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
`--ds-*` variables, so theming is orthogonal to the component layer. Each theme also
sets `color-scheme`, so native UI the browser paints itself (caret, scrollbars,
autofill, date pickers) follows the theme.

Not there yet: a page/background tier (only `--ds-color-surface` exists, so a page
background has to be mixed off it — see the demo), `prefers-color-scheme` as a default,
and per-brand token sets.

## IDE integration (re-point after a monorepo lift)
`.idea/watcherTasks.xml` + `.idea/scopes/adminkit_css.xml` regenerate the manifest when
a css file in `packages/adminkit/src/css` is saved. `.vscode/tasks.json` offers the same
as a manual watch task. Both reference project-root-relative paths and the scope pattern
is explicit, so both need updating once this sits inside a larger repo.

## Why plain CSS + manifest (vs the earlier scss/css-modules PoC)
- One class contract everywhere (no `.module.scss` scoping that diverged Vue↔Twig).
- No Sass toolchain, no unmaintained `typed-css-modules`; L2 comes from a generated
  `as const` manifest we own. Regenerate on css change (CI step / pre-commit).
