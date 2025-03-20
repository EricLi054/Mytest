import type { BoxProps } from "@mui/material";
import React from "react";

import type { AnimatedDigitalCardProps } from ".";
import DigitalCardBack from "../DigitalCardBack";
import DigitalCardFront from "../DigitalCardFront";
import { StyledCard, StyledCardBack, StyledCardFront, StyledCardInner } from "./index.styled";

export type AnimatedDigitalCardInternalProps = {
  showBarcode: boolean;
} & BoxProps &
  AnimatedDigitalCardProps;

const AnimatedDigitalCardInternal: React.FC<AnimatedDigitalCardInternalProps> = ({ person, showBarcode, ...rest }) => {
  if (!person) {
    console.error("No person information provided");
    return null;
  }

  return (
    <StyledCard data-testid="flippable-card" {...rest}>
      <StyledCardInner showBarcode={showBarcode}>
        <StyledCardFront>
          <DigitalCardFront person={person} />
        </StyledCardFront>
        <StyledCardBack>
          <DigitalCardBack membershipCardNumber={person.membershipCardNumber ?? ""} />
        </StyledCardBack>
      </StyledCardInner>
    </StyledCard>
  );
};

export default AnimatedDigitalCardInternal;
