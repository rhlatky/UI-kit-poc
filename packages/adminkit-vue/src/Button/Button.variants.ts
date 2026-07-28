/* EXAMPLE — authoring pattern reference (css -> manifest -> defineVariants). */
import { defineVariants } from '../lib'
import { button as m } from 'adminkit/generated-classes/button'

const variant = { primary: m.buttonPrimary, secondary: m.buttonSecondary, ghost: m.buttonGhost }
const size = { sm: m.buttonSm, md: m.buttonMd, lg: m.buttonLg }

// Style defaults live here, not in withDefaults — see README.
export const button = defineVariants(m.button, {
  variants: { variant, size },
  defaultVariants: { variant: 'primary', size: 'md' },
  // compoundVariants EXAMPLE: class applied only when the full combo matches.
  compoundVariants: [{ variant: 'primary', size: 'lg', class: m.buttonPrimaryLg }],
})

export type ButtonVariant = keyof typeof variant
export type ButtonSize = keyof typeof size
export type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}
