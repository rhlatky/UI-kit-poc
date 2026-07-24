import { defineParts } from '../variants.js'
import { input as c } from '../classes/input.js'
export const field = defineParts({
  parts: { root: c.field, label: c.fieldLabel, input: c.fieldInput, msg: c.fieldMsg },
  variants: {
    invalid: { true: { input: c.fieldInputInvalid, msg: c.fieldMsgInvalid }, false: {} },
    disabled: { true: { root: c.fieldDisabled }, false: {} },
  },
  defaultVariants: { invalid: false, disabled: false },
})
export function createInput({ label, placeholder = '', error, hint, disabled = false, value = '' } = {}) {
  const s = field({ invalid: !!error, disabled })
  const wrap = document.createElement('div'); wrap.className = s.root
  if (label) { const l = document.createElement('label'); l.className = s.label; l.textContent = label; wrap.append(l) }
  const inp = document.createElement('input'); inp.className = s.input; inp.placeholder = placeholder; inp.value = value; inp.disabled = disabled; wrap.append(inp)
  const m = error || hint
  if (m) { const p = document.createElement('p'); p.className = s.msg; p.textContent = m; wrap.append(p) }
  return wrap
}
