/* Variant resolvers (cva / tailwind-variants stand-in), dependency-free.
   Plain resolvers: (props) => class string / parts object. Vue wraps them in a
   computed at the call site. Lives in @adminkit/vue because only Vue consumes it
   (Twig builds classes by convention; adminkit ships only css + type unions). */
type Values = Record<string, string>
type Keys<T> = 'true' extends keyof T ? boolean : keyof T
type Selection<V> = { [K in keyof V]?: Keys<V[K]> }
type Dict = Record<string, unknown>

const select = (props: Dict, keys: string[], defaults?: Dict): Dict => {
  const s: Dict = {}
  for (const k of keys) {
    const v = props[k] ?? defaults?.[k]
    if (v !== undefined) s[k] = v
  }
  return s
}
const matches = (s: Dict, cond: Dict): boolean =>
  Object.keys(cond).every((k) => String(s[k]) === String(cond[k]))

export function defineVariants<V extends Record<string, Values>>(
  base: string,
  config: {
    variants: V
    defaultVariants?: Selection<V>
    compoundVariants?: Array<Selection<V> & { class: string }>
  },
) {
  const keys = Object.keys(config.variants)
  return (props: Selection<V> = {}): string => {
    const s = select(props as Dict, keys, config.defaultVariants as Dict)
    const out = base ? [base] : []
    for (const k in s) {
      const cls = config.variants[k][String(s[k])]
      if (cls) out.push(cls)
    }
    for (const { class: cls, ...cond } of config.compoundVariants ?? []) {
      if (cls && matches(s, cond as Dict)) out.push(cls)
    }
    return out.join(' ')
  }
}

type PartsConfig<P> = Record<string, Record<string, Partial<Record<keyof P, string>>>>
export function defineParts<P extends Record<string, string>, V extends PartsConfig<P>>(config: {
  parts: P
  variants?: V
  defaultVariants?: Selection<V>
  compoundVariants?: Array<Selection<V> & { class: Partial<Record<keyof P, string>> }>
}) {
  const partKeys = Object.keys(config.parts) as (keyof P)[]
  const vKeys = Object.keys(config.variants ?? {})
  return (props: Selection<V> = {}): { [K in keyof P]: string } => {
    const s = select(props as Dict, vKeys, config.defaultVariants as Dict)
    const out = {} as { [K in keyof P]: string }
    for (const part of partKeys) {
      const cls: string[] = [config.parts[part]]
      for (const k in s) {
        const c = config.variants?.[k][String(s[k])]?.[part]
        if (c) cls.push(c)
      }
      for (const { class: cc, ...cond } of config.compoundVariants ?? []) {
        const pc = cc[part]
        if (pc && matches(s, cond as Dict)) cls.push(pc)
      }
      out[part] = cls.filter(Boolean).join(' ')
    }
    return out
  }
}
