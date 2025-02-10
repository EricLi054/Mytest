'use client';

import { Grid, Typography } from '@mui/material';
import { colors } from '@racwa/styles';
import { type DigitalCardFrontProps } from './DigitalCardFront';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import FlippableDigitalCard from './FlippableDigitalCard';
import { logEvent } from '@/utilities/analyticsTagging';
import useSwipe from '../Hooks/useSwipe';

export interface AnimatedDigitalCardProps extends DigitalCardFrontProps {}

const AnimatedDigitalCard: React.FC<AnimatedDigitalCardProps> = ({ person }) => {
  const [showBarcode, setShowBarcode] = useState(false);
  const toggleBarcode = (eventType: 'swipe' | 'click') => {
    if (eventType === 'click') {
      logEvent(
        showBarcode
          ? 'Digital card mobile modal - Hide barcode click'
          : 'Digital card mobile modal - Show barcode click'
      );
    } else if (eventType === 'swipe') {
      logEvent(
        showBarcode
          ? 'Digital card mobile modal - Swipe to hide barcode'
          : 'Digital card mobile modal - Swipe to show barcode'
      );
    }
    setShowBarcode(!showBarcode);
  };

  const touchProps = useSwipe({
    onSwipedLeft: () => {
      toggleBarcode('swipe');
    },
    onSwipedRight: () => {
      toggleBarcode('swipe');
    }
  });

  if (!person) {
    console.error('No person information provided to AnimatedDigitalCard');
    return null;
  }

  return (
    <Grid justifyContent='center' alignItems='center' display='flex' flexDirection='column' gap={1}>
      <Grid display='flex' flexDirection='column' gap={1}>
        <Grid>
          <FlippableDigitalCard
            showBarcode={showBarcode}
            person={person}
            {...(person?.membershipCardNumber ? touchProps : undefined)}
          />
        </Grid>
        {person?.membershipCardNumber && (
          <Grid display='flex' flexDirection='row' justifyContent='flex-end'>
            <Typography
              variant='body2'
              color={colors.linkBlue}
              width='100%'
              sx={{ cursor: 'pointer', fontWeight: 400, textAlign: 'right' }}
              onClick={() => {
                toggleBarcode('click');
              }}
            >
              <FontAwesomeIcon icon={showBarcode ? 'eye-slash' : 'eye'} style={{ marginRight: 4 }} />
              {showBarcode ? 'Hide barcode' : 'Show barcode'}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default AnimatedDigitalCard;
