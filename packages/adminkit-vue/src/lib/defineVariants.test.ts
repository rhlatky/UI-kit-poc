import { describe, expect, it } from 'vitest'
import { defineVariants } from './defineVariants'

const button = defineVariants('btn', {
  variants: {
    variant: { primary: 'v-primary', ghost: 'v-ghost' },
    size: { sm: 's-sm', md: 's-md', lg: 's-lg' },
    block: { true: 'is-block', false: '' }, // boolean variant; empty string skipped
  },
  defaultVariants: { size: 'md' },
  compoundVariants: [{ variant: 'primary', size: 'lg', class: 'primary-lg' }],
})

describe('defineVariants', () => {
  it('emits base only when no props', () => {
    expect(button()).toBe('btn s-md') // default size applied
  })
  it('applies a selected variant', () => {
    expect(button({ variant: 'primary' })).toBe('btn v-primary s-md')
  })
  it('prop overrides the default', () => {
    expect(button({ size: 'sm' })).toBe('btn s-sm')
  })
  it('skips empty class strings (block=false)', () => {
    expect(button({ block: false })).toBe('btn s-md')
    expect(button({ block: true })).toBe('btn s-md is-block')
  })
  it('applies a compound variant only on a full match', () => {
    expect(button({ variant: 'primary', size: 'lg' })).toBe('btn v-primary s-lg primary-lg')
    expect(button({ variant: 'primary', size: 'md' })).toBe('btn v-primary s-md')
    expect(button({ variant: 'ghost', size: 'lg' })).toBe('btn v-ghost s-lg')
  })
})
