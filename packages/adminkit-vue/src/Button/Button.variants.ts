import { defineVariants } from 'adminkit/variants'
import styles from './Button.module.scss'

const variant = { primary: styles.buttonPrimary, secondary: styles.buttonSecondary, ghost: styles.buttonGhost }
const size = { sm: styles.buttonSm, md: styles.buttonMd, lg: styles.buttonLg }

// Shared CORE resolver from `adminkit` — one algorithm for vanilla + Vue.
export const button = defineVariants(styles.button, {
  variants: { variant, size },
  defaultVariants: { size: 'md' },
})

export type ButtonVariant = keyof typeof variant
export type ButtonSize = keyof typeof size
export type ButtonProps = { variant: ButtonVariant; size?: ButtonSize; disabled?: boolean }
