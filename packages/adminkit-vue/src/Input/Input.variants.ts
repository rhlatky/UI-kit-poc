import { defineParts } from 'adminkit/variants'
import type { InputClass } from 'adminkit/classes/input'

const cls = {
  field: 'field', label: 'field__label', input: 'field__input', msg: 'field__msg',
  disabled: 'field--disabled', inputInvalid: 'field__input--invalid', msgInvalid: 'field__msg--invalid',
} satisfies Record<string, InputClass>

export const field = defineParts({
  parts: { root: cls.field, label: cls.label, input: cls.input, msg: cls.msg },
  variants: {
    invalid: { true: { input: cls.inputInvalid, msg: cls.msgInvalid }, false: {} },
    disabled: { true: { root: cls.disabled }, false: {} },
  },
  defaultVariants: { invalid: false, disabled: false },
})
