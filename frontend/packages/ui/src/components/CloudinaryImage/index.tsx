"use client";

import type { CldImageProps } from "next-cloudinary";
import { CldImage as Image } from "next-cloudinary";

export type CustomCldImageProps = {
  environmentPath?: string;
} & CldImageProps;

export const CldImage = ({ environmentPath = "", ...props }: CustomCldImageProps) => {
  return (
    <Image
      {...props}
      config={{
        url: {
          secureDistribution: `res.rac.com.au${environmentPath}`,
          privateCdn: true,
        },
      }}
      format="auto"
    />
  );
};
