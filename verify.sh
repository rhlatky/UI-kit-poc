#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
echo "1) adminkit → dist/*.css (plain BEM, for Twig/vanilla)"
( cd packages/adminkit && ./node_modules/.bin/sass src/scss/button.scss:dist/button.css src/scss/input.scss:dist/input.css src/scss/card.scss:dist/card.css --style=compressed --no-source-map )
echo "2) @adminkit/vue → *.module.scss.d.ts (from @use'd adminkit scss)"
( cd packages/adminkit-vue && ./node_modules/.bin/typed-scss-modules 'src/**/*.module.scss' --exportType default --includePaths ../adminkit/src/scss )
echo "3) @adminkit/vue → vue-tsc (level-2: typo'd class = compile error)"
( cd packages/adminkit-vue && ./node_modules/.bin/vue-tsc --noEmit )
echo "✓ all green"
