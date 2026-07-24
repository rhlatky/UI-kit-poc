import { defineParts } from './variants.js'

export const card = defineParts({
  parts: { root: 'card', header: 'card__header', body: 'card__body', footer: 'card__footer' },
  variants: { variant: { elevated: { root: 'card--elevated' }, flat: { root: 'card--flat' } } },
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
