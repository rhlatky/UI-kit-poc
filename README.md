# adminkit — monorepo (PoC)

Two packages. Styling + base interactivity co-versioned together; Vue on top.

## Packages
- **adminkit** — CSS (BEM SCSS source of truth + tokens) **+ vanilla JS** for small
  critical interactive elements **+ the shared variant CORE** (`defineVariants` /
  `defineParts`). Framework-agnostic. Ships plain per-component `.css` too.
  Subpath exports keep concerns separate:
  - `adminkit/button.scss` … — SCSS source (Vue `@use`s these, for L2 typing)
  - `adminkit/variants`      — the props→class algorithm (used by vanilla AND Vue)
  - `adminkit/dom`           — vanilla DOM factories (`createButton`, …)
  - `adminkit/css/button.css`… — compiled CSS (plain HTML / Twig)
  - `adminkit/tokens.css`
- **@adminkit/vue** — large interactive Vue components (approach H: CSS Modules + BEM).
  Each `.module.scss` `@use`s the adminkit SCSS; `typed-scss-modules` → `.d.ts` →
  **level-2** typed class access. Variant logic imported from `adminkit/variants`
  (no copy) and wrapped in a Vue `computed`.

Why two, not three: the vanilla JS hardcodes the BEM class contract from the CSS,
so they must move together — one package = no version skew. The variant algorithm
lives once in `adminkit/variants`; both runtimes consume it.

## Verify
    pnpm install          # then `pnpm approve-builds` once (esbuild) — pnpm 11 quirk
    ./verify.sh           # build css → gen types from adminkit scss → vue-tsc L2

Typo proof: mistype a class in `packages/adminkit-vue/src/Button/Button.variants.ts`
(`styles.buttonPrimaryy`) → vue-tsc fails. The css package still gives Vue L2.

## Demo (vanilla, no Vue)
    open packages/adminkit/demo/index.html    # after ./verify.sh built the css
