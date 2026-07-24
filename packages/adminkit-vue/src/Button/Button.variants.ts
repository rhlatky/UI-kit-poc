import { defineVariants } from 'adminkit/variants'
import { button as c } from 'adminkit/classes/button'

// Class names come from adminkit's generated `as const` manifest (single source,
// same plain BEM strings as vanilla + Twig). `c.buttonPrimaryy` = compile error → L2.
const variant = { primary: c.buttonPrimary, secondary: c.buttonSecondary, ghost: c.buttonGhost }
const size = { sm: c.buttonSm, md: c.buttonMd, lg: c.buttonLg }

export const button = defineVariants(c.button, { variants: { variant, size }, defaultVariants: { size: 'md' } })

export type ButtonVariant = keyof typeof variant
export type ButtonSize = keyof typeof size
export type ButtonProps = { variant: ButtonVariant; size?: ButtonSize; disabled?: boolean }
