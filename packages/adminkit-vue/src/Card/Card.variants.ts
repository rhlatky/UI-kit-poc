import { defineParts } from 'adminkit/variants'
import { card as c } from 'adminkit/classes/card'

export const card = defineParts({
  parts: { root: c.card, header: c.cardHeader, body: c.cardBody, footer: c.cardFooter },
  variants: { variant: { elevated: { root: c.cardElevated }, flat: { root: c.cardFlat } } },
  defaultVariants: { variant: 'elevated' },
})

export type CardVariant = 'elevated' | 'flat'
export type CardProps = { variant?: CardVariant }
