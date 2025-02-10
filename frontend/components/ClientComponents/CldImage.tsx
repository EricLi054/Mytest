/* eslint-disable jsx-a11y/alt-text */
'use client';

import { logEvent } from '@/utilities/analyticsTagging';
import { cloudinaryConfig } from '@/utilities/cloudinaryConfig';
import { CldImage as Image, type CldImageProps as CloudinaryImageProps } from 'next-cloudinary';

export interface CldImageProps extends CloudinaryImageProps {
  googleAnalyticsDescription?: string;
}

function CldImage({ onClick, googleAnalyticsDescription, ...props }: CldImageProps) {
  const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (googleAnalyticsDescription) {
      logEvent(googleAnalyticsDescription);
    }
    onClick?.(e);
  };
  return <Image {...props} config={cloudinaryConfig} onClick={handleClick} />;
}

export default CldImage;
