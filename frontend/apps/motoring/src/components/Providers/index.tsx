"use client";

import type { SessionProviderProps } from "next-auth/react";
import type { PropsWithChildren } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { SessionProvider } from "next-auth/react";

import { RacwaThemeProvider } from "@racwa/react-components";

type ProviderProps = PropsWithChildren & {
  sessionProps: Pick<SessionProviderProps, "session" | "basePath">;
};

export default function Providers({ sessionProps, children }: ProviderProps) {
  return (
    <SessionProvider {...sessionProps}>
      <RacwaThemeProvider>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </RacwaThemeProvider>
    </SessionProvider>
  );
}
