'use client';

import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { type PropsWithChildren } from 'react';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { MyRACThemeProvider } from '@/theme';
config.autoAddCss = false;

interface ProviderProps extends PropsWithChildren {
  session: Session | null;
}

export default function Providers({ session, children }: ProviderProps) {
  library.add(fas);
  library.add(fab);

  return (
    <SessionProvider session={session}>
      <MyRACThemeProvider>{children}</MyRACThemeProvider>
    </SessionProvider>
  );
}
