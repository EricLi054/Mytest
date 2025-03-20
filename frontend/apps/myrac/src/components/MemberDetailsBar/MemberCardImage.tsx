"use client";

import { logEvent } from "#utils/analyticsTagging";

import { CldImage } from "@racwa/ui";

export type MemberCardImageProps = {
  cardColour?: string;
};

const MemberCardImage: React.FC<MemberCardImageProps> = ({ cardColour }) => {
  const cardImageSrc = cardColour ? `myRAC/card-${cardColour}-No-Text` : "myRAC/card-None";
  return (
    <CldImage
      fill
      src={cardImageSrc}
      alt={cardImageSrc}
      onClick={() => logEvent("Digital card icon click")}
      style={{ borderRadius: 3 }}
      data-testid="digital-card-icon"
    />
  );
};

export default MemberCardImage;
