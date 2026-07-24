import { defineParts } from '../lib/defineVariants'
import type { CardClass } from 'adminkit/types/card'

export const card = defineParts({
  parts: {
    root: 'card',
    header: 'card__header',
    body: 'card__body',
    footer: 'card__footer',
  } satisfies Record<string, CardClass>,
  variants: {
    variant: {
      elevated: { root: 'card--elevated' } satisfies Record<string, CardClass>,
      flat: { root: 'card--flat' } satisfies Record<string, CardClass>,
    },
  },
  defaultVariants: { variant: 'elevated' },
})

export type CardVariant = 'elevated' | 'flat'
export type CardProps = { variant?: CardVariant }
