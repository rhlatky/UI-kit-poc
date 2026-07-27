/* EXAMPLE component — reference for the authoring pattern (css → generated
   manifest → defineVariants). Not a fixed API; replace/extend as the DS grows. */
import { defineVariants } from '../lib'
import { button as m } from 'adminkit/generated-classes/button'

const variant = { primary: m.buttonPrimary, secondary: m.buttonSecondary, ghost: m.buttonGhost }
const size = { sm: m.buttonSm, md: m.buttonMd, lg: m.buttonLg }

// defaultVariants is the ONE place a style default is written. Components must not
// repeat it in withDefaults: the prop would then always be defined and the resolver
// would never consult its own default, so the two literals could drift apart while
// only the prop one had any effect. Non-Vue callers (Twig class building, tests) get
// the same defaults for free.
export const button = defineVariants(m.button, {
  variants: { variant, size },
  defaultVariants: { variant: 'primary', size: 'md' },
  // compoundVariants EXAMPLE: a class applied ONLY when the whole combo matches.
  //   button({ variant: 'primary', size: 'lg' }) → "button button--primary button--lg button--primary-lg"
  //   button({ variant: 'primary', size: 'md' }) → "button button--primary button--md"   (no compound)
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
