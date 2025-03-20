/* eslint-disable @typescript-eslint/consistent-type-definitions */
import "@mui/material";

import type { TypographyStyleOptions } from "@mui/material/styles/createTypography";

declare module "@mui/material" {
  interface TypographyVariants {
    small: TypographyStyleOptions;
    bodyArticle: TypographyStyleOptions;
    display2: TypographyStyleOptions;
    display3: TypographyStyleOptions;
    blockquote: TypographyStyleOptions;
    cite: TypographyStyleOptions;
    cardTitleSmall: TypographyStyleOptions;
    cardTitleLarge: TypographyStyleOptions;
    cardMetadata: TypographyStyleOptions;
    h2Product: TypographyStyleOptions;
    finePrint: TypographyStyleOptions;
  }

  interface TypographyVariantsOptions {
    small?: TypographyStyleOptions;
    bodyArticle?: TypographyStyleOptions;
    display2?: TypographyStyleOptions;
    display3?: TypographyStyleOptions;
    blockquote?: TypographyStyleOptions;
    cite?: TypographyStyleOptions;
    cardTitleSmall?: TypographyStyleOptions;
    cardTitleLarge?: TypographyStyleOptions;
    cardMetadata?: TypographyStyleOptions;
    h2Product?: TypographyStyleOptions;
    finePrint?: TypographyStyleOptions;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    small: true;
    bodyArticle: true;
    display2: true;
    display3: true;
    blockquote: true;
    cite: true;
    cardTitleSmall: true;
    cardTitleLarge: true;
    cardMetadata: true;
    h2Product: true;
    finePrint: true;
  }
}
