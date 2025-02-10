'use client';

import { Grid, styled, Typography } from '@mui/material';
import { colors } from '@racwa/styles';
import { AddToAppleWalletButton, AddToGoogleWalletButton } from './AddToWalletButtons';
import { GALink } from '../GALink';
import { type PersonInformation } from '@/types/backendTypes/personInformation';
import AnimatedDigitalCard from './AnimatedDigitalCard';
import { useEffect } from 'react';
import { logEvent } from '@/utilities/analyticsTagging';

const StyledFooterLink = styled(GALink)(() => ({
  fontSize: '18px'
}));

export interface DigitalCardModalContentProps {
  person?: PersonInformation;
  addToWalletUrl?: string;
}
const DigitalCardModalContent: React.FC<DigitalCardModalContentProps> = ({ person, addToWalletUrl }) => {
  useEffect(() => {
    logEvent('Digital card mobile modal');
  }, []);

  if (!person) {
    console.error('No person information provided to DigitalCardModalContent');
    return null;
  }

  return (
    <Grid display='flex' flexGrow={1} direction='column' justifyContent='space-between'>
      <Grid></Grid> {/* Empty Grid - Required to get Modal content centered while FAQ's stay at bottom  */}
      <Grid container direction='column' flexWrap='nowrap' gap={5} textAlign='center' alignItems='center'>
        <Grid
          item
          display='flex'
          width={{
            xs: '275px',
            md: '100%'
          }}
          flexDirection='column'
          gap={1}
        >
          <Typography variant='h1' color={colors.dieselDeepest}>
            Your digital card
          </Typography>
          <Typography variant='body1' color={colors.dieselDeeper}>
            <strong>Use the barcode or set up your card in your digital wallet</strong>
          </Typography>
        </Grid>
        <AnimatedDigitalCard person={person} />
        {addToWalletUrl && (
          <Grid display='flex' justifyContent='center' gap={1}>
            <AddToAppleWalletButton
              href={addToWalletUrl}
              googleAnalyticsDescription='Digital card mobile modal - Add to Apple Wallet'
            />
            <AddToGoogleWalletButton
              href={addToWalletUrl}
              googleAnalyticsDescription='Digital card mobile modal - Add to Google Wallet'
            />
          </Grid>
        )}
        {/* Empty Grid - Required to get Gap added to end  */}
        <Grid></Grid>
      </Grid>
      <Grid textAlign='center'>
        <StyledFooterLink
          googleAnalyticsDescription='Digital card mobile modal - FAQ click'
          href='/myrac/help'
          target='_blank'
        >
          Frequently asked questions
        </StyledFooterLink>
      </Grid>
    </Grid>
  );
};

export default DigitalCardModalContent;
