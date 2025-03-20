"use client";

import type { PropsWithChildren } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { GlobalStyles } from "#styles/globalStyles";

import { colors, typography } from "@racwa/styles";

import { fontFaces } from "./fontFaces";

const StagSans = "'Stag Sans Web', Helvetica, Arial, sans-serif";
const Stag = "Stag, sans-serif";
const SourceSerif4 = `'Source Serif 4', ${Stag}, 'serif'`;

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1248,
      xl: 1536,
    },
  },
  palette: {
    common: { black: "#000", white: "#fff" },
    mode: "light",
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
    primary: {
      main: "#0062B2",
      dark: "#0C376B",
    },
    grey: {
      "50": "#fafafa",
      "100": colors.subtleBg,
      "200": colors.racGrayLight,
      "300": colors.racGray,
      "400": "#bdbdbd",
      "500": colors.dieselLight,
      "600": "#757575",
      "700": colors.dieselDeep,
      "800": colors.dieselDeeper,
      "900": colors.dieselDeepest,
      A100: "#d5d5d5",
      A200: "#aaaaaa",
      A400: "#303030",
      A700: "#616161",
    },
  },
  spacing: 8,
  typography: {
    fontFamily: Stag,
    display2: {
      fontFamily: Stag,
      fontWeight: 500,
      color: "#3E3E3E",
      letterSpacing: 0.3,
      fontSize: 28,
      lineHeight: 1.2,
      marginBottom: 36,
      marginTop: 16,
      scrollMarginTop: "20px",
      "@media (min-width:900px)": {
        fontSize: 30,
      },
      "@media (min-width:1200px)": {
        fontSize: 44,
      },
    },
    // Class for headings. e.g. h2 in CTA feature
    display3: {
      fontFamily: Stag,
      fontWeight: 500,
      letterSpacing: 0.3,
      fontSize: 29,
      lineHeight: 1.2,
      marginBottom: 48,
      marginTop: 16,
      scrollMarginTop: "20px",
      "@media (min-width:900px)": {
        fontSize: 28,
      },
      "@media (min-width:1200px)": {
        fontSize: 41,
      },
    },
    h1: {
      fontFamily: Stag,
      fontWeight: 500,
      letterSpacing: 0.3,
      fontSize: 27,
      lineHeight: 1.2,
      marginBottom: 36,
      marginTop: 16,
      scrollMarginTop: "20px",
      "@media (min-width:900px)": {
        fontSize: 28,
      },
      "@media (min-width:1200px)": {
        fontSize: 41,
      },
    },
    h2: {
      fontFamily: Stag,
      fontWeight: 500,
      letterSpacing: 0.3,
      fontSize: 25,
      lineHeight: 1.2,
      marginBottom: 28,
      marginTop: 16,
      scrollMarginTop: "20px",
      "@media (min-width:900px)": {
        fontSize: 26,
      },
      "@media (min-width:1200px)": {
        fontSize: 36,
      },
    },
    h3: {
      fontFamily: StagSans,
      fontWeight: 600,
      fontSize: 20,
      lineHeight: 1.3,
      marginBottom: 28,
      marginTop: 16,
      scrollMarginTop: "20px",
      "@media (min-width:900px)": {
        fontSize: 21,
      },
      "@media (min-width:1200px)": {
        fontSize: 26,
      },
    },
    h4: {
      fontFamily: Stag,
      fontWeight: 500,
      letterSpacing: 0.3,
      fontSize: 18,
      lineHeight: 1.3,
      marginBottom: 28,
      marginTop: 16,
      scrollMarginTop: "20px",
      "@media (min-width:900px)": {
        fontSize: 19,
      },
      "@media (min-width:1200px)": {
        fontSize: 20,
      },
    },
    h5: {
      fontFamily: StagSans,
      fontWeight: 500,
      fontSize: 16,
      lineHeight: 1.4,
      marginBottom: 24,
      marginTop: 16,
      scrollMarginTop: "20px",
      "@media (min-width:900px)": {
        fontSize: 17,
      },
      "@media (min-width:1200px)": {
        fontSize: 17,
      },
    },
    h6: {
      fontFamily: StagSans,
      fontWeight: 400,
      textTransform: "uppercase",
      fontSize: 13,
      lineHeight: 1.3,
      marginBottom: 16,
      marginTop: 16,
      scrollMarginTop: "20px",
      "@media (min-width:900px)": {
        fontSize: 14,
      },
      "@media (min-width:1200px)": {
        fontSize: 15,
      },
    },
    // Sub-titles/Lead used in article hero
    subtitle1: {
      fontFamily: Stag,
      fontWeight: 400,
      "& b": {
        fontWeight: 500,
      },
      fontSize: 16,
      lineHeight: 1.5,
      marginBottom: 24,
      "@media (min-width:900px)": {
        fontSize: 17,
      },
      "@media (min-width:1200px)": {
        fontSize: 18,
      },
    },
    subtitle2: {
      fontFamily: StagSans,
      fontWeight: 500,
      "& b": {
        fontWeight: 500,
      },
      fontSize: 16,
      lineHeight: 1.5,
      marginBottom: 24,
      "@media (min-width:900px)": {
        fontSize: 17,
      },
      "@media (min-width:1200px)": {
        fontSize: 18,
      },
    },
    // Labels for categories etc. typically used in conjunction with a heading/title.
    overline: {
      fontFamily: StagSans,
      fontWeight: 600,
      fontSize: 14,
      letterSpacing: 0.1,
      lineHeight: 1.1,
      marginBottom: 0,
      marginTop: 0,
      textTransform: "none",
    },
    // Standard <p> and <small> styles
    body1: {
      fontFamily: StagSans,
      fontWeight: 400,
      "& b": {
        fontWeight: 500,
      },
      fontSize: 16,
      lineHeight: 1.5,
      marginBottom: 20,
      marginTop: 8,
      "@media (min-width:900px)": {
        fontSize: 17,
      },
      "@media (min-width:1200px)": {
        fontSize: 18,
      },
    },
    small: {
      fontFamily: StagSans,
      fontWeight: 400,
      "& b": {
        fontWeight: 500,
      },
      fontSize: 14,
      lineHeight: 1.2,
      marginBottom: 16,
      marginTop: 8,
      "@media (min-width:900px)": {
        fontSize: 15,
      },
      "@media (min-width:1200px)": {
        fontSize: 16,
      },
    },
    // <p> styles in Article body templates
    bodyArticle: {
      fontFamily: SourceSerif4,
      fontWeight: 350,
      "& b": {
        fontWeight: 450,
      },
      fontSize: 18,
      lineHeight: 2,
      marginBottom: 24,
      marginTop: 8,
      "@media (min-width:900px)": {
        fontSize: 19,
      },
      "@media (min-width:1200px)": {
        fontSize: 20,
      },
    },
    // Blockquote for article body, ref style sheet for more info
    blockquote: {
      fontFamily: SourceSerif4,
      fontWeight: 500,
      letterSpacing: -1,
      fontSize: 20,
      lineHeight: 1.6,
      marginBottom: 16,
      marginTop: 8,
      "@media (min-width:900px)": {
        fontSize: 22,
      },
      "@media (min-width:1200px)": {
        fontSize: 24,
      },
    },
    cite: {
      fontFamily: StagSans,
      fontWeight: 500,
      fontSize: 16,
      lineHeight: 1.3,
      "@media (min-width:900px)": {
        fontSize: 17,
      },
      "@media (min-width:1200px)": {
        fontSize: 18,
      },
    },
    // Titles for article lists
    cardTitleSmall: {
      fontFamily: Stag,
      fontWeight: 500,
      fontSize: 16,
      lineHeight: 1.3,
      marginBottom: 0,
      marginTop: 0,
    },
    // Titles for article cards
    cardTitleLarge: {
      fontFamily: Stag,
      fontWeight: 500,
      fontSize: 20,
      lineHeight: 1.3,
      marginBottom: 0,
      marginTop: 0,
    },
    // Card metadata for article cards e.g. Read time.
    cardMetadata: {
      fontFamily: StagSans,
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 1.1,
      marginBottom: 0,
      marginTop: 0,
    },
    // H2 in CTA product
    h2Product: {
      fontFamily: StagSans,
      fontWeight: 500,
      fontSize: 25,
      lineHeight: 1.2,
      marginBottom: 28,
      marginTop: 16,
      scrollMarginTop: "20px",
      "@media (min-width:900px)": {
        fontSize: 30,
      },
      "@media (min-width:1200px)": {
        fontSize: 36,
      },
    },
    finePrint: {
      fontFamily: StagSans,
      fontWeight: 300,
      fontSize: 15,
      "& b": {
        fontWeight: 400,
      },
      display: "block",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: fontFaces,
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: typography.fontFamily,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: "0px !important",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        colorPrimary: {
          color: "#0C376B",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          fontFamily: typography.fontFamily,
          borderRadius: 0,
          textTransform: "none",
          fontWeight: 600,
          backgroundColor: "#0062B2",
          height: 48,
        },
        outlinedPrimary: {
          fontFamily: typography.fontFamily,
          borderRadius: 0,
          textTransform: "none",
          fontWeight: 600,
          border: "2px solid #0062B2",
        },
        outlinedInherit: {
          fontFamily: typography.fontFamily,
          borderRadius: 0,
          textTransform: "none",
          fontWeight: 500,
        },
        text: {
          fontFamily: typography.fontFamily,
          textTransform: "none",
          fontSize: 17,
          fontWeight: 500,
          color: "#333333",
        },
        textSizeSmall: {
          fontFamily: typography.fontFamily,
          textTransform: "none",
          fontSize: 14,
          fontWeight: 400,
        },
        textSizeMedium: {
          fontFamily: typography.fontFamily,
          textTransform: "none",
          fontSize: 15,
          fontWeight: 500,
        },
        textPrimary: {
          color: "#FFFFFF",
        },
        textSecondary: {
          color: "#BCCDD9",
        },
      },
    },
  },
});

export function HorizonsProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouterCacheProvider>
        <body style={GlobalStyles.horizonsBody}>{children}</body>
      </AppRouterCacheProvider>
    </ThemeProvider>
  );
}
