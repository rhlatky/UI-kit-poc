import { defineVariants } from '../lib/defineVariants'
import styles from './Button.module.scss'

// BEM names from @ui-kit/css come through camelCased (button--primary → buttonPrimary),
// typed against the generated .d.ts → level-2 (typo = compile error).
const variant = {
  primary: styles.buttonPrimary,
  secondary: styles.buttonSecondary,
  ghost: styles.buttonGhost,
}
const size = { sm: styles.buttonSm, md: styles.buttonMd, lg: styles.buttonLg }

export const button = defineVariants(styles.button, {
  variants: { variant, size },
  defaultVariants: { size: 'md' },
})

export type ButtonVariant = keyof typeof variant
export type ButtonSize = keyof typeof size
export type ButtonProps = { variant: ButtonVariant; size?: ButtonSize; disabled?: boolean }
