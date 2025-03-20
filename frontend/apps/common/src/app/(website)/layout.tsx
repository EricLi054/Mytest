import type { Metadata } from "next";
import { Providers } from "#components/common/Providers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Website | RAC WA",
  description: "Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body style={{ height: "100vh", backgroundColor: "white" }}>{children}</body>
      </Providers>
    </html>
  );
}
