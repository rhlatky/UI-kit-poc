#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
echo "1) adminkit → generate typed class manifest from plain css"
node packages/adminkit/scripts/gen-classes.mjs
echo "2) @adminkit/vue → vue-tsc (level-2: typo'd class = compile error)"
pnpm --filter @adminkit/vue exec vue-tsc --noEmit
echo "✓ all green — no sass, no css-modules, no external codegen dep"
