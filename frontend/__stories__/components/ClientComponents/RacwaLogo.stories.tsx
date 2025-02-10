import RacwaLogo from '@/components/ClientComponents/RacwaLogo';
import { Grid, styled } from '@mui/material';

export default {
  title: 'Components/Client Components/RACWA Logo',
  component: RacwaLogo,
  tags: ['autodocs']
};
const StyledLogo = styled(RacwaLogo)(() => ({
  fontSize: '5rem'
}));
export const Default = () => {
  return (
    <Grid container flexDirection='column' alignItems='center' width='100%'>
      <RacwaLogo fontSize='small' />
      <RacwaLogo fontSize='medium' />
      <RacwaLogo fontSize='large' />
      <StyledLogo />
    </Grid>
  );
};
