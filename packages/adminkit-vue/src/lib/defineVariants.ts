import { resolveSelection, conditionMatches, type Selection, type Values, type PropBag } from './internal'

/** Resolve one class string from props (cva-equivalent). Returns a (props) => string. */
export function defineVariants<V extends Record<string, Values>>(
  base: string,
  config: {
    variants: V
    defaultVariants?: Selection<V>
    compoundVariants?: Array<Selection<V> & { class: string }>
  },
) {
  const variantNames = Object.keys(config.variants)

  return (props: Selection<V> = {}): string => {
    const selected = resolveSelection(props as PropBag, variantNames, config.defaultVariants as PropBag)
    const classes = base ? [base] : []

    for (const name in selected) {
      const className = config.variants[name][String(selected[name])]
      if (className) classes.push(className)
    }
    for (const { class: className, ...condition } of config.compoundVariants ?? []) {
      if (className && conditionMatches(selected, condition as PropBag)) classes.push(className)
    }
    return classes.join(' ')
  }
}
