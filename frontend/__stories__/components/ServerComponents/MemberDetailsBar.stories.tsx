import { ModalProvider } from '@/components/ClientComponents/Modal/ModalProvider';
import MemberDetailsBar from '@/components/ServerComponents/MemberDetailsBar';
import { type DigitalCardDetails } from '@/types/backendTypes/digitalCardDetails';
import { type PersonInformation } from '@/types/backendTypes/personInformation';
import { Grid } from '@mui/material';

export default {
  title: 'Components/Server Components/Member Details Bar',
  component: MemberDetailsBar,
  tags: ['autodocs']
};

const getPerson = (cardColour: string, tier: string): PersonInformation => {
  return {
    title: 'Mr',
    firstName: 'Test',
    surname: 'Tester',
    racId: '12345678',
    cardColour,
    tier,
    membershipCardNumber: '1234567890123456'
  };
};

const getDigitalCardDetails = (): DigitalCardDetails => {
  return {
    isSuccess: true,
    value: {
      digitalCardPassId: '12345',
      digitalCardPassIsActive: true,
      digitalCardPassUrl: 'https://digital-card-link',
      numberOfPassesInstalled: 0
    },
    errors: null
  };
};

export const MemberDetailsBlue = () => {
  return (
    <Grid height='100%' marginTop={10}>
      <MemberDetailsBar person={getPerson('Blue', 'Blue')} />
    </Grid>
  );
};

export const MemberDetailsRed = () => {
  return (
    <Grid height='100%' marginTop={10}>
      <MemberDetailsBar person={getPerson('Red', 'Red')} />
    </Grid>
  );
};

export const MemberDetailsBronze = () => {
  return (
    <Grid height='100%' marginTop={10}>
      <MemberDetailsBar person={getPerson('Bronze', 'Bronze')} />
    </Grid>
  );
};

export const MemberDetailsSilver = () => {
  return (
    <Grid height='100%' marginTop={10}>
      <MemberDetailsBar person={getPerson('Silver', 'Silver')} />
    </Grid>
  );
};

export const MemberDetailsGold = () => {
  return (
    <Grid height='100%' marginTop={10}>
      <MemberDetailsBar person={getPerson('Gold', 'Staff')} />
    </Grid>
  );
};

export const MemberDetailsFree2Go = () => {
  return (
    <Grid height='100%' marginTop={10}>
      <MemberDetailsBar person={getPerson('Free2Go', 'Free2Go')} />
    </Grid>
  );
};

export const MemberDetailsRacIgnite = () => {
  return (
    <Grid height='100%' marginTop={10}>
      <MemberDetailsBar person={getPerson('RAC Ignite', 'RAC Ignite')} />
    </Grid>
  );
};

export const MemberDetailsGoldLife = () => {
  return (
    <Grid height='100%' marginTop={10}>
      <MemberDetailsBar person={getPerson('Gold Life', 'Gold')} />
    </Grid>
  );
};

export const MemberDetailsNone = () => {
  return (
    <Grid height='100%' marginTop={10}>
      <MemberDetailsBar person={getPerson('', 'None')} />
    </Grid>
  );
};

export const MemberDetailsDigitalCard = () => {
  return (
    <Grid height='100%' marginTop={10}>
      <ModalProvider>
        <MemberDetailsBar person={getPerson('Gold Life', 'Gold')} digitalCardDetails={getDigitalCardDetails()} />
      </ModalProvider>
    </Grid>
  );
};
