import Providers from '@/providers/Providers';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { type Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { ModalProvider } from '@/components/ClientComponents/Modal/ModalProvider';
import SessionTimeoutProvider from '@/providers/SessionTimeoutProvider';
import { LoadingProvider } from '@/components/ClientComponents/Loading/LoadingProvider';
import GTM from '@/providers/GTM';
import OTPBypassBanner from '@/components/ClientComponents/OTPBypassBanner';
import Qualtrics from '@/components/ClientComponents/Qualtrics';

export const metadata: Metadata = {
  title: 'myRAC',
  formatDetection: { telephone: false }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  return (
    <html lang='en'>
      <Providers session={session}>
        <body>
          <AppRouterCacheProvider>
            <LoadingProvider>
              <ModalProvider>
                <SessionTimeoutProvider />
                <OTPBypassBanner />
                {children}
              </ModalProvider>
            </LoadingProvider>
          </AppRouterCacheProvider>
          <GTM gtmId={`${process.env.GTM_ID ?? ''}`} />
          <Qualtrics />
        </body>
      </Providers>
    </html>
  );
}
