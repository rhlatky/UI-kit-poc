/* Dependency-free variant helpers — a stand-in for cva AND tailwind-variants.
   Type-safe, single-source variants — including tailwind-variants' `slots`
   (here "parts") — with no third-party dependency.

   - defineVariants: single class string per component (cva-equivalent)
   - defineParts:    named parts (root/label/…) in one definition (tv `slots`)
   - compoundVariants: extra classes applied only when a COMBINATION of variant
     values matches (cva/tv parity) — e.g. variant=primary AND size=lg.
   - Vue-native: call with a GETTER (`button(() => props)`) → reactive output
     (a ComputedRef, or a reactive parts object) — no manual computed() needed.
     Call with a plain object → plain string / accessor object (framework-
     agnostic; handy for unit tests without a Vue scope).
   - Enum variant keys → prop type is their union ('primary' | 'ghost');
     boolean variant keys ('true'/'false') → prop type is boolean.
   - Empty class strings are skipped (lets a framework "default" state map to '').

   Perf: the variant-key list is precomputed once per definition (closure), and
   classes are pushed only when non-empty — so no per-call Object.keys or filter
   allocation. */

import { computed, reactive, type ComputedRef } from 'vue'

type Values = Record<string, string>
// enum keys → union of keys; 'true'/'false' keys → boolean
type Keys<T> = 'true' extends keyof T ? boolean : keyof T
type Selection<V> = { [K in keyof V]?: Keys<V[K]> }
type Dict = Record<string, unknown>

// The effective selection: the prop value, else the default, for every variant.
// `keys` is precomputed once by the caller. Shared by both helpers so
// default-resolution lives in one place.
const select = (props: Dict, keys: string[], defaults?: Dict): Dict => {
  const selected: Dict = {}
  for (const key of keys) {
    const value = props[key] ?? defaults?.[key]
    if (value !== undefined) {
      selected[key] = value
    }
  }
  return selected
}

// Does the effective selection satisfy every key of a compound condition?
const matches = (selected: Dict, cond: Dict): boolean => {
  return Object.keys(cond).every((k) => String(selected[k]) === String(cond[k]))
}

// --- defineVariants: resolves to one class string -------------------------
export function defineVariants<V extends Record<string, Values>>(
  base: string,
  config: {
    variants: V
    defaultVariants?: Selection<V>
    // Each entry: a partial selection + the class to add when it fully matches.
    compoundVariants?: Array<Selection<V> & { class: string }>
  },
) {
  const keys = Object.keys(config.variants)
  const resolve = (props: Selection<V> = {}): string => {
    const selected = select(props as Dict, keys, config.defaultVariants as Dict)
    const out = base ? [base] : []
    for (const key in selected) {
      const cls = config.variants[key][String(selected[key])]
      if (cls) {
        out.push(cls)
      }
    }
    for (const { class: cls, ...cond } of config.compoundVariants ?? []) {
      if (cls && matches(selected, cond as Dict)) {
        out.push(cls)
      }
    }
    return out.join(' ')
  }
  // Getter → reactive ComputedRef<string>; plain object → string.
  // Plain overload LAST so `VariantProps<typeof button>` infers the plain shape.
  function variants(source: () => Selection<V>): ComputedRef<string>
  function variants(props?: Selection<V>): string
  function variants(input?: Selection<V> | (() => Selection<V>)) {
    return typeof input === 'function' ? computed(() => resolve(input())) : resolve(input)
  }
  return variants
}

// --- defineParts: named parts, the tv `slots` feature ---------------------
// "parts" (not "slots") avoids clashing with Vue's <slot> content projection.
// variantName → variantValue → { part: class }
type PartsConfig<P> = Record<string, Record<string, Partial<Record<keyof P, string>>>>

export function defineParts<P extends Record<string, string>, V extends PartsConfig<P>>(config: {
  parts: P
  variants?: V
  defaultVariants?: Selection<V>
  // Compound: a partial selection + per-part classes to add when it matches.
  compoundVariants?: Array<Selection<V> & { class: Partial<Record<keyof P, string>> }>
}) {
  const partKeys = Object.keys(config.parts) as (keyof P)[]
  const variantKeys = Object.keys(config.variants ?? {})
  const buildPart = (part: keyof P, props: Selection<V>): string => {
    const selected = select(props as Dict, variantKeys, config.defaultVariants as Dict)
    const out: string[] = [config.parts[part]]
    for (const key in selected) {
      const cls = config.variants?.[key][String(selected[key])]?.[part]
      if (cls) {
        out.push(cls)
      }
    }
    for (const { class: cls, ...cond } of config.compoundVariants ?? []) {
      const partCls = cls[part]
      if (partCls && matches(selected, cond as Dict)) {
        out.push(partCls)
      }
    }
    return out.join(' ')
  }
  // Getter → reactive object of live part strings (bind `s.root` directly).
  // Plain object → object of accessor functions. Plain overload LAST (see above).
  function parts(source: () => Selection<V>): { [K in keyof P]: string }
  function parts(props?: Selection<V>): { [K in keyof P]: () => string }
  function parts(input?: Selection<V> | (() => Selection<V>)) {
    if (typeof input === 'function') {
      const refs = {} as { [K in keyof P]: ComputedRef<string> }
      for (const part of partKeys) {
        refs[part] = computed(() => buildPart(part, input()))
      }
      return reactive(refs) as { [K in keyof P]: string }
    }
    const acc = {} as { [K in keyof P]: () => string }
    for (const part of partKeys) {
      acc[part] = () => buildPart(part, input ?? {})
    }
    return acc
  }
  return parts
}

// Derive prop value types from a defineVariants()/defineParts() result
// (mirrors cva's / tailwind-variants' VariantProps).
export type VariantProps<F extends (...args: never[]) => unknown> = F extends (
  props?: infer P,
) => unknown
  ? NonNullable<P>
  : never
