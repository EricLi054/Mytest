import DigitalCardFrontFace, {
  type DigitalCardFrontProps
} from '@/components/ClientComponents/DigitalCard/DigitalCardFront';
import DigitalCardBackFace, {
  type DigitalCardBackProps
} from '@/components/ClientComponents/DigitalCard/DigitalCardBack';
import { Grid } from '@mui/material';
import FlippableDigitalCard from '@/components/ClientComponents/DigitalCard/FlippableDigitalCard';
import { useState } from 'react';
import { StyledLink } from '@/components/StyledComponents/Link.styled';

export default {
  title: 'Components/Client Components/Digital Member Card',
  component: DigitalCardFrontFace,
  tags: ['autodocs']
};

const cardFrontProps: DigitalCardFrontProps = {
  person: {
    membershipCardNumber: '2870603304236123',
    tier: 'Gold Life',
    racId: '018282922',
    title: 'Ms',
    firstName: 'Fiona',
    surname: 'Citizen',
    cardColour: 'Gold'
  }
};
const cardBackProps: DigitalCardBackProps = { membershipCardNumber: '2870603304236123' };

export const DigitalCard = () => {
  return (
    <Grid container display='flex' flexDirection='row' gap={2}>
      <Grid width='343px'>
        <DigitalCardFrontFace {...cardFrontProps} />
      </Grid>
      <Grid width='343px'>
        <DigitalCardBackFace {...cardBackProps} />
      </Grid>
    </Grid>
  );
};

export const DigitalCardFront = () => {
  return (
    <Grid marginTop={10} display='flex' width='343px' justifyContent='center'>
      <DigitalCardFrontFace {...cardFrontProps} />
    </Grid>
  );
};

export const DigitalCardBack = () => {
  return (
    <Grid marginTop={10} display='flex' width='343px' justifyContent='center'>
      <DigitalCardBackFace {...cardBackProps} />
    </Grid>
  );
};

export const FlippableDigitalMemberCard = () => {
  const [showBarcode, setShowbarcode] = useState(false);
  const toggleBarcode = () => {
    setShowbarcode((value) => !value);
  };
  return (
    <Grid marginTop={10} display='flex' justifyContent='center' alignItems='center' flexDirection={'column'} gap={3}>
      <StyledLink href='' onClick={toggleBarcode}>
        Click on the card to flip
      </StyledLink>
      <FlippableDigitalCard showBarcode={showBarcode} person={{ ...cardFrontProps.person }} />
    </Grid>
  );
};
