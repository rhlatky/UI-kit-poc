// Pure css → class-name extraction, split out from gen-classes.mjs so it is testable.
//
// Classes are read ONLY from selector position. Scanning the whole file would also
// match any dot inside a declaration value — `url(./icons/star.svg)` yields `svg`,
// `font-family: "Arial.Narrow"` yields `Narrow` — and a phantom key is indistinguishable
// from a real one in the `as const` manifest, so `m.svg` would typecheck and render a
// class with no styling behind it.

const COMMENTS = /\/\*[\s\S]*?\*\//g
// Everything up to the `{` that opens a rule. `[^{};]*` cannot cross a `{`, `}` or `;`,
// so it starts at the previous boundary on its own — without consuming that boundary,
// which would make the regex skip a rule nested directly inside another (`@media { .x {`).
// Native nesting needs nothing extra: a nested prelude follows `{` or `;` like any other.
const RULE_PRELUDES = /([^{};]*)\{/g
const CLASS = /\.(-?[_a-zA-Z][\w-]*)/g

export const camel = (s) => s.replace(/[-_]+([a-zA-Z0-9])/g, (_, c) => c.toUpperCase())

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
