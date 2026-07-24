# adminkit — monorepo (PoC)

Two packages. **Plain CSS** (no Sass, no CSS-Modules), one shared class contract
across Vue + vanilla + Twig, level-2 typed via a generated `as const` manifest.

## Packages
- **adminkit** — the base, **pure styling contract, zero JS logic**:
  - `src/css/*.css` — plain BEM CSS (source of truth) + `tokens.css`. Global,
    stable class names (`button--primary`) — the SAME strings every runtime uses.
  - `src/types/*.d.ts` — **generated type-only** union of each file's class names
    (`ButtonClass = 'button' | 'button--primary' | …`) via `scripts/gen-types.mjs`.
  - Exports: `adminkit/button.css`, `adminkit/types/button`, `adminkit/tokens.css`.
- **@adminkit/vue** — the Vue layer: the variant resolver (`src/lib/defineVariants`)
  **plus** the components. `import type` the class union from `adminkit/types/*`,
  write class literals inline, `satisfies`-check them → level-2. Each component
  imports its `adminkit/*.css` for styling.

No Sass. No CSS-Modules (so no scoping → Vue, vanilla and Twig share the exact
same class names). Type generation is our own script over the plain CSS.

## Verify
    pnpm install          # then `pnpm approve-builds` once (esbuild) — pnpm 11 quirk
    ./verify.sh           # regenerate manifest from css → vue-tsc level-2

Typo proof: mistype a class literal in `packages/adminkit-vue/src/Button/Button.variants.ts`
(`'button--primaryy'`) → vue-tsc: "not assignable to type 'ButtonClass'".

## Demo (plain static HTML, no JS, no build)
    open packages/adminkit/demo/index.html

## Why plain CSS + manifest (vs the earlier scss/css-modules PoC)
- One class contract everywhere (no `.module.scss` scoping that diverged Vue↔Twig).
- No Sass toolchain, no unmaintained `typed-css-modules`; L2 comes from a generated
  `as const` manifest we own. Regenerate on css change (CI step / pre-commit).
