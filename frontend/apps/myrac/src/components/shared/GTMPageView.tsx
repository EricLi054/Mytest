"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logPageView } from "#utils/analyticsTagging";

export const GTMPageView = () => {
  const path = usePathname();

  useEffect(() => {
    logPageView();
  }, [path]);

  return null;
};
