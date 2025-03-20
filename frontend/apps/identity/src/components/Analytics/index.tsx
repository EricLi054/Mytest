"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { GoogleTagManager } from "@next/third-parties/google";

import { gtm, virtualPageView } from "@racwa/analytics";

export default function Analytics() {
  const pathname = usePathname();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID ?? "";
  // TODO - Use clientEnv() to get var - Need to setup own API to provide them to the client (either on demand or during initialization)

  useEffect(() => {
    gtm(
      virtualPageView({
        url: window.location.pathname,
        title: document.title,
      }),
    );
  }, [pathname]);

  return <GoogleTagManager gtmId={gtmId} />;
}
