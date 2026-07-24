// Framework-agnostic variant → class resolver (plain JS).
// Same algorithm as @ui-kit/vue's defineVariants — this is the shareable CORE;
// the Vue package just adds the reactive/typed wrapper on top. Works over the
// PLAIN BEM class strings from @ui-kit/css (stable names, no build step).
export function defineVariants(base, { variants, defaultVariants = {}, compoundVariants = [] }) {
  return (props = {}) => {
    const out = base ? [base] : []
    const selected = {}
    for (const key of Object.keys(variants)) {
      const value = props[key] ?? defaultVariants[key]
      if (value === undefined) continue
      selected[key] = value
      const cls = variants[key][value]
      if (cls) out.push(cls)
    }
    for (const { class: cls, ...cond } of compoundVariants) {
      const ok = Object.keys(cond).every((k) => String(selected[k]) === String(cond[k]))
      if (cls && ok) out.push(cls)
    }
    return out.join(' ')
  }
}

// Multi-part variant resolver (tv `slots`) — vanilla. Mirrors @ui-kit/vue defineParts.
export function defineParts({ parts, variants = {}, defaultVariants = {}, compoundVariants = [] }) {
  const partKeys = Object.keys(parts)
  return (props = {}) => {
    const selected = {}
    for (const vk of Object.keys(variants)) {
      const v = props[vk] ?? defaultVariants[vk]
      if (v !== undefined) selected[vk] = v
    }
    const out = {}
    for (const part of partKeys) {
      const cls = [parts[part]]
      for (const vk of Object.keys(variants)) {
        if (selected[vk] === undefined) continue
        const c = variants[vk][selected[vk]]?.[part]
        if (c) cls.push(c)
      }
      for (const { class: cc, ...cond } of compoundVariants) {
        const ok = Object.keys(cond).every((k) => String(selected[k]) === String(cond[k]))
        if (ok && cc?.[part]) cls.push(cc[part])
      }
      out[part] = cls.filter(Boolean).join(' ')
    }
    return out
  }
}
