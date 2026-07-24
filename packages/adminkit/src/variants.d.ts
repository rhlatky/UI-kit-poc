type Values = Record<string, string>
type Keys<T> = 'true' extends keyof T ? boolean : keyof T
export type Selection<V> = { [K in keyof V]?: Keys<V[K]> }

export declare function defineVariants<V extends Record<string, Values>>(
  base: string,
  config: {
    variants: V
    defaultVariants?: Selection<V>
    compoundVariants?: Array<Selection<V> & { class: string }>
  },
): (props?: Selection<V>) => string

type PartsConfig<P> = Record<string, Record<string, Partial<Record<keyof P, string>>>>
export declare function defineParts<P extends Record<string, string>, V extends PartsConfig<P>>(config: {
  parts: P
  variants?: V
  defaultVariants?: Selection<V>
  compoundVariants?: Array<Selection<V> & { class: Partial<Record<keyof P, string>> }>
}): (props?: Selection<V>) => { [K in keyof P]: string }

export type VariantProps<F extends (...a: never[]) => unknown> = F extends (p?: infer P) => unknown
  ? NonNullable<P>
  : never
