import type { CloudinaryAsset } from "@racwa/ui";

import type { Category } from "./category";

export type ContentfulCtaBanner = {
  data: {
    horizons_ctaBanner: ctaBannerProps;
  };
} | null;

export type ctaBannerProps = {
  title: string;
  image: CloudinaryAsset;
  contentPosition: "Left" | "Right";
  category: Category;
  heading: string;
  subtext: string;
  buttonText: string;
  buttonUrl: string;
};
