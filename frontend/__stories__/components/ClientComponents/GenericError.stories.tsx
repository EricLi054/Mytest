import Error from '@/app/error/page';
import { GenericErrorComponent } from '@/components/ClientComponents/GenericErrorComponent';
import GenericErrorPage from '@/components/ClientComponents/GenericErrorPage';
import InternalContentfulButton from '@/components/ServerComponents/ContentfulButton/InternalContentfulButton';
import { StyledLink } from '@/components/StyledComponents/Link.styled';
import { Typography } from '@mui/material';

export default {
  title: 'Components/Client Components/Generic Error',
  component: GenericErrorComponent,
  tags: ['autodocs']
};

export const SomethingWentWrong = () => {
  return <GenericErrorPage />;
};

export const UnhandledError = () => {
  return <Error />;
};

export const MembershipLapsed = () => {
  return (
    <GenericErrorComponent heading='Sorry, your membership has lapsed' subHeading='To be a member...'>
      <Typography variant='body1'>
        You must have insurance, Roadside Assistance, a loan, security monitoring or a Rewards membership with us
      </Typography>
      <Typography variant='body1' fontWeight={400}>
        If you&apos;ve missed a payment or forgotten to renew, please call us on{' '}
        <StyledLink href='tel:131703'>13 17 03</StyledLink>.
      </Typography>
      <InternalContentfulButton variant='Icon CTA' longText='Go to RAC homepage' link='/' colour='primary' />
    </GenericErrorComponent>
  );
};
