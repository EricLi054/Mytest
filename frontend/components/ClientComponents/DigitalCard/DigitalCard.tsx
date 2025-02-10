'use client';

import { type DigitalCardDetails } from '@/types/backendTypes/digitalCardDetails';
import { Grid, Typography } from '@mui/material';
import CldImage from '../CldImage';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useModalContext } from '../Modal/ModalContext';
import { colors } from '@racwa/styles';
import { useDeviceDetection } from '../Hooks/useDeviceDetection';
import QRCodeModalContent from './QRCodeModalContent';
import { useEffect, useState } from 'react';
import FontAwesomeIcon from '../FontAwesomeIcon';
import DigitalCardModalContent from './DigitalCardModalContent';
import { type PersonInformation } from '@/types/backendTypes/personInformation';
import PromotionalTooltip from './PromotionalTooltip';
import { logEvent } from '@/utilities/analyticsTagging';

export interface DigitalCardProps {
  person?: PersonInformation;
  cardDetails: DigitalCardDetails;
  storageKey?: string;
}

interface DigitalPassCookie {
  count: number;
  lastShown: string;
}

const backgroundColorMap: Record<string, string> = {
  Silver: '#9C9D9C',
  Red: '#F6695E'
};

const DigitalCard = ({ cardDetails, person, storageKey = '' }: DigitalCardProps) => {
  const { openModal, closeModalWithEvent } = useModalContext();
  const { isMobile, isTablet, isDesktop } = useDeviceDetection();
  const [promoCount, setPromoCount] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    const showPromoMessaging = async () => {
      if (cardDetails.value.numberOfPassesInstalled === 0) {
        const storedValue = localStorage.getItem(storageKey);

        if (!storedValue) {
          // On first login show tooltip
          setTooltipOpen(true);
        } else {
          try {
            // Show tooltip if they've only seen it once on a different day
            const cookieValue: DigitalPassCookie = JSON.parse(storedValue);
            setPromoCount(cookieValue.count);
            if (cookieValue.count < 2 && new Date().toDateString() !== cookieValue.lastShown) {
              setTooltipOpen(true);
            }
          } catch (e) {
            console.debug("Couldn't check promo cookie");
          }
        }
      }
    };

    if (storageKey) {
      void showPromoMessaging();
    }
  }, [cardDetails.value.numberOfPassesInstalled, storageKey]);

  const closeTooltip = () => {
    localStorage.setItem(storageKey, JSON.stringify({ count: promoCount + 1, lastShown: new Date().toDateString() }));
    setTooltipOpen(false);
  };

  const onDigitalCardClick = async () => {
    logEvent('Digital card icon click');
    closeTooltip();

    if (isDesktop || isTablet) {
      openModal(
        'Get your digital card now',
        <QRCodeModalContent digitalCardUrl={cardDetails.value.digitalCardPassUrl} />,
        () => {
          closeModalWithEvent('Digital card desktop modal - Close');
        }
      );
    } else if (isMobile) {
      openModal(
        '',
        <DigitalCardModalContent person={person} addToWalletUrl={cardDetails.value.digitalCardPassUrl} />,
        () => {
          closeModalWithEvent('Digital card mobile modal - Close');
        },
        true
      );
    }
  };

  const imageSrc = person?.cardColour ? `myRAC/card-${person.cardColour}-No-Text` : 'myRAC/card-None';

  return (
    <PromotionalTooltip tooltipOpen={tooltipOpen} closeTooltip={closeTooltip}>
      <Grid
        item
        width={{ xs: '120px', md: '144px' }}
        height='fit-content'
        position='relative'
        sx={{ aspectRatio: '3/2', cursor: 'pointer' }}
        onClick={onDigitalCardClick}
      >
        <CldImage fill src={imageSrc} alt={imageSrc} style={{ borderRadius: 8 }} />
        <Typography
          borderRadius='2px'
          variant='body2'
          marginLeft='8px'
          marginBottom='5.9px'
          position='absolute'
          bottom={0}
          textAlign='center'
          fontWeight='400'
          fontSize={{ xs: '14px', md: '18px' }}
          color={person?.cardColour === 'Blue' ? colors.white : colors.dieselDeepest}
          bgcolor={backgroundColorMap[person?.cardColour as string] ?? 'transparent'}
          padding='1px 4px'
        >
          <FontAwesomeIcon icon={faEye} style={{ marginRight: 4 }} />
          Digital card
        </Typography>
      </Grid>
    </PromotionalTooltip>
  );
};

export default DigitalCard;
