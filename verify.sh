#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

MANIFEST_DIR=packages/adminkit/src/generated-classes
# Hash every generated file (sorted: find order is not stable across machines).
snapshot() { find "$MANIFEST_DIR" -name '*.ts' -exec shasum {} \; 2>/dev/null | sort; }

echo "1) adminkit → generate typed class manifest from plain css"
BEFORE=$(snapshot)
node packages/adminkit/scripts/gen-classes.mjs
AFTER=$(snapshot)

echo "2) drift guard → the manifest on disk must already match the css"
# The manifest is committed, so it can go stale: edit css, forget gen:classes, and a
# plain regenerate-then-typecheck still passes because it typechecks the FRESH output.
# Compare pre- vs post-generation content instead — independent of git state, so
# consistent-but-uncommitted work in progress does not trip it.
if [ "$BEFORE" != "$AFTER" ]; then
  echo "✗ manifest was stale — regenerated it. Review and commit:"
  git status --short -- "$MANIFEST_DIR"
  exit 1
fi

echo "3) @adminkit/vue → vue-tsc (level-2: typo'd class = compile error)"
pnpm --filter @adminkit/vue exec vue-tsc --noEmit

echo "✓ all green — no sass, no css-modules, no external codegen dep"
