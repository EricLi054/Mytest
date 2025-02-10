import { Grid, Typography } from '@mui/material';
import { colors } from '@racwa/styles';
import { RacwaDivider } from '@/components/DataDrivenForm/dynamic-components/Divider/Divider';
import CopyButton from '@/components/ClientComponents/CopyButton';
import { TierBox } from '../ClientComponents/TierBox';
import { type EngineeredJourneyProps } from '@/types/EngineeredJourneyProps';
import { type PersonInformation } from '@/types/backendTypes/personInformation';
import { PageTemplateContainer } from './PageTemplateContainer';
import createEngineeredContentComponent from '@/utilities/createEngineeredContentComponent';
import CldImage from '../ClientComponents/CldImage';
import { HeadingWithLinkSection } from '../StyledComponents/PageTemplateHeader.styled';
import hasActiveDigitalCard from '@/utilities/checkDigitalCardStatus';
import DigitalCardMembershipContent from './DigitalCardMembershipContent';

// The exceptions map for images that do not have svg version.
const nonSvgImageMap: Record<string, string> = {
  'myRAC/card-RAC Ignite-v2': 'png'
};

const renderYourMembership = (person: PersonInformation) => {
  return (
    <Grid
      container
      direction='column'
      bgcolor={colors.white}
      padding={{ xs: '1.5rem 1rem', md: '2rem 1.5rem' }}
      textAlign='left'
      gap={3}
    >
      <Grid item>
        <Typography variant='h3' color={colors.dieselDeeper}>
          Your membership
        </Typography>
      </Grid>
      <Grid container direction='column' item color={colors.dieselDeepest} gap={0.5}>
        <Typography>Member number</Typography>
        <CopyButton text={person.racId} />
        <RacwaDivider />
        <Grid container direction='column' item gap={0.5}>
          <Typography>Tier</Typography>
          <TierBox person={person} />
        </Grid>
      </Grid>
    </Grid>
  );
};

function renderRequestPhysicalCard(
  person: PersonInformation,
  RequestCardLink: () => JSX.Element,
  displayRequestCardLink: boolean
) {
  const imageSrc = person?.cardColour ? `myRAC/card-${person?.cardColour}-v2` : 'myRAC/card-None';

  return (
    <>
      <Grid
        item
        position='relative'
        width={{ xs: '269px', md: '269px' }}
        sx={{
          aspectRatio: '3/2'
        }}
      >
        <CldImage
          fill
          format={nonSvgImageMap[imageSrc] ?? 'svg'}
          src={imageSrc}
          alt={imageSrc}
          style={{ borderRadius: 8 }}
          googleAnalyticsDescription='Digital card icon click'
          data-testid='digital-card-icon'
        />
      </Grid>
      {displayRequestCardLink && <RequestCardLink />}
    </>
  );
}

const EngineeredMembershipPage = ({ person, digitalCardDetails, engineeredContent }: EngineeredJourneyProps) => {
  if (!person || !engineeredContent) {
    return null;
  }

  const displayRequestCardLink = person.tier?.toLowerCase() !== 'rac ignite';

  const MembershipTitle = createEngineeredContentComponent('richText', 'membership-title')(engineeredContent);
  const RequestCardLink = createEngineeredContentComponent(
    'richText',
    'membership-request-card-link'
  )(engineeredContent);

  return (
    <PageTemplateContainer contentWidth={{ xs: '100%', md: '760px' }} spaceBetweenSections={7}>
      <HeadingWithLinkSection>
        <MembershipTitle />
      </HeadingWithLinkSection>
      <Grid container display='flex' gap={{ xs: '2rem', md: '1.5rem' }} direction={{ xs: 'column', md: 'row' }}>
        <Grid item width={{ xs: '100%', md: '466px' }}>
          {renderYourMembership(person)}
        </Grid>
        <Grid
          item
          display='flex'
          gap='1.5rem'
          flexDirection='column'
          alignItems='center'
          width={{ xs: '100%', md: '269px' }}
        >
          {hasActiveDigitalCard(digitalCardDetails) ? (
            <DigitalCardMembershipContent
              person={person}
              digitalCardDetails={digitalCardDetails}
              engineeredContent={engineeredContent}
              displayRequestCardLink={displayRequestCardLink}
            />
          ) : (
            renderRequestPhysicalCard(person, RequestCardLink, displayRequestCardLink)
          )}
        </Grid>
      </Grid>
    </PageTemplateContainer>
  );
};

export default EngineeredMembershipPage;
