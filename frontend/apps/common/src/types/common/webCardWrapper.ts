import type { CloudinaryImage } from "@racwa/ui";

import type { RichTextProps } from "./richTextProps";

export type ContentfulWebCardWrapper = {
  data: {
    rac_webCardWrapper: WebCardWrapperDetails;
  };
};

export type WebCardWrapperDetails = {
  heading: string;
  rendering: string;
  webCardsCollection: WebCardsCollection;
};

export type WebCardsCollection = {
  items: WebCardDetails[];
};

export type WebCardDetails = {
  sys: {
    id: string;
  };
  title: string;
  image: CloudinaryImage[];
  showRibbon: boolean;
  ribbonText: string | null;
  content: RichTextProps;
  extraInfoHeader: string | null;
  extraInfo: RichTextProps | null;
  buttonText: string | null;
  buttonLink: string | null;
};
