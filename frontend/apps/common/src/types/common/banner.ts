import type { CloudinaryImage } from "@racwa/ui";

import type { ButtonProps } from "./buttonProps";
import type { RichTextProps } from "./richTextProps";

export type ContentfulBanner = {
  data: {
    rac_banner: ComponentCollection;
  };
};

export type ComponentCollection = {
  heading: RichTextProps;
  links: ImageLinks | null;
  bannerImage: CloudinaryImage[];
};

export type ImageLinks = {
  items: ButtonProps[] | null;
};
