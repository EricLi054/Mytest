'use client';
import { GenericErrorComponent } from '@/components/ClientComponents/GenericErrorComponent';
import { StyledLink } from '@/components/StyledComponents/Link.styled';
import { logEvent } from '@/utilities/analyticsTagging';
import { Button, Typography } from '@mui/material';
import { colors } from '@racwa/styles';

const logPhoneCallEvent = () => {
  logEvent('Error page - Call Us');
};
export default function Error() {
  return (
    <GenericErrorComponent>
      <Typography color={colors.dieselDeeper} variant='body1'>
        Please try again later or call us on{' '}
        <StyledLink href='tel:131703' onClick={logPhoneCallEvent}>
          13 17 03
        </StyledLink>
        .
      </Typography>
      <Button variant='contained' color='primary' href='/myRAC' size='medium'>
        Back to myRAC
      </Button>
    </GenericErrorComponent>
  );
}
