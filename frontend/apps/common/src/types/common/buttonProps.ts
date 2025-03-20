import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

import type { CloudinaryImage } from "@racwa/ui";

export type ButtonProps = {
  longText: string;
  shortText?: string;
  link: string;
  icon: FontAwesomeIconProps;
  image?: CloudinaryImage[];
  variant: string;
  logoHoverColour?: string;
};
