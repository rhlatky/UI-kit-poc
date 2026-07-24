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
    pnpm install          # then `pnpm approve-builds` once (esbuild) — pnpm 11 quirk
    ./verify.sh           # regenerate manifest from css → vue-tsc level-2

Typo proof: mistype a class key in `packages/adminkit-vue/src/Button/Button.variants.ts`
(`m.buttonPrimaryy`) → vue-tsc: "Property 'buttonPrimaryy' does not exist".

## Demo (plain static HTML, no JS, no build)
    open packages/adminkit/demo/index.html

## Why plain CSS + manifest (vs the earlier scss/css-modules PoC)
- One class contract everywhere (no `.module.scss` scoping that diverged Vue↔Twig).
- No Sass toolchain, no unmaintained `typed-css-modules`; L2 comes from a generated
  `as const` manifest we own. Regenerate on css change (CI step / pre-commit).
