import { defineVariants } from 'adminkit/variants'
import type { ButtonClass } from 'adminkit/types/button'

// Class literals, checked against the generated ButtonClass union (single source
// = css). Typo in a value → compile error; `cls.xy` typo → compile error. L2, no
// runtime manifest (cls compiles into this component).
const cls = {
  root: 'button', sm: 'button--sm', md: 'button--md', lg: 'button--lg',
  primary: 'button--primary', secondary: 'button--secondary', ghost: 'button--ghost',
} satisfies Record<string, ButtonClass>

const variant = { primary: cls.primary, secondary: cls.secondary, ghost: cls.ghost }
const size = { sm: cls.sm, md: cls.md, lg: cls.lg }

export const button = defineVariants(cls.root, { variants: { variant, size }, defaultVariants: { size: 'md' } })

export type ButtonVariant = keyof typeof variant
export type ButtonSize = keyof typeof size
export type ButtonProps = { variant: ButtonVariant; size?: ButtonSize; disabled?: boolean }
