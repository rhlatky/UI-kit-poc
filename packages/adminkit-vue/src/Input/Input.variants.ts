import { defineParts } from '../lib/defineVariants'
import { input as m } from 'adminkit/generated-classes/input'

export const field = defineParts({
  parts: { root: m.field, label: m.fieldLabel, input: m.fieldInput, msg: m.fieldMsg },
  variants: {
    invalid: { true: { input: m.fieldInputInvalid, msg: m.fieldMsgInvalid }, false: {} },
    disabled: { true: { root: m.fieldDisabled }, false: {} },
  },
  defaultVariants: { invalid: false, disabled: false },
})
