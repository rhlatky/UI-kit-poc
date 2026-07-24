export type Styles = {
  'field': string;
  'fieldDisabled': string;
  'fieldInput': string;
  'fieldInputInvalid': string;
  'fieldLabel': string;
  'fieldMsg': string;
  'fieldMsgInvalid': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
