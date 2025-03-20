"use client";

import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { FontAwesomeIcon as FAIcon } from "@fortawesome/react-fontawesome";

function FontAwesomeIcon(props: FontAwesomeIconProps) {
  return <FAIcon {...props} />;
}

export default FontAwesomeIcon;
