export type Styles = {
  'button': string;
  'buttonGhost': string;
  'buttonLg': string;
  'buttonMd': string;
  'buttonPrimary': string;
  'buttonSecondary': string;
  'buttonSm': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
