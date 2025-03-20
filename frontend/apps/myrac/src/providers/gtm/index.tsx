"use client";

import type { GTMParams } from "node_modules/@next/third-parties/dist/types/google";
import { GoogleTagManager } from "@next/third-parties/google";

const GTM = (props: GTMParams) => {
  return (
    <div id="gtm-container">
      <GoogleTagManager {...props} />
    </div>
  );
};

export default GTM;
