import { defineParts } from '../lib/defineVariants'
import { card as m } from 'adminkit/generated-classes/card'

export const card = defineParts({
  parts: { root: m.card, header: m.cardHeader, body: m.cardBody, footer: m.cardFooter },
  variants: { variant: { elevated: { root: m.cardElevated }, flat: { root: m.cardFlat } } },
  defaultVariants: { variant: 'elevated' },
})

export type CardVariant = 'elevated' | 'flat'
export type CardProps = { variant?: CardVariant }
