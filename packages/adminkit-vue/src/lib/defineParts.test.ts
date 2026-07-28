import { describe, expect, it } from 'vitest'
import { defineParts } from './defineParts'

const field = defineParts({
  parts: { root: 'field', input: 'field__input', msg: 'field__msg' },
  variants: {
    invalid: { true: { input: 'is-invalid', msg: 'msg-invalid' }, false: {} },
    disabled: { true: { root: 'is-disabled' }, false: {} },
  },
  defaultVariants: { invalid: false, disabled: false },
  compoundVariants: [{ invalid: true, disabled: true, class: { root: 'invalid-disabled' } }],
})

describe('defineParts', () => {
  it('returns base part classes with no variants active', () => {
    expect(field()).toEqual({ root: 'field', input: 'field__input', msg: 'field__msg' })
  })
  it('contributes a variant class to the right parts', () => {
    const s = field({ invalid: true })
    expect(s.input).toBe('field__input is-invalid')
    expect(s.msg).toBe('field__msg msg-invalid')
    expect(s.root).toBe('field')
  })
  it('a variant can target the root part', () => {
    expect(field({ disabled: true }).root).toBe('field is-disabled')
  })
  it('applies a compound part class only on a full match', () => {
    expect(field({ invalid: true, disabled: true }).root).toBe('field is-disabled invalid-disabled')
    expect(field({ invalid: true, disabled: false }).root).toBe('field')
  })
})
