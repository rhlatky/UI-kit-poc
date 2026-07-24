import { defineParts } from 'adminkit/variants'
import { input as c } from 'adminkit/classes/input'

export const field = defineParts({
  parts: { root: c.field, label: c.fieldLabel, input: c.fieldInput, msg: c.fieldMsg },
  variants: {
    invalid: { true: { input: c.fieldInputInvalid, msg: c.fieldMsgInvalid }, false: {} },
    disabled: { true: { root: c.fieldDisabled }, false: {} },
  },
  defaultVariants: { invalid: false, disabled: false },
})
