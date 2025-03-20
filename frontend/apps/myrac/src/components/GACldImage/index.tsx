"use client";

import { logEvent } from "#utils/analyticsTagging";

import type { CustomCldImageProps } from "@racwa/ui";
import { CldImage } from "@racwa/ui";

export type CldImageProps = {
  googleAnalyticsDescription?: string;
} & CustomCldImageProps;

function GACldImage({ onClick, googleAnalyticsDescription, ...props }: CldImageProps) {
  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (googleAnalyticsDescription) {
      logEvent(googleAnalyticsDescription);
    }
    onClick?.(e);
  };
  return <CldImage {...props} onClick={handleClick} />;
}

export default GACldImage;
