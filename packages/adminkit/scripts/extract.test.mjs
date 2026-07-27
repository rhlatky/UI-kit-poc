import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { camel, classKey, extractClasses, tokenKey } from './extract.mjs'

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
      'ak-button',
      'ak-button--sm',
      'ak-button--md',
      'ak-button--lg',
      'ak-button--primary',
      'ak-button--secondary',
      'ak-button--ghost',
      'ak-button--primary-lg',
    ])
    expect(extractClasses(read('card.css'))).toEqual(['ak-card', 'ak-card--elevated', 'ak-card--flat', 'ak-card__header', 'ak-card__body', 'ak-card__footer'])
    expect(extractClasses(read('input.css'))).toEqual([
      'ak-field',
      'ak-field--disabled',
      'ak-field__label',
      'ak-field__input',
      'ak-field__input--invalid',
      'ak-field__msg',
      'ak-field__msg--invalid',
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

// The manifest keys are the authoring surface, so the namespace must not leak into them:
// `m.buttonPrimary`, not `m.akButtonPrimary`.
describe('manifest keys', () => {
  it('strips the class namespace', () => {
    expect(classKey('ak-button')).toBe('button')
    expect(classKey('ak-button--primary-lg')).toBe('buttonPrimaryLg')
    expect(classKey('ak-field__input--invalid')).toBe('fieldInputInvalid')
  })

  it('strips the token namespace', () => {
    expect(tokenKey('--ak-color-primary')).toBe('colorPrimary')
    expect(tokenKey('--ak-space-1')).toBe('space1')
  })

  it('leaves a name without the namespace alone', () => {
    expect(classKey('legacy-button')).toBe('legacyButton')
    expect(tokenKey('--other-color')).toBe('otherColor')
  })

  it('every shipped class keeps a namespaced value and a clean key', () => {
    for (const className of extractClasses(read('button.css'))) {
      expect(className.startsWith('ak-')).toBe(true)
      expect(classKey(className).startsWith('ak')).toBe(false)
    }
  })
})
