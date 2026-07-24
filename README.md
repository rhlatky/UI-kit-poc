# adminkit — monorepo (PoC)

Two packages. **Plain CSS** (no Sass, no CSS-Modules), one shared class contract
across Vue + vanilla + Twig, level-2 typed via a generated `as const` manifest.

## Packages
- **adminkit** — the base:
  - `src/css/*.css` — plain BEM CSS (source of truth) + `tokens.css`. Global,
    stable class names (`button--primary`) — the SAME strings every runtime uses.
  - `src/classes/*.{js,d.ts}` — **generated** typed class manifest (`as const`),
    produced from the CSS by `scripts/gen-classes.mjs` (our ~30-line script — no
    external, unmaintained dep). This is the type source for level-2.
  - `src/variants.{js,d.ts}` — shared variant CORE (`defineVariants`/`defineParts`).
  - `src/dom/*.js` — vanilla DOM factories (`createButton`, …) for the Twig/CMS side.
  - Subpath exports: `adminkit/button.css`, `adminkit/classes/button`, `adminkit/variants`, `adminkit/dom`.
- **@adminkit/vue** — Vue components. Import the class manifest from
  `adminkit/classes/*` + the variant core from `adminkit/variants`; a typo'd class
  is a compile error (level-2). Each component imports its `adminkit/*.css` for styling.

No Sass. No CSS-Modules (so no scoping → Vue, vanilla and Twig share the exact
same class names). Type generation is our own script over the plain CSS.

## Verify
    pnpm install          # then `pnpm approve-builds` once (esbuild) — pnpm 11 quirk
    ./verify.sh           # regenerate manifest from css → vue-tsc level-2

Typo proof: mistype a class in `packages/adminkit-vue/src/Button/Button.variants.ts`
(`c.buttonPrimaryy`) → vue-tsc fails against the generated manifest.

## Demo (vanilla, no Vue, no build)
    open packages/adminkit/demo/index.html

## Why plain CSS + manifest (vs the earlier scss/css-modules PoC)
- One class contract everywhere (no `.module.scss` scoping that diverged Vue↔Twig).
- No Sass toolchain, no unmaintained `typed-css-modules`; L2 comes from a generated
  `as const` manifest we own. Regenerate on css change (CI step / pre-commit).
