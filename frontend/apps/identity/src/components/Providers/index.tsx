"use client";

import type { Session } from "next-auth";
import type { PropsWithChildren } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { SessionProvider } from "next-auth/react";

import { RacwaThemeProvider } from "@racwa/react-components";

type ProvidersProps = PropsWithChildren & {
  session: Session | null;
};

export function Providers({ session, children }: ProvidersProps) {
  return (
    <SessionProvider session={session} basePath={process.env.NEXT_PUBLIC_AUTH_BASE_PATH}>
      {/* TODO - Use clientEnv() to get var - Need to setup own API to provide them to the client (either on demand or during initialization)*/}
      <RacwaThemeProvider>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </RacwaThemeProvider>
    </SessionProvider>
  );
}
