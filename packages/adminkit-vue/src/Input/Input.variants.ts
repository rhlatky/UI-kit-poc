/* EXAMPLE component — reference for the authoring pattern. Replace/extend as the DS grows. */
import { defineParts } from '../lib'
import { input as m } from 'adminkit/generated-classes/input'

export const field = defineParts({
  parts: { root: m.field, label: m.fieldLabel, input: m.fieldInput, msg: m.fieldMsg },
  variants: {
    invalid: { true: { input: m.fieldInputInvalid, msg: m.fieldMsgInvalid }, false: {} },
    disabled: { true: { root: m.fieldDisabled }, false: {} },
  },
  defaultVariants: { invalid: false, disabled: false },
})

export type InputProps = {
  label?: string
  hint?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  modelValue?: string
}
