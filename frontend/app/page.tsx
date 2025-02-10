import { Grid } from '@mui/material';
import InternalButtonContainer from '@/components/ServerComponents/ButtonContainer/InternalButtonContainer';
import InternalContentfulButton from '@/components/ServerComponents/ContentfulButton/InternalContentfulButton';

export default function Home(): React.ReactElement {
  return (
    <Grid id='test-target' container direction='column' alignContent='center' padding={4}>
      <InternalButtonContainer stackTogether={true} gap={3} itemsPerRow={2} largeWidth={95} columnBreakpoint='sm'>
        <InternalContentfulButton
          longText='myRAC'
          shortText='/myrac'
          link='/myrac'
          icon='newspaper'
          variant='Profile Link'
        />
        <InternalContentfulButton
          longText='Profile'
          shortText='/myrac/profile'
          link='/myrac/profile'
          icon='network-wired'
          variant='Profile Link'
        />
        <InternalContentfulButton
          longText='Contact details'
          shortText='/myrac/profile/contact-details'
          link='/myrac/profile/contact-details'
          icon='user'
          variant='Profile Link'
        />
        <InternalContentfulButton
          longText='Membership'
          shortText='/myrac/profile/membership'
          link='/myrac/profile/membership'
          icon='id-card'
          variant='Profile Link'
        />
        <InternalContentfulButton
          longText='Request a card'
          shortText='/myrac/profile/membership/request-a-card'
          link='/myrac/profile/membership/request-a-card'
          icon='credit-card'
          variant='Profile Link'
        />
        <InternalContentfulButton
          longText='Request a card - Success'
          shortText='/myrac/profile/membership/request-a-card/card-request-sent'
          link='/myrac/profile/membership/request-a-card/card-request-sent'
          icon='circle-check'
          variant='Profile Link'
        />
        <InternalContentfulButton
          longText='Request a card - Error'
          shortText='myrac/profile/membership/request-a-card/card-already-requested'
          link='myrac/profile/membership/request-a-card/card-already-requested'
          icon='triangle-exclamation'
          variant='Profile Link'
        />
        <InternalContentfulButton
          longText='Membership lapsed'
          shortText='myrac/membership-lapsed'
          link='myrac/membership-lapsed'
          icon='triangle-exclamation'
          variant='Profile Link'
        />
        <InternalContentfulButton
          longText='Status'
          shortText='myrac/status'
          link='myrac/status'
          icon='triangle-exclamation'
          variant='Profile Link'
        />
      </InternalButtonContainer>
    </Grid>
  );
}
