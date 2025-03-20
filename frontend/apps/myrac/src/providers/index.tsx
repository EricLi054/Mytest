"use client";

import { library } from "@fortawesome/fontawesome-svg-core";

import "@fortawesome/fontawesome-svg-core/styles.css";

import type { Session } from "next-auth";
import type { PropsWithChildren } from "react";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { MyRACThemeProvider } from "#theme";
import { SessionProvider } from "next-auth/react";

type ProviderProps = {
  session: Session | null;
} & PropsWithChildren;

export default function Providers({ session, children }: ProviderProps) {
  library.add(fas);
  library.add(fab);

  return (
    <SessionProvider session={session}>
      <MyRACThemeProvider>{children}</MyRACThemeProvider>
    </SessionProvider>
  );
}
