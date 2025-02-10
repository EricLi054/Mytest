import React from 'react';
import DigitalCardFront from './DigitalCardFront';
import DigitalCardBack from './DigitalCardBack';
import { StyledCard, StyledCardBack, StyledCardFront, StyledCardInner } from './FlippableDigitalCard.styled';
import { type PersonInformation } from '@/types/backendTypes/personInformation';
import { type BoxProps } from '@mui/material';

export interface FlippableDigitalCardProps extends BoxProps {
  showBarcode: boolean;
  person?: PersonInformation;
}

const FlippableDigitalCard: React.FC<FlippableDigitalCardProps> = ({ showBarcode, person, ...rest }) => {
  if (!person) {
    console.error('No person information provided');
    return null;
  }

  return (
    <StyledCard data-testid='flippable-card' {...rest}>
      <StyledCardInner showBarcode={showBarcode}>
        <StyledCardFront>
          <DigitalCardFront person={person} />
        </StyledCardFront>
        <StyledCardBack>
          <DigitalCardBack membershipCardNumber={person?.membershipCardNumber} />
        </StyledCardBack>
      </StyledCardInner>
    </StyledCard>
  );
};

export default FlippableDigitalCard;
