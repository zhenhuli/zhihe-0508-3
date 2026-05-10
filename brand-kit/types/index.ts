export interface Color {
  id: string;
  name: string;
  value: string;
  description?: string;
}

export interface ColorPalette {
  primary: Color[];
  secondary: Color[];
  neutral: Color[];
}

export interface FontSpec {
  id: string;
  name: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  lineHeight: string;
  letterSpacing?: string;
  description?: string;
}

export interface BrandKit {
  colors: ColorPalette;
  fonts: FontSpec[];
}
