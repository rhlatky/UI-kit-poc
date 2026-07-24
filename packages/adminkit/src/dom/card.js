import { defineParts } from '../variants.js'
import { card as c } from '../classes/card.js'
export const card = defineParts({
  parts: { root: c.card, header: c.cardHeader, body: c.cardBody, footer: c.cardFooter },
  variants: { variant: { elevated: { root: c.cardElevated }, flat: { root: c.cardFlat } } },
  defaultVariants: { variant: 'elevated' },
})
export function createCard({ variant = 'elevated', header, body = '', footer } = {}) {
  const s = card({ variant })
  const root = document.createElement('div'); root.className = s.root
  if (header) { const h = document.createElement('div'); h.className = s.header; h.textContent = header; root.append(h) }
  const b = document.createElement('div'); b.className = s.body; b.textContent = body; root.append(b)
  if (footer) { const f = document.createElement('div'); f.className = s.footer; f.textContent = footer; root.append(f) }
  return root
}
