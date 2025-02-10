'use client';
import { Grid, Typography, Button } from '@mui/material';
import { colors } from '@racwa/styles';
import { StyledLink } from '../StyledComponents/Link.styled';
import { useRouter } from 'next/navigation';
import requestPhysicalCardHandler, {
  type RequestPhysicalCardResponse
} from '@/components/DataDrivenForm/handlers/requestPhysicalCardHandler';
import { errorPage } from '@/utilities/errorPage';
import { useLoadingContext } from './Loading/LoadingContext';
import { logEvent } from '@/utilities/analyticsTagging';
import { type EngineeredJourneyProps } from '@/types/EngineeredJourneyProps';
import { useEffect, useState } from 'react';

const cardRequestSuccessUrl = '/myrac/profile/membership/request-a-card/card-request-sent';
const getUpdateDetailsURL = () => `/myrac/update-my-details?return_url=${encodeURIComponent(window.location.href)}`;

const CardRequestForm = ({ unmaskedAddress }: EngineeredJourneyProps) => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const { openLoadingIndicator, closeLoadingIndicator } = useLoadingContext();

  useEffect(() => {
    // Closed loading indicator on component unmount
    // To prevent delay between loading screen closing and route changing
    return () => {
      closeLoadingIndicator();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateAddress = () => {
    logEvent('Update address in your contact details');
  };

  const handleRequestCard = async () => {
    try {
      setSubmitted(true);
      logEvent('Request card');
      openLoadingIndicator('Requesting your plastic card…');
      const result = await requestPhysicalCardHandler();

      if (isDuplicateCardOrderedError(result)) {
        router.push(errorPage.physicalCardAlreadyOrdered);
        return;
      }

      if (isGenericError(result)) {
        router.push(errorPage.unhandledError);
        return;
      }

      router.push(cardRequestSuccessUrl);
    } catch (e) {
      router.push(errorPage.unhandledError);
    }
  };

  return (
    <Grid container direction='column'>
      <Grid item>
        <Grid container direction='column' gap={1}>
          <Grid item>
            <Typography color={colors.dieselDeepest} variant='h5'>
              Your mailing address
            </Typography>
          </Grid>
          <Grid item>
            <Typography color={colors.dieselDeepest} variant='h4' fontSize={'1.5rem'}>
              {unmaskedAddress?.formattedAddress || 'No Address Specified'}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item pt={3}>
        <Typography variant='body1' color={colors.dieselDeeper}>
          Update address in your{' '}
          <StyledLink
            href={getUpdateDetailsURL()}
            onClick={handleUpdateAddress}
            sx={{ pointerEvents: submitted ? 'none' : 'all' }}
          >
            contact details
          </StyledLink>
          .
        </Typography>
      </Grid>

      <Grid item pt={'40px'}>
        <Button color='primary' fullWidth onClick={handleRequestCard} disabled={submitted}>
          Request card
        </Button>
      </Grid>
    </Grid>
  );
};

const isDuplicateCardOrderedError = (response: RequestPhysicalCardResponse) =>
  response?.data?.errors?.some((e) => 'errorCode' in e && e.errorCode === 'BadRequest') || false;

const isGenericError = (response: RequestPhysicalCardResponse) =>
  !response.ok || !response?.data?.physicalCardResponse?.isSuccess;

export default CardRequestForm;
