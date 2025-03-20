import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Providers from "#providers";
import { getServerSession } from "next-auth/next";

// TODO: Bring over tests

export const metadata: Metadata = {
  title: "myRAC",
  formatDetection: { telephone: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <Providers session={session}>
        <body>
          <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
        </body>
      </Providers>
    </html>
  );
}
