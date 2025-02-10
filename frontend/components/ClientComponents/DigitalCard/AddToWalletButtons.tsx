'use client';

import Link from 'next/link';
import CldImage from '../CldImage';
import { logEvent } from '@/utilities/analyticsTagging';

const addToGoogleUrl = 'https://res.rac.com.au/image/upload/v1729760515/myRAC/add-to-google-wallet-badge_a2ugqg.svg';
const addToAppleUrl = 'https://res.rac.com.au/image/upload/v1729760515/myRAC/add-to-apple-wallet-badge_dgwtet.svg';

export interface AddToWalletProps {
  href: string;
  googleAnalyticsDescription?: string;
  height?: number;
  width?: number;
}

export const AddToAppleWalletButton: React.FC<AddToWalletProps> = ({
  href,
  googleAnalyticsDescription,
  height = 48,
  width = 152
}) => {
  return (
    <Link
      onClick={() => {
        if (googleAnalyticsDescription) logEvent(googleAnalyticsDescription);
      }}
      href={href}
      target='_blank'
    >
      <CldImage height={height} width={width} format='svg' src={addToAppleUrl} alt='Add to Apple Wallet' />
    </Link>
  );
};

export const AddToGoogleWalletButton: React.FC<AddToWalletProps> = ({
  href,
  googleAnalyticsDescription,
  height = 48,
  width = 172
}) => {
  return (
    <Link
      onClick={() => {
        if (googleAnalyticsDescription) logEvent(googleAnalyticsDescription);
      }}
      href={href}
      target='_blank'
    >
      <CldImage height={height} width={width} format='svg' src={addToGoogleUrl} alt='Add to Google Wallet' />
    </Link>
  );
};
