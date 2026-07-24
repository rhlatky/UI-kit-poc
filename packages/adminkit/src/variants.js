// Shared variant CORE (framework-agnostic, no dependencies). Single source of the
// props→class algorithm used by BOTH the vanilla DOM factories (this package) and
// @adminkit/vue (which wraps the returned resolver in a Vue computed).
function select(props, keys, defaults = {}) {
  const s = {}
  for (const k of keys) { const v = props[k] ?? defaults[k]; if (v !== undefined) s[k] = v }
  return s
}
const matches = (s, cond) => Object.keys(cond).every((k) => String(s[k]) === String(cond[k]))

export function defineVariants(base, { variants, defaultVariants = {}, compoundVariants = [] }) {
  const keys = Object.keys(variants)
  return (props = {}) => {
    const s = select(props, keys, defaultVariants)
    const out = base ? [base] : []
    for (const k in s) { const c = variants[k][s[k]]; if (c) out.push(c) }
    for (const { class: c, ...cond } of compoundVariants) if (c && matches(s, cond)) out.push(c)
    return out.join(' ')
  }
}

export function defineParts({ parts, variants = {}, defaultVariants = {}, compoundVariants = [] }) {
  const partKeys = Object.keys(parts)
  const vKeys = Object.keys(variants)
  return (props = {}) => {
    const s = select(props, vKeys, defaultVariants)
    const out = {}
    for (const part of partKeys) {
      const cls = [parts[part]]
      for (const k in s) { const c = variants[k]?.[s[k]]?.[part]; if (c) cls.push(c) }
      for (const { class: cc, ...cond } of compoundVariants) if (matches(s, cond) && cc?.[part]) cls.push(cc[part])
      out[part] = cls.filter(Boolean).join(' ')
    }
    return out
  }
}
