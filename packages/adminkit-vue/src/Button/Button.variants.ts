/* EXAMPLE component — reference for the authoring pattern (css → generated
   manifest → defineVariants). Not a fixed API; replace/extend as the DS grows. */
import { defineVariants } from '../lib'
import { button as m } from 'adminkit/generated-classes/button'

const variant = { primary: m.buttonPrimary, secondary: m.buttonSecondary, ghost: m.buttonGhost }
const size = { sm: m.buttonSm, md: m.buttonMd, lg: m.buttonLg }

export const button = defineVariants(m.button, {
  variants: { variant, size },
  defaultVariants: { size: 'md' },
  // compoundVariants EXAMPLE: a class applied ONLY when the whole combo matches.
  //   button({ variant: 'primary', size: 'lg' }) → "button button--primary button--lg button--primary-lg"
  //   button({ variant: 'primary', size: 'md' }) → "button button--primary button--md"   (no compound)
  compoundVariants: [{ variant: 'primary', size: 'lg', class: m.buttonPrimaryLg }],
})

export type ButtonVariant = keyof typeof variant
export type ButtonSize = keyof typeof size
export type ButtonProps = {
  variant: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}
