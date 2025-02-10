import InternalContentfulButton from '@/components/ServerComponents/ContentfulButton/InternalContentfulButton';
import { Grid } from '@mui/material';
import { colors } from '@racwa/styles';

export default {
  title: 'Components/Server Components/Contentful Button',
  component: InternalContentfulButton,
  tags: ['autodocs']
};

export const ProfileButton = () => {
  return (
    <Grid bgcolor={colors.dieselDeep} padding={2}>
      <InternalContentfulButton
        longText='Contact details'
        shortText='Including login details'
        link='#'
        icon='user'
        variant='Profile Link'
      />
    </Grid>
  );
};

export const CTATransparentButton = () => {
  return (
    <Grid bgcolor={colors.dieselDeep} padding={2}>
      <InternalContentfulButton
        longText='Profile'
        link='#'
        colour='secondary'
        border={true}
        icon='user'
        variant='CTA Transparent'
      />
    </Grid>
  );
};

export const RegularButton = () => {
  return (
    <Grid bgcolor={colors.dieselDeep} padding={2}>
      <InternalContentfulButton longText='Update your details' link='#' variant='Regular' />
    </Grid>
  );
};

export const ImageButton = () => {
  return (
    <Grid bgcolor={colors.dieselDeep} padding={2}>
      <InternalContentfulButton
        longText='Health Insurance'
        image='https://res.cloudinary.com/dltdv24vg/image/upload/f_auto/q_auto/v1696820471/myRAC/health-insurance_d9nk3j.svg'
        link='#'
        variant='Image'
      />
    </Grid>
  );
};

export const IconCTAButton = () => {
  return (
    <Grid bgcolor={colors.dieselDeep} padding={2}>
      <InternalContentfulButton
        longText='Get a quote'
        shortText='Quote'
        icon='certificate'
        colour='primary'
        link='#'
        variant='Icon CTA'
      />
    </Grid>
  );
};
