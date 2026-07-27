import { defineVariants } from '../lib/defineVariants'
import { button as m } from 'adminkit/generated-classes/button'

// Generated key→value manifest (like scss's `styles`): m.buttonPrimary = 'button--primary',
// typed literally → m.buttonPrimaryy is a compile error. No hand-written class strings.
const variant = { primary: m.buttonPrimary, secondary: m.buttonSecondary, ghost: m.buttonGhost }
const size = { sm: m.buttonSm, md: m.buttonMd, lg: m.buttonLg }

export const button = defineVariants(m.button, { variants: { variant, size }, defaultVariants: { size: 'md' } })

export type ButtonVariant = keyof typeof variant
export type ButtonSize = keyof typeof size
export type ButtonProps = {
  variant: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}
