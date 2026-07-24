#!/usr/bin/env bash
# End-to-end PoC check without relying on `pnpm run` (pnpm 11 errors on ignored
# build scripts). Calls the installed binaries directly.
set -e
cd "$(dirname "$0")"
echo "1) ui-kit-css → dist/button.css (plain BEM, for Twig)"
( cd packages/ui-kit-css && ./node_modules/.bin/sass src/button.scss:dist/button.css src/input.scss:dist/input.css src/card.scss:dist/card.css --style=compressed --no-source-map )
echo "2) ui-kit-vue → Button.module.scss.d.ts (from @use'd @ui-kit/css)"
( cd packages/ui-kit-vue && ./node_modules/.bin/typed-scss-modules 'src/**/*.module.scss' --exportType default --includePaths ../ui-kit-css/src )
echo "3) ui-kit-vue → vue-tsc (level-2: typo'd class = compile error)"
( cd packages/ui-kit-vue && ./node_modules/.bin/vue-tsc --noEmit )
echo "✓ all green — css built, types generated from the css package, L2 typecheck passes"
