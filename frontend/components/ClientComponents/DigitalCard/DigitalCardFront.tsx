'use client';
import { type PersonInformation } from '@/types/backendTypes/personInformation';
import {
  StyledCardFront,
  StyledCardDetailsContainer,
  StyledMemberDisplayName,
  StyledDetailsContainer,
  StyledDetailsText,
  StyledRACBadge
} from './DigitalCardFront.styled';
import { logEvent } from '@/utilities/analyticsTagging';

export interface DigitalCardFrontProps {
  person?: PersonInformation;
  googleAnalyticsDescription?: string;
}
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
      <StyledRACBadge data-testid='rac-logo' />
      <StyledCardDetailsContainer>
        <StyledMemberDisplayName>
          {person?.title} {person?.firstName} {person?.surname}
        </StyledMemberDisplayName>
        <StyledDetailsContainer>
          <StyledDetailsText variant='body1'>
            Tier <strong>{person?.cardColour}</strong>
          </StyledDetailsText>
          <StyledDetailsText variant='body1'>
            Member number <strong>{person?.racId}</strong>
          </StyledDetailsText>
        </StyledDetailsContainer>
      </StyledCardDetailsContainer>
    </StyledCardFront>
  );
};

export default DigitalCardFront;
