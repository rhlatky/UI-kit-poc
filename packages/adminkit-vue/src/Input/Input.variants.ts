import { defineParts } from '../lib/defineVariants'
import type { InputClass } from 'adminkit/types/input'

export const field = defineParts({
  parts: {
    root: 'field',
    label: 'field__label',
    input: 'field__input',
    msg: 'field__msg',
  } satisfies Record<string, InputClass>,
  variants: {
    invalid: {
      true: { input: 'field__input--invalid', msg: 'field__msg--invalid' } satisfies Record<string, InputClass>,
      false: {},
    },
    disabled: {
      true: { root: 'field--disabled' } satisfies Record<string, InputClass>,
      false: {},
    },
  },
  defaultVariants: { invalid: false, disabled: false },
})
