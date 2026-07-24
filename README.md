# adminkit — monorepo (PoC)

Two packages. **Plain CSS** (no Sass, no CSS-Modules), one shared class contract
across Vue + vanilla + Twig, level-2 typed via a generated `as const` manifest.

## Packages
- **adminkit** — the base:
  - `src/css/*.css` — plain BEM CSS (source of truth) + `tokens.css`. Global,
    stable class names (`button--primary`) — the SAME strings every runtime uses.
  - `src/classes/*.d.ts` — **generated TYPE-ONLY** union of each file's class
    names (`export type ButtonClass = 'button' | 'button--primary' | …`), produced
    from the CSS by `scripts/gen-classes.mjs` (our ~30-line script). No runtime
    `.js` — consumers write class literals inline and check them with `satisfies`.
  - `src/variants.{js,d.ts}` — shared variant CORE (`defineVariants`/`defineParts`).
  - `src/dom/*.js` — vanilla DOM factories (`createButton`, …) for the Twig/CMS side.
  - Subpath exports: `adminkit/button.css`, `adminkit/classes/button`, `adminkit/variants`, `adminkit/dom`.
- **@adminkit/vue** — Vue components. `import type` the class union from
  `adminkit/classes/*` and the variant core from `adminkit/variants`; class
  literals are `satisfies`-checked against the union → a typo is a compile error
  (level-2). Each component imports its `adminkit/*.css` for styling.

No Sass. No CSS-Modules (so no scoping → Vue, vanilla and Twig share the exact
same class names). Type generation is our own script over the plain CSS.

## Verify
    pnpm install          # then `pnpm approve-builds` once (esbuild) — pnpm 11 quirk
    ./verify.sh           # regenerate manifest from css → vue-tsc level-2

Typo proof: mistype a class literal in `packages/adminkit-vue/src/Button/Button.variants.ts`
(`'button--primaryy'`) → vue-tsc: "not assignable to type 'ButtonClass'".

## Demo (vanilla, no Vue, no build)
    open packages/adminkit/demo/index.html

## Why plain CSS + manifest (vs the earlier scss/css-modules PoC)
- One class contract everywhere (no `.module.scss` scoping that diverged Vue↔Twig).
- No Sass toolchain, no unmaintained `typed-css-modules`; L2 comes from a generated
  `as const` manifest we own. Regenerate on css change (CI step / pre-commit).
