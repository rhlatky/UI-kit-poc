import { defineVariants } from '../variants.js'
import { button as c } from '../classes/button.js'
export const buttonClass = defineVariants(c.button, {
  variants: {
    variant: { primary: c.buttonPrimary, secondary: c.buttonSecondary, ghost: c.buttonGhost },
    size: { sm: c.buttonSm, md: c.buttonMd, lg: c.buttonLg },
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
