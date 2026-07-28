/* Shared internals for defineVariants / defineParts (not public API). */
export type Values = Record<string, string>

// enum keys → union of keys; 'true'/'false' keys → boolean
export type VariantKeys<T> = 'true' extends keyof T ? boolean : keyof T
export type Selection<V> = { [K in keyof V]?: VariantKeys<V[K]> }

export type PropBag = Record<string, unknown>

/** Effective selection: the prop value, else the default, for every variant. */
export function resolveSelection(props: PropBag, variantNames: string[], defaults?: PropBag): PropBag {
  const selected: PropBag = {}
  for (const name of variantNames) {
    const value = props[name] ?? defaults?.[name]
    if (value !== undefined) selected[name] = value
  }
  return selected
}

/** Does the selection satisfy every key of a compound-variant condition? */
export function conditionMatches(selected: PropBag, condition: PropBag): boolean {
  return Object.keys(condition).every((name) => String(selected[name]) === String(condition[name]))
}
