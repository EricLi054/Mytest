"use client";

import type { GTMParams } from "node_modules/@next/third-parties/dist/types/google";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GoogleTagManager } from "@next/third-parties/google";
import { logPageView } from "#utils/common/analyticsTagging";

const GTM = (props: GTMParams) => {
  const pathname = usePathname();
  const [gtmInitialised, setGtmInitialised] = useState(false);

  useEffect(() => {
    setGtmInitialised(true);
  }, []);

  useEffect(() => {
    if (gtmInitialised) {
      logPageView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return <GoogleTagManager {...props} />;
};

export default GTM;
