"use client";

import type { PropsWithChildren } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import { RacwaThemeProvider } from "@racwa/react-components";

export function Providers({ children }: PropsWithChildren) {
  return (
    <RacwaThemeProvider>
      <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
    </RacwaThemeProvider>
  );
}
