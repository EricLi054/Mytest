import type { Metadata } from "next";
import OTPBypassBanner from "#components/OTPBypassBanner";
import { clientEnv } from "#env/client";
import { serverEnv } from "#env/server";
import { EnvironmentVariableProvider } from "#providers/environmentVariables";
import GTM from "#providers/gtm";
import { LoadingProvider } from "#providers/loading";
import { ModalProvider } from "#providers/modal";
import Qualtrics from "#providers/qualtrics";
import SessionTimeoutProvider from "#providers/sessionTimeout";

export const metadata: Metadata = {
  title: "myRAC",
  formatDetection: { telephone: false },
};

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EnvironmentVariableProvider variables={clientEnv()}>
        <LoadingProvider>
          <ModalProvider>
            <SessionTimeoutProvider />
            <OTPBypassBanner />
            {children}
          </ModalProvider>
        </LoadingProvider>
      </EnvironmentVariableProvider>
      <GTM gtmId={serverEnv().GTM_ID} />
      <Qualtrics />
    </>
  );
}
