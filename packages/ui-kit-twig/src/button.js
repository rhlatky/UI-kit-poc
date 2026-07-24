import { defineVariants } from './variants.js'

// Plain BEM classes straight from @ui-kit/css (same names the compiled ds css ships).
export const buttonClass = defineVariants('button', {
  variants: {
    variant: { primary: 'button--primary', secondary: 'button--secondary', ghost: 'button--ghost' },
    size: { sm: 'button--sm', md: 'button--md', lg: 'button--lg' },
  },
  defaultVariants: { size: 'md' },
})

// Vanilla DOM factory — no framework. Twig renders the static HTML; this JS is
// for enhancement / dynamic creation. Behavior/a11y would live here too.
export function createButton({ variant = 'primary', size = 'md', label = '', disabled = false } = {}) {
  const el = document.createElement('button')
  el.className = buttonClass({ variant, size })
  el.textContent = label
  el.disabled = !!disabled
  return el
}
