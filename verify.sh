#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

GENERATED="packages/adminkit/src/generated-classes packages/adminkit/src/generated-tokens.ts"
# Hash every generated file (sorted: find order is not stable across machines).
snapshot() { find $GENERATED -name '*.ts' -exec shasum {} \; 2>/dev/null | sort; }

echo "1) adminkit → generate class + token manifests from plain css"
BEFORE=$(snapshot)
node packages/adminkit/scripts/gen.mjs
AFTER=$(snapshot)

echo "2) drift guard → the manifests on disk must already match the css"
# They are committed, so they can go stale: edit css, forget `pnpm gen`, and a plain
# regenerate-then-typecheck still passes because it typechecks the FRESH output.
# Compare pre- vs post-generation content instead — independent of git state, so
# consistent-but-uncommitted work in progress does not trip it.
if [ "$BEFORE" != "$AFTER" ]; then
  echo "✗ a manifest was stale — regenerated it. Review and commit:"
  git status --short -- $GENERATED
  exit 1
fi

echo "3) @adminkit/vue → vue-tsc (level-2: typo'd class = compile error)"
pnpm --filter @adminkit/vue exec vue-tsc --noEmit

echo "4) unit tests → extraction, token contract, variant resolvers"
pnpm -C packages/adminkit test
pnpm --filter @adminkit/vue test

echo "✓ all green — no sass, no css-modules, no external codegen dep"
