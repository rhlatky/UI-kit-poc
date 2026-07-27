import { resolveSelection, conditionMatches, type Selection, type PropBag } from './internal'

// variantName → variantValue → { part: class }
type PartsConfig<P> = Record<string, Record<string, Partial<Record<keyof P, string>>>>

/** Resolve a class string per named part (tailwind-variants `slots`). Returns a
    (props) => { [part]: string }. */
export function defineParts<P extends Record<string, string>, V extends PartsConfig<P>>(config: {
  parts: P
  variants?: V
  defaultVariants?: Selection<V>
  compoundVariants?: Array<Selection<V> & { class: Partial<Record<keyof P, string>> }>
}) {
  const partNames = Object.keys(config.parts) as (keyof P)[]
  const variantNames = Object.keys(config.variants ?? {})

  return (props: Selection<V> = {}): { [K in keyof P]: string } => {
    const selected = resolveSelection(props as PropBag, variantNames, config.defaultVariants as PropBag)
    const result = {} as { [K in keyof P]: string }

    for (const part of partNames) {
      const classes: string[] = [config.parts[part]]

      for (const name in selected) {
        const partClass = config.variants?.[name][String(selected[name])]?.[part]
        if (partClass) classes.push(partClass)
      }
      for (const { class: partClasses, ...condition } of config.compoundVariants ?? []) {
        const partClass = partClasses[part]
        if (partClass && conditionMatches(selected, condition as PropBag)) classes.push(partClass)
      }
      result[part] = classes.filter(Boolean).join(' ')
    }
    return result
  }
}
