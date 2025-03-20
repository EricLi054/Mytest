"use client";

import type { PersonSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";
import { logEvent } from "#utils/analyticsTagging";

import {
  StyledCardDetailsContainer,
  StyledCardFront,
  StyledDetailsContainer,
  StyledDetailsText,
  StyledMemberDisplayName,
  StyledRACBadge,
} from "./index.styled";

export type DigitalCardFrontProps = {
  person?: z.infer<typeof PersonSchema>;
  googleAnalyticsDescription?: string;
};

const DigitalCardFront: React.FC<DigitalCardFrontProps> = ({ person, googleAnalyticsDescription }) => {
  if (!person) {
    return null;
  }
  return (
    <StyledCardFront
      onClick={() => {
        if (googleAnalyticsDescription) logEvent(googleAnalyticsDescription);
      }}
    >
      <StyledRACBadge data-testid="rac-logo" />
      <StyledCardDetailsContainer>
        <StyledMemberDisplayName>
          {person.title} {person.firstName} {person.surname}
        </StyledMemberDisplayName>
        <StyledDetailsContainer>
          <StyledDetailsText variant="body1">
            Tier <strong>{person.cardColour}</strong>
          </StyledDetailsText>
          <StyledDetailsText variant="body1">
            Member number <strong>{person.racId}</strong>
          </StyledDetailsText>
        </StyledDetailsContainer>
      </StyledCardDetailsContainer>
    </StyledCardFront>
  );
};

export default DigitalCardFront;
