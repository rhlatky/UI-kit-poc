import { defineVariants } from '../variants.js'
// Plain BEM literals (checked against ButtonClass on the TS side; vanilla is plain JS).
export const buttonClass = defineVariants('button', {
  variants: {
    variant: { primary: 'button--primary', secondary: 'button--secondary', ghost: 'button--ghost' },
    size: { sm: 'button--sm', md: 'button--md', lg: 'button--lg' },
  },
  defaultVariants: { size: 'md' },
})
export function createButton({ variant = 'primary', size = 'md', label = '', disabled = false } = {}) {
  const el = document.createElement('button')
  el.className = buttonClass({ variant, size })
  el.textContent = label
  el.disabled = !!disabled
  return el
}
