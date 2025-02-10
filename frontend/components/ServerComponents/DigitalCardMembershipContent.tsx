import { type DigitalCardDetails } from '@/types/backendTypes/digitalCardDetails';
import { type PersonInformation } from '@/types/backendTypes/personInformation';
import { Grid, Stack, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import createEngineeredContentComponent from '@/utilities/createEngineeredContentComponent';
import { type EngineeredContentCollection } from '@/types/EngineeredJourneyProps';
import DigitalCardFront from '../ClientComponents/DigitalCard/DigitalCardFront';
import DigitalCardMembershipButtonContent from '../ClientComponents/DigitalCard/DigitalCardMembershipButtonContent';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const DigitalCardMembershipContent = ({
  person,
  digitalCardDetails,
  engineeredContent,
  displayRequestCardLink
}: {
  person: PersonInformation;
  digitalCardDetails: DigitalCardDetails | undefined;
  engineeredContent: EngineeredContentCollection;
  displayRequestCardLink: boolean;
}) => {
  const RequestCardLink = createEngineeredContentComponent(
    'richText',
    'membership-request-card-link'
  )(engineeredContent);

  return (
    <Grid container gap='24px'>
      <Grid item width={{ xs: '100%', sm: '343px' }} data-testid='digital-card-front'>
        <DigitalCardFront person={person} googleAnalyticsDescription='Digital card icon click' />
      </Grid>
      <Grid item gap='24px' display='flex' direction='column' textAlign='start'>
        <Grid container direction='column' textAlign='start'>
          <Typography fontWeight={400} fontSize='18px'>
            Get your digital card
          </Typography>
          <Grid item marginTop='8px'>
            {renderCheckText('Always in your phone.')}
            {renderCheckText('Easy to redeem discounts.')}
          </Grid>
          <Grid item marginTop='16px'>
            <DigitalCardMembershipButtonContent digitalCardDetails={digitalCardDetails} />
          </Grid>
        </Grid>
        <Grid item display='flex' alignContent='flex-start'>
          {displayRequestCardLink && <RequestCardLink />}
        </Grid>
      </Grid>
      <Grid />
    </Grid>
  );

  function renderCheckText(text: string) {
    return (
      <Stack direction='row' spacing={1} alignItems='center'>
        <FontAwesomeIcon size='sm' icon={faCheck} />
        <Typography fontWeight={300} fontSize='16px' lineHeight='26px'>
          {text}
        </Typography>
      </Stack>
    );
  }
};

export default DigitalCardMembershipContent;
