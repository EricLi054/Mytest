import { Typography } from '@mui/material';
import { GALink } from '../ClientComponents/GALink';
import { colors } from '@racwa/styles';
import createContentComponent from '@/utilities/createEngineeredContentComponent';

export const HeaderIcon = createContentComponent('icon', 'card-success-heading-icon');
export const HeaderText = createContentComponent('richText', 'card-success-heading');
export const OnlineShopCardIcon = createContentComponent('icon', 'card-success-online-shop-card-icon');
export const OnlineShopCardTitle = createContentComponent('string', 'card-success-online-shop-card-title');
export const OnlineShopCardContent = createContentComponent('richText', 'card-success-online-shop-card-content');
export const DigitalCardTitle = createContentComponent('string', 'card-success-digital-promo-card-title');
export const DigitalCardContent = createContentComponent('string', 'card-success-digital-promo-card-content');
export const DigitalCardImage = createContentComponent('image', 'card-success-digital-promo-card-image', {
  format: 'svg'
});
export const CardSuccessMyRACButton = createContentComponent('richText', 'card-success-footer-button-myrac');
export const CardSuccessProfileButton = createContentComponent('richText', 'card-success-footer-button-profile');

// Refactor inline content when we extend Richtext content to handle GALinks
export const OnlineShopCardContentInline = () => (
  <Typography variant='body1' color={colors.dieselDeep}>
    You can still redeem discounts in the{' '}
    <GALink
      longLinkText='online shop'
      googleAnalyticsDescription='Redeem discounts in the online shop'
      href='https://store.rac.com.au'
      target='_blank'
    />{' '}
    using your member number.
  </Typography>
);
