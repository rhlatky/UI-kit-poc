// Classes extracted from selector position only — values like `url(./foo.svg)` would create phantom keys that typecheck but have no styling.

const COMMENTS = /\/\*[\s\S]*?\*\//g
// `[^{};]*` anchors at {/}/; boundaries without consuming them, so nested rules aren't skipped.
const RULE_PRELUDES = /([^{};]*)\{/g
const CLASS = /\.(-?[_a-zA-Z][\w-]*)/g
// A custom property is only DECLARED where a `:` follows the name. `var(--x)` and
// `var(--x, fallback)` never match, so declarations and references stay distinct.
const TOKEN_DECL = /(--[\w-]+)\s*:/g
const TOKEN_REF = /var\(\s*(--[\w-]+)/g

export const camel = (s) => s.replace(/[-_]+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase())

// Strip `ak-` namespace from keys (values keep it). `--` is also stripped so camel() doesn't produce `OtherColor`.
export const classKey = (className) => camel(className.replace(/^ak-/, ''))
export const tokenKey = (tokenName) => camel(tokenName.replace(/^--(?:ak-)?/, ''))

export function extractClasses(css) {
  const selectors = [...css.replace(COMMENTS, '').matchAll(RULE_PRELUDES)]
    .map((m) => m[1].trim())
    // at-rule preludes (`@media …`) are not selectors; rules nested inside them are
    // matched separately, each by its own `{`
    .filter((s) => s && !s.startsWith('@'))

  const classes = new Set()
  for (const selector of selectors) {
    for (const m of selector.matchAll(CLASS)) classes.add(m[1])
  }
  return [...classes]
}

/** Custom properties declared in the file, in source order. Themes redeclare the same
    names, so the result is deduped. */
export function extractTokens(css) {
  return [...new Set([...css.replace(COMMENTS, '').matchAll(TOKEN_DECL)].map((m) => m[1]))]
}

/** Custom properties the file reads through var(). Used to check every reference
    resolves — a missing one is silent in CSS, no compiler sees it. */
export function extractTokenRefs(css) {
  return [...new Set([...css.replace(COMMENTS, '').matchAll(TOKEN_REF)].map((m) => m[1]))]
}
