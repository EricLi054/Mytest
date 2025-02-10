'use client';

import { type DigitalCardDetails } from '@/types/backendTypes/digitalCardDetails';
import { useDeviceDetection } from '../Hooks/useDeviceDetection';
import { useModalContext } from '../Modal/ModalContext';
import QRCodeModalContent from './QRCodeModalContent';
import { StyledLink } from '@/components/StyledComponents/Link.styled';
import { Grid } from '@mui/material';
import { AddToAppleWalletButton, AddToGoogleWalletButton } from './AddToWalletButtons';
import { GALink } from '../GALink';
import { logEvent } from '@/utilities/analyticsTagging';

interface PageImageTextCardAddToWalletProps {
  cardDetails: DigitalCardDetails;
}

export const PageImageTextCardAddToWallet = ({ cardDetails }: PageImageTextCardAddToWalletProps) => {
  const { isMobile, isTablet, isDesktop } = useDeviceDetection();
  const { openModal, closeModalWithEvent } = useModalContext();

  const openQRCodeModal = async () => {
    logEvent('Get a digital card now');
    openModal(
      'Get your digital card now',
      <QRCodeModalContent digitalCardUrl={cardDetails.value.digitalCardPassUrl} />,
      () => {
        closeModalWithEvent('Digital card desktop modal - Close');
      }
    );
  };

  if (isDesktop || isTablet) {
    return (
      <StyledLink href='' onClick={openQRCodeModal} sx={{ fontSize: 18 }}>
        Get a digital card now
      </StyledLink>
    );
  } else if (isMobile) {
    return (
      <Grid container direction='column' gap={{ xs: 3, sm: 1 }}>
        <Grid container direction='row' justifyContent={{ xs: 'center', sm: 'flex-start' }} gap={1}>
          <AddToAppleWalletButton
            href={cardDetails.value.digitalCardPassUrl}
            height={43}
            width={134}
            googleAnalyticsDescription='Add to Apple Wallet'
          />
          <AddToGoogleWalletButton
            href={cardDetails.value.digitalCardPassUrl}
            height={43}
            width={153}
            googleAnalyticsDescription='Add to Google Wallet'
          />
        </Grid>
        <GALink
          href='/myrac/help'
          sx={{ fontSize: 18 }}
          googleAnalyticsDescription='Frequently asked questions'
          target='_blank'
        >
          Frequently asked questions
        </GALink>
      </Grid>
    );
  } else {
    return false;
  }
};
