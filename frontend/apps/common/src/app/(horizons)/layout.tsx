import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { HorizonsProvider } from "#components/horizons/providers";
import Footer from "#components/horizons/rendering/footer";
import Masthead from "#components/horizons/rendering/masthead";
import { serverEnv } from "#env/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Horizons | RAC WA",
  description: "Horizons",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <HorizonsProvider>
        <Masthead />
        {children}
        <Footer />
        <GoogleTagManager gtmId={serverEnv().GTM_ID} />
      </HorizonsProvider>
    </html>
  );
}
