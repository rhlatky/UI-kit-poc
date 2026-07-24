export type Styles = {
  'card': string;
  'cardBody': string;
  'cardElevated': string;
  'cardFlat': string;
  'cardFooter': string;
  'cardHeader': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
