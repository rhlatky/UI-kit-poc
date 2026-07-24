import { defineParts } from '../lib/defineVariants'
import styles from './Card.module.scss'

export const card = defineParts({
  parts: {
    root: styles.card,
    header: styles.cardHeader,
    body: styles.cardBody,
    footer: styles.cardFooter,
  },
  variants: {
    variant: { elevated: { root: styles.cardElevated }, flat: { root: styles.cardFlat } },
  },
  defaultVariants: { variant: 'elevated' },
})

export type CardVariant = 'elevated' | 'flat'
export type CardProps = { variant?: CardVariant }
