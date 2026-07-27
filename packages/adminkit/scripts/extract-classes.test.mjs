import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { camel, extractClasses } from './extract-classes.mjs'

const cssDir = join(dirname(fileURLToPath(import.meta.url)), '../src/css')
const read = (f) => readFileSync(join(cssDir, f), 'utf8')

describe('extractClasses', () => {
  it('reads block, element and modifier classes', () => {
    expect(extractClasses('.card { color: red; } .card__body { padding: 0; }')).toEqual(['card', 'card__body'])
  })

  it('reads modifiers written as native nesting', () => {
    const css = `.button {
      color: red;
      &.button--primary { color: blue; }
      &:hover:not(:disabled) { color: green; }
    }`
    expect(extractClasses(css)).toEqual(['button', 'button--primary'])
  })

  it('ignores dots inside declaration values', () => {
    const css = `.badge {
      background: url(./icons/star.svg) no-repeat;
      font-family: "Arial.Narrow", sans-serif;
      transition: opacity .15s;
      &.badge--ok { color: green; }
    }`
    expect(extractClasses(css)).toEqual(['badge', 'badge--ok'])
  })

  it('reads classes nested in an at-rule but not the at-rule prelude', () => {
    expect(extractClasses('@media (min-width: 40rem) { .grid { display: grid; } }')).toEqual(['grid'])
  })

  it('ignores classes in comments', () => {
    expect(extractClasses('/* .commented-out {} */ .real { color: red; }')).toEqual(['real'])
  })

  it('splits a selector list and dedupes repeats', () => {
    expect(extractClasses('.a, .b { color: red; } .a { color: blue; }')).toEqual(['a', 'b'])
  })

  it('matches the shipped css exactly', () => {
    expect(extractClasses(read('button.css'))).toEqual([
      'button',
      'button--sm',
      'button--md',
      'button--lg',
      'button--primary',
      'button--secondary',
      'button--ghost',
      'button--primary-lg',
    ])
    expect(extractClasses(read('card.css'))).toEqual(['card', 'card--elevated', 'card--flat', 'card__header', 'card__body', 'card__footer'])
    expect(extractClasses(read('input.css'))).toEqual([
      'field',
      'field--disabled',
      'field__label',
      'field__input',
      'field__input--invalid',
      'field__msg',
      'field__msg--invalid',
    ])
  })
})

describe('camel', () => {
  it('camelCases BEM separators', () => {
    expect(camel('button--primary')).toBe('buttonPrimary')
    expect(camel('field__input--invalid')).toBe('fieldInputInvalid')
    expect(camel('button--primary-lg')).toBe('buttonPrimaryLg')
    expect(camel('card')).toBe('card')
  })
})
