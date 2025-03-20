"use client";

import type { Theme, ThemeOptions } from "@mui/material";
import type { PropsWithChildren } from "react";
import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";

import { theme as dsTheme } from "@racwa/react-components";

import MuiTypography from "./overrides/MuiTypography";

const theme = dsTheme as Theme;

export const myRACThemeOptions: ThemeOptions = {
  palette: theme.palette,
  typography: MuiTypography,
  shape: theme.shape,
  spacing: theme.spacing,
  breakpoints: theme.breakpoints,
  components: theme.components,
};

export const myRACTheme = createTheme(myRACThemeOptions);

type ThemeProviderProps = {
  injectFirst?: boolean;
} & PropsWithChildren;

export const MyRACThemeProvider: React.FC<ThemeProviderProps> = ({ injectFirst = true, children }) => (
  <StyledEngineProvider injectFirst={injectFirst}>
    <ThemeProvider theme={myRACTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </StyledEngineProvider>
);
