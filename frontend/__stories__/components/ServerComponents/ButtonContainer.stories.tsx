import InternalButtonContainer from '@/components/ServerComponents/ButtonContainer/InternalButtonContainer';
import InternalContentfulButton from '@/components/ServerComponents/ContentfulButton/InternalContentfulButton';
import { Grid } from '@mui/material';

export default {
  title: 'Components/Server Components/Button Container',
  component: InternalButtonContainer,
  tags: ['autodocs']
};

export const ProfileButtons = () => {
  return (
    <InternalButtonContainer stackTogether={true} gap={3} itemsPerRow={2} largeWidth={95} columnBreakpoint='sm'>
      <InternalContentfulButton
        longText='Contact details'
        shortText='Including login details'
        link='#'
        icon='user'
        variant='Profile Link'
      />
      <InternalContentfulButton
        longText='Membership'
        shortText='Card and details'
        link='#'
        icon='id-card'
        variant='Profile Link'
      />
    </InternalButtonContainer>
  );
};

export const MyRACOtherTasks = () => {
  return (
    <Grid textAlign='center'>
      <InternalButtonContainer stackTogether={false} gap={2} itemsPerRow={4} largeWidth={120} columnBreakpoint='md'>
        <InternalContentfulButton longText='Update your details' link='#' variant='Regular' />
        <InternalContentfulButton longText='View your member benefits' link='#' variant='Regular' />
        <InternalContentfulButton longText='Get help with myRAC' link='#' variant='Regular' />
        <InternalContentfulButton longText='Visit our online shop' link='#' variant='Regular' />
      </InternalButtonContainer>
    </Grid>
  );
};
