# adminkit

Design-system PoC. Plain BEM CSS is the source of truth. A generated manifest makes
those class names type-safe in Vue, so Vue, Twig and static HTML all emit the exact
same strings.

| Package | What it is |
|---|---|
| `adminkit` | css + tokens + generated class manifest. No JS logic. |
| `@adminkit/vue` | `Button`/`Input`/`Card` + the variant resolver. Vue is a peer dep. |

## Use it

```vue
<script setup lang="ts">
import { Button } from '@adminkit/vue'
</script>

<template>
  <Button variant="primary" size="lg">Save</Button>
</template>
```

Twig, or any other template language, writes the same classes by convention — no JS:

```html
<button class="button button--primary button--lg">Save</button>
```

Import paths: `@adminkit/vue` (components + `defineVariants`/`defineParts`),
`@adminkit/vue/Button` (one component), `adminkit/button.css` + `adminkit/tokens.css`
(styling, any runtime), `adminkit/generated-classes/button` and
`adminkit/generated-tokens` (the manifests).

## Develop

```bash
pnpm install
./verify.sh       # manifests → drift guard → vue-tsc → tests
pnpm gen:watch    # regenerate the manifests while editing css
```

Typo proof: change `m.buttonPrimary` to `m.buttonPrimaryy` in `Button.variants.ts` →
`vue-tsc` fails with "Property 'buttonPrimaryy' does not exist".

## Add a component

1. `packages/adminkit/src/css/badge.css` — plain BEM (`.badge`, `&.badge--success`).
2. `pnpm gen` — writes `src/generated-classes/badge.ts`.
3. `Badge.variants.ts` — `import { badge as m } from 'adminkit/generated-classes/badge'`,
   then `defineVariants(m.badge, { variants, defaultVariants })`, plus an exported
   `BadgeProps` type.
4. `Badge.vue` — `import 'adminkit/badge.css'`, resolver in a `computed`, bind `:class`.
5. `Badge/index.ts` + a line in `src/index.ts`.

Multi-part components use `defineParts` (see `Input`, `Card`). Style defaults belong in
`defaultVariants`, never in `withDefaults`. `Button`/`Input`/`Card` are examples to copy,
not a locked API.

## Theming

Light tokens on `:root`, dark on `[data-theme='dark']`. Set `data-theme="dark"` on
`<html>` to switch. Both set `color-scheme`, so native UI follows.

Token names are generated too, so a runtime override cannot misspell one — an unknown
custom property is silently ignored by the browser, and `var(--typo)` renders as nothing:

```ts
import { tokens as t } from 'adminkit/generated-tokens'

document.documentElement.style.setProperty(t.colorPrimary, '#0071e3')
```

`pnpm -C packages/adminkit test` also checks the reverse direction: every `var(--ds-…)`
in the shipped css must resolve to a token declared in `tokens.css`.

```bash
open packages/adminkit/demo/index.html   # static demo, no build
```

## Why this shape

No Sass, no CSS-Modules, no CSS-in-JS: scoping would make Vue and Twig diverge, and the
shared class contract is the whole point. Class names are typo-checked at compile time
through a manifest we generate ourselves, so there is no external codegen dependency to
go unmaintained.

`main` holds the older scss + css-modules variant, kept only for comparison. Build on
`feat/plain-css-manifest`.
