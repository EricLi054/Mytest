import type { Metadata } from "next";
import Analytics from "#components/Analytics";
import { Background } from "#components/Background";
import { Providers } from "#components/Providers";
import { getPageTitle } from "#utils/metadata";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: getPageTitle("Set up your digital identity"),
  description: "Sign up for a myRAC account.",
};

// TODO - Hydration mismatch error - Looks like it is occurring in Background component - https://react.dev/link/hydration-mismatch
export default async function RegisterLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(); // TODO - DED-2331 - This is always returning null session here which causes issues in the GQL requests for MFA
  return (
    <html lang="en">
      <Providers session={session}>
        <body
          style={{
            height: "100vh",
            width: "100vw",
          }}
        >
          <Analytics />
          <Background>{children}</Background>
        </body>
      </Providers>
    </html>
  );
}
