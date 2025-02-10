'use client';

import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider, type ThemeOptions } from '@mui/material';
import { themeOptions } from '@racwa/react-components';
import MuiTypography from './overrides/MuiTypography';
import { type PropsWithChildren } from 'react';

export const myRACThemeOptions: ThemeOptions = {
  ...themeOptions,
  typography: MuiTypography
};

export const theme = createTheme(myRACThemeOptions);

export const MyRACThemeProvider: React.FC<PropsWithChildren<Record<never, never>>> = ({ children }) => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </StyledEngineProvider>
);
