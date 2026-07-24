import { defineParts } from 'adminkit/variants'
import type { CardClass } from 'adminkit/classes/card'

const cls = {
  root: 'card', elevated: 'card--elevated', flat: 'card--flat',
  header: 'card__header', body: 'card__body', footer: 'card__footer',
} satisfies Record<string, CardClass>

export const card = defineParts({
  parts: { root: cls.root, header: cls.header, body: cls.body, footer: cls.footer },
  variants: { variant: { elevated: { root: cls.elevated }, flat: { root: cls.flat } } },
  defaultVariants: { variant: 'elevated' },
})

export type CardVariant = 'elevated' | 'flat'
export type CardProps = { variant?: CardVariant }
