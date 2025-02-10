'use client';

import { Button, Grid } from '@mui/material';
import { useDeviceDetection } from '../Hooks/useDeviceDetection';
import { AddToAppleWalletButton, AddToGoogleWalletButton } from './AddToWalletButtons';
import { type DigitalCardDetails } from '@/types/backendTypes/digitalCardDetails';
import { useModalContext } from '../Modal/ModalContext';
import QRCodeModalContent from './QRCodeModalContent';
import { logEvent } from '@/utilities/analyticsTagging';

const DigitalCardMembershipButtonContent = ({
  digitalCardDetails
}: {
  digitalCardDetails: DigitalCardDetails | undefined;
}) => {
  const { openModal, closeModalWithEvent } = useModalContext();
  const { isDesktop, isTablet, isMobile } = useDeviceDetection();

  if (!digitalCardDetails) {
    console.error('No digital card details provided to DigitalCardMembershipButtonComponent');
    return null;
  }

  function openDigitalCardModal(): void {
    if (!digitalCardDetails) return;
    if (isDesktop || isTablet) {
      logEvent('Find out more');
      openModal(
        'Get your digital card now',
        <QRCodeModalContent digitalCardUrl={digitalCardDetails.value.digitalCardPassUrl} />,
        () => {
          closeModalWithEvent('Digital card desktop modal - Close');
        }
      );
    }
  }

  function renderFindOutMoreButton() {
    return (
      <Button
        variant='contained'
        color='secondary'
        size='medium'
        sx={{ width: 'fit-content' }}
        onClick={openDigitalCardModal}
      >
        Find out more
      </Button>
    );
  }

  function render(digitalCardDetails: DigitalCardDetails) {
    if (!digitalCardDetails) return null;
    if (isDesktop || isTablet) {
      return renderFindOutMoreButton();
    } else if (isMobile) {
      return (
        <Grid item display='flex' justifyContent='center' gap={1}>
          <AddToAppleWalletButton
            href={digitalCardDetails.value.digitalCardPassUrl}
            googleAnalyticsDescription='Add to Apple Wallet'
          />
          <AddToGoogleWalletButton
            href={digitalCardDetails.value.digitalCardPassUrl}
            googleAnalyticsDescription='Add to Google Wallet'
          />
        </Grid>
      );
    }
  }

  return <>{render(digitalCardDetails)}</>;
};

export default DigitalCardMembershipButtonContent;
