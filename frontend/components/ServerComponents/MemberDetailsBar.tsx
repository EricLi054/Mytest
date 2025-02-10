import { Grid, Typography } from '@mui/material';
import CldImage from '../ClientComponents/CldImage';
import CopyButton from '../ClientComponents/CopyButton';
import InternalContentfulButton from './ContentfulButton/InternalContentfulButton';
import { StyledBackgroundContainer } from '../StyledComponents/MemberDetailsBar.styled';
import { type EngineeredJourneyProps } from '@/types/EngineeredJourneyProps';
import { type PersonInformation } from '@/types/backendTypes/personInformation';
import { type DigitalCardDetails } from '@/types/backendTypes/digitalCardDetails';
import DigitalCard from '../ClientComponents/DigitalCard/DigitalCard';
import hasActiveDigitalCard from '@/utilities/checkDigitalCardStatus';

function renderMemberCard(
  person: PersonInformation | undefined,
  cardDetails: DigitalCardDetails | undefined,
  storageKey: string
) {
  const imageSrc = person?.cardColour ? `myRAC/card-${person?.cardColour}-No-Text` : 'myRAC/card-None';
  if (!cardDetails || !hasActiveDigitalCard(cardDetails)) {
    return (
      <Grid
        item
        width={{ xs: '73px', md: '98px' }}
        height='fit-content'
        style={{ aspectRatio: '3/2', position: 'relative' }}
      >
        <CldImage
          fill
          src={imageSrc}
          alt={imageSrc}
          style={{ borderRadius: 3 }}
          googleAnalyticsDescription='Digital card icon click'
          data-testid='digital-card-icon'
        />
        ;
      </Grid>
    );
  }

  return <DigitalCard cardDetails={cardDetails} person={person} storageKey={storageKey} />;
}

const MemberDetailsBar = ({ person, digitalCardDetails, engineeredContent }: EngineeredJourneyProps) => {
  return (
    <StyledBackgroundContainer container justifyContent='center'>
      <Grid container flexWrap='nowrap' direction={{ xs: 'column', md: 'row' }} gap={{ xs: 2, md: 3 }}>
        <Grid item flexGrow={1}>
          <Grid container direction={{ xs: 'row-reverse', md: 'row' }} gap={4} flexWrap='nowrap'>
            {renderMemberCard(
              person,
              digitalCardDetails,
              engineeredContent
                ? (engineeredContent?.getById('digital-card-promo-storage-key')?.stringContent ?? '')
                : ''
            )}
            <Grid item color='white' flexGrow={1} alignContent='center'>
              <Typography variant='h3' color='inherit'>
                {person?.title} {person?.firstName && person?.firstName.length > 0 ? person?.firstName[0] : ''}{' '}
                {person?.surname}
              </Typography>
              {person?.cardColour !== 'None' && (
                <Grid container gap={0.5} direction={{ xs: 'column', md: 'row' }} pt={1}>
                  <Typography variant='body1'>{person?.cardColour} member </Typography>
                  <CopyButton text={person?.racId} />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item width={{ xs: '100%', md: '130px' }} alignSelf='center'>
          <InternalContentfulButton
            longText='Profile'
            link='/myrac/profile'
            colour='secondary'
            border={true}
            icon='user'
            variant='CTA Transparent'
            gavalue='Digital card - Profile button click'
          />
        </Grid>
      </Grid>
    </StyledBackgroundContainer>
  );
};

export default MemberDetailsBar;
