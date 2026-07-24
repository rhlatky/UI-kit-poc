import { defineParts } from 'adminkit/variants'
import styles from './Input.module.scss'

export const field = defineParts({
  parts: { root: styles.field, label: styles.fieldLabel, input: styles.fieldInput, msg: styles.fieldMsg },
  variants: {
    invalid: { true: { input: styles.fieldInputInvalid, msg: styles.fieldMsgInvalid }, false: {} },
    disabled: { true: { root: styles.fieldDisabled }, false: {} },
  },
  defaultVariants: { invalid: false, disabled: false },
})
