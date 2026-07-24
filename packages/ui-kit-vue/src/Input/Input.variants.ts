import { defineParts } from '../lib/defineVariants'
import styles from './Input.module.scss'

// BEM from @ui-kit/css → camelCased & typed (level-2). Parts = tv `slots`.
export const field = defineParts({
  parts: {
    root: styles.field,
    label: styles.fieldLabel,
    input: styles.fieldInput,
    msg: styles.fieldMsg,
  },
  variants: {
    invalid: {
      true: { input: styles.fieldInputInvalid, msg: styles.fieldMsgInvalid },
      false: {},
    },
    disabled: {
      true: { root: styles.fieldDisabled },
      false: {},
    },
  },
  defaultVariants: { invalid: false, disabled: false },
})
