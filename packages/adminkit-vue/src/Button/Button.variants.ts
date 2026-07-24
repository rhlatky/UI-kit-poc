import { defineVariants } from '../lib/defineVariants'
import type { ButtonClass } from 'adminkit/types/button'

// Class literals checked against the generated ButtonClass union. You'd write this
// variant→class map either way (cva/scss too) — here it doubles as the L2 check.
const variant = {
  primary: 'button--primary',
  secondary: 'button--secondary',
  ghost: 'button--ghost',
} satisfies Record<string, ButtonClass>
const size = {
  sm: 'button--sm',
  md: 'button--md',
  lg: 'button--lg',
} satisfies Record<string, ButtonClass>

export const button = defineVariants('button', { variants: { variant, size }, defaultVariants: { size: 'md' } })

export type ButtonVariant = keyof typeof variant
export type ButtonSize = keyof typeof size
export type ButtonProps = { variant: ButtonVariant; size?: ButtonSize; disabled?: boolean }
